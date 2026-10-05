package com.optigym.verification;

import java.security.SecureRandom;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class EmailVerificationService {

  private final JdbcTemplate db;
  private final JavaMailSender sender;
  private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(10);
  private final SecureRandom random = new SecureRandom();

  @Value("${app.mail.from}")
  private String from;

  public EmailVerificationService(JdbcTemplate db, JavaMailSender sender) {
    this.db = db;
    this.sender = sender;
  }

  // Caller owns the registration transaction, so failed SMTP delivery rolls back the new account.
  public void issueNew(long userId, String email) {
    String code = String.format(Locale.ROOT, "%06d", random.nextInt(1_000_000));
    db.update(
      "INSERT INTO email_verifications(user_id,code_hash,expires_at,sent_at,window_start,sends_window) VALUES(?,?,now()+interval '10 minutes',now(),now(),1)",
      userId,
      encoder.encode(code)
    );
    send(email, code);
  }

  private void send(String email, String code) {
    SimpleMailMessage msg = new SimpleMailMessage();
    msg.setFrom(from);
    msg.setTo(email);
    msg.setSubject("OptiGym - Ma xac thuc email");
    msg.setText(
      "Ma xac thuc OptiGym cua ban: " +
        code +
        "\nMa co hieu luc 10 phut. Neu ban khong yeu cau, hay bo qua email nay."
    );
    try {
      sender.send(msg);
    } catch (MailException e) {
      throw new ResponseStatusException(
        HttpStatus.SERVICE_UNAVAILABLE,
        "Không gửi được email. Kiểm tra SMTP hoặc thử lại sau."
      );
    }
  }

  @Transactional
  public Map<String, Object> resend(String address) {
    String email = address.trim().toLowerCase(Locale.ROOT);
    List<Map<String, Object>> users = db.queryForList(
      "SELECT id,email_verified FROM users WHERE email=? FOR UPDATE",
      email
    );
    if (
      users.isEmpty() || Boolean.TRUE.equals(users.get(0).get("email_verified"))
    ) return Map.of(
      "message",
      "Nếu email còn chờ xác thực, mã mới sẽ được gửi."
    );
    long id = ((Number) users.get(0).get("id")).longValue();
    List<Map<String, Object>> rows = db.queryForList(
      "SELECT sent_at>now()-interval '60 seconds' AS cooldown,window_start>now()-interval '1 hour' AS same_window,sends_window FROM email_verifications WHERE user_id=?",
      id
    );
    if (!rows.isEmpty()) {
      Map<String, Object> v = rows.get(0);
      if (
        Boolean.TRUE.equals(v.get("cooldown"))
      ) throw new ResponseStatusException(
        HttpStatus.TOO_MANY_REQUESTS,
        "Chờ 60 giây trước khi gửi lại."
      );
      if (
        Boolean.TRUE.equals(v.get("same_window")) &&
        ((Number) v.get("sends_window")).intValue() >= 5
      ) throw new ResponseStatusException(
        HttpStatus.TOO_MANY_REQUESTS,
        "Đã gửi quá 5 lần trong một giờ. Hãy thử lại sau."
      );
    }
    String code = String.format(Locale.ROOT, "%06d", random.nextInt(1_000_000));
    db.update(
      "INSERT INTO email_verifications(user_id,code_hash,expires_at,sent_at,attempts,window_start,sends_window) VALUES(?,?,now()+interval '10 minutes',now(),0,now(),1) ON CONFLICT(user_id) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,sent_at=excluded.sent_at,attempts=0,window_start=CASE WHEN email_verifications.window_start>now()-interval '1 hour' THEN email_verifications.window_start ELSE now() END,sends_window=CASE WHEN email_verifications.window_start>now()-interval '1 hour' THEN email_verifications.sends_window+1 ELSE 1 END",
      id,
      encoder.encode(code)
    );
    send(email, code);
    return Map.of("message", "Nếu email còn chờ xác thực, mã mới sẽ được gửi.");
  }

  @Transactional
  public ResponseEntity<Map<String, String>> verify(
    String address,
    String code
  ) {
    String email = address.trim().toLowerCase(Locale.ROOT);
    if (!code.matches("[0-9]{6}")) return ResponseEntity.badRequest().body(
      Map.of("message", "Mã phải gồm 6 chữ số.")
    );
    List<Map<String, Object>> users = db.queryForList(
      "SELECT id,role,email_verified FROM users WHERE email=? FOR UPDATE",
      email
    );
    if (
      users.isEmpty() || Boolean.TRUE.equals(users.get(0).get("email_verified"))
    ) return ResponseEntity.badRequest().body(
      Map.of("message", "Tài khoản không còn chờ xác thực.")
    );
    long id = ((Number) users.get(0).get("id")).longValue();
    List<Map<String, Object>> rows = db.queryForList(
      "SELECT code_hash,expires_at>now() AS valid,attempts FROM email_verifications WHERE user_id=?",
      id
    );
    if (
      rows.isEmpty() || !Boolean.TRUE.equals(rows.get(0).get("valid"))
    ) return ResponseEntity.badRequest().body(
      Map.of("message", "Mã đã hết hạn. Hãy yêu cầu mã mới.")
    );
    Map<String, Object> row = rows.get(0);
    if (
      ((Number) row.get("attempts")).intValue() >= 5
    ) return ResponseEntity.status(429).body(
      Map.of("message", "Đã nhập sai quá 5 lần. Hãy yêu cầu mã mới.")
    );
    if (!encoder.matches(code, (String) row.get("code_hash"))) {
      db.update(
        "UPDATE email_verifications SET attempts=attempts+1 WHERE user_id=?",
        id
      );
      return ResponseEntity.badRequest().body(
        Map.of("message", "Mã không đúng.")
      );
    }
    db.update("UPDATE users SET email_verified=true WHERE id=?", id);
    db.update("DELETE FROM email_verifications WHERE user_id=?", id);
    String message = "PT".equals(users.get(0).get("role"))
      ? "Email đã xác thực. Tài khoản PT đang chờ admin duyệt."
      : "Email đã xác thực. Bạn có thể đăng nhập.";
    return ResponseEntity.ok(Map.of("message", message));
  }
}

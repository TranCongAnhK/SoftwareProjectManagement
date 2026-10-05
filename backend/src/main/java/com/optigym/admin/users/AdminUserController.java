package com.optigym.admin.users;

import static com.optigym.shared.web.RequestValues.bad;
import static com.optigym.shared.web.RequestValues.str;

import com.optigym.shared.security.SessionSecurity;
import com.optigym.verification.EmailVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AdminUserController {

  private final JdbcTemplate db;
  private final EmailVerificationService verification;
  private final SessionSecurity security;
  private final BCryptPasswordEncoder passwords = new BCryptPasswordEncoder(12);

  public AdminUserController(
    JdbcTemplate db,
    EmailVerificationService verification,
    SessionSecurity security
  ) {
    this.db = db;
    this.verification = verification;
    this.security = security;
  }

  @GetMapping("/admin/users")
  public List<Map<String, Object>> users(
    @RequestParam(defaultValue = "MEMBER") String role,
    HttpServletRequest req
  ) {
    security.admin(req);
    if (!List.of("MEMBER", "PT").contains(role)) bad("Vai trò không hợp lệ");
    return db.queryForList(
      "SELECT id,name,email,role,status,email_verified,phone,specialty,created_at FROM users WHERE role=? ORDER BY id DESC",
      role
    );
  }

  @Transactional
  @PostMapping("/admin/members")
  public Map<String, Object> addMember(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    String name = str(b, "name"),
      email = str(b, "email").toLowerCase(Locale.ROOT),
      pass = Objects.toString(b.getOrDefault("password", ""), ""),
      phone = str(b, "phone");
    if (
      name.length() < 2 ||
      name.length() > 120 ||
      !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$") ||
      pass.length() < 8 ||
      phone.length() > 30
    ) bad("Tên, email hoặc mật khẩu không hợp lệ");
    try {
      db.update(
        "INSERT INTO users(name,email,password_hash,role,status,phone,email_verified) VALUES(?,?,?,'MEMBER','ACTIVE',?,false)",
        name,
        email,
        passwords.encode(pass),
        phone
      );
    } catch (DuplicateKeyException e) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Email đã tồn tại"
      );
    }
    long id = db.queryForObject(
      "SELECT id FROM users WHERE email=?",
      Long.class,
      email
    );
    verification.issueNew(id, email);
    return Map.of("message", "Đã tạo hội viên và gửi mã xác thực đến email.");
  }

  @PatchMapping("/admin/users/{id}")
  public Map<String, Object> updateUser(
    @PathVariable long id,
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    String name = str(b, "name"),
      phone = str(b, "phone"),
      specialty = str(b, "specialty").toUpperCase(Locale.ROOT),
      status = str(b, "status").toUpperCase(Locale.ROOT);
    if (
      name.length() < 2 ||
      name.length() > 120 ||
      phone.length() > 30 ||
      !List.of("ACTIVE", "PENDING", "REJECTED", "DISABLED").contains(status)
    ) bad("Dữ liệu không hợp lệ");
    List<Map<String, Object>> rows = db.queryForList(
      "SELECT role,email,email_verified FROM users WHERE id=?",
      id
    );
    if (
      rows.isEmpty() || "ADMIN".equals(rows.get(0).get("role"))
    ) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    String role = (String) rows.get(0).get("role");
    String email = b.containsKey("email")
      ? str(b, "email").toLowerCase(Locale.ROOT)
      : (String) rows.get(0).get("email");
    if (!email.equals(rows.get(0).get("email"))) bad(
      "Đổi email cần luồng xác thực riêng."
    );
    if (role.equals("MEMBER") && status.equals("PENDING")) bad(
      "Trạng thái không hợp lệ"
    );
    if (
      role.equals("PT") &&
      status.equals("ACTIVE") &&
      !Boolean.TRUE.equals(rows.get(0).get("email_verified"))
    ) bad("PT phải xác thực email trước khi được duyệt");
    if (
      role.equals("PT") && !List.of("GYM", "YOGA", "BOXING").contains(specialty)
    ) bad("Chuyên môn không hợp lệ");
    int n;
    try {
      n = db.update(
        "UPDATE users SET name=?,email=?,phone=?,specialty=?,status=? WHERE id=?",
        name,
        email,
        phone,
        role.equals("PT") ? specialty : "",
        status,
        id
      );
    } catch (DuplicateKeyException e) {
      throw new ResponseStatusException(
        HttpStatus.CONFLICT,
        "Email đã tồn tại"
      );
    }
    if (!status.equals("ACTIVE")) db.update(
      "DELETE FROM sessions WHERE user_id=?",
      id
    );
    return Map.of("updated", n);
  }

  @DeleteMapping("/admin/users/{id}")
  public Map<String, Object> deleteUser(
    @PathVariable long id,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    int n = db.update("DELETE FROM users WHERE id=? AND role<>'ADMIN'", id);
    if (n == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    return Map.of("deleted", n);
  }
}

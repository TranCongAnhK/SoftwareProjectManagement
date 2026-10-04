package com.optigym.shared.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.server.ResponseStatusException;

@org.springframework.stereotype.Component
public class SessionSecurity {

  private final JdbcTemplate db;
  private final SecureRandom random = new SecureRandom();

  @Value("${APP_SECURE_COOKIE:false}")
  private boolean secureCookie;

  public SessionSecurity(JdbcTemplate db) {
    this.db = db;
  }

  public static String hash(String token) {
    try {
      byte[] bytes = MessageDigest.getInstance("SHA-256").digest(
        token.getBytes(StandardCharsets.UTF_8)
      );
      return HexFormat.of().formatHex(bytes);
    } catch (Exception e) {
      throw new IllegalStateException(e);
    }
  }

  public String cookie(HttpServletRequest req) {
    if (req.getCookies() == null) return "";
    return Arrays.stream(req.getCookies())
      .filter(c -> c.getName().equals("og_session"))
      .map(c -> c.getValue())
      .findFirst()
      .orElse("");
  }

  public Map<String, Object> me(HttpServletRequest req) {
    String token = cookie(req);
    if (token.isBlank()) throw new ResponseStatusException(
      HttpStatus.UNAUTHORIZED,
      "Đăng nhập để tiếp tục"
    );
    List<Map<String, Object>> rows = db.queryForList(
      "SELECT u.id,u.name,u.email,u.role,u.status,u.phone,u.specialty FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>now() AND u.status='ACTIVE' AND u.email_verified=true",
      hash(token)
    );
    if (rows.isEmpty()) throw new ResponseStatusException(
      HttpStatus.UNAUTHORIZED,
      "Phiên đã hết hạn"
    );
    return rows.get(0);
  }

  public Map<String, Object> admin(HttpServletRequest req) {
    Map<String, Object> user = me(req);
    if (!"ADMIN".equals(user.get("role"))) throw new ResponseStatusException(
      HttpStatus.FORBIDDEN,
      "Chỉ admin được thực hiện"
    );
    return user;
  }

  public void writeCheck(HttpServletRequest req) {
    String origin = req.getHeader("Origin");
    if (origin != null && !origin.isBlank()) {
      try {
        java.net.URI uri = java.net.URI.create(origin);
        if (
          !req.getServerName().equalsIgnoreCase(uri.getHost()) ||
          req.getServerPort() !=
            (uri.getPort() < 0
              ? "https".equals(uri.getScheme())
                ? 443
                : 80
              : uri.getPort())
        ) throw new Exception();
      } catch (Exception ex) {
        throw new ResponseStatusException(
          HttpStatus.FORBIDDEN,
          "Invalid origin"
        );
      }
    }
  }

  public void setCookie(HttpServletResponse res, String token, int age) {
    res.addHeader(
      "Set-Cookie",
      "og_session=" +
        token +
        "; Path=/api; HttpOnly; SameSite=Lax; Max-Age=" +
        age +
        (secureCookie ? "; Secure" : "")
    );
  }

  public String newToken() {
    byte[] bytes = new byte[32];
    random.nextBytes(bytes);
    return HexFormat.of().formatHex(bytes);
  }
}

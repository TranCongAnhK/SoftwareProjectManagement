package com.optigym.passwordreset;

import static com.optigym.shared.web.RequestValues.str;

import com.optigym.passwordreset.PasswordResetService;
import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.Objects;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PasswordResetController {

  private final PasswordResetService passwordReset;
  private final SessionSecurity security;

  public PasswordResetController(
    PasswordResetService passwordReset,
    SessionSecurity security
  ) {
    this.passwordReset = passwordReset;
    this.security = security;
  }

  @PostMapping("/auth/forgot-password")
  public Map<String, String> forgotPassword(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.writeCheck(req);
    return passwordReset.request(str(b, "email"));
  }

  @PostMapping("/auth/reset-password")
  public ResponseEntity<Map<String, String>> resetPassword(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.writeCheck(req);
    return passwordReset.confirm(
      str(b, "email"),
      str(b, "code"),
      Objects.toString(b.getOrDefault("password", ""), "")
    );
  }
}

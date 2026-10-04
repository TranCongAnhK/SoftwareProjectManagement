package com.optigym.verification;

import static com.optigym.shared.web.RequestValues.str;

import com.optigym.shared.security.SessionSecurity;
import com.optigym.verification.EmailVerificationService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EmailVerificationController {

  private final EmailVerificationService verification;
  private final SessionSecurity security;

  public EmailVerificationController(
    EmailVerificationService verification,
    SessionSecurity security
  ) {
    this.verification = verification;
    this.security = security;
  }

  @PostMapping("/auth/verify")
  public ResponseEntity<Map<String, String>> verify(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.writeCheck(req);
    return verification.verify(str(b, "email"), str(b, "code"));
  }

  @PostMapping("/auth/resend")
  public Map<String, Object> resend(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.writeCheck(req);
    return verification.resend(str(b, "email"));
  }
}

package com.optigym.admin.subscriptions;

import static com.optigym.shared.web.RequestValues.bad;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class SubscriptionController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public SubscriptionController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @PostMapping("/admin/subscriptions")
  public Map<String, Object> subscribe(
    @RequestBody Map<String, Long> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    Long member = b.get("member_id"),
      pkg = b.get("package_id");
    if (
      member == null ||
      pkg == null ||
      db.queryForObject(
        "SELECT count(*) FROM users WHERE id=? AND role='MEMBER' AND status='ACTIVE'",
        Long.class,
        member
      ) == 0
    ) bad("Hội viên không hợp lệ");
    List<Map<String, Object>> packages = db.queryForList(
      "SELECT duration_days FROM packages WHERE id=? AND active=true",
      pkg
    );
    if (packages.isEmpty()) bad("Gói tập không hợp lệ");
    int days = ((Number) packages.get(0).get("duration_days")).intValue();
    db.update(
      "INSERT INTO subscriptions(member_id,package_id,starts_on,ends_on) VALUES(?,?,CURRENT_DATE,CURRENT_DATE + ?)",
      member,
      pkg,
      days
    );
    return Map.of("ok", true);
  }
}

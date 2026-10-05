package com.optigym.admin.dashboard;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AdminDashboardController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public AdminDashboardController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/admin/summary")
  public Map<String, Object> summary(HttpServletRequest req) {
    security.admin(req);
    return Map.of(
      "members",
      db.queryForObject(
        "SELECT count(*) FROM users WHERE role='MEMBER' AND status='ACTIVE' AND email_verified=true",
        Long.class
      ),
      "pts",
      db.queryForObject(
        "SELECT count(*) FROM users WHERE role='PT' AND status='ACTIVE' AND email_verified=true",
        Long.class
      ),
      "pending",
      db.queryForObject(
        "SELECT count(*) FROM users WHERE role='PT' AND status='PENDING' AND email_verified=true",
        Long.class
      ),
      "staff",
      db.queryForObject(
        "SELECT count(*) FROM staff WHERE status='ACTIVE'",
        Long.class
      ),
      "rooms",
      db.queryForList(
        "SELECT category,count(*) AS packages FROM packages WHERE active=true GROUP BY category ORDER BY category"
      )
    );
  }
}

package com.optigym.member;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class MemberController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public MemberController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/member/overview")
  public Map<String, Object> member(HttpServletRequest req) {
    Map<String, Object> u = security.me(req);
    if (!"MEMBER".equals(u.get("role"))) throw new ResponseStatusException(
      HttpStatus.FORBIDDEN
    );
    return Map.of(
      "subscriptions",
      db.queryForList(
        "SELECT s.id,s.starts_on,s.ends_on,p.name,p.category FROM subscriptions s JOIN packages p ON p.id=s.package_id WHERE s.member_id=? ORDER BY s.ends_on DESC",
        u.get("id")
      ),
      "trainers",
      db.queryForList(
        "SELECT p.id,p.name,p.specialty FROM pt_clients c JOIN users p ON p.id=c.pt_id WHERE c.member_id=? AND p.status='ACTIVE'",
        u.get("id")
      )
    );
  }
}

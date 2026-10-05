package com.optigym.pt;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class PtController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public PtController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/pt/clients")
  public List<Map<String, Object>> clients(HttpServletRequest req) {
    Map<String, Object> u = security.me(req);
    if (!"PT".equals(u.get("role"))) throw new ResponseStatusException(
      HttpStatus.FORBIDDEN
    );
    return db.queryForList(
      "SELECT m.id,m.name,m.email,m.phone FROM pt_clients c JOIN users m ON m.id=c.member_id WHERE c.pt_id=? AND m.status='ACTIVE' ORDER BY m.name",
      u.get("id")
    );
  }
}

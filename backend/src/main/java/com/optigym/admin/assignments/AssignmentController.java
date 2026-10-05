package com.optigym.admin.assignments;

import static com.optigym.shared.web.RequestValues.bad;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AssignmentController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public AssignmentController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/admin/assignments")
  public List<Map<String, Object>> assignments(HttpServletRequest req) {
    security.admin(req);
    return db.queryForList(
      "SELECT c.pt_id,c.member_id,p.name AS pt_name,m.name AS member_name FROM pt_clients c JOIN users p ON p.id=c.pt_id JOIN users m ON m.id=c.member_id ORDER BY p.name"
    );
  }

  @PostMapping("/admin/assignments")
  public Map<String, Object> assign(
    @RequestBody Map<String, Long> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    Long pt = b.get("pt_id"),
      member = b.get("member_id");
    if (
      pt == null ||
      member == null ||
      db.queryForObject(
        "SELECT count(*) FROM users WHERE id=? AND role='PT' AND status='ACTIVE'",
        Long.class,
        pt
      ) == 0 ||
      db.queryForObject(
        "SELECT count(*) FROM users WHERE id=? AND role='MEMBER' AND status='ACTIVE'",
        Long.class,
        member
      ) == 0
    ) bad("PT hoặc member không hợp lệ");
    db.update(
      "INSERT INTO pt_clients(pt_id,member_id) VALUES(?,?) ON CONFLICT DO NOTHING",
      pt,
      member
    );
    return Map.of("ok", true);
  }

  @DeleteMapping("/admin/assignments/{pt}/{member}")
  public Map<String, Object> unassign(
    @PathVariable long pt,
    @PathVariable long member,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    db.update(
      "DELETE FROM pt_clients WHERE pt_id=? AND member_id=?",
      pt,
      member
    );
    return Map.of("ok", true);
  }
}

package com.optigym.admin.staff;

import static com.optigym.shared.web.RequestValues.bad;
import static com.optigym.shared.web.RequestValues.str;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class StaffController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public StaffController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/admin/staff")
  public List<Map<String, Object>> staff(HttpServletRequest req) {
    security.admin(req);
    return db.queryForList("SELECT * FROM staff ORDER BY id DESC");
  }

  @PostMapping("/admin/staff")
  public Map<String, Object> addStaff(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    String name = str(b, "name"),
      position = str(b, "position"),
      phone = str(b, "phone"),
      email = str(b, "email");
    if (
      name.length() < 2 ||
      name.length() > 120 ||
      position.isBlank() ||
      position.length() > 80 ||
      phone.length() > 30 ||
      email.length() > 255
    ) bad("Dữ liệu không hợp lệ");
    db.update(
      "INSERT INTO staff(name,position,phone,email) VALUES(?,?,?,?)",
      name,
      position,
      phone,
      email
    );
    return Map.of("ok", true);
  }

  @PutMapping("/admin/staff/{id}")
  public Map<String, Object> editStaff(
    @PathVariable long id,
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    String name = str(b, "name"),
      position = str(b, "position"),
      phone = str(b, "phone"),
      email = str(b, "email"),
      status = str(b, "status");
    if (
      name.length() < 2 ||
      name.length() > 120 ||
      position.isBlank() ||
      position.length() > 80 ||
      phone.length() > 30 ||
      email.length() > 255 ||
      !List.of("ACTIVE", "INACTIVE").contains(status)
    ) bad("Dữ liệu không hợp lệ");
    int n = db.update(
      "UPDATE staff SET name=?,position=?,phone=?,email=?,status=? WHERE id=?",
      name,
      position,
      phone,
      email,
      status,
      id
    );
    if (n == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    return Map.of("updated", n);
  }

  @DeleteMapping("/admin/staff/{id}")
  public Map<String, Object> deleteStaff(
    @PathVariable long id,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    int n = db.update("DELETE FROM staff WHERE id=?", id);
    if (n == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    return Map.of("deleted", n);
  }
}

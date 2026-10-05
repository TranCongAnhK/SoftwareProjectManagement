package com.optigym.admin.packages;

import static com.optigym.shared.web.RequestValues.bad;
import static com.optigym.shared.web.RequestValues.str;

import com.optigym.shared.security.SessionSecurity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
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
public class AdminPackageController {

  private final JdbcTemplate db;
  private final SessionSecurity security;

  public AdminPackageController(JdbcTemplate db, SessionSecurity security) {
    this.db = db;
    this.security = security;
  }

  @GetMapping("/admin/packages")
  public List<Map<String, Object>> packages(HttpServletRequest req) {
    security.admin(req);
    return db.queryForList("SELECT * FROM packages ORDER BY id DESC");
  }

  private Object[] packageValues(Map<String, Object> b) {
    String name = str(b, "name"),
      category = str(b, "category").toUpperCase(Locale.ROOT),
      description = str(b, "description");
    long price;
    int days;
    try {
      price = Long.parseLong(str(b, "price"));
      days = Integer.parseInt(str(b, "duration_days"));
    } catch (Exception e) {
      bad("Giá hoặc thời hạn không hợp lệ");
      return null;
    }
    if (
      name.length() < 2 ||
      name.length() > 120 ||
      !List.of("GYM", "YOGA", "BOXING").contains(category) ||
      description.length() > 500 ||
      price < 0 ||
      days < 1 ||
      days > 3650
    ) bad("Thông tin gói tập không hợp lệ");
    return new Object[] {
      name,
      category,
      price,
      days,
      description,
      Boolean.TRUE.equals(b.get("active")),
    };
  }

  @PostMapping("/admin/packages")
  public Map<String, Object> addPackage(
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    Object[] v = packageValues(b);
    db.update(
      "INSERT INTO packages(name,category,price,duration_days,description,active) VALUES(?,?,?,?,?,?)",
      v
    );
    return Map.of("ok", true);
  }

  @PutMapping("/admin/packages/{id}")
  public Map<String, Object> editPackage(
    @PathVariable long id,
    @RequestBody Map<String, Object> b,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    Object[] v = packageValues(b);
    Object[] args = Arrays.copyOf(v, 7);
    args[6] = id;
    int n = db.update(
      "UPDATE packages SET name=?,category=?,price=?,duration_days=?,description=?,active=? WHERE id=?",
      args
    );
    if (n == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    return Map.of("updated", n);
  }

  @DeleteMapping("/admin/packages/{id}")
  public Map<String, Object> deletePackage(
    @PathVariable long id,
    HttpServletRequest req
  ) {
    security.admin(req);
    security.writeCheck(req);
    int n = db.update("UPDATE packages SET active=false WHERE id=?", id);
    if (n == 0) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
    return Map.of("deactivated", n);
  }
}

package com.optigym.packages;

import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PublicPackageController {

  private final JdbcTemplate db;

  public PublicPackageController(JdbcTemplate db) {
    this.db = db;
  }

  @GetMapping("/packages")
  public List<Map<String, Object>> publicPackages() {
    return db.queryForList(
      "SELECT * FROM packages WHERE active=true ORDER BY id DESC"
    );
  }
}

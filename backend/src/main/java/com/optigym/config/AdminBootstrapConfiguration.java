package com.optigym.config;

import java.util.Locale;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@org.springframework.context.annotation.Configuration
public class AdminBootstrapConfiguration {

  private final JdbcTemplate db;
  private final BCryptPasswordEncoder passwords = new BCryptPasswordEncoder(12);

  public AdminBootstrapConfiguration(JdbcTemplate db) {
    this.db = db;
  }

  @Bean
  CommandLineRunner bootstrapAdmin(
    @Value("${ADMIN_EMAIL:}") String email,
    @Value("${ADMIN_PASSWORD:}") String password,
    @Value("${ADMIN_NAME:OptiGym Admin}") String name
  ) {
    return args -> {
      if (
        email.isBlank() || password.isBlank()
      ) throw new IllegalStateException(
        "Set ADMIN_EMAIL and ADMIN_PASSWORD before starting"
      );
      if (password.length() < 12) throw new IllegalStateException(
        "ADMIN_PASSWORD must contain at least 12 characters"
      );
      Long count = db.queryForObject(
        "SELECT count(*) FROM users WHERE role='ADMIN'",
        Long.class
      );
      if (count == 0) db.update(
        "INSERT INTO users(name,email,password_hash,role,status) VALUES(?,?,?,'ADMIN','ACTIVE')",
        name.trim(),
        email.trim().toLowerCase(Locale.ROOT),
        passwords.encode(password)
      );
    };
  }
}

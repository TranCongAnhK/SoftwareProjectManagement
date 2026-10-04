CREATE TABLE IF NOT EXISTS users (
 id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
 password_hash VARCHAR(100) NOT NULL, role VARCHAR(12) NOT NULL CHECK(role IN ('ADMIN','PT','MEMBER')),
 status VARCHAR(12) NOT NULL CHECK(status IN ('ACTIVE','PENDING','REJECTED','DISABLED')),
 phone VARCHAR(30) NOT NULL DEFAULT '', specialty VARCHAR(30) NOT NULL DEFAULT '',
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Existing local databases stay intact; older accounts were created before email verification.
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT TRUE;

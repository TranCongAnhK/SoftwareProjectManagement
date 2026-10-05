CREATE TABLE IF NOT EXISTS subscriptions (
 id BIGSERIAL PRIMARY KEY, member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 package_id BIGINT NOT NULL REFERENCES packages(id), starts_on DATE NOT NULL, ends_on DATE NOT NULL,
 CHECK(ends_on >= starts_on)
);

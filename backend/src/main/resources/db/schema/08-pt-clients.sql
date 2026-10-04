CREATE TABLE IF NOT EXISTS pt_clients (
 pt_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 member_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 PRIMARY KEY(pt_id,member_id)
);
CREATE INDEX IF NOT EXISTS idx_sessions_expiry ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_member ON subscriptions(member_id, ends_on);

CREATE TABLE IF NOT EXISTS personalization_events (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  segment TEXT NOT NULL,
  reason_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leads ADD COLUMN personalization_segment TEXT;
ALTER TABLE leads ADD COLUMN personalization_reason_json TEXT NOT NULL DEFAULT '{}';
CREATE TABLE IF NOT EXISTS visitor_sessions (
  id TEXT PRIMARY KEY,
  first_source TEXT,
  last_source TEXT,
  first_landing TEXT,
  last_landing TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attribution_touches (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  source TEXT,
  landing_path TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  event_name TEXT NOT NULL DEFAULT 'page_view',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE leads ADD COLUMN session_id TEXT;
ALTER TABLE leads ADD COLUMN first_source TEXT;
ALTER TABLE leads ADD COLUMN last_source TEXT;
ALTER TABLE leads ADD COLUMN first_landing TEXT;
ALTER TABLE leads ADD COLUMN last_landing TEXT;
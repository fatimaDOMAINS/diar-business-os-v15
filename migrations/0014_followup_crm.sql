CREATE TABLE IF NOT EXISTS followups (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  due_at TEXT NOT NULL,
  followup_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS crm_notes (
  id TEXT PRIMARY KEY,
  lead_id TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solar_followups_due ON followups(status,due_at);
CREATE INDEX IF NOT EXISTS idx_solar_followups_provider ON followups(provider_id,status,due_at);
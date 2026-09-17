CREATE TABLE IF NOT EXISTS copilot_drafts (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  lead_id TEXT NOT NULL,
  draft_type TEXT NOT NULL,
  output_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
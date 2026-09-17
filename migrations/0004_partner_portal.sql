CREATE TABLE IF NOT EXISTS partner_activity (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  lead_id TEXT,
  action TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_solar_leads_provider ON leads(provider_id);
CREATE INDEX IF NOT EXISTS idx_solar_leads_partner_status ON leads(partner_status);
ALTER TABLE providers ADD COLUMN sla_minutes INTEGER NOT NULL DEFAULT 240;
ALTER TABLE providers ADD COLUMN marketplace_enabled INTEGER NOT NULL DEFAULT 1;

ALTER TABLE leads ADD COLUMN assigned_at TEXT;
ALTER TABLE leads ADD COLUMN sla_due_at TEXT;
ALTER TABLE leads ADD COLUMN sla_breached INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN reroute_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN routing_reason_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE leads ADD COLUMN owner_attention INTEGER NOT NULL DEFAULT 0;
ALTER TABLE leads ADD COLUMN escalated_at TEXT;

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_type TEXT NOT NULL,
  actor_id TEXT,
  meta_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS monthly_statements (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  statement_month TEXT NOT NULL,
  monthly_fee_usd INTEGER NOT NULL DEFAULT 0,
  lead_fees_usd INTEGER NOT NULL DEFAULT 0,
  total_usd INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(provider_id,statement_month)
);

UPDATE providers SET sla_minutes=120 WHERE partner_tier='featured';
UPDATE providers SET sla_minutes=240 WHERE partner_tier='partner';
UPDATE providers SET sla_minutes=480 WHERE partner_tier IN ('free','enterprise');
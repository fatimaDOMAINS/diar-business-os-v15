CREATE TABLE IF NOT EXISTS partner_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  monthly_fee_usd INTEGER NOT NULL DEFAULT 0,
  accepted_lead_fee_usd INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  benefits_json TEXT NOT NULL DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS billing_events (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  lead_id TEXT,
  event_type TEXT NOT NULL,
  amount_usd INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR REPLACE INTO partner_packages VALUES
('free','Free Solar Provider Listing',0,0,0,'["Basic provider profile","Standard marketplace visibility"]',1),
('partner','Solar Project Partner',299,45,0,'["Lead access","Partner portal","Basic reporting"]',1),
('featured','Featured Solar Partner',749,85,1,'["Featured placement","Lead access","Partner analytics"]',1),
('enterprise','Solar Platform Enterprise',1990,0,1,'["Multi-service visibility","Enterprise project access","Advanced reporting"]',1);

UPDATE providers SET partner_tier='featured' WHERE id='se24-1';
UPDATE providers SET partner_tier='partner' WHERE id IN ('se24-2','se24-3','se24-4','se24-5');
UPDATE providers SET partner_tier='enterprise' WHERE id='se24-6';
CREATE TABLE IF NOT EXISTS experiments (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  surface TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiment_variants (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  name TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  weight INTEGER NOT NULL DEFAULT 50
);

CREATE TABLE IF NOT EXISTS experiment_assignments (
  id TEXT PRIMARY KEY,
  experiment_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(experiment_id,session_id)
);

ALTER TABLE leads ADD COLUMN experiment_json TEXT NOT NULL DEFAULT '{}';

INSERT OR IGNORE INTO experiments VALUES
('solar24-hero','SolarEnergy24 homepage hero','hero','active',CURRENT_TIMESTAMP),
('solar24-cta','SolarEnergy24 project CTA','lead_cta','active',CURRENT_TIMESTAMP);

INSERT OR IGNORE INTO experiment_variants VALUES
('solar24-hero-a','solar24-hero','Project-led','{"headline":"Turn solar interest into qualified energy projects.","cta":"Start Solar Advisor"}',50),
('solar24-hero-b','solar24-hero','Outcome-led','{"headline":"Find the right solar, storage and EPC partner for your project.","cta":"Find solar providers"}',50),
('solar24-cta-a','solar24-cta','Standard','{"label":"Submit project brief"}',50),
('solar24-cta-b','solar24-cta','Matching-led','{"label":"Request provider matching"}',50);
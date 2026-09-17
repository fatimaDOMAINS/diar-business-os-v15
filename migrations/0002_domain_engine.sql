ALTER TABLE providers ADD COLUMN partner_tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE providers ADD COLUMN accepts_leads INTEGER NOT NULL DEFAULT 1;
ALTER TABLE leads ADD COLUMN domain_profile TEXT NOT NULL DEFAULT 'solarenergy24';
ALTER TABLE leads ADD COLUMN partner_status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE leads ADD COLUMN partner_note TEXT;
ALTER TABLE leads ADD COLUMN accepted_at TEXT;
ALTER TABLE leads ADD COLUMN contacted_at TEXT;
ALTER TABLE leads ADD COLUMN completed_at TEXT;

CREATE TABLE IF NOT EXISTS domain_profiles (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  vertical TEXT NOT NULL,
  display_name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  config_json TEXT NOT NULL DEFAULT '{}',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO domain_profiles(id,domain,vertical,display_name,currency,config_json)
VALUES(
 'solarenergy24','SolarEnergy24.com','solar-energy','SolarEnergy24','USD',
 '{"modules":["advisor","provider-discovery","lead-engine","marketplace","monetization","partner-portal"],"provider_types":["installer","epc","storage-integrator","developer","financing","software"],"markets":["Global","UAE","GCC","Europe","North America","Asia"]}'
);
CREATE TABLE IF NOT EXISTS login_tokens (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  token_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_sessions (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  session_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL UNIQUE,
  package_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  provider_name TEXT,
  provider_subscription_id TEXT,
  trial_ends_at TEXT,
  current_period_end TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO subscriptions(id,provider_id,package_id,status)
SELECT 'sub-' || id,id,partner_tier,'active' FROM providers;

INSERT OR IGNORE INTO commercial_contracts(id,provider_id,terms_version,package_id,status,accepted_by,accepted_at,starts_at)
SELECT 'contract-' || id,id,'2026-08',partner_tier,'accepted','seed migration',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP FROM providers;

INSERT OR IGNORE INTO provider_reviews(id,provider_id,identity_check,licensing_check,engineering_check,grid_scope_check,certification_check,review_status,reviewer_note,reviewed_at,reviewed_by)
SELECT 'review-' || id,id,'demo','demo','demo','demo','demo','demo-only',
'Seed solar provider is illustrative only and not verified for live marketplace use.',CURRENT_TIMESTAMP,'seed migration'
FROM providers;
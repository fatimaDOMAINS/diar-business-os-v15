CREATE TABLE IF NOT EXISTS provider_applications (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  provider_type TEXT NOT NULL,
  country TEXT,
  city TEXT,
  services TEXT,
  system_types TEXT,
  commercial_model_claimed TEXT,
  licensing_claimed TEXT,
  engineering_credentials_claimed TEXT,
  grid_interconnection_scope_claimed TEXT,
  certifications_claimed TEXT,
  storage_capability_claimed INTEGER NOT NULL DEFAULT 0,
  website TEXT,
  package_id TEXT NOT NULL DEFAULT 'free',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TEXT,
  reviewed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS provider_reviews (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL UNIQUE,
  identity_check TEXT NOT NULL DEFAULT 'pending',
  licensing_check TEXT NOT NULL DEFAULT 'pending',
  engineering_check TEXT NOT NULL DEFAULT 'pending',
  grid_scope_check TEXT NOT NULL DEFAULT 'pending',
  certification_check TEXT NOT NULL DEFAULT 'pending',
  review_status TEXT NOT NULL DEFAULT 'pending',
  reviewer_note TEXT,
  reviewed_at TEXT,
  reviewed_by TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commercial_contracts (
  id TEXT PRIMARY KEY,
  provider_id TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  package_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_acceptance',
  accepted_by TEXT,
  accepted_at TEXT,
  starts_at TEXT,
  ends_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
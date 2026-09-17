-- DIAR Business OS V5: audience-to-offer conversion layer
CREATE TABLE IF NOT EXISTS prospect_profiles (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, slug TEXT NOT NULL, name TEXT NOT NULL,
 company TEXT, role TEXT, audience_json TEXT NOT NULL DEFAULT '{}', contribution_json TEXT NOT NULL DEFAULT '{}',
 preferred_offer_id TEXT, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), UNIQUE(tenant_id,slug)
);
CREATE INDEX IF NOT EXISTS idx_prospect_profiles_tenant ON prospect_profiles(tenant_id,status,updated_at);
CREATE TABLE IF NOT EXISTS demo_links (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, prospect_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE,
 expires_at TEXT, revoked_at TEXT, created_at TEXT NOT NULL, last_opened_at TEXT,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_demo_links_lookup ON demo_links(token_hash,expires_at);
CREATE TABLE IF NOT EXISTS audience_assessments (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, prospect_id TEXT NOT NULL,
 score INTEGER NOT NULL DEFAULT 0, band TEXT NOT NULL, factors_json TEXT NOT NULL DEFAULT '{}',
 reasons_json TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_audience_assessments_prospect ON audience_assessments(tenant_id,prospect_id,created_at);

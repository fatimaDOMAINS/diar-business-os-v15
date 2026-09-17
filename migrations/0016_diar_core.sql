CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, domain TEXT,
  vertical_slug TEXT NOT NULL DEFAULT 'generic', status TEXT NOT NULL DEFAULT 'active',
  settings_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tenant_members (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, identity_id TEXT, email TEXT,
  role TEXT NOT NULL DEFAULT 'member', status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, slug TEXT NOT NULL, name TEXT NOT NULL,
  offer_type TEXT NOT NULL DEFAULT 'service', description TEXT, price_text TEXT,
  eligibility_json TEXT NOT NULL DEFAULT '{}', fulfillment_json TEXT NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id), UNIQUE(tenant_id, slug)
);
CREATE TABLE IF NOT EXISTS opportunities (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, lead_id TEXT, offer_id TEXT,
  stage TEXT NOT NULL DEFAULT 'new', value_text TEXT, score INTEGER NOT NULL DEFAULT 0,
  attributes_json TEXT NOT NULL DEFAULT '{}', next_action TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS interactions (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, lead_id TEXT, opportunity_id TEXT,
  channel TEXT NOT NULL, direction TEXT, event_type TEXT NOT NULL, payload_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, opportunity_id TEXT, transaction_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', amount_minor INTEGER, currency TEXT, metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS consent_events (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, identity_id TEXT, lead_id TEXT,
  purpose TEXT NOT NULL, state TEXT NOT NULL, source TEXT, evidence_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_offers_tenant ON offers(tenant_id,status);
CREATE INDEX IF NOT EXISTS idx_opportunities_tenant ON opportunities(tenant_id,stage,score);
CREATE INDEX IF NOT EXISTS idx_interactions_tenant ON interactions(tenant_id,created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_tenant ON transactions(tenant_id,status);

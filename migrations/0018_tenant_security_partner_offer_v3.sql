CREATE TABLE IF NOT EXISTS tenant_sessions (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, member_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE,
 expires_at TEXT NOT NULL, revoked_at TEXT, created_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (member_id) REFERENCES tenant_members(id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_sessions_lookup ON tenant_sessions(token_hash,expires_at);
CREATE TABLE IF NOT EXISTS tenant_partners (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT NOT NULL, partner_type TEXT NOT NULL DEFAULT 'provider',
 email TEXT, company TEXT, status TEXT NOT NULL DEFAULT 'active', capabilities_json TEXT NOT NULL DEFAULT '{}',
 audience_json TEXT NOT NULL DEFAULT '{}', commercial_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_partners_tenant ON tenant_partners(tenant_id,status,partner_type);
CREATE TABLE IF NOT EXISTS offer_rules (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, offer_id TEXT NOT NULL, priority INTEGER NOT NULL DEFAULT 100,
 conditions_json TEXT NOT NULL DEFAULT '{}', score_delta INTEGER NOT NULL DEFAULT 0, active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL, FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (offer_id) REFERENCES offers(id)
);
CREATE INDEX IF NOT EXISTS idx_offer_rules_tenant ON offer_rules(tenant_id,active,priority);
CREATE TABLE IF NOT EXISTS partner_assignments (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, lead_id TEXT NOT NULL, partner_id TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'assigned', reason_json TEXT NOT NULL DEFAULT '{}', assigned_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (lead_id) REFERENCES core_leads(id), FOREIGN KEY (partner_id) REFERENCES tenant_partners(id)
);
CREATE INDEX IF NOT EXISTS idx_partner_assignments_tenant ON partner_assignments(tenant_id,status,assigned_at);

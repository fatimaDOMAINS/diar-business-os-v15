CREATE TABLE IF NOT EXISTS core_leads (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT, company TEXT, contact TEXT NOT NULL,
 intent_type TEXT NOT NULL DEFAULT 'general', conversion_mode TEXT NOT NULL DEFAULT 'lead',
 status TEXT NOT NULL DEFAULT 'new', score INTEGER NOT NULL DEFAULT 0,
 attributes_json TEXT NOT NULL DEFAULT '{}', source_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_core_leads_tenant ON core_leads(tenant_id,status,created_at);
CREATE TABLE IF NOT EXISTS tenant_domains (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, hostname TEXT NOT NULL UNIQUE, is_primary INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL, FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant ON tenant_domains(tenant_id);

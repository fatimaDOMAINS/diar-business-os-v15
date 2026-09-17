-- DIAR Business OS V8: internal Prospect Factory review/approval workflow
CREATE TABLE IF NOT EXISTS prospect_batches (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, name TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'csv',
 status TEXT NOT NULL DEFAULT 'draft', total_rows INTEGER NOT NULL DEFAULT 0, accepted_rows INTEGER NOT NULL DEFAULT 0,
 duplicate_rows INTEGER NOT NULL DEFAULT 0, rejected_rows INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE TABLE IF NOT EXISTS prospect_batch_rows (
 id TEXT PRIMARY KEY, batch_id TEXT NOT NULL, tenant_id TEXT NOT NULL, row_number INTEGER NOT NULL,
 fingerprint TEXT NOT NULL, input_json TEXT NOT NULL DEFAULT '{}', status TEXT NOT NULL DEFAULT 'pending', duplicate_of TEXT,
 prospect_id TEXT, selected_domain TEXT, selected_business_model TEXT, fit_score INTEGER, review_note TEXT,
 approved_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (batch_id) REFERENCES prospect_batches(id), FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_factory_batch_rows ON prospect_batch_rows(tenant_id,batch_id,status,row_number);
CREATE INDEX IF NOT EXISTS idx_factory_fingerprint ON prospect_batch_rows(tenant_id,fingerprint);
CREATE TABLE IF NOT EXISTS prospect_outreach_drafts (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, prospect_id TEXT NOT NULL, batch_row_id TEXT,
 channel TEXT NOT NULL DEFAULT 'linkedin', language TEXT NOT NULL DEFAULT 'en', subject TEXT, body TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id), FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_outreach_drafts ON prospect_outreach_drafts(tenant_id,prospect_id,status);

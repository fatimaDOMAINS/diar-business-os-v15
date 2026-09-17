-- DIAR Business OS V9: approval hardening, evidence status and opportunity snapshots
ALTER TABLE prospect_batch_rows ADD COLUMN approved_by TEXT;
ALTER TABLE prospect_batch_rows ADD COLUMN processing_started_at TEXT;
ALTER TABLE prospect_batch_rows ADD COLUMN original_recommendation_json TEXT;
ALTER TABLE prospect_batch_rows ADD COLUMN final_selection_json TEXT;
ALTER TABLE prospect_batch_rows ADD COLUMN opportunity_json TEXT;
CREATE TABLE IF NOT EXISTS prospect_identity_keys (
 id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, prospect_id TEXT, batch_row_id TEXT,
 key_type TEXT NOT NULL, key_value_hash TEXT NOT NULL, normalized_hint TEXT,
 created_at TEXT NOT NULL, UNIQUE(tenant_id,key_type,key_value_hash),
 FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
CREATE INDEX IF NOT EXISTS idx_identity_keys ON prospect_identity_keys(tenant_id,key_type,key_value_hash);

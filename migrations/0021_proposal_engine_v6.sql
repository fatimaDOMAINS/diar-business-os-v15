-- DIAR Business OS V6: personalized business proposal + audience-to-revenue scenario layer
CREATE TABLE IF NOT EXISTS prospect_proposals (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 prospect_id TEXT NOT NULL,
 title TEXT NOT NULL,
 domain_name TEXT,
 business_model TEXT NOT NULL DEFAULT 'joint-venture',
 selected_offer_id TEXT,
 assumptions_json TEXT NOT NULL DEFAULT '{}',
 scenario_json TEXT NOT NULL DEFAULT '{}',
 contribution_json TEXT NOT NULL DEFAULT '{}',
 commercial_json TEXT NOT NULL DEFAULT '{}',
 status TEXT NOT NULL DEFAULT 'draft',
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id),
 FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id),
 FOREIGN KEY (selected_offer_id) REFERENCES offers(id)
);
CREATE INDEX IF NOT EXISTS idx_prospect_proposals ON prospect_proposals(tenant_id,prospect_id,status,updated_at);

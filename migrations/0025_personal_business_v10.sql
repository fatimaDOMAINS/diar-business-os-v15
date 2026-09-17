-- DIAR Business OS V10: personalized mini-business presentation layer
CREATE TABLE IF NOT EXISTS prospect_business_demos (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 prospect_id TEXT NOT NULL,
 proposal_id TEXT,
 domain_name TEXT NOT NULL,
 vertical_slug TEXT NOT NULL,
 business_model TEXT NOT NULL,
 hero_json TEXT NOT NULL DEFAULT '{}',
 value_proposition_json TEXT NOT NULL DEFAULT '{}',
 monetization_json TEXT NOT NULL DEFAULT '{}',
 roles_json TEXT NOT NULL DEFAULT '{}',
 journey_json TEXT NOT NULL DEFAULT '{}',
 cta_json TEXT NOT NULL DEFAULT '{}',
 evidence_json TEXT NOT NULL DEFAULT '{}',
 status TEXT NOT NULL DEFAULT 'draft',
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id),
 FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id),
 FOREIGN KEY (proposal_id) REFERENCES prospect_proposals(id)
);
CREATE INDEX IF NOT EXISTS idx_business_demos ON prospect_business_demos(tenant_id,prospect_id,status,updated_at);

CREATE TABLE IF NOT EXISTS prospect_archetype_assessments (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 prospect_id TEXT NOT NULL,
 archetype_slug TEXT NOT NULL,
 confidence TEXT NOT NULL,
 score INTEGER NOT NULL DEFAULT 0,
 scores_json TEXT NOT NULL DEFAULT '{}',
 domain_role TEXT,
 evidence_status TEXT NOT NULL DEFAULT 'declared_or_profile',
 reviewed_by TEXT,
 reviewed_at TEXT,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_archetype_prospect ON prospect_archetype_assessments(tenant_id, prospect_id, created_at DESC);

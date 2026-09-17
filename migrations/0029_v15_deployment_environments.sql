CREATE TABLE IF NOT EXISTS deployment_events (
 id TEXT PRIMARY KEY,
 app_version TEXT NOT NULL,
 environment TEXT NOT NULL,
 event_type TEXT NOT NULL,
 actor TEXT,
 metadata_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_deployment_events_env_created ON deployment_events(environment,created_at);

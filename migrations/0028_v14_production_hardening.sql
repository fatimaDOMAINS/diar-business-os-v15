CREATE TABLE IF NOT EXISTS request_rate_limits (
 key TEXT NOT NULL,
 bucket TEXT NOT NULL,
 window_start INTEGER NOT NULL,
 hits INTEGER NOT NULL DEFAULT 0,
 updated_at TEXT NOT NULL,
 PRIMARY KEY (key,bucket,window_start)
);
CREATE INDEX IF NOT EXISTS idx_request_rate_limits_cleanup ON request_rate_limits(window_start);

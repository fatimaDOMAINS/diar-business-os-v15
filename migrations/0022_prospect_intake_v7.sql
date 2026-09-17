-- DIAR Business OS V7: prospect intake + domain/business fit recommendations
CREATE TABLE IF NOT EXISTS domain_catalog (
 id TEXT PRIMARY KEY,
 domain_name TEXT NOT NULL UNIQUE,
 vertical_slug TEXT NOT NULL DEFAULT 'generic',
 business_models_json TEXT NOT NULL DEFAULT '[]',
 markets_json TEXT NOT NULL DEFAULT '[]',
 audience_tags_json TEXT NOT NULL DEFAULT '[]',
 capabilities_json TEXT NOT NULL DEFAULT '{}',
 asset_value_text TEXT,
 status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL,
 updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_domain_catalog_vertical ON domain_catalog(vertical_slug,status);

CREATE TABLE IF NOT EXISTS prospect_intakes (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 prospect_id TEXT NOT NULL,
 source TEXT NOT NULL DEFAULT 'manual',
 profile_url TEXT,
 raw_json TEXT NOT NULL DEFAULT '{}',
 normalized_json TEXT NOT NULL DEFAULT '{}',
 created_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id),
 FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id)
);
CREATE INDEX IF NOT EXISTS idx_prospect_intakes ON prospect_intakes(tenant_id,prospect_id,created_at);

CREATE TABLE IF NOT EXISTS prospect_recommendations (
 id TEXT PRIMARY KEY,
 tenant_id TEXT NOT NULL,
 prospect_id TEXT NOT NULL,
 domain_catalog_id TEXT,
 domain_name TEXT NOT NULL,
 vertical_slug TEXT NOT NULL,
 business_model TEXT NOT NULL,
 fit_score INTEGER NOT NULL DEFAULT 0,
 reasons_json TEXT NOT NULL DEFAULT '[]',
 assumptions_json TEXT NOT NULL DEFAULT '{}',
 status TEXT NOT NULL DEFAULT 'recommended',
 created_at TEXT NOT NULL,
 FOREIGN KEY (tenant_id) REFERENCES tenants(id),
 FOREIGN KEY (prospect_id) REFERENCES prospect_profiles(id),
 FOREIGN KEY (domain_catalog_id) REFERENCES domain_catalog(id)
);
CREATE INDEX IF NOT EXISTS idx_prospect_recommendations ON prospect_recommendations(tenant_id,prospect_id,fit_score);

-- Seed only portfolio facts already established by the owner. No invented prospects or market claims.
INSERT OR IGNORE INTO domain_catalog(id,domain_name,vertical_slug,business_models_json,markets_json,audience_tags_json,capabilities_json,asset_value_text,status,created_at,updated_at) VALUES
('dc-dubaiestate24','DubaiEstate24.com','real-estate','["investment-platform","lead-engine","marketplace","luxury-club"]','["dubai","uae","global"]','["real-estate","property","investment","broker","developer","luxury"]','{"conversion_modes":["lead","match","quote"]}','$149,000','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dc-solarenergy24','SolarEnergy24.com','solar','["marketplace","lead-engine","project-platform"]','["global"]','["solar","energy","renewables","installer","epc","sustainability"]','{"conversion_modes":["lead","match","quote"]}','$49,500','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dc-dubaicars24','DubaiCars24.com','automotive','["marketplace","lead-engine","luxury-club"]','["dubai","uae","global"]','["automotive","cars","luxury","dealer","mobility"]','{"conversion_modes":["lead","match","quote"]}','$22,500','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dc-vipdubaiservices','VIPDubaiServices.com','luxury-services','["luxury-club","lead-engine","booking-platform"]','["dubai","uae","global"]','["luxury","concierge","travel","hospitality","vip","services"]','{"conversion_modes":["lead","match","booking"]}','$17,500','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dc-dubaieco','DubaiEco.org','sustainability','["authority-hub","directory","lead-engine"]','["dubai","uae","global"]','["sustainability","eco","climate","green","esg","energy"]','{"conversion_modes":["lead","match","subscribe"]}',NULL,'active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('dc-umami365','Umami365.com','food','["authority-hub","directory","booking-platform","marketplace"]','["global"]','["food","restaurant","chef","hospitality","culinary"]','{"conversion_modes":["lead","booking","subscribe","match"]}','$47,000','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

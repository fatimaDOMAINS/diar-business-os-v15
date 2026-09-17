CREATE TABLE IF NOT EXISTS providers (
 id TEXT PRIMARY KEY,name TEXT NOT NULL,provider_type TEXT NOT NULL,country TEXT,city TEXT,services TEXT,
 system_types TEXT,commercial_model TEXT,project_size_text TEXT,storage_capability INTEGER NOT NULL DEFAULT 0,
 featured INTEGER NOT NULL DEFAULT 0,verified INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY,name TEXT NOT NULL,company TEXT,contact TEXT NOT NULL,buyer_type TEXT NOT NULL,
 project_type TEXT NOT NULL,country TEXT,city TEXT,property_type TEXT,roof_or_site_text TEXT,
 estimated_consumption_text TEXT,budget_text TEXT,storage_required INTEGER NOT NULL DEFAULT 0,
 timeline TEXT,notes TEXT,provider_id TEXT,status TEXT NOT NULL DEFAULT 'new',
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS events (
 id INTEGER PRIMARY KEY AUTOINCREMENT,event_name TEXT NOT NULL,meta_json TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT OR IGNORE INTO providers VALUES
('se24-1','Residential Solar Installer','installer','UAE','Dubai','Residential rooftop solar, design and installation','Rooftop PV','Project based','Demo project size',1,1,0,1,CURRENT_TIMESTAMP),
('se24-2','Commercial Solar EPC','epc','UAE','Abu Dhabi','Commercial and industrial PV, EPC delivery','Rooftop / ground mount','Project based','Demo project size',1,0,0,1,CURRENT_TIMESTAMP),
('se24-3','Solar + Battery Integrator','storage-integrator','Germany','Berlin','Solar PV, battery storage and energy management','PV + BESS','Project based','Demo project size',1,0,0,1,CURRENT_TIMESTAMP),
('se24-4','Solar Monitoring Software','software','Netherlands','Amsterdam','Monitoring, performance analytics and fleet software','Software / monitoring','SaaS','Demo fleet size',0,0,0,1,CURRENT_TIMESTAMP),
('se24-5','Solar Financing Partner','financing','Global','Global','Solar financing, lease and project finance introductions','Residential / commercial','Financing agreement','Demo scope',0,0,0,1,CURRENT_TIMESTAMP),
('se24-6','Utility Scale Solar Developer','developer','Spain','Madrid','Utility-scale development, EPC coordination and project partnerships','Ground mount / utility','Project / JV','Demo project size',1,0,0,1,CURRENT_TIMESTAMP);
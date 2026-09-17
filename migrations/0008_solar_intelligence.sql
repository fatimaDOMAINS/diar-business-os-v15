CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO content_items(id,slug,title,category,summary,body,status,published_at) VALUES
('sei1','commercial-solar-readiness-checklist','Commercial Solar Project Readiness Checklist','commercial',
 'A practical checklist for companies preparing a commercial rooftop or site-based solar project.',
 'Define site location, roof or land availability, electricity-consumption context, target system type, storage requirement, budget context and desired timeline. Production yield, savings, payback, grid requirements, incentives, equipment selection and permitting must be confirmed through site-specific engineering and current provider data.',
 'published',CURRENT_TIMESTAMP),
('sei2','how-to-evaluate-solar-epc','How to Evaluate a Solar EPC or Installer','provider-selection',
 'A structured framework for comparing solar providers beyond marketing claims.',
 'Review company identity, licensing or registration where applicable, engineering credentials, project scope, equipment approach, warranties, grid/interconnection responsibilities, project documentation and current commercial terms. Featured placement on SolarEnergy24.com is commercial and separate from verification.',
 'published',CURRENT_TIMESTAMP),
('sei3','solar-battery-storage-project-brief','How to Build a Better Solar + Battery Project Brief','storage',
 'A structured brief for PV + battery storage sourcing and design discussions.',
 'State property type, consumption pattern, critical loads, backup objective, space constraints, target location, indicative budget and desired timeline. Battery sizing, usable capacity, cycle assumptions, economics, compatibility and safety requirements require provider engineering and current product documentation.',
 'published',CURRENT_TIMESTAMP);
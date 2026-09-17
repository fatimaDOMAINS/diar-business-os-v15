-- DIAR Business OS V4: DubaiEstate24 reference tenant + opportunity/partner routing
INSERT OR IGNORE INTO tenants(id,slug,name,domain,vertical_slug,status,settings_json,created_at,updated_at)
VALUES('tenant-dubaiestate24','dubaiestate24','DubaiEstate24','dubaiestate24.com','real-estate','active',
'{"default_conversion_mode":"match","brand":{"name":"DubaiEstate24","tagline":"Dubai property discovery, qualification and expert matching"},"markets":["off-plan","ready","luxury"],"currency":"AED"}',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO tenant_domains(id,tenant_id,hostname,is_primary,created_at) VALUES('domain-dubaiestate24','tenant-dubaiestate24','dubaiestate24.com',1,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO offers(id,tenant_id,slug,name,offer_type,description,price_text,eligibility_json,fulfillment_json,status,created_at,updated_at) VALUES
('de24-offer-ai','tenant-dubaiestate24','ai-property-discovery','AI Property Discovery','service','Clarify budget, property type, market and purchase goal, then prepare a structured brief for expert follow-up.','No upfront fee','{}','{"conversion_mode":"lead"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('de24-offer-investor','tenant-dubaiestate24','investor-match','Investor Opportunity Match','match','Match an investment brief with a relevant participating real-estate partner.','On request','{"goal":"investment"}','{"conversion_mode":"match"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('de24-offer-offplan','tenant-dubaiestate24','off-plan-match','Off-Plan Project Match','match','Route an off-plan requirement to a relevant participating partner.','On request','{"market":"off-plan"}','{"conversion_mode":"match"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('de24-offer-luxury','tenant-dubaiestate24','luxury-property-match','Luxury Property Match','match','Qualification and expert matching for premium Dubai property requirements.','On request','{"property_type":["villa","penthouse"]}','{"conversion_mode":"match"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
INSERT OR IGNORE INTO offer_rules(id,tenant_id,offer_id,priority,conditions_json,score_delta,active,created_at) VALUES
('de24-rule-investor','tenant-dubaiestate24','de24-offer-investor',10,'{"goal":"investment"}',50,1,CURRENT_TIMESTAMP),
('de24-rule-offplan','tenant-dubaiestate24','de24-offer-offplan',20,'{"market":"off-plan"}',45,1,CURRENT_TIMESTAMP),
('de24-rule-villa','tenant-dubaiestate24','de24-offer-luxury',30,'{"property_type":"villa"}',35,1,CURRENT_TIMESTAMP),
('de24-rule-penthouse','tenant-dubaiestate24','de24-offer-luxury',30,'{"property_type":"penthouse"}',35,1,CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_opportunities_lead ON opportunities(tenant_id,lead_id,stage);
CREATE INDEX IF NOT EXISTS idx_partner_assignments_lead ON partner_assignments(tenant_id,lead_id,status);

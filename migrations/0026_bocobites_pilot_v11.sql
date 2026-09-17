-- DIAR Business OS V11: first real end-to-end pilot — BOCOBITES / Fleur Anderson
-- Public facts are sourced externally before seeding. No revenue or conversion forecast is inserted.
INSERT OR IGNORE INTO tenants(id,slug,name,domain,vertical_slug,status,settings_json,created_at,updated_at)
VALUES(
 'tenant-bocobites-pilot','bocobites-pilot','BOCOBITES Growth Engine','bocobites.com','generic','active',
 '{"default_conversion_mode":"lead","brand":{"name":"BOCOBITES Growth Engine","tagline":"Turn product interest into qualified retail, hospitality, corporate gifting and distribution opportunities"},"pilot":{"partner":"Fleur Anderson","company":"BOCOBITES","mode":"brand-first","secondary_domain":"Umami365.com","domain_role":"optional expansion platform, not assumed"},"markets":["consumer","retail","hospitality","corporate-gifting","distribution","events"],"currency":"USD"}',
 CURRENT_TIMESTAMP,CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO offers(id,tenant_id,slug,name,offer_type,description,price_text,eligibility_json,fulfillment_json,status,created_at,updated_at) VALUES
('boco-offer-b2b-tasting','tenant-bocobites-pilot','b2b-tasting','B2B Tasting / Product Evaluation','lead','Qualify offices, hotels, boutiques, event teams and other B2B buyers interested in evaluating BOCOBITES.','On request','{}','{"conversion_mode":"lead"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('boco-offer-wholesale','tenant-bocobites-pilot','wholesale-retail','Wholesale & Retail Partnership','application','Qualify retailers and specialty food partners for a wholesale or retail conversation.','Commercial terms on request','{}','{"conversion_mode":"application"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('boco-offer-hospitality','tenant-bocobites-pilot','hospitality','Hospitality Program','lead','Qualify hotels, wineries, guest amenities and hospitality partners for recurring or curated BOCOBITES programs.','On request','{}','{"conversion_mode":"lead"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('boco-offer-gifting','tenant-bocobites-pilot','corporate-gifting','Corporate Gifting & Events','quote','Qualify corporate gifting, executive meeting, event and client welcome-box opportunities.','Quote on request','{}','{"conversion_mode":"quote"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
('boco-offer-distribution','tenant-bocobites-pilot','distribution','Distribution Partnership','application','Qualify distribution partners that can expand BOCOBITES into relevant markets and channels.','Commercial terms on request','{}','{"conversion_mode":"application"}','active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

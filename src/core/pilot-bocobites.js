const publicFacts = {
  person: 'Fleur Anderson',
  company: 'BOCOBITES',
  role: 'Founder / chef-entrepreneur',
  profile_url: 'https://www.linkedin.com/in/fleuranderson1/',
  website: 'https://www.bocobites.com',
  facts: [
    'Award-winning French meals in reusable glass jars.',
    'Ready in approximately three minutes and shelf-stable for up to one year.',
    'B2B use cases include retail, hospitality, corporate gifting, offices and events.',
    'The company is preparing for growth through production, distribution and premium partnerships.'
  ],
  evidence_status: 'public-source-verified-2026-09-16'
};

export function bocobitesPilotBlueprint(){
  return {
    id:'v11-bocobites-fleur',
    status:'human-review-ready',
    prospect: publicFacts,
    opportunity:{
      primary_asset:'founder expertise + differentiated product + B2B market access',
      primary_opportunity:'b2b-growth-engine',
      confidence:'high',
      rationale:'The strongest near-term opportunity is to structure existing product interest into qualified B2B demand across retail, hospitality, corporate gifting, events and distribution.',
      forecast:false
    },
    domain_strategy:{
      primary:'BOCOBITES existing brand/domain',
      secondary:'Umami365.com',
      decision:'brand-first',
      rationale:'Do not force a portfolio domain onto an established brand. Umami365.com is retained only as an optional future discovery/distribution platform if a broader multi-brand opportunity is validated.'
    },
    conversion_lanes:[
      {slug:'consumer',label:'Consumer',cta:'Shop / discover products',conversion:'purchase'},
      {slug:'retail',label:'Retail & Wholesale',cta:'Request wholesale conversation',conversion:'application'},
      {slug:'hospitality',label:'Hospitality',cta:'Build a hospitality program',conversion:'lead'},
      {slug:'gifting',label:'Corporate Gifting & Events',cta:'Request a tailored quote',conversion:'quote'},
      {slug:'distribution',label:'Distribution',cta:'Discuss market partnership',conversion:'application'}
    ],
    diar_contributes:['AI-assisted intent capture and qualification','B2B lead routing and CRM workflow','Follow-up and opportunity tracking','Conversion analytics and attribution','Optional Umami365.com expansion asset'],
    partner_contributes:['BOCOBITES brand and products','Founder expertise and story','Product/inventory availability subject to BOCOBITES confirmation','Sales execution and partner relationships'],
    guardrails:['No invented revenue or conversion forecast','No claim that Umami365.com is required','No assumption of inventory, capacity or geographic availability','Commercial/JV terms require explicit agreement']
  };
}

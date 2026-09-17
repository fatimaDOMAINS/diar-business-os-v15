const publicFacts = {
  person: 'Alona Lurdes',
  company: 'Dubai luxury real estate',
  role: 'Real estate sales professional / investor-facing creator',
  profile_url: 'https://www.linkedin.com/in/alonalurdes/',
  facts: [
    'Public LinkedIn profile shows roughly 6,000 followers and Dubai real-estate sales activity.',
    'Her public content focuses on premium Dubai property, international investors, broker collaboration and high-value sales.',
    'Third-party creator indexes report a large Instagram audience; exact live follower count must be verified before outreach.',
    'Her public posts describe experience with HNW clients, online sales and international markets.'
  ],
  evidence_status: 'public-source-reviewed-2026-09-16'
};

export function alonaPilotBlueprint(){
  return {
    id:'v12-alona-dubaiestate24',
    status:'human-review-ready',
    prospect:publicFacts,
    opportunity:{
      primary_asset:'investor-facing audience + luxury real-estate sales authority + broker/investor access',
      primary_opportunity:'global-dubai-investor-acquisition-engine',
      confidence:'high',
      rationale:'The opportunity is to convert audience attention into structured investor intent, qualification, property matching and measurable sales conversations.',
      forecast:false
    },
    domain_strategy:{
      primary:'DubaiEstate24.com',
      decision:'domain-led-jv-candidate',
      rationale:'Unlike an established product brand where a new domain could distract, DubaiEstate24.com directly reinforces the category, geography and investor-acquisition proposition.'
    },
    conversion_lanes:[
      {slug:'invest',label:'Investor Discovery',cta:'Build my Dubai investment profile',conversion:'lead'},
      {slug:'luxury',label:'Luxury & Branded Residences',cta:'Show matched opportunities',conversion:'match'},
      {slug:'offplan',label:'Off-Plan',cta:'Compare suitable projects',conversion:'match'},
      {slug:'broker',label:'International Broker Desk',cta:'Bring a qualified client',conversion:'application'},
      {slug:'private',label:'Private Consultation',cta:'Request a private strategy call',conversion:'booking'}
    ],
    investor_profile_fields:['investment budget','preferred property type','location preference','investment vs lifestyle goal','off-plan vs ready preference','timeline','financing preference','preferred contact method'],
    diar_contributes:['DubaiEstate24.com premium domain','DIAR Business OS and investor-intent engine','AI-assisted qualification and matching workflow','CRM, follow-up and opportunity tracking','Attribution and conversion analytics'],
    partner_contributes:['Audience and distribution','Dubai real-estate expertise','Verified inventory/project access','Investor and broker relationships','Sales and closing execution'],
    guardrails:['No invented property availability','No guaranteed yield, appreciation or investment return','No invented follower count or audience quality','Inventory, prices and incentives require live partner/developer confirmation','JV and revenue-share terms require explicit agreement']
  };
}

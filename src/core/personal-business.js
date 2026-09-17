import {analyzeBusinessOpportunity} from './opportunity-engine.js';
const clean=v=>String(v??'').trim();
const parse=(v,f={})=>{try{return JSON.parse(v||JSON.stringify(f))}catch{return f}};
const labels={
 'lead-generation':'Qualified Lead Business','marketplace':'Curated Marketplace','audience-monetization':'Audience-to-Revenue Platform','private-club':'Private Member Business','authority-to-revenue':'Expertise-to-Revenue Platform'
};
const monetization={
 'lead-generation':['Qualified lead fees','Revenue share on converted opportunities'],
 'marketplace':['Transaction commission','Qualified lead fees','Featured partner placement'],
 'audience-monetization':['Revenue share','Qualified lead monetization','Optional membership'],
 'private-club':['Membership','Referral revenue','Revenue share'],
 'authority-to-revenue':['Paid consultation','Qualified leads','Subscription or premium access']
};
function heroFor(p,domain,analysis){
 const who=clean(p.company||p.name||'Your business'),model=labels[analysis.primary_opportunity]||'Digital Business';
 return{eyebrow:`${domain} × ${who}`,headline:`Turn ${who}'s existing market access into a working digital business.`,subheadline:`A personalized ${model.toLowerCase()} built around ${domain} — combining your audience, expertise or distribution with a premium domain and DIAR conversion infrastructure.`,proof_note:'This concept uses declared/profile signals and is a proposal for validation, not a claim of future performance.'};
}
function valueFor(analysis,domain){const asset=(analysis.assets||[])[0]?.type||'market access';return{problem:'Audience and market access often create attention without a structured path to identify intent, qualify demand and convert it into measurable opportunities.',solution:`Use ${domain} as the business asset and connect it to an AI-assisted offer, qualification, CRM and follow-up workflow.`,partner_advantage:`The partner contributes ${asset.replaceAll('_',' ')} and industry execution; DIAR contributes the digital asset and conversion infrastructure.`}}
export async function buildPersonalBusiness(env,tenant,prospectId,b={}){
 const p=await env.DB.prepare(`SELECT * FROM prospect_profiles WHERE id=? AND tenant_id=? AND status='active'`).bind(prospectId,tenant.id).first();if(!p)return null;
 const rec=await env.DB.prepare(`SELECT * FROM prospect_recommendations WHERE tenant_id=? AND prospect_id=? ORDER BY fit_score DESC,created_at DESC LIMIT 1`).bind(tenant.id,prospectId).first();
 const proposal=await env.DB.prepare(`SELECT * FROM prospect_proposals WHERE tenant_id=? AND prospect_id=? ORDER BY updated_at DESC LIMIT 1`).bind(tenant.id,prospectId).first();
 const audience=parse(p.audience_json,{}),contribution=parse(p.contribution_json,{}),profile={name:p.name,company:p.company,role:p.role,industry:b.industry||'',bio:b.bio||'',notes:b.notes||'',markets:b.markets||[],tags:b.tags||[],audience};
 const analysis=b.opportunity||parse(b.opportunity_json,{})||analyzeBusinessOpportunity(profile);const actualAnalysis=analysis.primary_opportunity?analysis:analyzeBusinessOpportunity(profile);
 const domain=clean(b.domain_name||rec?.domain_name||proposal?.domain_name||tenant.domain||tenant.name),businessModel=clean(b.business_model||rec?.business_model||actualAnalysis.primary_opportunity||'lead-generation');
 const hero=heroFor(p,domain,actualAnalysis),value=valueFor(actualAnalysis,domain),money={models:monetization[actualAnalysis.primary_opportunity]||['Revenue share','Qualified lead monetization'],commercial_note:'Exact pricing, revenue share, ownership and obligations require explicit agreement by both parties.'};
 const roles={diar:['Premium domain / digital asset','DIAR business platform','AI-assisted qualification and offer workflow','CRM, follow-up and analytics infrastructure'],partner:[contribution.audience?'Existing audience':'Relevant market access',contribution.expertise?'Industry expertise':'Industry execution',contribution.inventory?'Inventory / supply access':'Distribution and relationships'],shared:['Validate the offer with real users','Measure conversion economics','Agree commercial terms before launch']};
 const journey=['Audience / traffic','Intent captured','Relevant offer','Qualified opportunity','Human sales / transaction workflow','Customer','Measured revenue & retention'];
 const cta={primary:'Discuss this business concept',secondary:'Open the working business engine',note:'No purchase, investment, revenue share or exclusivity is created by viewing this proposal.'};
 const evidence={opportunity_confidence:actualAnalysis.confidence||'low',profile_signals:'declared_or_profile_based',financial_forecast:false,guaranteed_results:false,requires_human_validation:true};
 const id=crypto.randomUUID(),now=new Date().toISOString();
 await env.DB.prepare(`INSERT INTO prospect_business_demos(id,tenant_id,prospect_id,proposal_id,domain_name,vertical_slug,business_model,hero_json,value_proposition_json,monetization_json,roles_json,journey_json,cta_json,evidence_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,'draft',?,?)`).bind(id,tenant.id,prospectId,proposal?.id||null,domain,rec?.vertical_slug||tenant.vertical_slug,businessModel,JSON.stringify(hero),JSON.stringify(value),JSON.stringify(money),JSON.stringify(roles),JSON.stringify(journey),JSON.stringify(cta),JSON.stringify(evidence),now,now).run();
 return{id,domain_name:domain,vertical_slug:rec?.vertical_slug||tenant.vertical_slug,business_model:businessModel,hero,value_proposition:value,monetization:money,roles,journey,cta,evidence,opportunity:actualAnalysis};
}
export async function latestPersonalBusiness(env,tenantId,prospectId){const r=await env.DB.prepare(`SELECT * FROM prospect_business_demos WHERE tenant_id=? AND prospect_id=? ORDER BY updated_at DESC LIMIT 1`).bind(tenantId,prospectId).first();if(!r)return null;return{id:r.id,domain_name:r.domain_name,vertical_slug:r.vertical_slug,business_model:r.business_model,hero:parse(r.hero_json),value_proposition:parse(r.value_proposition_json),monetization:parse(r.monetization_json),roles:parse(r.roles_json),journey:parse(r.journey_json,[]),cta:parse(r.cta_json),evidence:parse(r.evidence_json),status:r.status}}

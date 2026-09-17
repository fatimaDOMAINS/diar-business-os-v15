import {recommendOffers} from './offer-engine.js';
const clean=v=>typeof v==='string'?v.trim():v;
const parse=v=>{try{return JSON.parse(v||'{}')}catch{return{}}};
const clamp=(v,min=0,max=1)=>Math.max(min,Math.min(max,Number(v)||0));
const n=v=>Math.max(0,Number(v)||0);
function scenario(a={}){
 const audience=n(a.audience_size||a.followers);
 const reach=clamp(a.reach_rate);
 const visit=clamp(a.visit_rate);
 const identify=clamp(a.identify_rate);
 const qualify=clamp(a.qualify_rate);
 const close=clamp(a.close_rate);
 const value=n(a.value_per_conversion);
 const reached=Math.round(audience*reach),visitors=Math.round(reached*visit),identified=Math.round(visitors*identify),qualified=Math.round(identified*qualify),conversions=Math.round(qualified*close);
 return {audience,reached,visitors,identified,qualified,conversions,value_per_conversion:value,illustrative_revenue:Math.round(conversions*value),assumption_based:true};
}
export async function buildProposal(env,tenant,prospectId,b={}){
 const p=await env.DB.prepare(`SELECT p.*,a.score audience_score,a.band audience_band FROM prospect_profiles p LEFT JOIN audience_assessments a ON a.id=(SELECT aa.id FROM audience_assessments aa WHERE aa.prospect_id=p.id ORDER BY aa.created_at DESC LIMIT 1) WHERE p.id=? AND p.tenant_id=?`).bind(prospectId,tenant.id).first();
 if(!p)return null;
 const audience=parse(p.audience_json),contribution={...parse(p.contribution_json),...(b.contribution||{})};
 const offers=await recommendOffers(env,tenant.id,b.offer_attributes||audience);
 const selected=b.selected_offer_id?offers.find(x=>x.id===b.selected_offer_id):offers[0];
 const assumptions={audience_size:n(b.assumptions?.audience_size||audience.followers||audience.audience_size),reach_rate:clamp(b.assumptions?.reach_rate),visit_rate:clamp(b.assumptions?.visit_rate),identify_rate:clamp(b.assumptions?.identify_rate),qualify_rate:clamp(b.assumptions?.qualify_rate),close_rate:clamp(b.assumptions?.close_rate),value_per_conversion:n(b.assumptions?.value_per_conversion)};
 const s=scenario(assumptions),now=new Date().toISOString(),id=crypto.randomUUID();
 const title=clean(b.title||`${p.company||p.name} × ${tenant.name}`),commercial=b.commercial||{model:'to-be-agreed',upfront:'not-assumed',revenue_share:'not-assumed'};
 await env.DB.prepare(`INSERT INTO prospect_proposals(id,tenant_id,prospect_id,title,domain_name,business_model,selected_offer_id,assumptions_json,scenario_json,contribution_json,commercial_json,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,'draft',?,?)`).bind(id,tenant.id,p.id,title,tenant.domain||'',clean(b.business_model||'joint-venture'),selected?.id||null,JSON.stringify(assumptions),JSON.stringify(s),JSON.stringify(contribution),JSON.stringify(commercial),now,now).run();
 return {id,title,business_model:clean(b.business_model||'joint-venture'),offer:selected||null,assessment:{score:Number(p.audience_score||0),band:p.audience_band||'D'},assumptions,scenario:s,contribution,commercial};
}
export async function latestProposal(env,tenantId,prospectId){const r=await env.DB.prepare(`SELECT pp.*,o.name offer_name,o.description offer_description FROM prospect_proposals pp LEFT JOIN offers o ON o.id=pp.selected_offer_id WHERE pp.tenant_id=? AND pp.prospect_id=? ORDER BY pp.updated_at DESC LIMIT 1`).bind(tenantId,prospectId).first();if(!r)return null;return{id:r.id,title:r.title,domain_name:r.domain_name,business_model:r.business_model,offer:r.selected_offer_id?{id:r.selected_offer_id,name:r.offer_name,description:r.offer_description}:null,assumptions:parse(r.assumptions_json),scenario:parse(r.scenario_json),contribution:parse(r.contribution_json),commercial:parse(r.commercial_json),status:r.status}}

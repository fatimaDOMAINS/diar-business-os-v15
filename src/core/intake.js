import {createProspect,issueDemoLink} from './prospects.js';
import {buildProposal} from './proposals.js';
import {analyzeBusinessOpportunity,opportunityDomainAdjustment} from './opportunity-engine.js';
const clean=v=>typeof v==='string'?v.trim():v;
const parse=(v,f={})=>{try{return JSON.parse(v||JSON.stringify(f))}catch{return f}};
const norm=v=>String(v||'').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const words=v=>new Set(norm(v).split(/\s+/).filter(Boolean));
const arr=v=>Array.isArray(v)?v:[];
function overlap(a,b){const A=words(arr(a).join(' ')),B=words(arr(b).join(' '));let n=0;for(const x of A)if(B.has(x))n++;return n}
function inferSignals(b={}){
 const text=norm([b.company,b.role,b.industry,b.bio,b.notes,arr(b.tags).join(' '),arr(b.markets).join(' ')].join(' '));
 const rules={
  'real-estate':['real estate','property','broker','developer','realtor','investment property'],
  solar:['solar','renewable','energy','epc','photovoltaic'],
  automotive:['automotive','cars','car dealer','mobility','vehicle'],
  'luxury-services':['luxury','concierge','hospitality','travel','vip'],
  sustainability:['sustainability','eco','climate','esg','green'],
  food:['food','restaurant','chef','culinary','f b','hospitality']
 };
 const vertical_scores={};for(const[k,ks]of Object.entries(rules))vertical_scores[k]=ks.reduce((s,x)=>s+(text.includes(norm(x))?1:0),0);
 return{text,vertical_scores};
}
function chooseBusinessModel(domain,b={}){
 const models=parse(domain.business_models_json,[]),role=norm(b.role),industry=norm(b.industry),followers=Number(b.audience?.followers||b.audience?.audience_size||0);
 const pref=[];
 if(/influencer|creator|media|community/.test(role+' '+industry)||followers>=20000)pref.push('lead-engine','authority-hub','luxury-club');
 if(/broker|agent|consult|advisor|sales/.test(role+' '+industry))pref.push('lead-engine','marketplace');
 if(/developer|provider|installer|dealer|operator/.test(role+' '+industry))pref.push('marketplace','project-platform','booking-platform');
 return pref.find(x=>models.includes(x))||models[0]||'lead-engine';
}
function scoreDomain(domain,b,signals){
 let score=20;const reasons=[],tags=parse(domain.audience_tags_json,[]),markets=parse(domain.markets_json,[]),wantedTags=arr(b.tags).concat([b.industry,b.role]).filter(Boolean),wantedMarkets=arr(b.markets);
 const tagHits=overlap(tags,wantedTags);if(tagHits){score+=Math.min(30,tagHits*10);reasons.push(`Audience/business relevance: ${tagHits} matching signal${tagHits>1?'s':''}.`)}
 const vs=signals.vertical_scores[domain.vertical_slug]||0;if(vs){score+=Math.min(30,vs*10);reasons.push(`Profile text aligns with ${domain.vertical_slug}.`)}
 const marketHits=overlap(markets,wantedMarkets);if(marketHits){score+=Math.min(15,marketHits*8);reasons.push('Geographic/market alignment detected.')}
 const followers=Number(b.audience?.followers||b.audience?.audience_size||0);if(followers>=2000){score+=5;reasons.push('Existing audience can support a distribution-led model; quality still requires validation.')}
 if(!reasons.length)reasons.push('Low-evidence match: recommendation is based on limited declared profile data and should be reviewed manually.');
 return{score:Math.max(0,Math.min(100,score)),reasons};
}
export async function recommendDomains(env,b={},limit=5){
 const r=await env.DB.prepare("SELECT * FROM domain_catalog WHERE status='active' ORDER BY domain_name").all(),signals=inferSignals(b),opportunity=analyzeBusinessOpportunity(b);
 return (r.results||[]).map(d=>{const s=scoreDomain(d,b,signals),adj=opportunityDomainAdjustment(d,opportunity),score=Math.min(100,s.score+adj.bonus),reasons=[...s.reasons,...(adj.reason?[adj.reason]:[])];return{id:d.id,domain_name:d.domain_name,vertical_slug:d.vertical_slug,business_model:adj.business_model||chooseBusinessModel(d,b),fit_score:score,reasons,asset_value_text:d.asset_value_text,markets:parse(d.markets_json,[]),business_models:parse(d.business_models_json,[]),opportunity,evidence:'declared_profile_opportunity_and_catalog_rules'}}).sort((a,b)=>b.fit_score-a.fit_score||a.domain_name.localeCompare(b.domain_name)).slice(0,Math.max(1,Math.min(10,Number(limit)||5)));
}
export async function runProspectIntake(env,tenant,b={}){
 const prospect=await createProspect(env,tenant.id,{name:b.name,company:b.company,role:b.role,audience:b.audience||{},contribution:b.contribution||{}}),now=new Date().toISOString();
 const normalized={name:clean(b.name||''),company:clean(b.company||''),role:clean(b.role||''),industry:clean(b.industry||''),markets:arr(b.markets),tags:arr(b.tags),profile_url:clean(b.profile_url||''),bio:clean(b.bio||''),notes:clean(b.notes||'')};
 await env.DB.prepare(`INSERT INTO prospect_intakes(id,tenant_id,prospect_id,source,profile_url,raw_json,normalized_json,created_at) VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),tenant.id,prospect.id,clean(b.source||'manual'),normalized.profile_url,JSON.stringify(b),JSON.stringify(normalized),now).run();
 const recommendations=await recommendDomains(env,b,5);
 for(const x of recommendations)await env.DB.prepare(`INSERT INTO prospect_recommendations(id,tenant_id,prospect_id,domain_catalog_id,domain_name,vertical_slug,business_model,fit_score,reasons_json,assumptions_json,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,'recommended',?)`).bind(crypto.randomUUID(),tenant.id,prospect.id,x.id,x.domain_name,x.vertical_slug,x.business_model,x.fit_score,JSON.stringify(x.reasons),JSON.stringify({profile_data_is_declared:true,recommendation_is_not_market_valuation:true}),now).run();
 let proposal=null,demo=null;const top=recommendations[0];
 if(top){proposal=await buildProposal(env,{...tenant,domain:top.domain_name},prospect.id,{business_model:top.business_model,commercial:{structure:'joint-venture',note:'Commercial terms require explicit agreement by both parties.'},contribution:{owner:['premium domain','DIAR platform','technology infrastructure'],partner:['audience/distribution','industry expertise'],shared:['conversion testing','commercial execution']}});demo=await issueDemoLink(env,tenant.id,prospect.id,Number(b.demo_days||14));}
 return{prospect,recommendations,proposal,demo:demo?{...demo,demo_path:`/prospect-demo.html?tenant=${encodeURIComponent(tenant.slug)}&token=${encodeURIComponent(demo.token)}`}:null,notice:'Recommendations are rule-based from declared profile data. Review fit and commercial terms before outreach.'};
}
export async function listRecommendations(env,tenantId,prospectId){const r=await env.DB.prepare(`SELECT domain_name,vertical_slug,business_model,fit_score,reasons_json,status,created_at FROM prospect_recommendations WHERE tenant_id=? AND prospect_id=? ORDER BY fit_score DESC,created_at DESC`).bind(tenantId,prospectId).all();return (r.results||[]).map(x=>({...x,reasons:parse(x.reasons_json,[])}))}

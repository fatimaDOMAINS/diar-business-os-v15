import {classifyArchetype} from './archetypes.js';
const clean=v=>String(v??'').trim();
const norm=v=>clean(v).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const arr=v=>Array.isArray(v)?v:clean(v).split(/[;,|]/).map(x=>x.trim()).filter(Boolean);
function has(text,terms){return terms.some(x=>text.includes(x))}
export function analyzeBusinessOpportunity(b={}){
 const archetype=classifyArchetype(b);
 const text=norm([b.company,b.role,b.industry,b.bio,b.notes,arr(b.tags).join(' '),arr(b.markets).join(' ')].join(' '));
 const a=b.audience||{},followers=Number(a.followers||a.audience_size||0),engagement=Number(a.engagement||0);
 const assets=[];
 if(followers>=2000)assets.push({type:'audience',strength:followers>=50000?'high':'medium',evidence:'declared',reason:'Existing distribution audience.'});
 if(engagement>0)assets.push({type:'engagement',strength:engagement>=3?'high':'medium',evidence:'declared',reason:'Declared audience engagement signal.'});
 if(has(text,['broker','agent','advisor','consult','sales']))assets.push({type:'sales_access',strength:'medium',evidence:'profile',reason:'Role suggests direct client or transaction access.'});
 if(has(text,['developer','dealer','provider','installer','operator','agency']))assets.push({type:'inventory_or_supply',strength:'medium',evidence:'profile',reason:'Profile suggests access to inventory, supply or service delivery.'});
 if(has(text,['founder','ceo','owner','managing director','partner']))assets.push({type:'decision_authority',strength:'medium',evidence:'profile',reason:'Role suggests decision-making authority.'});
 if(has(text,['influencer','creator','media','community','publisher']))assets.push({type:'distribution',strength:'high',evidence:'profile',reason:'Profile suggests audience-led distribution capability.'});
 let opportunity='lead-generation',monetization=['qualified-lead','revenue-share'];
 if(assets.some(x=>x.type==='inventory_or_supply')){opportunity='marketplace';monetization=['commission','qualified-lead','featured-listing']}
 if(assets.some(x=>x.type==='distribution')||followers>=20000){opportunity='audience-monetization';monetization=['revenue-share','qualified-lead','membership']}
 if(has(text,['luxury','vip','concierge','family office'])){opportunity='private-club';monetization=['membership','referral','revenue-share']}
 if(has(text,['consult','advisor','expert','coach'])){opportunity='authority-to-revenue';monetization=['consultation','qualified-lead','subscription']}
 const confidence=assets.length>=3?'high':assets.length>=1?'medium':'low';
 return{primary_opportunity:opportunity,monetization_models:monetization,assets,confidence,archetype,notice:'Opportunity analysis uses declared/profile signals and requires human validation before outreach.'};
}
export function opportunityDomainAdjustment(domain,analysis={}){
 const models=(()=>{try{return JSON.parse(domain.business_models_json||'[]')}catch{return[]}})();
 const map={'lead-generation':['lead-engine'],'marketplace':['marketplace','project-platform'],'audience-monetization':['lead-engine','authority-hub','luxury-club'],'private-club':['luxury-club','marketplace'],'authority-to-revenue':['authority-hub','lead-engine']};
 const desired=map[analysis.primary_opportunity]||[];const hit=desired.find(x=>models.includes(x));
 return{bonus:hit?15:0,business_model:hit||models[0]||'lead-engine',reason:hit?`Business model supports ${analysis.primary_opportunity}.`:null};
}

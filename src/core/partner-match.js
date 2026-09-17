const parse=v=>{try{return JSON.parse(v||'{}')}catch{return{}}};
const norm=v=>String(v||'').toLowerCase();
function scorePartner(row,attrs={}){const cap=parse(row.capabilities_json),aud=parse(row.audience_json);let score=0,reasons=[];
 const types=[cap.property_type,cap.property_types].flat().filter(Boolean).map(norm);if(attrs.property_type&&types.includes(norm(attrs.property_type))){score+=30;reasons.push('property_type')}
 const markets=[cap.market,cap.markets].flat().filter(Boolean).map(norm);if(attrs.market&&markets.includes(norm(attrs.market))){score+=25;reasons.push('market')}
 const goals=[cap.goal,cap.goals].flat().filter(Boolean).map(norm);if(attrs.goal&&goals.includes(norm(attrs.goal))){score+=20;reasons.push('goal')}
 if(Number(aud.quality_score||0)){score+=Math.min(20,Math.round(Number(aud.quality_score)/5));reasons.push('audience_quality')}
 if(cap.accepts_leads!==false){score+=5;reasons.push('accepts_leads')}
 return{score,reasons}}
export async function matchPartners(env,tenantId,attrs={},limit=5){const r=await env.DB.prepare(`SELECT * FROM tenant_partners WHERE tenant_id=? AND status='active'`).bind(tenantId).all();return (r.results||[]).map(p=>({...p,match:scorePartner(p,attrs)})).sort((a,b)=>b.match.score-a.match.score||a.name.localeCompare(b.name)).slice(0,limit)}
export async function assignBestPartner(env,tenantId,leadId,attrs={}){const [best]=await matchPartners(env,tenantId,attrs,1);if(!best||best.match.score<=0)return null;const id=crypto.randomUUID(),now=new Date().toISOString();await env.DB.prepare(`INSERT INTO partner_assignments(id,tenant_id,lead_id,partner_id,status,reason_json,assigned_at,updated_at) VALUES(?,?,?,?, 'assigned',?,?,?)`).bind(id,tenantId,leadId,best.id,JSON.stringify(best.match),now,now).run();return{id,partner_id:best.id,partner_name:best.name,...best.match}}

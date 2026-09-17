import {handleCoreApi} from './core/api.js';
import solarVertical from './verticals/solar/index.js';
const H={"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff","referrer-policy":"strict-origin-when-cross-origin","permissions-policy":"camera=(), microphone=(), geolocation=()"};
function secure(r){const h=new Headers(r.headers);h.set("x-content-type-options","nosniff");h.set("referrer-policy","strict-origin-when-cross-origin");h.set("permissions-policy","camera=(), microphone=(), geolocation=()");h.set("content-security-policy","default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");return new Response(r.body,{status:r.status,statusText:r.statusText,headers:h})}

function j(x,s=200){return new Response(JSON.stringify(x),{status:s,headers:H})}
function c(v){return typeof v==="string"?v.trim():v}
function plusMin(m){return new Date(Date.now()+Number(m||240)*60000).toISOString()}
async function digest(v){return new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v||""))))}
async function eq(a,b){const[A,B]=await Promise.all([digest(a),digest(b)]);let d=A.length^B.length;for(let i=0;i<Math.min(A.length,B.length);i++)d|=A[i]^B[i];return d===0}
async function hashHex(v){return [...await digest(v)].map(x=>x.toString(16).padStart(2,"0")).join("")}

function parseIntent(q=""){
 const i=solarVertical.parseIntent(q);
 return {project_type:i.attributes.project_type,provider_type:i.provider_type};
}
function providerTypeFromLead(b){
 if(b.provider_type)return b.provider_type;
 const p=b.project_type||"";
 if(p==="storage")return"storage-integrator";
 if(p==="commercial-solar")return"epc";
 if(p==="utility-scale")return"developer";
 if(p==="monitoring-software")return"software";
 if(p==="solar-financing")return"financing";
 return"installer";
}

async function audit(env,entityType,entityId,action,actorType,actorId=null,meta={}){
 await env.DB.prepare("INSERT INTO audit_log(id,entity_type,entity_id,action,actor_type,actor_id,meta_json) VALUES(?,?,?,?,?,?,?)")
 .bind(crypto.randomUUID(),entityType,entityId,action,actorType,actorId,JSON.stringify(meta)).run()
}

async function listProviders(env,type=null,country=null){
 let sql=`SELECT p.*,s.status subscription_status,c.status contract_status,r.review_status
 FROM providers p
 LEFT JOIN subscriptions s ON s.provider_id=p.id
 LEFT JOIN commercial_contracts c ON c.provider_id=p.id
 LEFT JOIN provider_reviews r ON r.provider_id=p.id
 WHERE p.active=1 AND p.marketplace_enabled=1`,params=[];
 if(type){sql+=" AND p.provider_type=?";params.push(type)}
 if(country){sql+=" AND (p.country=? OR p.country='Global')";params.push(country)}
 sql+=" ORDER BY p.featured DESC,p.verified DESC,p.name";
 const st=env.DB.prepare(sql),res=params.length?await st.bind(...params).all():await st.all();
 return res.results||[]
}

async function advisor(env,q){
 const i=parseIntent(q),matches=await listProviders(env,i.provider_type,null);
 let summary=`Recommended path: ${i.project_type}. Confirm site-specific engineering, production estimates, pricing, payback assumptions, incentives, grid/interconnection requirements, equipment availability, warranties and installation timeline directly with a qualified provider.`;
 if(env.AI){try{
  const o=await env.AI.run("@cf/meta/llama-3.1-8b-instruct",{messages:[
   {role:"system",content:"You are SolarEnergy24.com Solar Project Advisor. Never invent production yields, savings, payback, electricity tariffs, incentives, equipment availability, warranty terms, installation dates, permitting status, grid approval, certifications, financing approval or project pricing. Require site-specific engineering and current provider confirmation."},
   {role:"user",content:q}
  ]});if(o?.response)summary=o.response;
 }catch{}}
 return{intent:i,summary,matches}
}

async function eligible(env,b,exclude=""){
 const type=providerTypeFromLead(b);
 const r=await env.DB.prepare(`
 SELECT p.*,
 (SELECT COUNT(*) FROM leads l WHERE l.provider_id=p.id AND l.partner_status IN ('new','accepted','contacted')) open_leads,
 (SELECT MAX(l2.assigned_at) FROM leads l2 WHERE l2.provider_id=p.id) last_assignment
 FROM providers p
 WHERE p.active=1 AND p.accepts_leads=1 AND p.marketplace_enabled=1
 AND p.provider_type=? AND p.id<>COALESCE(?, '')
 AND EXISTS(SELECT 1 FROM commercial_contracts c WHERE c.provider_id=p.id AND c.status='accepted')
 AND EXISTS(SELECT 1 FROM provider_reviews r WHERE r.provider_id=p.id AND r.review_status IN ('approved','demo-only'))
 AND (p.partner_tier='free' OR EXISTS(SELECT 1 FROM subscriptions s WHERE s.provider_id=p.id AND s.status IN ('active','trialing')))
 ORDER BY open_leads ASC,COALESCE(last_assignment,'') ASC,p.name ASC
 `).bind(type,exclude||"").all();
 return r.results||[]
}
async function choose(env,b,exclude=""){return (await eligible(env,b,exclude))[0]||null}

async function saveLead(env,b,request){
 const sid=await trackSession(env,request,{session_id:b.session_id,source:b.source,utm_source:b.utm_source,utm_medium:b.utm_medium,utm_campaign:b.utm_campaign,landing_path:b.landing_path,event_name:"lead_created"});
 const vs=await env.DB.prepare("SELECT * FROM visitor_sessions WHERE id=?").bind(sid).first();
 const exps=await experimentsFor(env,sid);
 const pers=solarSegment({...b,source:vs?.first_source,utm_source:vs?.utm_source});
 await env.DB.prepare("INSERT INTO personalization_events(id,session_id,segment,reason_json) VALUES(?,?,?,?)")
  .bind(crypto.randomUUID(),sid,pers.segment,JSON.stringify(pers.reasons)).run();

 const id=crypto.randomUUID(),p=b.provider_id?{id:b.provider_id,sla_minutes:240}:await choose(env,b);
 let sla=Number(p?.sla_minutes||240);
 if(p?.id){const x=await env.DB.prepare("SELECT sla_minutes FROM providers WHERE id=?").bind(p.id).first();sla=Number(x?.sla_minutes||sla)}
 const at=p?.id?new Date().toISOString():null,due=p?.id?plusMin(sla):null;
 const reason={method:"provider_type+eligibility+least-open-load+oldest-last-assignment",featured_ignored:true};
 await env.DB.prepare(`INSERT INTO leads
 (id,name,company,contact,buyer_type,project_type,country,city,property_type,roof_or_site_text,estimated_consumption_text,budget_text,storage_required,timeline,notes,provider_id,status,domain_profile,partner_status,assigned_at,sla_due_at,routing_reason_json,
 session_id,first_source,last_source,first_landing,last_landing,experiment_json,personalization_segment,personalization_reason_json)
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,'new','solarenergy24','new',?,?,?,?,?,?,?,?,?,?,?)`)
 .bind(id,c(b.name),c(b.company||""),c(b.contact),c(b.buyer_type),c(b.project_type),c(b.country||""),c(b.city||""),c(b.property_type||""),c(b.roof_or_site_text||""),c(b.estimated_consumption_text||""),c(b.budget_text||""),b.storage_required?1:0,c(b.timeline||""),c(b.notes||""),p?.id||null,at,due,JSON.stringify(reason),sid,vs?.first_source||null,vs?.last_source||null,vs?.first_landing||null,vs?.last_landing||null,JSON.stringify(exps),pers.segment,JSON.stringify(pers.reasons)).run();
 if(p?.id)await audit(env,"lead",id,"assigned","system",p.id,{sla_minutes:sla,routing:reason});
 const brief=await saveProjectBrief(env,id,b);
 if(p?.id)await scheduleFollowup(env,id,p.id,"qualification",brief?.band==="READY"?6:brief?.band==="PARTIAL"?24:48);
 await createDealRoom(env,id);
 return{id,provider_id:p?.id||null,sla_due_at:due,session_id:sid,segment:pers.segment,experiments:exps,brief}
}

async function auth(request,env){
 const bearer=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"");
 if(bearer){
  const h=await hashHex(bearer);
  const row=await env.DB.prepare("SELECT provider_id FROM provider_sessions WHERE session_hash=? AND datetime(expires_at)>datetime('now')").bind(h).first();
  if(row?.provider_id)return row.provider_id
 }
 const id=request.headers.get("x-provider-id"),key=request.headers.get("x-partner-key");
 if(!id)return null;
 if(env.ALLOW_LEGACY_PARTNER_AUTH==="true"&&env.PARTNER_KEYS){
  const map=Object.fromEntries(env.PARTNER_KEYS.split(",").map(x=>x.split(":")));
  if(map[id]&&await eq(map[id],key))return id
 }
 return null
}

async function profile(env,id){
 return await env.DB.prepare(`SELECT p.*,pp.name package_name,pp.monthly_fee_usd,pp.accepted_lead_fee_usd,
 s.status subscription_status,c.status contract_status,r.review_status
 FROM providers p
 LEFT JOIN partner_packages pp ON pp.id=p.partner_tier
 LEFT JOIN subscriptions s ON s.provider_id=p.id
 LEFT JOIN commercial_contracts c ON c.provider_id=p.id
 LEFT JOIN provider_reviews r ON r.provider_id=p.id
 WHERE p.id=? ORDER BY c.created_at DESC LIMIT 1`).bind(id).first()
}

async function providerLeads(env,id){
 const r=await env.DB.prepare(`SELECT id,name,company,contact,buyer_type,project_type,country,city,property_type,roof_or_site_text,estimated_consumption_text,budget_text,storage_required,timeline,notes,
 partner_status,created_at,assigned_at,sla_due_at,sla_breached,reroute_count,owner_attention,accepted_at,contacted_at,completed_at
 FROM leads WHERE provider_id=? ORDER BY created_at DESC LIMIT 100`).bind(id).all();
 return r.results||[]
}

async function act(env,pid,lid,action,note=""){
 const lead=await env.DB.prepare("SELECT id FROM leads WHERE id=? AND provider_id=?").bind(lid,pid).first();
 if(!lead)return{error:"Lead not found or not assigned"};
 let sql=null,status=null;
 if(action==="accept"){sql="UPDATE leads SET partner_status='accepted',accepted_at=CURRENT_TIMESTAMP,partner_note=? WHERE id=? AND provider_id=?";status="accepted"}
 if(action==="decline"){sql="UPDATE leads SET partner_status='declined',partner_note=? WHERE id=? AND provider_id=?";status="declined"}
 if(action==="contacted"){sql="UPDATE leads SET partner_status='contacted',contacted_at=CURRENT_TIMESTAMP,partner_note=? WHERE id=? AND provider_id=?";status="contacted"}
 if(action==="completed"){sql="UPDATE leads SET partner_status='completed',completed_at=CURRENT_TIMESTAMP,partner_note=? WHERE id=? AND provider_id=?";status="completed"}
 if(!sql)return{error:"Unsupported action"};
 await env.DB.prepare(sql).bind(note,lid,pid).run();await audit(env,"lead",lid,action,"provider",pid,{note});
 if(action==="completed"||action==="decline")await closeFollowups(env,lid,pid);
 if(action==="contacted")await scheduleFollowup(env,lid,pid,"post_contact",24);
 if(action==="accept")await scheduleFollowup(env,lid,pid,"accepted_lead",12);
 if(action==="accept"){
  const p=await env.DB.prepare(`SELECT pp.accepted_lead_fee_usd FROM providers pr LEFT JOIN partner_packages pp ON pp.id=pr.partner_tier WHERE pr.id=?`).bind(pid).first();
  const fee=Number(p?.accepted_lead_fee_usd||0);
  if(fee>0)await env.DB.prepare("INSERT INTO billing_events(id,provider_id,lead_id,event_type,amount_usd,description) VALUES(?,?,?,?,?,?)")
   .bind(crypto.randomUUID(),pid,lid,"accepted_solar_project_lead",fee,"Accepted SolarEnergy24.com project lead").run()
 }
 return{ok:true,status}
}

async function sweep(env){
 const r=await env.DB.prepare("SELECT * FROM leads WHERE provider_id IS NOT NULL AND partner_status='new' AND sla_due_at IS NOT NULL AND datetime(sla_due_at)<=datetime('now') LIMIT 100").all();
 let rerouted=0,escalated=0;
 for(const l of r.results||[]){
  await env.DB.prepare("UPDATE leads SET sla_breached=1 WHERE id=?").bind(l.id).run();
  await audit(env,"lead",l.id,"sla_breach","system",l.provider_id,{due_at:l.sla_due_at});
  if(Number(l.reroute_count||0)>=3){
   await env.DB.prepare("UPDATE leads SET owner_attention=1,escalated_at=CURRENT_TIMESTAMP WHERE id=?").bind(l.id).run();
   await audit(env,"lead",l.id,"owner_escalation","system",l.provider_id,{reason:"reroute_cap_reached"});escalated++;continue
  }
  const n=await choose(env,l,l.provider_id);
  if(n){
   const due=plusMin(n.sla_minutes||240),reason={method:"provider_type+eligibility+least-open-load+oldest-last-assignment",featured_ignored:true,reroute:true};
   await env.DB.prepare("UPDATE leads SET provider_id=?,assigned_at=CURRENT_TIMESTAMP,sla_due_at=?,sla_breached=0,reroute_count=reroute_count+1,partner_status='new',routing_reason_json=? WHERE id=?")
    .bind(n.id,due,JSON.stringify(reason),l.id).run();
   await audit(env,"lead",l.id,"rerouted","system",n.id,{from:l.provider_id,routing:reason});
   await closeFollowups(env,l.id,l.provider_id);
   await scheduleFollowup(env,l.id,n.id,"rerouted_lead",24);
   rerouted++
  }else{
   await env.DB.prepare("UPDATE leads SET owner_attention=1,escalated_at=CURRENT_TIMESTAMP WHERE id=?").bind(l.id).run();
   await audit(env,"lead",l.id,"owner_escalation","system",l.provider_id,{reason:"no_eligible_provider"});escalated++
  }
 }
 return{checked:(r.results||[]).length,rerouted,escalated}
}

async function statement(env,id,month){
 const start=month+"-01",d=new Date(start+"T00:00:00Z");d.setUTCMonth(d.getUTCMonth()+1);const end=d.toISOString().slice(0,10);
 const p=await env.DB.prepare(`SELECT pp.monthly_fee_usd FROM providers pr LEFT JOIN partner_packages pp ON pp.id=pr.partner_tier WHERE pr.id=?`).bind(id).first();
 if(!p)return null;
 const f=await env.DB.prepare("SELECT COALESCE(SUM(amount_usd),0) v FROM billing_events WHERE provider_id=? AND created_at>=? AND created_at<?").bind(id,start,end).first();
 const monthly=Number(p.monthly_fee_usd||0),leadFees=Number(f?.v||0),total=monthly+leadFees;
 await env.DB.prepare(`INSERT INTO monthly_statements(id,provider_id,statement_month,monthly_fee_usd,lead_fees_usd,total_usd,status) VALUES(?,?,?,?,?,?,'draft')
 ON CONFLICT(provider_id,statement_month) DO UPDATE SET monthly_fee_usd=excluded.monthly_fee_usd,lead_fees_usd=excluded.lead_fees_usd,total_usd=excluded.total_usd`)
 .bind(crypto.randomUUID(),id,month,monthly,leadFees,total).run();
 return{provider_id:id,statement_month:month,monthly_fee_usd:monthly,lead_fees_usd:leadFees,total_usd:total}
}

async function apply(env,b){
 const id=crypto.randomUUID();
 await env.DB.prepare(`INSERT INTO provider_applications
 (id,company_name,contact_name,email,phone,provider_type,country,city,services,system_types,commercial_model_claimed,licensing_claimed,engineering_credentials_claimed,grid_interconnection_scope_claimed,certifications_claimed,storage_capability_claimed,website,package_id,notes)
 VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
 .bind(id,c(b.company_name),c(b.contact_name),c(b.email),c(b.phone||""),c(b.provider_type),c(b.country||""),c(b.city||""),c(b.services||""),c(b.system_types||""),c(b.commercial_model_claimed||""),c(b.licensing_claimed||""),c(b.engineering_credentials_claimed||""),c(b.grid_interconnection_scope_claimed||""),c(b.certifications_claimed||""),b.storage_capability_claimed?1:0,c(b.website||""),c(b.package_id||"free"),c(b.notes||"")).run();
 return{ok:true,id}
}

async function reviewApp(env,id,decision){
 const a=await env.DB.prepare("SELECT * FROM provider_applications WHERE id=?").bind(id).first();if(!a)return{error:"Application not found"};
 if(decision==="reject"){await env.DB.prepare("UPDATE provider_applications SET status='rejected',reviewed_at=CURRENT_TIMESTAMP,reviewed_by='owner' WHERE id=?").bind(id).run();return{ok:true,status:"rejected"}}
 if(decision!=="approve")return{error:"Invalid decision"};
 const pid="se24-"+crypto.randomUUID().slice(0,8),tier=a.package_id||"free",sla=tier==="featured"?120:tier==="partner"?240:480,pkg=await env.DB.prepare("SELECT featured FROM partner_packages WHERE id=?").bind(tier).first();
 await env.DB.prepare(`INSERT INTO providers
 (id,name,provider_type,country,city,services,system_types,commercial_model,project_size_text,storage_capability,featured,verified,active,partner_tier,accepts_leads,sla_minutes,marketplace_enabled)
 VALUES(?,?,?,?,?,?,?,?,?, ?,?,0,1,?,1,?,0)`)
 .bind(pid,a.company_name,a.provider_type,a.country||"",a.city||"",a.services||"",a.system_types||"",a.commercial_model_claimed||"Pending confirmation","Pending confirmation",a.storage_capability_claimed?1:0,Number(pkg?.featured||0),tier,sla).run();
 await env.DB.prepare("UPDATE provider_applications SET status='approved',reviewed_at=CURRENT_TIMESTAMP,reviewed_by='owner' WHERE id=?").bind(id).run();
 await env.DB.prepare("INSERT INTO commercial_contracts(id,provider_id,terms_version,package_id,status) VALUES(?,?,?,?, 'pending_acceptance')").bind(crypto.randomUUID(),pid,"2026-08",tier).run();
 await env.DB.prepare("INSERT INTO subscriptions(id,provider_id,package_id,status) VALUES(?,?,?,?)").bind(crypto.randomUUID(),pid,tier,tier==="free"?"active":"pending").run();
 await env.DB.prepare("INSERT INTO provider_reviews(id,provider_id) VALUES(?,?)").bind(crypto.randomUUID(),pid).run();
 return{ok:true,status:"approved",provider_id:pid}
}

async function sync(env,id){
 const p=await env.DB.prepare("SELECT partner_tier FROM providers WHERE id=?").bind(id).first();
 const c=await env.DB.prepare("SELECT status FROM commercial_contracts WHERE provider_id=? ORDER BY created_at DESC LIMIT 1").bind(id).first();
 const s=await env.DB.prepare("SELECT status FROM subscriptions WHERE provider_id=?").bind(id).first();
 const r=await env.DB.prepare("SELECT review_status FROM provider_reviews WHERE provider_id=?").bind(id).first();
 const enabled=(c?.status==="accepted"&&r?.review_status==="approved"&&(p?.partner_tier==="free"||["active","trialing"].includes(s?.status||"")))?1:0;
 await env.DB.prepare("UPDATE providers SET marketplace_enabled=?,verified=? WHERE id=?").bind(enabled,r?.review_status==="approved"?1:0,id).run();
 return enabled
}

async function reviewProvider(env,b){
 await env.DB.prepare(`UPDATE provider_reviews
 SET identity_check=?,licensing_check=?,engineering_check=?,grid_scope_check=?,certification_check=?,review_status=?,reviewer_note=?,reviewed_at=CURRENT_TIMESTAMP,reviewed_by='owner'
 WHERE provider_id=?`)
 .bind(c(b.identity_check||"pending"),c(b.licensing_check||"pending"),c(b.engineering_check||"pending"),c(b.grid_scope_check||"pending"),c(b.certification_check||"pending"),c(b.review_status||"pending"),c(b.reviewer_note||""),b.provider_id).run();
 return{ok:true,marketplace_enabled:await sync(env,b.provider_id)}
}

async function magic(env,id,origin){
 const p=await env.DB.prepare("SELECT id FROM providers WHERE id=?").bind(id).first();if(!p)return{error:"Provider not found"};
 const token=crypto.randomUUID()+crypto.randomUUID(),hash=await hashHex(token),expires=new Date(Date.now()+15*60000).toISOString();
 await env.DB.prepare("INSERT INTO login_tokens(id,provider_id,token_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),id,hash,expires).run();
 return{ok:true,magic_url:`${origin}/account.html?token=${encodeURIComponent(token)}`,expires_at:expires}
}

async function exchange(env,token){
 const h=await hashHex(token),row=await env.DB.prepare("SELECT * FROM login_tokens WHERE token_hash=? AND used_at IS NULL AND datetime(expires_at)>datetime('now')").bind(h).first();
 if(!row)return{error:"Invalid or expired token"};
 await env.DB.prepare("UPDATE login_tokens SET used_at=CURRENT_TIMESTAMP WHERE id=?").bind(row.id).run();
 const session=crypto.randomUUID()+crypto.randomUUID(),sh=await hashHex(session),expires=new Date(Date.now()+7*24*3600000).toISOString();
 await env.DB.prepare("INSERT INTO provider_sessions(id,provider_id,session_hash,expires_at) VALUES(?,?,?,?)").bind(crypto.randomUUID(),row.provider_id,sh,expires).run();
 return{ok:true,provider_id:row.provider_id,session,expires_at:expires}
}

async function acceptContract(env,id,b){
 const c1=await env.DB.prepare("SELECT * FROM commercial_contracts WHERE provider_id=? ORDER BY created_at DESC LIMIT 1").bind(id).first();
 if(!c1)return{error:"Contract not found"};
 await env.DB.prepare("UPDATE commercial_contracts SET status='accepted',accepted_by=?,accepted_at=CURRENT_TIMESTAMP,starts_at=COALESCE(starts_at,CURRENT_TIMESTAMP) WHERE id=?")
 .bind(c(b.accepted_by||"Authorized representative"),c1.id).run();
 return{ok:true,marketplace_enabled:await sync(env,id)}
}

async function stats(env){
 const scalar=async sql=>Number((await env.DB.prepare(sql).first())?.v||0);
 return{
  providers:await scalar("SELECT COUNT(*) v FROM providers WHERE active=1"),
  live_providers:await scalar("SELECT COUNT(*) v FROM providers WHERE active=1 AND marketplace_enabled=1"),
  pending_reviews:await scalar("SELECT COUNT(*) v FROM provider_reviews WHERE review_status='pending'"),
  leads:await scalar("SELECT COUNT(*) v FROM leads"),
  accepted:await scalar("SELECT COUNT(*) v FROM leads WHERE partner_status IN ('accepted','contacted','completed')"),
  sla_breaches:await scalar("SELECT COUNT(*) v FROM audit_log WHERE action='sla_breach'"),
  owner_attention:await scalar("SELECT COUNT(*) v FROM leads WHERE owner_attention=1"),
  billable_usd:await scalar("SELECT COALESCE(SUM(amount_usd),0) v FROM billing_events")
 }
}


function solarSegment(b={}){
 const buyer=(b.buyer_type||"business").toLowerCase();
 const project=(b.project_type||"residential-solar").toLowerCase();
 const country=(b.country||"").toLowerCase();
 const property=(b.property_type||"").toLowerCase();
 const storage=!!b.storage_required;
 const source=(b.utm_source||b.source||"").toLowerCase();

 let segment="Solar Project Buyer";
 if(buyer==="homeowner")segment="Homeowner";
 else if(buyer==="business")segment="Commercial Energy Buyer";
 else if(buyer==="developer")segment="Property / Project Developer";
 else if(buyer==="investor")segment="Solar Investor";
 else if(buyer==="installer")segment="Installer / EPC";

 if(project==="residential-solar")segment="Residential Solar Buyer";
 else if(project==="commercial-solar")segment="Commercial Solar Buyer";
 else if(project==="storage")segment="Solar + Storage Buyer";
 else if(project==="utility-scale")segment="Utility-Scale Solar Buyer";
 else if(project==="solar-financing")segment="Solar Financing Buyer";
 else if(project==="monitoring-software")segment="Solar Software Buyer";

 if(storage && project!=="storage")segment+=" + Storage";

 const reasons={buyer_type:buyer,project_type:project};
 if(country)reasons.country=b.country;
 if(property)reasons.property_type=b.property_type;
 if(storage)reasons.storage_required=true;
 if(source)reasons.source=source;
 return{segment,reasons};
}

async function trackSession(env,request,b={}){
 const sid=(b.session_id&&String(b.session_id).length<128)?b.session_id:crypto.randomUUID();
 const raw=b.utm_source||b.source||"direct";
 let source="direct";
 try{
   if(raw&&/^https?:\/\//i.test(raw))source=new URL(raw).hostname;
   else source=String(raw||"direct").slice(0,120);
 }catch{source="direct";}
 const landing=b.landing_path||new URL(request.url).pathname;

 const existing=await env.DB.prepare("SELECT id FROM visitor_sessions WHERE id=?").bind(sid).first();
 if(existing){
   await env.DB.prepare(`UPDATE visitor_sessions
    SET last_source=?,last_landing=?,utm_source=?,utm_medium=?,utm_campaign=?,last_seen_at=CURRENT_TIMESTAMP
    WHERE id=?`).bind(source,landing,b.utm_source||null,b.utm_medium||null,b.utm_campaign||null,sid).run();
 }else{
   await env.DB.prepare(`INSERT INTO visitor_sessions
    (id,first_source,last_source,first_landing,last_landing,utm_source,utm_medium,utm_campaign)
    VALUES(?,?,?,?,?,?,?,?)`)
    .bind(sid,source,source,landing,landing,b.utm_source||null,b.utm_medium||null,b.utm_campaign||null).run();
 }
 await env.DB.prepare(`INSERT INTO attribution_touches
  (id,session_id,source,landing_path,utm_source,utm_medium,utm_campaign,event_name)
  VALUES(?,?,?,?,?,?,?,?)`)
  .bind(crypto.randomUUID(),sid,source,landing,b.utm_source||null,b.utm_medium||null,b.utm_campaign||null,b.event_name||"page_view").run();
 return sid;
}

async function experimentsFor(env,sid){
 const out={},ex=await env.DB.prepare("SELECT * FROM experiments WHERE status='active'").all();
 for(const e of ex.results||[]){
   let a=await env.DB.prepare(`SELECT ea.variant_id,ev.payload_json FROM experiment_assignments ea
    JOIN experiment_variants ev ON ev.id=ea.variant_id
    WHERE ea.experiment_id=? AND ea.session_id=?`).bind(e.id,sid).first();
   if(!a){
     const vars=(await env.DB.prepare("SELECT * FROM experiment_variants WHERE experiment_id=? ORDER BY id").bind(e.id).all()).results||[];
     if(!vars.length)continue;
     const h=await hashHex(sid+":"+e.id),n=parseInt(h.slice(0,8),16)%100;
     let acc=0,chosen=vars[0];
     for(const v of vars){acc+=Number(v.weight||0);if(n<acc){chosen=v;break;}}
     await env.DB.prepare("INSERT OR IGNORE INTO experiment_assignments(id,experiment_id,session_id,variant_id) VALUES(?,?,?,?)")
      .bind(crypto.randomUUID(),e.id,sid,chosen.id).run();
     a={variant_id:chosen.id,payload_json:chosen.payload_json};
   }
   out[e.id]={id:a.variant_id,payload:JSON.parse(a.payload_json||"{}")};
 }
 return out;
}

async function contentList(env){
 const r=await env.DB.prepare("SELECT slug,title,category,summary,published_at FROM content_items WHERE status='published' ORDER BY published_at DESC").all();
 return r.results||[];
}

async function vipStats(env){
 const scalar=async sql=>Number((await env.DB.prepare(sql).first())?.v||0);
 const sessions=await scalar("SELECT COUNT(*) v FROM visitor_sessions");
 const leads=await scalar("SELECT COUNT(*) v FROM leads");
 const sources=(await env.DB.prepare("SELECT COALESCE(first_source,'unknown') source,COUNT(*) sessions FROM visitor_sessions GROUP BY first_source ORDER BY sessions DESC").all()).results||[];
 const segments=(await env.DB.prepare("SELECT COALESCE(personalization_segment,'Unknown') segment,COUNT(*) leads FROM leads GROUP BY personalization_segment ORDER BY leads DESC").all()).results||[];
 const experiments=(await env.DB.prepare(`SELECT e.id experiment_id,ev.id variant_id,ev.name,COUNT(DISTINCT ea.session_id) sessions
  FROM experiments e JOIN experiment_variants ev ON ev.experiment_id=e.id
  LEFT JOIN experiment_assignments ea ON ea.experiment_id=e.id AND ea.variant_id=ev.id
  GROUP BY e.id,ev.id,ev.name ORDER BY e.id,ev.id`).all()).results||[];
 return{sessions,leads,conversion_rate:sessions?Math.round(leads/sessions*10000)/100:0,sources,segments,experiments};
}


function solarReadiness(b={}){
 let score=20,missing=[],risk=[];
 const add=(ok,pts,label)=>{if(ok)score+=pts;else missing.push(label);};

 add(b.name&&b.contact,15,"contact");
 add(b.project_type,10,"project type");
 add(b.country||b.city,10,"project location");
 add(b.property_type,10,"property/site type");
 add(b.roof_or_site_text,10,"roof/site context");
 add(b.estimated_consumption_text,10,"consumption data");
 add(b.site_data_ready!==undefined,5,"site-data status");
 add(b.consumption_data_ready!==undefined,5,"consumption-data status");
 add(b.grid_status_ready!==undefined,5,"grid/interconnection status");
 add(b.financing_context_ready!==undefined,5,"financing context");

 score=Math.min(score,100);

 const txt=[b.notes,b.budget_text,b.estimated_consumption_text].filter(Boolean).join(" ").toLowerCase();
 if(/guaranteed savings|guaranteed payback|guaranteed yield|guaranteed production/.test(txt))risk.push("unsupported-performance-guarantee");
 if(/grid approved|permit approved|financing approved/.test(txt))risk.push("approval-must-be-verified");
 const band=score>=80?"READY":score>=55?"PARTIAL":"BASIC";

 let action=band==="READY"
   ?"Confirm site survey, engineering design, production model, equipment availability, grid requirements, commercial quote and warranty terms with the provider."
   :band==="PARTIAL"
     ?"Clarify missing site, consumption, grid and financing context before provider engagement."
     :"Qualify the solar project brief further before routing.";
 if(risk.length)action+=" Do not present production, savings, payback, grid, permit or financing claims as verified without current provider or authority evidence.";
 return{score,band,missing,risk_flags:risk,recommended_next_action:action};
}

async function saveProjectBrief(env,leadId,b){
 const r=solarReadiness(b);
 const summary=`${r.band} ${r.score}/100 · ${b.project_type||"project not stated"} · ${b.country||b.city||"location not stated"} · ${b.property_type||"site type not stated"}.`;
 await env.DB.prepare(`UPDATE leads SET readiness_score=?,readiness_band=?,site_data_ready=?,consumption_data_ready=?,grid_status_ready=?,financing_context_ready=?,preferred_contact=? WHERE id=?`)
  .bind(r.score,r.band,b.site_data_ready?1:0,b.consumption_data_ready?1:0,b.grid_status_ready?1:0,b.financing_context_ready?1:0,c(b.preferred_contact||""),leadId).run();

 await env.DB.prepare(`INSERT INTO project_briefs(id,lead_id,score,band,summary,missing_json,risk_flags_json,recommended_next_action)
 VALUES(?,?,?,?,?,?,?,?)
 ON CONFLICT(lead_id) DO UPDATE SET score=excluded.score,band=excluded.band,summary=excluded.summary,missing_json=excluded.missing_json,risk_flags_json=excluded.risk_flags_json,recommended_next_action=excluded.recommended_next_action,updated_at=CURRENT_TIMESTAMP`)
  .bind(crypto.randomUUID(),leadId,r.score,r.band,summary,JSON.stringify(r.missing),JSON.stringify(r.risk_flags),r.recommended_next_action).run();

 return{...r,summary};
}

async function scheduleFollowup(env,leadId,providerId,type="qualification",hours=24){
 const existing=await env.DB.prepare(`SELECT id FROM followups WHERE lead_id=? AND provider_id=? AND status='open' AND followup_type=? LIMIT 1`)
  .bind(leadId,providerId,type).first();
 if(existing)return existing.id;
 const id=crypto.randomUUID(),due=new Date(Date.now()+hours*3600000).toISOString();
 await env.DB.prepare(`INSERT INTO followups(id,lead_id,provider_id,due_at,followup_type,status) VALUES(?,?,?,?,?,'open')`)
  .bind(id,leadId,providerId,due,type).run();
 return id;
}

async function closeFollowups(env,leadId,providerId){
 await env.DB.prepare(`UPDATE followups SET status='completed',completed_at=CURRENT_TIMESTAMP WHERE lead_id=? AND provider_id=? AND status='open'`)
  .bind(leadId,providerId).run();
}

async function providerCopilot(env,providerId,leadId,type="first_response"){
 const lead=await env.DB.prepare("SELECT * FROM leads WHERE id=? AND provider_id=?").bind(leadId,providerId).first();
 if(!lead)return{error:"Lead not found or not assigned"};
 const brief=await env.DB.prepare("SELECT * FROM project_briefs WHERE lead_id=?").bind(leadId).first();

 let output=type==="clarification"
 ?`Thank you for the SolarEnergy24.com project brief. Before confirming fit, please clarify site dimensions or roof availability, electricity-consumption data, grid/interconnection status, storage objective, budget context and target timeline. Production, savings, payback, equipment, permits, warranties and pricing must be confirmed through site-specific engineering and current provider data.`
 :type==="follow_up"
  ?`Following up on your SolarEnergy24.com project. If the project is still active, we can continue once the site, consumption, grid and commercial inputs are confirmed.`
  :`Thank you for your SolarEnergy24.com project regarding ${lead.project_type||"solar energy"}. We can review the brief and confirm site requirements, engineering scope, grid considerations and commercial next steps with the provider.`;

 if(env.AI){try{
  const r=await env.AI.run("@cf/meta/llama-3.1-8b-instruct",{messages:[
   {role:"system",content:"Draft a concise B2B solar project response. Never invent production yield, savings, payback, tariffs, incentives, equipment availability, warranties, installation dates, permits, grid approval, certifications, financing approval or pricing. Use only supplied facts and clearly mark missing information."},
   {role:"user",content:JSON.stringify({type,lead,brief})}
  ]});
  if(r?.response)output=r.response;
 }catch{}}

 const id=crypto.randomUUID();
 await env.DB.prepare("INSERT INTO copilot_drafts(id,provider_id,lead_id,draft_type,output_text) VALUES(?,?,?,?,?)")
  .bind(id,providerId,leadId,type,output).run();
 return{id,type,output};
}

async function followupQueue(env,providerId){
 const r=await env.DB.prepare(`SELECT f.*,l.name,l.company,l.buyer_type,l.project_type,l.country,l.city,l.property_type,l.estimated_consumption_text,l.readiness_band,l.readiness_score
 FROM followups f JOIN leads l ON l.id=f.lead_id
 WHERE f.provider_id=? AND f.status='open'
 ORDER BY datetime(f.due_at) ASC LIMIT 100`).bind(providerId).all();
 return r.results||[];
}

async function followupAction(env,providerId,b){
 const f=await env.DB.prepare("SELECT * FROM followups WHERE id=? AND provider_id=?").bind(b.followup_id,providerId).first();
 if(!f)return{error:"Follow-up not found"};

 if(b.action==="complete"){
   await env.DB.prepare("UPDATE followups SET status='completed',completed_at=CURRENT_TIMESTAMP,note=? WHERE id=?").bind(c(b.note||""),f.id).run();
   return{ok:true};
 }
 if(b.action==="snooze"){
   const hours=Math.max(1,Math.min(Number(b.hours||24),168));
   const due=new Date(Date.now()+hours*3600000).toISOString();
   await env.DB.prepare("UPDATE followups SET due_at=?,note=? WHERE id=?").bind(due,c(b.note||""),f.id).run();
   return{ok:true,due_at:due};
 }
 return{error:"Unsupported action"};
}

async function createDealRoom(env,leadId){
 const lead=await env.DB.prepare("SELECT * FROM leads WHERE id=?").bind(leadId).first();
 if(!lead)return{error:"Lead not found"};

 let room=await env.DB.prepare("SELECT * FROM deal_rooms WHERE lead_id=?").bind(leadId).first();
 if(room)return room;

 const id=crypto.randomUUID(),title=`Solar Project: ${lead.project_type||"Solar"} · ${lead.country||lead.city||"Open location"}`;
 await env.DB.prepare(`INSERT INTO deal_rooms(id,lead_id,status,title,buyer_summary) VALUES(?,?,'active',?,?)`)
  .bind(id,leadId,title,`${lead.buyer_type||"buyer"} · ${lead.company||"company not stated"} · ${lead.property_type||"site type not stated"}`).run();

 await env.DB.prepare(`INSERT INTO deal_room_items(id,room_id,item_type,title,body,status,provider_id,sort_order)
 VALUES(?,?,?,?,?,'open',?,10)`)
  .bind(
   crypto.randomUUID(),id,"project_brief","Solar Project Brief",
   `Project: ${lead.project_type||"—"}; Location: ${lead.country||"—"} / ${lead.city||"—"}; Property/site: ${lead.property_type||"—"}; Roof/site: ${lead.roof_or_site_text||"—"}; Consumption: ${lead.estimated_consumption_text||"—"}; Budget: ${lead.budget_text||"—"}; Storage: ${lead.storage_required?"required":"not stated"}; Notes: ${lead.notes||"—"}.`,
   lead.provider_id||null
  ).run();

 return await env.DB.prepare("SELECT * FROM deal_rooms WHERE id=?").bind(id).first();
}

async function dealRoom(env,providerId,leadId){
 const lead=await env.DB.prepare("SELECT * FROM leads WHERE id=? AND provider_id=?").bind(leadId,providerId).first();
 if(!lead)return{error:"Lead not found or not assigned"};

 const room=await createDealRoom(env,leadId);
 if(room.error)return room;

 const brief=await env.DB.prepare("SELECT * FROM project_briefs WHERE lead_id=?").bind(leadId).first();
 const items=(await env.DB.prepare("SELECT * FROM deal_room_items WHERE room_id=? ORDER BY sort_order,created_at").bind(room.id).all()).results||[];
 const drafts=(await env.DB.prepare("SELECT * FROM copilot_drafts WHERE lead_id=? AND provider_id=? ORDER BY created_at DESC").bind(leadId,providerId).all()).results||[];
 const followups=(await env.DB.prepare("SELECT * FROM followups WHERE lead_id=? AND provider_id=? ORDER BY created_at DESC").bind(leadId,providerId).all()).results||[];
 const review=await env.DB.prepare("SELECT * FROM provider_reviews WHERE provider_id=?").bind(providerId).first();

 return{room,lead,brief,items,drafts,followups,review};
}

async function addDealRoomItem(env,providerId,b){
 const lead=await env.DB.prepare("SELECT id FROM leads WHERE id=? AND provider_id=?").bind(b.lead_id,providerId).first();
 if(!lead)return{error:"Lead not found or not assigned"};

 const room=await createDealRoom(env,b.lead_id);
 if(room.error)return room;

 const id=crypto.randomUUID();
 await env.DB.prepare(`INSERT INTO deal_room_items(id,room_id,item_type,title,body,status,provider_id,sort_order)
 VALUES(?,?,?,?,?,?,?,?)`)
 .bind(id,room.id,c(b.item_type||"note"),c(b.title||"Update"),c(b.body||""),c(b.status||"open"),providerId,Number(b.sort_order||50)).run();

 return{ok:true,id};
}

async function enterpriseStats(env){
 const scalar=async sql=>Number((await env.DB.prepare(sql).first())?.v||0);
 return{
  leads:await scalar("SELECT COUNT(*) v FROM leads"),
  ready:await scalar("SELECT COUNT(*) v FROM leads WHERE readiness_band='READY'"),
  partial:await scalar("SELECT COUNT(*) v FROM leads WHERE readiness_band='PARTIAL'"),
  risk_flagged:await scalar("SELECT COUNT(*) v FROM project_briefs WHERE risk_flags_json<>'[]'"),
  open_followups:await scalar("SELECT COUNT(*) v FROM followups WHERE status='open'"),
  deal_rooms:await scalar("SELECT COUNT(*) v FROM deal_rooms"),
  copilot_drafts:await scalar("SELECT COUNT(*) v FROM copilot_drafts"),
  owner_attention:await scalar("SELECT COUNT(*) v FROM leads WHERE owner_attention=1")
 };
}

export default{
 async fetch(request,env){
  const u=new URL(request.url);
  if(u.pathname==="/health"&&request.method==="GET") return secure(j({ok:true,service:"diar-business-os-core",version:"15.0.0",environment:env.APP_ENV||"unknown",legacy_solar:env.ENABLE_LEGACY_SOLAR==="true"}));
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:{"allow":"GET, POST, PUT, PATCH, DELETE, OPTIONS","cache-control":"no-store"}});
  const coreResponse=await handleCoreApi(request,env);if(coreResponse)return secure(coreResponse);
  if(u.pathname.startsWith("/api/") && env.ENABLE_LEGACY_SOLAR!=="true") return secure(j({error:"Legacy SolarEnergy24 API is disabled in V15. Use /api/core/* endpoints."},410));
  if(u.pathname==="/api/session/init"&&request.method==="POST"){const b=await request.json();const sid=await trackSession(env,request,b);return j({session_id:sid,experiments:await experimentsFor(env,sid)})}
  if(u.pathname==="/api/content")return j({items:await contentList(env)});
  if(u.pathname==="/api/content/item"){const slug=u.searchParams.get("slug")||"";const row=await env.DB.prepare("SELECT * FROM content_items WHERE slug=? AND status='published'").bind(slug).first();return row?j(row):j({error:"Not found"},404)}
  if(u.pathname==="/api/providers")return j({providers:await listProviders(env,u.searchParams.get("type"),u.searchParams.get("country"))});
  if(u.pathname==="/api/compare")return j({providers:await listProviders(env,u.searchParams.get("type"),u.searchParams.get("country"))});
  if(u.pathname==="/api/advisor"&&request.method==="POST"){const b=await request.json();return j(await advisor(env,b.query||""))}
  if(u.pathname==="/api/lead"&&request.method==="POST"){const b=await request.json();if(!b.name||!b.contact||!b.buyer_type||!b.project_type)return j({error:"Missing required fields"},400);return j({ok:true,...await saveLead(env,b,request)})}

  if(u.pathname==="/api/provider/profile"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const p=await profile(env,id);return j(p||{error:"Not found"},p?200:404)}
  if(u.pathname==="/api/provider/leads"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);return j({provider_id:id,leads:await providerLeads(env,id)})}
  if(u.pathname==="/api/provider/lead-action"&&request.method==="POST"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const b=await request.json(),r=await act(env,id,b.lead_id,b.action,b.note||"");return r.error?j(r,400):j(r)}
  if(u.pathname==="/api/provider/statement"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);return j(await statement(env,id,u.searchParams.get("month")||new Date().toISOString().slice(0,7)))}
  if(u.pathname==="/api/provider/contract/accept"&&request.method==="POST"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);return j(await acceptContract(env,id,await request.json()))}

  if(u.pathname==="/api/apply"&&request.method==="POST"){const b=await request.json();if(!b.company_name||!b.contact_name||!b.email||!b.provider_type)return j({error:"Missing required fields"},400);return j(await apply(env,b))}
  if(u.pathname==="/api/login/exchange"&&request.method==="POST"){const b=await request.json();return j(await exchange(env,b.token||""))}

  if(u.pathname==="/api/provider/copilot"&&request.method==="POST"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const b=await request.json(),r=await providerCopilot(env,id,b.lead_id,b.draft_type||"first_response");return r.error?j(r,400):j(r)}
  if(u.pathname==="/api/provider/followups"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);return j({followups:await followupQueue(env,id)})}
  if(u.pathname==="/api/provider/followup-action"&&request.method==="POST"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const r=await followupAction(env,id,await request.json());return r.error?j(r,400):j(r)}
  if(u.pathname==="/api/provider/deal-room"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const r=await dealRoom(env,id,u.searchParams.get("lead_id"));return r.error?j(r,404):j(r)}
  if(u.pathname==="/api/provider/deal-room/item"&&request.method==="POST"){const id=await auth(request,env);if(!id)return j({error:"Unauthorized"},401);const r=await addDealRoomItem(env,id,await request.json());return r.error?j(r,400):j(r)}
  const admin=request.headers.get("x-admin-key"),ok=!!env.ADMIN_KEY&&await eq(admin,env.ADMIN_KEY);
  if(u.pathname.startsWith("/api/owner/")&&!ok)return j({error:"Unauthorized"},401);
  if(u.pathname==="/api/owner/stats")return j(await stats(env));if(u.pathname==="/api/owner/vip-stats")return j(await vipStats(env));if(u.pathname==="/api/owner/enterprise-stats")return j(await enterpriseStats(env));
  if(u.pathname==="/api/owner/applications"){const r=await env.DB.prepare("SELECT * FROM provider_applications ORDER BY created_at DESC").all();return j({applications:r.results||[]})}
  if(u.pathname==="/api/owner/application-review"&&request.method==="POST"){const b=await request.json(),r=await reviewApp(env,b.application_id,b.decision);return r.error?j(r,400):j(r)}
  if(u.pathname==="/api/owner/reviews"){const r=await env.DB.prepare("SELECT r.*,p.name,p.provider_type,p.country,p.city,p.services FROM provider_reviews r JOIN providers p ON p.id=r.provider_id ORDER BY r.created_at DESC").all();return j({reviews:r.results||[]})}
  if(u.pathname==="/api/owner/review-update"&&request.method==="POST")return j(await reviewProvider(env,await request.json()));
  if(u.pathname==="/api/owner/magic-link"&&request.method==="POST"){const b=await request.json(),r=await magic(env,b.provider_id,u.origin);return r.error?j(r,400):j(r)}
  if(u.pathname==="/api/owner/subscription"&&request.method==="POST"){const b=await request.json();if(!["pending","trialing","active","past_due","paused","canceled"].includes(b.status))return j({error:"Invalid status"},400);await env.DB.prepare("UPDATE subscriptions SET status=?,updated_at=CURRENT_TIMESTAMP WHERE provider_id=?").bind(b.status,b.provider_id).run();return j({ok:true,marketplace_enabled:await sync(env,b.provider_id)})}
  if(u.pathname==="/api/owner/sla-sweep"&&request.method==="POST")return j(await sweep(env));

  if(u.pathname==="/sitemap.xml"){const items=await contentList(env);const urls=["/","/intelligence.html",...items.map(x=>"/article.html?slug="+encodeURIComponent(x.slug))];return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(x=>`<url><loc>${u.origin}${x}</loc></url>`).join("")}</urlset>`,{headers:{"content-type":"application/xml"}})}
  return secure(await env.ASSETS.fetch(request))
 },
 async scheduled(_event,env,ctx){if(env.ENABLE_LEGACY_SOLAR==="true")ctx.waitUntil(sweep(env))}
}
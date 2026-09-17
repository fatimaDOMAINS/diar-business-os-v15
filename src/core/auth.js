const enc=new TextEncoder();
async function hashHex(v){const b=new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(String(v||''))));return [...b].map(x=>x.toString(16).padStart(2,'0')).join('')}
export async function tenantPrincipal(request,env,tenant){
 const token=request.headers.get('authorization')?.replace(/^Bearer\s+/i,''); if(!token)return null;
 const h=await hashHex(token); const row=await env.DB.prepare(`SELECT m.id member_id,m.email,m.role,m.status FROM tenant_sessions s JOIN tenant_members m ON m.id=s.member_id WHERE s.token_hash=? AND s.tenant_id=? AND s.revoked_at IS NULL AND datetime(s.expires_at)>datetime('now') AND m.status='active'`).bind(h,tenant.id).first();
 return row||null;
}
export function can(principal,roles=[]){return !!principal&&roles.includes(principal.role)}

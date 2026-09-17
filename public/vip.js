let solarVisitorSession=localStorage.getItem('solarenergy24_visitor_session')||crypto.randomUUID();
localStorage.setItem('solarenergy24_visitor_session',solarVisitorSession);
let solarExperiments={};

async function initSolarGrowth(){
 const u=new URL(location.href);
 const body={session_id:solarVisitorSession,source:u.searchParams.get('utm_source')||document.referrer||'direct',
  utm_source:u.searchParams.get('utm_source'),utm_medium:u.searchParams.get('utm_medium'),utm_campaign:u.searchParams.get('utm_campaign'),
  landing_path:location.pathname+location.search};
 try{
  const d=await (await fetch('/api/session/init',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)})).json();
  solarVisitorSession=d.session_id||solarVisitorSession;solarExperiments=d.experiments||{};
  localStorage.setItem('solarenergy24_visitor_session',solarVisitorSession);
  const hero=solarExperiments['solar24-hero']?.payload;
  if(hero){const h=document.querySelector('.hero h1');const b=document.querySelector('.hero .btn');if(h)h.textContent=hero.headline||h.textContent;if(b)b.textContent=hero.cta||b.textContent;}
  const cta=solarExperiments['solar24-cta']?.payload;const lb=document.querySelector('#lead button');if(cta&&lb)lb.textContent=cta.label||lb.textContent;
 }catch{}
}
initSolarGrowth();
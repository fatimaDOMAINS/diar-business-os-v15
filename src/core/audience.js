const clamp=(n,min=0,max=100)=>Math.max(min,Math.min(max,Number(n)||0));
const pct=v=>clamp(v);
const logAudience=n=>{n=Math.max(0,Number(n)||0);if(!n)return 0;return clamp(Math.round(10+18*Math.log10(Math.max(1,n/1000))),0,100)};
export function assessAudience(a={}){
 const factors={
  size: a.size_score!=null?pct(a.size_score):logAudience(a.followers||a.audience_size),
  engagement:pct(a.engagement_score), relevance:pct(a.relevance_score), geography:pct(a.geography_score),
  purchasing_power:pct(a.purchasing_power_score), conversion:pct(a.conversion_score), commitment:pct(a.commitment_score)
 };
 const weights={size:.10,engagement:.15,relevance:.20,geography:.10,purchasing_power:.15,conversion:.15,commitment:.15};
 const score=Math.round(Object.entries(weights).reduce((s,[k,w])=>s+factors[k]*w,0));
 const band=score>=80?'A':score>=65?'B':score>=50?'C':'D';
 const reasons=Object.entries(factors).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v])=>`${k}:${v}`);
 return{score,band,factors,reasons,method:'weighted_declared_signals',verified:false};
}

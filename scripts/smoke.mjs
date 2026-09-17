const env=process.argv[2]||'staging';
const base=process.env.DIAR_BASE_URL;
if(!base){console.error('Set DIAR_BASE_URL to the deployed Worker URL.');process.exit(2)}
const r=await fetch(base.replace(/\/$/,'')+'/health');
if(!r.ok){console.error('Health check failed:',r.status);process.exit(1)}
const j=await r.json();
if(j.version!=='15.0.0'||j.environment!==env){console.error('Unexpected deployment identity:',j);process.exit(1)}
console.log('SMOKE OK',j);

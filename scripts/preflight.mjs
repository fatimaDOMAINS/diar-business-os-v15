import fs from 'node:fs';
const config=fs.readFileSync('wrangler.jsonc','utf8');
const index=fs.readFileSync('src/index.js','utf8');
const core=fs.readFileSync('src/core/api.js','utf8');
const errors=[];
if(/REPLACE_WITH_.*D1_DATABASE_ID/.test(config)) errors.push('D1 database IDs still contain placeholders. Replace the IDs for the environment you intend to deploy.');
if(!config.includes('"ENABLE_LEGACY_SOLAR": "false"')) errors.push('Legacy Solar must default to false.');
if(index.includes('Access-Control-Allow-Origin":"*')||index.includes("Access-Control-Allow-Origin': '*'")) errors.push('Wildcard CORS detected.');
const requiredTenantPatterns=['WHERE tenant_id=?','tenant.id'];
for(const x of requiredTenantPatterns) if(!core.includes(x)) errors.push(`Core tenant guard pattern missing: ${x}`);
if(errors.length){console.error('PRE-FLIGHT FAILED');for(const e of errors)console.error('- '+e);process.exit(1)}
console.log('PRE-FLIGHT OK');

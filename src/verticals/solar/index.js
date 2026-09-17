export default {
 slug:'solar', name:'Solar Energy', conversion_modes:['lead','quote','match'],
 intent_fields:['project_type','property_type','roof_or_site_text','estimated_consumption_text','budget_text','storage_required','timeline','country','city'],
 parseIntent(query=''){
  const s=String(query).toLowerCase();
  if(/battery|storage|bess/.test(s))return{intent_type:'storage',provider_type:'storage-integrator',attributes:{project_type:'storage'}};
  if(/commercial|warehouse|factory|industrial|c&i/.test(s))return{intent_type:'commercial-solar',provider_type:'epc',attributes:{project_type:'commercial-solar'}};
  if(/utility|solar farm|ground mount|mw/.test(s))return{intent_type:'utility-scale',provider_type:'developer',attributes:{project_type:'utility-scale'}};
  if(/monitor|software|analytics|performance/.test(s))return{intent_type:'monitoring-software',provider_type:'software',attributes:{project_type:'monitoring-software'}};
  if(/finance|financing|lease|ppa/.test(s))return{intent_type:'solar-financing',provider_type:'financing',attributes:{project_type:'solar-financing'}};
  return{intent_type:'residential-solar',provider_type:'installer',attributes:{project_type:'residential-solar'}};
 },
 systemPrompt:'You are a solar project advisor. Never invent production yields, savings, payback, electricity tariffs, incentives, equipment availability, warranty terms, installation dates, permitting status, grid approval, certifications, financing approval, or project pricing. Require site-specific engineering and current provider confirmation.'
};

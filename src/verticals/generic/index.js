export default {
 slug:'generic', name:'Generic Business', conversion_modes:['lead','quote','booking','purchase','subscription','application','match'],
 intent_fields:['need','budget','location','timeline'],
 parseIntent(query=''){
  const q=String(query).trim(); return {intent_type:'general',need:q||'not stated',attributes:{query:q}};
 },
 systemPrompt:'You are a business concierge. Clarify the customer need without inventing prices, availability, guarantees, legal terms, delivery dates, or outcomes. Recommend a clear next action.'
};

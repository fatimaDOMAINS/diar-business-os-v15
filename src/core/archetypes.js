const clean=v=>String(v??'').trim();
const norm=v=>clean(v).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,' ').trim();
const has=(t,terms)=>terms.some(x=>t.includes(x));

export const ARCHETYPES={
 audience_acquisition:{label:'Audience Acquisition Engine',asset:'audience + authority + sales access',conversion:['discover','qualify','match','consult'],monetization:['qualified-lead','referral','revenue-share'],domain_role:'core_or_acquisition'},
 brand_growth:{label:'Brand Growth Engine',asset:'existing brand + product/service',conversion:['discover','buy','wholesale','book'],monetization:['purchase','qualified-lead','wholesale','repeat-business'],domain_role:'secondary_or_expansion'},
 distribution:{label:'Distribution Engine',asset:'product + supply + B2B relationships',conversion:['buyer-intake','sample','pilot','distribution'],monetization:['wholesale','distribution','qualified-opportunity'],domain_role:'secondary_or_channel'},
 high_ticket_relationship:{label:'High-Ticket Relationship Engine',asset:'expertise + HNW relationships + trust',conversion:['private-intent','qualify','confidential-consult','deal-room'],monetization:['commission','referral','advisory','revenue-share'],domain_role:'strong_acquisition_asset'},
 enterprise_advisory:{label:'Enterprise Advisory Engine',asset:'technical authority + enterprise access',conversion:['assessment','qualify','recommend','proposal','project'],monetization:['consulting','project','subscription','qualified-opportunity'],domain_role:'acquisition_channel'},
 marketplace:{label:'Marketplace Engine',asset:'supply + demand access',conversion:['discover','qualify','match','transact'],monetization:['commission','listing','qualified-lead','subscription'],domain_role:'often_core'}
};

export function classifyArchetype(b={}){
 const text=norm([b.company,b.role,b.industry,b.bio,b.notes,...(Array.isArray(b.tags)?b.tags:[]),...(Array.isArray(b.markets)?b.markets:[])].join(' '));
 const followers=Number(b.audience?.followers||b.audience?.audience_size||0);
 const scores={audience_acquisition:0,brand_growth:0,distribution:0,high_ticket_relationship:0,enterprise_advisory:0,marketplace:0};
 if(followers>=2000)scores.audience_acquisition+=2;if(followers>=20000)scores.audience_acquisition+=2;
 if(has(text,['influencer','creator','personal brand','sales manager','broker','realtor']))scores.audience_acquisition+=3;
 if(has(text,['founder','co founder','consumer brand','cpg','product','retail']))scores.brand_growth+=3;
 if(has(text,['distribution','distributor','wholesale','foodservice','institutional','manufacturing','co manufacturing','retail buyer']))scores.distribution+=4;
 if(has(text,['yacht','luxury','family office','private client','hnw','uhnw','wealth','supercar','private aviation']))scores.high_ticket_relationship+=5;
 if(has(text,['sustainability','consultancy','consulting','esg','decarbon','energy management','enterprise','advisory','net zero']))scores.enterprise_advisory+=5;
 if(has(text,['marketplace','provider','installer','dealer','developer','network','platform']))scores.marketplace+=2;
 if(has(text,['ceo','founder','director','partner'])){scores.brand_growth+=1;scores.enterprise_advisory+=1;scores.distribution+=1}
 const ranked=Object.entries(scores).sort((a,b)=>b[1]-a[1]);
 const [slug,score]=ranked[0];
 return{slug:score?slug:'marketplace',score,confidence:score>=6?'high':score>=3?'medium':'low',definition:ARCHETYPES[score?slug:'marketplace'],scores,notice:'Archetype is rule-based from declared/profile signals and requires human validation.'};
}

# DIAR Business OS Core V5 — Audience → Offer → Conversion

V5 turns the shared CORE into a sales/demo instrument for prospective JV partners.

## Added
- Prospect profiles scoped to a tenant.
- Audience Quality assessment using declared signals. It is explicitly not presented as verified evidence.
- Expiring, revocable, hashed demo-link tokens.
- Personalized prospect demo page (`/prospect-demo.html`).
- APIs to create/list prospects and issue/read demo links.
- Contribution metadata so JV input can be expressed as audience, expertise, inventory and/or distribution.

## Audience Quality method
Weighted signals: size 10%, engagement 15%, vertical relevance 20%, geography 10%, purchasing power 15%, demonstrated conversion 15%, partner commitment 15%.
The score is a qualification aid, not a valuation and not proof of commercial performance.

## Intended flow
Connect prospect → create prospect profile → enter known/declared audience signals → issue private demo link → prospect sees configured tenant/domain + business flow → prospect enters the live Business Engine → intent/offer/lead/opportunity pipeline.

## Important next hardening
- Add a UI for owner/sales prospect onboarding rather than API-only creation.
- Add first-party event attribution from demo link into lead/source data.
- Add consent capture before marketing follow-up.
- Replace remaining legacy Solar global CORS/auth surfaces before multi-tenant production use.
- Add tenant-specific knowledge retrieval and proposal generation.

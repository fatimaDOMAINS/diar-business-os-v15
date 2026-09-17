# DIAR Business OS Core V10 — Personal Business Layer

V10 converts an approved prospect into a private mini-business presentation rather than a generic domain pitch.

## Added
- `prospect_business_demos` persistence layer.
- `personal-business.js` generator: hero, value proposition, monetization, contribution split, conversion journey, CTA and evidence/guardrails.
- `POST /api/core/personal-business` (tenant-authenticated internal generation).
- Demo API now returns the latest personalized business layer.
- `/personal-business.html` private prospect-facing presentation.

## Guardrails
- No invented revenue, conversion rates, customers, inventory, prices or guaranteed outcomes.
- Commercial/JV terms remain explicitly unagreed until both parties accept them.
- Declared/profile signals are labeled as such.

## Intended workflow
Prospect Factory → human approval → proposal → Personal Business Layer → private demo link → outreach → discussion → validated commercial pilot.

# DIAR Business OS Core V7 — Prospect Intake Factory

V7 turns the personalized proposal layer into a repeatable intake workflow for Connect prospects.

## Added
- `domain_catalog`: portfolio-aware catalog for domain/business matching.
- `prospect_intakes`: preserves the declared/source profile used for a recommendation.
- `prospect_recommendations`: auditable ranked domain + vertical + business-model matches.
- `src/core/intake.js`: deterministic recommendation engine; no invented market facts.
- `POST /api/core/domain-recommendations`: preview fit before creating a prospect.
- `POST /api/core/prospect-intake`: one call creates prospect, audience assessment, ranked domain matches, draft JV proposal and expiring private demo link.
- `GET /api/core/prospect-recommendations`: retrieve saved recommendations.

## Matching principles
The engine uses only declared prospect data plus the owner-provided domain catalog. Fit score is a routing heuristic, not a valuation or prediction. Audience size receives only a small boost; relevance, vertical and market fit matter more. Unknown information is not silently inferred.

## Seed catalog
V7 includes initial known portfolio entries for DubaiEstate24.com, SolarEnergy24.com, DubaiCars24.com, VIPDubaiServices.com, DubaiEco.org and Umami365.com. Expand `domain_catalog` as the portfolio is normalized.

## Next
V8 should add an internal Prospect Factory UI, CSV/batch intake, duplicate detection, review/approval state, and outreach-copy generation only after a human approves the selected domain/business model.

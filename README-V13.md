# DIAR Business OS Core V13 — Consolidated Architecture

V13 consolidates the pilot learning into one production-oriented architecture. The system no longer treats a premium domain as the starting point. It identifies the prospect's strongest monetizable asset, selects a conversion archetype, defines the opportunity/monetization path, and only then evaluates the role of a domain.

## Consolidated archetypes
1. Audience Acquisition Engine — audience/authority to qualified demand.
2. Brand Growth Engine — existing brand/product to consumer and B2B growth.
3. Distribution Engine — product/supply to buyers, pilots and distribution.
4. High-Ticket Relationship Engine — trusted expertise/HNW access to confidential qualified opportunities.
5. Enterprise Advisory Engine — business problem to assessment, proposal and project.
6. Marketplace Engine — retained as a general supply/demand pattern when neither side is a single dominant brand.

The first five are the validated prospect archetypes from the pilot program; Marketplace remains a core system pattern rather than a claim that every prospect needs a marketplace.

## Universal core
Traffic/Audience → Intent → Browse/AI/Direct → Qualification → Offer/Match → Conversion → CRM → Human → Follow-up → Opportunity/Revenue.

## Domain policy
A domain can be a core brand, acquisition channel, expansion asset, secondary asset, or not required. Domain fit must not override a stronger existing brand or a better business opportunity.

## Safety / truthfulness
No invented audience metrics, inventory, prices, availability, conversion rates, revenue, yields or guarantees. Declared/profile signals remain distinguishable from verified evidence. Human approval is required before outreach.

## V13 additions
- `src/core/archetypes.js`: centralized archetype classifier/configuration.
- `config/archetypes.json`: machine-readable architecture contract.
- Opportunity analysis now returns an archetype assessment.
- `0027_v13_consolidated_archetypes.sql`: persistence layer for reviewed archetype assessments.

## Production note
Legacy SolarEnergy24 routes remain for backward compatibility. They should be isolated/migrated behind the tenant-aware core before a broad multi-tenant production rollout.

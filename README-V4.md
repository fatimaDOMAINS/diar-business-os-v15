# DIAR Business OS Core V4

V4 is the first reference deployment of the vertical-agnostic core outside the original Solar implementation.

## Added
- DubaiEstate24 reference tenant and primary domain seed.
- Four real-estate offers and deterministic offer rules.
- Generic tenant-scoped partner matching based on capabilities and audience quality.
- Automatic opportunity creation when a Core Lead has a recommended offer.
- Automatic partner assignment for `match` conversions.
- Generic `business-engine.html` frontend driven by `/api/core/config`.

## Deliberate limitations
- No invented property inventory, prices, yields or availability.
- Partner records must be explicitly onboarded; V4 ships no fictional partners.
- Audience quality is a supplied/verified metric, not inferred by the system.
- V4 is a reference implementation, not a claim of production security certification.

## Reference URL
`/business-engine.html?tenant=dubaiestate24`

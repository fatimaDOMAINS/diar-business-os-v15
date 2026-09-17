# DIAR Business OS Core V2

V2 begins the safe extraction of SolarEnergy24 into a vertical-agnostic core without breaking the legacy solar routes.

## Added
- Vertical registry (`generic`, `solar`) with isolated intent parsing and AI guardrails.
- Tenant-aware Core API resolved by tenant slug/header or mapped hostname.
- Generic `core_leads` model using `attributes_json` rather than solar-specific columns.
- Tenant-domain mapping.
- Universal conversion modes: lead, quote, booking, purchase, subscription, application, match.
- Tenant-scoped offers endpoint.

## Core API
- `GET /api/core/verticals`
- `GET /api/core/config?tenant=demo`
- `POST /api/core/advisor` with `{tenant_slug, query}`
- `GET /api/core/offers?tenant=demo`
- `POST /api/core/lead` with `{tenant_slug, contact, query?, attributes?, conversion_mode?}`

## Compatibility
Legacy SolarEnergy24 endpoints remain intact. Legacy `parseIntent()` now delegates to the Solar vertical adapter. This is deliberate: V2 separates behavior first, then later migrates legacy lead routing/provider workflows tenant-by-tenant.

## Next
V3: tenant-scoped partner/provider model, RBAC/session hardening, Offer Engine actions, and Real Estate adapter for DubaiEstate24.com.

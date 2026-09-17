# DIAR Business OS Core V1

## Principle
One core, many businesses. SolarEnergy24 remains the reference implementation; new verticals must not hard-code solar terminology into the core.

## Universal flow
Traffic/Audience -> Identity -> Intent -> Browse | AI | Direct Action -> Offer Engine -> Qualification -> Conversion -> CRM -> Copilot -> Follow-up -> Transaction -> Retention -> Intelligence.

## Required context on every business object
- tenant_id: data/business isolation
- vertical_slug: business vocabulary and qualification schema
- domain/brand configuration
- attributes_json: vertical-specific fields without polluting the core schema

## Conversion modes
lead, quote, booking, purchase, subscription, application, match.

## Security gate before multi-client production
Replace wildcard CORS where possible; replace browser localStorage provider sessions with secure HttpOnly sessions; replace single shared admin key with role-based authenticated admin; enforce tenant scoping on every query; add rate limiting, CSRF protections where applicable, consent/data-retention controls, and security tests.

## Migration strategy
1. Keep SolarEnergy24 V18 operational as reference.
2. Add tenant/offer/opportunity/interaction/transaction primitives (0016).
3. Move solar-specific intent parsing into a vertical adapter.
4. Add generic core API with tenant-scoped repositories.
5. Build first adapter: real_estate for DubaiEstate24.com.
6. Only after isolation/security tests, onboard external JV tenants.

# DIAR Business OS Core V3

V3 hardens the universal core before any large UI redesign.

## Added
- Tenant-scoped bearer sessions and role checks for protected Core routes.
- Tenant Partner layer, separate from legacy Solar providers.
- Offer Rules and a reusable Offer Engine with eligibility + scoring.
- Partner Assignment schema for future routing.
- First non-Solar vertical adapter: `real-estate`.
- Advisor and lead creation can return tenant-specific recommended offers.

## Security direction
V3 removes the need for `x-admin-key` or provider-localStorage patterns in new Core routes. Legacy Solar routes remain for compatibility and should be migrated incrementally. Production session issuance should set random bearer tokens via secure HttpOnly cookies at the edge/app layer; only token hashes belong in D1.

## Next V4
1. Session issuance/revocation and cookie transport.
2. Tenant partner matching/routing and opportunity creation.
3. DubaiEstate24 tenant seed + real-estate offer catalog.
4. Generic frontend shell driven entirely by `/api/core/config`.
5. Regression tests proving Solar and Real Estate can coexist.

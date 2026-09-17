# DIAR Business OS Core V14 — Production Hardening

V14 is a hardening release, not a feature release.

## Changes
- Legacy SolarEnergy24 API is disabled by default (`ENABLE_LEGACY_SOLAR=false`). The universal `/api/core/*` API remains the production path.
- Wildcard CORS was removed. Same-origin is the default deployment model.
- API and asset responses receive baseline security headers including CSP, `nosniff`, referrer policy, permissions policy and `frame-ancestors 'none'`.
- Public AI advisor and lead creation endpoints now have D1-backed rate limiting.
- JSON write requests reject declared payloads over 64 KiB.
- `/api/core/partner-match` now requires an authenticated tenant member (`owner`, `admin`, or `sales`).
- Worker name/version corrected to V14.
- Scheduled legacy Solar SLA sweep runs only when legacy mode is explicitly enabled.

## Required production secret
Set a random `RATE_LIMIT_SALT` with Wrangler secrets before production deployment. Do not commit it to source control.

## Deliberately not enabled
- Legacy `x-admin-key` owner API and provider portal remain in the codebase for migration/reference, but are unreachable while `ENABLE_LEGACY_SOLAR=false`.
- Do not enable legacy mode in production until those routes are migrated to tenant-scoped session/RBAC auth.

## Production checklist
1. Create/confirm production D1 database and replace the placeholder `database_id`.
2. Apply migrations through `0028_v14_production_hardening.sql`.
3. Set `RATE_LIMIT_SALT` as a Worker secret.
4. Keep `ENABLE_LEGACY_SOLAR=false` and `ALLOW_LEGACY_PARTNER_AUTH=false`.
5. Seed tenant members/sessions using a controlled admin process; do not expose raw bearer tokens in public pages.
6. Deploy to staging first and test tenant isolation with at least two tenants.
7. Test prospect import → review → approval → private demo → outreach draft end-to-end.
8. Only then promote the same build to production.

## Remaining production work
V14 materially reduces the attack surface but is not a claim of formal security certification. Before handling sensitive customer data at scale, add automated integration tests, session issuance/revocation UI, retention/deletion jobs, centralized audit review, dependency scanning, and Cloudflare WAF/rate-limit rules at the edge.

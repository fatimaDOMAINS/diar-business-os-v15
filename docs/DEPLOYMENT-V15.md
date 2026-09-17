# DIAR Business OS V15 — Staging / Production deployment

V15 separates development, staging and production. It does not contain real Cloudflare account IDs, D1 IDs or secrets.

## Required Cloudflare resources
1. Create separate D1 databases: `diar-business-os-staging` and `diar-business-os-production`.
2. Replace the staging and production D1 `database_id` placeholders in `wrangler.jsonc`.
3. Keep `ENABLE_LEGACY_SOLAR=false` and `ALLOW_LEGACY_PARTNER_AUTH=false`.
4. Add secrets only through Wrangler/Cloudflare secrets; do not commit them to this ZIP.

## Staging gate
Run migrations against staging, deploy staging, then set `DIAR_BASE_URL` to the staging Worker URL and run the smoke test.

Before production, manually verify two independent tenants: tenant A credentials cannot list/read/update tenant B prospects, partners, opportunities, proposals, personal businesses, demo links or factory rows. Also verify expired/revoked sessions return 401.

## Production gate
Only after staging passes: create/verify a backup, apply production migrations, deploy production, run the production smoke test, and test one non-sensitive sample prospect before importing real LinkedIn prospects.

## Rollback
Cloudflare deployment rollback should revert Worker code. Database migrations are forward-only unless a migration explicitly supplies a safe reverse plan. Back up production D1 before migrations.

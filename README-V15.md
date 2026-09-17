# V15 — Deployment & Staging

V15 converts the V14 hardened codebase into a deployment-ready package with explicit development/staging/production separation.

Changes:
- separate Cloudflare Worker names and D1 bindings for dev, staging and production;
- safe defaults keep legacy Solar and legacy partner authentication disabled;
- `/health` deployment identity endpoint;
- preflight script that blocks deployment while D1 IDs are placeholders and checks core hardening invariants;
- staging/production migration and deploy scripts;
- post-deploy smoke test;
- deployment/rollback checklist;
- deployment event migration for operational audit history.

V15 intentionally contains no real Cloudflare IDs or secrets. It is ready for configuration, not claimed to be deployed.

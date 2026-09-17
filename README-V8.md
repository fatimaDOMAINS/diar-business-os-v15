# DIAR Business OS Core V8 — Prospect Factory

V8 adds the internal, review-first production line for Connect prospects.

## Added
- CSV batch intake (up to 1,000 rows per batch).
- Deterministic duplicate detection using LinkedIn/profile URL or email first, then name + company + role fingerprint.
- Review queue with fit preview before approval.
- Human approval gate: no prospect proposal, demo link, or outreach draft is created until an authorized owner/admin/sales user approves a row.
- Approved rows create the existing V7 intake package: prospect, audience assessment, ranked domain fit, JV proposal and expiring demo link.
- Outreach copy is generated only after approval and stored as a draft; V8 does not send messages.
- Rejection/review notes and batch audit state.
- `/prospect-factory.html` internal UI.

## CSV columns
Recommended: `name, company, role, industry, linkedin` (or `profile_url`), `followers, markets, tags, bio, notes`.

## XLSX
V8 intentionally does not embed a third-party spreadsheet parser into the Cloudflare frontend. Export XLSX to CSV for the production intake path. Native XLSX ingestion can be added server-side later without changing the batch schema.

## Safety / data quality
Recommendations remain heuristics based on declared profile data plus the owner-maintained domain catalog. Duplicates are held for review. No outreach is sent automatically.

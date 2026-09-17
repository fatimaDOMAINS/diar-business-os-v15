# DIAR Business OS Core V9 — Hardening + Opportunity Engine

V9 changes the Prospect Factory decision order from domain-first to business-opportunity-first:

`PERSON → DISTRIBUTION / BUSINESS ASSET → OPPORTUNITY → MONETIZATION → DOMAIN FIT → JV → DEMO → HUMAN APPROVAL`

## Added
- Opportunity Engine identifies declared/profile business assets before domain selection.
- Domain scoring receives an opportunity/business-model adjustment instead of relying only on industry similarity.
- Stronger LinkedIn URL canonicalization and independent email/profile identity keys.
- Approval lock (`pending → processing → approved`) to reduce double approvals.
- Approval provenance: approver, original recommendation, final selection and opportunity snapshot.
- Approval audit-log event.
- Internal `/api/core/opportunity` preview endpoint.
- Runtime/package/D1 naming updated from Solar/V5 legacy names to DIAR V9 names.

## Evidence policy
Audience size, engagement and profile-derived capabilities remain declared/profile signals until verified. V9 does not treat follower count as revenue, guarantee conversion, or invent partner capabilities.

## Deployment note
The D1 name in wrangler is now `diar-business-os`; bind it to the intended database ID before deployment. Legacy Solar endpoints remain for compatibility and should be isolated/retired in a later migration rather than removed destructively.

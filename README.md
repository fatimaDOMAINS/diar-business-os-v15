# V13 consolidated architecture

See `README-V13.md` for the current production architecture.

# SolarEnergy24.com — AI ENTERPRISE V15–V18

Extends VIP V11–V14 into a complete solar-project and energy-acquisition operating system.

## V15 — Solar Project Readiness
Signals:
- contact
- project type
- project location
- property / site type
- roof / land context
- consumption data
- site-data status
- consumption-data status
- grid / interconnection status
- financing context

Bands:
- READY 80–100
- PARTIAL 55–79
- BASIC below 55

Readiness is operational only, not engineering approval, permitting approval or grid approval.

## V16 — Provider Sales Copilot
Draft types:
- first response
- clarification
- follow-up

Guardrails:
- no invented production yield
- no invented savings
- no invented payback
- no invented electricity tariffs or incentives
- no invented equipment availability
- no invented warranties
- no invented installation dates
- no invented permits / grid approval
- no invented certifications
- no invented financing approval
- no invented pricing

## V17 — Follow-up CRM
Tracks:
- qualification
- accepted-lead follow-up
- post-contact follow-up
- rerouted-lead follow-up

Completed/declined leads close open follow-ups.
Rerouting closes previous-provider follow-ups before the next workflow.

## V18 — Unified Solar Project Deal Room
`/deal-room.html`

Contains:
- project brief
- readiness
- provider review
- site updates
- engineering updates
- grid/interconnection updates
- equipment updates
- quotes
- financing updates
- installation coordination
- Copilot drafts
- follow-up history

Provider-scoped access protects assigned opportunities.

## Routing & verification
Neutral routing remains active:
- Featured ignored
- provider type
- marketplace eligibility
- accepted contract
- approved provider review
- active/trialing subscription where required
- least open workload
- oldest last assignment

Rerouting remains capped at 3 before owner escalation.

## Product map
- BASIC V1–V4 — Solar Discovery & Marketplace
- PREMIUM V5–V7 — Solar Partner Marketplace & Monetization
- GOLD V8–V10 — Controlled Solar Project Platform
- VIP V11–V14 — Growth + Attribution + Personalization
- ENTERPRISE V15–V18 — Solar Project & Energy Acquisition OS

## V15
See `README-V15.md` and `docs/DEPLOYMENT-V15.md` for staging/production deployment gates.

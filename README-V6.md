# DIAR Business OS Core V6

V6 turns the V5 prospect demo into a controlled Personal Business Proposal engine.

## Added
- `prospect_proposals` tenant-scoped persistence.
- Proposal generator linked to a real prospect and tenant offers.
- Explicit audience-to-revenue scenario calculator.
- Scenario numbers are shown only when assumptions are deliberately supplied; they are labelled illustrative, not forecasts or guarantees.
- Demo API now returns the latest proposal for the prospect.
- Prospect demo renders contribution split, recommended offer and an optional conversion path.

## API
`POST /api/core/proposal?tenant=<slug>` (owner/admin/sales)

Example body:
```json
{
  "prospect_id":"...",
  "business_model":"joint-venture",
  "assumptions":{
    "audience_size":50000,
    "reach_rate":0.20,
    "visit_rate":0.05,
    "identify_rate":0.12,
    "qualify_rate":0.30,
    "close_rate":0.08,
    "value_per_conversion":0
  },
  "contribution":{"audience":true,"expertise":true,"distribution":true}
}
```

No default conversion rates are invented. Missing rates remain zero. This prevents the proposal UI from presenting fabricated revenue projections.

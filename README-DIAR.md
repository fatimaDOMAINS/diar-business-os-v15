# DIAR Business OS Core V1 — foundation build

This package is a non-destructive fork of SolarEnergy24 V18. The existing solar implementation is intentionally preserved while the universal core is introduced beside it.

## Added in V1
- tenant model for future multi-business isolation
- Offer Engine primitives
- generic opportunities, interactions and transactions
- consent event ledger
- vertical configuration contract
- architecture and security migration plan

## Deliberately not done yet
Solar-specific fields and `parseIntent()` are not removed in V1. Removing them before adapters and regression tests exist would risk breaking the proven SolarEnergy24 flow. V2 should extract solar behavior into `/verticals/solar` and introduce tenant-scoped core APIs.

## Why this order
The goal is not a cosmetic template. It is a reusable revenue system that can support DubaiEstate24, SolarEnergy24, DubaiCars24, VIPDubaiServices and partner-specific JV deployments without mixing customer data.

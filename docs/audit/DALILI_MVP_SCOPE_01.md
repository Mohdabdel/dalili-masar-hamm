# DALILI MVP SCOPE 01

Date: 2026-09-13

## Purpose

This file freezes the first MVP candidate content scope. It does not expand the library and does not migrate the 1413 Legacy Master opportunities.

MVP readiness remains governed by four gates:

- Architecture Ready
- Content Ready
- Family Journey Ready
- Governance / Data Integrity Ready

Current position: `MVP Candidate Scope`, not `MVP Ready`.

## Governing Decision

The 1413 opportunities are not the MVP target. They remain:

- Legacy Master source material.
- lineage evidence for future framework references.
- a backlog for controlled expansion after MVP gates pass.

No Legacy row is considered Production-ready by count alone. A row only enters the MVP surface after becoming a separate `framework_reference` and passing the canonical gates.

## MVP Content Scope

`DALILI_MVP_SCOPE_01` contains 30 framework references:

- 5 Golden framework references.
- 5 Batch02 contract-aligned references.
- 6 Batch03 references.
- 8 Batch04 controlled-expansion references.
- 6 Batch05 edge/context references.

This scope is intentionally small enough to test deeply and broad enough to cover the three family journeys.

## Journey Coverage

### 1. Home / Family Journey

Probe cards:

- `GJ-EASY-001`
- `GJ-SHARED-001`
- `FR-B03-HOME-018-OP001`
- `FR-EXP12-HOME-052-OP001`
- `FR-EXP12-02-HOME002-OP005`

Purpose: prove that a family can start from a home participation, adjust the steps, preview, and approve a usable card.

### 2. Community / Health Journey

Probe cards:

- `FR-B02-COMM-005-OP001`
- `FR-B03-HEALTH-001-OP001`
- `FR-EXP12-COMM-006-OP002`
- `FR-EXP12-HEALTH-003-OP001`
- `FR-EXP12-02-HEALTH007-OP010`

Purpose: prove that external-context content remains family-framed and does not imply therapy, skill testing, independence, or unsafe delegation.

### 3. Usable Card Journey

Probe cards:

- `FR-B03-FOOD-001-OP002`
- `FR-EXP12-FOOD-006-OP001`
- `FR-EXP12-02-FOOD002-OP001`
- `FR-EXP12-02-SHOP005-OP003`
- `FR-EXP12-02-CLO003-OP012`

Purpose: prove the end-to-end card path: select, edit wording, control text/image visibility, preview step-by-step/vertical/horizontal, approve, and reopen the final card.

## Validation Rule

The scope is guarded in code by `src/lib/framework/mvp-scope.ts` and `src/lib/framework/__tests__/mvp-scope.test.ts`.

The guard verifies:

- exactly 30 IDs;
- no `KB-*` or Legacy-only item;
- all IDs resolve as `framework_reference`;
- all pass canonical functional participation validation;
- all are discoverable in the family space;
- all three MVP journey probes are represented;
- all six practical domains, three complexity levels, and both participation modes are covered.

## Non-Claims

This does not claim:

- 1413 migration complete;
- full library readiness;
- image final approval;
- MVP Ready.

It only establishes a controlled content scope for the next gate: full family-journey testing.

## Next Gate

Run MVP Journey Test 01:

1. Home / Family Journey.
2. Community / Health Journey.
3. Usable Card Journey.

MVP can only be declared ready after the four readiness gates are explicitly PASS.

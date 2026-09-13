# DALILI MVP JOURNEY TEST 01

Date: 2026-09-13

## Purpose

This gate tests whether the fixed MVP candidate scope can support complete family journeys. It does not approve the full 1413 Legacy Master opportunities and does not expand content.

Input scope: `DALILI_MVP_SCOPE_01`

## Journey Probes

### 1. Home / Family

Cards:

- `GJ-EASY-001`
- `GJ-SHARED-001`
- `FR-B03-HOME-018-OP001`
- `FR-EXP12-HOME-052-OP001`
- `FR-EXP12-02-HOME002-OP005`

Required evidence:

- participation resolves in the family space;
- automatic draft contains executable blocks;
- family wording can be changed without mutating source wording;
- preview/frozen card can be produced.

### 2. Community / Health

Cards:

- `FR-B02-COMM-005-OP001`
- `FR-B03-HEALTH-001-OP001`
- `FR-EXP12-COMM-006-OP002`
- `FR-EXP12-HEALTH-003-OP001`
- `FR-EXP12-02-HEALTH007-OP010`

Required evidence:

- external-context cards stay family-framed;
- health/community cards remain participation opportunities, not safety delegation;
- complete card snapshots can be produced.

### 3. Usable Card

Cards:

- `FR-B03-FOOD-001-OP002`
- `FR-EXP12-FOOD-006-OP001`
- `FR-EXP12-02-FOOD002-OP001`
- `FR-EXP12-02-SHOP005-OP003`
- `FR-EXP12-02-CLO003-OP012`

Required evidence:

- selectable participation opens as a draft;
- wording remains editable;
- image/text visibility does not block card production;
- approved card freezes the viewed content.

## Automated Guard

Implemented in:

- `src/lib/framework/__tests__/mvp-journey.test.ts`

The automated test verifies, for every journey probe:

- `getSpaceSpec` resolves the participation;
- `buildDraftSelection` creates a draft;
- `composeDraft` produces visible rows;
- a family wording edit changes only family text;
- source text remains immutable;
- `buildFrozenSnapshot` produces a card with a terminal `__done__` frame.

## Verdict

This gate is intended to move the project from:

`MVP Candidate Scope`

to:

`Family Journey Testable`

It is not yet `MVP Ready`. MVP Ready still requires all four readiness gates to be explicitly marked PASS.

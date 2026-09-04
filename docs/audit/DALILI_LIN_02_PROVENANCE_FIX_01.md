# DALILI LIN-02 PROVENANCE FIX 01

MODE: MINIMAL PRODUCTION FIX — SCOPE: LIN-02 ONLY

## ROOT CAUSE

`src/lab/data/space/catalog.ts` is the single Production reference-resolution boundary
(consumed by `src/features/space/**` and `src/features/space/home-status.ts`).

Two rules gave Lab fixtures precedence, generically (not per-ID):

1. `participationsForEvent()` returned `[...fixtureSpecsForEvent(eventId), ...fromLibrary]`
   — Lab `SLICE_SPECS` were concatenated **before** canonical library specs, and were
   rewritten to carry the Production `eventId`/`eventTitle_ar` via `FIXTURE_EVENT_MAP`
   (BREAKFAST→FOOD-001, LAUNDRY→CLO-011, SHOPPING→SHOP-004).
2. `getSpaceSpec()` looked up `SLICE_SPECS` **first** and only fell through to the
   `KB-` library resolver afterwards.

Result: for any event mapped in `FIXTURE_EVENT_MAP`, Lab fixture content preceded and
shadowed Production/library reference specs in lists, level counts, and first-choice UI.

## FILES CHANGED

- `src/lab/data/space/catalog.ts` (resolution order only)
- `docs/audit/DALILI_LIN_02_PROVENANCE_FIX_01.md` (this record)

## RESOLUTION RULE BEFORE

- List: `fixtures(event) ++ library(event)` (fixtures first, always merged).
- Single spec: fixture table first, library `KB-` resolver second.

## RESOLUTION RULE AFTER

- List: if `library(event)` is non-empty → **library only**; fixtures are used solely as a
  fallback when the event has no canonical library spec at all.
- Single spec: canonical `KB-` library resolver first; fixture table only when no library
  record resolves for that key.
- Generic rule; no ID special-casing; fixtures neither deleted nor renamed; Lab keeps its
  own resolver in `src/lab/data/slice/index.ts` untouched.

## PROVENANCE EVIDENCE

| ID | PRODUCTION SOURCE | LAB SOURCE | BEFORE WINNER | AFTER WINNER | CONTENT MUTATED |
|---|---|---|---|---|---|
| FOOD-001 | knowledge-base CSV opportunities (4 specs, first `KB-FOOD-001-OP001`) | `SLICE_SPECS` BREAKFAST (4 fixtures) | LAB | PRODUCTION | NO |
| CLO-011 | knowledge-base CSV opportunities (1 spec, `KB-CLO-011-OP001`) | `SLICE_SPECS` LAUNDRY (6 fixtures) | LAB | PRODUCTION | NO |
| SHOP-004 | knowledge-base CSV opportunities (3 specs, first `KB-SHOP-004-OP001`) | `SLICE_SPECS` SHOPPING (5 fixtures) | LAB | PRODUCTION | NO |

Resolver rules changed: `participationsForEvent()` merge order, and `getSpaceSpec()` lookup order.

## VERIFICATION

Deterministic resolver-level run (vitest harness, removed after use):

- CASE A FOOD-001: 4 specs, first `KB-FOOD-001-OP001`, `anyFixture=false` — PASS
- CASE B CLO-011: 1 spec, `KB-CLO-011-OP001`, `anyFixture=false` — PASS
- CASE C SHOP-004: 3 specs, first `KB-SHOP-004-OP001`, `anyFixture=false` — PASS
- CASE D Lab-only fixture: all 15 `SPEC-*` IDs still resolve via `getSpaceSpec`; Lab's own
  `src/lab/data/slice/index.ts` resolver untouched; `/lab` route 200 — PASS
- CASE E Unrelated record FOOD-002: 5 specs, first `KB-FOOD-002-OP001`, unchanged — PASS
- CASE F No Lab dependency: `KB-FOOD-001-OP001` resolves with steps from library alone — PASS

Route smoke: `/` 200, `/space` 200, `/lab` 200, `/activities/browse` 200. `tsgo --noEmit` clean.

## SAFETY

- MASTER CONTENT MUTATED: NO
- PRODUCTION FAMILY DATA MUTATED: NO
- DATABASE SCHEMA MUTATED: NO
- PRE-GOLDEN COUNTS CHANGED: NO (domains=6, events/opportunities/cards untouched; knowledge-base
  boot log unchanged: `domains=6 home=5 community=3 pending_cards=274`)
- LIN-01: UNCHANGED — no modules moved out of `src/lab`
- LIN-03: UNCHANGED — Lab sessionStorage untouched
- Contract: no previously ALIGNED requirement altered; resolution provenance only.

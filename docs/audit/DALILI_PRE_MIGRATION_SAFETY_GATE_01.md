# DALILI PRE-MIGRATION SAFETY GATE 01

MODE: BOUNDED PRE-MIGRATION IMPLEMENTATION — FA-04 + FP-01 only.
No content migration. No legacy Master mutation. No snapshot rewrite. No new 82-requirement score.

## 1. BEFORE STATE

| Contract | Status before | Evidence |
| --- | --- | --- |
| FA-04 (identity persisted on canonical Family Participation) | PARTIAL-DRIFT | validated FP definition existed only in memory at entry time (`entry-create.ts`); `active_participations` stored origin/reference only |
| FP-01 (reference read boundary) | PARTIAL-DRIFT | `knowledge-base.ts` legacy rows were consumed with no provenance marker; a legacy row could be read as if framework-valid |

DB before: `active_participations` = 15 rows (reference 13, family_free 1, easy_beginning 1), `functional_identity` populated on 0.

## 2. IDENTITY STORAGE MODEL (A)

- Storage: `public.active_participations.functional_identity` (JSONB, nullable, additive column).
- Owner: the canonical Family Participation id (`active_participations.id`). No side table, no reference-keyed store.
- Producer: `src/lib/framework/participation-identity.ts`
  - `IDENTITY_SCHEMA_VERSION = 1`
  - `identityFromValidatedCandidate()` returns `null` unless all seven FP gates pass (`fp-validity.ts` — FP-02..FP-08).
  - `identityFromFrameworkParticipation()` copies the authored complexity (level, rationale, C1–C4) of a registered framework reference.
  - `identityCompleteness()` → `complete | partial | none`.
  - `parseIdentityBlock()` reads stored JSON defensively.
- Fields: `schema_version, title?, life_context, functional_intent, observable_effect, natural_completion, standalone_role_meaning?, participation_mode, complexity_level?, complexity_rationale?, complexity_dimensions?, validated, validated_gates`.
- C1–C4 are written **only** when authored in the framework reference. Family-authored records store no dimensions and no complexity level — nothing is guessed.
- Existing rows are untouched: no backfill, no inference, no replacement.

## 3. REFERENCE READ BOUNDARY (B)

`src/lib/framework/source-boundary.ts`:
- `classifyReferenceSource(id)` → `{ source: "framework_reference" | "legacy_master", frameworkValidated }` or `null` for unknown ids.
- Decision is made by **model state** (presence in the immutable framework registry after `ensureEasyBeginningCorpus()`), never by hardcoded id lists; `KB-` prefixed ids are resolved through `referenceIdVariants()`.
- `knowledge-base.ts` now stamps every CSV opportunity with `provenance: "legacy_master"`; `home-hierarchy.ts` carries the field.
- `production-store.tsx` / `active-participations.ts` derive `reference_source` from the classifier and attach a framework identity only when the spec is a registered framework reference.

## 4. COEXISTENCE PROOF (26)

- Legacy corpus read live: 274 pending legacy cards across 6 domains, 100% classified `legacy_master`, `frameworkValidated = false`.
- Framework corpus: 5 registered framework references, classified `framework_reference`, `frameworkValidated = true`.
- Both are readable in the same session, distinguishable per record; a new compliant batch can be introduced incrementally without touching the legacy corpus.

## 5. LIVE EVIDENCE (19–22)

| Journey | Result |
| --- | --- |
| J2 family_free (`/space/plan`) | created `b8394d4a-…`; identity persisted (`validated=true`, mode=shared), `reference_spec_id`/`reference_source`/`opportunity_id` all NULL, no C1–C4 |
| J1 easy_beginning (`/space/easy`) | created `a9dc7a4e-…`; identity complete (level=moderate, C1 authored), reference columns NULL — Preferred Context stored separately in the draft selection, not inside identity |
| Reference origin | provenance preserved (`reference_source = legacy_master`, `opportunity_id = KB-FOOD-001-OP002`), identity left NULL — no auto-promotion |
| Downstream smoke | Workspace → Preview → «اعتماد بطاقة المشاركة» → Card, snapshot v1 created, no console/page errors |

## 6. NEGATIVE TESTS (23)

| Test | Result |
| --- | --- |
| Event / bare execution block promoted to FP | NO (unit test; live gate blocked FP-11 case) |
| family_free receives a fabricated reference | NO |
| legacy_master auto-promoted to framework_reference | NO |
| Identity persistence requires a KB id | NO |
| Preferred Context overwrites FP identity | NO |
| Execution block / support / image / run / feedback overwrite identity | NO (identity written at creation only) |
| Old snapshots rewritten | NO |
| Legacy Master mutated | NO |

## 7. FOUNDATION REGRESSION (24)

Foundations 02–08: PASS. Vitest 60/60 green (8 new gate tests). `tsgo --noEmit` clean.
ROUTINE COMPLETION WRITES = 0. IMPLICIT LATEST LEARNER = ABSENT. FAMILY_FREE WITHOUT REFERENCE = PASS. PARTICIPATION IMAGE INDEPENDENT = PASS. SUPPORT ≠ COMPLEXITY = PASS.

## 8. MIGRATION SAFETY (25)

Schema change is additive only: one nullable JSONB column. No compatibility field dropped (`opportunity_id`, `reference_spec_id`, `reference_source` all retained). No data backfill. No destructive statement.

Conclusion: **DALILI PRE-MIGRATION SAFETY GATE 01 = PASS.** Content migration NOT started.

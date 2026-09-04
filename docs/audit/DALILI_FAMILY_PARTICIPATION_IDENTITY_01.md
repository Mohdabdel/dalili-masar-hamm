# DALILI FAMILY PARTICIPATION IDENTITY 01

Foundation Step 3 — Family Participation identity inversion + origin/provenance foundation.
Additive, backward-compatible. No content migration, no entry UX, no FP model change.

## OLD IDENTITY MODEL

`active_participations.id` (uuid PK) already existed and already parented snapshots, runs and
station links, but resolution was keyed by `opportunity_id` (`specId = KB-<opportunity_id>`),
which was NOT NULL. Every lookup (`findParticipation`, `run.start` fallback, lifecycle, closure)
went through the spec key, so a Family Participation could not exist without a Master/reference id.

Traced chain (before): active_participations.id = PK; family key in practice = opportunity_id;
participation_drafts keyed by `spec_id`; participation_snapshots.family_participation_id → ap.id;
participation_runs.family_participation_id → ap.id; participation_feedback → snapshot_id + run_id;
participation_card_states → snapshot_id; participation_station_links → ap.id; routes
`/space/workspace/$specId`, `/space/card/$specId`, `/space/preview/$specId` carry specId.

## NEW IDENTITY MODEL

Canonical Family Participation id = `active_participations.id` (existing stable PK — reused, no
second identity created). New additive columns:

- `origin text NOT NULL DEFAULT 'reference'` — `reference | easy_beginning | family_free`
- `reference_spec_id text NULL` — optional provenance
- `reference_source text NULL` — `legacy_master | framework_reference` (Foundation 02 boundary)
- `opportunity_id` — nullable now; retained as legacy compatibility mirror, deprecated as identity

Constraints: origin enum; reference_source enum; and
`origin='reference' ⇒ reference_spec_id + reference_source present`,
`origin≠'reference' ⇒ reference_spec_id AND opportunity_id NULL` (no fabricated KB ids).
Index `(user_id, reference_spec_id)` for compatibility lookups. No column dropped, no key rewritten.

`src/lib/family-participation.ts` is the repository boundary: `buildFamilyParticipationRow` (pure,
deterministic, rejects contradictory provenance), `createFamilyParticipation`,
`getFamilyParticipation`, `findFamilyParticipationByReference` (spec → canonical id, never reverse).

## ORIGIN MODEL

Origin is immutable creation provenance and carries no lifecycle meaning: status, closure,
completion, complexity, level and support state remain in their existing fields. All three origins
build the exact same row shape and therefore reach the same downstream Draft → Workspace →
Approval → Snapshot → Learner → Run → Feedback → Lifecycle path. No parallel entity was added.

## REFERENCE PROVENANCE

`origin = reference` + `reference.source = legacy_master` for every existing row (all current
references are legacy Master / Lab-fixture spec ids). `framework_reference` is accepted by the same
field, keeping Foundation 02's boundary separate from origin.

## BACKFILL

All 11 existing rows had a non-null `opportunity_id`, so origin = `reference` was semantically
certain for 100% of rows; `reference_spec_id` copied verbatim from `opportunity_id`
(mismatch count = 0), `reference_source = legacy_master`. No wording, draft, snapshot, run,
feedback or lifecycle value was touched.

## COMPATIBILITY STRATEGY

Routes and stored drafts keep using `specId`; the store now resolves spec → canonical id through
`reference_spec_id` and then uses the canonical id for all downstream writes. Rows with a null
reference are simply skipped by the legacy spec-keyed maps rather than being forced into one.
Family Free never needs a specId to enter the downstream services.

## TABLE COUNTS BEFORE/AFTER

| table | before | after |
|---|---|---|
| active_participations | 11 | 11 |
| participation_drafts | 7 | 7 |
| participation_snapshots | 19 | 19 |
| participation_runs | 27 | 27 |
| participation_feedback | 9 | 9 |
| participation_card_states | 5 | 5 |
| participation_station_links | 1 | 1 |
| family_support_assets | 6 | 6 |

Orphan checks after migration: orphan snapshots 0, orphan runs 0, orphan feedback→run 0.
Closed rows: 4 (unchanged).

## TEST EVIDENCE

- `src/lib/__tests__/family-participation.test.ts` — 8 tests: reference provenance stored without
  identity coupling; framework_reference accepted; family_free and easy_beginning produce null
  reference and null opportunity_id; contradictory provenance rejected; identical row shape across
  all origins; origin carries no lifecycle; row → canonical mapping keeps id ≠ specId.
- Database structural test: rows with `origin=family_free` and `origin=easy_beginning` inserted
  successfully with NULL reference and NULL opportunity_id, then removed (counts restored).
- Identity negative evidence in live data: `KB-CLO-001-OP001` maps to 2 distinct Family
  Participation ids and `SPEC-LAUNDRY-COLLECT` to 3 — same reference, distinct family identities.
  27 runs and 19 snapshots hang off 11 parents, so runs/versions create no extra parent.
- Route smoke: `/`, `/activities/browse`, `/space`, `/space/library`, `/lab`, `/my-routine`,
  `/active-participations`, `/participation-guide` all 200. Typecheck clean. 22/22 tests pass.

## REMAINING LEGACY DEPENDENCIES

- Route params and draft keys are still specId (compatibility-only, no user-facing change planned
  in this step).
- `opportunity_id` column retained as a deprecated mirror rather than dropped.
- No user-facing Easy Beginning or Family Free creation surface exists (Foundation 04+).
- `participation_drafts.spec_id` still spec-keyed; converting drafts to canonical-id keys belongs
  with the Workspace/Entry foundations.

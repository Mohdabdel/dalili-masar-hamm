# DALILI Migration Preconditions Closeout 01

## Status

PRECONDITIONS VERIFIED.

This closeout records the current state after the precision content review and before any production content migration. It does not migrate content and does not change the Legacy Master.

## Preconditions Checked

### P1 - Persist FP Identity Block

Status: VERIFIED IN CODE AND SCHEMA.

Evidence:

- `active_participations.functional_identity` exists in Supabase migration `20260906062728_352fdb01-6976-41dc-8120-0d7b3c600534.sql`.
- `src/lib/framework/participation-identity.ts` builds identity only from validated Functional Participation candidates.
- `src/lib/family-participation.ts` accepts `identity` and persists it as `functional_identity`.
- `src/features/space/production-store.tsx` passes `frameworkIdentityForSpec(specId)` when creating a reference-origin family participation.

Boundary:

- Unknown dimensions are omitted, never fabricated.
- Legacy-compatible rows may keep `functional_identity = null`.

### P2 - Read-Side Provenance Boundary

Status: VERIFIED IN CODE.

Evidence:

- `src/lib/framework/reference-model.ts` declares `ReferenceProvenance = "legacy_master" | "framework_reference"`.
- `src/lib/knowledge-base.ts` marks CSV rows as `provenance: "legacy_master"`.
- `src/lib/framework/source-boundary.ts` classifies framework references separately from legacy master rows.
- `src/features/space/production-store.tsx` writes `reference_source` from `classifyReferenceSource(specId)`.

Boundary:

- Legacy rows are not auto-promoted.
- Framework references enter through the registry and gates.
- Both provenances converge downstream through the same family participation row shape.

## Content Review State

Latest precision review corrections are applied:

- Full corrected library: 42 candidates.
- Corrected pilot sample: 12 candidates.
- Expansion sample: 12 candidates, no overlap with pilot.
- Edge sample: 6 candidates.

All reviewed artifacts pass the canonical validator:

| Artifact | Valid | Invalid |
| --- | ---: | ---: |
| `DALILI_PILOT_TEST_SAMPLE_01.json` | 12 | 0 |
| `DALILI_REVIEWER_FULL_LIBRARY_42_01.json` | 42 | 0 |
| `DALILI_PRECISION_REVIEW_EXPANSION_SAMPLE_12_01.json` | 12 | 0 |
| `DALILI_PRECISION_REVIEW_EDGE_SAMPLE_6_01.json` | 6 | 0 |

## Automated Verification

Command:

```bash
npm exec vitest run
```

Result:

- Test files: 10 passed.
- Tests: 82 passed.

The Vite config now skips `mcpPlugin()` only while Vitest is running, avoiding a Windows path-resolution startup failure in the test harness. Normal non-test config still includes the plugin.

## Remaining Before First Migration Batch

The next station can be a first controlled migration batch only if it stays within these constraints:

- Do not mutate `src/data/knowledge/*.csv`.
- Do not touch approved snapshots.
- Register every migrated Functional Participation through the framework gates.
- Persist the identity block on creation.
- Preserve visible provenance between `legacy_master` and `framework_reference`.
- Record the support-category governance decision before migrating support content.

## Next Recommended Station

Prepare `DALILI_MIGRATION_BATCH_03_PLAN_01`:

- choose a small batch from the 42 reviewed candidates,
- map each candidate to a reference identity/provenance path,
- define insertion/promotion rules,
- run the validator before any production-facing migration step.

# DALILI CONTENT MIGRATION - BATCH 03

## Status

PASS - controlled materialization completed after desk review.

This is a small post-review migration batch. It registers six framework references and keeps the Legacy Master immutable. No family data, approved snapshots, support content, or production CSV knowledge files were modified.

## Source

- Plan manifest: `docs/audit/data/DALILI_MIGRATION_BATCH_03_PLAN_01.json`
- Review protocol: `docs/audit/DALILI_BATCH_03_TEST_PROTOCOL_01.md`
- Review sample: `docs/audit/data/DALILI_BATCH_03_TEST_SAMPLE_01.json`
- Review scorecard: `docs/audit/data/DALILI_BATCH_03_TEST_SCORECARD_01.csv`
- Runtime corpus: `src/lib/framework/batch03-corpus.ts`
- Runtime tests: `src/lib/framework/__tests__/batch03-corpus.test.ts`

## Materialized References

| Framework reference | Source candidate | Domain | Title | Complexity | Review decision |
| --- | --- | --- | --- | --- | --- |
| FR-B03-FOOD-001-OP002 | FP-CAND-001 | إعداد الطعام والوجبات | تجهيز مائدة الإفطار | simple | ACCEPT |
| FR-B03-SHOP-009-OP001 | FP-CAND-011 | التسوق وإدارة المشتريات | تجهيز أكياس التسوق للخروج | simple | ACCEPT |
| FR-B03-HOME-018-OP001 | FP-CAND-018 | إدارة المنزل | إعادة الكتب إلى الرفوف | simple | ACCEPT |
| FR-B03-COMM-002-OP001 | FP-CAND-020 | الأنشطة والمشاركة المجتمعية | تجهيز أغراض النزهة العائلية | moderate | ACCEPT |
| FR-B03-HEALTH-001-OP001 | FP-WAVE-A-001 | الصحة والمواعيد | البحث عن رقم العيادة | moderate | ACCEPT |
| FR-B03-CLO-011-OP001 | FP-WAVE-A-005 | الملابس والعناية بها | فرز الملابس المتسخة قبل الغسيل | moderate | ACCEPT |

## Editorial Corrections Before Materialization

- `FR-B03-COMM-002-OP001`: narrowed to pre-outing preparation. Departure cleanup was removed from this reference to avoid mixing two moments in one role.
- `FR-B03-HEALTH-001-OP001`: replaced generic role wording with a direct appointment-preparation effect.

Both corrected records passed the same participation validity checks before materialization.

## Implementation Boundary

- Added `batch03-corpus.ts` as a separate framework corpus.
- Registered Batch 03 through `ensureBatch03Corpus`.
- Included Batch 03 in `source-boundary.ts` and `discovery.ts`.
- Extended discovery deduplication so visible legacy evidence is not shown beside its framework replacement.
- Kept pending-card legacy evidence as source evidence only when it is present in CSV but not exposed by the runtime knowledge loader.

## Verification

- `evaluateFunctionalParticipation`: 6 / 6 passed.
- TypeScript: `npx tsc --noEmit` passed.
- Vitest: `npm exec vitest run` passed, 11 files and 89 tests.

## Non-Changes

- Legacy Master was not edited.
- `src/data/knowledge/*.csv` was not edited.
- Family history was not edited.
- Approved snapshots were not edited.
- Validator rules were not changed.
- Support content was not migrated in this batch.

## Next Station

The next safe station is a small UI/discovery smoke review for the six new framework references:

1. Confirm each Batch 03 reference appears under its event lens.
2. Confirm superseded visible legacy rows do not appear as duplicate cards in the same event.
3. Open one generated card from a simple item and one from a moderate item.
4. Confirm the displayed steps come from `execution_blocks`, not legacy card text.
5. Record any display wording issue as presentation feedback, not source corruption.

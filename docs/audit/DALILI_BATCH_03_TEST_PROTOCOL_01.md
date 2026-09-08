# DALILI Batch 03 Test Protocol 01

## Status

READY FOR REVIEW - NOT MATERIALIZED.

This packet prepares test content for the six Batch 03 planned framework references. It is a review layer only. It does not register framework references, does not mutate Legacy Master, and does not touch family data or approved snapshots.

## Files

- Test sample: `docs/audit/data/DALILI_BATCH_03_TEST_SAMPLE_01.json`
- Scorecard: `docs/audit/data/DALILI_BATCH_03_TEST_SCORECARD_01.csv`
- Source plan: `docs/audit/data/DALILI_MIGRATION_BATCH_03_PLAN_01.json`

## Sample

| Test item | Source candidate | Proposed reference | Domain | Title | Complexity |
| --- | --- | --- | --- | --- | --- |
| B03-TEST-01 | FP-CAND-001 | FR-B03-FOOD-001-OP002 | إعداد الطعام والوجبات | تجهيز مائدة الإفطار | simple |
| B03-TEST-02 | FP-CAND-011 | FR-B03-SHOP-009-OP001 | التسوق وإدارة المشتريات | تجهيز أكياس التسوق للخروج | simple |
| B03-TEST-03 | FP-CAND-018 | FR-B03-HOME-018-OP001 | إدارة المنزل | إعادة الكتب إلى الرفوف | simple |
| B03-TEST-04 | FP-CAND-020 | FR-B03-COMM-002-OP001 | الأنشطة والمشاركة المجتمعية | تجهيز أغراض النزهة العائلية | moderate |
| B03-TEST-05 | FP-WAVE-A-001 | FR-B03-HEALTH-001-OP001 | الصحة والمواعيد | البحث عن رقم العيادة | moderate |
| B03-TEST-06 | FP-WAVE-A-005 | FR-B03-CLO-011-OP001 | الملابس والعناية بها | فرز الملابس المتسخة قبل الغسيل | moderate |

## Review Questions

For each item, review only the visible participation text:

1. Does it read as a family participation opportunity, not a training objective?
2. Is the life context concrete and understandable without external explanation?
3. Is the role meaningful even if it is small or partial?
4. Is the natural completion point visible without performance scoring?
5. Is the wording free from therapy, readiness, mastery, independence, ability, score, diagnosis, age, or repeated-practice framing?
6. Is the role scope appropriate for family participation rather than a complete individual task?
7. Is the source lineage clear enough to avoid mixing candidate ids, proposed framework ids, and Legacy Master evidence ids?

## Decision Labels

- `ACCEPT`: suitable for later materialization as written.
- `REVISE_WORDING`: concept fits, but phrasing needs a small correction.
- `REVISE_CONTEXT`: context or natural completion needs adjustment.
- `REVISE_SCOPE`: role is too broad, too narrow, or not clearly shared.
- `REJECT`: framework drift or irreparable mismatch with family participation.

## Pass Criteria

- At least 5 of 6 items are `ACCEPT`.
- No item is `REJECT`.
- No recurring defect appears in two or more items.
- Any revised item must preserve source evidence and pass `evaluateFunctionalParticipation` after revision.

## Non-Goals

- Do not test child ability.
- Do not score child performance.
- Do not infer diagnosis, age, support level, readiness, mastery, or independence.
- Do not evaluate therapeutic usefulness.

## Materialization Gate

If this review passes, the next implementation step is to convert the six proposed records into registered Batch 03 framework references with lineage tests equivalent to Batch 02.

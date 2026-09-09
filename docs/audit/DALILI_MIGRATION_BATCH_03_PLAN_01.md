# DALILI Migration Batch 03 Plan 01

## Status

MATERIALIZED AFTER DESK REVIEW.

This document records the first controlled post-review migration batch from the corrected 42-candidate library. The six planned references were materialized as framework references after desk review. The materialization does not mutate the Legacy Master, family data, or approved snapshots.

## Source

- Source library: `docs/audit/data/DALILI_REVIEWER_FULL_LIBRARY_42_01.json`
- Plan manifest: `docs/audit/data/DALILI_MIGRATION_BATCH_03_PLAN_01.json`
- Candidate count: 6
- Selection policy: one reviewed candidate from each current domain, favoring low-risk accepted roles with clear context, observable effect, natural completion, and no reviewer rejection.

## Selected Batch

| Candidate | Proposed framework reference | Domain | Title |
| --- | --- | --- | --- |
| FP-CAND-001 | FR-B03-FOOD-001-OP002 | إعداد الطعام والوجبات | تجهيز مائدة الإفطار |
| FP-CAND-011 | FR-B03-SHOP-009-OP001 | التسوق وإدارة المشتريات | تجهيز أكياس التسوق للخروج |
| FP-CAND-018 | FR-B03-HOME-018-OP001 | إدارة المنزل | إعادة الكتب إلى الرفوف |
| FP-CAND-020 | FR-B03-COMM-002-OP001 | الأنشطة والمشاركة المجتمعية | تجهيز أغراض النزهة العائلية |
| FP-WAVE-A-001 | FR-B03-HEALTH-001-OP001 | الصحة والمواعيد | البحث عن رقم العيادة |
| FP-WAVE-A-005 | FR-B03-CLO-011-OP001 | الملابس والعناية بها | فرز الملابس المتسخة قبل الغسيل |

## Validation

The proposed framework records were checked through the actual `evaluateFunctionalParticipation` implementation.

- Candidate source records valid: 6 / 6
- Proposed framework records valid: 6 / 6
- Failed gates: none
- Materialized records: 6

## Desk Review Result

- Test protocol: `docs/audit/DALILI_BATCH_03_TEST_PROTOCOL_01.md`
- Test sample: `docs/audit/data/DALILI_BATCH_03_TEST_SAMPLE_01.json`
- Test scorecard: `docs/audit/data/DALILI_BATCH_03_TEST_SCORECARD_01.csv`
- ACCEPT: 6 / 6
- REJECT: 0 / 6
- Recurring systemic defect: none
- Editorial corrections before materialization:
  - `FR-B03-COMM-002-OP001`: narrowed to pre-outing preparation and removed departure cleanup from this reference.
  - `FR-B03-HEALTH-001-OP001`: replaced generic role wording with direct appointment-preparation effect.

## Hard Constraints

- Legacy Master remains immutable.
- No production-facing migration is performed by this plan.
- Proposed framework ids differ from source candidate and legacy evidence ids.
- Every proposed record must pass `evaluateFunctionalParticipation` before any later materialization.
- No support content is migrated in this batch plan.
- Approved snapshots and family history are untouched.

## Why This Batch

This batch is intentionally small. It gives one clean representative from each domain and avoids cases that still need governance or support-category decisions. It is suitable as the next candidate for a materialization PR, but only after an explicit decision to move from plan to implementation.

## Next Gate Before Materialization

Before expanding beyond this batch, run:

1. Re-read the manifest and confirm no Batch 03 record changed silently.
2. Re-run `evaluateFunctionalParticipation` on all Batch 03 records.
3. Keep lineage tests equivalent to Batch 02.
4. Confirm `classifyReferenceSource(id)` returns `framework_reference / true` for Batch 03 ids.
5. Confirm visible legacy source ids still classify as `legacy_master / false`, while pending-card evidence remains source evidence only.

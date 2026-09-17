# DALILI — CA-0002 CONTRACT ALIGNMENT GATE 01

## Decision

`PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED`

The second governed Contract Alignment batch is complete at draft level. All 100 frozen Legacy
sources are accounted for, every draft candidate passed the canonical, complexity, and semantic
quality gates, and no materialization occurred.

## Scope and outputs

| Measure | Result |
|---|---:|
| Selected Legacy sources | 100 |
| Accounted Legacy sources | 100 |
| Draft FP candidates | 104 |
| Canonical FP validation | 104/104 at 7/7 PASS |
| Complexity validation | 104/104 at 9/9 PASS |
| Semantic anti-template quality | 104/104 PASS |
| GREEN source routes | 92 |
| AMBER source routes | 8 |
| RED source routes | 0 |
| Provenance-only links | 2 |
| Silent drops / orphan outputs / duplicate source IDs | 0 / 0 / 0 |
| Materialized | 0 |

Artifacts:

- `data/DALILI_CA_0002_SELECTION_01.json`
- `data/DALILI_CA_0002_DRAFT_LANE_A.json`
- `data/DALILI_CA_0002_DRAFT_LANE_B.json`
- `data/DALILI_CA_0002_DRAFT_LANE_C.json`
- `data/DALILI_CA_0002_CONTRACT_ALIGNMENT_RESULT_01.json`

Executable verification:

- `scripts/build-ca0002-selection.mjs`
- `scripts/build-ca0002-result.mjs`
- `src/lib/framework/__tests__/ca0002-contract-alignment.test.ts`
- `src/lib/framework/__tests__/contract-alignment-quality.test.ts`

## Disposition execution

- 75 REWRITE_REQUIRED and 17 ACCEPTED sources produced 92 complete one-to-one FP drafts.
- Six SPLIT_REQUIRED sources produced 12 complete child drafts.
- Two MERGED_BY_PROVENANCE sources produced two explicit provenance links and no duplicate drafts.
- The batch therefore contains 104 FP candidates from 100 fully conserved source decisions.

## Routed safety exceptions

The following repairable sources remain AMBER and excluded from materialization until their stated
safety conditions are explicitly governed:

- `CLO-014-OP001`: تشغيل مجفف كهربائي يحتاج شروط سلامة تشغيلية غير محددة في المصدر.
- `CLO-020-OP001`: استخدام الإبرة يحتاج شرط سلامة سياقيًا غير مثبت في المصدر.
- `CLO-021-OP001`: استخدام الإبرة يحتاج شرط سلامة سياقيًا غير مثبت في المصدر.
- `COMM-003-OP003`: عبور الشارع يحتاج شروط نقطة عبور ورؤية أو إشارة ومرافقة آمنة غير مثبتة بالكامل في المصدر.
- `FOOD-001-OP003`: تقطيع الخبز بأداة حادة يحتاج شرط سلامة تشغيلية غير مثبت في المصدر.
- `FOOD-003-OP001`: تقطيع مكونات الطعام بأداة حادة يحتاج شرط سلامة تشغيلية غير مثبت في المصدر.
- `FOOD-004-OP004`: حمل مشروبات ساخنة يحتاج حد حرارة وتسليم آمن غير مثبتين في المصدر.
- `HOME-042-OP002`: ارتفاع الجهاز وأثر صوت الإنذار وشروط الوصول الآمن غير مثبتة في المصدر.

## Verification evidence

- Deterministic routing and conservation tests: PASS.
- CA-0002 integrated gate and semantic-quality tests: PASS.
- All 104 candidates pass canonical 7/7, complexity 9/9, and semantic anti-template validation.
- Selection and result regeneration are deterministic.
- TypeScript strict validation for the framework validators: PASS.
- Legacy Master unchanged; canonical validator unchanged.

## Authorization boundary

This gate authorizes continued controlled Contract Alignment expansion. It does not authorize
materialization. All eight AMBER sources remain excluded until their recorded safety conditions are
resolved and revalidated.

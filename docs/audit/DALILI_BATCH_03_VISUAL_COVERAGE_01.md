# DALILI Batch 03 Visual Coverage 01

## Scope

This audit records the visual-readiness pass for the migrated Batch 03 family participation opportunities.

The pass covers only the Batch 03 execution-step image layer. It does not modify the Legacy Master corpus, the family source data, or the canonical participation text.

## Generated Asset Set

One neutral 3x2 visual sheet was generated for the following family-life contexts and cropped into six project images:

| File | Covered context |
| --- | --- |
| `/assets/execution/batch03/B03-FOOD-TABLE.png` | Breakfast table preparation |
| `/assets/execution/batch03/B03-SHOP-BAGS.png` | Carrying shopping bags to the car |
| `/assets/execution/batch03/B03-HOME-BOOKS.png` | Collecting and returning books to a shelf |
| `/assets/execution/batch03/B03-COMM-PICNIC.png` | Preparing picnic items and placing them in a bag or car |
| `/assets/execution/batch03/B03-HEALTH-CLINIC-NUMBER.png` | Finding a clinic number from a contact source |
| `/assets/execution/batch03/B03-CLO-LAUNDRY-SORT.png` | Sorting laundry groups |

## Catalog Coverage

Thirteen canonical catalog and inventory rows were added under source `DALILI_VISUAL_BATCH_03_FP`, each marked `FINAL` and `APPROVED_FOR_PILOT`.

| Visual ref | Opportunity | Step label |
| --- | --- | --- |
| `VRS-B03-FOOD-TABLE-001` | `FR-B03-FOOD-001-OP002` | تحضير الأطباق والأكواب |
| `VRS-B03-FOOD-DRINKS-001` | `FR-B03-FOOD-001-OP002` | تحضير المشروبات المرافقة |
| `VRS-B03-SHOP-BAGS-001` | `FR-B03-SHOP-009-OP001` | حمل الأكياس الفارغة إلى السيارة |
| `VRS-B03-HOME-BOOKS-COLLECT-001` | `FR-B03-HOME-018-OP001` | جمع الكتب المتناثرة |
| `VRS-B03-HOME-BOOKS-SHELF-001` | `FR-B03-HOME-018-OP001` | إعادة الكتب وتصفيفها بشكل عمودي |
| `VRS-B03-COMM-PICNIC-PREP-001` | `FR-B03-COMM-002-OP001` | تجهيز أغراض النزهة |
| `VRS-B03-COMM-PICNIC-BAG-001` | `FR-B03-COMM-002-OP001` | وضع الأغراض في الحقيبة أو السيارة |
| `VRS-B03-HEALTH-SOURCE-001` | `FR-B03-HEALTH-001-OP001` | فتح مصدر الأرقام |
| `VRS-B03-HEALTH-SEARCH-001` | `FR-B03-HEALTH-001-OP001` | البحث عن اسم العيادة |
| `VRS-B03-HEALTH-NUMBER-001` | `FR-B03-HEALTH-001-OP001` | تحديد الرقم المطلوب |
| `VRS-B03-CLO-LIGHT-DARK-001` | `FR-B03-CLO-011-OP001` | فصل الملابس الفاتحة عن الداكنة |
| `VRS-B03-CLO-DELICATE-001` | `FR-B03-CLO-011-OP001` | فصل الأقمشة الحساسة |
| `VRS-B03-CLO-GROUP-001` | `FR-B03-CLO-011-OP001` | تجميع كل مجموعة معًا |

## Automated Verification

- `npx tsc --noEmit`: passed.
- `npm exec vitest run`: passed, 90 tests across 12 test files.
- Added `batch03-visual-coverage.test.ts` to assert every Batch 03 execution block resolves to a renderable, non-pending step image.

## UI Smoke Verification

The lab workspace was checked at `/lab/slice/workspace/:id` for the six Batch 03 participations.

| Opportunity | Batch 03 images in DOM | Dimensions | Pending exact image text | Console warnings/errors |
| --- | ---: | --- | --- | --- |
| `FR-B03-FOOD-001-OP002` | 6 | `488x488` | no | 0 |
| `FR-B03-SHOP-009-OP001` | 3 | `488x488` | no | 0 |
| `FR-B03-HOME-018-OP001` | 6 | `488x488` | no | 0 |
| `FR-B03-COMM-002-OP001` | 6 | `488x488` | no | 0 |
| `FR-B03-HEALTH-001-OP001` | 9 | `488x488` | no | 0 |
| `FR-B03-CLO-011-OP001` | 9 | `488x488` | no | 0 |

Result: passed. All checked pages stayed in the lab workspace, did not redirect to auth, did not display an error state, and rendered Batch 03 images with non-zero natural dimensions.


# DALILI Expansion Sample 12 Visual Readiness 01

## Status

VISUAL REVIEW COVERAGE READY - NOT MATERIALIZED AS BATCH 04.

This pass adds visual review coverage for the corrected 12-item expansion sample. It does not convert the corrected review candidates into runtime framework references and does not modify Legacy Master content.

## Inputs

- Corrected candidate packet: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_CORRECTED_01.json`
- Visual asset source: generated review images, cropped into project-local step images.

## Asset Output

Fourteen image files were saved under `/assets/execution/expansion12/`:

| File | Primary use |
| --- | --- |
| `EXP12-HOME-PANTRY-REMOVE.png` | إخراج علب الرف |
| `EXP12-HOME-PANTRY-WIPE.png` | مسح رف المؤن |
| `EXP12-HOME-PANTRY-GROUP.png` | تجميع علب المؤن |
| `EXP12-FOOD-VEG-COLANDER.png` | وضع الخضروات في المصفاة |
| `EXP12-FOOD-VEG-RINSE.png` | غسل الخضروات |
| `EXP12-FOOD-HOSPITALITY-TRAY.png` | ترتيب صينية الضيافة |
| `EXP12-CLO-LAUNDRY-FOLD.png` | طي قطعة ملابس |
| `EXP12-CLO-SHOES-RACK.png` | إرجاع الحذاء إلى الرف |
| `EXP12-SHOP-LIST-ITEM.png` | إضافة عنصر إلى قائمة التسوق |
| `EXP12-SHOP-CART-PULL.png` | سحب عربة التسوق |
| `EXP12-COMM-CAFE-ORDER.png` | إبلاغ موظف المقهى بالطلب |
| `EXP12-COMM-PICKUP-ORDER.png` | عرض رقم طلب الطعام للموظف |
| `EXP12-HEALTH-REPORTS-BAG.png` | وضع التقارير الطبية في الحقيبة |
| `EXP12-HEALTH-ALARM-SET.png` | إعداد منبه موعد الدواء مع الأسرة |

## Catalog And Inventory

- Added 28 canonical visual catalog rows under source `DALILI_VISUAL_EXPANSION_12`.
- Added matching inventory rows with `link_layer=step-image`.
- QA status is `APPROVED_FOR_REVIEW`, not `APPROVED_FOR_PILOT`, because the corrected sample remains behind the materialization gate.

## Verification

- `expansion-sample-review.test.ts` now checks three things:
  - The corrected packet remains review data.
  - All 12 candidates pass `evaluateFunctionalParticipation`.
  - Every corrected `execution_block` resolves to an `/assets/execution/expansion12/` image through `suggestStepImage` and `resolveStepImage`.

## Next Station

The next safe station is a limited Batch 04 materialization decision. If approved, only the corrected candidates should be promoted, with new framework ids and lineage tests equivalent to Batch 03.


# DALILI Batch 03 UI Smoke Review 01

## Status

PASS with one environment note.

This smoke review checks that the six Batch 03 framework references are visible through the discovery/workspace surface and that displayed workspace steps come from `execution_blocks`, not legacy card wording.

## Environment

- Local dev server: `http://localhost:5173/`
- Dev command used: `DALILI_DISABLE_MCP_PLUGIN=true npm run dev -- --host 127.0.0.1 --port 5173`
- Reason for `DALILI_DISABLE_MCP_PLUGIN`: the MCP Vite plugin fails locally on Windows because its route containment check compares mixed path separators.
- Open review surface: `/lab/slice/...`
- Production `/space/...` routes redirected to `/auth`, so logged-out smoke review used the lab slice route that reads the same catalog/discovery layer.

## Event Lens Checks

| Event | Level path | Expected Batch 03 reference | Result |
| --- | --- | --- | --- |
| FOOD-001 | `/lab/slice/FOOD-001/level` then simple | `FR-B03-FOOD-001-OP002` | PASS |
| COMM-002 | `/lab/slice/COMM-002/level` then moderate | `FR-B03-COMM-002-OP001` | PASS |
| HEALTH-001 | `/lab/slice/HEALTH-001/level` then moderate | `FR-B03-HEALTH-001-OP001` | PASS |

The direct `/lab/slice/{eventId}/participations` page asks the family to choose a level first. After level selection, Batch 03 references appeared in the correct event lists.

## Workspace Checks

| Framework reference | Workspace result | Step source result |
| --- | --- | --- |
| FR-B03-FOOD-001-OP002 | PASS | Shows `تحضير الأطباق والأكواب` and `تحضير المشروبات المرافقة`. |
| FR-B03-SHOP-009-OP001 | PASS | Shows `حمل الأكياس الفارغة إلى السيارة`. |
| FR-B03-HOME-018-OP001 | PASS | Shows `جمع الكتب المتناثرة` and `إعادة الكتب وتصفيفها بشكل عمودي`. |
| FR-B03-COMM-002-OP001 | PASS | Shows `تجهيز أغراض النزهة` and `وضع الأغراض في الحقيبة أو السيارة`; does not show departure cleanup inside this reference. |
| FR-B03-HEALTH-001-OP001 | PASS | Shows `فتح مصدر الأرقام`, `البحث عن اسم العيادة`, and `تحديد الرقم المطلوب`; does not show legacy performance wording. |
| FR-B03-CLO-011-OP001 | PASS | Shows `فصل الملابس الفاتحة عن الداكنة`, `فصل الأقمشة الحساسة`, and `تجميع كل مجموعة معًا`; does not show legacy skill/training wording. |

## Console

No browser console errors or warnings were captured during the checked pages.

## Notes

- `COMM-002-OP004` still appears as a separate visible legacy opportunity in the COMM-002 moderate list. This is expected: it is no longer part of Batch 03 source evidence after the narrowing correction, and it remains its own legacy row.
- No production CSV, family history, approved snapshots, or validator rules were changed by this smoke review.

## Result

Batch 03 passes the local UI/discovery smoke review. The next safe station is a logged-in `/space` smoke review if account access is available, or a small presentation polish pass for missing visual placeholders in some Batch 03 workspace steps.

# DALILI-VISUAL-PREVIOUS-ASSETS-AUDIT-AND-LINK-01

تدقيق فعلي لكل الإنتاج البصري الموجود داخل المشروع، وربط ما يصلح منه بفرص المشاركة
عبر طبقة التنفيذ فقط. لم تُعدّل ملفات المعرفة `01_domains.csv` … `04_participation_cards.csv`.

## 1) نطاق الفحص

- `public/assets/**` بالكامل (بما فيها المجلد التجريبي `execution/pantry/`).
- `src/assets/**` (أصول مجمّعة عبر الـbundler).
- سجلات المستودع: `14_visual_asset_staging.csv`، `15/16` (QA)، `17_visual_asset_qa_summary.csv`،
  `18_visual_asset_catalog_final.csv`، `09_visual_frames.csv`، `10_execution_recipes.csv`.

## 2) نتيجة الحصر

المخزون الموحّد في `src/data/execution/19_visual_asset_inventory.csv` (19 ملفًا موجودًا فعليًا):

| المجموعة | العدد | الدور |
|---|---|---|
| دفعة BATCH_03 (لوحات مرجعية) | 8 | canonical linked |
| خيارات الوجبة (BATCH_01) | 2 | canonical linked |
| إطارات خزانة المؤن (BATCH_02) | 3 | canonical linked |
| اللوحة المصدر لخزانة المؤن | 1 | archive (لا تُعرض) |
| صور واجهة تزيينية `act-*.jpg` | 5 | unlinked — UNLINKED_NEEDS_MAPPING |

سجلات QA بلا ملفات ثنائية (نسخ `-002` وما شابه) تبقى archive/REGENERATE/UNMATCHED
ولا تدخل المكتبة إطلاقًا؛ عددها 8 سجلات في `17_visual_asset_qa_summary.csv`.

## 3) قواعد التنفيذ المطبّقة

1. المصدر الوحيد للصور في الواجهة هو `src/lib/visual-asset-catalog.ts`
   (`resolveVisualAssetSrc` / `getRenderableVisualAssets`). أُزيل آخر استيراد صلب للصور
   داخل الواجهة بحذف `VisualAidPrototype.tsx` واستبداله بـ `VisualSupportAid`.
2. الـresolver يفحص الملفات الموجودة فعليًا في `public/assets/execution/**` و`src/assets/*`،
   ويعيد `null` عند غياب الملف الثنائي (لا صورة مكسورة، ولا رسالة جديدة للمستخدم).
3. بوابة QA داخل الـresolver: يُستبعد أي سجل حالته `REJECTED` أو `REGENERATE` أو `UNMATCHED`،
   ويُستبعد أي سجل دوره `archive`.
4. الربط بالفرص في `src/lib/visual-support-map.ts` فقط (طبقة تنفيذ منفصلة عن المعرفة).
5. `HOME-052-OP001` تُعرض أصولها عبر مشغّل الإطارات، فلا يكررها قسم التوضيح البصري العام.

## 4) الأصول المتعذر ربطها

| الأصل | السبب |
|---|---|
| `PANTRY_SHELF_01-sheet.webp` | لوحة مصدر قُطّعت إلى ثلاثة إطارات معتمدة؛ عرضها يكرر المحتوى ⇒ archive بقرار أمين المستودع |
| `act-sleep / act-tv / act-plants / act-clean / act-shopping` | صور واجهة تزيينية سابقة للمستودع، لا تحمل `asset_code` ولا سياق فرصة يقيني ⇒ `UNLINKED_NEEDS_MAPPING` بلا تخمين |

## 5) التحقق

- typecheck و build: أخضر.
- اختبار واجهة فعلي على بطاقات منشورة: عرض الصورة من الـresolver دون كسر.

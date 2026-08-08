# قرار أمين المستودع — DALILI_VISUAL_BATCH_03

**المهمة:** DALILI-VISUAL-QA-BATCH-03-UPDATE-01
**المصدر:** تقرير Gemini لفحص الجودة البصرية (الدفعة الثالثة)
**النطاق:** طبقة Staging وQA فقط — لا عرض في الواجهة، ولا تعديل على ملفات المعرفة 01–04، ولا تعديل على الوصفات (Recipes) أو الـ Pilots القائمة.

## الخلاصة

| الحالة | العدد |
|---|---|
| APPROVED | 7 |
| REGENERATE | 3 |
| UNMATCHED | 6 |
| **الإجمالي** | **16** |

## معتمد (APPROVED) — 7

- VRS-HOME-ITEMS-ORGANIZE-001
- VRS-HOME-ITEMS-ORGANIZE-002
- VRS-HOME-WASTE-OUT-002
- VRS-HOME-WATER-FILL-001
- VRS-HOME-WATER-FILL-002
- VRS-HOME-DISH-UNLOAD-001
- VRS-HOME-DISH-UNLOAD-002

الاعتماد بصري فقط. لا يُنشأ Frame Register نهائي في هذه الجولة؛ يُؤجَّل إلى مرحلة القص اللاحقة.

## إعادة توليد (REGENERATE) — 3

| الأصل | السبب | الخطورة |
|---|---|---|
| VRS-HOME-WASTE-OUT-001 | أرقام (1 2 3 4) مضمّنة داخل الصورة | High |
| VRS-HOME-SNACK-PREP-001 | خطأ منطقي: الطبق يظهر في الإطار الأخير فقط | High |
| VRS-HOME-SNACK-PREP-002 | خطأ منطقي: الطبق يظهر في الإطار الأخير فقط | High |

## غير مطابق للتسليم (UNMATCHED) — 6

- VRS-HOME-BED-MAKE-001
- VRS-HOME-BED-MAKE-002
- VRS-HOME-CLOSET-ORGANIZE-001
- VRS-HOME-CLOSET-ORGANIZE-002
- VRS-HOME-CLOTHES-FOLD-001
- VRS-HOME-CLOTHES-FOLD-002

**توضيح مهم:** حالة UNMATCHED ليست رفضًا بصريًا ولا حكمًا على جودة الأصل. سببها الوحيد أن ملف الصورة لم يُسلَّم ضمن دفعة Gemini، فتعذّر الفحص. الإجراء المطلوب هو تسليم الملفات وإعادة إدراجها في دفعة فحص لاحقة.

## أثر القرار على الملفات

- `src/data/execution/14_visual_asset_staging.csv` — تحديث/إضافة السجلات مع `qa_status` مطابق حرفيًا، وعمود `qa_source_code` للحفاظ على الأكواد المرجعية الحالية المنتهية بـ `-V01` دون كسرها.
- `src/data/execution/17_visual_asset_qa_summary.csv` — سجل النتائج الستة عشر.
- `src/data/execution/15_visual_frame_qa.csv` — يبقى فارغًا؛ لا تُسجَّل إطارات لأصول UNMATCHED أو REGENERATE، وتؤجَّل الأصول المعتمدة لمرحلة القص.

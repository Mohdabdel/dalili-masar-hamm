# DALILI-EXECUTION-ASSETS-PILOT-V1

**النطاق:** مكتبة الأصول البصرية التجريبية النهائية. لا تغيير على الهوية البصرية أو التنقل أو ملفات المعرفة 01–04.

## القاعدة الحاكمة

لا يوجد "Final A" أو "Final B". لكل `asset_code`/نشاط أصل **Canonical واحد فقط** في مكتبة الـPilot. أي نسخة أخرى لنفس الـ visual family تُعد **Archive**: لا تُعرض في التطبيق، ولا تُربط ببطاقات التنفيذ، ولا تُستخدم كبديل لمجرد تشابه الاسم.

## السجل النهائي — 8 أصول Canonical

المصدر الوحيد للحقيقة: `src/data/execution/18_visual_asset_catalog_final.csv`

| asset_code | العنوان | الحالة | QA |
|---|---|---|---|
| VRS-HOME-ITEMS-ORGANIZE-001 | ترتيب الأغراض الشخصية | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-WASTE-OUT-001 | إخراج النفايات المنزلية | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-WATER-FILL-001 | تعبئة زجاجة الماء | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-SNACK-PREP-001 | تجهيز وجبة خفيفة | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-DISH-UNLOAD-001 | إخراج الأطباق من غسالة الصحون | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-CLOTHES-FOLD-001 | طي الملابس | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-CLOSET-ORGANIZE-001 | ترتيب الملابس بالخزانة | FINAL | APPROVED_FOR_PILOT |
| VRS-HOME-BED-MAKE-001 | ترتيب السرير | FINAL | APPROVED_FOR_PILOT |

## مسارات الملفات

المسار المعتمد: `public/assets/execution/visual/{file_name}` ويُقدَّم في التطبيق على `/assets/execution/visual/{file_name}`.

## حالة الملفات الثنائية

لم تصل ملفات الصور الثنائية إلى المستودع في هذه الدفعة. لذلك:

- لم تُنشأ أي ملفات وهمية ولا روابط مكسورة.
- كل السجلات الثمانية تحمل `missing_binary=true`.
- الربط بالواجهة يبقى **معطلاً** لهذه الأصول حتى وصول الملفات الفعلية، ثم يُضبط `missing_binary=false` لكل ملف يصل.

## الأصول الأخرى في نفس العائلات

النسخ ذات اللاحقة `-002` والنسخ `-V01` داخل `14_visual_asset_staging.csv` ليست canonical (`library_role=archive`) ولا تدخل العرض.

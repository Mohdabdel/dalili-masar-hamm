# DALILI Visual Coding Standard

معيار ترميز الأصول البصرية لدفعات دليلي (يبدأ التطبيق من الدفعة `DALILI_VISUAL_BATCH_02`).

## 1. صيغ الترميز

- **Reference Sheet:** `VRS-{DOMAIN}-{VISUAL_FAMILY}-{VARIANT}-{VERSION}.jpg`
- **Frame:** `FR-{VISUAL_FAMILY}-{ASSET_VARIANT}-F{FRAME_NO}-{VERSION}.webp`

## 2. قواعد frame_no

- `frame_no` معرف داخل اللوحة فقط، وليس `display_order` ملزمًا.
- ترتيب العرض الفعلي تحدده Execution Recipe لا رقم الإطار.

## 3. قواعد الإنتاج

- لا تدمج أرقام الخطوات داخل الصورة.
- الترتيب والاختصار والتكرار تحكمها Execution Recipe فقط.

## 4. قواعد QA

- الأصل المرفوض (`REJECTED`) لا يتحول إلى Frames.
- `APPROVED_WITH_NOTES` يسمح باستبعاد Frames محددة فقط بعد اعتماد أمين المستودع.

## 5. طبقة Staging

- سجلات الأصول قبل الاعتماد تُحفظ في `src/data/execution/14_visual_asset_staging.csv`.
- لا تُعرض أي أصول Staging في واجهة المستخدم ولا تُربط ببطاقات التنفيذ قبل اعتماد QA.

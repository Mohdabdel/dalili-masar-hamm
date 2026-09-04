# DALILI SUPPORT TAXONOMY FOUNDATION 01 (Foundation 08 — D03 / Cluster 9)

BEFORE SUPPORT MODEL:
- مجموعتان مغلقتان متصادمتان في `src/lab/slice/types.ts`:
  - `LabSupportAssetType = "communication" | "time" | "schedule"` (يُخزَّن في `family_support_assets.type`).
  - `LabSupportAssetKind = "schedule" | "now-next" | "choice-board" | "sequence"` (يُخزَّن في `config.kind`).
  - التصادم: القيمة `schedule` موجودة في المجموعتين بمعنيين مختلفين، و`type=schedule` وحده يخدم فئتين (جدول/تسلسل).
- قائمة فئات ثالثة مكرّرة داخل واجهة `SupportGenerator.tsx` (`KINDS`).
- طبقات دعم أخرى منفصلة تماماً وغير مشمولة بهذا التطبيع (طبقة تنفيذ للقراءة فقط):
  `src/lib/execution-support.ts`، `src/lib/support-decisions.ts` (CSV 13)، `src/lib/visual-support-map.ts`،
  `SupportDuringExecution.tsx`، `VisualSupportAid.tsx`، `LabVisualStatus`، وأدلة الخدمات المجتمعية/التعليمية.
- الاستخدام: Workspace (توليد/عرض/حذف) → store (`support.add/remove`) → Supabase `family_support_assets`
  → التجميد في `buildFrozenSnapshot` (`supportAssetIds`, `supportAssetsFrozen`) → المشارك: لا شيء.

CANONICAL SUPPORT MODEL:
`src/lib/support/taxonomy.ts` — سجلّ معلن واحد (`registerSupportCategory` / `listSupportCategories` /
`resolveSupportCategory` / `toSupportInstance`).

CATEGORY:
`SupportCategory { id, label_ar, hint_ar, legacyStorageType, legacyKind?, contentMode, entriesTake, requiresImage, experimental? }`.
الفئات المعلنة اليوم: `visual_schedule`، `step_sequence`، `now_next`، `choice_board` — أمثلة مرجعية موثّقة لا كون مغلق.

INSTANCE/TOOL/ASSET:
`SupportInstanceView { instanceId, categoryId, categoryLabel_ar, certainty, label_ar, specId, items, hasAsset, provenance }`.
هوية الوسيلة (`instanceId`) مستقلة عن هوية الفئة؛ وسيلتان من نفس الفئة تحملان هويتين مختلفتين.
المحتوى/الصورة اختياريان: لا فئة تشترط صورة (`requiresImage = false` للجميع).

LEGACY COMPATIBILITY:
حدّ توافق للقراءة فقط، بلا إعادة كتابة أي صف تاريخي:
| القيمة القديمة (type/kind) | الفئة القانونية | اليقين |
|---|---|---|
| schedule/schedule | visual_schedule | legacy_mapped |
| schedule/sequence | step_sequence | legacy_mapped |
| time/now-next | now_next | legacy_mapped |
| communication/choice-board | choice_board | legacy_mapped |
| schedule/- (بلا kind) | legacy_unknown | unknown — تُحفظ كما هي بلا تخمين |
الفئة الجديدة تُخزَّن داخل `config.categoryId` (إضافة غير هادمة) — لا تغيير مخطط.
دليل حيّ: صف ما قبل Foundation 08 (`c325a28e…`, KB-CLO-010-OP001, time/now-next, بلا categoryId)
يُحمَّل ويُعرض في Workspace بوسم «الآن / بعد»، والمعاينة تعمل.

OPTIONALITY:
صفر وسائل مسموح: النسخ v1–v4 لمشاركة `10bf7c3e…` معتمدة بـ`supportAssetsFrozen` فارغة،
والمشارك والتشغيل يعملان دونها. لا شرط دعم للاعتماد أو النسخة أو التشغيل.

CONTEXTUALITY:
الدعم مملوك للمشاركة الأسرية (`spec_id` + `user_id`)؛ لا جدول ولا حقل يربطه بسمة/مستوى/جاهزية للمشارك.

COMPLEXITY INVARIANT:
التعقيد تحريري (`FrameworkComplexity` في `reference-model.ts`) ولا يُحسب من أي مدخل؛ لا مسار كود يقرأ
عدد أو فئة الدعم عند التعقيد. اختبار: 0/1/5 وسائل وفئات مختلفة → C1..C4 والمستوى دون تغيير.

FP VALIDITY INVARIANT:
`evaluateFunctionalParticipation` لا يستقبل الدعم إطلاقاً؛ اختبار يثبت تطابق النتيجة والبوابات السبع مع/بدون دعم.

SNAPSHOT FREEZE:
`buildFrozenSnapshot` يجمّد `categoryId` المحسوم وقت الاعتماد داخل `supportAssetsFrozen`.
دليل حيّ (مشاركة `10bf7c3e…`): v5 = وسيلة واحدة بلا فئة (نسخة ما قبل 08، لم تُمسّ)،
v6 = `visual_schedule`، v7 = `choice_board` بعد حذف S1 وإضافة S2 — لا نسخة قديمة تغيّرت.

LEARNER BOUNDARY:
بطاقة المشارك تُبنى من `snap.frames` فقط؛ لا `supportAssetsFrozen` ولا `categoryId` ولا اعتبارات ولا مبرر تعقيد.

EXTENSIBILITY:
تسجيل فئة معتمدة جديدة وقت التشغيل عبر `registerSupportCategory` دون: تعديل محتوى مرجعي، ولا FP، ولا تعقيد،
ولا مخطط قاعدة بيانات، ولا إعادة كتابة نسخة تاريخية. الفئات `experimental` لا تظهر للأسر.

NEGATIVE TESTS:
A صفر دعم يمنع الاعتماد = NO · B العدد يغيّر التعقيد = NO · C الفئة تغيّر التعقيد = NO ·
D الدعم يغيّر صلاحية FP = NO · E الدعم يصبح مستوى قدرة = NO · F الدعم يصبح كتلة تنفيذ = NO ·
G الدعم يصبح صورة المشاركة = NO · H حذف صورة المشاركة يحذف الدعم = NO (تحقق حيّ Foundation 07/08) ·
I حذف الدعم يحذف الصورة = NO · J تعديل دعم v2 يغيّر v1 = NO · K family_free يشترط KB = NO ·
L فئة جديدة تتطلب تعديل Master = NO.

REMAINING GAPS:
- طبقة الدعم التنفيذية القديمة (CSV 13، visual-support-map، execution-support) ما زالت مجموعات منفصلة
  خارج السجلّ — لم تُطبَّع عمداً (خارج نطاق D03 وتتطلب هجرة محتوى).
- `LabVisualStatus` (8 قيم) يبقى مفهوم جاهزية بصرية منفصل عن فئة الدعم.
- صفوف دعم قديمة تعود لمستخدمين آخرين لم تُفحص حيّاً (RLS) — منطق التوافق نفسه مغطّى باختبار وحدة.

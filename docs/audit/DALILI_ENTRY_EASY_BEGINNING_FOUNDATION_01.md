# DALILI ENTRY ARCHITECTURE + EASY BEGINNING + PREFERRED CONTEXT — FOUNDATION 06

MODE: CONTROLLED USER-FACING FOUNDATION
TARGETS: EN-01..EN-06, EB-01..EB-05, D01, Cluster 5

## HOME ENTRY MODEL

الصفحة الرئيسية تعرض ثلاث استراتيجيات دخول أولية فقط (`src/routes/index.tsx` → `ENTRY_STRATEGIES`):

1. بداية سهلة → `/space/easy`
2. أخطط المشاركة بنفسي → `/space/plan`
3. استكشف المشاركات الممكنة → `/space/explore`

المسارات القديمة (مساحة عمل الأسرة، محطات روتيننا، مكتبة المشاركات) بقيت روابط ثانوية غير تنافسية
(`SECONDARY_PATHS`) حفاظاً على العلامات المرجعية. لا يوجد نموذج دخول قانوني منافس على الصفحة الرئيسية.
`/help-me-choose` (توجيه بمستوى المشاركة) أُلغي دوره القانوني ويعيد التوجيه إلى `/space/easy` (307).

## EASY BEGINNING

`src/features/space/pages/EasyBeginningPage.tsx`:
A. اختيار سياق مفضّل (مقترح مرجعي ثابت) أو كتابته بلغة الأسرة.
B. تنقيح اختياري بصياغة الأسرة (لا يمسّ نص المرجع).
C. عرض مرشحين لمشاركة وظيفية مرتبطين بذلك السياق فقط، وكلهم مرّوا على عقد الصلاحية.
D. اختيار مرشح أو كتابة مشاركة الأسرة نفسها.
E. إنشاء مشاركة أسرية `origin = easy_beginning`.
F. الانتقال إلى نفس مساحة العمل المشتركة `/space/workspace/$specId`.

لا سؤال عن قدرة أو جاهزية أو استقلالية أو مستوى أو تشخيص. لا فرض لمستوى `simple`:
المرشحون يحملون مستوى تعقيد المهمة نفسها (simple/moderate)، والمشاركة المكتوبة من الأسرة تُنشأ بمستوى وسيط محايد.

## PREFERRED CONTEXT

`src/lib/entry/preferred-context.ts` (D01):
- `source = "family" | "reference"` حقل صريح.
- `REFERENCE_PREFERRED_CONTEXTS` مجمّدة بـ `Object.freeze` (اختبار يثبت رفض التعديل).
- `referenceText` و`familyText` حقلان منفصلان؛ العرض يفضّل صياغة الأسرة دون الكتابة فوق نص المرجع.
- السياق المفضّل لا يُخزَّن كحدث ولا كمشاركة وظيفية؛ يُحفظ داخل مسودة المشاركة فقط.

## PLAN MYSELF

`src/features/space/pages/PlanMyselfPage.tsx` + `FamilyParticipationForm.tsx`:
أسئلة بلغة يومية عن الموقف (لا عن الشخص) تُترجَم داخلياً إلى مرشح مشاركة وظيفية ويُمرَّر على
`evaluateFunctionalParticipation`. عند النقص تُعرض رسالة عائلية ولا تُنشأ المشاركة.
`origin = family_free`، `reference_spec_id = null`، `opportunity_id = null`، ولا معرّف `KB-*`.

## EXPLORE EVENT

`ExplorePage` عدسة الحدث → `/space/$eventId/level` → قائمة المشاركات الوظيفية داخل الحدث → مساحة العمل.
الحدث نفسه غير قابل للاختيار كمشاركة وظيفية.

## EXPLORE ROUTINE STATION

عدسة المحطة تعرض محطات وصفية (`defaultStations`) ثم تفتح مشاركات صالحة داخلها.
لا حالة إنجاز، ولا قائمة تحقق، ولا سلسلة التزام — `part_of_day` وصفي فقط (Foundation 04 سليم).

## ORIGIN MAPPING

| مدخل | origin | reference |
|---|---|---|
| بداية سهلة | `easy_beginning` | لا شيء في الصف؛ مصدر المرشح يُحفظ في `provenance` داخل المسودة |
| أخطط بنفسي | `family_free` | لا شيء |
| استكشف | `reference` | `reference_spec_id` + `reference_source = legacy_master` |

`buildFamilyParticipationRow` يرفض أي مرجع على أصل غير مرجعي (اختبار سلبي).

## WORKSPACE CONVERGENCE

مساحة عمل واحدة فقط (`WorkspacePage`). المشاركات المملوكة للأسرة تُحلّ عبر
`src/features/space/spec-resolution.ts::resolveSpaceSpec` الذي يقرأ `familySpec` من المسودة،
والمشاركات المرجعية تُحلّ من المكتبة كما كانت. لا `EasyBeginningWorkspace` ولا `FamilyFreeWorkspace`.
`PreviewPage` و`CardsPage` و`AllCardsPage` و`SpaceHomePage` كلها تستعمل نفس المحلّل.

## REFERENCE / FAMILY WORDING

- مرجعي (legacy_master): `sourceText` + `familyText` كما كان.
- بداية سهلة من مرشح إطاري: نص المصدر = صياغة المرشح الثابتة (`provenance = framework_reference`).
- بداية سهلة/أخطط بنفسي بكتابة الأسرة: `provenance = family`، لا نص مصدر مختلَق؛ واجهة المسودة
  تُخفي «العبارة المقترحة» وزر الاسترجاع (`StepComposer.showSourceText`).

## VALIDITY ENFORCEMENT

كل مرشح في `easy-beginning-corpus` يُسجَّل فقط بعد `evaluateFunctionalParticipation(...).valid`.
كل تعريف أسري يُمرَّر على العقد نفسه قبل إنشاء الصف (`createFamilyAuthoredParticipation` يرمي عند السقوط).
لا كتلة تنفيذ منفردة ولا عبارة حدث تصبح مشاركة وظيفية.

## NEGATIVE TESTS

| اختبار | نتيجة |
|---|---|
| A سؤال جاهزية | ABSENT |
| B سؤال استقلالية | ABSENT |
| C تصنيف الشخص | ABSENT |
| D فرض simple | NO |
| E اختلاق معرّف مكتبة لمشاركة أسرية | ABSENT (اختبار يرمي) |
| F الحدث كمشاركة وظيفية | BLOCKED |
| G ترقية كتلة تنفيذ بلا صلاحية | BLOCKED |
| H ربط محطة يعني إنجازاً | ABSENT |
| I نفس مساحة العمل للأصول الثلاثة | PASS |

## END-TO-END ENTRY TESTS

الوحدات والتحليل الساكن: 38/38 اختبار ناجح، typecheck نظيف، والمسارات الأربعة تستجيب 200
(`/`, `/space/easy`, `/space/plan`, `/space/explore`) و`/help-me-choose` = 307 إلى `/space/easy`.

J1..J4 و«الدخان» لمرحلة ما بعد الاعتماد لم تُنفَّذ بجلسة مستخدم حقيقية في هذه البيئة:
`LOVABLE_BROWSER_AUTH_STATUS = signed_out`، فلا جلسة يمكن حقنها للوصول إلى المسارات المحمية.
هذه البنود تبقى UNVERIFIED (لا FAIL): تحتاج تسجيل دخول من المعاينة ثم إعادة التشغيل.

## REMAINING GAPS

- J1..J4 والدخان النهائي بانتظار جلسة مستخدم.
- WS-02 و WS-08 وتطبيع تصنيف الدعم وترحيل المحتوى القديم: خارج نطاق هذه المهمة.
- عدسة المحطة تستعمل المحطات الافتراضية الوصفية؛ ربط محطات الأسرة المخزّنة يبقى تحسيناً لاحقاً.

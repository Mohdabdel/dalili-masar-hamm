# DALILI-PARTICIPATION-HOME-UX-02 — ملحق UX لمستويات المشاركة

ملحق لوثيقة `DALILI_PARTICIPATION_LEVELS_V1.md` (لا يلغيها).

## 1. التسميات
- تبويب الشريط السفلي: «دليلي للمشاركة الحياتية» (بدل «المشاركة»).
- عنوان `/activities`: «دليلي للمشاركة الحياتية».
- العنوان الفرعي: «خطوات بسيطة مستمرة تحقق مشاركة مستدامة» (بدل «اختر نقطة البداية المناسبة لكم اليوم»).

## 2. مسار المستخدم الجديد
`/activities` (تعريف وبدء فقط) → «ابدأ الآن» → `/activities/level` → `/activities/options?level=` → `/activities/browse?level=&view=domains|today|all`.

طرق التصفح لم تعد تظهر في `/activities` إطلاقاً؛ تظهر فقط بعد اختيار المستوى وبالتسميات:
- «مشاركات حسب المجال»
- «مشاركات حسب الأحداث اليومية»
- «مشاركات عامة»

## 3. محتوى `/activities`
ثلاثة تبويبات معلوماتية غير إلزامية:
1. «ما هو دليلي» — نص الفلسفة الحالي + «لماذا تستخدم دليلي للمشاركة الحياتية؟» + «قاعدة الـ15 دقيقة».
2. «دليل الاستخدام» — مدخل إلى `/participation-guide?tab=guide`.
3. «اعتبارات الاستخدام» — مدخل إلى `/participation-guide?tab=considerations`.

زر «ابدأ الآن» يبقى ظاهراً أسفل المداخل دون أي شرط مسبق.

قرار حذف صريح: عبارة «ابدأوا بـ15 دقيقة، ثم ابنوا عليها.» وما يتبعها من فقرة عن الاستقلال محذوفة نهائياً ولا يُعاد إدراجها.

## 4. `/participation-guide`
- يدعم `?tab=guide` و`?tab=considerations` مع fallback إلى `guide`.
- محتواه الحالي محفوظ؛ حُدِّثت مسميات طرق التصفح داخل قسم «كيف تستخدم الدليل؟» لتطابق التسميات المعتمدة.
- مستويات المشاركة التشغيلية حصراً: بسيط / متوسط / متقدم، وهي وصف للفرصة لا للشخص. درجات الدعم داخل البطاقة تبقى مستقلة ولا تُسمّى مستويات مشاركة.

## 5. بيانات وفلترة
لا تغيير في `src/data/knowledge/*` ولا في منطق `filterDomainsByLevel` أو التصنيف (1413 فرصة).

## 6. الملفات المعدلة
- `src/components/BottomNav.tsx`
- `src/routes/activities.index.tsx`
- `src/routes/activities.options.tsx`
- `src/routes/activities.browse.tsx`
- `src/routes/participation-guide.tsx`
- `docs/execution/DALILI_PARTICIPATION_HOME_UX_02.md` (هذا الملف)

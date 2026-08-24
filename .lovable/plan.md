# نموذج «دليلي Lab» التفاعلي داخل المشروع

مساحة تجريبية كاملة تحت `/lab/*` لاختبار تصور UX جديد جنباً إلى جنب مع النسخة الحالية، دون أي مساس بالمسارات الإنتاجية أو قاعدة البيانات.

## 1. بنية /lab المقترحة

```text
src/routes/
  lab.tsx                  ← تخطيط Lab (Outlet + شريط Lab + State Switcher)
  lab.index.tsx            ← لوحة الدخول: قائمة التدفقات + شرح النموذج
  lab.home.tsx             ← تصور جديد للصفحة الرئيسية
  lab.today.tsx            ← «ماذا يحدث اليوم؟» / الروتين اليومي
  lab.choose.tsx           ← ويزارد اختيار المشاركة (وقت → حدث → مستوى → نتائج)
  lab.card.$id.tsx         ← بطاقة الداعم بتصميم جديد
  lab.learner.$id.tsx      ← نسخة المشارك (شاشة/خطوة)
  lab.active.tsx           ← المشاركات النشطة ومتابعة اليوم
  lab.support.tsx          ← بوابة الدعم والخدمات (تصور جديد)
src/lab/
  data/            ← نموذج البيانات الوهمي + محمّل CSV للقراءة فقط
  state/           ← LabStateProvider + سيناريوهات + sessionStorage
  components/      ← نسخ Lab من المكونات
  theme/           ← طبقة تصميم Lab فوق التوكنز الحالية
```

كل ما يخص النموذج داخل `src/lab/` و`src/routes/lab*.tsx` فقط — لا ملف واحد خارجها.

## 2. مكونات حالية سنعيد استخدامها (قراءة فقط، بلا تعديل)

- عناصر shadcn في `src/components/ui/*` (Accordion, Tabs, Sheet, Button, Card…).
- `src/styles.css` والتوكنز اللونية وخطوط Cairo/Tajawal وهوية RTL.
- طبقات القراءة: `knowledge-base.ts`, `home-hierarchy.ts` (الأنواع), `daily-events.ts`, `participation-considerations.ts`, `service-directories.ts`, `visual-asset-catalog.ts`, `visual-support-map.ts`.
- ملفات CSV في `src/data/knowledge` و`src/data/support-directories` و`src/data/execution` — استيراد `?raw` للقراءة فقط.
- الأصول البصرية في `public/assets/execution/visual/`.

## 3. مكونات ستُنشأ لها نسخ Lab

| الإنتاجي | نسخة Lab |
| --- | --- |
| `PageShell` | `LabShell` — رأس مختلف، شريط Lab، بدون BottomNav الإنتاجي |
| `BottomNav` | `LabNav` — تنقل خاص بتدفقات النموذج |
| `ParticipationCard` | `LabParticipationCard` — إعادة ترتيب الأقسام والتفاعلات |
| `TodayEvents` / `HomeHierarchy` | `LabTodayBoard` / `LabBrowse` |
| بطاقة المتعلم | `LabLearnerView` |
| `ServiceDirectory` / `ResourceDirectory` | `LabDirectory` |

المكونات الإنتاجية تبقى كما هي حرفياً.

## 4. نموذج البيانات الوهمي

- `src/lab/data/fixtures.ts`: أسرة تجريبية، مشارك واحد، 3 محطات روتين (صباح/ظهر/مساء)، ~8 مشاركات نشطة، سجل إنجاز 7 أيام، عناصر أدوات بصرية.
- المحتوى الحقيقي (الأحداث/الفرص/البطاقات) يُقرأ من CSV الحالي عبر غلاف `lab/data/knowledge-read.ts` (قراءة فقط) لواقعية أعلى.
- كل الكتابة (إكمال مهمة، إضافة مشاركة، بناء روتين) تعدل حالة في الذاكرة فقط.

## 5. آلية State/Scenario Switcher

شريط علوي ثابت داخل `/lab` (قابل للطي) يبدل فوراً:
- **السيناريو:** أسرة جديدة (فارغ) · أسرة نشطة · يوم مزدحم · مشارك متقدم · حالة سلامة/إيقاف.
- **الحالة:** غير مسجّل دخول · مسجّل · تحميل · خطأ · لا توجد بيانات.
- **الوقت:** صباح / بعد الظهر / مساء (يؤثر على «اليوم»).
- أزرار: إعادة ضبط النموذج، نسخ رابط السيناريو (`?scenario=...&state=...`).

التنفيذ: `LabStateProvider` (React Context + reducer) + حفظ في `sessionStorage` تحت مفتاح `dalili-lab-v1`، ومزامنة مع search params للمشاركة.

## 6. ضمان عدم وصول /lab إلى Supabase

- لا استيراد لـ `@/integrations/supabase/*` ولا لـ `family-routine.ts` / `active-participations.ts` داخل أي ملف Lab.
- كل الوصول للبيانات يمر عبر `src/lab/data/*` فقط (واجهة واحدة).
- قاعدة ESLint `no-restricted-imports` مقيّدة بمسارات `src/lab/**` و`src/routes/lab*` تمنع هذه الاستيرادات وتفشل الفحص عند المخالفة.
- `/lab` خارج `_authenticated`، فلا middleware ولا جلسة ولا server functions.

## 7. عزل الأثر عن الإنتاج

- لا رابط لـ `/lab` من `BottomNav` أو الصفحة الرئيسية أو أي مسار إنتاجي.
- المدخل: `/lab` مباشرة عبر الرابط (يُعرض في الرد بعد التنفيذ) — صفحة دخول توضح أنها بيئة تجربة.
- `robots: noindex` في `head()` لكل مسارات Lab.
- التقسيم التلقائي للكود في TanStack Router يعني أن حزمة Lab لا تُحمَّل إلا عند زيارة `/lab`؛ لا استيراد من كود الإنتاج إلى `src/lab/`.
- لا تعديل على `__root.tsx` أو `start.ts` أو أي إعداد عام.

## 8. خطة الإزالة (Rollback)

الإزالة الكاملة = حذف ثلاثة أشياء فقط:
1. `src/routes/lab*.tsx`
2. مجلد `src/lab/`
3. قاعدة `no-restricted-imports` المضافة في `eslint.config.js`

لا يوجد أي أثر آخر: لا migrations، لا تعديل مكونات، لا تغيير تنقل. سيتم توثيق ذلك في `docs/execution/DALILI_LAB_PROTOTYPE_V1.md`.

## 9. خطة التنفيذ على Sprints

- **Sprint 0:** الهيكل — `lab.tsx`, `LabShell`, `LabStateProvider`, Switcher, صفحة `/lab`.
- **Sprint 1:** الرئيسية الجديدة + «اليوم» + الروتين.
- **Sprint 2:** ويزارد الاختيار + التصفح + المستويات.
- **Sprint 3:** بطاقة الداعم/المشارك الجديدة + الوسائل البصرية.
- **Sprint 4:** المشاركات النشطة والمتابعة + بوابة الدعم.
- **Sprint 5:** ربط التدفقات End-to-End + مراجعة حالات الفراغ/الخطأ + تقرير مقارنة.

## ملاحظات تقنية

- المسارات تتبع اصطلاح TanStack (`lab.card.$id.tsx` → `/lab/card/$id`).
- الحفاظ على RTL والعربية والتوكنز الدلالية؛ أي لون/تباعد جديد يُعرَّف كطبقة Lab محلية لا كتعديل على `styles.css` (إن لزم إضافة توكن، أطلب موافقتك أولاً).
- لا تعديل خارج `/lab` بدون موافقة صريحة منك.

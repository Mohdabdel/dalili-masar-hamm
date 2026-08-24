# دليلي Lab — نموذج تفاعلي كامل للتصور المستقبلي

بيئة تجريبية معزولة تحت `/lab/*` تختبر تصور دليلي القادم End-to-End: البداية من روتين الأسرة، تفكيك الحدث، مساحة عمل الأسرة، بطاقة المشارك، الدعم البصري، التكرار ودورة حياة المشاركة — مع إعادة استخدام محتوى ومكونات دليلي الحالية قراءةً فقط.

## قواعد العزل (ثابتة)

كل الملفات تحت `src/routes/lab*.tsx` و`src/lab/**` فقط · لا تعديل أو حذف لأي مسار إنتاجي · لا Supabase/RLS/Storage/Auth/migrations · الحالة في الذاكرة + `sessionStorage` · قراءة CSV والأصول والمكونات فقط · Lab variants بدل تعديل المكونات المشتركة · لا ظهور في التنقل الإنتاجي · `noindex` · الاستثناء الوحيد خارج Lab هو `eslint.config.js` لقاعدة `no-restricted-imports` تمنع استيراد `@/integrations/supabase/*` و`family-routine` و`active-participations` داخل Lab. أي تعديل آخر خارج `/lab` = توقف وطلب موافقة.

## 1. Lab Route Map

```text
/lab                         lab.index.tsx            لوحة الدخول والتدفقات
/lab/start                   lab.start.tsx            «ابدأ من روتينكم»
/lab/context                 lab.context.tsx          روتين منزلي | مجتمعي
/lab/mode                    lab.mode.tsx             محطة واحدة | ابنِ روتيناً
/lab/stations                lab.stations.tsx         اختيار محطة (الإفطار…)
/lab/station/$stationId      lab.station.$stationId.tsx   قبل / أثناء / بعد
/lab/component/$componentId  lab.component.$componentId.tsx  مكوّن الحدث
/lab/level/$componentId      lab.level.$componentId.tsx   مستوى المشاركة
/lab/matches                 lab.matches.tsx          فرص المشاركة المناسبة
/lab/assist                  lab.assist.tsx           ساعدني أختار (سياقي)
/lab/routine                 lab.routine.tsx          Routine Builder
/lab/routine/preview         lab.routine.preview.tsx  معاينة الروتين
/lab/workspace/$participationId  lab.workspace.$participationId.tsx  مساحة عمل الأسرة
/lab/support/$participationId    lab.support.$participationId.tsx    + دعم إضافي
/lab/preview/$cardId         lab.preview.$cardId.tsx  معاينة واعتماد البطاقة
/lab/card/$cardId            lab.card.$cardId.tsx     Learner Card
/lab/run/$cardId             lab.run.$cardId.tsx      Execution Mode (Full screen)
/lab/feedback/$cardId        lab.feedback.$cardId.tsx كيف كانت المشاركة اليوم؟
/lab/lifecycle/$participationId  lab.lifecycle.$participationId.tsx  بعد التكرار
/lab/participations          lab.participations.tsx   مشاركات نكررها الآن
/lab/visual                  lab.visual.tsx           طبقة الروتين البصرية
/lab/visual/$toolId          lab.visual.$toolId.tsx   أداة بصرية مفردة/للطباعة
/lab/community               lab.community.tsx        المشاركة المجتمعية
/lab/community-support       lab.community-support.tsx  خدمات ومرافق (مسار مساند)
/lab/family-resources        lab.family-resources.tsx مصادر ومساندة للأسرة
/lab/weaving                 lab.weaving.tsx          شيء يحبه أو يفعله بالفعل
/lab/ai                      lab.ai.tsx               مختبر الاقتراحات (محاكاة)
/lab/states                  lab.states.tsx           عرض حالات Empty/Loading/Error
lab.tsx                      تخطيط Lab: Outlet + LabShell + Scenario Switcher
```

## 2. Screen Inventory

لكل شاشة: الغرض · الدخول · الإجراء الأساسي · الخروج · الحالة المكتوبة · أصول دليلي المعاد استخدامها · مكونات Lab الجديدة.

| # | الشاشة | الغرض | الدخول | الإجراء | الخروج | State Written | إعادة استخدام | مكونات Lab |
|---|---|---|---|---|---|---|---|---|
| 1 | `/lab` | مدخل النموذج وشرحه | رابط مباشر | اختيار تدفق | `/lab/start` | `session.entered` | التوكنز، shadcn | `LabHome`, `LabFlowCard` |
| 2 | `/lab/start` | «ابدأ من روتينكم» | `/lab` | ابدأ | `/lab/context` | — | `PageShell` نمطاً | `LabStartHero` |
| 3 | `/lab/context` | منزلي / مجتمعي | start | اختيار السياق | `/lab/mode` | `context` | `knowledge-base` (category) | `LabContextChoice` |
| 4 | `/lab/mode` | محطة واحدة / بناء روتين | context | اختيار المسار | `/lab/stations` أو `/lab/routine` | `mode` | — | `LabModeChoice` |
| 5 | `/lab/stations` | اختيار محطة من اليوم | mode | اختيار محطة | `/lab/station/$id` | `stationId` | `daily-events`, `02_events.csv` | `LabStationGrid` |
| 6 | `/lab/station/$id` | قبل / أثناء / بعد | stations | اختيار الطور | `/lab/component/$id` | `phase` | بيانات الحدث | `LabPhaseSplit` |
| 7 | `/lab/component/$id` | مكوّن الحدث (إعداد الطاولة…) | phase | اختيار المكوّن | `/lab/level/$id` | `componentId` | فرص `03_...csv` مجمّعة | `LabComponentList` |
| 8 | `/lab/level/$id` | مستوى المشاركة (بسيط/متوسط/متقدم) — يصف المشاركة لا الشخص | component | اختيار المستوى | `/lab/matches` | `level` | `participationLevelLabel/Description` | `LabLevelPicker` |
| 9 | `/lab/matches` | فرص مشاركة مناسبة للسياق | level | اختيار مشاركة | `/lab/workspace/$id` | `selectedParticipationId` | بطاقات `04_...csv` | `LabMatchList`, `LabMatchCard` |
| 10 | `/lab/assist` | ساعدني أختار سياقي: لا يعيد سؤال ما هو معروف، يرشّح 3–5 خيارات | زر من 7/8/9 أو الروتين | قبول ترشيح | `/lab/workspace/$id` | `assistTrace` | `knowledge-base`, considerations | `LabContextualAssist`, `LabWhyThis` |
| 11 | `/lab/routine` | بناء روتين: يومي/أيام محددة/أسبوعي/شهري/دوري، ترتيب سحب، أحداث بلا مشاركة مسموحة | mode | إضافة/ترتيب أحداث | `/lab/routine/preview` | `routine.events[]` | `daily-events`, `family-routine` كنموذج قراءة فقط | `LabRoutineBuilder`, `LabEventRow`, `LabCadencePicker` |
| 12 | `/lab/routine/preview` | معاينة الروتين وتحديد محطات المشاركة | routine | تحديد محطة مشاركة | `/lab/stations` أو `/lab/visual` | `routine.stations[]` | — | `LabRoutineTimeline` |
| 13 | `/lab/workspace/$id` | Family Participation Workspace: عرض المهمة وتسلسلها، «ما الأجزاء التي شارك فيها من قبل؟» (اختياري)، «أين تكون نهاية المشاركة هذه المرة؟» | matches/assist | ضبط الإعداد | `/lab/support/$id` أو `/lab/preview` | `setup.priorSteps[]`, `setup.stopPoint` | خطوات البطاقة، `HumanSafetyNotice`, `NoAssetNotice` كنماذج | `LabWorkspace`, `LabStepLadder`, `LabStopPointPicker` |
| 14 | `/lab/support/$id` | + دعم إضافي: جدول بصري، تسلسل، الآن/بعد ذلك، منظم/مؤقت، لوحة اختيارات، أخبره مسبقاً، Visual Builder — كلها اختيارية | workspace | إضافة أدوات | رجوع للـWorkspace | `setup.supports[]` | `visual-tools/*`, `visual-asset-catalog`, `visual-support-map`, أصول `public/assets/execution/visual` | `LabSupportPicker`, `LabToolPreview` |
| 15 | `/lab/preview/$cardId` | معاينة واعتماد بطاقة المشارك | workspace | اعتماد | `/lab/card/$cardId` | `card.status = approved` | `learner-card.ts` | `LabCardPreview` |
| 16 | `/lab/card/$cardId` | Learner Card #1: التاريخ، المشاركة، الخطوات المصورة المعتمدة والتسلسل | preview/participations | بدء التنفيذ | `/lab/run/$cardId` | `card.opened` | صور الخطوات، `learner.$id` كمرجع | `LabLearnerCard` |
| 17 | `/lab/run/$cardId` | Execution Mode: خطوة واحدة/شاشة، Full screen لجهاز منفصل، الدعم عند الطلب | card | إنهاء | `/lab/feedback/$cardId` | `run.completedSteps`, `run.count++` | `VisualFramePilot`, `ReminderCardPilot` كنماذج | `LabExecutionMode`, `LabSupportDrawer` |
| 18 | `/lab/feedback/$cardId` | «كيف كانت المشاركة اليوم؟» 🙂 مريحة / 😐 عادية / 🙁 صعبة اليوم — أسباب اختيارية عند 🙁 فقط، بلا درجات | run | تسجيل | `/lab/participations` أو `/lab/lifecycle` | `feedback[]` | — | `LabFeedbackSheet`, `LabReasonChips` |
| 19 | `/lab/lifecycle/$id` | بعد عدة مرات: نستمر كما هي / نغير شيئاً / نوسع المشاركة / نجعلها من روتيننا / نتوقف عنها الآن — بلا ترقية تلقائية | feedback أو participations | اختيار مسار | Workspace جديد أو participations | `lifecycle.state`, نسخة بطاقة جديدة عند التوسيع | — | `LabLifecycleChoices`, `LabCardVersions` |
| 20 | `/lab/participations` | «مشاركات نكررها الآن»: المشاركة، الحدث، عدد مرات الاستخدام، آخر استخدام، بدء التنفيذ + قسم «من مشاركاتنا المعتادة» | Lab nav | بدء / فتح دورة الحياة | `/lab/run` أو `/lab/lifecycle` | `lastOpened` | — | `LabParticipationsBoard`, `LabRepeatBadge` |
| 21 | `/lab/visual` | طبقة بصرية مولَّدة من بيانات الروتين نفسها: Visual Schedule، Now/Next، Tell Me Before، Visual Timer، Visual Sequence — بلا إعادة إدخال | routine/support | فتح أداة | `/lab/visual/$toolId` | — | `visual-tools/*`, أصول WebP | `LabVisualRoutineLayer` |
| 22 | `/lab/visual/$toolId` | أداة بصرية مفردة + نسخة للطباعة | visual | طباعة/عرض | رجوع | `tools[]` | `VisualToolPreview` كمرجع | `LabToolCanvas`, `LabPrintSheet` |
| 23 | `/lab/community` | المشاركة المجتمعية عبر نفس Participation Engine: تسوق، زيارة، مطعم، تنقل، متنزه، خدمات وفعاليات | context | نفس تدفق 5→9 | Workspace | نفس مفاتيح المسار | فرص community في CSV | إعادة استخدام مكونات 5–9 |
| 24 | `/lab/community-support` | مسار مساند منفصل: خدمات، مرافق، تسهيلات، نقل، مصادر — غير مدمج بالـEngine | Lab nav | تصفح/فلترة | — | — | `service-directories`, `support-directories/*.csv` | `LabDirectory` |
| 25 | `/lab/family-resources` | إعادة تموضع المحتوى التعليمي كـ«مصادر ومساندة للأسرة» بلا لغة تعليم/علاج | Lab nav | تصفح | — | — | بيانات `education-support` كما هي | `LabResourceShelf` |
| 26 | `/lab/weaving` | «شيء يحبه أو يفعله بالفعل» → سياقات حياتية حقيقية لهذا الفعل (ماء → سقي النباتات/غسل الخضار/تعبئة الزجاجات) بلا تحويله لتدريب أو إلزام | Lab nav / assist | إدخال اهتمام | `/lab/matches` مُصفّاة | `weaving.interests[]` | فهرس `search-index`, فرص CSV | `LabWeavingInput`, `LabWeavingResults` |
| 27 | `/lab/ai` | محاكاة اقتراحات: مساعدة سياقية، Weaving، اقتراح روتين، اقتراح دعم بصري، استخدام مشاركة في أحداث أخرى — بيانات وهمية بلا اتصال | Lab nav / نقاط سياقية | توليد اقتراح | الشاشة ذات الصلة | `suggestionsAccepted[]` | — | `LabSuggestionEngine` (mock), `LabSuggestionCard` |
| 28 | `/lab/states` | عرض Empty/Loading/Error لكل شاشة رئيسية | Switcher | تبديل حالة | أي شاشة | `uiState` | — | `LabStateGallery` |

## 3. التدفق End-to-End

```text
/lab/start → context (منزلي|مجتمعي) → mode
   ├─ محطة واحدة → stations → station(قبل|أثناء|بعد) → component → level → matches
   │        └─ [ساعدني أختار سياقي] ← يعرف السياق مسبقاً
   └─ ابنِ روتيناً → routine builder → preview → تحديد محطة مشاركة → stations…

matches → Family Workspace (خطوات + مشاركة سابقة اختيارية + نقطة نهاية هذه المرة)
        → + دعم إضافي (اختياري) → معاينة → اعتماد
        → Learner Card #1 → Execution Mode → «كيف كانت المشاركة اليوم؟»
        → participations (عدد المرات وآخر استخدام)
        → بعد التكرار: نستمر | نغير | نوسع (نسخة جديدة + حفظ السابقة) | من روتيننا | نتوقف الآن
Routine ⇄ Visual Routine Layer (جدول/الآن وبعد/أخبره مسبقاً/مؤقت/تسلسل)
Community Participation = نفس المسار بسياق مجتمعي · Community Support مسار مساند مستقل
```

دورة الحياة: `Draft → Active → Repeated → Continue / Adjust / Expand / Routine / Archive` — بلا Mastered/Failed وبلا ترقية تلقائية.

## 4. Data/State Model (وهمي بالكامل)

```ts
LabState {
  scenario, uiState: 'ready'|'empty'|'loading'|'error', timeOfDay,
  context: 'home'|'community', mode: 'single'|'routine',
  path: { stationId, phase, componentId, level },
  routine: { cadence, events: [{ id, label, order, isParticipationStation }] },
  participations: [{ id, opportunityId, eventId, status, timesShared, lastSharedAt, stableInRoutine }],
  setups: { [participationId]: { priorSteps[], stopPointStepId, supports[] } },
  cards: [{ id, participationId, version, date, steps[], approvedAt }],
  runs: [{ cardId, date, completedSteps[] }],
  feedback: [{ cardId, date, tone: 'easy'|'usual'|'hard', reasons[] }],
  weaving: { interests[], matches[] },
  suggestions: []
}
```

- المحتوى الحقيقي (المجالات/الأحداث/الفرص/البطاقات/الأدلة/المصادر) يُقرأ من CSV الحالي عبر `src/lab/data/knowledge-read.ts` (قراءة فقط).
- كل الكتابة في `LabStateProvider` (reducer) + `sessionStorage:dalili-lab-v1`.
- لا حقول Score/Mastery/Ability في أي مكان من النموذج.

## 5. Scenario Switcher

شريط علوي قابل للطي داخل `/lab` يبدل فوراً: أسرة جديدة · روتين قائم · مشاركة لأول مرة · مشاركة متكررة · مشاركة كانت صعبة اليوم · مشاركة مستقرة في الروتين · يوم مزدحم · اهتمام/فعل موجود (Weaving) · Empty · Loading · Error. إضافة: وقت اليوم، إعادة الضبط، نسخ رابط السيناريو (`?scenario=&state=`).

## 6. المكونات والبيانات المعاد استخدامها (Read-only)

`src/components/ui/*` · `src/styles.css` والتوكنز وخطوط Cairo/Tajawal · `knowledge-base.ts`, `home-hierarchy.ts` (أنواع), `daily-events.ts`, `learner-card.ts`, `participation-considerations.ts`, `service-directories.ts`, `search-index.ts`, `execution-frames.ts`, `execution-support.ts`, `visual-support-map.ts`, `visual-asset-catalog.ts`, `visual-tools/*` · كل CSV في `data/knowledge`, `data/support-directories`, `data/execution` · أصول `public/assets/execution/*` · أنماط `ParticipationCard`, `VisualFramePilot`, `ReminderCardPilot`, `HumanSafetyNotice`, `NoAssetNotice` كمرجع بصري فقط.

## 7. المكونات الجديدة داخل Lab

بنية: `LabShell`, `LabNav`, `LabScenarioSwitcher`, `LabStateProvider`, `LabStateBoundary` (Empty/Loading/Error).
تدفق: `LabStartHero`, `LabContextChoice`, `LabModeChoice`, `LabStationGrid`, `LabPhaseSplit`, `LabComponentList`, `LabLevelPicker`, `LabMatchList/Card`, `LabContextualAssist`, `LabWhyThis`.
روتين: `LabRoutineBuilder`, `LabEventRow`, `LabCadencePicker`, `LabRoutineTimeline`.
مساحة الأسرة والتنفيذ: `LabWorkspace`, `LabStepLadder`, `LabStopPointPicker`, `LabSupportPicker`, `LabToolPreview`, `LabCardPreview`, `LabLearnerCard`, `LabExecutionMode`, `LabSupportDrawer`.
التكرار: `LabFeedbackSheet`, `LabReasonChips`, `LabLifecycleChoices`, `LabCardVersions`, `LabParticipationsBoard`, `LabRepeatBadge`.
بصري ومصادر: `LabVisualRoutineLayer`, `LabToolCanvas`, `LabPrintSheet`, `LabDirectory`, `LabResourceShelf`.
تجريبي: `LabWeavingInput`, `LabWeavingResults`, `LabSuggestionEngine` (mock), `LabSuggestionCard`.

## 8. خطة الـSprints

| Sprint | المخرجات |
|---|---|
| 0 | `lab.tsx`, `LabShell`, `LabStateProvider`, Scenario Switcher، `/lab`، `/lab/states`، قاعدة ESLint، طبقة القراءة من CSV |
| 1 | «ابدأ من روتينكم» + `/lab/context` + `/lab/mode` |
| 2 | منزلي/مجتمعي + اختيار محطة واحدة أو بناء روتين (`/lab/stations`) |
| 3 | Routine Builder + المعاينة والترتيب والدوريات ومحطات المشاركة |
| 4 | تفكيك الحدث: قبل/أثناء/بعد → المكوّن → المستوى → المشاركات |
| 5 | Contextual Help Me Choose + «لماذا هذه المشاركة» |
| 6 | Family Participation Workspace (الخطوات، المشاركة السابقة، نقطة النهاية) |
| 7 | معاينة واعتماد + Learner Card + Execution Mode Full screen |
| 8 | تكامل الدعم البصري من «+ دعم إضافي» ونسخة الطباعة |
| 9 | Feedback (3 حالات + أسباب اختيارية عند 🙁) |
| 10 | التكرار ودورة الحياة والنسخ عند التوسيع |
| 11 | «مشاركات نكررها الآن» + «من مشاركاتنا المعتادة» |
| 12 | Visual Routine Layer المولَّد من الروتين |
| 13 | المشاركة المجتمعية + Community Support كمسار مساند |
| 14 | Participation Weaving |
| 15 | Experimental AI (محاكاة الاقتراحات) |
| 16 | إمكانية الوصول WCAG 2.2 AA، الحالات الحدية، اختبار End-to-End وتقرير مقارنة |

## 9. اللغة وإمكانية الوصول

- معجم مسموح: مشاركة، حدث، دور، اختيار، فرصة، ما يساعد، نجعلها أسهل، نكررها، نستمر، مشاركة أوسع، مكان داخل اليوم. ممنوع: تعليم، تدريب، إتقان، نجاح/فشل، قدرة/عدم قدرة، Mastery، Passed/Failed، درجات.
- فحص نصي آلي داخل Lab يمنع تسرب المصطلحات الممنوعة.
- عربية وRTL أساساً · تنقل بلوحة المفاتيح وحالات تركيز واضحة · دلالات قارئ الشاشة · تباين AA · مساحات لمس ≥44px · نص قابل للتكبير · تقليل الحمل المعرفي (قرار واحد لكل شاشة).

## 10. الإزالة الكاملة

حذف `src/routes/lab*.tsx` + مجلد `src/lab/` + قاعدة `no-restricted-imports` = إزالة كاملة بلا أثر. التوثيق في `docs/execution/DALILI_LAB_PROTOTYPE_V1.md` (داخل نطاق Lab، وسأطلب موافقتك قبل إنشائه إن اعتبرته خارج النطاق).

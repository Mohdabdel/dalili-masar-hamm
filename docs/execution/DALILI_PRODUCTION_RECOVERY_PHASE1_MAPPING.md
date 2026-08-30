# DALILI PRODUCTION RECOVERY — PHASE 1 / DISCOVERY + MAPPING

مخرج إلزامي قبل أي Migration (البند 25). لا تعديل كود حتى الاعتماد.

## 1) Current production schema (Supabase الحالي)

| جدول | الحقول الجوهرية | الملاحظات |
|---|---|---|
| `family_routines` | user_id, name, description, is_active | Board واحد نشِط لكل أسرة عملياً |
| `routine_stations` | routine_id, daily_event_id (text), domain_id, label, part_of_day, position, status, completed_at | المحطة اليوم = حدث واحد، وفيها `status/completed_at` (منطق إنجاز) |
| `active_participations` | opportunity_id (text), daily_event_id, routine_station_id, source, status, completion_source, started_at/completed_at/closed_at | تربط فرصة بمحطة 1:1، ولا تحمل أي تهيئة أسرية |
| `participation_daily_logs` | active_participation_id, log_date, did_participate | نموذج «إنجاز يومي» — لا يطابق مفهوم Run |
| `learner_card_customizations` | opportunity_id, title_override, intro_note, settings jsonb | أقرب شيء لـ Selection/Spec لكن بلا خطوات مرتّبة |
| `learner_card_steps` | customization_id, position, text, visual_asset_id, canonical_asset_code, is_hidden | قابل لأن يصبح «الخطوات المهيّأة» |
| `learner_card_exports` | format, storage_path, expires_at | تصدير فقط — ليس Snapshot |
| `visual_assets`, `resource_attachments` | تخزين خاص + روابط | صالح كما هو لـ SupportAsset |

كل الجداول RLS = مالك فقط (`user_id = auth.uid()`), وGRANTs للـ authenticated/service_role.

## 2) Lab v2 entity model (`src/lab/slice/*`)

- `LabParticipationSpec` — فرصة/مشاركة بمستوى وسياق وخطوات رئيسية/فرعية (من CSV/fixtures، محتوى مرجعي).
- `LabThisTimeSelection` — تهيئة الأسرة: `selected[]` بترتيب، `chosenExecutionOptionByStepId`, `familyTextByStepId`, `visualByStepId`, `presentationByStepId`, `blockOrderByStepId`, `supportTools`, `drafted`.
- `LabCardSnapshot` — نسخة مجمّدة: `version`, `frames[]` (نص + أصل بصري + presentation + blockOrder), `supportTools`, بيانات مرجعية للحدث.
- `runs[]` — `{ snapshotId, date }` بلا نتائج.
- `SliceFeedback` — `tone` + `reasons` اختياري.
- `lifecycleBySpec` + `closedCards` — دورة الحياة.
- `stations[] / removedStations[]` — محطات الأسرة (معرّفات أحداث).
- `LabSupportAsset` — مخرج دعم مستقل.
كل ذلك في `sessionStorage: dalili-lab-slice-v1`.

## 3) Mapping table

| Lab v2 | Production entity | جدول مقترح | Lifecycle | Ownership | RLS |
|---|---|---|---|---|---|
| Spec (CSV) | Participation Opportunity | لا جدول (CSV يبقى مرجع المعرفة) | ثابت | النظام | — |
| Selection | FamilyParticipation config | توسيع `learner_card_customizations` (+`family_participation_id`) | draft→approved→archived | الأسرة | user_id=auth.uid() |
| selected/order/text/visual/presentation | Configured steps | توسيع `learner_card_steps` (+`presentation`, `block_order`, `execution_option_label`, `family_text`) | يتبع الـ config | الأسرة | نفس القاعدة |
| — | FamilyParticipation (الهوية الموحّدة) | توسيع `active_participations` (تصبح هي FamilyParticipation) | active/closed/reopened | الأسرة | موجود |
| Station link | FamilyRoutineStation ↔ Participation | جدول رابط جديد `routine_station_participations` (N:M) | يضاف/يُنقل/يُزال | الأسرة | user_id=auth.uid() |
| Snapshot | ParticipationSnapshot | جدول جديد `participation_snapshots` (+`snapshot_frames` أو jsonb مجمّد) | immutable + version | الأسرة | قراءة/إنشاء للمالك، بلا UPDATE |
| Run | ParticipationRun | جدول جديد `participation_runs` (snapshot_id, started_at, stopped_at_frame) | append-only | الأسرة | مالك |
| Feedback | Micro feedback | `participation_feedback` (run_id/snapshot_id, tone, reasons[]) | اختياري | الأسرة | مالك |
| SupportAsset | SupportAsset | `visual_assets` + `resource_attachments` (scope='participation') | كما هو | الأسرة | موجود |
| `participation_daily_logs` | — | يبقى كما هو (لا يُحذف)، ولا يُستخدم كنموذج Run | legacy | الأسرة | موجود |

## 4) Proposed target schema (غير مدمّر)

1. `active_participations`: إضافة `title_override`, `board_station_free` — لا حذف أعمدة، ويظل `routine_station_id` للتوافق مع البيانات القديمة بينما الربط الجديد عبر الجدول الرابط.
2. `routine_stations`: إضافة `station_key` (morning/getting-ready/…) و`is_default_source`؛ إبقاء `status/completed_at` بلا استخدام في الواجهة الجديدة (لا التزامات إنجاز).
3. جديد: `routine_station_participations(station_id, participation_id, position)` مع UNIQUE يمنع التكرار (AC12/AC16).
4. جديد: `participation_snapshots(participation_id, version, title, frames jsonb, support_tools text[], approved_at)` + UNIQUE(participation_id, version)، بلا سياسة UPDATE (AC04/AC07/AC08).
5. جديد: `participation_runs(snapshot_id, started_at, ended_at, stopped_at_index)` (AC05/AC06 — بلا أي حقل أداء).
6. جديد: `participation_feedback(run_id, tone, reasons text[])` — كله nullable/اختياري (AC19).
7. توسيع `learner_card_customizations/steps` بأعمدة العرض بدل إنشاء جداول موازية.

## 5) Migration sequence

M1 أعمدة إضافية (additive) → M2 الجدول الرابط + backfill من `active_participations.routine_station_id` → M3 snapshots/runs/feedback + GRANT + RLS → M4 Repository layer (`ParticipationRepository`) بلا تغيير UI → M5 توصيل Workspace/Learner على Repository خلف مسارات جديدة → M6 تبديل مسارات الإنتاج بعد Regression. كل خطوة قابلة للتراجع (DROP للأعمدة/الجداول المضافة فقط).

## 6) RLS impact

كل جدول جديد: GRANT للـ authenticated + service_role، سياسة مالك واحدة `user_id = auth.uid()`، و`participation_snapshots` بلا UPDATE/DELETE للحفاظ على التجميد. لا تغيير على السياسات القائمة.

## 7) Existing-data migration impact

لا حذف. `active_participations` الحالية تُنسخ روابطها إلى الجدول الرابط (backfill idempotent). المشاركات القديمة بلا snapshot تظل صالحة وتُعرض كـ«غير معتمدة بعد». `participation_daily_logs` تبقى للقراءة التاريخية فقط.

## 8) Components يُعاد استخدامها كما هي

`FamilyComposer`, `FrameEditor`, `WorkspaceSteps`, `SpaceDrawer`, `StepFrame`, `StepTree`, `lab-ui`, شاشة `lab.slice.learner.$snapshotId` (كمرجع تصميم كامل)، `daily-stations.ts`, `knowledge-base.ts`.

## 9) Components تحتاج adaptation

`src/lab/slice/state.tsx` (يستبدل sessionStorage بـ Repository)، `lab.slice.workspace.$specId.tsx`, `lab.slice.card.$specId.tsx`, `lab.slice.feedback.$snapshotId.tsx`, `lab.slice.index.tsx`, `_authenticated/my-routine.tsx` (تصبح «جدول محطات روتينكم اليومي»), `_authenticated/active-participations.tsx` (تتوحد مع «مشاركاتنا»).

## 10) Components قابلة للحذف لاحقاً (Phase 3)

Lab v1: `lab.workspace.*`, `lab.card.*`, `lab.run.*`, `lab.learner.*`, `lab.feedback.*`, `lab.print.*`, `src/lab/state/*` — تُعلَّم الآن `LEGACY_DO_NOT_EXTEND` فقط. وكذلك `/learner/$id` القديمة بعد اعتماد مسار الـSnapshot.

## 11) Route migration plan

- `/activities` Discovery: خياران فقط (روتين يومي / مشاركات عامة)؛ اختيار الروتين ينتقل مباشرة إلى محطات الروتين.
- `/routine/stations` (كتالوج المحطات، عام) مقابل `/_authenticated/my-routine` (جدول الأسرة).
- مسارات المنتج الجديدة: `/_authenticated/participations/$id/workspace`, `/_authenticated/participations/$id/card`, `/learner/s/$snapshotId`.
- مسارات `/lab/slice/**` تبقى عاملة أثناء الترحيل ثم تصبح واجهات تجريبية فوق نفس الـRepository.

## 12) المخاطر

- ازدواج الهوية بين `active_participations` و«FamilyParticipation» إن لم نفرض UNIQUE(user, opportunity, active).
- انزلاق مفاهيمي: `status/completed_at` و`daily_logs` قد تُعيد لغة الإنجاز — يجب إخفاؤها من الواجهة الجديدة.
- حجم الخطوات داخل jsonb المجمّد مقابل جدول frames (نوصي jsonb للتجميد الحقيقي).
- ضياع حالة Lab الحالية في sessionStorage عند التبديل (لا ترحيل — بيانات تجريبية).
- Prerender/SSR: كل قراءات الأسرة يجب أن تبقى تحت `_authenticated`.

## 13) القرارات المطلوبة قبل M1

1. تجميد الـframes كـ jsonb داخل `participation_snapshots` (موصى) أم جدول `snapshot_frames`؟
2. توسيع `active_participations` لتكون FamilyParticipation (موصى) أم جدول جديد `family_participations`؟
3. الإبقاء على `participation_daily_logs` للقراءة فقط (موصى) أم إيقافها نهائياً؟

# DALILI PRODUCTION CONTRACT MATRIX — 01

Read-only classification of the 82 frozen requirements against the CURRENT Production
implementation. No Production file was changed to produce this matrix.

- contract: `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
- contract sha-256: `693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc` (VERIFIED)
- requirements loaded: 82 / 82
- generated_at: 2026-09-04 (UTC)

Legend of allowed statuses: `ALIGNED`, `PARTIAL-DRIFT`, `MISSING`, `STRUCTURAL-CONFLICT`,
`DECISION-REQUIRED`. Each ID appears exactly once.

Columns: `ID | STATUS | PRODUCTION EVIDENCE (route/file/entity) | RUNTIME EFFECT | EXACT GAP |
IMPLEMENTATION IMPACT | DEPENDENCIES`.

---

## FP — Functional Participation

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| FP-01 | MISSING | `src/data/knowledge/03_participation_opportunities.csv` columns: `opportunity_id, event_id, opportunity_name_ar, display_order, future_participation_level, safety_mode, status, source_file, participation_level, role_scope, organization_demand, variation_demand, classification_reason, review_required`; no validation module anywhere (`src/lib/knowledge-base.ts` only parses) | An opportunity becomes usable purely by existing in the CSV | No gate concept, no gate storage, no gate evaluation, no rejection path | New authoring-time validation model + per-gate fields; Master corpus is immutable so gates cannot be back-filled in place | FP-02..FP-09, CX-01 |
| FP-02 | PARTIAL-DRIFT | `02_events.csv` → `03_participation_opportunities.csv` (`event_id` FK); rendered by `src/features/space/pages/LibraryPage.tsx` | Role is shown under an event title, which implies a situation | Life context is inherited from the event label only; no stated life-context field on the participation itself | Add explicit `life_context` to the participation identity | FP-01 |
| FP-03 | PARTIAL-DRIFT | `04_participation_cards.csv` column `why`, surfaced by `src/components/ParticipationCard.tsx` («لماذا نشارك») | Families read a reason text | The reason is authored as a learning/training objective in 39 card rows (`لتعلّم…`, `مهارة حياتية`), i.e. why the *person* benefits, not why the *situation* needs the role | Field re-semantics + content authoring; existing text conflicts with FP-12 | FP-01, FP-12 |
| FP-04 | MISSING | no column in `03_*` or `04_*` expressing an observable change in the event/environment | Nothing recorded | Contribution/observable effect is not representable | New field + authoring | FP-01 |
| FP-05 | MISSING | `startStepId`/`endStepId` live in `LabThisTimeSelection` (`src/lab/slice/types.ts`) — family composition, not role definition | Family picks where to stop for one card | Natural completion of the role is not stored on the participation | New field; must not be confused with composer start/end | FP-01, WS-03 |
| FP-06 | MISSING | no field or check; `specFromLibrary()` in `src/lab/data/space/catalog.ts` builds a spec from name + card steps only | Nothing recorded | Functional independence of the role is not represented | New authoring gate | FP-01 |
| FP-07 | STRUCTURAL-CONFLICT | `04_participation_cards.csv`: 631 of 1139 card rows contain `بشكل مستقل` / `بمفرده` / `دون مساعدة`; column `participation_levels` is an assistance ladder («مراقبة … المشاركة … تنفيذ … بشكل مستقل»); column `indicators` holds performance statements («القدرة على…», «تقليل زمن التردد») | Performance/assistance language is rendered to families in `ParticipationCard.tsx` | Master content itself violates performance neutrality, and Master is immutable by contract IM-01 | Cannot be fixed in place; needs a separate validated corpus + presentation boundary decision | FP-12, IM-01, IM-05, CX-09 |
| FP-08 | MISSING | no individual/shared field; `role_scope` is a complexity dimension, not a participation mode | Nothing recorded | Participation mode is not representable | New field on participation identity | FP-01, CX-08 |
| FP-09 | MISSING | `getAllOpportunities()` / `findOpportunityById()` in `src/lib/knowledge-base.ts` return every CSV row unconditionally | Every row is selectable | No rejection path exists | Validation layer before publication | FP-01 |
| FP-10 | PARTIAL-DRIFT | distinct records: `02_events.csv` (564) vs `03_participation_opportunities.csv` (1413); an event holds many opportunities | Event → participations navigation works (`/space/$eventId/participations`) | 50 opportunities carry a name byte-identical to their parent event name (e.g. `CLO-001-OP001` = «شراء ملابس جديدة للأسرة»), i.e. event-like rather than role-like | Content classification decision; no schema change | Semantic model audit |
| FP-11 | PARTIAL-DRIFT | Execution Blocks are derived at runtime from `04_participation_cards.csv#participation_steps` inside `specFromLibrary()`; they are not stored records | Composer lists blocks per participation | Blocks have no independent identity/record; for single-step cards the block text can equal the role text | Block promotion to first-class records | FP-10, WS-02 |
| FP-12 | STRUCTURAL-CONFLICT | `04_participation_cards.csv` columns `participation_levels` (guided/shared/independent ladder) and `indicators`; typed in `src/lib/home-hierarchy.ts` and rendered by `ParticipationCard.tsx` | Ability ladder + indicators are user-visible on every reference card | Learner-ability and training-objective fields are part of the reference model | Removing/holding them changes the reference content model; Master immutable | FP-07, IM-05 |

## CX — Complexity

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| CX-01 | MISSING | complexity is a stored CSV column (`participation_level`); no validity concept precedes it | Level exists regardless of role validity | Ordering requirement unenforceable because FP validity does not exist | Depends entirely on FP-01 | FP-01 |
| CX-02 | STRUCTURAL-CONFLICT | dimensions stored are exactly three: `role_scope`, `organization_demand`, `variation_demand`; rationale text says «تطابقت الأبعاد الثلاثة» | Level derived editorially from three dimensions | Contract requires exactly four (C1 Elements, C2 Coordination, C3 Variability, C4 Choice/Uncertainty); current C1 is absent and C3/C4 appear merged into `variation_demand` | Requires re-dimensioning 1413 immutable rows | IM-01, content migration |
| CX-03 | ALIGNED | values in `participation_level` are exactly `simple` (352), `moderate` (915), `advanced` (146); typed `SliceLevel` in `src/lab/slice/types.ts` | Level filter at `/space/$eventId/level` | — | — | — |
| CX-04 | ALIGNED | level read from CSV in `specFromLibrary()`; no code computes it | Level is display/filter only | — | — | — |
| CX-05 | ALIGNED | composer writes only `participation_drafts.selection`; `spec.level` never written (`production-store.tsx` case `selection`) | Editing blocks never changes level | — | — | — |
| CX-06 | ALIGNED | `family_support_assets` rows are independent; no level write | Support never changes level | — | — | — |
| CX-07 | ALIGNED | `participation_runs` inserts only; no level write | Runs never change level | — | — | — |
| CX-08 | MISSING | no participation-mode field exists (see FP-08) | Shared/individual is not modelled at all | Requirement cannot be satisfied or violated because the concept is absent | Depends on FP-08 | FP-08 |
| CX-09 | ALIGNED | `classification_reason` text is role-structural («حجم الدور… الترابط والتنظيم… الاختيار والتكيف»); no ability/age/diagnosis/assistance terms in that column | Shown as a rationale line | — | — | — |

## EN — Entry

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| EN-01 | MISSING | repository-wide search for «بداية سهلة», «أخطط المشاركة بنفسي», «استكشف المشاركات الممكنة» returns zero matches in `src/routes`, `src/features`, `src/components`; actual entries are `/activities/browse`, `/help-me-choose`, `/my-routine`, `/space/library` | Families see four unnamed discovery surfaces | The three named strategies do not exist | Entry re-architecture and naming | EB-01..EB-05, FA-03 |
| EN-02 | ALIGNED | event lens: `/space/library` + `/activities/browse` (`LibraryPage.tsx`); station lens: `/my-routine` + `defaultStations()` in `catalog.ts` | Both lenses reachable | — | — | — |
| EN-03 | STRUCTURAL-CONFLICT | `routine_stations` columns `part_of_day`, `status`, `completed_at` (`src/lib/family-routine.ts`, migration `20260821010855…`) | Stations carry schedule + completion state | Time/schedule/completion fields are present on the station entity | Schema change on live family data | LY-05, IM-05 |
| EN-04 | PARTIAL-DRIFT | every path converges on `specId = KB-<opportunity_id>` (`src/features/space/participation-link.ts`) and one `active_participations` row | Uniform shape across existing entries | Shape sameness is untested because only the reference-derived origin exists (see FA-03) | Blocked by family-free origin | FA-01, FA-03 |
| EN-05 | ALIGNED | one provider `ProductionSpaceProvider` (`src/features/space/production-store.tsx`) mounted once at `src/routes/_authenticated/space.tsx`; one reducer `sliceReducer` | No per-entry state model | — | — | — |
| EN-06 | ALIGNED | route order `/space/library → /space/$eventId/level → /space/$eventId/participations → /space/workspace/$specId → /space/preview/$specId → /space/card/$specId → /space/learner/$snapshotId → /space/feedback/$snapshotId` | Downstream order is fixed | — | — | — |

## EB — Easy Beginning

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| EB-01 | MISSING | `src/routes/help-me-choose.tsx` step 1 = part of day, step 2 = daily event, step 3 = participation level | Entry starts from clock time, not from something liked | No liked/enjoyed/requested/sought context anywhere in Production | New entry flow + preferred-context data ownership decision | EN-01, Ambiguity A |
| EB-02 | MISSING | no expansion of a liked context into its moments; `getSuggestedEvents(part)` expands a time-of-day into events | Nothing | Concept absent | New flow | EB-01 |
| EB-03 | MISSING | Easy Beginning does not exist; the nearest flow collects a `participation_level` choice which is role complexity, not person readiness | No readiness questionnaire exists today | Requirement has no implementation to satisfy | New flow must preserve this property | EB-01 |
| EB-04 | MISSING | no learner-level assignment anywhere in family state (`SliceState` in `src/features/space/store.tsx`) | Nothing assigned | Requirement has no implementation to satisfy | New flow must preserve this property | EB-01 |
| EB-05 | MISSING | level filter at `/space/$eventId/level` is an explicit family choice, unrelated to any entry orientation | Nothing forces Simple today | Requirement has no implementation to satisfy | New flow must preserve this property | EB-01 |

## FA — Family Participation

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| FA-01 | PARTIAL-DRIFT | `ensureParticipation()` inserts `source: "family_workspace"` (constant) into `active_participations` | Every record has the same origin value | Origin cannot distinguish easy-beginning / discovery-reference / family-free | Enumerate origin + write it at creation | EN-01, FA-03 |
| FA-02 | ALIGNED | reference corpus is bundled CSV read at runtime (`src/lib/knowledge-base.ts`, `catalog.ts`); no write path exists to it; `active_participations.opportunity_id` stores the link only | Reference never mutated | — | — | — |
| FA-03 | STRUCTURAL-CONFLICT | identity is `specId = KB-<opportunity_id>`; every downstream page resolves content via `getSpaceSpec(specId)` → `findOpportunityById()`; a spec that is not in the CSV renders «هذه المشاركة غير متاحة» (`CardsPage.tsx`, `WorkspacePage.tsx`) | Family-free participation is impossible without a fake KB id | Participation identity is welded to a reference Master row | Identity model change across drafts, snapshots, runs, links | FA-01, FA-04, EN-04 |
| FA-04 | PARTIAL-DRIFT | `active_participations` stores `opportunity_id`, `daily_event_id`, `routine_station_id`, `source`, `status`, `lifecycle_choice` only; title/level/context are re-derived at render from the catalog | Identity display depends on live reference data | Identity fields are not copied at creation (they are copied only later, into the snapshot) | Add identity copy at creation | FA-03 |
| FA-05 | ALIGNED | `participation_drafts`, `selection.considerationIds`, `family_support_assets`, `participation_snapshots` all key off the same participation | All four attachments exist | — | — | — |
| FA-06 | ALIGNED | `LearnerPage.tsx` renders `snap.frames` only; `considerationIds` are stored on the snapshot but never rendered to the learner | Considerations never reach the learner | — | — | — |

## WS — Workspace / Composition

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| WS-01 | ALIGNED | single `/space/workspace/$specId` → `WorkspacePage.tsx` for all entries | One workspace | — | — | — |
| WS-02 | PARTIAL-DRIFT | `StepComposer.tsx` supports select/deselect and order; `familyTextByStepId` supports rewording; no add-new-block affordance exists | Families can remove, reword, reorder — not add | Adding a block that has no reference step is impossible | Requires free-form block creation (related to FP-11) | FP-11, FA-03 |
| WS-03 | ALIGNED | `selection.startStepId` / `endStepId`; frozen into `snapshot.startStepId/endStepId` (`compose.ts`) | Start/end designated and persisted | — | — | — |
| WS-04 | ALIGNED | `selection.familyTextByStepId` stored in `participation_drafts`; `sourceTextFor()` remains the reference | Independent storage | — | — | — |
| WS-05 | ALIGNED | `composeDraft()` returns both `sourceText` and `familyText`; `FrameEditor` offers reset to reference wording | Reference restorable after edit | — | — | — |
| WS-06 | ALIGNED | `imageVisibleByStepId` and `textVisibleByStepId` are separate maps; `imageVisibleFor()`/`textVisibleFor()` in `compose.ts` | image-only / text-only / both all reachable | — | — | — |
| WS-07 | ALIGNED | `PreviewPage.tsx` card-name input, defaulting to `${spec.title_ar} — بطاقة N`; stored as `snapshot.title_ar` | Optional independent family title | — | — | — |
| WS-08 | PARTIAL-DRIFT | step images (`imageRefByStepId`, `family-visuals` bucket) are separate from support assets (`family_support_assets`) | The two are technically distinct | There is no single "participation image" concept — only per-block images | Concept addition | — |

## SU — Support

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| SU-01 | ALIGNED | `PreviewPage.tsx` approve path does not require any support asset; `supportAssets` may be empty | Approval works with zero support | — | — | — |
| SU-02 | DECISION-REQUIRED | Production declares two fixed sets: `SPACE_SUPPORT_ASSET_TYPES` = communication / time / schedule, and `SPACE_SUPPORT_TOOLS` = visual-schedule, now-next, timer, choice-board, tell-before, picture-list, builder | Families pick from closed lists | Sets are fixed but do not match the contract set (communication, visual sequence, timer, stop/break, contextual aid); `stop/break` and `contextual aid` have no equivalent, `tell-before` and `builder` have no contract equivalent | Reconciling requires deciding whether the contract set is closed and canonical (Ambiguity C) | Ambiguity C |
| SU-03 | ALIGNED | `family_support_assets` columns: `id, spec_id, type, label, items, config, snapshot_id, created_at` — no prompt/assistance/performance column; nothing records support *use* | No prompt level recorded | — | — | — |
| SU-04 | ALIGNED | `buildFrozenSnapshot()` writes `supportAssetsFrozen` (full copy) plus `supportAssetIds` | Support carried inside the approved version | — | — | — |

## SN — Snapshot / Versioning

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| SN-01 | ALIGNED | `PreviewPage.tsx` approve → `buildFrozenSnapshot({ spec, selection, rows, version })` from the live draft | Snapshot built from current draft | — | — | — |
| SN-02 | ALIGNED | `production-store.tsx` case `snapshot`: `nextVersion()` reads max `version_number` from DB and inserts `+1`, retrying on conflict; first is 1 | Sequential, append-only | — | — | — |
| SN-03 | ALIGNED | only `insert` is issued on `participation_snapshots`; no update/delete path in code, and no UPDATE/DELETE RLS policy exists | v1 unchanged after v2 | — | — | — |
| SN-04 | ALIGNED | row carries `id`, `version_number`, `family_participation_id`, `snapshot_data` (self-contained frames, support, level, context) | Full identity persisted | — | — | — |
| SN-05 | ALIGNED | migration `20260830142231…` defines only `participation_snapshots_select_own` and `participation_snapshots_insert_own`; `participation_runs.snapshot_id … ON DELETE RESTRICT` | Deletion impossible from the app | — | — | — |
| SN-06 | ALIGNED | editing always targets `participation_drafts`; `CardsPage.tsx` offers «بطاقة جديدة لجزء آخر» which re-enters the draft, never a snapshot | Approved object never edited | — | — | — |
| SN-07 | PARTIAL-DRIFT | `/space/card/$specId` lists every version with its own link (explicit selection), but `src/features/space/home-status.ts` exposes `latestVersion` and the home surface routes to it, and `PreviewPage.tsx` frames the newest as «البطاقة المعتمدة الحالية» | Some surfaces route implicitly to the newest version | Version selection is explicit in one surface and implicit in another | Make selection explicit everywhere, or declare a default rule | Ambiguity B |

## LC — Learner Card

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| LC-01 | PARTIAL-DRIFT | canonical: `/space/learner/$snapshotId` → `LearnerPage.tsx` reads `snap.frames` only. Competing: `/learner/$id` → `src/routes/learner.$id.tsx` + `src/lib/learner-card.ts` builds a learner view straight from `04_participation_cards.csv#participation_steps` with no snapshot and no approval | Two learner surfaces exist; the legacy one bypasses approval | A learner card can be produced without any approved snapshot | Retire or gate the legacy route | SN-01 |
| LC-02 | ALIGNED | `LearnerPage.tsx`: one frame at a time, index `i`, previous/next, terminal `__done__` frame «انتهينا» | Moment-of-use only | — | — | — |
| LC-03 | ALIGNED | frames contain no `classification_reason`/level rationale; `LabCardFrame` has no such field | Rationale never shown | — | — | — |
| LC-04 | ALIGNED | `LearnerPage.tsx` renders only `assetRef`, `text_short_ar`, `blockOrder`; provenance and considerations live on the snapshot but are not rendered | Management data excluded | — | — | — |
| LC-05 | ALIGNED | no ability/mastery/progress/score value is read on the learner route; `participation_levels`/`indicators` are never copied into `LabCardFrame` | Learner sees wording + image only | — | — | — |
| LC-06 | ALIGNED | learner route dispatches only `run.start` / `run.end`, which write `participation_runs` | Card cannot write to its snapshot | — | — | — |

## RN — Run

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| RN-01 | ALIGNED | `participation_runs(id, family_participation_id, snapshot_id, started_at, ended_at)`; no attempt/trial/score column | One occurrence per row | — | — | — |
| RN-02 | ALIGNED | `LearnerPage.tsx` mints `crypto.randomUUID()` per opening; `startedRuns` guard prevents duplicate inserts of the same id | Unique run identity | — | — | — |
| RN-03 | ALIGNED | `run.start` explicitly resolves the existing participation and never calls `ensureParticipation()`; comment and code path in `production-store.tsx` | Runs never create parents | — | — | — |
| RN-04 | ALIGNED | `run.end` updates only `ended_at` for that run id | Card and participation untouched | — | — | — |
| RN-05 | ALIGNED | `CardsPage.tsx` renders «شاركنا {n} مرة — آخر مرة: {date}» under a section explicitly stating «تكرار وسجل فقط — بلا إتقان ولا نسب ولا تقدّم» | Neutral count only, no streak/percentage/trend | — | — | — |

## FB — Feedback

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| FB-01 | ALIGNED | `/space/feedback/$snapshotId?runId=`; `FeedbackPage.tsx` submits only when a tone is chosen; `participation_feedback.run_id` FK | Optional, one run | — | — | — |
| FB-02 | ALIGNED | `SliceTone` = `comfortable` / `usual` / `difficult_today`; `reasons` is a free string array; no numeric or ordinal value stored | Non-evaluative options | — | — | — |
| FB-03 | ALIGNED | no aggregation query over `participation_feedback` exists in `src/`; feedback is read back only as a flat list | Never aggregated | — | — | — |
| FB-04 | ALIGNED | no mastery/progress/readiness/level derivation anywhere from feedback | Nothing inferred | — | — | — |

## LY — Lifecycle

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| LY-01 | ALIGNED | separate actions `card.close` (`participation_card_states`) and `participation.close` (`active_participations.status`) | Two independent operations | — | — | — |
| LY-02 | ALIGNED | `card.close` writes a boolean flag only; runs and parent untouched | Card archived, history preserved | — | — | — |
| LY-03 | ALIGNED | `participation.close` sets `status='closed'`, `closed_at`; `SpaceHomePage.tsx` moves it to the history view with its cards intact | Parent becomes history | — | — | — |
| LY-04 | ALIGNED | user-facing copy: «إغلاق البطاقة أو المشاركة لا يحذف شيئاً», «إغلاق بطاقة يخصّ هذه البطاقة فقط»; both operations are reversible (`card.reopen`, `participation.reopen`) | No failure framing | — | — | — |
| LY-05 | ALIGNED | closure paths issue `update` only; snapshots have no delete policy; runs are `ON DELETE RESTRICT` | No historical evidence deleted | — | — | — |

## IM — Immutability

| ID | STATUS | PRODUCTION EVIDENCE | RUNTIME EFFECT | EXACT GAP | IMPLEMENTATION IMPACT | DEPENDENCIES |
|----|--------|---------------------|----------------|-----------|-----------------------|--------------|
| IM-01 | ALIGNED | reference lives in bundled CSV under `src/data/knowledge/`, parsed read-only; no write API exists; baseline hashes recorded in `DALILI_PRE_GOLDEN_CONTENT_BASELINE_01.json` | Writes are not expressible | — | — | — |
| IM-02 | ALIGNED | family state lives entirely in Cloud tables (`active_participations`, `participation_drafts`, `participation_snapshots`, `participation_card_states`, `participation_runs`, `participation_feedback`, `family_support_assets`) | Fully separated storage | — | — | — |
| IM-03 | ALIGNED | `familyTextByStepId`, `imageRefByStepId`, `visualByStepId` all live in `participation_drafts.selection` | Reference untouched by customization | — | — | — |
| IM-04 | ALIGNED | `participation_snapshots` has SELECT + INSERT policies only (migration `20260830142231…`), so mutation is rejected at the database, not only in memory; reload rehydrates from the same rows | Immutable after persistence and restart | — | — | — |
| IM-05 | STRUCTURAL-CONFLICT | `routine_stations.status` + `.completed_at` (compliance/checklist state on live family data); reference model fields `participation_levels` (independence ladder) and `indicators` (performance) typed in `src/lib/home-hierarchy.ts` and rendered by `ParticipationCard.tsx` | Application state and reference model both carry prohibited fields | Prohibited fields exist in schema and in the immutable corpus | Schema change + corpus decision | EN-03, FP-07, FP-12 |

---

## MATRIX INTEGRITY GATE

| STATUS | COUNT |
|--------|------:|
| ALIGNED | 50 |
| PARTIAL-DRIFT | 11 |
| MISSING | 14 |
| STRUCTURAL-CONFLICT | 6 |
| DECISION-REQUIRED | 1 |
| **TOTAL** | **82** |

Per-prefix totals: FP 12, CX 9, EN 6, EB 5, FA 6, WS 8, SU 4, SN 7, LC 6, RN 5, FB 4, LY 5, IM 5 = 82.
Every canonical ID occurs exactly once. No duplicates, no missing IDs, no invented IDs.

MATRIX INTEGRITY: PASS

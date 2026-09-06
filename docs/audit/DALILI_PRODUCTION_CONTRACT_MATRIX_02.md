# DALILI PRODUCTION CONTRACT MATRIX — 02 (POST-FOUNDATION 01–08)

- contract: `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
- requirements loaded: **82 / 82** (FP 12, CX 9, EN 6, EB 5, FA 6, WS 8, SU 4, SN 7, LC 6, RN 5, FB 4, LY 5, IM 5) — CONTRACT INTEGRITY = PASS
- mode: STRICT READ-ONLY. No production file, schema, master content or data row was changed to produce this matrix.
- statuses recalculated from zero. Old labels were not carried forward.
- allowed statuses: `ALIGNED`, `PARTIAL-DRIFT`, `MISSING`, `STRUCTURAL-CONFLICT`, `DECISION-REQUIRED`.
- Severity scale: `BLOCKING` (blocks controlled content migration) / `NON-BLOCKING`.

Columns: `ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action`.

---

## FP — Functional Participation

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| FP-01 | FP | Seven gates validate an FP before use | PARTIAL-DRIFT | `src/lib/framework/fp-validity.ts:10-17,47-55,154-289` — `FpGateId` = FP-02..FP-08 exactly; `evaluateFunctionalParticipation` returns `{valid, gates, failedGates, codes}`. Live callers: `src/lib/entry/family-spec.ts:89`, `src/lib/framework/easy-beginning-corpus.ts:164`, `src/lib/framework/reference-registry.ts:27` | The legacy browse flow (`src/routes/activities.browse.tsx:96-106`, `activities.$category.tsx:66-83` → `HomeHierarchy`/`GeneralParticipationList`/`TodayEvents` → `ParticipationCard`) still presents 1413 CSV rows with no gate evaluation and no legacy label | NON-BLOCKING | Content migration is exactly the mechanism that moves rows across this boundary | Add a visible provenance boundary on legacy surfaces; route new content through `registerFrameworkParticipation` |
| FP-02 | FP | Gate 1 — role stated inside a real life situation | ALIGNED | `reference-model.ts:58-79` field `life_context`; gate `fp-validity.ts:159+`; seeds `easy-beginning-corpus.ts:18-149`; family entry `family-spec.ts:36-58,89` | — | — | — | — |
| FP-03 | FP | Gate 2 — reason the situation needs the role | ALIGNED | field `functional_intent` (`reference-model.ts:58-79`); gate enforced; `fp-validity.test.ts` CASE E rejects training-objective phrasing | — | — | — | — |
| FP-04 | FP | Gate 3 — observable change stated | ALIGNED | field `observable_effect`; gate enforced (`fp-validity.ts`) | — | — | — | — |
| FP-05 | FP | Gate 4 — natural end of role stated | ALIGNED | field `natural_completion`; gate enforced; distinct from composer `startStepId/endStepId` (`compose.ts:171-174`) | — | — | — | — |
| FP-06 | FP | Gate 5 — role meaningful when separated from the activity | ALIGNED | field `standalone_role_meaning`; `blockEqualsRole` guard `fp-validity.ts:200-224` code `EXECUTION_BLOCK_EQUALS_ROLE`; test CASE G | — | — | — | — |
| FP-07 | FP | Gate 6 — no performance/ability/assistance language; such a definition must be rejected | PARTIAL-DRIFT | Rejection is real: `PERFORMANCE_TERMS`/`TRAINING_OBJECTIVE_TERMS` `fp-validity.ts:58-107`, test CASE E | Legacy ladder text is still rendered live: `ParticipationCard.tsx:368-374` («موجهة» / «مستقلة جزئياً» / «مستقلة») + `:375-388` indicators, reached from Home via `/activities/browse` (`src/routes/index.tsx:96`) and `/active-participations` (`index.tsx:387`) | NON-BLOCKING | Presentation boundary decision, not schema | Hide/relabel the legacy ladder on family-facing surfaces, or gate those surfaces behind a legacy marker |
| FP-08 | FP | Gate 7 — mode explicitly individual or shared | ALIGNED | `ParticipationMode` `reference-model.ts:9`, field `participation_mode:74`, gate `fp-validity.ts:252-273` | — | — | — | — |
| FP-09 | FP | Candidate failing any gate cannot become usable | ALIGNED | `isUsableFunctionalParticipation` `fp-validity.ts:285-289`; `reference-registry.ts:19-32` throws on invalid; `easy-beginning-corpus.ts:164-169` drops invalid seeds | Legacy rows are not FPs; they resolve as `legacy_master` (`reference-model.ts:6,82-103`) | — | — | — |
| FP-10 | FP | Event and FP are distinct records | PARTIAL-DRIFT | Framework: distinct `preferred_context` / event vs `FunctionalParticipation` records, asserted in `fp-validity.test.ts`; legacy: `02_events.csv` (564) vs `03_participation_opportunities.csv` (1413) | ~50 legacy opportunities carry a name identical to their parent event (content debt recorded in GAP 01) | NON-BLOCKING | Content classification during migration | Reclassify event-like rows when migrating, do not rewrite master in place |
| FP-11 | FP | Execution Block and FP are distinct; no block equals the role | ALIGNED | `execution_blocks` on the FP record; `EXECUTION_BLOCK_EQUALS_ROLE` guard; family blocks carry independent stable IDs (`src/lab/data/space/family-blocks.ts`, `WorkspacePage.tsx:133-142`), test `composition-completeness.test.ts` | — | — | — | — |
| FP-12 | FP | An FP never encodes learner ability or a training objective | PARTIAL-DRIFT | Compliant model has no such field (`reference-model.ts:58-79`); training-objective language is rejected by FP-07 gate | Legacy card model still carries `levels` + `progressIndicators` (`src/lib/home-hierarchy.ts:52,119`, `knowledge-base.ts:195-196`) and renders them on live routes | NON-BLOCKING | Same boundary as FP-07 | Stop projecting `levels`/`progressIndicators` into family-facing card data |

## CX — Complexity

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| CX-01 | CX | Complexity reachable only after FP validity passes | PARTIAL-DRIFT | Compliant seeds carry `complexity` only inside a record that must pass all 7 gates at registration (`reference-registry.ts:19-32`) | No explicit ordering guard; the legacy CSV `participation_level` exists with no validity concept, and family-authored specs receive a level without dimensions (`family-spec.ts:116-129`) | NON-BLOCKING | Enforced naturally by migrating through the registry | Require registry registration as the only path that can carry complexity |
| CX-02 | CX | Exactly four dimensions C1–C4 | PARTIAL-DRIFT | `ComplexityDimensions` = `c1_elements, c2_coordination, c3_variability, c4_choice_uncertainty` (`reference-model.ts:11-31`); test CASE C asserts all four keys | Family-authored specs (`specFromFamilyAnswers`) store `level` only with no dimensions; legacy CSV still has three dimensions (`role_scope`, `organization_demand`, `variation_demand`) | NON-BLOCKING | Migration must author C1–C4 per row | Author C1–C4 during migration; add dimensions to family-authored specs |
| CX-03 | CX | Levels are exactly Simple / Moderate / Advanced | ALIGNED | `ComplexityLevel` `reference-model.ts:11`; CSV values `simple/moderate/advanced` only | — | — | — | — |
| CX-04 | CX | Authored editorially, never computed from execution data | ALIGNED | `reference-model.ts:11-31` comment «تُؤلَّف تحريرياً ولا تُحسب»; seeds hardcode complexity; no code computes it | — | — | — | — |
| CX-05 | CX | Execution Block edits do not change complexity | ALIGNED | Composer writes only `participation_drafts.selection` (`production-store.tsx:352-361`); `compose.ts:165` copies `spec.level`; `fp-validity.test.ts` doubles blocks and asserts complexity byte-identical | — | — | — | — |
| CX-06 | CX | Support add/remove does not change complexity | ALIGNED | `support.add`/`support.remove` touch `family_support_assets` only (`production-store.tsx:504+`); Foundation 08 negative tests B/C | — | — | — | — |
| CX-07 | CX | Runs do not change complexity | ALIGNED | `run.start`/`run.end` write only `participation_runs` (`production-store.tsx:419-458`) | — | — | — | — |
| CX-08 | CX | Shared role may hold any level; shared never implies Advanced | ALIGNED | `participation_mode` exists; `fp-validity.test.ts` CASE B flips mode to `shared` and asserts `complexity.level` unchanged | — | — | — | — |
| CX-09 | CX | Rationale is role-structural with no person-based criterion | ALIGNED | `FrameworkComplexity.rationale`; test CASE D asserts absence of «قدرة/استقلالية/مساعدة/إتقان/عمر/تشخيص/نجاح سابق»; legacy `classification_reason` is role-structural | — | — | — | — |

## EN — Entry

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| EN-01 | EN | Exactly three entry strategies | ALIGNED | `src/routes/index.tsx:67-91` `ENTRY_STRATEGIES` = «بداية سهلة» → `/space/easy`, «أخطط المشاركة بنفسي» → `/space/plan`, «استكشف المشاركات الممكنة» → `/space/explore`. LIVE: all three strings present on `/`, all three routes 200 | — | — | — | — |
| EN-02 | EN | Discovery provides an Event lens and a Routine Station lens | ALIGNED | `ExplorePage.tsx:20,33-37` `lens: "event" \| "station"`; `/my-routine` 200 live | — | — | — | — |
| EN-03 | EN | Routine Station carries no time/schedule/due/completion/streak/compliance field | PARTIAL-DRIFT | No code writes `status`/`completed_at` (only 4 call sites `family-routine.ts:48,66,79,90`); completion trigger dropped (migrations `20260821010855`, `20260904194945`); live DB: 0 rows with `status='completed'`, 0 with `completed_at` | `part_of_day` remains an actively written and read time-of-day field on the station; `status`/`completed_at` columns remain in schema as dead history | NON-BLOCKING | None | Decide whether `part_of_day` is a descriptive grouping label or a time field; document the dead columns |
| EN-04 | EN | All three entries produce the same Family Participation record shape | ALIGNED | `buildFamilyParticipationRow` (`src/lib/family-participation.ts:60-83`) is the single constructor; LIVE DB `active_participations.origin`: reference 13, easy_beginning 1, family_free 1 | — | — | — | — |
| EN-05 | EN | No entry has its own downstream architecture or parallel model | ALIGNED | one provider `ProductionSpaceProvider` (`production-store.tsx`) mounted once at `src/routes/_authenticated/space.tsx`; one draft table keyed by `spec_id` | — | — | — | — |
| EN-06 | EN | Fixed downstream order | ALIGNED | `/space/easy\|plan\|explore` → `entry-create.ts` → `/space/workspace/$specId` → `/space/preview/$specId` → snapshot → `/space/learner/$snapshotId` → run → `/space/feedback/$snapshotId` → lifecycle | — | — | — | — |

## EB — Easy Beginning

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| EB-01 | EB | Starts from a liked/requested/returned-to context | ALIGNED | `src/lib/entry/preferred-context.ts:25-47`; LIVE `/space/easy` text: «ما الشيء الذي يحبه ويعود إليه؟» with four liked contexts + free text | — | — | — | — |
| EB-02 | EB | May expand a liked context into the moments inside it | ALIGNED | `candidatesForPreferredContext` (`easy-beginning-corpus.ts:26-32`) filters seeds by `preferred_context_id`; `EasyBeginningPage.tsx:20,42` | Only 5 seed FPs exist (TEST/SEED content, not product coverage) | NON-BLOCKING | Migration supplies breadth | Expand the compliant corpus during migration |
| EB-03 | EB | Collects no readiness/ability/diagnostic/learner-level input | ALIGNED | `EasyBeginningPage.tsx:1-2`; LIVE page footer «لا نسأل هنا عمّا يستطيعه، بل عمّا يحبه ويشاركنا فيه» — no such field in the form | — | — | — | — |
| EB-04 | EB | Assigns no learner level and produces no classification | ALIGNED | No learner-level field anywhere in the entry path; `active_participations` has no learner column | — | — | — | — |
| EB-05 | EB | Does not force Simple complexity | ALIGNED | Framework candidate copies its own level (`family-spec.ts:142-153`); family-authored spec defaults to `moderate` (`family-spec.ts:116-129`) — never forced Simple | Default `moderate` is a hardcoded authoring default (see CX-02) | NON-BLOCKING | — | Replace default with authored complexity |

## FA — Family Participation

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| FA-01 | FA | Records its origin | ALIGNED | `family-participation.ts:10-13` origin union; column `active_participations.origin`; LIVE three distinct origin values persisted | — | — | — | — |
| FA-02 | FA | Reference link is provenance only; never writes to the reference | ALIGNED | `reference_spec_id`/`reference_source` are read-only provenance; no CSV/reference write path exists in `src` | — | — | — | — |
| FA-03 | FA | Family-free participation valid with no reference at all | ALIGNED | `buildFamilyParticipationRow` throws if a non-reference origin carries a `specId` (`family-participation.ts:60-83`); `entry-create.ts:28,50` passes no reference; LIVE `family_free` row exists | Canonical id is `active_participations.id`; `FAM-*` spec key is a compatibility handle only (`spec-resolution.ts:8-14`) | — | — | — |
| FA-04 | FA | Identity fields copied at creation, not re-derived | PARTIAL-DRIFT | `specFromFamilyAnswers`/`specFromFrameworkParticipation` copy title, life context, level and blocks at creation; `compose.ts:165` copies `spec.level` unchanged | `functional_intent`, `observable_effect`, `natural_completion`, `participation_mode` and complexity rationale are validated at input but not persisted on the family participation/spec | NON-BLOCKING | Migrated content will carry these fields; persistence must exist to receive them | Persist the full identity block on the family participation record |
| FA-05 | FA | Carries draft, considerations, supports, snapshots | ALIGNED | `participation_drafts`, `selection.considerationIds`, `family_support_assets`, `participation_snapshots` all keyed to the participation | — | — | — | — |
| FA-06 | FA | Considerations never in learner-facing output | ALIGNED | `considerations.ts:1-2`; `considerationIds` referenced only in `WorkspacePage.tsx` and frozen at `compose.ts:175`; zero hits in learner/card pages | — | — | — | — |

## WS — Workspace / Composition

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| WS-01 | WS | One shared workspace for all entries | ALIGNED | Single route `/space/workspace/$specId`; single draft table keyed `spec_id` (`production-store.tsx:352-361`); LIVE exercised from reference, easy_beginning and family_free origins | — | — | — | — |
| WS-02 | WS | Blocks can be added, removed, reworded, reordered | ALIGNED | `WorkspacePage.tsx:117-156` (`addStep`, `addFamilyBlock`, `removeStep`, `move`), `setText:236-244` | — | — | — | — |
| WS-03 | WS | Explicit start and end block | ALIGNED | `WorkspacePage.tsx:108-115` `withRange`; frozen `compose.ts:171-174` | — | — | — | — |
| WS-04 | WS | Family wording stored independently of reference wording | ALIGNED | `compose.ts:30-33` sourceText vs familyText; Foundation 07 live evidence: `FBLK-*` family blocks carry no fabricated sourceText (`composition-completeness.test.ts`) | — | — | — | — |
| WS-05 | WS | Reference wording remains available and restorable | ALIGNED | `resetText` (`WorkspacePage.tsx:236-244`) guarded by `isFamilyBlockId`; UI «استخدموا العبارة المقترحة» `StepComposer.tsx:161-184` | — | — | — | — |
| WS-06 | WS | Text and image visibility independent per block | ALIGNED | `imageVisibleByStepId` / `textVisibleByStepId` separate dispatches (`WorkspacePage.tsx:196-210`); `compose.ts:61-73` | — | — | — | — |
| WS-07 | WS | Family title optional and independent | ALIGNED | Optional `label` input `PreviewPage.tsx:214-224`, default fallback at `:105` | — | — | — | — |
| WS-08 | WS | Participation image distinct from Optional Support | ALIGNED | `PARTICIPATION_IMAGE_SCOPE` (`production-store.tsx:34`); frozen separately `compose.ts:177`; LIVE Foundation 08: removing/adding support left the participation image intact | — | — | — | — |

## SU — Support

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| SU-01 | SU | Support is optional; approval possible without any | ALIGNED | Support created only on explicit «احفظوا هذه الوسيلة» (`SupportGenerator.tsx:145-152`); LIVE snapshots v1–v4 of `10bf7c3e…` approved with `supportAssetsFrozen = []` | — | — | — | — |
| SU-02 | SU | Declared type from a fixed set (communication, visual sequence, timer, stop/break, contextual aid) | PARTIAL-DRIFT | Registry `src/lib/support/taxonomy.ts:36-104` declares 4 categories: `visual_schedule`, `step_sequence`, `now_next`, `choice_board`; legacy mapping layer `resolveSupportCategory` | The declared set is deliberately open/extensible, and timer, stop/break and contextual-aid categories are not declared | NON-BLOCKING | None — additive registration | Register the missing contract categories; decide whether the set is closed by governance |
| SU-03 | SU | Support use never recorded as prompt/assistance level or performance datum | ALIGNED | `SupportInstanceView` (`taxonomy.ts:152-164`) has no level field; no table records support use per run | Legacy display layers (see SUPPORT DRIFT below) show support text but record nothing | — | — | — |
| SU-04 | SU | Support present at approval is carried inside the approved version | ALIGNED | `compose.ts:178-189` freezes label, items, config and resolved `categoryId`; LIVE v6 = `visual_schedule`, v7 = `choice_board`, v5 unchanged | — | — | — | — |

## SN — Snapshot / Versioning

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| SN-01 | SN | Approval creates a snapshot from the current mutable draft | ALIGNED | `PreviewPage.tsx:90-109` `approve()` → `buildFrozenSnapshot` → `{type:"snapshot"}` → insert (`production-store.tsx:391`) | — | — | — | — |
| SN-02 | SN | Versions sequential and append-only from 1 | ALIGNED | `nextVersion()` `production-store.tsx:376-404` (`max+1`, retry on conflict); LIVE `10bf7c3e…` holds v1..v7 contiguous | — | — | — | — |
| SN-03 | SN | Creating v2 leaves v1 byte-identical | ALIGNED | Insert-only; LIVE Foundation 08: v5 still has 1 support row with no `categoryId` after v6/v7 were approved | — | — | — | — |
| SN-04 | SN | Snapshot carries identity, version, approved state, content, FP relationship | ALIGNED | Table columns `id, version_number, approved_at, snapshot_data, family_participation_id, schema_version` | — | — | — | — |
| SN-05 | SN | No operation deletes or replaces an approved snapshot | ALIGNED | Only `select`/`insert` in code; RLS policies on `participation_snapshots` are INSERT + SELECT only — no UPDATE/DELETE policy exists (verified live in `pg_policies`) | — | — | — | — |
| SN-06 | SN | The approved snapshot is never the object the family edits | ALIGNED | Editing writes `participation_drafts` only; `LearnerPage.tsx:49` reads frozen frames with no recomposition | — | — | — | — |
| SN-07 | SN | Downstream version explicitly selected, not implicitly latest | ALIGNED | `learner-resolution.ts:28-52` requires `snapshotId`, returns `missing-selection` otherwise; test «وجود نسخة أحدث لا يغيّر الاختيار» | — | — | — | — |

## LC — Learner Card

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| LC-01 | LC | Created only from an existing approved snapshot | ALIGNED | `resolveLearnerLaunch`; LIVE `/learner/KB-CLO-001-OP001` 200 → redirects to `/space/workspace/…` (`src/routes/learner.$id.tsx` is a retired redirect route) | — | — | — | — |
| LC-02 | LC | Shows moment-of-use content only | ALIGNED | `LearnerPage.tsx:66-109` renders image/wording per block, navigation and «انتهينا» | — | — | — | — |
| LC-03 | LC | Excludes complexity rationale | ALIGNED | No complexity/rationale reference in `LearnerPage.tsx` | — | — | — | — |
| LC-04 | LC | Excludes considerations, provenance, management data | ALIGNED | Learner page reads `snap.frames` only | — | — | — | — |
| LC-05 | LC | Excludes ability/mastery/progress/independence/score | ALIGNED | None of these tokens appear in the learner surface | — | — | — | — |
| LC-06 | LC | Cannot write to its snapshot | ALIGNED | Only `run.start`/`run.end` dispatches (`LearnerPage.tsx:45,126`), which write `participation_runs` | — | — | — | — |

## RN — Run

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| RN-01 | RN | A Run is one occurrence in life, not a training attempt | ALIGNED | `production-store.tsx:419-448`; UI vocabulary is «مرة»; no attempt/trial/training semantics in the run path | — | — | — | — |
| RN-02 | RN | Each occurrence has its own Run identity | ALIGNED | Client-generated `runId` UUID (`LearnerPage.tsx:33-37`), upsert `onConflict:"id", ignoreDuplicates` | — | — | — | — |
| RN-03 | RN | Many Runs per Family Participation and per snapshot without a new parent | ALIGNED | `run.start` comment and code resolve the existing participation; never inserts into `active_participations`; LIVE 20 ended runs across 15 participations | — | — | — | — |
| RN-04 | RN | «انتهينا» closes only the current Run | ALIGNED | `run.end` sets `ended_at` on one id (`production-store.tsx:450-458`); card/participation untouched | — | — | — | — |
| RN-05 | RN | Recurrence shown as a neutral count only | ALIGNED | `CardsPage.tsx:153-162,212-219` plain counts; no streak/percentage/trend computation exists in `src` | — | — | — | — |

## FB — Feedback

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| FB-01 | FB | Optional and attaches to exactly one Run | PARTIAL-DRIFT | Optional confirmed (`FeedbackPage.tsx:69-82`); `run_id` written at `production-store.tsx:488-497` | `participation_feedback.run_id` is nullable and 2 of 13 live rows (pre-fix TEST DATA) carry no run | NON-BLOCKING | None | Make `run_id` required for new rows once historical rows are accepted as legacy |
| FB-02 | FB | Options non-evaluative, no ordinal/numeric value | ALIGNED | tones `comfortable/usual/difficult_today` (`FeedbackPage.tsx:15-19`); «لا تقييم ولا درجات ولا نِسَب» `:106`; «صعوبة اليوم تخص الظرف، لا الشخص» `:131` | — | — | — | — |
| FB-03 | FB | Never aggregated across Runs | ALIGNED | Feedback read back as a flat array (`production-store.tsx:299-305`); no aggregation query anywhere | — | — | — | — |
| FB-04 | FB | No mastery/progress/readiness/level inferred or displayed | ALIGNED | No derivation code; those tokens exist only as banned terms inside `fp-validity.ts` | — | — | — | — |

## LY — Lifecycle

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| LY-01 | LY | Card closure and Family Participation closure are separate operations | ALIGNED | Two distinct actions: `card.close/reopen` → `participation_card_states.closed` (`production-store.tsx:476-487`); `participation.close/reopen` → `active_participations.status/closed_at` (`:460-474`) | — | — | — | — |
| LY-02 | LY | Closing a Card preserves its Runs and its parent | ALIGNED | Card closure writes one boolean; no cascade | — | — | — | — |
| LY-03 | LY | Closing a Family Participation makes the parent history and preserves cards/snapshots/runs/feedback | PARTIAL-DRIFT | Closure writes `status='closed'` only; LIVE 4 closed rows with snapshots and runs intact | Home «مساحة عمل الأسرة» summary (`src/features/space/home-status.ts:71-97`) reads drafts and latest snapshots without consulting `active_participations.status`, so a closed participation still appears as a live approved item | NON-BLOCKING | None | Filter the Home summary by lifecycle, or label closed items as history |
| LY-04 | LY | Closure never presented as failure/regression | ALIGNED | `FeedbackPage.tsx:143,178` — «تُحفظ كل البطاقات والمرات السابقة، ويمكن إعادة فتحها لاحقاً» | — | — | — | — |
| LY-05 | LY | No operation deletes historical evidence | ALIGNED | No `.delete()` against runs, snapshots or feedback anywhere in `src`; snapshot FK `ON DELETE RESTRICT` | — | — | — | — |

## IM — Immutability

| ID | Domain | Requirement | Status | Evidence | Remaining Gap | Severity | Migration Dependency | Recommended Next Action |
|----|--------|-------------|--------|----------|---------------|----------|----------------------|--------------------------|
| IM-01 | IM | Reference Knowledge immutable; writes rejected | ALIGNED | No write path to `src/data/knowledge/*.csv`; `registerFrameworkParticipation` throws on re-registration (`reference-registry.ts:19-32`); `catalog.ts:1-2` read-only layer | — | — | — | — |
| IM-02 | IM | Family State stored separately from Reference Knowledge | ALIGNED | All family state lives in Supabase tables; reference lives in CSV + framework registry | — | — | — | — |
| IM-03 | IM | Family customization can never alter reference content | ALIGNED | Family wording stored as `familyText` in the draft/snapshot only (`compose.ts:30-33`) | — | — | — | — |
| IM-04 | IM | Approved snapshot rejects mutation, including after reload/restart | ALIGNED | Enforced at the database, not in memory: no UPDATE/DELETE policy on `participation_snapshots` (live `pg_policies` = INSERT + SELECT only) | — | — | — | — |
| IM-05 | IM | App state contains no score/mastery/progress/streak/readiness/ability/independence/learner-level/compliance/checklist field | PARTIAL-DRIFT | Family/production state (all Supabase tables) contains none of these | Legacy reference projection still carries `levels` (guided/shared/independent) and `progressIndicators` into live UI state (`home-hierarchy.ts:52,119`, `ParticipationCard.tsx:368-388`); `routine_stations.status`/`completed_at` columns persist as dead history | NON-BLOCKING | None | Drop the ladder/indicator projection from family-facing state; mark the dead station columns deprecated |

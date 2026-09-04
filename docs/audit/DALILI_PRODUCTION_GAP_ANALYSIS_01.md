# DALILI PRODUCTION GAP ANALYSIS — 01

Read-only audit of the CURRENT Production implementation against the frozen validated
framework contract. No Production code, schema, data, route, or content was modified.

- generated_at: 2026-09-04 (UTC)
- contract: `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
- contract sha-256 verified: `693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc` — YES
- requirements loaded: 82 / 82 (FP12 CX9 EN6 EB5 FA6 WS8 SU4 SN7 LC6 RN5 FB4 LY5 IM5)
- per-requirement classification: `DALILI_PRODUCTION_CONTRACT_MATRIX_01.md`
- dependency clusters: `DALILI_PRODUCTION_GAP_DEPENDENCIES_01.md`

---

## 1. PRE-GOLDEN ARTIFACTS

All three present and used as source of truth:

- `docs/audit/DALILI_PRE_GOLDEN_CONTENT_BASELINE_01.json` — FOUND
- `docs/audit/DALILI_PRODUCTION_SOURCE_OF_TRUTH_MANIFEST_01.md` — FOUND
- `docs/audit/DALILI_PRODUCTION_LINEAGE_AUDIT_01.md` — FOUND

Baseline counts re-read from the stored artifact and confirmed against the live corpus
without rewriting it: domains 6 · events 564 · opportunities 1413 · cards 1139 ·
opportunities with cards 1139 · without cards 274 · no duplicate IDs · no orphan
relationships · no opportunity with multiple cards. No replacement baseline was generated.

## 2. CURRENT PRODUCTION LINEAGE (re-traced, not assumed)

| Stage | Route | Component(s) | State entity | Provider | Persistence | Source data | Location |
|-------|-------|--------------|--------------|----------|-------------|-------------|----------|
| Home | `/` | `src/routes/index.tsx`, `home-status.ts` | read-only status | none (direct client) | reads `participation_drafts`, `participation_snapshots` | Cloud + catalog | Production |
| Entry | `/`, `/activities/index` | `index.tsx`, `activities.index.tsx` | — | — | — | static | Production |
| Browse / Discovery | `/space/library`, `/activities/browse`, `/search` | `LibraryPage.tsx`, `knowledge-base.ts`, `search-index.ts` | — | — | none | CSV corpus | Production (spec build via `src/lab/data/space/catalog.ts`) |
| Help Me Choose | `/help-me-choose` | `help-me-choose.tsx`, `daily-events.ts` | local component state | — | none | CSV corpus | Production |
| Routine entry | `/my-routine` | `family-routine.ts` | `RoutineStation` | ProductionSpaceProvider refs | `family_routines`, `routine_stations` | Cloud | Production |
| Level selection | `/space/$eventId/level` | `LevelPage.tsx` | `SliceLevel` | ProductionSpaceProvider | none | CSV `participation_level` | Production |
| Participation selection | `/space/$eventId/participations` | `EventParticipationsPage.tsx`, `participation-link.ts` | `specId = KB-<opportunity_id>` | ProductionSpaceProvider | none | CSV | Production |
| Family Participation | side effect of first save/approval | `ensureParticipation()` | `active_participations` row | ProductionSpaceProvider | `active_participations` | Cloud | Production |
| Workspace | `/space/workspace/$specId` | `WorkspacePage.tsx` | `LabThisTimeSelection` | ProductionSpaceProvider | `participation_drafts` | Cloud | Production |
| Composer | same | `StepComposer.tsx`, `@/lab/components/space/FamilyComposer` | `selection.selected[]` | dispatch `selection` | `participation_drafts.selection` | Cloud | Production component + Lab-located UI |
| Family wording | same | `@/lab/components/space/FrameEditor`, `compose.ts` | `familyTextByStepId` | dispatch `selection` | same | Cloud | Production logic + Lab-located UI |
| Images | same | `step-image.ts`, `derived-assets.ts`, `family-uploads.ts` | `imageRefByStepId` | ProductionSpaceProvider | storage `family-visuals` + `visual_assets`; draft holds `uploadedPath` | Cloud | Production |
| Considerations | same | `ConsiderationsPanel.tsx`, `considerations-context.ts` | `considerationIds` | dispatch `selection` | `participation_drafts` | Cloud + `@/lab/data/space/considerations` | Production |
| Support | same | `SupportGenerator.tsx` | `LabSupportAsset` | ProductionSpaceProvider | `family_support_assets` | Cloud | Production |
| Preview | `/space/preview/$specId` | `PreviewPage.tsx`, `composeDraft()` | `ComposedRow[]` | ProductionSpaceProvider | read-only | draft | Production |
| Approval / Snapshot | same (approve) | `buildFrozenSnapshot()` | `LabCardSnapshot` | dispatch `snapshot` | `participation_snapshots` | Cloud | Production |
| Versioning | `/space/card/$specId` | `CardsPage.tsx` | `version_number` | ProductionSpaceProvider | `participation_snapshots` | Cloud | Production |
| Learner Card | `/space/learner/$snapshotId` | `LearnerPage.tsx` | frozen `frames` | ProductionSpaceProvider | read-only | snapshot | Production |
| Learner Card (competing) | `/learner/$id` | `learner.$id.tsx`, `src/lib/learner-card.ts` | none | none | none | CSV `participation_steps` | Production route, non-canonical |
| Run | learner actions | `LearnerPage.tsx` + `production-store.tsx` | `run.id` | ProductionSpaceProvider | `participation_runs` | Cloud | Production |
| Feedback | `/space/feedback/$snapshotId?runId=` | `FeedbackPage.tsx` | `SliceFeedback` | ProductionSpaceProvider | `participation_feedback` | Cloud | Production |
| Card lifecycle | `/space/card/$specId`, feedback page | `CardsPage.tsx`, `FeedbackPage.tsx` | `closedCards` | dispatch `card.close` | `participation_card_states` | Cloud | Production |
| Participation lifecycle | `/space/`, feedback page | `SpaceHomePage.tsx`, `FeedbackPage.tsx` | `closedSpecs`, `lifecycleBySpec` | dispatch `lifecycle`, `participation.close` | `active_participations` | Cloud | Production |

**Changes vs. the stored manifest:** the 20 mapped stages are unchanged and still accurate.
Two additions this audit records that the manifest did not surface as stages: the
`/learner/$id` legacy learner surface (competing with stage 14) and `/help-me-choose` as an
entry surface. Provider, persistence and identifiers are otherwise identical.

## 3. SEMANTIC MODEL AUDIT

Concepts present in Production: **Domain** (`01_domains.csv`), **Event** (`02_events.csv`),
**Routine Station** (`routine_stations`), **Execution Block** (runtime-derived from
`participation_steps`), **Family Participation** (`active_participations`).
Concepts absent: **Preferred Context** (no field, no table, no UI) and **Functional
Participation as a validated object** (only "Opportunity" exists).

`Opportunity → Functional Participation` cannot be assumed. Inspection of representative
records shows a **mixed semantic set**:

- role-like: `CLO-011-OP001` «فرز الملابس المتسخة قبل الغسيل» — a bounded role in a situation.
- event-like: 50 of 1413 opportunities carry a name byte-identical to their parent event
  (`CLO-001-OP001` = «شراء ملابس جديدة للأسرة», `CLO-002-OP001`, `CLO-003-OP001` …). These are
  the event restated, not a role inside it.
- execution-like / whole-activity: opportunities whose card steps enumerate the entire
  activity from decision to purchase, i.e. the block set equals the activity.

Boundary check: `Event ≠ Functional Participation` holds at record level (separate files,
separate IDs, 1413 vs 564) but is violated in content for the 50 identical-name rows.
`Functional Participation ≠ Execution Block` holds structurally (blocks have no records) but
weakly: blocks are only text inside the participation's single card, so a block cannot be
addressed, reused, or validated on its own.
`Functional Participation ≠ training objective / learner ability` is **violated in content**:
39 card rows state the purpose as `لتعلّم …`, and 631 of 1139 card rows contain
`بشكل مستقل` / `بمفرده` / `دون مساعدة`.

No content was migrated or reclassified.

## 4. FUNCTIONAL PARTICIPATION FINDINGS

Representable today: life context (indirectly, via the parent event label only).
Not representable: functional intent as a situational need, observable effect, natural
completion of the role, functional independence of the role, participation mode.
No gate model, no gate storage, no validity state, no rejection path — validity cannot
precede complexity classification because validity does not exist (FP-01, FP-09, CX-01).

Conflating logic found in the reference model, surfaced by `src/components/ParticipationCard.tsx`:

- `participation_levels` = «مراقبة … المشاركة … تنفيذ بشكل مستقل» → an assistance/independence ladder.
- `indicators` = «القدرة على التعبير…», «تقلير زمن التردد», «التعرف على القطع دون مساعدة» → performance data.
- `make_it_easier` and `support_notes` are contextual and do not conflate.

These fields live in the immutable Master corpus, which is why FP-07 and FP-12 are
STRUCTURAL-CONFLICT rather than PARTIAL-DRIFT.

## 5. COMPLEXITY FINDINGS

Levels match exactly (`simple` 352 / `moderate` 915 / `advanced` 146) and are authored, stored,
and never computed — blocks, support and runs provably never write them (CX-03..CX-07 ALIGNED).

Dimensions do not match: Production stores **three** (`role_scope`, `organization_demand`,
`variation_demand`) and the rationale text says so explicitly («تطابقت الأبعاد الثلاثة»).
C1 Elements has no counterpart, and C3 Variability with C4 Choice/Uncertainty appear merged into
`variation_demand` («الاختيار والتكيف»). Rationale wording is role-structural and free of
person-based criteria (CX-09 ALIGNED).

Shared participation cannot affect complexity incorrectly because participation mode does not
exist (CX-08 MISSING). "Advanced" is not defined as "whole task" in code, but in content the
advanced tier is dominated by whole-activity opportunities (see §3), so the risk is content-side.

## 6. ENTRY FINDINGS

None of the three validated entry names exists in Production; a repository search for
«بداية سهلة», «أخطط المشاركة بنفسي», «استكشف المشاركات الممكنة» returns zero matches in
`src/routes`, `src/features`, `src/components`.

What exists instead:

- **A (بداية سهلة)** — no equivalent.
- **B (أخطط المشاركة بنفسي)** — partially: `/space/library` → level → participation → workspace,
  but always starting from a reference Opportunity; no from-scratch planning.
- **C (استكشف المشاركات الممكنة)** — two lenses do exist: event/general discovery
  (`/space/library`, `/activities/browse`) and Routine Station discovery (`/my-routine`),
  satisfying EN-02.

Convergence: every existing surface converges on the same contract —
`specId = KB-<opportunity_id>` → one `active_participations` row → `participation_drafts` →
`participation_snapshots` → `participation_runs` → `participation_feedback`, with one provider
and one reducer. No parallel downstream model exists (EN-05, EN-06 ALIGNED). Convergence is
verified at state/contract level, not by screen similarity.

Structural conflict at the station lens: `routine_stations` carries `part_of_day`, `status`,
and `completed_at` — schedule and completion state on the station entity (EN-03).

## 7. EASY BEGINNING VS CURRENT HELP-ME-CHOOSE

**DOES NOT IMPLEMENT.**

`/help-me-choose` asks: (1) part of day → (2) daily event → (3) participation level → result list.
It is a time-and-complexity filter over the reference corpus. It never asks what the person
likes, enjoys, requests, seeks, or engages with; it has no notion of a recurring preferred
context; and the relational direction is reversed — the family narrows a catalogue rather than
creating a place for itself with the person inside something the person values.

What it is *not*: it is not a readiness assessment, ability questionnaire, diagnostic screen,
or learner-level assignment either — the level it asks for is role complexity, not a person
attribute. So it does not violate EB-03/EB-04; it simply does not implement EB-01/EB-02/EB-05.

Mapping: EN-01 MISSING; EB-01, EB-02, EB-03, EB-04, EB-05 all MISSING.

## 8. FAMILY PARTICIPATION FINDINGS

Origins: only one exists. `ensureParticipation()` writes the constant
`source: "family_workspace"`, so reference / easy_beginning / family_free are
indistinguishable (FA-01).

Family Free: **not possible without a fake reference**. Identity is `specId = KB-<opportunity_id>`
(`src/features/space/participation-link.ts`), and every downstream page resolves display content
through `getSpaceSpec(specId)` → `findOpportunityById()`. A spec id with no matching CSV row
renders «هذه المشاركة غير متاحة» in `WorkspacePage.tsx` and `CardsPage.tsx`. Creating a family-free
participation today would require inventing a KB id or a placeholder Master row — both prohibited.
Because the blocker is the identity model itself and not a behavioural detail, FA-03 is
**STRUCTURAL-CONFLICT**, and FA-04 (identity fields re-derived from the reference at render rather
than copied at creation) is PARTIAL-DRIFT feeding the same root cause.

## 9. WORKSPACE FINDINGS

Verified working: immutable source wording alongside editable family wording, reset to source,
block selection and removal, explicit ordering, explicit start/end, per-step image choice
including family uploads, independent image and text visibility, considerations, optional
support, optional family card title. Persistence is `participation_drafts` upserted on
`(user_id, spec_id)` and rehydrated on reload.

Customization never mutates the reference (CSV is read-only, all edits live in
`selection`), block edits never rewrite the participation identity (only `snapshot_data`
copies identity at approval), and block count never touches complexity.

Two drifts: blocks can only be selected from the reference-derived set — there is no
"add a block we invented" path (WS-02); and there is no single "participation image" distinct
from per-block images, so WS-08's distinction is only half-modelled.

## 10. SUPPORT FINDINGS

Support is genuinely optional — approval succeeds with zero assets, and nothing records support
*use*, prompt level, or assistance level. Support present at approval is copied into
`supportAssetsFrozen` inside the snapshot. Support is stored separately from step images.
Support never touches complexity, and no intervention/training logic is attached to it.

Actual Production types, recorded verbatim and unexpanded:
`SPACE_SUPPORT_ASSET_TYPES` = `communication`, `time`, `schedule`.
`SPACE_SUPPORT_TOOLS` = `visual-schedule`, `now-next`, `timer`, `choice-board`, `tell-before`,
`picture-list`, `builder`.

The contract's declared set (communication, visual sequence, timer, stop/break, contextual aid)
overlaps but is not the same set: `stop/break` and `contextual aid` have no Production
counterpart, while `tell-before` and `builder` have no contract counterpart. This is why SU-02 is
DECISION-REQUIRED rather than PARTIAL-DRIFT (see Ambiguity C).

## 11. SNAPSHOT / VERSIONING FINDINGS

The conceptual transition is implemented exactly: mutable draft → approval → immutable v1 →
further draft editing → approval → immutable v2, with v1 untouched. Version numbers are resolved
from the database (max + 1, retry on conflict), not from local state. Immutability is enforced at
the database, not only in memory: `participation_snapshots` has SELECT and INSERT policies only,
so UPDATE and DELETE are rejected after persistence, reload, and restart. Runs reference
snapshots `ON DELETE RESTRICT`.

The single gap is SN-07. `/space/card/$specId` lists every version with a per-version link, which
is explicit selection; but `home-status.ts` exposes `latestVersion` and the home surface routes
there, and the preview page labels the newest as «البطاقة المعتمدة الحالية». Selection is therefore
explicit on one surface and implicit on another.

## 12. LEARNER FINDINGS

`/space/learner/$snapshotId` reads only the frozen `snap.frames`, sorted by `order`, one frame per
screen, previous/next, terminating in the `__done__` frame «انتهينا». Nothing else reaches the
learner: no considerations, no complexity rationale, no provenance, no management data, no
ability, mastery, progress, independence or score value — `LabCardFrame` has no field that could
carry them. The card can only write `participation_runs`.

One competing surface: `/learner/$id` (`src/routes/learner.$id.tsx` + `src/lib/learner-card.ts`)
builds a learner view directly from `04_participation_cards.csv#participation_steps` with no
snapshot and no approval. It shows only steps and images (so it does not leak prohibited fields),
but it violates the "approved snapshot only" origin rule — hence LC-01 PARTIAL-DRIFT.

## 13. RUN / FEEDBACK FINDINGS

A Run is one occurrence: a UUID minted per learner opening, guarded against duplicate insert,
carrying `started_at`/`ended_at` only — no attempt, trial, or score column. `run.start` explicitly
resolves the existing family participation and never creates one, so repeated use never multiplies
parents. Every run references its approved snapshot. Feedback attaches to the exact run through
`participation_feedback.run_id`, is optional, uses three non-ordinal tones
(`comfortable` / `usual` / `difficult_today`) plus free reasons, is never aggregated, and nothing
is inferred from it.

Recurrence UI is neutral: «شاركنا {n} مرة — آخر مرة: {date}», under a heading that states
«تكرار وسجل فقط — بلا إتقان ولا نسب ولا تقدّم». Open runs are shown separately and not counted.
No streak, dose, or progression reading exists in Production. (The «شاركنا فيها N مرات» string in
`src/routes/lab.participations.tsx` is Lab-only.)

## 14. LIFECYCLE FINDINGS

Card closure (`participation_card_states.closed`) and participation closure
(`active_participations.status` + `closed_at`) are separate, reversible operations. Closing a card
preserves its runs and parent; closing a participation moves it to a history view while keeping
cards, snapshots, runs and feedback. No closure path deletes anything — all closure writes are
updates, snapshots have no delete policy, and runs are `ON DELETE RESTRICT`. Copy is explicitly
non-punitive: «إغلاق البطاقة أو المشاركة لا يحذف شيئاً», «إغلاق بطاقة يخصّ هذه البطاقة فقط، ولا يعني
أن المشاركة كلها انتهت».

## 15. RE-AUDIT OF KNOWN LINEAGE RISKS

**LIN-01 — Production imports modules physically under `src/lab/**`**
- CURRENT STATUS: STILL PRESENT
- EVIDENCE: `src/features/space/**` and `src/routes/_authenticated/**` import `@/lab/slice/types`,
  `@/lab/components/lab-ui`, `@/lab/components/StepFrame`,
  `@/lab/components/space/{FamilyComposer,FrameEditor,WorkspaceSteps,SpaceDrawer}`,
  `@/lab/data/space/{catalog,considerations,coverage}`.
- PRODUCTION IMPACT: none behavioural — these are types, presentational UI, and a read-only
  catalog. No provider, no sessionStorage.
- CONTRACT IDS AFFECTED: none directly; auditability of EN-05 and IM-02 is harder to assert.
- BLOCKS FUTURE IMPLEMENTATION: NO

**LIN-02 — `catalog.ts` merges Lab fixtures into Production specs**
- CURRENT STATUS: STILL PRESENT
- EVIDENCE: `FIXTURE_EVENT_MAP = { BREAKFAST: "FOOD-001", LAUNDRY: "CLO-011", SHOPPING: "SHOP-004" }`
  in `src/lab/data/space/catalog.ts`; `participationsForEvent()` returns fixture specs before
  library specs for those three events.
- PRODUCTION IMPACT: for three events, block detail reaching the workspace can originate from
  fixtures rather than the Master corpus, and those fixture specs carry `level` values not derived
  from `participation_level`.
- CONTRACT IDS AFFECTED: FP-11, CX-04, IM-01 (auditability of "reference-derived" content), FA-02.
- BLOCKS FUTURE IMPLEMENTATION: YES — any Golden corpus work must first establish a single
  provenance for spec content.

**LIN-03 — `/lab` routes publicly routable**
- CURRENT STATUS: STILL PRESENT
- EVIDENCE: 33 `src/routes/lab*.tsx` files in `src/routeTree.gen.ts`; `src/routes/lab.tsx` mounts
  `LabStateProvider` (sessionStorage key `dalili-lab-v1`).
- PRODUCTION IMPACT: none on Production data — Lab writes only to sessionStorage. But
  `src/routes/lab.slice.*.tsx` wrappers render the *same* Production page components against a Lab
  provider, so Production journey behaviour is reachable under a non-production state model.
- CONTRACT IDS AFFECTED: EN-05, IM-02 (auditability only).
- BLOCKS FUTURE IMPLEMENTATION: NO

## 16. FROZEN AMBIGUITIES

**AMBIGUITY A — Preferred Context ownership**
- CURRENT PRODUCTION BEHAVIOUR: Preferred Context does not exist in any form — not in the reference
  corpus (no column in `01_*`..`04_*`), not in family state (no column, no field in
  `LabThisTimeSelection`), and not in any UI. Production has therefore taken no position.
- CONTRACT IDS: EB-01, EB-02, FA-01, EN-01.
- DOES PRODUCTION FORCE DECISION NOW: NO — nothing existing depends on the answer.
- RECOMMENDATION: decide before Easy Beginning is designed, not before structural foundations. The
  cheapest position that satisfies both readings is family-owned Preferred Context stored in family
  state, with an optional immutable reference-supplied suggestion list; that keeps IM-01 intact and
  lets Easy Beginning start from a family-described liked context on day one.

**AMBIGUITY B — Snapshot version selection**
- CURRENT PRODUCTION BEHAVIOUR: mixed. `/space/card/$specId` requires an explicit per-version choice;
  `home-status.ts` surfaces `latestVersion` and the home route follows it implicitly; the preview
  page frames the newest version as «البطاقة المعتمدة الحالية».
- CONTRACT IDS: SN-07 (PARTIAL-DRIFT), LC-01.
- DECISION/CHANGE REQUIRED: implementation change, not a framework decision. The contract already
  fixes the behaviour; Production only needs the implicit surfaces to carry an explicit selection
  (or an explicitly labelled default).

**AMBIGUITY C — Support types**
- CURRENT PRODUCTION TYPES: `communication`, `time`, `schedule` (asset types) and
  `visual-schedule`, `now-next`, `timer`, `choice-board`, `tell-before`, `picture-list`, `builder`
  (tools). Both lists are closed in code.
- CONTRACT IDS: SU-02 (DECISION-REQUIRED), SU-04.
- DOES PRODUCTION FORCE DECISION NOW: YES — the two closed sets do not match, so any support work
  must first say which set is canonical and whether the set is permanently closed.
- RECOMMENDATION: treat the contract's five categories as the canonical *declared type* dimension
  and keep the current tools as instances underneath it, so `stop/break` and `contextual aid` become
  addable without reopening the contract. Do not modify the frozen contract.

## 17. CONTENT AND DATA SAFETY

- MASTER CONTENT MUTATED: NO — the four CSV files under `src/data/knowledge/` were read only; the
  stored PRE-GOLDEN baseline was not regenerated or overwritten.
- PRODUCTION DATA MUTATED: NO — no query other than read-only source inspection was executed; no
  Cloud write was issued.
- PRODUCTION CODE MUTATED: NO — the only files created are the three audit artifacts in
  `docs/audit/`.

## 18. FINAL COUNTS

ALIGNED 50 · PARTIAL-DRIFT 11 · MISSING 14 · STRUCTURAL-CONFLICT 6 · DECISION-REQUIRED 1 · TOTAL 82.
Matrix integrity: PASS.

DALILI PRODUCTION GAP ANALYSIS 01 = PASS
(audit completeness only — this is not a statement of framework compliance)

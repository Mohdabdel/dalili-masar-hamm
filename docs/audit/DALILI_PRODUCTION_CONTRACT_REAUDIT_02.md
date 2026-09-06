# DALILI PRODUCTION CONTRACT RE-AUDIT 02 — POST-FOUNDATION 01–08

MODE: STRICT READ-ONLY AUDIT.
No implementation, no fixes, no schema/data/master mutation, no test-data cleanup, no content migration was performed in this pass.

- Contract: `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
- SHA-256: `693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc`
- Requirements parsed: **82** — FP 12, CX 9, EN 6, EB 5, FA 6, WS 8, SU 4, SN 7, LC 6, RN 5, FB 4, LY 5, IM 5
- **CONTRACT INTEGRITY: PASS** (82/82 present and parsed; no requirement invented, none dropped)
- Statuses recalculated from zero. No prior label was carried forward.
- Companion artifacts: `DALILI_PRODUCTION_CONTRACT_MATRIX_02.md`, `DALILI_PRODUCTION_MIGRATION_READINESS_01.md`

---

## 1. SUMMARY COUNTS

| Status | Count |
|---|---|
| ALIGNED | 70 |
| PARTIAL-DRIFT | 12 |
| MISSING | 0 |
| STRUCTURAL-CONFLICT | 0 |
| DECISION-REQUIRED | 0 |
| **Total** | **82** |

### Delta vs GAP ANALYSIS 01

| Status | GAP 01 | RE-AUDIT 02 | Δ |
|---|---|---|---|
| ALIGNED | 50 | 70 | +20 |
| PARTIAL-DRIFT | 11 | 12 | +1 |
| MISSING | 14 | 0 | −14 |
| STRUCTURAL-CONFLICT | 6 | 0 | −6 |
| DECISION-REQUIRED | 1 | 0 | −1 |

Interpretation: Foundations 01–08 removed every MISSING and every STRUCTURAL-CONFLICT item. The remaining 12 items are drift, not architectural conflict — the compliant structure exists in all 12 cases and the gap is either legacy surface presentation, unpersisted identity fields, an open registry, or a nullable column.

---

## 2. FP AND COMPLEXITY

**FP validity is real and enforced.** `src/lib/framework/fp-validity.ts:10-17` declares exactly seven gate ids `FP-02..FP-08`; `evaluateFunctionalParticipation` returns a per-gate result and `isUsableFunctionalParticipation` (`:285-289`) is the single usability predicate. Enforcement points: `reference-registry.ts:19-32` throws on an invalid record, `easy-beginning-corpus.ts:164-169` drops invalid seeds, `family-spec.ts:89` validates family-authored input before a spec is created.

- **FP-07 (no performance/ability/assistance language):** the *rejection* mechanism exists and is tested (`PERFORMANCE_TERMS`, `TRAINING_OBJECTIVE_TERMS`, `fp-validity.test.ts` CASE E). The drift is presentational: the legacy browse surface still renders `participation_levels` («موجهة» / «مستقلة جزئياً» / «مستقلة») and `progressIndicators` at `ParticipationCard.tsx:368-388`, reachable from Home via `/activities/browse` (`src/routes/index.tsx:96`) and `/active-participations` (`:387`). This is now **PARTIAL-DRIFT**, not STRUCTURAL-CONFLICT, because a compliant model coexists and the ladder is confined to legacy master projection.
- **FP-12 (no ability/training-objective field):** identical structure — the compliant FP record (`reference-model.ts:58-79`) has no such field; the legacy card model (`home-hierarchy.ts:52,119`) still carries one.
- **Legacy vs framework boundary:** the type distinction exists (`reference-model.ts:6,82-103` `legacy_master` vs `framework_reference`, `asLegacyReference` at `reference-registry.ts:63-83`) but `knowledge-base.ts` — the module every legacy route reads — does not consume it, and the boundary is not visible to a family.
- **Scale:** 5 compliant seeds (`easy-beginning-corpus.ts:18-149`) vs 1413 legacy opportunities / 1139 cards in `src/data/knowledge/*.csv`. **This is a corpus gap, not an architecture gap.**

**Complexity** is a first-class authored dimension (`FrameworkComplexity`, `reference-model.ts:11-31`) with C1–C4, Simple/Moderate/Advanced, and a rationale. It is never computed: `fp-validity.test.ts` asserts complexity is byte-identical after doubling execution blocks (CX-05), after flipping mode to shared (CX-08), and Foundation 08 asserts it after adding/removing support (CX-06); runs write only `participation_runs` (CX-07). The two drifts are that family-authored specs carry a level without C1–C4 dimensions (`family-spec.ts:116-129` hardcodes `moderate`), and that legacy CSV still classifies on three different dimensions.

---

## 3. ENTRY ARCHITECTURE AND EASY BEGINNING

Exactly three entry strategies are declared and live (`src/routes/index.tsx:67-91`). Discovery exposes both required lenses (`ExplorePage.tsx:20,33-37`). Routine Station purity holds in behaviour: no application code writes `status` or `completed_at` (`family-routine.ts`), the auto-completion trigger is dropped, and live DB shows 0 stations with `status='completed'` and 0 with `completed_at`. The residual EN-03 drift is that `part_of_day` is an actively written time-of-day field and the two neutralised columns remain in the schema.

Easy Beginning asks only what the person likes and returns to. It collects no readiness, ability, diagnostic or learner-level input, assigns no level to a person, and does not force Simple complexity. Its only real limitation is corpus size, not model correctness.

---

## 4. FAMILY PARTICIPATION IDENTITY

`active_participations.id` is the canonical identity; `origin ∈ reference | easy_beginning | family_free` is recorded on the row, and all three origins pass through the single constructor `buildFamilyParticipationRow` (`family-participation.ts:60-83`), which **throws** if a non-reference origin carries a reference id. Live data confirms all three origins exist and flow through the identical downstream. The `specId` string is a compatibility handle for the draft/workspace key (`spec-resolution.ts:8-14`), not an identity.

The one drift (FA-04) is that the FP identity block validated at entry — `functional_intent`, `observable_effect`, `natural_completion`, `participation_mode`, complexity rationale — is not persisted onto the family participation. It is checked and discarded. Migration will produce content that carries these fields; the receiving structure must exist first.

---

## 5. WORKSPACE, SUPPORT, SNAPSHOT, LEARNER CARD

**Workspace: 8/8 ALIGNED.** One workspace for all origins; add/remove/reword/reorder; explicit start and end blocks; `familyText` fully separate from immutable `sourceText` with a restore action guarded so family-authored blocks never fabricate a reference phrase; independent per-block text and image visibility; optional family title; participation image structurally distinct from Optional Support.

**Support: 3/4 ALIGNED.** Optional, contextual, frozen with a resolved `categoryId`, and never recorded as a prompt or assistance level. SU-02 is PARTIAL-DRIFT: the registry (`src/lib/support/taxonomy.ts:36-104`) declares 4 categories and is intentionally open, while the contract names a fixed five-member set; timer, stop/break and contextual aid are not declared.

**Snapshot: 7/7 ALIGNED.** Approval inserts a new version; `nextVersion()` resolves from the database with conflict retry; the live participation `10bf7c3e-6f45-4e3b-82d4-699f177656b8` holds contiguous v1..v7 with v5 still lacking a support `categoryId` after v6/v7 were approved — proving prior versions are untouched. Immutability is enforced at the database: `participation_snapshots` has only `insert_own` and `select_own` policies; no UPDATE or DELETE policy exists for `authenticated`.

**Learner Card: 6/6 ALIGNED.** Built only from an explicitly selected approved snapshot (`learner-resolution.ts:28-52` returns `missing-selection` rather than falling back to latest), renders frozen frames only, excludes rationale/considerations/provenance/ability/mastery/progress, and writes nothing back to the snapshot.

### Legacy support-layer classification

| Module | Classification | Basis |
|---|---|---|
| `src/lib/execution-support.ts` | **ACTIVE PRODUCTION SEMANTIC DRIFT** | `SupportDuringExecution.tsx:7` → `ParticipationCard.tsx:22,326-335` → live `/active-participations` and `/activities/browse` |
| `src/lib/support-decisions.ts` (CSV 13) | **ACTIVE PRODUCTION SEMANTIC DRIFT** | `ParticipationCard.tsx:25,128,337-351`, same live routes |
| `src/lib/visual-support-map.ts` | **ACTIVE PRODUCTION SEMANTIC DRIFT** | `VisualSupportAid.tsx:7` → `SupportDuringExecution` → same live routes |
| `src/lib/learner-card.ts` | **DEAD / UNREACHABLE LEGACY** | referenced only from Lab-side modules; no production import path |
| `LabVisualStatus` | **LAB-ONLY LINEAGE DEBT** | defined and consumed inside `src/lab/**` only |

All three "active drift" modules render text; none of them **records** anything, so SU-03 remains ALIGNED. The drift is what a family reads, not what the system stores.

---

## 6. RUN, FEEDBACK, LIFECYCLE, IMMUTABILITY

**Run: 5/5 ALIGNED.** Each occurrence is its own `participation_runs` row with a client-generated id and an exact `snapshot_id`; `run.start` explicitly never creates a new `active_participations` row (`production-store.tsx:419-448`, idempotency guard `Refs.startedRuns`); `run.end` sets `ended_at` on exactly one run (`:450-458`). Recurrence is shown as a plain count of completed runs (`CardsPage.tsx:212-219`) with no streak, percentage or trend computed anywhere in `src`. No attempt/trial/training vocabulary exists in the run path.

**Feedback: 3/4 ALIGNED.** Optional (dispatched only when a tone is chosen), non-evaluative tones, explicit copy «لا تقييم ولا درجات ولا نِسَب» and «صعوبة اليوم تخص الظرف، لا الشخص», never aggregated (rows are read back flat; no group/average/reduce over tones exists). FB-01 is PARTIAL-DRIFT only because `run_id` is nullable and 2 of 13 live rows predate the fix.

**Lifecycle: 4/5 ALIGNED.** Card closure and participation closure are two separate, reversible dispatches touching two different tables, with explicit "nothing is deleted" copy. LY-03 is PARTIAL-DRIFT because the Home summary (`src/features/space/home-status.ts:71-97`) reads drafts and latest snapshots without consulting `active_participations.status`, so a closed participation still surfaces as a live approved item.

**Immutability: 4/5 ALIGNED.** Reference knowledge has no write path; family state is fully separated into Supabase; the approved snapshot is protected at the database layer, not in memory. IM-05 is PARTIAL-DRIFT because the legacy reference projection still carries a `levels` ladder and `progressIndicators` into live UI state, and `routine_stations.status`/`completed_at` persist as dead columns.

---

## 7. LINEAGE (LIN-01 / LIN-02 / LIN-03) — separate from the 82

| ID | Subject | Status | Evidence |
|---|---|---|---|
| LIN-01 | Production code physically imports from `src/lab/**` | **ACTIVE — NON-BLOCKING** | ~30 imports from `src/features/space/**` and `src/lib/**` into `@/lab/slice/types` (pure types), `@/lab/components/lab-ui`, `@/lab/components/StepFrame`, `@/lab/components/space/FamilyComposer`, `@/lab/data/space/catalog`. All verified stateless: none calls `useLab()` or touches `sessionStorage`; `LabStateBoundary` (the one stateful export of `lab-ui.tsx:179-188`) is imported by zero production pages |
| LIN-02 | Provenance path correction in `catalog.ts` | **RESOLVED** | Corrected in Foundation 01; `src/lab/data/space/catalog.ts:1-2` declares itself a read-only layer |
| LIN-03 | The `/lab*` route tree is still registered | **ACTIVE — NON-BLOCKING** | 29 `src/routes/lab*` files; `src/routes/lab.tsx:2-3` mounts `LabStateProvider` (sessionStorage-backed); 76 `lab.` entries in `src/routeTree.gen.ts`. Lab state is fully isolated from production Supabase state — no shared store, no shared table |

Lineage debt is *location*, not *contamination*: the shared modules are pure, and the stateful Lab tree is parallel and isolated. It is a rename/relocate task, not a correctness risk.

---

## 8. LEGACY MASTER BOUNDARY

**Question: can the legacy master stay immutable while compliant reference content coexists?**

**Answer: YES — the boundary already exists in the type system and is exercised.**

- `reference-model.ts:6,82-103` distinguishes `legacy_master` from `framework_reference` as `ReferenceProvenance`.
- `reference-registry.ts:63-83` `asLegacyReference` wraps a legacy row **without** gate evaluation, so a legacy row never has to claim FP validity, and never has to be edited to coexist.
- `registerFrameworkParticipation` throws on invalid content, so a compliant row can never enter the registry by accident.
- Family participations reference their origin by id only (`reference_spec_id`, `reference_source`), so both provenances feed the identical downstream without a schema branch.

Two coexistence conditions are **not yet met** and are the substance of the FP-01/FP-07/FP-12 drift:

1. `knowledge-base.ts` — the module every legacy route reads — does not consume `ReferenceProvenance`, so legacy rows are served with no provenance marker.
2. The legacy surface presents ladder/indicator vocabulary that a compliant surface must not present, with nothing telling a family which they are looking at.

Neither condition requires mutating the legacy master. Both are resolved by a read-side boundary.

---

## 9. LIVE ENTRY EVIDENCE (J1–J4)

Authenticated session restored (`LOVABLE_BROWSER_AUTH_STATUS=injected`), viewport 1334×828, `http://localhost:8080`.

| Path | Result |
|---|---|
| Home `/` | 200 — all three entry labels present: «بداية سهلة», «أخطط المشاركة بنفسي», «استكشف المشاركات الممكنة» |
| J1 — `/space/easy` | 200 — asks «ما الشيء الذي يحبه ويعود إليه؟» with liked contexts + free text; footer «لا نسأل هنا عمّا يستطيعه»; no readiness/ability/level input rendered |
| J2 — `/space/plan` | 200 — family-authored entry reachable, no reference required |
| J3 — `/space/explore` | 200 — both Event lens and Routine Station lens present |
| J4 — `/my-routine` | 200 — station view renders; no completion control |
| Retired learner route `/learner/KB-CLO-001-OP001` | 200 → redirects to `/space/workspace/KB-CLO-001-OP001` (no CSV bypass into a learner surface) |
| Legacy browse `/activities/browse` | 200 — renders legacy cards including the ladder text (FP-07 drift, observed live) |
| `/active-participations` | 200 — renders legacy support layers (`execution-support`, CSV 13, `visual-support-map`) |

No 401 / 403 / 500 observed on any checked route. Persisted origins observed in live data: `reference` 13, `easy_beginning` 1, `family_free` 1.

---

## 10. TEST DATA IDENTIFICATION (identified only — NOT cleaned)

| Table | Rows | Test-data characterisation |
|---|---|---|
| `active_participations` | 15 | All rows belong to the single audit family account. `status`: active 10, closed 4, completed 1. The lone `completed` row predates Foundation 04 (routine-station purity) and is legacy state |
| `participation_snapshots` | 29 | Includes the v1..v7 stress series on `10bf7c3e-6f45-4e3b-82d4-699f177656b8` created by Foundation 05–08 version-isolation tests |
| `participation_runs` | 20 ended | Includes runs created by Foundation acceptance gates |
| `participation_feedback` | 13 | 11 carry `run_id`; **2 pre-fix rows carry none** (the FB-01 evidence) |
| `family_support_assets` | 7 | 6 pre-Foundation-08 (no `config.kind`), 1 created during Foundation 08 |
| `routine_stations` | — | 0 rows with `status='completed'`, 0 with `completed_at` |

No row was inserted, updated or deleted by this audit.

Artefact note: `docs/audit/DALILI_PRODUCTION_CONTRACT_MATRIX_01.md` is absent/empty, and no `DALILI_COMPOSITION_COMPLETENESS_01.md` exists — the composition-completeness evidence lives as an executable test (`src/features/space/__tests__/composition-completeness.test.ts`) rather than a document.

---

## 11. NON-ALIGNED ITEMS GROUPED

### A. ARCHITECTURAL
- **FA-04** — the validated FP identity block (`functional_intent`, `observable_effect`, `natural_completion`, `participation_mode`, complexity rationale) is checked at entry then discarded; no column receives it.
- **CX-02** — family-authored specs carry a complexity level with no C1–C4 dimensions.

### B. PRODUCT UX
- **FP-07 / FP-12 / IM-05** — the legacy ladder («موجهة»/«مستقلة جزئياً»/«مستقلة») and `progressIndicators` are rendered on live family-facing routes.
- **LY-03** — the Home summary does not distinguish a closed participation from a live one.
- **EN-03** — `part_of_day` is a time-of-day field on the Routine Station; the two neutralised columns remain visible in the schema.

### C. CONTENT / CORPUS
- **FP-01** — 1413 legacy rows served with no gate evaluation and no provenance marker.
- **FP-10** — ~50 legacy opportunities named identically to their parent event.
- **EB-02** — compliant corpus is 5 seeds.
- **CX-01** — complexity exists on legacy rows with no validity concept behind it.

### D. LEGACY COMPATIBILITY
- `execution-support.ts`, `support-decisions.ts` (CSV 13), `visual-support-map.ts` — active production semantic drift on legacy routes.
- `learner-card.ts` — dead/unreachable legacy.
- **FB-01** — nullable `run_id` retained for 2 historical rows.

### E. LINEAGE
- **LIN-01** — pure production modules still located under `src/lab/**`.
- **LIN-03** — `/lab*` routes still registered in the generated route tree.
- `LabVisualStatus` — Lab-only lineage debt.

### F. GOVERNANCE DECISION
- **SU-02** — is the support category set fixed (contract's five) or an open registry (current implementation)? Implementation deliberately chose open; the contract says fixed. This needs a recorded decision, not a code fix.
- Whether legacy master rows are permanently frozen-and-labelled, or progressively superseded by compliant rows carrying the same subject.

---

## 12. STATEMENT OF SCOPE

This audit evaluated structural and semantic alignment against the 82-requirement contract. It does **not** declare the product ready, complete, or content-complete. Corpus coverage (5 compliant FPs vs 1413 legacy rows) is by itself sufficient reason not to make any such claim.

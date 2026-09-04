# DALILI PRODUCTION FOUNDATION DECISIONS — 01

MODE: DECISION RECORD ONLY. No implementation, no migration, no Production code changes,
no Master content changes, no database schema changes were performed by this task.

- generated_at: 2026-09-04 (UTC)
- inputs:
  - `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md` (frozen, hash-verified)
  - `docs/audit/DALILI_PRODUCTION_GAP_ANALYSIS_01.md`
  - `docs/audit/DALILI_PRODUCTION_CONTRACT_MATRIX_01.md`
  - `docs/audit/DALILI_PRODUCTION_GAP_DEPENDENCIES_01.md`
  - `docs/audit/DALILI_PRODUCTION_SOURCE_OF_TRUTH_MANIFEST_01.md`
  - `docs/audit/DALILI_PRODUCTION_LINEAGE_AUDIT_01.md`

Purpose: close the Level-0 decisions identified by `DALILI_PRODUCTION_GAP_DEPENDENCIES_01.md`
as prerequisites for Production architecture work. This document records decisions and their
exact Production consequences. It does not redesign the validated framework and does not
create implementation tasks.

---

## D01 — PREFERRED CONTEXT OWNERSHIP

DECISION:
Preferred Context is a concept whose provenance determines ownership. Two ownership modes are
adopted:

- (A) FAMILY-OWNED: created/described by the family, especially through Easy Beginning.
- (B) REFERENCE-SUGGESTED: an immutable reference suggestion/example that a family may select.
  Selecting a reference suggestion must not mutate the reference record; family-specific
  wording/state derived from a selection remains separate family state.

Preferred Context is NOT required to exist in the legacy Master corpus.

RATIONALE:
- The contract requires Easy Beginning to start "from a context the person likes, enjoys,
  requests, seeks, or meaningfully engages with" (EB-01) and to allow expanding that context
  into its moments (EB-02). This must be satisfiable from a family-described context alone —
  families cannot be forced to find their loved context in a reference catalogue.
- Reference-suggested contexts are valid starting points for families who prefer to browse,
  but any write to the reference record would violate IM-01 (reference immutability) and
  FA-02/IM-03 (family customization never alters reference content).
- Gap Analysis §16 (Ambiguity A) confirmed Production has taken no position and nothing
  existing depends on the answer; this decision resolves the ambiguity exactly as recommended:
  family-owned by default, with optional immutable reference suggestions.

CONTRACT IDS AFFECTED:
EB-01, EB-02 (entry semantics), FA-01 (origin provenance), EN-01 (Easy Beginning entry),
FA-02 / IM-01 / IM-03 (selection never mutates the reference).

CURRENT PRODUCTION CONFLICT:
None. Preferred Context does not exist in any form today — no column in `01_*`..`04_*` CSVs,
no field in `LabThisTimeSelection`, no Cloud table, no UI. Production is neutral, so this
decision contradicts no existing behaviour.

FUTURE REQUIRED INVARIANT:
Every Preferred Context carries a provenance tag: `family` or `reference`. A
reference-suggested context stores an immutable reference identity plus an independent family
selection/adoption record; the family record may carry family wording and state, and writes
never reach the reference record. Family-owned contexts are valid with no reference link at
all.

MINIMUM ARCHITECTURAL CONSEQUENCE:
- A future Preferred Context record needs, at minimum: its own identity, a provenance
  discriminator (`family` | `reference`), an optional immutable reference pointer (provenance
  only, never a write target), and family-state fields kept in family storage.
- Because legacy Master (IM-01) is immutable, reference-suggested contexts cannot be added to
  the existing CSV corpus; they belong to the future framework-compliant Reference Knowledge
  representation (D02) or remain family-authored until then.

DEPENDENCIES:
Feeds Cluster 5 (Easy Beginning). Does not gate Level-1 structural foundations. No dependency
on D02 unless reference-suggested contexts are introduced.

IMPLEMENTATION NOW: NO

---

## D02 — VALIDATED REFERENCE KNOWLEDGE

DECISION:
- The existing 1413 legacy Opportunities are NOT retrofitted in place.
- Legacy Master content is NOT mutated to make it satisfy the frozen framework.
- Production must eventually support a framework-compliant Reference Knowledge representation
  capable of expressing: Event; Preferred Context where reference-suggested; Functional
  Participation with `functional_intent`, `observable_effect`, `natural_completion`,
  `participation_mode`; the four complexity dimensions (C1 Elements, C2 Coordination,
  C3 Variability, C4 Choice/Uncertainty); complexity level; and provenance.
- Legacy Master remains preserved until controlled migration. Migration happens AFTER
  structural foundations are stable.

RATIONALE:
- Gap Analysis §3/§4/§5 classified FP-07, FP-12 and IM-05 (reference half) as
  STRUCTURAL-CONFLICT: the corpus itself carries prohibited content (631/1139 independence
  rows, 39 training-objective rows, an assistance ladder, performance indicators), and CX-02
  as STRUCTURAL-CONFLICT (three stored dimensions instead of four, C1 absent, C3/C4 merged).
- Under IM-01 the Master corpus is immutable; therefore in-place repair is contractually
  impossible, and the only compliant route is a separate validated corpus plus a presentation
  boundary (Gap Dependencies Cluster 2, CONTENT RISK: CRITICAL).
- Gap Dependencies Level 5 places content migration last: migrating 1413 opportunities and
  1139 cards against an identity model that is still changing would strand live family data.

CONTRACT IDS AFFECTED:
FP-01..FP-12 (validity model and gate facts), CX-01, CX-02, CX-08, FP-07, FP-12, IM-01,
IM-05 (reference half), IM-02, FA-02.

CURRENT PRODUCTION CONFLICT:
Legacy Master (CSV `01_domains`..`04_participation_cards`, 564 events / 1413 opportunities /
1139 cards) is the only reference source; every resolver (`getSpaceSpec`, `findOpportunityById`,
`src/lab/data/space/catalog.ts`) reads it. It cannot express the seven gate facts, participation
mode, or the fourth complexity dimension, and it carries prohibited content.

FUTURE REQUIRED INVARIANT:
- Legacy Master is read-only and remains byte-preserved under the PRE-GOLDEN baseline until
  controlled migration.
- Framework-compliant Reference Knowledge is a separate authoritative source; no write path
  from either source into the other except an explicit, audited migration step that reads
  legacy and writes the compliant representation (never the reverse).
- Every framework-compliant record carries provenance to its legacy source (or to none, for
  net-new content) so POST-GOLDEN comparison remains attributable.
- Validation (the seven FP gates) applies to the compliant representation at authoring time,
  before publication; the legacy corpus is never presented as gate-validated.

MINIMUM ARCHITECTURAL CONSEQUENCE:
The minimum boundary between LEGACY MASTER and FRAMEWORK-COMPLIANT REFERENCE KNOWLEDGE is a
single-source resolver boundary: downstream code resolves reference content through one
abstraction that declares which corpus answered (provenance), so that legacy rows and
validated rows are never silently mixed on one surface. Concretely this future boundary must
guarantee:
1. Legacy corpus stays immutable and addressable by its current IDs (KB linkage keeps working
   until migration).
2. The compliant corpus is independently addressable, gate-validated, and carries provenance.
3. Resolution rules are explicit and auditable (no fixture-style shadowing — see D08/LIN-02).
No storage model or schema is created in this task.

DEPENDENCIES:
MUST PRECEDE: Cluster 2 (semantic boundaries), Cluster 3 (complexity re-dimensioning),
Cluster 8 (content migration). DEPENDS ON: Cluster 1 (FP validity model — D02 needs a valid
target shape), Cluster 4 (family identity must not be welded to legacy IDs before migration),
D08 (single provenance resolved first). Sequenced as Level 5 — content migration last.

IMPLEMENTATION NOW: NO

---

## D03 — SUPPORT TAXONOMY

DECISION:
Support carries a declared semantic category dimension, structured as:

Support Category → Support Instance / Tool / Asset

- The categories validated by the reference implementation (communication, visual sequence,
  timer, stop/break, contextual aid) are authoritative validation examples, NOT a permanently
  closed universe of all future supports.
- A category has a stable semantic identity.
- Support remains optional (SU-01), contextual, distinct from Participation Image (WS-08),
  and never affects Complexity (CX-06).
- Adding a future approved category must not require redefining Functional Participation.
- Current Production support tools/types will later be mapped onto this model; they are not
  discarded solely because their labels differ.
- The frozen 82 requirements are unchanged.

RATIONALE:
- Gap Analysis §10/§16 (Ambiguity C) found two closed Production sets
  (`SPACE_SUPPORT_ASSET_TYPES` = communication/time/schedule; `SPACE_SUPPORT_TOOLS` =
  visual-schedule/now-next/timer/choice-board/tell-before/picture-list/builder) that overlap
  the contract set but are not the same set — `stop/break` and `contextual aid` have no
  Production counterpart. This made SU-02 DECISION-REQUIRED.
- Treating the contract's categories as the canonical *declared type* dimension, with existing
  tools as instances beneath it, matches the Ambiguity C recommendation: `stop/break` and
  `contextual aid` become addable without reopening the contract, and existing frozen support
  assets keep their stored type (CONTENT RISK: LOW).

CONTRACT IDS AFFECTED:
SU-02 (closed by this decision), SU-01, SU-03, SU-04, CX-06, WS-08, FP-12 (support must not
become an ability/training vehicle).

CURRENT PRODUCTION CONFLICT:
Both Production sets are closed in code and do not match the contract set; there is no
category/instance separation — "type" and "tool" are two parallel closed enums with no
shared taxonomy.

FUTURE REQUIRED INVARIANT:
Every support asset has exactly one declared category with a stable semantic identity; the
category set is extensible by an approved addition process only; categories are metadata on
support records and are never referenced by participation validity, complexity, or learner
output; a category addition changes no existing Functional Participation, no frozen snapshot,
and no stored asset (existing assets keep their mapped type).

MINIMUM ARCHITECTURAL CONSEQUENCE:
One added dimension (declared category) above the existing tool/asset model — additive, not a
replacement. A one-time mapping table from current Production types/tools to categories is
required when this is implemented; frozen snapshots retain their stored support type verbatim.

DEPENDENCIES:
Depends only on this decision (Cluster 9 CAN FOLLOW: the decision). Gates any new support
category work. Independent of D02/D04.

IMPLEMENTATION NOW: NO

---

## D04 — FAMILY PARTICIPATION IDENTITY

DECISION:
- A Family Participation must NOT require a Master Opportunity ID. It has its own independent
  identity.
- It may optionally carry provenance to a source.
- Origin semantics must support at least: `reference`, `easy_beginning`, `family_free`.
  - reference: may point to a framework-compliant reference participation (provenance only).
  - easy_beginning: may point to family/reference Preferred Context and to selected Functional
    Participation provenance where applicable.
  - family_free: must be valid with NO Master/reference participation ID.
- All origins converge into the SAME downstream Family Participation architecture.
- `specId = KB-<opportunity_id>` is a legacy/reference linkage convention, not the universal
  identity of Family Participation.

RATIONALE:
- Gap Analysis §8 / FA-03 classified the current model as STRUCTURAL-CONFLICT: identity is
  welded to a CSV row, family-free participation is impossible without a fake KB id, and
  identity fields are re-derived from the reference at render (FA-04 PARTIAL-DRIFT).
- EN-01 requires three entry strategies and EB-01..EB-05 require Easy Beginning; both are
  unrepresentable while every participation requires a Master row.
- EN-04/EN-05 require one record shape and one downstream architecture regardless of entry,
  so the new identity must serve all origins uniformly.

CONTRACT IDS AFFECTED:
FA-01, FA-03, FA-04, EN-01, EN-04, EN-05, EB-01..EB-05 (entry feasibility), FA-02
(provenance is never a write), FA-05 (attachments key off the participation, not the reference).

CURRENT PRODUCTION CONFLICT:
`ensureParticipation()` writes `source: "family_workspace"` (constant); identity is
`specId = KB-<opportunity_id>` (`src/features/space/participation-link.ts`); every downstream
page resolves content via `getSpaceSpec(specId)` → `findOpportunityById()`; a spec with no CSV
row renders «هذه المشاركة غير متاحة». Identity is referenced by drafts, snapshots, runs, card
states, station links and support assets (ARCHITECTURAL RISK: CRITICAL — live family data).

FUTURE REQUIRED INVARIANT (minimum future identity/provenance contract):
1. Every Family Participation carries its own stable ID, issued independently of any reference.
2. It stores an `origin` value from at least {`reference`, `easy_beginning`, `family_free`}
   at creation; the value is never rewritten by later composition edits.
3. Provenance is a separate optional pointer (reference participation, preferred context) —
   stored as provenance only; nothing downstream writes through it (FA-02).
4. Identity fields (title, life context, intent, effect, natural completion, mode, complexity
   and rationale) are COPIED at creation and are never re-derived from later reference or
   composition edits (FA-04).
5. All downstream entities (draft, considerations, supports, snapshots, runs, feedback, card
   states, station links) key off the Family Participation's own ID, with no reference lookup
   required for the participation to exist, render, or close.
6. `KB-<opportunity_id>` rows remain readable as legacy reference-origin participations until
   controlled migration; the convention ceases to be the identity mechanism.

MINIMUM ARCHITECTURAL CONSEQUENCE:
An identity inversion: the participation becomes the root of its own subgraph, and reference
lookup becomes a provenance enrichment instead of an existence condition. This touches live
family data and therefore MUST land before entry re-architecture (Cluster 5) and content
migration (Level 5); existing KB-linked participations remain valid under the new contract as
`origin = reference`.

DEPENDENCIES:
DEPENDS ON: D02 boundary decision (a family-free participation still needs a valid role
definition shape — Cluster 1). MUST PRECEDE: Cluster 5 (entries/Easy Beginning), Cluster 7
(composition completeness), and all content migration.

IMPLEMENTATION NOW: NO

---

## D05 — ROUTINE STATION PURITY

DECISION:
Routine Station is a discovery lens and must not semantically own completion, compliance,
streak, or habit-performance state. Existing fields are classified individually:

- `part_of_day`: CLASSIFIED AS descriptive discovery metadata. It expresses contextual
  time-of-day (a lens property), not a schedule, due time, or deadline. It is NOT automatically
  prohibited by EN-03. Retention is permissible under the contract provided it is never used
  to drive scheduling, due-state, or compliance behaviour.
- `status` / `completed_at`: CLASSIFIED AS completion/compliance state on the station entity.
  Verified in `src/lib/family-routine.ts`: the same module writes
  `.update({ status: "completed", completed_at: <now> })` and
  `.update({ status: "planned", completed_at: null })` — an active checklist/compliance
  write path. These two fields are the actual conflict with EN-03 and with IM-05
  (family-state half: no compliance/checklist field in application state).

RATIONALE:
- EN-03 prohibits time/schedule/due/completion/streak/compliance fields on a Routine Station;
  the prohibited concept is operating the station as a schedule/compliance system, not the
  existence of a time-of-day descriptor.
- Distinguishing the fields prevents an over-broad schema reaction against `part_of_day`
  while isolating the true conflict (`status`, `completed_at`) for later resolution.
- Gap Dependencies Cluster 6: independent of Clusters 1–5; can start at any time.

CONTRACT IDS AFFECTED:
EN-03, IM-05 (family-state half). Related: EN-02 (station lens must remain available),
LY-05 (no historical evidence is deleted by any future resolution).

CURRENT PRODUCTION CONFLICT:
`routine_stations` columns `part_of_day`, `status`, `completed_at` exist on live family data
(migration `20260821010855…`), with active write paths in `src/lib/family-routine.ts` marking
stations completed/planned — the station currently functions as a completion checklist.

FUTURE REQUIRED INVARIANT:
A Routine Station carries only discovery/context metadata (label, linked event/domain,
`part_of_day` as descriptive context, ordering). No field on the station may express
completion, due-ness, schedule enforcement, streak, or compliance. Any future participation
history belongs to Run records (RN-*) on the Family Participation, never on the station.

MINIMUM ARCHITECTURAL CONSEQUENCE:
A future schema/data decision restricted to the two conflicting columns
(`status`, `completed_at`): cease writing them as completion state and remove/neutralise the
checklist behaviour, while preserving the station rows and their links
(`participation_station_links`). No deletion of fields is decided here; the decision is
classification only.

DEPENDENCIES:
None technical (Cluster 6 independent). MUST PRECEDE: declaring Cluster 5's Routine-Station
discovery lens compliant.

IMPLEMENTATION NOW: NO

---

## D06 — LEARNER CANONICAL SURFACE

DECISION:
- A Production Learner surface representing actual participation use must derive from an
  approved frozen Snapshot (LC-01).
- A legacy learner route that bypasses approval cannot remain a competing canonical
  participation-use path.
- Future disposition of `/learner/$id`: RETIRED as a participation-use surface. Before
  retirement it should be redirected or gated; if any non-canonical purpose for it is ever
  desired (e.g. reference browsing), it must be explicitly reclassified so it cannot be
  mistaken for participation use. Retirement is the default; reclassification requires a
  separate future decision with evidence of need.

RATIONALE:
- Gap Analysis §12: the canonical flow `/space/learner/$snapshotId` reads only frozen
  `snap.frames`; the competing `/learner/$id` builds a learner view straight from
  `04_participation_cards.csv#participation_steps` with no snapshot and no approval — LC-01
  PARTIAL-DRIFT, the cheapest compliance win in the dependency set (Cluster 8).
- The legacy route does not leak prohibited fields (it shows only steps/images), so the
  conflict is canonical-origin, not content — making redirect/retire sufficient rather than
  redesign.

CONTRACT IDS AFFECTED:
LC-01. Related: SN-01/LC-02..LC-06 (already aligned on the canonical surface), EN-06
(downstream order assumes a single learner stage).

CURRENT PRODUCTION CONFLICT:
Two learner surfaces are routable simultaneously: `/space/learner/$snapshotId`
(snapshot-derived, canonical) and `/learner/$id` (CSV-derived, bypasses approval), the latter
via `src/routes/learner.$id.tsx` + `src/lib/learner-card.ts`.

FUTURE REQUIRED INVARIANT:
Exactly one participation-use learner surface exists, and every learner view of actual
participation is traceable to an explicitly selected approved snapshot version. No route may
render learner-use content from the reference corpus directly.

MINIMUM ARCHITECTURAL CONSEQUENCE:
A route-level change only: retire/redirect `/learner/$id` and remove its entry points; no data
migration, no schema change, no effect on the canonical flow (ARCHITECTURAL RISK: LOW). Any
inbound links to `/learner/$id` (e.g. from `ParticipationCard`-based surfaces) must be
enumerated at implementation time and re-pointed to the canonical entry.

DEPENDENCIES:
None — self-contained (Cluster 8: "technically startable immediately; does not gate anything
else"). Independent of D02/D04.

IMPLEMENTATION NOW: NO

---

## D07 — SNAPSHOT VERSION SELECTION

DECISION:
SN-07 is adopted exactly as frozen: learner use is associated with an explicitly selected
approved Snapshot version; no implicit "latest" rule may determine which approved content is
used. Current home behaviour that implicitly selects latest is Production drift to be
corrected later. No further framework decision is required.

RATIONALE:
- Gap Analysis §16 (Ambiguity B): the contract already fixes the behaviour; only an
  implementation change is needed. `/space/card/$specId` is explicit (per-version links);
  `home-status.ts` exposes `latestVersion` and the home surface routes to it implicitly, and
  `PreviewPage.tsx` frames the newest as «البطاقة المعتمدة الحالية» — SN-07 PARTIAL-DRIFT.

CONTRACT IDS AFFECTED:
SN-07, LC-01 (the selected version is the one the learner card derives from).

CURRENT PRODUCTION CONFLICT:
Version selection is explicit on `/space/card/$specId` and implicit (latest) on the home
surface and in preview labelling — the same underlying snapshot model, two selection rules.

FUTURE REQUIRED INVARIANT:
Every surface that leads to learner use resolves to a snapshot version the family explicitly
chose (or an explicitly declared, visibly labelled default that the family can change);
"latest" is never applied silently.

MINIMUM ARCHITECTURAL CONSEQUENCE:
Surfacing-layer change: `home-status.ts` and preview labelling gain an explicit selection
step or an explicitly labelled default rule; the snapshot/versioning storage model is already
aligned and untouched (Cluster 8, RISK: LOW).

DEPENDENCIES:
None. Independent of all other decisions; the cheapest compliance win together with D06.

IMPLEMENTATION NOW: NO

---

## D08 — LINEAGE PRIORITY

DECISION:
Reconfirmed:
- LIN-02 is a blocker before framework-compliant reference content/provenance work:
  `src/lab/data/space/catalog.ts` `FIXTURE_EVENT_MAP = { BREAKFAST: "FOOD-001",
  LAUNDRY: "CLO-011", SHOP-004: "SHOP-004" }` merges Lab fixtures ahead of library specs for
  three mapped events, so block detail and `level` reaching the workspace for FOOD-001,
  CLO-011 and SHOP-004 are not provably Master-derived.
- LIN-01 (Production importing pure UI/type/catalog modules physically under `src/lab/**`)
  and LIN-03 (`/lab` routes publicly routable, sessionStorage-only) are NOT immediate
  blockers; they remain recorded anomalies affecting auditability only, unless implementation
  evidence later shows otherwise.
- No lineage correction is performed in this task.

RATIONALE:
- Gap Analysis §15: LIN-02 BLOCKS FUTURE IMPLEMENTATION: YES — any Golden corpus work must
  first establish a single provenance for spec content, otherwise POST-GOLDEN diffs on the
  three mapped events would be unattributable (Cluster 10, CONTENT RISK: HIGH for baseline
  comparison).
- LIN-01/LIN-03: BLOCKS FUTURE IMPLEMENTATION: NO — no behavioural impact on Production data.

CONTRACT IDS AFFECTED:
FP-11, CX-04, IM-01 (auditability of "reference-derived" content), FA-02, EN-05 (LIN-02);
auditability of EN-05/IM-02 (LIN-01, LIN-03).

CURRENT PRODUCTION CONFLICT:
For three events, Production spec content can originate from Lab fixtures rather than the
Master corpus, and fixture specs carry `level` values not derived from `participation_level`.

FUTURE REQUIRED INVARIANT:
Every piece of reference-derived content reaching Production has exactly one attributable
provenance; fixture shadowing of mapped Master events cannot occur; any demo content is either
removed from the Production resolution path or explicitly marked and excluded from
provenance-bearing flows.

MINIMUM ARCHITECTURAL CONSEQUENCE:
Resolution-order change confined to `catalog.ts` (or its successor behind the D02 boundary):
Master content takes precedence for mapped events, fixtures are excluded from Production spec
building (ARCHITECTURAL RISK: LOW). MUST land before D02's compliant-corpus work and any
Golden baseline comparison.

DEPENDENCIES:
None to start (Cluster 10: can start at any time). MUST PRECEDE: Cluster 2/8 content
migration and any Golden corpus work. Aligns with D02's provenance invariant.

IMPLEMENTATION NOW: NO

---

## FOUNDATION IMPLEMENTATION ORDER

Derived from Gap Dependencies Levels 0–5 plus D01–D08. Principle: structural identity and
provenance foundations first; changes that touch live family data before changes that add
surfaces; cheap self-contained surface corrections early because they gate nothing; content
migration strictly last. No implementation tasks are created here.

1. **D08 — LIN-02 provenance correction (Cluster 10).** Single-source resolution for the three
   fixture-mapped events. Low risk, no data change, and a precondition for everything that
   must be attributable.
2. **Cluster 1 + D02 boundary — Functional Participation validity model and the
   legacy/compliant reference boundary (no migration).** Define the validated participation
   shape (seven gates, mode, four complexity dimensions) and the resolver boundary with
   declared provenance. Legacy Master stays immutable and untouched.
3. **D04 — Family Participation identity inversion (Cluster 4).** Independent participation
   identity + `origin` (`reference` / `easy_beginning` / `family_free`) + provenance-only
   reference linkage + identity fields copied at creation. Existing KB-linked participations
   remain valid as `origin = reference`. Highest-risk step; lands before any entry work and
   before any migration so family data is never stranded.
4. **D05 — Routine Station purity (Cluster 6).** Neutralise the completion/compliance write
   path (`status`, `completed_at`); keep `part_of_day` as descriptive metadata; stations and
   links preserved.
5. **D06 + D07 — Use-surface corrections (Cluster 8).** Retire/redirect `/learner/$id`; make
   snapshot version selection explicit on home and preview surfaces. Lowest risk; sequenced
   here only because they gate nothing.
6. **Cluster 5 + D01 — Entry architecture and Easy Beginning.** The three named entries
   (بداية سهلة / أخطط المشاركة بنفسي / استكشف المشاركات الممكنة) on top of the new identity
   and preferred-context ownership, converging on the same downstream architecture.
7. **Cluster 7 — Composition completeness (WS-02, WS-08).** Family-invented blocks and the
   participation image distinct from Optional Support.
8. **D03 — Support taxonomy (Cluster 9).** Category → instance mapping; additive; existing
   frozen assets keep stored types.
9. **Cluster 2 + Cluster 3 — Content migration (LAST).** Re-authoring of the corpus into the
   framework-compliant Reference Knowledge (semantic boundary cleanup, complexity
   re-dimensioning) only after 1–3 are stable, per Gap Dependencies Level 5.

Rationale for the order: steps 1–4 touch structural foundations and live family data and gate
everything else; steps 5–8 are additive or surface-level and cannot proceed safely before
identity exists; step 9 moves 1413 opportunities and 1139 cards only after the identity model
they will reference is final.

---

## SAFETY GATE

- PRODUCTION CODE MUTATED: NO
- PRODUCTION DATA MUTATED: NO
- MASTER CONTENT MUTATED: NO
- DATABASE SCHEMA MUTATED: NO

Only artifact created: `docs/audit/DALILI_PRODUCTION_FOUNDATION_DECISIONS_01.md`.
One read-only inspection of `src/lib/family-routine.ts` was performed to classify D05 fields;
no file was written outside `docs/audit/`.

---

## FINAL OUTPUT

D01 PREFERRED CONTEXT: RECORDED
D02 REFERENCE KNOWLEDGE: RECORDED
D03 SUPPORT TAXONOMY: RECORDED
D04 FAMILY PARTICIPATION IDENTITY: RECORDED
D05 ROUTINE STATION: RECORDED
D06 LEARNER SURFACE: RECORDED
D07 SNAPSHOT SELECTION: RECORDED
D08 LINEAGE: RECORDED

FOUNDATION IMPLEMENTATION ORDER:
1. D08 — LIN-02 provenance correction (Cluster 10)
2. Cluster 1 + D02 — FP validity model and legacy/compliant reference boundary (no migration)
3. D04 — Family Participation identity inversion (Cluster 4)
4. D05 — Routine Station purity (Cluster 6)
5. D06 + D07 — Use-surface corrections (Cluster 8)
6. Cluster 5 + D01 — Entry architecture and Easy Beginning
7. Cluster 7 — Composition completeness (WS-02, WS-08)
8. D03 — Support taxonomy (Cluster 9)
9. Cluster 2 + Cluster 3 — Content migration (LAST)

PRODUCTION CODE MUTATED: NO
PRODUCTION DATA MUTATED: NO
MASTER CONTENT MUTATED: NO
DATABASE SCHEMA MUTATED: NO

FILE CREATED: docs/audit/DALILI_PRODUCTION_FOUNDATION_DECISIONS_01.md

FINAL:
DALILI PRODUCTION FOUNDATION DECISIONS 01 = PASS

STOP.

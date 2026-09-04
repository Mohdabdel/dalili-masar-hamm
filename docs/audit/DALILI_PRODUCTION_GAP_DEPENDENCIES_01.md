# DALILI PRODUCTION GAP DEPENDENCIES — 01

Dependency clustering of every non-ALIGNED requirement (32 of 82), derived from the findings in
`DALILI_PRODUCTION_GAP_ANALYSIS_01.md` and the classifications in
`DALILI_PRODUCTION_CONTRACT_MATRIX_01.md`. Analysis only — no cluster is an implementation task.

Non-ALIGNED inventory (32): FP-01..FP-09, FP-10, FP-11, FP-12 (11 of 12 · FP-10, FP-11 included),
CX-01, CX-02, CX-08, EN-01, EN-03, EN-04, EB-01..EB-05, FA-01, FA-03, FA-04, WS-02, WS-08, SU-02,
SN-07, LC-01, IM-05.

---

## CLUSTER 1 — Functional Participation validity model

- CONTRACT IDS: FP-01, FP-02, FP-03, FP-04, FP-05, FP-06, FP-08, FP-09, CX-01
- ROOT GAP: no validated Functional Participation object exists — an Opportunity row is usable by
  existing, and the seven gate facts (life context, intent, effect, natural completion, functional
  independence, performance neutrality, participation mode) have nowhere to live.
- DEPENDENCIES: needs a decision on where validated participations are authored and stored, given
  that the Master corpus is immutable.
- ARCHITECTURAL RISK: HIGH — introduces a second authoritative content object alongside the CSV
  corpus; every downstream resolver (`getSpaceSpec`, `findOpportunityById`) must gain a second source.
- CONTENT RISK: HIGH — 1413 existing opportunities are not gate-validated and cannot be edited in place.
- MUST PRECEDE: Cluster 2, Cluster 4, Cluster 6, Cluster 7.
- CAN FOLLOW: nothing.

## CLUSTER 2 — Semantic boundaries of the corpus

- CONTRACT IDS: FP-07, FP-10, FP-11, FP-12, IM-05 (reference half)
- ROOT GAP: the reference model itself carries prohibited content — an assistance ladder
  (`participation_levels`), performance statements (`indicators`), training-objective purposes
  (39 rows), independence language (631 of 1139 rows) — and 50 opportunities restate their event.
- DEPENDENCIES: Cluster 1 (needs a valid target shape to compare against).
- ARCHITECTURAL RISK: MEDIUM — the fields are typed and rendered in several surfaces.
- CONTENT RISK: CRITICAL — the corpus is immutable under IM-01, so this cannot be repaired in place;
  a separate validated corpus plus a presentation boundary is the only compliant route.
- MUST PRECEDE: Cluster 8 (content migration).
- CAN FOLLOW: Cluster 1.

## CLUSTER 3 — Complexity dimensioning

- CONTRACT IDS: CX-02, CX-08
- ROOT GAP: three stored dimensions instead of four (C1 Elements absent; C3/C4 merged into
  `variation_demand`), and participation mode does not exist so "shared never implies Advanced"
  cannot be expressed.
- DEPENDENCIES: FP-08 (participation mode) from Cluster 1; Cluster 2 for re-authoring.
- ARCHITECTURAL RISK: LOW — levels themselves are already correct, stored, and never computed.
- CONTENT RISK: HIGH — re-dimensioning touches all 1413 immutable rows.
- MUST PRECEDE: Cluster 8.
- CAN FOLLOW: Cluster 1, Cluster 2.

## CLUSTER 4 — Participation identity and origin

- CONTRACT IDS: FA-01, FA-03, FA-04, EN-04
- ROOT GAP: `specId = KB-<opportunity_id>` welds every Family Participation to a Master row, identity
  fields are re-derived from the reference at render instead of copied at creation, and `source` is a
  constant — so family-free and easy-beginning origins are unrepresentable.
- DEPENDENCIES: Cluster 1 (a family-free participation still needs a valid role definition).
- ARCHITECTURAL RISK: CRITICAL — identity is referenced by drafts, snapshots, runs, card states,
  station links and support assets; changing it touches live family data.
- CONTENT RISK: LOW — no Master change required.
- MUST PRECEDE: Cluster 5, Cluster 6.
- CAN FOLLOW: Cluster 1.

## CLUSTER 5 — Entry architecture and Easy Beginning

- CONTRACT IDS: EN-01, EB-01, EB-02, EB-03, EB-04, EB-05
- ROOT GAP: the three named strategies do not exist, and the nearest flow (`/help-me-choose`) is a
  time-and-complexity filter, not an entry from something the person likes.
- DEPENDENCIES: Cluster 4 (family-free origin) and Ambiguity A (who owns Preferred Context).
- ARCHITECTURAL RISK: MEDIUM — convergence machinery already exists and is single-provider, so the
  work is entry-side; the risk is re-introducing a parallel downstream if origins are not solved first.
- CONTENT RISK: MEDIUM — Preferred Context may require new reference or family content.
- MUST PRECEDE: nothing structural.
- CAN FOLLOW: Cluster 1, Cluster 4.

## CLUSTER 6 — Routine Station purity

- CONTRACT IDS: EN-03, IM-05 (family-state half)
- ROOT GAP: `routine_stations` carries `part_of_day`, `status`, `completed_at` — schedule and
  completion state on a station.
- DEPENDENCIES: none technical; independent of Clusters 1–5.
- ARCHITECTURAL RISK: MEDIUM — a schema change on live family data with an existing UI reading it.
- CONTENT RISK: NONE.
- MUST PRECEDE: Cluster 5's Routine-Station discovery lens being declared compliant.
- CAN FOLLOW: can start at any time.

## CLUSTER 7 — Composition completeness

- CONTRACT IDS: WS-02, WS-08
- ROOT GAP: blocks can only be selected from reference-derived steps (no family-invented block), and
  there is no participation image distinct from per-block images.
- DEPENDENCIES: FP-11 (blocks as first-class records) and Cluster 4 (family-free participations have
  no reference blocks at all).
- ARCHITECTURAL RISK: LOW — the draft `selection` shape already tolerates additive fields.
- CONTENT RISK: NONE.
- MUST PRECEDE: nothing.
- CAN FOLLOW: Cluster 1, Cluster 4.

## CLUSTER 8 — Use-surface corrections

- CONTRACT IDS: SN-07, LC-01
- ROOT GAP: version selection is explicit on the cards surface but implicit (latest) on the home
  surface, and a second learner route (`/learner/$id`) renders a learner view straight from the CSV
  with no approved snapshot.
- DEPENDENCIES: none — both are self-contained and behind the already-correct snapshot model.
- ARCHITECTURAL RISK: LOW.
- CONTENT RISK: NONE.
- MUST PRECEDE: nothing.
- CAN FOLLOW: can start at any time; the cheapest compliance win in the set.

## CLUSTER 9 — Support taxonomy decision

- CONTRACT IDS: SU-02
- ROOT GAP: two closed Production sets that do not match the contract's declared set;
  `stop/break` and `contextual aid` have no counterpart.
- DEPENDENCIES: Ambiguity C must be answered first.
- ARCHITECTURAL RISK: LOW — a declared-type dimension above existing tools is additive.
- CONTENT RISK: LOW — existing frozen support assets keep their stored type.
- MUST PRECEDE: any new support category work.
- CAN FOLLOW: the decision.

## CLUSTER 10 — Provenance of spec content (lineage)

- CONTRACT IDS: FP-11, CX-04, IM-01, FA-02 (auditability), EN-05
- ROOT GAP: LIN-02 — `catalog.ts` merges Lab fixtures for `FOOD-001`, `CLO-011`, `SHOP-004` ahead of
  library specs, so for three events Production block detail and level do not provably come from Master.
- DEPENDENCIES: none.
- ARCHITECTURAL RISK: LOW.
- CONTENT RISK: HIGH for any future baseline comparison — POST-GOLDEN diffs on these three events
  would be unattributable.
- MUST PRECEDE: Cluster 8 content migration and any Golden corpus work.
- CAN FOLLOW: can start at any time.

---

## PRIORITY / BLOCKER VIEW

**LEVEL 0 — DECISIONS (must resolve before architecture)**
- Ambiguity C — canonical support type set, open or closed (SU-02, Cluster 9).
- Where validated Functional Participations are authored and stored, given IM-01 (Cluster 1/2).
- Ambiguity A — Preferred Context ownership; needed before Cluster 5, not before Level 1.
- Ambiguity B needs no decision — the contract already fixes the behaviour (implementation only).

**LEVEL 1 — STRUCTURAL FOUNDATIONS**
- Cluster 1 (FP validity model, CX-01)
- Cluster 4 (participation identity and origin)
- Cluster 10 (single provenance for spec content — LIN-02)
- Cluster 6 (Routine Station purity, EN-03/IM-05)

**LEVEL 2 — ENTRY / DISCOVERY**
- Cluster 5 (EN-01, EB-01..EB-05, convergence of family-free and easy-beginning origins)

**LEVEL 3 — COMPOSITION**
- Cluster 7 (WS-02, WS-08)
- Cluster 9 implementation once the Level 0 decision lands

**LEVEL 4 — USE / HISTORY**
- Cluster 8 (SN-07, LC-01) — technically startable immediately; sequenced here because it is
  low-risk and does not gate anything else.

**LEVEL 5 — CONTENT MIGRATION**
- Cluster 2 (semantic boundaries of the corpus) and Cluster 3 (complexity re-dimensioning).
  Must not begin before Level 1 is stable: migrating 1413 opportunities and 1139 cards against an
  identity model that is still changing would strand the family data that references it.

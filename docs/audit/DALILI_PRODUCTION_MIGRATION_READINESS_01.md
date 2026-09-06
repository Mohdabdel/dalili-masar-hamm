# DALILI PRODUCTION MIGRATION READINESS — 01

Basis: `DALILI_PRODUCTION_CONTRACT_REAUDIT_02.md` + `DALILI_PRODUCTION_CONTRACT_MATRIX_02.md`
Mode: assessment only. No migration was started, planned in detail, or executed.

---

## VERDICT

**MIGRATION READINESS: YES — CONTROLLED, WITH CONSTRAINTS.**

The structural preconditions for controlled content migration are met:

- No requirement is `MISSING`, `STRUCTURAL-CONFLICT`, or `DECISION-REQUIRED` (0 / 0 / 0 out of 82).
- A validated content-entry path exists and rejects non-compliant content (`registerFrameworkParticipation` → 7 gates → throw).
- A provenance boundary type already exists (`legacy_master` vs `framework_reference`) so migrated content can coexist with an untouched legacy master.
- Every entry origin already converges on one identity (`active_participations.id`), one workspace, one draft, one snapshot chain, one learner surface — so migrated content inherits a downstream that is already 70/82 aligned and has no parallel branch to maintain.
- Approved history is protected at the database layer, so migration cannot retroactively alter what families already approved.

This is a readiness statement about **structure**, not about product completeness or content coverage.

---

## BLOCKERS (must be closed before migration begins)

**None at the architectural level.** No item in the matrix is severity `BLOCKING`.

Two items are *sequencing* prerequisites rather than blockers — migration can be prepared while they are open, but the first migrated batch should not land before they close:

| # | Item | Why it must precede the first batch |
|---|---|---|
| P1 | **FA-04** — persist the FP identity block (`functional_intent`, `observable_effect`, `natural_completion`, `participation_mode`, complexity rationale) on the family participation / spec | Migrated content carries these fields by definition. Migrating into a structure that discards them would silently destroy the exact properties that make the content compliant, and would require a second migration to recover |
| P2 | **FP-01 read-side provenance boundary** — make `knowledge-base.ts` consume `ReferenceProvenance` so legacy and compliant rows are distinguishable at the point of display | Once both provenances coexist in the same lists, an unlabelled mixture is indistinguishable to a family and untraceable in audit. The boundary must exist before the two populations mix |

---

## CONSTRAINTS (bind the migration itself)

1. **The legacy master is immutable.** `src/data/knowledge/*.csv` is not edited, reordered, renumbered or deleted. Migration produces compliant records alongside it; it never rewrites it in place. Confirmed feasible — see LEGACY MASTER BOUNDARY = YES.
2. **Every migrated record enters through the gates.** No bulk insert may bypass `registerFrameworkParticipation`. A record failing any of FP-02..FP-08 is not migrated; it is left as legacy.
3. **C1–C4 are authored, never derived.** Complexity for a migrated row is written editorially (CX-04). Deriving it from legacy `role_scope` / `organization_demand` / `variation_demand` is prohibited — the legacy triple is a different dimension set, not a subset.
4. **No approved snapshot is touched.** Migration must not update, delete or recompose any row in `participation_snapshots`, and existing family participations keep pointing at whatever they already point at.
5. **No ability/ladder vocabulary crosses the boundary.** `participation_levels` and `progressIndicators` are not carried into compliant records under any renaming.
6. **Event vs FP is resolved per row, not in bulk.** The ~50 legacy rows named identically to their parent event (FP-10) are reclassified during migration, individually.
7. **Batch and verify.** Each batch is followed by a re-run of `fp-validity` / `composition-completeness` / `support-taxonomy` tests plus a live check of the three entries, before the next batch.
8. **Governance decision required before support categories are migrated (SU-02).** Whether the support category set is closed (contract's five) or an open registry (current implementation) must be recorded. Migrating support content under an undecided model creates categories that may later need renaming.

---

## NOT A BLOCKER (may proceed in parallel)

| Item | Reason |
|---|---|
| FP-07 / FP-12 / IM-05 legacy ladder rendering | Presentation-side cleanup on legacy routes; does not affect what migrated content contains |
| LY-03 Home summary lifecycle filter | Display filter, independent of content |
| EN-03 `part_of_day` and the two dead station columns | Descriptive/dead; no interaction with migration |
| FB-01 nullable `run_id` | Historical rows only; new writes already carry it |
| LIN-01 / LIN-03 Lab lineage | Verified pure and isolated; a relocate/rename task |
| Legacy support layers (`execution-support`, CSV 13, `visual-support-map`) | Read-only display on legacy routes; they store nothing |
| EB-02 corpus size | The migration is the remedy |

---

## RECOMMENDED SEQUENCE

1. Close **P1** (persist the FP identity block).
2. Close **P2** (read-side provenance boundary in `knowledge-base.ts`).
3. Record the **SU-02** governance decision.
4. Migrate a first pilot batch — one preferred context, small, fully authored, gates enforced.
5. Verify the batch live across all three entries and both discovery lenses; confirm no legacy row was mutated and no snapshot changed.
6. Only then scale batch size.

---

## EXPLICIT NON-CLAIMS

This document does **not** declare the product MVP READY, PRODUCT COMPLETE, or CONTENT COMPLETE. With 5 compliant reference participations against 1413 legacy rows, content coverage is at pilot scale.

# DALILI FP VALIDITY FOUNDATION 01

Foundation Step 2 — Functional Participation validity model + legacy / framework-compliant
reference boundary. Additive only. No content migration, no schema migration, no legacy edits.

## MODEL CREATED

`src/lib/framework/reference-model.ts`

Distinct record types, none collapsed into a generic Opportunity:

| Concept | Type | Discriminator |
|---|---|---|
| Event | `FrameworkEvent` | `kind: "event"` |
| Preferred Context | `PreferredContext` (`family_described` \| `reference_suggested`) | `kind: "preferred_context"` |
| Functional Participation | `FunctionalParticipation` | `kind: "functional_participation"` |
| Execution Block | `ExecutionBlock` | `kind: "execution_block"` |
| Legacy record | `LegacyReferenceRecord` | `kind: "legacy_opportunity"` |

`FunctionalParticipation` fields: `id, title, life_context, functional_intent,
observable_effect, natural_completion, standalone_role_meaning, participation_mode,
complexity, execution_blocks, event_id?, preferred_context_id?, provenance`.

Complexity carries exactly C1 Elements / C2 Coordination / C3 Variability /
C4 Choice-Uncertainty plus authored `level` (simple | moderate | advanced) and a
role-structure `rationale`. No computed field, no execution-derived field.
No ability / mastery / readiness / independence / progress field exists anywhere in the model.

## VALIDITY CONTRACT

`src/lib/framework/fp-validity.ts` — `evaluateFunctionalParticipation(candidate)`.

Exactly seven gates in the frozen order (FP-01): FP-02 Life Context, FP-03 Functional Intent,
FP-04 Contribution/Observable Effect, FP-05 Natural Completion, FP-06 Functional Independence of
Role (also enforcing FP-11: no Execution Block equal to the role), FP-07 Performance Neutrality
(also enforcing FP-12: training-objective framing rejected), FP-08 Participation Mode.

Result shape: `{ valid, gates[7] {gate,name,passed,code,reason}, failedGates, codes }`.
Deterministic, definition-scoped, person-free. No score / percentage / recommendation is produced.
Complexity is never consulted during validity (CX-01 ordering preserved).
`isUsableFunctionalParticipation` implements FP-09.

## PROVENANCE BOUNDARY

`src/lib/framework/reference-registry.ts`.

`ReferenceProvenance = "legacy_master" | "framework_reference"`.
`resolveReference(id)` returns a compliant participation when registered, otherwise wraps the
legacy record (`asLegacyReference`) by reference — no copy, no cast, no transformation.
`registerFrameworkParticipation` rejects invalid candidates (FP-09), rejects re-registration and
freezes the stored record (IM-01). `isFrameworkParticipation` / `isLegacyReference` let callers ask
which world an object belongs to. Family origins `easy_beginning` / `family_free` are intentionally
NOT implemented here (Foundation 03).

## LEGACY COEXISTENCE

The compliant registry is empty in Production; no Production caller consumes it yet.
`knowledge-base.ts`, CSV Master, opportunities, cards, domains, events, IDs, levels and indicators
are untouched. All existing routes render unchanged (see regression list in the task output).

## TEST FIXTURES

`src/lib/framework/__fixtures__/compliant-fixtures.ts` (test-only, never exported into the catalog):
valid Simple, valid Shared, valid Moderate, Advanced control, invalid training-objective, invalid
event-only ("وقت مشاهدة التلفاز"), invalid execution-block-only ("توصيل القابس بالكهرباء").
`src/lib/framework/__tests__/fp-validity.test.ts` — 14 tests, all passing, including the complexity
negative tests (block count, shared mode, support/run absence).

## CONTRACT IDS AFFECTED

Newly satisfiable at model level (compliant reference objects only):
FP-01..FP-09, FP-10, FP-11, FP-12, CX-02, CX-03, CX-08, CX-09.

Partially improved, still not ALIGNED Production-wide because no live consumer uses the model:
CX-01 (ordering enforced in the model, not in a Production authoring flow), CX-04..CX-07 (holds for
compliant records; legacy stored complexity untouched), IM-01 (holds for the new registry only),
IM-05 (holds for the new model only; legacy state still carries `status`/`completed_at`).

## REMAINING GAPS

- No compliant reference content exists (migration is deliberately last).
- Legacy corpus still carries performance/training wording (FP-07/FP-12 evidence, not a target).
- Family Participation identity inversion (D04), Routine Station purity (D05), learner surface
  (D06), snapshot selection (D07), entry architecture, support taxonomy: unchanged.

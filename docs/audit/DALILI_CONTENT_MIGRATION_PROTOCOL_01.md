# DALILI CONTENT MIGRATION PROTOCOL 01 — DRAFT

Status: **DRAFT — pending Batch 02 acceptance.**
Scope: operationalizes existing frozen rules only. No new framework doctrine is introduced.
Sources of authority: `DALILI_FRAMEWORK_FREEZE_01.md`, `DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`,
Foundation 02 validity model (`src/lib/framework/fp-validity.ts`), Batch 01 (Golden five), Batch 02 legacy decisions.

---

## 1. Source classification

Every row entering the protocol is classified by model state, never by hardcoded ID
(`classifyReferenceSource`, FP-01):

- `framework_reference` — registered in the framework registry, i.e. it already passed the seven gates.
- `legacy_master` — resolvable in the CSV Master only.
- `null` — not resolvable by the production reader (e.g. an opportunity with no card). This is
  evidence of incompleteness, not a disposition.

A legacy row is never auto-promoted. Migration produces a **new, separate** `framework_reference`
representation; the legacy row is never converted in place and never mutated.

## 2. FP validity evaluation

Run `evaluateFunctionalParticipation` on the row exactly as representable, with **no field
invention**. Record all seven gate results. Legacy Master carries no `life_context` /
`functional_intent` / `observable_effect` / `natural_completion` fields, so raw legacy rows
normally fail structurally. Validator failure is **input to a disposition, never a deletion**.

## 3. KEEP rule

Legacy semantics already constitute a compliant Functional Participation and the seven gates pass
with no substantive semantic rewrite. Given the current Master schema this is expected to be rare
to non-existent; KEEP must not be used as a shortcut for EDIT.

## 4. EDIT rule

Allowed only when existing legacy evidence *clearly* supports the resulting functional identity.
Every EDIT records three items:

`SOURCE EVIDENCE` → `TRANSFORMATION` → `WHY MEANING IS PRESERVED`

If any of the five identity fields cannot be traced to source evidence, the item is
NEEDS_CLARIFICATION or QUARANTINE. Rewriting a row "into a nice participation" is prohibited.

## 5. RECLASSIFY rule

The row is useful content but is not a Functional Participation. Target semantic type is explicit:
`EVENT` | `EXECUTION_BLOCK` | `PREFERRED_CONTEXT` | `CONTEXTUAL_CONDITION` | `OTHER`.

Deterministic evidence for `EVENT`: the opportunity title equals the parent event title
(FP-10 duplication). Evidence for `EXECUTION_BLOCK`: the row is a sequenced fragment of a larger
role, with the neighbouring fragments present in the same event. No Production relocation is
performed at classification time. Useful legacy content is never discarded.

## 6. SPLIT rule

Used when one row demonstrably contains more than one semantic object. Record: source row,
semantic objects detected, proposed resulting objects, evidence for each. A split is not
materialized if any resulting FP would require invented meaning.

## 7. NEEDS_CLARIFICATION rule

Evidence is insufficient to determine the intended Functional Participation without guessing —
typically a title-only row, or a role whose observable effect and natural completion cannot be
derived. Confidence is LOW by definition. No automated publication.

## 8. QUARANTINE rule

The row is incompatible or unsafe for framework publication in its present form: its defining
purpose is training/mastery/ability, or participation is conditional on clinical supervision, or
publication would assert something the framework cannot support. QUARANTINE is not deletion —
`DELETE` is not an allowed disposition anywhere in this protocol.

## 9. Complexity rule

Complexity is assigned **only** when a valid proposed identity exists, and it is authored
editorially across C1 elements / C2 coordination / C3 variability / C4 choice-uncertainty
(CX-02, CX-04), with a structural rationale (CX-09). Level ∈ {simple, moderate, advanced} (CX-03).

Prohibited as complexity inputs: assistance, independence, mastery, learner ability, support count,
execution-block count, historical Run performance. Shared mode never implies Advanced (CX-08).
`UNKNOWN` is always preferable to fabrication, and Advanced is never manufactured.

## 10. Legacy leakage rule

Inspect legacy text for: موجهة، مستقلة، بمفرده، المساعدة، لتعلّم، إتقان، مهارة، بثقة متزايدة،
assistance ladders, performance indicators, readiness/mastery semantics. Record presence and where
it lands:

- `identity` — the row's stated purpose is training/ability. Blocks EDIT; route AMBER or RED.
- `presentation_only` — the ladder lives in a display field (`participation_levels`, `indicators`).
  It does not enter the materialized identity and does not by itself block migration.
- `execution_detail` — wording inside steps; may be reworded under the EDIT rule.

This evidence feeds FP-07, FP-12 and IM-05 later; those requirements are not fixed here.

## 11. Provenance requirements

Every materialized record carries deterministic, auditable lineage: legacy source ID, legacy title,
legacy event ID, domain, batch, disposition, review confidence, `reference_source =
framework_reference`. The framework ID must differ from the legacy ID, proving no in-place
conversion. Lineage lives with the record (`getMigrationLineage`), not in prose only.

## 12. Confidence routing

- `HIGH` — the decision follows directly from explicit source evidence.
- `MEDIUM` — a reasonable interpretation exists; semantic review advisable.
- `LOW` — insufficient or ambiguous evidence; no automated publication.

Confidence is confidence in the **content migration decision**, never in a person.

## 13. Green / Amber / Red policy

- `GREEN` — HIGH-confidence KEEP or bounded EDIT that passes FP validity with a complete identity
  and no invented semantics.
- `AMBER` — human semantic review required before publication (all RECLASSIFY, all
  NEEDS_CLARIFICATION, and MEDIUM-confidence EDIT).
- `RED` — must not become `framework_reference` without a new authoritative content decision
  (all QUARANTINE). RED ≠ deletion.

Only GREEN may be materialized. AMBER writes = 0. RED writes = 0.

## 14. Materialization requirements

A materialized record must contain life_context, functional_intent, observable_effect,
natural_completion, standalone_role_meaning, participation_mode, plus structural complexity where
justified; it must pass the seven gates at registration (FP-09) and become immutable (IM-01).
Execution blocks stay distinct from the role (FP-11). Legacy Master stays byte-identical.
Per-batch write caps are hard limits and are enforced by the corpus module, not by intent.

## 15. Human review requirements

AMBER and RED items require a named human semantic decision before any publication. A future batch
may only reduce an item's routing (AMBER → GREEN) on the basis of *new authoritative content*, not
re-interpretation of the same evidence.

## 16. Prohibited inference

Never infer: a missing life context, a missing observable effect, a missing natural completion,
participation mode, complexity level, or a split boundary. Never promote an Event or an Execution
Block to a Functional Participation merely to preserve a legacy row. Never derive complexity from
assistance/independence/step count/support count. Never rewrite historical snapshots.

## 17. Rollback and publication rules

Materialization is additive: registry-only records with no schema migration and no legacy write, so
rollback is the removal of the corpus module entry — nothing downstream is mutated. Publication to
family-facing Discovery is a **separate gate**: registry membership alone does not surface a record
to families, and no batch may claim publication until that surfacing gate is designed and approved.

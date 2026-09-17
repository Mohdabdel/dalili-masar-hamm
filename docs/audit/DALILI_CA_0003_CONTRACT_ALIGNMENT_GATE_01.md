# DALILI — CA-0003 CONTRACT ALIGNMENT GATE 01

## Decision

`PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED`

The scaled CA-0003 wave is complete at draft level. All 300 frozen sources were reviewed in four
25-source micro-batches per lane. The initial bulk-template draft was rejected; every candidate was
then rewritten source by source and revalidated before this decision.

## Scope and results

| Measure | Result |
|---|---:|
| Selected / accounted sources | 300 / 300 |
| Draft FP candidates | 311 |
| Canonical FP validation | 311/311 at 7/7 PASS |
| Complexity validation | 311/311 at 9/9 PASS |
| Semantic anti-template quality | 311/311 PASS |
| GREEN source routes | 271 |
| AMBER source routes | 29 |
| RED source routes | 0 |
| Provenance-only links | 4 |
| Duplicate / orphan / silent-drop sources | 0 / 0 / 0 |
| Materialized | 0 |

Disposition distribution: 231 REWRITE_REQUIRED, 50 ACCEPTED, 15 SPLIT_REQUIRED, and 4
MERGED_BY_PROVENANCE. The 15 split sources produced distinct child candidates; merge sources
produced verified links and no duplicate candidates.

## Strengthened controls

- Three-way source hash and identity reconciliation: ledger → selection → lane/result.
- Bidirectional source-to-candidate lineage and output mapping.
- Independent rerun of FP, complexity, semantic-quality, safety, and route derivation.
- Corpus-level rejection of duplicate semantic fields and repeated eight-word scaffolds.
- Controlled Arabic hazard classes with regression tests for false substring matches.
- Unified lane schema and explicit non-materialization boundary.

The safety review routes 29 sources AMBER for bounded hazards including medication, chemicals,
electricity, height, heat, sharp tools, and biological exposure. Each carries an explicit reason and
missing condition and remains excluded from materialization.

## Verification

- CA-0003 integrated and quality tests: 330/330 PASS.
- Deterministic routing/selection tests: 7/7 PASS.
- Strict TypeScript validation: PASS.
- JSON/result generation and repository whitespace checks: PASS.
- Legacy Master and canonical validator unchanged.

## Authorization boundary

This gate authorizes continued Contract Alignment expansion. It does not authorize materialization.
GREEN drafts and all routed exceptions remain outside production registries until a separately
governed materialization decision.

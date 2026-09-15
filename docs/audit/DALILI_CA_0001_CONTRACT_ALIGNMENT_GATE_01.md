# DALILI — CA-0001 CONTRACT ALIGNMENT GATE 01

## Decision

`PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED`

The first governed Contract Alignment calibration batch is complete at draft level. All 50 frozen
Legacy sources are accounted for. No materialization occurred.

## Scope and outputs

| Measure | Result |
|---|---:|
| Selected Legacy sources | 50 |
| Accounted Legacy sources | 50 |
| Draft FP candidates | 48 |
| Canonical FP validation | 48/48 at 7/7 PASS |
| Complexity validation | 48/48 at 9/9 PASS |
| GREEN source routes | 47 |
| AMBER source routes | 2 |
| RED source routes | 1 |
| Silent drops / orphan outputs / duplicate source IDs | 0 / 0 / 0 |
| Materialized | 0 |

Draft artifacts:

- `data/DALILI_CA_0001_DRAFT_FP_ACCEPT_REWRITE.json`
- `data/DALILI_CA_0001_DRAFT_SPLIT_MERGE.json`
- `data/DALILI_CA_0001_DRAFT_NON_FP_ROUTING.json`
- `data/DALILI_CA_0001_CONTRACT_ALIGNMENT_RESULT_01.json`

Executable verification:

- `scripts/build-ca0001-result.mjs`
- `src/lib/framework/__tests__/ca0001-contract-alignment.test.ts`

## Disposition execution

- 24 ACCEPTED/REWRITE sources produced 24 complete draft candidates.
- 10 SPLIT sources produced 24 complete draft child candidates; every source produced at least two
  children with explicit ordinal and source lineage.
- 11 MERGED sources produced no duplicate candidates; 10 have one explicit target and one remains
  AMBER.
- Two EVENT_ONLY sources attach to existing Event identities.
- One EXECUTION_BLOCK_ONLY source has a staged block identity but no invented FP parent.
- Two exclusions retain tombstones and explicit reasons.

## Routed exceptions

### AMBER — `HEALTH-014-OP001`

Two explicit existing Framework references claim the same Legacy source:

- `FR-B02-HEALTH-014-OP001`
- `FR-EXP12-HEALTH-014-OP001`

They encode materially different participation mode and complexity interpretations. Chronology is
not treated as implicit supersession. A canonical target or explicit supersession relation is
required before materialization.

### AMBER — `HEALTH-016-OP002`

The source is an Execution Block only. Its staged identity remains unattached because no valid
parent Functional Participation has been established. It cannot materialize as an orphan.

### RED — `HOME-003-OP002`

Phase 2 classified «توصيل القابس بالكهرباء» as ACCEPTED, but the frozen FP validity foundation uses
the same role as the explicit execution-block-only negative fixture. The generated draft passes the
current non-empty/textual gates syntactically; that result cannot override the semantic FP-11
conflict or the earlier governing evidence. The draft is retained as audit evidence and is not
eligible for materialization. The source requires a classification-governance correction to
EXECUTION_BLOCK_ONLY or a new explicit decision supported by evidence.

## Verification evidence

- Unified selection/conservation tests: 5/5 PASS.
- Complexity validator tests: 15/15 PASS.
- CA-0001 integrated draft tests: 101/101 PASS.
- JSON generation and parse: PASS.
- TypeScript strict check for the framework validators: PASS.
- Legacy frozen SHA remains
  `e651921db9c46938c8b19edbc82859b8df7ca6427dae6f10d6e276f8e6dc2731`.
- Canonical validator unchanged.

## Authorization boundary

This gate authorizes continuation of Contract Alignment drafting using the proven schema and
controls. It does not authorize materialization. AMBER and RED records remain excluded from any
future materialization until their recorded conditions are resolved and revalidated.

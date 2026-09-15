# DALILI CONTRACT ALIGNMENT — CA-0001 ROUTING GATE 01

## Scope and prohibitions

This gate controls selection and post-alignment routing for the first 50-record Contract Alignment
batch. It performs no materialization, does not edit the Legacy Master, and does not alter or replace
the canonical validator. Classification artifacts are authoritative inputs; the selector does not
invent a disposition or modify a source record.

Executable evidence:

- `scripts/contract-alignment-routing.mjs`
- `scripts/contract-alignment-routing.test.mjs`

## Deterministic selection

The sole selection input is the unified, verified
`DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json`. Selection refuses to run unless the ledger proves:

- exactly 1413 records and 1413 unique Legacy IDs;
- exactly 1413 unique, continuous corpus positions 1–1413;
- complete source identity and classification-artifact attribution;
- full approved distribution: ACCEPTED 238, REWRITE_REQUIRED 1059, SPLIT_REQUIRED 79,
  MERGED_BY_PROVENANCE 32, EVENT_ONLY 2, EXECUTION_BLOCK_ONLY 1, EXCLUDED_WITH_REASON 2;
- all four ledger conservation gates are `PASS`.

Selection order is fixed:

1. earliest approved record for each of the seven dispositions;
2. earliest approved record for each of the six domains not already selected;
3. disposition round-robin in the frozen order below, always taking the earliest remaining record;
4. stable final sort by `corpus_position`, then `legacy_id`.

Frozen disposition order:

`ACCEPTED → REWRITE_REQUIRED → SPLIT_REQUIRED → MERGED_BY_PROVENANCE → EVENT_ONLY → EXECUTION_BLOCK_ONLY → EXCLUDED_WITH_REASON`

This produces exactly 50 real approved records. Current coverage:

| Dimension | Result |
|---|---|
| Count | 50 |
| Domains | 6/6 |
| Dispositions | 7/7 |
| Duplicate source IDs | 0 |
| Synthetic source records | 0 |
| Unapproved dispositions | 0 |

Disposition distribution:

| Disposition | Count |
|---|---:|
| ACCEPTED | 11 |
| REWRITE_REQUIRED | 13 |
| SPLIT_REQUIRED | 10 |
| MERGED_BY_PROVENANCE | 11 |
| EVENT_ONLY | 2 |
| EXECUTION_BLOCK_ONLY | 1 |
| EXCLUDED_WITH_REASON | 2 |

Domain distribution: DOM-CLO 17; DOM-COMM 5; DOM-FOOD 5; DOM-HEALTH 7; DOM-HOME 15;
DOM-SHOP 1. These counts are a deterministic coverage sample, not a claim of proportionality.

## Routing contract

Routing occurs only after a selected record has received its Contract Alignment result.

### GREEN

All conditions are required:

- contract complete;
- canonical result is exactly 7/7 PASS;
- complexity validation PASS;
- provenance complete and conflict-free;
- duplicate conflict is false;
- safety concern is false.

### AMBER

No RED condition exists, and at least one bounded repair/decision condition exists:

- repairable contract or wording issue;
- complexity-rationale issue;
- limited provenance ambiguity;
- split/merge decision required.

AMBER never materializes automatically and requires a recorded resolution followed by complete
revalidation.

### RED

Any hard-stop condition routes RED:

- unsafe role;
- prohibited semantic framing;
- source conflict or unresolved provenance;
- irreconcilable duplicate conflict.

The router is fail-closed: an incomplete result with no explicit repairable condition is RED, not
GREEN or AMBER.

The source classification disposition and routing status are separate dimensions. For example,
`REWRITE_REQUIRED` is an instruction for Contract Alignment and does not predetermine AMBER; its
completed rewrite may route GREEN only after all gates pass.

## Conservation gate

Before any batch may be accepted:

`input count = routed count = 50`

and all of the following must be empty:

- duplicate routed IDs;
- routed IDs absent from input (orphans);
- input IDs absent from routing output (silent drops).

Split handling does not weaken conservation. The source record remains accounted once, while every
derived candidate must carry that source ID in provenance. Merge, event-only, execution-block-only,
and exclusion records remain accounted even when they do not yield a new Framework Reference.

## Required acceptance evidence for completed CA-0001

The completed batch report must include:

- the frozen 50-record selection and its source-artifact references;
- one routing outcome per selected source ID;
- candidate IDs derived from split records;
- target reference IDs and explicit lineage evidence for provenance merges;
- destination event/block IDs for non-FP routing;
- exclusion reason for every excluded source;
- per-candidate canonical and complexity results;
- conservation output with zero duplicates, orphans, and silent drops;
- Legacy before/after count and hash equality;
- Framework Reference before/after counts (informational only until materialization is separately authorized);
- confirmation that materialization count remains zero for this gate.

## Executed tests

Command:

`node --test scripts/contract-alignment-routing.test.mjs`

Result: **5/5 PASS**.

- unified source ledger integrity, count 1413, continuous coverage, uniqueness, and full distribution;
- deterministic selection of 50 approved source records;
- all seven dispositions and all six domains covered;
- GREEN/AMBER/RED routing deterministic and fail-closed;
- conservation accepts an exact set and detects duplicate, orphan, and silent-drop corruption.

## Gate decision

`CA-0001 SELECTION AND ROUTING HARNESS = PASS`

This PASS authorizes Contract Alignment drafting for the selected records only. It is not canonical
content PASS, does not authorize materialization, and does not assert that any selected item is GREEN.

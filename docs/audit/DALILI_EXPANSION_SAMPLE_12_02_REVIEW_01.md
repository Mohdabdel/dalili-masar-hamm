# DALILI — Expansion Sample 12-02 Review 01

Date: 2026-09-12

## Status

PRECISION REVIEW COMPLETE - CORRECTED PACKET READY FOR RECHECK.

This review covers `DALILI_EXPANSION_SAMPLE_12_02`. It remains a review layer only and does not materialize runtime framework references.

## Files

- Source packet: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02.json`
- Filled scorecard: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_SCORECARD_FILLED.csv`
- Corrected packet: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01.json`

## Review Result

- ACCEPT: 2 / 12
- REVISE_WORDING: 5 / 12
- REVISE_CONTEXT: 2 / 12
- REVISE_SCOPE: 3 / 12
- REJECT: 0 / 12

Image review status was recorded separately as `IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL` for all rows, following `DALILI_VISUAL_BINDING_POLICY_01`.

## Main Findings

1. Some Wave-A records still carried template wording such as generic "visible effect" language. These were rewritten as concrete household or community effects.
2. External-service roles needed family framing. Restaurant ordering, clinic queue handling, delivery receipt, and return/exchange preparation were narrowed so the participant owns a partial role, not the whole transaction.
3. Product-quality roles needed scope control. Produce and package inspection were framed around family-selected items and visible checks, not independent purchase decisions.
4. One household item had a complexity-dimension mismatch: the title was table-specific while C1 referred to the whole living room. This was aligned to the table scope.
5. The advanced clothing return item had an execution block equal to the role title. It was narrowed to preparing the item and order information, with the transaction decision left to the family.

## Corrected-Recheck Gate

The corrected packet must pass:

- Functional Participation validity gates.
- No execution block equal to the role title.
- Proposed framework IDs remain separate from Legacy Master evidence IDs.
- Sensitive external roles remain family-framed.
- The packet remains `not_materialized` until an explicit later activation decision.

## Next Station

The next safe station is generating or binding provisional images for the corrected 12-02 execution blocks under the new visual-binding policy, or materializing only after the corrected packet is rechecked and accepted.

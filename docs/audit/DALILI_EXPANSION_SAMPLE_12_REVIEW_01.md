# DALILI Expansion Sample 12 Review 01

## Status

CONTROLLED REVIEW PACKET READY - DO NOT MATERIALIZE YET.

This packet extends the post-pilot review from Batch 03 to a wider 12-item sample. It is a review layer only: it does not register new framework references, does not rewrite Legacy Master rows, and does not touch family data, snapshots, runs, or production storage.

## Files

- Test sample: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_01.json`
- Scorecard: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_SCORECARD_01.csv`
- Corrected review candidates: `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_CORRECTED_01.json`

## Sample Coverage

| Domain | Items |
| --- | ---: |
| DOM-HOME | 2 |
| DOM-FOOD | 2 |
| DOM-CLO | 2 |
| DOM-SHOP | 2 |
| DOM-COMM | 2 |
| DOM-HEALTH | 2 |

The sample intentionally includes clean items and edge items. This keeps the review useful: it should expose recurring wording and scope defects before any content migration.

## Initial Review Result

- ACCEPT: 7 / 12
- REVISE_WORDING: 3 / 12
- REVISE_SCOPE: 1 / 12
- REVISE_CONTEXT: 1 / 12
- REJECT: 0 / 12

## Systemic Findings

1. **Skill-language drift in clothing items.**
   `CLO-016-OP001` and `CLO-042-OP001` use wording like "لتعلّم مهارة". The activity ideas are usable, but the justification should be reframed as family participation and visible household effect.

2. **Advanced role scope needs narrowing.**
   `SHOP-001-OP002` can be valid if it means writing or dictating one or two missing items. It should not imply responsibility for the full shopping list.

3. **Health context needs explicit family safety framing.**
   `HEALTH-014-OP001` should be about setting a reminder with the family. It must not imply that the participant independently manages medication decisions.

4. **No final rejection in this sample.**
   All 12 items are potentially usable after limited wording/scope/context revisions.

## Review Gate

Before any Batch 04-style materialization:

- Apply the five required fixes in the scorecard.
- Re-run the family-participation validity review on the revised text.
- Prepare visual coverage only for accepted/revised-accepted items.
- Keep every new framework id separate from its source Legacy Master `opportunity_id`.

## Next Station

The correction pass has been prepared as a separate review candidate packet. The nearest safe next station is visual readiness for the 12 corrected candidates, followed by a limited Batch 04 materialization decision.

## Verification

- Added `expansion-sample-review.test.ts` to read the corrected JSON packet and run each candidate through `evaluateFunctionalParticipation`.
- The test asserts this packet remains review data and is not silently treated as a runtime migration.

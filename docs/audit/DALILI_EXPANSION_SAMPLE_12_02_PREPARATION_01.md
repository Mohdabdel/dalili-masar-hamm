# DALILI — Expansion Sample 12-02 Preparation 01

Date: 2026-09-12

## Decision

After materializing `BATCH_04`, the next station is a second controlled 12-item review packet, not immediate runtime activation.

The packet is:

- `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02.json`
- `docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_SCORECARD.csv`

## Selection Rule

The sample selects two not-yet-materialized candidates from each major domain:

- Food and meals
- Shopping and purchases
- Home management
- Community participation
- Health and appointments
- Clothing and care

The selection intentionally emphasizes edge cases:

- Staff or external-service interaction
- Health date/queue handling
- Address and delivery handoff
- Product inspection or quality choice
- Clothing receipt/return
- Household roles that may become too broad if not bounded

## Exclusion Rule

The sample excludes source evidence already materialized in `BATCH_03` or `BATCH_04`.

Legacy Master remains untouched. This packet does not register runtime content and does not promote any old row in place.

## Review Gate

The reviewer should fill the scorecard with:

- `ACCEPT`
- `REVISE_WORDING`
- `REVISE_CONTEXT`
- `REVISE_SCOPE`
- `REJECT`

The key review question is not whether the activity is useful in general, but whether the record is a clean family-participation role:

- clear life context
- functional intent
- observable effect
- natural completion
- standalone partial role
- concrete execution blocks
- no therapy, training, readiness, mastery, or independence language

## Current Automated Check

The packet has an automated selection guard:

- 12 candidates total.
- Two candidates per major domain.
- No reused materialized source evidence from `BATCH_03` or `BATCH_04`.
- Contains edge coverage across staff, health, clothing, individual/shared modes, and advanced complexity.
- All selected candidates currently pass the frozen FP validity gates as review candidates.

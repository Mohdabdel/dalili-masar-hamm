# DALILI Precision Review Round 01

## Status

READY FOR DIRECT REVIEW.

This round responds to the reviewer requirement that no narrative report should be trusted without direct inspection of the actual corrected data fields.

## Files To Review

### 1. Corrected Pilot Recheck

- File: `docs/audit/data/DALILI_PILOT_TEST_SAMPLE_01.json`
- Purpose: verify the 12 previously reviewed cards after fixes.
- Focus:
  - `FP-CAND-*` execution blocks are now direct action text.
  - `FP-WAVE-A-012` now happens before going to the postal counter.
  - `FP-WAVE-A-005` no longer uses skill/training wording.
  - `FP-WAVE-A-007` is now a partial shared role, not full closet organization.

### 2. Full Corrected Library

- File: `docs/audit/data/DALILI_REVIEWER_FULL_LIBRARY_42_01.json`
- Purpose: allow the reviewer to inspect the full corrected 42-card library directly.
- Source:
  - 30 cards from `DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE.json`
  - 12 cards from `DALILI_CONTROLLED_EXPANSION_WAVE_A_12_CANDIDATES_01.json`

### 3. New Expansion Sample

- File: `docs/audit/data/DALILI_PRECISION_REVIEW_EXPANSION_SAMPLE_12_01.json`
- Purpose: test 12 additional cards not included in the original pilot sample.
- Acceptance target:
  - at least 10 of 12 accepted
  - 0 rejected for framework drift
  - no new recurring systemic defect

### 4. Edge Sample

- File: `docs/audit/data/DALILI_PRECISION_REVIEW_EDGE_SAMPLE_6_01.json`
- Purpose: test deliberately harder cards from sensitive or ambiguity-prone contexts.
- Focus:
  - health/appointments do not become therapy or diagnosis framing
  - community/staff interaction stays participation-oriented
  - clothing/purchase contexts do not become independence or performance tasks
  - moderate/advanced cards remain scoped as meaningful participation roles

### 5. Review Scorecard

- File: `docs/audit/data/DALILI_PRECISION_REVIEW_SCORECARD_01.csv`
- Purpose: record reviewer decisions for all three groups:
  - `RECHECK`
  - `EXPANSION`
  - `EDGE`

## Review Questions

For every reviewed card, answer:

1. Is this a family participation opportunity, not a training objective?
2. Is the life context concrete and understandable?
3. Is the role meaningful even if small or partial?
4. Is the natural completion point visible without performance scoring?
5. Is the wording free from therapy, readiness, mastery, independence, ability, score, diagnosis, age, or repeated-practice framing?
6. Is the role scope appropriate for family participation rather than a complete individual task?

## Decision Labels

- `ACCEPT`
- `REVISE_WORDING`
- `REVISE_CONTEXT`
- `REVISE_SCOPE`
- `REJECT`

## Round Pass Criteria

This precision review round passes if:

- Corrected pilot recheck has no unresolved defect from the prior review.
- Expansion sample has at least 10 of 12 `ACCEPT`.
- Edge sample has 0 `REJECT`.
- No new systemic defect appears across card families.
- Any revised candidate still passes `evaluateFunctionalParticipation`.

## Non-Goals

- Do not test child ability.
- Do not score child performance.
- Do not infer diagnosis, age, support level, or independence.
- Do not evaluate therapeutic usefulness.

## Guardrails

- Legacy source data remains immutable.
- Family history remains immutable.
- Validator changes are not part of this review.
- Reviewer feedback is recorded before any further content promotion.

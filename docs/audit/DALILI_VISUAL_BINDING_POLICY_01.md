# DALILI — Visual Binding Policy 01

Date: 2026-09-12

## Decision

Visual assets are a replaceable display binding, not part of the intrinsic validity of a Functional Participation record.

Content review should focus on:

- life context
- functional intent
- observable effect
- natural completion
- standalone partial role
- concrete execution blocks
- absence of therapy, training, readiness, mastery, ability, or independence language

Image review is tracked separately so the content pipeline does not stall on replaceable visual choices.

## Image Review Statuses

- `IMAGE_ACCEPTED`: image is suitable for the current binding.
- `IMAGE_REPLACE_LATER`: image can be used provisionally or replaced before pilot/public use.
- `IMAGE_MISSING`: no image is bound yet; content review can continue.
- `IMAGE_NOT_REQUIRED_FOR_CONTENT_APPROVAL`: the card can be approved as content without an image.
- `IMAGE_REJECTED`: the current image is misleading, unsafe, or semantically wrong enough to block approval until replaced or removed.

## Gate Rule

Only `IMAGE_REJECTED` blocks content approval.

All other image statuses preserve the right to approve content and replace the visual binding later.

## Implementation Evidence

The rule is codified in:

- `src/features/space/visual-binding-policy.ts`
- `src/features/space/__tests__/visual-binding-policy.test.ts`

This is additive. It does not change Legacy Master, does not mutate framework references, and does not force any already activated card to keep its current image permanently.

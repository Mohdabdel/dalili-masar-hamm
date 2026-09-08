# DALILI Pilot Test Protocol 01

## Status

READY FOR PILOT REVIEW.

This protocol defines the first low-risk pilot for the current DALILI content state. The pilot tests clarity and framework fit only. It does not test a child, measure performance, or introduce therapy, readiness, mastery, independence, or training assumptions.

## Pilot Scope

- Sample artifact: `docs/audit/data/DALILI_PILOT_TEST_SAMPLE_01.json`
- Scorecard artifact: `docs/audit/data/DALILI_PILOT_REVIEW_SCORECARD_01.csv`
- Sample size: 12 candidates
- Coverage: 2 candidates from each current domain
- Review sequence: desk review first, then one expert review

## Review Questions

Each candidate is reviewed against five yes/no questions:

1. Does the item read as a family participation opportunity?
2. Is the life context concrete and understandable without external explanation?
3. Is the functional role meaningful even if others complete the rest of the event?
4. Is the natural completion point visible in the situation?
5. Is the wording free from training, therapy, readiness, independence, mastery, score, or performance framing?

## Decision Labels

- `ACCEPT`: all five answers are yes and no material wording issue is found.
- `REVISE_WORDING`: the idea fits, but wording needs adjustment.
- `REVISE_CONTEXT`: the role may fit, but life context or completion point is unclear.
- `REJECT`: the item drifts away from family participation or cannot be repaired without changing the underlying concept.

## Desk Review Rules

- Review the visible text only: title, life context, functional intent, observable effect, natural completion, standalone role meaning, complexity rationale, and execution blocks.
- Do not infer missing child ability, diagnosis, age, support level, or independence level.
- Do not accept an item because it feels useful therapeutically.
- Do not reject an item because it is small; a small role is valid if it changes the event state.

## Expert Review Rules

The expert receives the same 12 candidates and the same five questions. The expert should not be asked whether the child can perform the role. The expert should only judge whether the wording and structure describe a valid participation opportunity for family life.

## Promotion Gate

The pilot passes if:

- At least 10 of 12 candidates are `ACCEPT`.
- No candidate is marked `REJECT` for framework drift.
- Any `REVISE_WORDING` candidate can be corrected without changing source evidence.
- All revised candidates pass `evaluateFunctionalParticipation` after revision.

The pilot does not pass if:

- More than 2 candidates need structural revision.
- Any candidate requires child ability, therapy, readiness, mastery, or independence framing to make sense.
- The expert finds recurring ambiguity in the role/completion model across domains.

## Current Pilot Sample

| Review item | Candidate | Domain | Title |
| --- | --- | --- | --- |
| PILOT-01-01 | FP-WAVE-A-011 | إعداد الطعام والوجبات | ترتيب الحوافظ في حقيبة السفر |
| PILOT-01-02 | FP-CAND-001 | إعداد الطعام والوجبات | تجهيز مائدة الإفطار |
| PILOT-01-03 | FP-WAVE-A-010 | التسوق وإدارة المشتريات | فحص سلامة العبوات من الانبعاج أو التلف |
| PILOT-01-04 | FP-CAND-011 | التسوق وإدارة المشتريات | تجهيز أكياس التسوق للخروج |
| PILOT-01-05 | FP-WAVE-A-009 | إدارة المنزل | إخراج العلب من الخزانة ومسح الأرفف |
| PILOT-01-06 | FP-CAND-018 | إدارة المنزل | إعادة الكتب إلى الرفوف |
| PILOT-01-07 | FP-WAVE-A-012 | الأنشطة والمشاركة المجتمعية | تعبئة بيانات العنوان على الطرد |
| PILOT-01-08 | FP-CAND-020 | الأنشطة والمشاركة المجتمعية | تجهيز أغراض النزهة العائلية |
| PILOT-01-09 | FP-WAVE-A-001 | الصحة والمواعيد | البحث عن رقم العيادة |
| PILOT-01-10 | FP-CAND-025 | الصحة والمواعيد | تجهيز الأغراض الشخصية للموعد |
| PILOT-01-11 | FP-WAVE-A-005 | الملابس والعناية بها | فرز الملابس المتسخة قبل الغسيل |
| PILOT-01-12 | FP-WAVE-A-007 | الملابس والعناية بها | ترتيب وإعادة تنظيم خزانة الملابس |

## Guardrails

- The Legacy corpus remains immutable.
- The validator remains unchanged.
- The family history remains unchanged.
- Pilot feedback is captured as review metadata before any content change.

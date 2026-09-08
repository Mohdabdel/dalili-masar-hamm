# DALILI PRODUCTION CONTENT CONTRACT EXTRACTION 01 — READ ONLY

Scope: extract the runtime content contract currently enforced by Production.
No validator, runtime code, database schema, corpus, candidate library, or Production data was modified.

## 0. Integrity Note

The handoff cited frozen contract SHA-256:

`693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc`

The checked-out file bytes hash to:

`c5b0d83cbcde0f8ed8dbfc92dddaf1d0f99f12267cb1ba6155683241bae1d2c5`

Resolution: this is a line-ending difference only. When `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md` is normalized from CRLF to LF, its SHA-256 is exactly the frozen imported hash:

`693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc`

Requirement integrity is intact: 82 requirement IDs found, 82 unique.

## 1. Canonical Source Paths

- Contract: `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
- Previous canonical validation gate: `docs/audit/DALILI_PRODUCTION_CANONICAL_CONTENT_VALIDATION_GATE_01.md`
- FP validator: `src/lib/framework/fp-validity.ts`
- Canonical reference model: `src/lib/framework/reference-model.ts`
- Registry boundary: `src/lib/framework/reference-registry.ts`
- Persisted family identity block: `src/lib/framework/participation-identity.ts`
- Database JSON column contract: `supabase/migrations/20260906062728_352fdb01-6976-41dc-8120-0d7b3c600534.sql`
- Main tests/examples: `src/lib/framework/__tests__/fp-validity.test.ts`, `src/lib/framework/__fixtures__/compliant-fixtures.ts`

## 2. Candidate Input Contract

The validator accepts `CandidateFunctionalParticipation`:

`Partial<Omit<FunctionalParticipation, "kind" | "provenance">> & { id: string }`

Only `id` is TypeScript-required for a candidate, but the seven gates require the semantic fields below to pass.

| Field | Type / shape | Required to pass? | Validator use |
|---|---|---:|---|
| `id` | `string` | yes by type | Not a gate. |
| `title` | `string` | no | Scanned by FP-07; compared by FP-06 against execution block text. |
| `life_context` | `string` | yes | FP-02 requires non-empty. |
| `functional_intent` | `string` | yes | FP-03 requires non-empty. |
| `observable_effect` | `string` | yes | FP-04 requires non-empty. |
| `natural_completion` | `string` | yes | FP-05 requires non-empty. |
| `standalone_role_meaning` | `string` | yes | FP-06 requires non-empty. |
| `participation_mode` | `"individual" | "shared"` | yes | FP-08 requires exactly one allowed value. |
| `execution_blocks` | `ExecutionBlock[]` | no for FP validity | FP-06/FP-11 rejects a block equal to the title or standalone role meaning. |
| `complexity` | `FrameworkComplexity` | no for FP validity; yes for full reference | Not inspected by `evaluateFunctionalParticipation`. |
| `event_id` | `string` | no | Not inspected by FP validator. |
| `preferred_context_id` | `string` | no | Not inspected by FP validator. |

Full `FunctionalParticipation` additionally requires:

- `kind: "functional_participation"`
- `provenance: "framework_reference"`
- `complexity`
- `execution_blocks`

## 3. Seven-Gate Contract

Canonical functions:

- `evaluateFunctionalParticipation(candidate)`
- `isUsableFunctionalParticipation(candidate)`

| Gate | Name | Exact condition | Failure code(s) |
|---|---|---|---|
| FP-02 | Life Context | `life_context` is a non-empty string | `MISSING_LIFE_CONTEXT` |
| FP-03 | Functional Intent | `functional_intent` is a non-empty string | `MISSING_FUNCTIONAL_INTENT` |
| FP-04 | Contribution / Observable Effect | `observable_effect` is a non-empty string | `MISSING_OBSERVABLE_EFFECT` |
| FP-05 | Natural Completion | `natural_completion` is a non-empty string | `MISSING_NATURAL_COMPLETION` |
| FP-06 | Functional Independence of Role | `standalone_role_meaning` is non-empty and no execution block equals title or role meaning | `ROLE_NOT_INDEPENDENT`, `EXECUTION_BLOCK_EQUALS_ROLE` |
| FP-07 | Performance Neutrality | definition text has no training or performance terms | `TRAINING_OBJECTIVE`, `PERFORMANCE_LANGUAGE` |
| FP-08 | Participation Mode | mode is exactly `individual` or `shared` | `MISSING_PARTICIPATION_MODE`, `INVALID_PARTICIPATION_MODE` |

FP-06 also enforces FP-11. FP-07 also enforces FP-12.

Definition text scanned by FP-07:

- `title`
- `life_context`
- `functional_intent`
- `observable_effect`
- `natural_completion`
- `standalone_role_meaning`

Execution blocks and complexity rationale are not scanned by FP-07 in the current implementation.

## 4. Prohibited Terms

`TRAINING_OBJECTIVE_TERMS`:

- `لتعلّم`
- `لتعلم`
- `هدف تدريبي`
- `تدريب`
- `إتقان`
- `اتقان`
- `training objective`
- `mastery`
- `learning objective`

`PERFORMANCE_TERMS`:

- `لتعلّم`
- `لتعلم`
- `تعليم`
- `تدريب`
- `يتدرب`
- `إتقان`
- `اتقان`
- `هدف تدريبي`
- `قدرة`
- `القدرة`
- `جاهزية`
- `استقلالية`
- `مساعدة كاملة`
- `تلقين`
- `تعزيز`
- `نسبة`
- `٪`
- `%`
- `درجة`
- `تقييم`
- `قياس أداء`
- `تكرار`
- `مرات`
- `دقيقة`
- `دقائق`
- `عمر`
- `تشخيص`
- `mastery`
- `training objective`
- `readiness`
- `independence`
- `prompting`
- `score`
- `assessment`
- `percentage`
- `ability`

## 5. Complexity Contract

`ComplexityLevel` values are exactly:

- `simple`
- `moderate`
- `advanced`

`FrameworkComplexity` requires:

- `level: ComplexityLevel`
- `dimensions: ComplexityDimensions`
- `rationale: string`

`ComplexityDimensions` requires exactly four authored text fields:

- `c1_elements: string`
- `c2_coordination: string`
- `c3_variability: string`
- `c4_choice_uncertainty: string`

Complexity is authored and stored, not computed from execution data. Current tests confirm that support/assistance, shared mode, execution block count, runs, independence, mastery, readiness, age, diagnosis, and previous success do not determine complexity.

Numeric C1-C4 scores are not a Production representation.

## 6. Execution Block Contract

`ExecutionBlock` requires:

- `kind: "execution_block"`
- `id: string`
- `order: number`
- `text: string`

An Execution Block is distinct from a Functional Participation. If any execution block text equals the candidate `title` or `standalone_role_meaning` after normalization, FP-06 fails with `EXECUTION_BLOCK_EQUALS_ROLE`.

## 7. Persisted Identity Block

`FunctionalIdentityBlock` is the family-owned persisted identity shape, not the direct reference model.

Fields:

- `schema_version: number`
- `title?: string`
- `life_context: string`
- `functional_intent: string`
- `observable_effect: string`
- `natural_completion: string`
- `standalone_role_meaning?: string`
- `participation_mode: "individual" | "shared"`
- `complexity_level?: "simple" | "moderate" | "advanced"`
- `complexity_rationale?: string`
- `complexity_dimensions?: { c1_elements, c2_coordination, c3_variability, c4_choice_uncertainty }`
- `validated: true`
- `validated_gates: string[]`

Critical distinction:

- `validated` and `validated_gates` are outputs produced after `evaluateFunctionalParticipation` passes.
- They are not inputs that make an invalid candidate valid.
- Unknown complexity dimensions are omitted, never fabricated.

## 8. Next Gate Input Shape

The next 3-case test should create only three candidates: Simple, Moderate, Advanced.
Each should include:

- `id`
- `title`
- `life_context`
- `functional_intent`
- `observable_effect`
- `natural_completion`
- `standalone_role_meaning`
- `participation_mode`
- `complexity.level`
- `complexity.dimensions.c1_elements`
- `complexity.dimensions.c2_coordination`
- `complexity.dimensions.c3_variability`
- `complexity.dimensions.c4_choice_uncertainty`
- `complexity.rationale`
- `execution_blocks[]` with block text distinct from the role itself

Before validation, scan the six definition fields against both prohibited term lists.

## 9. Verdict

PRODUCTION CONTENT CONTRACT EXTRACTION 01 = PASS

Expansion remains PAUSED.
The next allowed step is exactly: build 3 Production-contract-complete candidates, then run canonical validation.

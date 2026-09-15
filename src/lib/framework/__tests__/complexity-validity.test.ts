import { describe, expect, it } from "vitest";
import { evaluateComplexity } from "../complexity-validity";
import {
  FIXTURE_ADVANCED,
  FIXTURE_MODERATE,
  FIXTURE_SHARED,
  FIXTURE_SIMPLE,
} from "../__fixtures__/compliant-fixtures";

describe("complexity validity — CX-01..CX-09", () => {
  it.each([
    ["simple", FIXTURE_SIMPLE],
    ["moderate", FIXTURE_MODERATE],
    ["advanced", FIXTURE_ADVANCED],
    ["shared", FIXTURE_SHARED],
  ])("accepts a structurally authored %s fixture", (_name, fixture) => {
    const evaluated = evaluateComplexity(fixture);
    expect(evaluated.valid).toBe(true);
    expect(evaluated.gates).toHaveLength(9);
    expect(evaluated.failedGates).toEqual([]);
  });

  it("CX-01 rejects complexity before FP validity", () => {
    const evaluated = evaluateComplexity({
      ...FIXTURE_SIMPLE,
      functional_intent: "",
    });
    expect(evaluated.failedGates).toContain("CX-01");
    expect(evaluated.codes).toContain("FP_INVALID");
  });

  it("CX-02 rejects missing, empty and extra dimensions", () => {
    const empty = evaluateComplexity({
      ...FIXTURE_SIMPLE,
      complexity: {
        ...FIXTURE_SIMPLE.complexity,
        dimensions: {
          ...FIXTURE_SIMPLE.complexity.dimensions,
          c3_variability: "",
        },
      },
    });
    expect(empty.codes).toContain("EMPTY_DIMENSION");

    const extra = evaluateComplexity({
      ...FIXTURE_SIMPLE,
      complexity: {
        ...FIXTURE_SIMPLE.complexity,
        dimensions: {
          ...FIXTURE_SIMPLE.complexity.dimensions,
          c5_score: "1",
        },
      },
    });
    expect(extra.codes).toContain("INVALID_DIMENSION_SHAPE");
  });

  it("CX-03 rejects an unknown level at runtime", () => {
    const evaluated = evaluateComplexity({
      ...FIXTURE_SIMPLE,
      complexity: { ...FIXTURE_SIMPLE.complexity, level: "expert" },
    } as unknown as typeof FIXTURE_SIMPLE);
    expect(evaluated.codes).toContain("INVALID_LEVEL");
  });

  it.each([
    ["CX-04", "درجة التعقيد محسوبة آلياً من البيانات", "COMPUTED_OR_SCORED_COMPLEXITY"],
    ["CX-05", "الدور متقدم بسبب عدد كتل التنفيذ", "EXECUTION_BLOCK_DERIVATION"],
    ["CX-06", "الدور متقدم بسبب مستوى مساعدة الشخص", "SUPPORT_DERIVATION"],
    ["CX-07", "الدور بسيط بسبب عدد مرات التنفيذ", "RUN_DERIVATION"],
    ["CX-08", "الدور متقدم لأنه دور مشترك", "SHARED_MODE_DERIVATION"],
    ["CX-09", "التصنيف يعتمد على قدرة الشخص", "PERSON_BASED_CRITERION"],
  ] as const)("%s rejects a prohibited derivation", (gate, rationale, code) => {
    const evaluated = evaluateComplexity({
      ...FIXTURE_MODERATE,
      complexity: { ...FIXTURE_MODERATE.complexity, rationale },
    });
    expect(evaluated.failedGates).toContain(gate);
    expect(evaluated.codes).toContain(code);
  });

  it("does not inspect execution blocks with a blind FP-07 term list", () => {
    const evaluated = evaluateComplexity({
      ...FIXTURE_SIMPLE,
      execution_blocks: [
        ...FIXTURE_SIMPLE.execution_blocks,
        {
          kind: "execution_block",
          id: "contextual-timer-block",
          order: 99,
          text: "تشغيل المؤقت المتفق عليه عند بدء الخَبز",
        },
      ],
    });
    expect(evaluated.valid).toBe(true);
  });

  it("changing blocks or participation mode does not change complexity validity", () => {
    const baseline = evaluateComplexity(FIXTURE_MODERATE);
    const changedExecution = evaluateComplexity({
      ...FIXTURE_MODERATE,
      participation_mode: "shared",
      execution_blocks: [],
    });
    expect(changedExecution).toEqual(baseline);
  });
});

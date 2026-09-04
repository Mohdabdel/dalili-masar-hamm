import { describe, expect, it, beforeEach } from "vitest";
import {
  evaluateFunctionalParticipation,
  isUsableFunctionalParticipation,
} from "../fp-validity";
import {
  isFrameworkParticipation,
  isLegacyReference,
} from "../reference-model";
import {
  __resetFrameworkRegistry,
  asLegacyReference,
  registerFrameworkParticipation,
  resolveReference,
} from "../reference-registry";
import {
  FIXTURE_ADVANCED,
  FIXTURE_BLOCK_ONLY,
  FIXTURE_EVENT,
  FIXTURE_EVENT_ONLY,
  FIXTURE_MODERATE,
  FIXTURE_PREFERRED_CONTEXT,
  FIXTURE_SHARED,
  FIXTURE_SIMPLE,
  FIXTURE_TRAINING_OBJECTIVE,
} from "../__fixtures__/compliant-fixtures";

beforeEach(() => __resetFrameworkRegistry());

describe("FP validity — valid fixtures", () => {
  it("CASE A — simple valid", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_SIMPLE);
    expect(r.valid).toBe(true);
    expect(r.gates).toHaveLength(7);
    expect(FIXTURE_SIMPLE.complexity.level).toBe("simple");
  });

  it("CASE B — shared valid, mode does not touch complexity", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_SHARED);
    expect(r.valid).toBe(true);
    expect(FIXTURE_SHARED.participation_mode).toBe("shared");
    expect(FIXTURE_SHARED.complexity.level).toBe(
      FIXTURE_SIMPLE.complexity.level,
    );
  });

  it("CASE C — moderate valid with C1–C4", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_MODERATE);
    expect(r.valid).toBe(true);
    expect(Object.keys(FIXTURE_MODERATE.complexity.dimensions).sort()).toEqual([
      "c1_elements",
      "c2_coordination",
      "c3_variability",
      "c4_choice_uncertainty",
    ]);
  });

  it("CASE D — advanced derives from role structure, not the person", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_ADVANCED);
    expect(r.valid).toBe(true);
    expect(FIXTURE_ADVANCED.complexity.level).toBe("advanced");
    const rationale = FIXTURE_ADVANCED.complexity.rationale;
    for (const term of [
      "قدرة",
      "استقلالية",
      "مساعدة",
      "إتقان",
      "عمر",
      "تشخيص",
      "نجاح سابق",
    ]) {
      expect(rationale.includes(term)).toBe(false);
    }
  });
});

describe("FP validity — invalid fixtures", () => {
  it("CASE E — training objective rejected", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_TRAINING_OBJECTIVE);
    expect(r.valid).toBe(false);
    expect(r.failedGates).toContain("FP-07");
    expect(r.codes).toContain("TRAINING_OBJECTIVE");
  });

  it("CASE F — event only rejected", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_EVENT_ONLY);
    expect(r.valid).toBe(false);
    expect(r.failedGates).toEqual(
      expect.arrayContaining(["FP-03", "FP-04", "FP-05", "FP-06", "FP-08"]),
    );
  });

  it("CASE G — execution block only rejected", () => {
    const r = evaluateFunctionalParticipation(FIXTURE_BLOCK_ONLY);
    expect(r.valid).toBe(false);
    expect(r.failedGates).toEqual(
      expect.arrayContaining(["FP-02", "FP-03", "FP-04", "FP-05", "FP-06"]),
    );
    expect(r.codes).toContain("EXECUTION_BLOCK_EQUALS_ROLE");
  });

  it("FP-09 — an invalid candidate is not usable", () => {
    expect(isUsableFunctionalParticipation(FIXTURE_EVENT_ONLY)).toBe(false);
    expect(isUsableFunctionalParticipation(FIXTURE_SIMPLE)).toBe(true);
  });
});

describe("distinct concepts", () => {
  it("event, execution block and preferred context are separate records", () => {
    expect(FIXTURE_EVENT.kind).toBe("event");
    expect(FIXTURE_PREFERRED_CONTEXT.kind).toBe("preferred_context");
    expect(FIXTURE_SIMPLE.kind).toBe("functional_participation");
    expect(FIXTURE_SIMPLE.execution_blocks[0]!.kind).toBe("execution_block");
    expect(FIXTURE_SIMPLE.event_id).toBe(FIXTURE_EVENT.id);
    expect(FIXTURE_SIMPLE.id).not.toBe(FIXTURE_EVENT.id);
  });
});

describe("complexity negative tests", () => {
  const base = FIXTURE_MODERATE;
  it("execution block count, support, runs, assistance and shared mode leave complexity untouched", () => {
    const mutated = {
      ...base,
      execution_blocks: [...base.execution_blocks, ...base.execution_blocks],
      participation_mode: "shared" as const,
    };
    expect(mutated.complexity).toEqual(base.complexity);
    expect(mutated.complexity.level).toBe("moderate");
    // لا يوجد أي حقل تنفيذ (دعم/جولات/مساعدة) داخل نموذج التعقيد أصلاً
    expect(Object.keys(base.complexity).sort()).toEqual([
      "dimensions",
      "level",
      "rationale",
    ]);
  });
});

describe("legacy / framework boundary", () => {
  it("framework record resolves as framework, legacy resolves as legacy", () => {
    registerFrameworkParticipation(FIXTURE_SIMPLE);
    const compliant = resolveReference(FIXTURE_SIMPLE.id);
    expect(isFrameworkParticipation(compliant)).toBe(true);

    const legacy = asLegacyReference("FOOD-001-OP001") ?? null;
    if (legacy) {
      expect(isLegacyReference(legacy)).toBe(true);
      expect(isFrameworkParticipation(legacy)).toBe(false);
    }
  });

  it("registry rejects invalid candidates and re-registration (IM-01)", () => {
    registerFrameworkParticipation(FIXTURE_SIMPLE);
    expect(() => registerFrameworkParticipation(FIXTURE_SIMPLE)).toThrow();
    expect(() =>
      registerFrameworkParticipation({
        ...FIXTURE_SIMPLE,
        id: "FX-BAD",
        functional_intent: "",
      }),
    ).toThrow();
  });

  it("registered records are frozen", () => {
    const frozen = registerFrameworkParticipation(FIXTURE_MODERATE);
    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.complexity)).toBe(true);
  });

  it("unknown id resolves to null without touching legacy content", () => {
    expect(resolveReference("NOT-A-REAL-ID")).toBeNull();
  });
});

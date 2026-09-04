import { describe, expect, it } from "vitest";
import {
  EMPTY_FAMILY_ANSWERS,
  draftSelectionForFamilySpec,
  familySpecId,
  isFamilySpecId,
  participationIdFromFamilySpecId,
  specFromFamilyAnswers,
  specFromFrameworkParticipation,
  validateFamilyAnswers,
  type FamilyParticipationAnswers,
} from "@/lib/entry/family-spec";
import {
  REFERENCE_PREFERRED_CONTEXTS,
  findReferencePreferredContext,
  preferredContextDisplayText,
} from "@/lib/entry/preferred-context";
import {
  candidatesForPreferredContext,
  getEasyBeginningCandidate,
} from "@/lib/framework/easy-beginning-corpus";
import { buildFamilyParticipationRow } from "@/lib/family-participation";
import { evaluateFunctionalParticipation } from "@/lib/framework/fp-validity";

const VALID: FamilyParticipationAnswers = {
  title: "إحضار الخبز إلى المائدة",
  lifeContext: "قبل جلوس الأسرة للعشاء",
  functionalIntent: "المائدة تحتاج الخبز قبل بدء الأكل",
  observableEffect: "يصبح الخبز أمام الجالسين",
  naturalCompletion: "يستقر طبق الخبز على المائدة",
  roleMeaning: "تجهيز ما يشاركه الجميع على المائدة",
  mode: "shared",
  context: "home",
  steps: ["يفتح الكيس", "يضع الخبز في الطبق", "يحمل الطبق إلى المائدة"],
};

describe("family participation identity", () => {
  it("مفتاح المواصفة يشتق من هوية المشاركة نفسها", () => {
    const id = "11111111-2222-3333-4444-555555555555";
    const specId = familySpecId(id);
    expect(isFamilySpecId(specId)).toBe(true);
    expect(participationIdFromFamilySpecId(specId)).toBe(id);
    expect(specId.startsWith("KB-")).toBe(false);
  });

  it("لا يُختلق مرجع لمشاركة غير مرجعية", () => {
    const row = buildFamilyParticipationRow({ origin: "family_free" });
    expect(row.reference_spec_id).toBeNull();
    expect(row.opportunity_id).toBeNull();
    expect(row.origin).toBe("family_free");
    expect(() =>
      buildFamilyParticipationRow({
        origin: "easy_beginning",
        reference: { specId: "KB-FAKE", source: "legacy_master" },
      }),
    ).toThrow();
  });
});

describe("family free validity", () => {
  it("تعريف ناقص لا يصبح مشاركة وظيفية", () => {
    expect(validateFamilyAnswers(EMPTY_FAMILY_ANSWERS).valid).toBe(false);
    expect(validateFamilyAnswers({ ...VALID, roleMeaning: "" }).valid).toBe(false);
  });

  it("تعريف مكتمل يمرّ على عقد الصلاحية", () => {
    expect(validateFamilyAnswers(VALID).valid).toBe(true);
  });

  it("مواصفة الأسرة بلا نص مرجعي", () => {
    const spec = specFromFamilyAnswers({ participationId: "p1", answers: VALID });
    expect(spec.provenance).toBe("family");
    expect(spec.majorSteps).toHaveLength(3);
    expect(spec.eventId).toBe("");
  });
});

describe("preferred context", () => {
  it("المقترح المرجعي ثابت لا يُعدَّل", () => {
    const first = REFERENCE_PREFERRED_CONTEXTS[0]!;
    expect(() => {
      (first as { text: string }).text = "تعديل";
    }).toThrow();
    expect(findReferencePreferredContext(first.id)?.text).toBe(first.text);
  });

  it("صياغة الأسرة تُحفظ منفصلة عن نص المرجع", () => {
    const value = {
      id: "PCTX-POPCORN-EVENING",
      source: "reference" as const,
      referenceText: "نص مرجعي",
      familyText: "ليلة الجمعة",
    };
    expect(preferredContextDisplayText(value)).toBe("ليلة الجمعة");
    expect(value.referenceText).toBe("نص مرجعي");
  });
});

describe("easy beginning candidates", () => {
  it("كل مرشح معروض صالح كمشاركة وظيفية", () => {
    const list = candidatesForPreferredContext("PCTX-POPCORN-EVENING");
    expect(list.length).toBeGreaterThan(0);
    for (const c of list) {
      expect(evaluateFunctionalParticipation(c).valid).toBe(true);
    }
  });

  it("المرشح المرجعي يعطي مواصفة بنص مصدر ثابت", () => {
    const candidate = getEasyBeginningCandidate("FR-POPCORN-BRING-001")!;
    const spec = specFromFrameworkParticipation({
      participationId: "p2",
      participation: candidate,
    });
    expect(spec.provenance).toBe("framework_reference");
    expect(spec.title_ar).toBe(candidate.title);
    expect(spec.majorSteps.length).toBe(candidate.execution_blocks.length);
  });
});

describe("entry convergence", () => {
  it("كل الأصول تنتج نفس شكل المسودة", () => {
    const familySpec = specFromFamilyAnswers({ participationId: "p3", answers: VALID });
    const refSpec = specFromFrameworkParticipation({
      participationId: "p4",
      participation: getEasyBeginningCandidate("FR-WATER-JUG-001")!,
    });
    const a = draftSelectionForFamilySpec({ spec: familySpec, origin: "family_free" });
    const b = draftSelectionForFamilySpec({ spec: refSpec, origin: "easy_beginning" });
    expect(Object.keys(a).sort()).toEqual(Object.keys(b).sort());
    expect(a.selected.length).toBe(familySpec.majorSteps.length);
    expect(b.origin).toBe("easy_beginning");
  });
});

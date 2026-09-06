import { describe, expect, it } from "vitest";
import {
  GOLDEN_PARTICIPATION_IDS,
  GOLDEN_PREFERRED_CONTEXT,
  ensureGoldenCorpus,
  getGoldenParticipation,
  listGoldenParticipations,
} from "../golden-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { classifyReferenceSource } from "../source-boundary";
import { identityFromFrameworkParticipation } from "../participation-identity";

describe("Golden reference corpus (FREEZE §11)", () => {
  it("يسجّل الحوافظ الخمس فقط", () => {
    ensureGoldenCorpus();
    expect(GOLDEN_PARTICIPATION_IDS).toHaveLength(5);
    expect(listGoldenParticipations()).toHaveLength(5);
  });

  it("كل تعريف يجتاز البوابات السبع", () => {
    for (const p of listGoldenParticipations()) {
      const result = evaluateFunctionalParticipation(p);
      expect(result.failedGates, `${p.id}: ${result.codes.join(",")}`).toEqual([]);
      expect(result.valid).toBe(true);
    }
  });

  it("يحمل أبعاد C1–C4 ومستوى تشغيلياً واحداً من ثلاثة", () => {
    for (const p of listGoldenParticipations()) {
      expect(["simple", "moderate", "advanced"]).toContain(p.complexity.level);
      const d = p.complexity.dimensions;
      for (const v of [d.c1_elements, d.c2_coordination, d.c3_variability, d.c4_choice_uncertainty]) {
        expect(v.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("الدور المشترك لا يعني متقدماً (CX-08)", () => {
    const shared = getGoldenParticipation("GJ-SHARED-001")!;
    expect(shared.participation_mode).toBe("shared");
    expect(shared.complexity.level).toBe("simple");
  });

  it("لا كتلة تنفيذ تساوي الدور نفسه (FP-11)", () => {
    for (const p of listGoldenParticipations()) {
      for (const b of p.execution_blocks) {
        expect(b.text.trim()).not.toBe(p.title.trim());
      }
    }
  });

  it("حدث واحد يحمل أكثر من دور (FP-10)", () => {
    const hosting = listGoldenParticipations().filter((p) => p.event_id === "EV-HOSTING");
    expect(hosting.map((p) => p.id).sort()).toEqual(["GJ-ADVANCED-001", "GJ-MODERATE-001"]);
  });

  it("تُصنَّف كمرجع إطاري لا محتوى قديم (FP-01)", () => {
    for (const id of GOLDEN_PARTICIPATION_IDS) {
      expect(classifyReferenceSource(id)).toEqual({
        source: "framework_reference",
        frameworkValidated: true,
      });
    }
  });

  it("السجل غير قابل للتعديل (IM-01)", () => {
    const p = getGoldenParticipation("GJ-EASY-001")!;
    expect(() => {
      (p as { title: string }).title = "محاولة كتابة";
    }).toThrow();
    expect(getGoldenParticipation("GJ-EASY-001")!.title).toBe(
      "إحضار البوب كورن إلى مكان جلوس الأسرة",
    );
  });

  it("ينتج كتلة هوية كاملة للمشاركة الأسرية (FA-04)", () => {
    const identity = identityFromFrameworkParticipation(
      getGoldenParticipation("GJ-MODERATE-001")!,
    );
    expect(identity).not.toBeNull();
    if (!identity) return;
    expect(identity.validated).toBe(true);
    expect(identity.complexity_level).toBe("moderate");
    expect(identity.complexity_dimensions?.c1_elements).toBeTruthy();
  });

  it("السياق المفضّل مستقل عن هوية الدور (D01)", () => {
    expect(GOLDEN_PREFERRED_CONTEXT.participation_ids).toEqual([
      "GJ-EASY-001",
      "GJ-SHARED-001",
    ]);
    expect(GOLDEN_PREFERRED_CONTEXT.expansion.length).toBe(4);
  });
});

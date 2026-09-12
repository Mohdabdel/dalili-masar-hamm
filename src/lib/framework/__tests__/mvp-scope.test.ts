import { describe, expect, it } from "vitest";
import { getSpaceSpec } from "@/lab/data/space/catalog";
import { evaluateFunctionalParticipation } from "../fp-validity";
import {
  listMvpScopeParticipations,
  MVP_JOURNEY_PROBES,
  MVP_SCOPE_ID,
  MVP_SCOPE_PARTICIPATION_IDS,
} from "../mvp-scope";
import { classifyReferenceSource } from "../source-boundary";

describe("DALILI MVP scope 01", () => {
  it("يثبت حزمة من 30 مشاركة فقط ولا يحول 1413 Legacy إلى هدف", () => {
    expect(MVP_SCOPE_ID).toBe("DALILI_MVP_SCOPE_01");
    expect(MVP_SCOPE_PARTICIPATION_IDS).toHaveLength(30);
    expect(new Set(MVP_SCOPE_PARTICIPATION_IDS).size).toBe(30);
    expect(MVP_SCOPE_PARTICIPATION_IDS.every((id) => !id.startsWith("KB-"))).toBe(true);
  });

  it("كل عناصر MVP مرجعية ومكتشفة وتجتاز البوابات", () => {
    const participations = listMvpScopeParticipations();
    expect(participations.map((p) => p.id)).toEqual(MVP_SCOPE_PARTICIPATION_IDS);

    for (const participation of participations) {
      expect(classifyReferenceSource(participation.id)).toEqual({
        source: "framework_reference",
        frameworkValidated: true,
      });
      expect(evaluateFunctionalParticipation(participation).valid).toBe(true);
      expect(getSpaceSpec(participation.id)).toBeTruthy();
      expect(participation.execution_blocks.length).toBeGreaterThan(0);
    }
  });

  it("يغطي المجالات العملية الستة ومستويات التعقيد وأنماط المشاركة", () => {
    const participations = listMvpScopeParticipations();
    const ids = participations.map((p) => p.id);
    expect(ids.some((id) => id.includes("HOME") || id.startsWith("GJ-"))).toBe(true);
    expect(ids.some((id) => id.includes("FOOD") || id.startsWith("GJ-"))).toBe(true);
    expect(ids.some((id) => id.includes("SHOP"))).toBe(true);
    expect(ids.some((id) => id.includes("COMM") || id.startsWith("GJ-"))).toBe(true);
    expect(ids.some((id) => id.includes("HEALTH"))).toBe(true);
    expect(ids.some((id) => id.includes("CLO"))).toBe(true);

    expect(new Set(participations.map((p) => p.complexity.level))).toEqual(
      new Set(["simple", "moderate", "advanced"]),
    );
    expect(new Set(participations.map((p) => p.participation_mode))).toEqual(
      new Set(["individual", "shared"]),
    );
  });

  it("يغطي مسارات اختبار MVP الثلاثة دون توسيع جديد", () => {
    const scope: ReadonlySet<string> = new Set(MVP_SCOPE_PARTICIPATION_IDS);
    expect(MVP_JOURNEY_PROBES).toHaveLength(3);
    for (const journey of MVP_JOURNEY_PROBES) {
      expect(journey.participation_ids.length, journey.id).toBeGreaterThanOrEqual(5);
      for (const id of journey.participation_ids) {
        expect(scope.has(id), `${journey.id}: ${id}`).toBe(true);
      }
    }
  });
});

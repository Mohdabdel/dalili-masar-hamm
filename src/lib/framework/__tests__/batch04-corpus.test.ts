import { describe, expect, it } from "vitest";
import { findOpportunityById } from "@/lib/knowledge-base";
import opportunitiesCsv from "@/data/knowledge/03_participation_opportunities.csv?raw";
import { resolveStepImage, suggestStepImage } from "@/features/space/step-image";
import {
  BATCH04_PARTICIPATION_IDS,
  ensureBatch04Corpus,
  getBatch04Lineage,
  getBatch04Participation,
  listBatch04Participations,
} from "../batch04-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { identityFromFrameworkParticipation } from "../participation-identity";
import { classifyReferenceSource } from "../source-boundary";

describe("Batch 04 — تفعيل عينة التوسعة بعد المراجعة الدقيقة", () => {
  it("حد الدفعة اثنا عشر سجلًا من عينة التوسعة المصححة", () => {
    ensureBatch04Corpus();
    expect(BATCH04_PARTICIPATION_IDS).toHaveLength(12);
    expect(listBatch04Participations()).toHaveLength(12);
    expect(BATCH04_PARTICIPATION_IDS.every((id) => id.startsWith("FR-EXP12-"))).toBe(true);
  });

  it("كل سجل يجتاز بوابات المشاركة الوظيفية بعد التفعيل", () => {
    for (const participation of listBatch04Participations()) {
      const result = evaluateFunctionalParticipation(participation);
      expect(
        result.failedGates,
        `${participation.id}: ${result.codes.join(",")}`,
      ).toEqual([]);
    }
  });

  it("كل سجل يحمل هوية كاملة وأبعاد C1-C4 دون مساواة كتلة التنفيذ بعنوان الدور", () => {
    for (const participation of listBatch04Participations()) {
      const identity = identityFromFrameworkParticipation(participation);
      expect(identity).not.toBeNull();
      expect(identity?.validated).toBe(true);
      expect(identity?.complexity_dimensions?.c1_elements).toBeTruthy();
      expect(identity?.complexity_dimensions?.c2_coordination).toBeTruthy();
      expect(identity?.complexity_dimensions?.c3_variability).toBeTruthy();
      expect(identity?.complexity_dimensions?.c4_choice_uncertainty).toBeTruthy();
      expect(["simple", "moderate", "advanced"]).toContain(participation.complexity.level);
      for (const block of participation.execution_blocks) {
        expect(block.text).not.toBe(participation.title);
      }
    }
  });

  it("النسب حتمي ويشير إلى شواهد Legacy دون تحويلها", () => {
    for (const id of BATCH04_PARTICIPATION_IDS) {
      const lineage = getBatch04Lineage(id);
      expect(lineage).not.toBeNull();
      if (!lineage) continue;
      expect(lineage.source_artifact).toBe("DALILI_EXPANSION_SAMPLE_12_CORRECTED_01");
      expect(lineage.batch).toBe("BATCH_04");
      expect(lineage.disposition).toBe("PRECISION_REVIEW_ACCEPT");
      expect(lineage.routing).toBe("GREEN");
      expect(lineage.reference_source).toBe("framework_reference");
      for (const legacyId of lineage.source_evidence_ids) {
        expect(id).not.toBe(legacyId);
        expect(opportunitiesCsv.includes(legacyId), legacyId).toBe(true);
      }
    }
  });

  it("المراجع الجديدة framework_reference والشواهد القديمة legacy_master عند توفرها", () => {
    for (const id of BATCH04_PARTICIPATION_IDS) {
      const lineage = getBatch04Lineage(id)!;
      expect(classifyReferenceSource(id)).toEqual({
        source: "framework_reference",
        frameworkValidated: true,
      });
      for (const legacyId of lineage.source_evidence_ids) {
        if (findOpportunityById(legacyId)) {
          expect(classifyReferenceSource(legacyId)).toEqual({
            source: "legacy_master",
            frameworkValidated: false,
          });
        }
      }
    }
  });

  it("كل كتلة تنفيذ تملك صورة مراجعة جاهزة من أصول EXP12", () => {
    for (const participation of listBatch04Participations()) {
      for (const block of participation.execution_blocks) {
        const ref = suggestStepImage(block.text);
        const resolved = resolveStepImage(ref);
        expect(ref?.sourceAssetCode, `${participation.id}: ${block.text}`).toMatch(/^VRS-EXP12-/);
        expect(resolved.src, `${participation.id}: ${block.text}`).toContain(
          "/assets/execution/expansion12/",
        );
        expect(resolved.compositePending, `${participation.id}: ${block.text}`).toBe(false);
      }
    }
  });

  it("السجل غير قابل للتعديل بعد التسجيل", () => {
    const participation = getBatch04Participation(BATCH04_PARTICIPATION_IDS[0])!;
    const before = participation.title;
    expect(() => {
      (participation as { title: string }).title = "محاولة كتابة";
    }).toThrow();
    expect(getBatch04Participation(BATCH04_PARTICIPATION_IDS[0])!.title).toBe(
      before,
    );
  });
});

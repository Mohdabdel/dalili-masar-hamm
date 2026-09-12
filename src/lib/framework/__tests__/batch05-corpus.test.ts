import { describe, expect, it } from "vitest";
import { findOpportunityById } from "@/lib/knowledge-base";
import opportunitiesCsv from "@/data/knowledge/03_participation_opportunities.csv?raw";
import { resolveStepImage, suggestStepImage } from "@/features/space/step-image";
import {
  BATCH05_PARTICIPATION_IDS,
  ensureBatch05Corpus,
  getBatch05Lineage,
  getBatch05Participation,
  listBatch05Participations,
} from "../batch05-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { identityFromFrameworkParticipation } from "../participation-identity";
import { classifyReferenceSource } from "../source-boundary";

describe("Batch 05 — تفعيل عينة التوسعة الثانية", () => {
  it("حد الدفعة اثنا عشر سجلًا من العينة الثانية المصححة", () => {
    ensureBatch05Corpus();
    expect(BATCH05_PARTICIPATION_IDS).toHaveLength(12);
    expect(listBatch05Participations()).toHaveLength(12);
    expect(BATCH05_PARTICIPATION_IDS.every((id) => id.startsWith("FR-EXP12-02-"))).toBe(true);
  });

  it("كل سجل يجتاز بوابات المشاركة الوظيفية بعد التفعيل", () => {
    for (const participation of listBatch05Participations()) {
      const result = evaluateFunctionalParticipation(participation);
      expect(
        result.failedGates,
        `${participation.id}: ${result.codes.join(",")}`,
      ).toEqual([]);
    }
  });

  it("كل سجل يحمل هوية كاملة وأبعاد C1-C4", () => {
    for (const participation of listBatch05Participations()) {
      const identity = identityFromFrameworkParticipation(participation);
      expect(identity).not.toBeNull();
      expect(identity?.validated).toBe(true);
      expect(identity?.complexity_dimensions?.c1_elements).toBeTruthy();
      expect(identity?.complexity_dimensions?.c2_coordination).toBeTruthy();
      expect(identity?.complexity_dimensions?.c3_variability).toBeTruthy();
      expect(identity?.complexity_dimensions?.c4_choice_uncertainty).toBeTruthy();
      for (const block of participation.execution_blocks) {
        expect(block.id.startsWith(`${participation.id}-b`)).toBe(true);
        expect(block.text).not.toBe(participation.title);
      }
    }
  });

  it("النسب حتمي ويشير إلى شواهد Legacy دون تحويلها", () => {
    for (const id of BATCH05_PARTICIPATION_IDS) {
      const lineage = getBatch05Lineage(id);
      expect(lineage).not.toBeNull();
      if (!lineage) continue;
      expect(lineage.source_artifact).toBe("DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01");
      expect(lineage.batch).toBe("BATCH_05");
      expect(lineage.disposition).toBe("PRECISION_REVIEW_ACCEPT");
      expect(lineage.image_review_status).toBe("IMAGE_REPLACE_LATER");
      for (const legacyId of lineage.source_evidence_ids) {
        expect(id).not.toBe(legacyId);
        expect(opportunitiesCsv.includes(legacyId), legacyId).toBe(true);
      }
    }
  });

  it("المراجع الجديدة framework_reference والشواهد القديمة legacy_master عند توفرها", () => {
    for (const id of BATCH05_PARTICIPATION_IDS) {
      const lineage = getBatch05Lineage(id)!;
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

  it("كل كتلة تنفيذ تملك صورة مبدئية قابلة للعرض من EXP12-02", () => {
    for (const participation of listBatch05Participations()) {
      for (const block of participation.execution_blocks) {
        const ref = suggestStepImage(block.text);
        const resolved = resolveStepImage(ref);
        expect(ref?.sourceAssetCode, `${participation.id}: ${block.text}`).toMatch(/^VRS-EXP12-02-/);
        expect(resolved.src, `${participation.id}: ${block.text}`).toContain(
          "/assets/execution/expansion12-02/",
        );
        expect(resolved.compositePending, `${participation.id}: ${block.text}`).toBe(false);
      }
    }
  });

  it("السجل غير قابل للتعديل بعد التسجيل", () => {
    const participation = getBatch05Participation(BATCH05_PARTICIPATION_IDS[0])!;
    const before = participation.title;
    expect(() => {
      (participation as { title: string }).title = "محاولة كتابة";
    }).toThrow();
    expect(getBatch05Participation(BATCH05_PARTICIPATION_IDS[0])!.title).toBe(
      before,
    );
  });
});

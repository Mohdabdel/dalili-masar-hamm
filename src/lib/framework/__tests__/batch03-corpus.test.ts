import { describe, expect, it } from "vitest";
import { findOpportunityById } from "@/lib/knowledge-base";
import opportunitiesCsv from "@/data/knowledge/03_participation_opportunities.csv?raw";
import {
  BATCH03_PARTICIPATION_IDS,
  ensureBatch03Corpus,
  getBatch03Lineage,
  getBatch03Participation,
  listBatch03Participations,
} from "../batch03-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { identityFromFrameworkParticipation } from "../participation-identity";
import { classifyReferenceSource } from "../source-boundary";

describe("Batch 03 — مراجع مشتقة بعد مراجعة مكتبية", () => {
  it("حد الدفعة ستة سجلات ممثلة للنطاقات الحالية", () => {
    ensureBatch03Corpus();
    expect(BATCH03_PARTICIPATION_IDS).toHaveLength(6);
    expect(listBatch03Participations()).toHaveLength(6);
  });

  it("كل سجل يجتاز بوابات المشاركة الوظيفية", () => {
    for (const participation of listBatch03Participations()) {
      const result = evaluateFunctionalParticipation(participation);
      expect(
        result.failedGates,
        `${participation.id}: ${result.codes.join(",")}`,
      ).toEqual([]);
    }
  });

  it("كل سجل يحمل هوية كاملة وأبعاد C1-C4", () => {
    for (const participation of listBatch03Participations()) {
      const identity = identityFromFrameworkParticipation(participation);
      expect(identity).not.toBeNull();
      expect(identity?.validated).toBe(true);
      expect(identity?.complexity_dimensions?.c1_elements).toBeTruthy();
      expect(identity?.complexity_dimensions?.c2_coordination).toBeTruthy();
      expect(identity?.complexity_dimensions?.c3_variability).toBeTruthy();
      expect(identity?.complexity_dimensions?.c4_choice_uncertainty).toBeTruthy();
      expect(["simple", "moderate"]).toContain(participation.complexity.level);
    }
  });

  it("النَسَب حتمي ويشير إلى شواهد قديمة موجودة دون تحويلها", () => {
    for (const id of BATCH03_PARTICIPATION_IDS) {
      const lineage = getBatch03Lineage(id);
      expect(lineage).not.toBeNull();
      if (!lineage) continue;
      expect(lineage.batch).toBe("BATCH_03");
      expect(lineage.disposition).toBe("DESK_REVIEW_ACCEPT");
      expect(lineage.routing).toBe("GREEN");
      expect(lineage.reference_source).toBe("framework_reference");
      expect(id.startsWith("FR-B03-")).toBe(true);
      for (const legacyId of lineage.source_evidence_ids) {
        expect(id).not.toBe(legacyId);
        expect(opportunitiesCsv.includes(legacyId), legacyId).toBe(true);
      }
    }
  });

  it("المراجع الجديدة framework_reference والشواهد القديمة legacy_master", () => {
    for (const id of BATCH03_PARTICIPATION_IDS) {
      const lineage = getBatch03Lineage(id)!;
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
        } else {
          // بعض الشواهد القديمة موجودة في CSV لكنها غير مكشوفة لأنها بلا بطاقة مكتملة.
          expect(classifyReferenceSource(legacyId)).toBeNull();
        }
      }
    }
  });

  it("السجل غير قابل للتعديل بعد التسجيل", () => {
    const participation = getBatch03Participation(BATCH03_PARTICIPATION_IDS[0])!;
    const before = participation.title;
    expect(() => {
      (participation as { title: string }).title = "محاولة كتابة";
    }).toThrow();
    expect(getBatch03Participation(BATCH03_PARTICIPATION_IDS[0])!.title).toBe(
      before,
    );
  });
});

import { describe, expect, it } from "vitest";
import {
  BATCH02_PARTICIPATION_IDS,
  ensureBatch02Corpus,
  getBatch02Participation,
  getMigrationLineage,
  listBatch02Participations,
} from "../batch02-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { classifyReferenceSource } from "../source-boundary";
import { identityFromFrameworkParticipation } from "../participation-identity";
import { findOpportunityById } from "@/lib/knowledge-base";

describe("Batch 02 — مراجع مشتقة من قرارات هجرة موثّقة", () => {
  it("حد الدفعة خمسة سجلات على الأكثر", () => {
    ensureBatch02Corpus();
    expect(BATCH02_PARTICIPATION_IDS.length).toBeLessThanOrEqual(5);
    expect(listBatch02Participations()).toHaveLength(
      BATCH02_PARTICIPATION_IDS.length,
    );
  });

  it("كل سجل يجتاز البوابات السبع", () => {
    for (const p of listBatch02Participations()) {
      const r = evaluateFunctionalParticipation(p);
      expect(r.failedGates, `${p.id}: ${r.codes.join(",")}`).toEqual([]);
    }
  });

  it("كل سجل يحمل هوية كاملة وأبعاد C1–C4", () => {
    for (const p of listBatch02Participations()) {
      const identity = identityFromFrameworkParticipation(p);
      expect(identity).not.toBeNull();
      expect(identity?.validated).toBe(true);
      const d = p.complexity.dimensions;
      for (const v of [
        d.c1_elements,
        d.c2_coordination,
        d.c3_variability,
        d.c4_choice_uncertainty,
      ]) {
        expect(v.trim().length).toBeGreaterThan(0);
      }
      expect(["simple", "moderate", "advanced"]).toContain(p.complexity.level);
    }
  });

  it("لم يُفرَض أي مستوى متقدّم في هذه الدفعة", () => {
    expect(
      listBatch02Participations().some((p) => p.complexity.level === "advanced"),
    ).toBe(false);
  });

  it("النَسَب حتمي ويشير إلى صف قديم لا يزال موجوداً كما هو", () => {
    for (const id of BATCH02_PARTICIPATION_IDS) {
      const lineage = getMigrationLineage(id);
      expect(lineage).not.toBeNull();
      if (!lineage) continue;
      expect(lineage.batch).toBe("BATCH_02");
      expect(lineage.routing).toBe("GREEN");
      expect(lineage.reference_source).toBe("framework_reference");
      const legacy = findOpportunityById(lineage.legacy_id);
      expect(legacy, lineage.legacy_id).not.toBeNull();
      expect(legacy?.name).toBe(lineage.legacy_title);
      // المعرّف الجديد منفصل تماماً عن معرّف الصف القديم (لا تحويل في المكان).
      expect(id).not.toBe(lineage.legacy_id);
    }
  });

  it("الصف القديم يبقى legacy_master والمرجع الجديد framework_reference", () => {
    for (const id of BATCH02_PARTICIPATION_IDS) {
      const lineage = getMigrationLineage(id)!;
      expect(classifyReferenceSource(id)).toEqual({
        source: "framework_reference",
        frameworkValidated: true,
      });
      expect(classifyReferenceSource(lineage.legacy_id)).toEqual({
        source: "legacy_master",
        frameworkValidated: false,
      });
    }
  });

  it("السجل غير قابل للتعديل بعد التسجيل", () => {
    const p = getBatch02Participation(BATCH02_PARTICIPATION_IDS[0])!;
    const before = p.title;
    expect(() => {
      (p as { title: string }).title = "محاولة كتابة";
    }).toThrow();
    expect(getBatch02Participation(BATCH02_PARTICIPATION_IDS[0])!.title).toBe(
      before,
    );
  });

  it("لا يوجد تصادم مع المجموعة الذهبية أو بذور الأساس", () => {
    const ids = new Set(BATCH02_PARTICIPATION_IDS);
    expect(ids.size).toBe(BATCH02_PARTICIPATION_IDS.length);
    for (const id of ids) expect(id.startsWith("FR-B02-")).toBe(true);
  });
});

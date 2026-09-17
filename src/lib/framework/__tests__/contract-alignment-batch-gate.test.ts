import { describe, expect, it } from "vitest";
import {
  evaluateAlignmentSourceOutcome,
  evaluateSafety,
  type AlignmentCandidate,
  type AlignmentSourceIdentity,
  type AlignmentSourceOutcome,
} from "../contract-alignment-batch-gate";

const identity: AlignmentSourceIdentity = { sourceId: "HOME-001-OP001", sourceHash: "a".repeat(64), parentEventId: "HOME-001", domainId: "DOM-HOME" };
const candidate: AlignmentCandidate = {
  id: "CA-FP-1", title: "وضع الرسالة في الصندوق", life_context: "عند تجهيز البريد توجد رسالة تحتاج إلى وضعها في صندوق الإرسال.", functional_intent: "إيصال الرسالة إلى نقطة جمع البريد.", observable_effect: "تصبح الرسالة داخل صندوق البريد.", natural_completion: "ينتهي الدور عند استقرار الرسالة داخل الصندوق.", standalone_role_meaning: "نقل مادة بريدية إلى نقطة جمع دور قائم بذاته.", participation_mode: "individual",
  complexity: { level: "simple", dimensions: { c1_elements: "رسالة وصندوق.", c2_coordination: "نقل مباشر.", c3_variability: "موضع الصندوق قد يختلف.", c4_choice_uncertainty: "الوجهة محددة." }, rationale: "عنصر واحد ووجهة واحدة." },
  execution_blocks: [{ kind: "execution_block", id: "B1", order: 1, text: "وضع الرسالة داخل الصندوق" }],
  lineage: { legacy_source_ids: [identity.sourceId], source_record_sha256: identity.sourceHash, source_disposition: "REWRITE_REQUIRED", parent_event_id: identity.parentEventId, domain_id: identity.domainId },
};
const outcome: AlignmentSourceOutcome = { ...identity, disposition: "REWRITE_REQUIRED", candidateIds: [candidate.id], declaredRoute: "GREEN", materializationPerformed: false };
const run = (o = outcome, cs: AlignmentCandidate[] = [candidate], ids = [identity], targets = new Set<string>()) => evaluateAlignmentSourceOutcome(o, cs, ids, targets);

describe("contract alignment batch gate", () => {
  it("accepts an exact bidirectional mapping", () => expect(run()).toMatchObject({ valid: true, route: "GREEN", codes: [] }));
  it("fails closed on hash mismatch", () => expect(run({ ...outcome, sourceHash: "b".repeat(64) }).codes).toContain("SOURCE_HASH_MISMATCH"));
  it("rejects orphan reverse lineage", () => expect(run(outcome, [candidate, { ...candidate, id: "ORPHAN" }]).codes).toContain("ORPHAN_CANDIDATE"));
  it("rejects duplicate candidate links", () => expect(run({ ...outcome, candidateIds: [candidate.id, candidate.id] }).codes).toContain("DUPLICATE_CANDIDATE_LINK"));
  it("requires complete split lineage", () => expect(run({ ...outcome, disposition: "SPLIT_REQUIRED" }).codes).toContain("INVALID_SPLIT_COUNT"));
  it("requires a controlled merge target", () => {
    const merged = { ...outcome, disposition: "MERGED_BY_PROVENANCE" as const, candidateIds: [], mergeTargetId: "FP-X", declaredRoute: undefined };
    expect(run(merged, []).codes).toContain("INVALID_MERGE_TARGET");
    expect(run(merged, [], [identity], new Set(["FP-X"])).route).toBe("GREEN");
  });
  it("routes a controlled Arabic hazard to AMBER", () => {
    const hazardous = { ...candidate, title: "قطع الخبز بسكين" };
    expect(evaluateSafety(hazardous).hazards).toContain("SHARP");
    expect(run({ ...outcome, declaredRoute: "AMBER" }, [hazardous]).route).toBe("AMBER");
  });
  it("does not confuse Arabic words containing دم or a generic surface with hazards", () => {
    expect(evaluateSafety({ ...candidate, title: "استخدام المقعد وتقديم البطاقة" }).hazards).not.toContain("BIOLOGICAL");
    expect(evaluateSafety({ ...candidate, title: "مسح سطح الطاولة" }).hazards).not.toContain("HEIGHT");
    expect(evaluateSafety({ ...candidate, title: "جمع البقايا على السطح" }).hazards).not.toContain("HEIGHT");
    expect(evaluateSafety({ ...candidate, title: "تنظيف دم ظاهر" }).hazards).toContain("BIOLOGICAL");
    expect(evaluateSafety({ ...candidate, title: "الوصول إلى المقصورة المقصودة" }).hazards).not.toContain("SHARP");
    expect(evaluateSafety({ ...candidate, title: "استخدام مقص لقص الورق" }).hazards).toContain("SHARP");
    expect(evaluateSafety({ ...candidate, title: "فحص التغليف" }).hazards).not.toContain("HEAT");
    expect(evaluateSafety({ ...candidate, title: "ترتيب ألعاب المركبات" }).hazards).not.toContain("TRAFFIC");
    expect(evaluateSafety({ ...candidate, title: "تجنب مرور المركبات" }).hazards).toContain("TRAFFIC");
  });
  it("rejects a forged route", () => expect(run({ ...outcome, declaredRoute: "AMBER" }).codes).toContain("FORGED_ROUTE"));
  it("rejects any materialization", () => expect(run({ ...outcome, materializationPerformed: true }).codes).toContain("MATERIALIZATION_FORBIDDEN"));
});

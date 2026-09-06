// هوية المشاركة الوظيفية المحفوظة على المشاركة الأسرية (FA-04).
// المالك الوحيد: active_participations.id — لا هوية ثانية ولا جدول موازٍ.
// الكتلة تصف «ما هذه المشاركة»، ولا تحمل خطوات تنفيذ ولا دعماً ولا سياقاً مفضّلاً
// ولا أي وصف لقدرة الشخص. أبعاد التعقيد تُحفظ فقط حين تكون معروفة فعلاً (CX-02 خارج النطاق).

import {
  evaluateFunctionalParticipation,
  type FpValidityResult,
} from "./fp-validity";
import type {
  CandidateFunctionalParticipation,
  ComplexityDimensions,
  ComplexityLevel,
  FunctionalParticipation,
  ParticipationMode,
} from "./reference-model";

export const IDENTITY_SCHEMA_VERSION = 1;

export interface FunctionalIdentityBlock {
  schema_version: number;
  title?: string;
  life_context: string;
  functional_intent: string;
  observable_effect: string;
  natural_completion: string;
  standalone_role_meaning?: string;
  participation_mode: ParticipationMode;
  complexity_level?: ComplexityLevel;
  complexity_rationale?: string;
  /** يُحفظ فقط عندما تكون الأبعاد الأربعة معروفة فعلاً — لا تُختلق أبداً. */
  complexity_dimensions?: ComplexityDimensions;
  validated: true;
  validated_gates: string[];
}

function trimmed(value: string | undefined): string {
  return (value ?? "").trim();
}

/**
 * بناء كتلة الهوية من تعريف مرشّح — بعد اجتياز بوابات Foundation 02 حصراً.
 * إن سقطت أي بوابة تُعاد `null`: لا يجوز لحدث أو كتلة تنفيذ أن تصير مشاركة
 * وظيفية لمجرد امتلاء الحقول.
 */
export function identityFromValidatedCandidate(
  candidate: CandidateFunctionalParticipation,
  extra?: {
    complexityLevel?: ComplexityLevel;
    complexityRationale?: string;
    complexityDimensions?: ComplexityDimensions;
  },
): FunctionalIdentityBlock | null {
  const result: FpValidityResult = evaluateFunctionalParticipation(candidate);
  if (!result.valid) return null;

  const block: FunctionalIdentityBlock = {
    schema_version: IDENTITY_SCHEMA_VERSION,
    life_context: trimmed(candidate.life_context),
    functional_intent: trimmed(candidate.functional_intent),
    observable_effect: trimmed(candidate.observable_effect),
    natural_completion: trimmed(candidate.natural_completion),
    participation_mode: candidate.participation_mode as ParticipationMode,
    validated: true,
    validated_gates: result.gates.map((g) => g.gate),
  };
  const title = trimmed(candidate.title);
  if (title) block.title = title;
  const role = trimmed(candidate.standalone_role_meaning);
  if (role) block.standalone_role_meaning = role;

  const level = extra?.complexityLevel ?? candidate.complexity?.level;
  if (level) block.complexity_level = level;
  const rationale = trimmed(
    extra?.complexityRationale ?? candidate.complexity?.rationale,
  );
  if (rationale) block.complexity_rationale = rationale;

  const dims = extra?.complexityDimensions ?? candidate.complexity?.dimensions;
  if (
    dims &&
    trimmed(dims.c1_elements) &&
    trimmed(dims.c2_coordination) &&
    trimmed(dims.c3_variability) &&
    trimmed(dims.c4_choice_uncertainty)
  ) {
    block.complexity_dimensions = { ...dims };
  }

  return block;
}

/** كتلة هوية من مشاركة مرجعية متوافقة مع الإطار — الأبعاد معروفة فتُحفظ كما هي. */
export function identityFromFrameworkParticipation(
  participation: FunctionalParticipation,
): FunctionalIdentityBlock | null {
  return identityFromValidatedCandidate(participation);
}

export type IdentityCompleteness = "complete" | "partial" | "none";

/** تصنيف اكتمال الهوية المحفوظة — بلا أي تخمين للحقول الناقصة. */
export function identityCompleteness(
  value: unknown,
): IdentityCompleteness {
  if (!value || typeof value !== "object") return "none";
  const b = value as Partial<FunctionalIdentityBlock>;
  const core = [
    b.life_context,
    b.functional_intent,
    b.observable_effect,
    b.natural_completion,
    b.participation_mode,
  ];
  if (core.some((v) => !v)) return "partial";
  return b.complexity_level && b.complexity_rationale ? "complete" : "partial";
}

/** قراءة آمنة للكتلة المخزّنة في قاعدة البيانات. */
export function parseIdentityBlock(
  value: unknown,
): FunctionalIdentityBlock | null {
  if (identityCompleteness(value) === "none") return null;
  return value as FunctionalIdentityBlock;
}

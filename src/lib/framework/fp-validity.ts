// عقد صلاحية المشاركة الوظيفية — سبع بوابات حصراً (FP-01..FP-09)
// مع حراسة FP-11 و FP-12. يعمل على تعريف المشاركة لا على الشخص.
// لا يُنتج أي درجة أو نسبة أو جاهزية (IM-05).

import type {
  CandidateFunctionalParticipation,
  FunctionalParticipation,
} from "./reference-model";

export type FpGateId =
  | "FP-02"
  | "FP-03"
  | "FP-04"
  | "FP-05"
  | "FP-06"
  | "FP-07"
  | "FP-08";

export type FpFailureCode =
  | "MISSING_LIFE_CONTEXT"
  | "MISSING_FUNCTIONAL_INTENT"
  | "MISSING_OBSERVABLE_EFFECT"
  | "MISSING_NATURAL_COMPLETION"
  | "ROLE_NOT_INDEPENDENT"
  | "EXECUTION_BLOCK_EQUALS_ROLE"
  | "PERFORMANCE_LANGUAGE"
  | "TRAINING_OBJECTIVE"
  | "MISSING_PARTICIPATION_MODE"
  | "INVALID_PARTICIPATION_MODE";

export interface FpGateResult {
  gate: FpGateId;
  name: string;
  passed: boolean;
  code?: FpFailureCode;
  reason?: string;
}

export interface FpValidityResult {
  valid: boolean;
  /** نتائج البوابات السبع بالترتيب المجمّد. */
  gates: FpGateResult[];
  failedGates: FpGateId[];
  codes: FpFailureCode[];
}

const GATE_NAMES: Record<FpGateId, string> = {
  "FP-02": "Life Context",
  "FP-03": "Functional Intent",
  "FP-04": "Contribution / Observable Effect",
  "FP-05": "Natural Completion",
  "FP-06": "Functional Independence of Role",
  "FP-07": "Performance Neutrality",
  "FP-08": "Participation Mode",
};

/** ألفاظ الأداء/القدرة/التدريب الممنوعة في تعريف الدور (FP-07، FP-12). */
const PERFORMANCE_TERMS: string[] = [
  "لتعلّم",
  "لتعلم",
  "تعليم",
  "تدريب",
  "يتدرب",
  "إتقان",
  "اتقان",
  "هدف تدريبي",
  "قدرة",
  "القدرة",
  "جاهزية",
  "استقلالية",
  "مساعدة كاملة",
  "تلقين",
  "تعزيز",
  "نسبة",
  "٪",
  "%",
  "درجة",
  "تقييم",
  "قياس أداء",
  "تكرار",
  "مرات",
  "دقيقة",
  "دقائق",
  "عمر",
  "تشخيص",
  "mastery",
  "training objective",
  "readiness",
  "independence",
  "prompting",
  "score",
  "assessment",
  "percentage",
  "ability",
];

const TRAINING_OBJECTIVE_TERMS: string[] = [
  "لتعلّم",
  "لتعلم",
  "هدف تدريبي",
  "تدريب",
  "إتقان",
  "اتقان",
  "training objective",
  "mastery",
  "learning objective",
];

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function findTerm(text: string, terms: string[]): string | null {
  const haystack = normalize(text);
  for (const term of terms) {
    if (haystack.includes(normalize(term))) return term;
  }
  return null;
}

/** الحقول النصية التي تُشكّل تعريف الدور (لا كتل التنفيذ ولا التعقيد). */
function definitionText(c: CandidateFunctionalParticipation): string {
  return [
    c.title,
    c.life_context,
    c.functional_intent,
    c.observable_effect,
    c.natural_completion,
    c.standalone_role_meaning,
  ]
    .filter(nonEmpty)
    .join(" | ");
}

function gate(
  id: FpGateId,
  passed: boolean,
  code?: FpFailureCode,
  reason?: string,
): FpGateResult {
  return passed
    ? { gate: id, name: GATE_NAMES[id], passed: true }
    : { gate: id, name: GATE_NAMES[id], passed: false, code, reason };
}

/**
 * تقييم صلاحية مشاركة وظيفية مرشحة قبل أي اعتبار للتعقيد (CX-01).
 * حتمي وقابل للاختبار، ويعيد نتيجة مركّبة لا قيمة منطقية مبهمة.
 */
export function evaluateFunctionalParticipation(
  candidate: CandidateFunctionalParticipation,
): FpValidityResult {
  const gates: FpGateResult[] = [];

  gates.push(
    gate(
      "FP-02",
      nonEmpty(candidate.life_context),
      "MISSING_LIFE_CONTEXT",
      "الدور غير مذكور داخل موقف حياتي حقيقي.",
    ),
  );

  gates.push(
    gate(
      "FP-03",
      nonEmpty(candidate.functional_intent),
      "MISSING_FUNCTIONAL_INTENT",
      "سبب حاجة الموقف إلى الدور غير مذكور.",
    ),
  );

  gates.push(
    gate(
      "FP-04",
      nonEmpty(candidate.observable_effect),
      "MISSING_OBSERVABLE_EFFECT",
      "لا يوجد أثر ملحوظ في الحدث أو البيئة أو التفاعل.",
    ),
  );

  gates.push(
    gate(
      "FP-05",
      nonEmpty(candidate.natural_completion),
      "MISSING_NATURAL_COMPLETION",
      "النهاية الطبيعية للدور غير مذكورة.",
    ),
  );

  // بوابة 5: استقلال الدور — مع حراسة FP-11 (كتلة تنفيذ = الدور نفسه).
  const roleText = nonEmpty(candidate.standalone_role_meaning)
    ? normalize(candidate.standalone_role_meaning)
    : "";
  const titleText = nonEmpty(candidate.title) ? normalize(candidate.title) : "";
  const blockEqualsRole = (candidate.execution_blocks ?? []).some((b) => {
    const t = normalize(b.text ?? "");
    return t.length > 0 && (t === titleText || t === roleText);
  });
  if (!nonEmpty(candidate.standalone_role_meaning)) {
    gates.push(
      gate(
        "FP-06",
        false,
        "ROLE_NOT_INDEPENDENT",
        "الدور لا يحمل معنى وظيفياً عند فصله عن النشاط الأكبر.",
      ),
    );
  } else if (blockEqualsRole) {
    gates.push(
      gate(
        "FP-06",
        false,
        "EXECUTION_BLOCK_EQUALS_ROLE",
        "إحدى كتل التنفيذ تساوي الدور نفسه (FP-11).",
      ),
    );
  } else {
    gates.push(gate("FP-06", true));
  }

  // بوابة 6: حياد الأداء + منع صياغة الهدف التدريبي (FP-07، FP-12).
  const text = definitionText(candidate);
  const trainingTerm = findTerm(text, TRAINING_OBJECTIVE_TERMS);
  const performanceTerm = findTerm(text, PERFORMANCE_TERMS);
  if (trainingTerm) {
    gates.push(
      gate(
        "FP-07",
        false,
        "TRAINING_OBJECTIVE",
        `تعريف الدور يصوغه كهدف تدريبي/تعلّمي: «${trainingTerm}».`,
      ),
    );
  } else if (performanceTerm) {
    gates.push(
      gate(
        "FP-07",
        false,
        "PERFORMANCE_LANGUAGE",
        `تعريف الدور يحتوي لغة أداء/قدرة/قياس: «${performanceTerm}».`,
      ),
    );
  } else {
    gates.push(gate("FP-07", true));
  }

  const mode = candidate.participation_mode;
  if (!mode) {
    gates.push(
      gate(
        "FP-08",
        false,
        "MISSING_PARTICIPATION_MODE",
        "نمط المشاركة غير معلن.",
      ),
    );
  } else if (mode !== "individual" && mode !== "shared") {
    gates.push(
      gate(
        "FP-08",
        false,
        "INVALID_PARTICIPATION_MODE",
        "نمط المشاركة يجب أن يكون فردياً أو تشاركياً/تكاملياً.",
      ),
    );
  } else {
    gates.push(gate("FP-08", true));
  }

  const failed = gates.filter((g) => !g.passed);
  return {
    valid: failed.length === 0,
    gates,
    failedGates: failed.map((g) => g.gate),
    codes: failed.map((g) => g.code!).filter(Boolean),
  };
}

/** FP-09: لا يصبح المرشح مشاركة وظيفية قابلة للاستخدام إن سقطت أي بوابة. */
export function isUsableFunctionalParticipation(
  candidate: CandidateFunctionalParticipation,
): candidate is CandidateFunctionalParticipation & FunctionalParticipation {
  return evaluateFunctionalParticipation(candidate).valid;
}

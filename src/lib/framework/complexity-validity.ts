// مدقق التعقيد المستقل — يعمل فقط بعد صلاحية المشاركة الوظيفية (CX-01).
// لا يحسب التعقيد ولا يستنتجه من التنفيذ أو الشخص؛ يفحص تمثيلاً تحريرياً مخزناً.

import { evaluateFunctionalParticipation } from "./fp-validity";
import type { CandidateFunctionalParticipation } from "./reference-model";

export type ComplexityGateId =
  | "CX-01"
  | "CX-02"
  | "CX-03"
  | "CX-04"
  | "CX-05"
  | "CX-06"
  | "CX-07"
  | "CX-08"
  | "CX-09";

export type ComplexityFailureCode =
  | "FP_INVALID"
  | "MISSING_COMPLEXITY"
  | "INVALID_DIMENSION_SHAPE"
  | "EMPTY_DIMENSION"
  | "INVALID_LEVEL"
  | "MISSING_RATIONALE"
  | "COMPUTED_OR_SCORED_COMPLEXITY"
  | "EXECUTION_BLOCK_DERIVATION"
  | "SUPPORT_DERIVATION"
  | "RUN_DERIVATION"
  | "SHARED_MODE_DERIVATION"
  | "PERSON_BASED_CRITERION";

export interface ComplexityGateResult {
  gate: ComplexityGateId;
  passed: boolean;
  code?: ComplexityFailureCode;
  reason?: string;
}

export interface ComplexityValidityResult {
  valid: boolean;
  gates: ComplexityGateResult[];
  failedGates: ComplexityGateId[];
  codes: ComplexityFailureCode[];
}

const DIMENSION_KEYS = [
  "c1_elements",
  "c2_coordination",
  "c3_variability",
  "c4_choice_uncertainty",
] as const;

const LEVELS = new Set(["simple", "moderate", "advanced"]);

const COMPUTED_PATTERNS = [
  /(?:حُسب|محسوب|احتُسب|ناتج)\s+(?:آلي|تلقائي|من)/u,
  /(?:درجة|نقاط)\s*(?:التعقيد|c[1-4])/iu,
  /(?:computed|calculated|score)\s+(?:complexity|from)/iu,
];

const EXECUTION_DERIVATION_PATTERNS = [
  /(?:عدد|كثرة|قلة)\s+(?:كتل|خطوات)\s+(?:التنفيذ|مساحة العمل)/u,
  /(?:execution|workspace)\s+(?:block|step)\s+count/iu,
];

const SUPPORT_DERIVATION_PATTERNS = [
  /(?:وجود|غياب|استخدام|نوع|مستوى)\s+(?:ال)?(?:دعم|مساعدة)/u,
  /(?:support|assistance)\s+(?:use|level|count|present|absence)/iu,
];

const RUN_DERIVATION_PATTERNS = [
  /(?:عدد|تكرار|مرات)\s+(?:الجولات|المشاركات|التنفيذ)/u,
  /(?:run|attempt|repetition)\s+count/iu,
];

const SHARED_DERIVATION_PATTERNS = [
  /(?:متقدم|معقد)\s+(?:لأنه|بسبب)\s+(?:دور(?:اً|ا)?\s+)?(?:مشترك|تشاركي|تكاملي)/u,
  /(?:shared|complementary)\s+(?:therefore|means|implies)\s+(?:advanced|complex)/iu,
];

const PERSON_CRITERION_PATTERNS = [
  /(?:قدرة|قدرات|استقلالية|إتقان|اتقان|جاهزية|تشخيص|عمر|مساعدة|دعم)\s+(?:الشخص|المتعلم|الفرد)/u,
  /(?:نجاح|أداء)\s+سابق/u,
  /(?:نسبة|درجة|مستوى)\s+(?:نجاح|أداء|استقلال|قدرة|مساعدة)/u,
  /(?:ability|independence|mastery|diagnosis|age|assistance|readiness|previous success)/iu,
];

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function matchesAny(text: string, patterns: readonly RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function result(
  gate: ComplexityGateId,
  passed: boolean,
  code?: ComplexityFailureCode,
  reason?: string,
): ComplexityGateResult {
  return passed ? { gate, passed } : { gate, passed, code, reason };
}

function complexityText(candidate: CandidateFunctionalParticipation): string {
  const complexity = candidate.complexity;
  if (!complexity) return "";
  return [
    complexity.dimensions?.c1_elements,
    complexity.dimensions?.c2_coordination,
    complexity.dimensions?.c3_variability,
    complexity.dimensions?.c4_choice_uncertainty,
    complexity.rationale,
  ]
    .filter(nonEmpty)
    .join(" | ");
}

/**
 * يفحص تمثيل التعقيد المؤلّف. لا يقرأ Runs أو Supports ولا يعدّ Execution Blocks،
 * ولذلك لا يمكن لهذه البيانات أن تغيّر النتيجة (CX-04..CX-07).
 */
export function evaluateComplexity(
  candidate: CandidateFunctionalParticipation,
): ComplexityValidityResult {
  const gates: ComplexityGateResult[] = [];
  const fpValid = evaluateFunctionalParticipation(candidate).valid;
  gates.push(
    result(
      "CX-01",
      fpValid,
      "FP_INVALID",
      "لا يجوز الوصول إلى تصنيف التعقيد قبل اجتياز صلاحية المشاركة الوظيفية.",
    ),
  );

  const complexity = candidate.complexity;
  const dimensions = complexity?.dimensions;
  const actualKeys =
    dimensions && typeof dimensions === "object"
      ? Object.keys(dimensions).sort()
      : [];
  const expectedKeys = [...DIMENSION_KEYS].sort();
  const exactShape =
    !!dimensions &&
    actualKeys.length === expectedKeys.length &&
    actualKeys.every((key, index) => key === expectedKeys[index]);
  const dimensionsComplete =
    exactShape && DIMENSION_KEYS.every((key) => nonEmpty(dimensions[key]));
  gates.push(
    result(
      "CX-02",
      !!complexity && dimensionsComplete,
      !complexity
        ? "MISSING_COMPLEXITY"
        : !exactShape
          ? "INVALID_DIMENSION_SHAPE"
          : "EMPTY_DIMENSION",
      "التعقيد يحتاج أبعاد C1–C4 الأربعة حصراً، وكل بعد نص تحريري غير فارغ.",
    ),
  );

  gates.push(
    result(
      "CX-03",
      !!complexity && LEVELS.has(complexity.level),
      "INVALID_LEVEL",
      "المستوى يجب أن يكون simple أو moderate أو advanced.",
    ),
  );

  const text = complexityText(candidate);
  const hasRationale = nonEmpty(complexity?.rationale);
  const computed = matchesAny(text, COMPUTED_PATTERNS);
  gates.push(
    result(
      "CX-04",
      hasRationale && !computed,
      !hasRationale ? "MISSING_RATIONALE" : "COMPUTED_OR_SCORED_COMPLEXITY",
      "التعقيد يجب أن يكون مؤلفاً ومخزناً، لا درجة محسوبة من بيانات أخرى.",
    ),
  );

  gates.push(
    result(
      "CX-05",
      !matchesAny(text, EXECUTION_DERIVATION_PATTERNS),
      "EXECUTION_BLOCK_DERIVATION",
      "عدد كتل التنفيذ أو صياغتها لا يحدد التعقيد.",
    ),
  );
  gates.push(
    result(
      "CX-06",
      !matchesAny(text, SUPPORT_DERIVATION_PATTERNS),
      "SUPPORT_DERIVATION",
      "وجود الدعم الاختياري أو غيابه لا يحدد التعقيد.",
    ),
  );
  gates.push(
    result(
      "CX-07",
      !matchesAny(text, RUN_DERIVATION_PATTERNS),
      "RUN_DERIVATION",
      "عدد مرات الحدوث أو الجولات لا يحدد التعقيد.",
    ),
  );
  gates.push(
    result(
      "CX-08",
      !matchesAny(text, SHARED_DERIVATION_PATTERNS),
      "SHARED_MODE_DERIVATION",
      "نمط المشاركة المشترك لا يعني مستوى advanced.",
    ),
  );
  gates.push(
    result(
      "CX-09",
      !matchesAny(text, PERSON_CRITERION_PATTERNS),
      "PERSON_BASED_CRITERION",
      "مبرر التعقيد يجب أن يصف بنية الدور بلا معيار متعلق بالشخص.",
    ),
  );

  const failed = gates.filter((gate) => !gate.passed);
  return {
    valid: failed.length === 0,
    gates,
    failedGates: failed.map((gate) => gate.gate),
    codes: failed.map((gate) => gate.code!).filter(Boolean),
  };
}

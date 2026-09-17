import type { CandidateFunctionalParticipation } from "./reference-model";

export type DraftQualityCode =
  | "GENERIC_LIFE_CONTEXT"
  | "TAUTOLOGICAL_INTENT"
  | "GENERIC_OBSERVABLE_EFFECT"
  | "GENERIC_NATURAL_COMPLETION"
  | "GENERIC_STANDALONE_MEANING"
  | "GENERIC_EXECUTION_BLOCK"
  | "GENERIC_COMPLEXITY_DIMENSION"
  | "GENERIC_COMPLEXITY_RATIONALE";

export interface DraftQualityResult {
  valid: boolean;
  codes: DraftQualityCode[];
  reasons: string[];
}

const RULES: Array<{
  field: keyof CandidateFunctionalParticipation;
  code: DraftQualityCode;
  patterns: RegExp[];
  reason: string;
}> = [
  {
    field: "life_context",
    code: "GENERIC_LIFE_CONTEXT",
    patterns: [
      /يظهر دور .* بوصفه جزءًا حقيقيًا من الموقف/u,
      /أثناء .* يُنجز دور .* في الموضع الذي يحتاج إليه الحدث/u,
    ],
    reason: "سياق الحياة يعيد تسمية الدور ولا يصف موقفًا حياتيًا محددًا.",
  },
  {
    field: "functional_intent",
    code: "TAUTOLOGICAL_INTENT",
    patterns: [
      /حتى تنتقل عناصره إلى حالتها المقصودة/u,
      /يحتاج موقف .* إلى .* حتى/u,
      /تهيئة النتيجة المباشرة التي يعتمد عليها/u,
    ],
    reason: "القصد الوظيفي دائري ولا يبين لماذا يحتاج الموقف هذا الدور.",
  },
  {
    field: "observable_effect",
    code: "GENERIC_OBSERVABLE_EFFECT",
    patterns: [/يصبح أثر .* ظاهرًا/u, /يصبح أثر الدور واضحًا/u, /يظهر في المكان ناتج .* مكتملًا/u],
    reason: "الأثر المشاهد غير مسمى بوصف حالة ملموسة في الموقف.",
  },
  {
    field: "natural_completion",
    code: "GENERIC_NATURAL_COMPLETION",
    patterns: [/عندما يتحقق الأثر المقصود/u, /عندما يكتمل .* داخل الموقف/u, /عند استقرار ناتج .* في موضعه المطلوب/u],
    reason: "النهاية الطبيعية تحيل إلى أثر غير محدد بدل وصف علامة انتهاء ملموسة.",
  },
  {
    field: "standalone_role_meaning",
    code: "GENERIC_STANDALONE_MEANING",
    patterns: [
      /معنى وظيفيًا قائمًا بذاته حتى عند فصله/u,
      /دور له معنى داخل .* لأنه يغيّر حالة محددة/u,
      /مساهمة حياتية محددة تنتج تغييرًا نافعًا بذاته/u,
    ],
    reason: "معنى الدور المستقل مُعلن بصيغة قالبية دون بيان وظيفته المستقلة.",
  },
];

export function evaluateContractAlignmentDraftQuality(
  candidate: CandidateFunctionalParticipation,
): DraftQualityResult {
  const codes: DraftQualityCode[] = [];
  const reasons: string[] = [];
  for (const rule of RULES) {
    const value = candidate[rule.field];
    if (typeof value === "string" && rule.patterns.some((pattern) => pattern.test(value))) {
      codes.push(rule.code);
      reasons.push(rule.reason);
    }
  }
  const genericBlock = (candidate.execution_blocks ?? []).some((block) =>
    [
      /(?:تحديد موضع|إتمام) .* داخل الموقف/u,
      /تحديد العناصر المعنية بدور/u,
      /مناولة العناصر بما يحقق النتيجة المحددة للدور/u,
      /وضع الناتج في وجهته التالية/u,
    ].some((pattern) => pattern.test(block.text)),
  );
  if (genericBlock) {
    codes.push("GENERIC_EXECUTION_BLOCK");
    reasons.push("كتلة التنفيذ تعيد عنوان الدور ولا تصف فعلًا تنفيذيًا محددًا.");
  }
  const dimensions = candidate.complexity?.dimensions;
  const genericDimension = dimensions
    ? Object.values(dimensions).some((value) =>
        [
          /العناصر المباشرة اللازمة/u,
          /يرتبط توقيت الدور بترتيب/u,
          /قد تتغير العناصر أو المواضع/u,
          /اختيارات محدودة مرتبطة بالعنصر أو الموضع المناسب/u,
          /يتعامل الدور مع .* وموضعه الفعلي وما يلزم لتسليم نتيجته/u,
          /يتطلب الربط بين بدء .* والتحقق من نتيجته/u,
          /تتغير كمية العناصر ومواقعها وحالتها الظاهرة/u,
          /ينحصر الاختيار في تحديد العنصر المعني ووجهته/u,
        ].some((pattern) => pattern.test(value)),
      )
    : false;
  if (genericDimension) {
    codes.push("GENERIC_COMPLEXITY_DIMENSION");
    reasons.push("أحد أبعاد التعقيد يعرض قالبًا عامًا بدل بنية الدور المحددة.");
  }
  if (
    typeof candidate.complexity?.rationale === "string" &&
    /(?:وجود أكثر من عنصر، وارتباط زمني بالموقف، وتغير محتمل، واختيارات محدودة|تجمع عناصر محددة وتسلسل تسليم واضحًا مع تغير واقعي)/u.test(
      candidate.complexity.rationale,
    )
  ) {
    codes.push("GENERIC_COMPLEXITY_RATIONALE");
    reasons.push("مبرر التعقيد عام ويمكن نسخه بين أدوار مختلفة دون تغيير.");
  }
  return { valid: codes.length === 0, codes, reasons };
}

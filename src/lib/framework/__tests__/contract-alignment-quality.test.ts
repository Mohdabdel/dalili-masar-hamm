import { describe, expect, it } from "vitest";
import { evaluateContractAlignmentDraftQuality } from "../contract-alignment-quality";
import { FIXTURE_ADVANCED, FIXTURE_MODERATE, FIXTURE_SIMPLE } from "../__fixtures__/compliant-fixtures";

describe("Contract Alignment semantic anti-template gate", () => {
  it.each([FIXTURE_SIMPLE, FIXTURE_MODERATE, FIXTURE_ADVANCED])(
    "accepts substantive draft $id",
    (candidate) => {
      expect(evaluateContractAlignmentDraftQuality(candidate)).toEqual({
        valid: true,
        codes: [],
        reasons: [],
      });
    },
  );

  it("rejects a circular draft even when all canonical fields are non-empty", () => {
    const title = "كي الملابس لإزالة التجاعيد";
    const result = evaluateContractAlignmentDraftQuality({
      ...FIXTURE_MODERATE,
      title,
      life_context: `أثناء «${title}»، يظهر دور «${title}» بوصفه جزءًا حقيقيًا من الموقف الأسري.`,
      functional_intent: `يحتاج موقف «${title}» إلى «${title}» حتى تنتقل عناصره إلى حالتها المقصودة.`,
      observable_effect: `يصبح أثر «${title}» ظاهرًا في ترتيب الموقف أو أغراضه أو تفاعله.`,
      natural_completion: `ينتهي الدور عندما يتحقق الأثر المقصود من «${title}» داخل الموقف.`,
      standalone_role_meaning: `يحمل «${title}» معنى وظيفيًا قائمًا بذاته حتى عند فصله عن بقية الأدوار.`,
      complexity: {
        ...FIXTURE_MODERATE.complexity,
        dimensions: {
          c1_elements: `يتعامل الدور مع العناصر المباشرة اللازمة لـ«${title}».`,
          c2_coordination: `يرتبط توقيت الدور بترتيب «${title}» وبالأدوار المحيطة به.`,
          c3_variability: "قد تتغير العناصر أو المواضع باختلاف الموقف الفعلي.",
          c4_choice_uncertainty: "توجد اختيارات محدودة مرتبطة بالعنصر أو الموضع المناسب.",
        },
        rationale: "الوصف متوسط بنيويًا لوجود أكثر من عنصر، وارتباط زمني بالموقف، وتغير محتمل، واختيارات محدودة.",
      },
      execution_blocks: [
        { kind: "execution_block", id: "GENERIC-B1", order: 1, text: `تحديد موضع «${title}» داخل الموقف` },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.codes).toEqual([
      "GENERIC_LIFE_CONTEXT",
      "TAUTOLOGICAL_INTENT",
      "GENERIC_OBSERVABLE_EFFECT",
      "GENERIC_NATURAL_COMPLETION",
      "GENERIC_STANDALONE_MEANING",
      "GENERIC_EXECUTION_BLOCK",
      "GENERIC_COMPLEXITY_DIMENSION",
      "GENERIC_COMPLEXITY_RATIONALE",
    ]);
  });

  it("rejects title-substitution scaffolding found during CA-0003 review", () => {
    const title = "تجهيز حقيبة ملابس للسفر";
    const result = evaluateContractAlignmentDraftQuality({
      ...FIXTURE_MODERATE,
      title,
      life_context: `أثناء «${title}»، يُنجز دور «${title}» في الموضع الذي يحتاج إليه الحدث قبل انتقاله إلى جزئه التالي.`,
      functional_intent: `تهيئة النتيجة المباشرة التي يعتمد عليها «${title}» دون توسيع الدور.`,
      observable_effect: `يظهر في المكان ناتج «${title}» مكتملًا وقابلًا للانتفاع به.`,
      natural_completion: `ينتهي الدور عند استقرار ناتج «${title}» في موضعه المطلوب.`,
      standalone_role_meaning: `«${title}» مساهمة حياتية محددة تنتج تغييرًا نافعًا بذاته.`,
      complexity: {
        ...FIXTURE_MODERATE.complexity,
        dimensions: {
          c1_elements: `يتعامل الدور مع الحقائب وموضعه الفعلي وما يلزم لتسليم نتيجته.`,
          c2_coordination: `يتطلب الربط بين بدء «${title}» والتحقق من نتيجته.`,
          c3_variability: "تتغير كمية العناصر ومواقعها وحالتها الظاهرة.",
          c4_choice_uncertainty: "ينحصر الاختيار في تحديد العنصر المعني ووجهته.",
        },
        rationale: "بنية الدور تجمع عناصر محددة وتسلسل تسليم واضحًا مع تغير واقعي.",
      },
      execution_blocks: [
        { kind: "execution_block", id: "SCAFFOLD-B1", order: 1, text: "مناولة العناصر بما يحقق النتيجة المحددة للدور" },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.codes).toEqual([
      "GENERIC_LIFE_CONTEXT",
      "TAUTOLOGICAL_INTENT",
      "GENERIC_OBSERVABLE_EFFECT",
      "GENERIC_NATURAL_COMPLETION",
      "GENERIC_STANDALONE_MEANING",
      "GENERIC_EXECUTION_BLOCK",
      "GENERIC_COMPLEXITY_DIMENSION",
      "GENERIC_COMPLEXITY_RATIONALE",
    ]);
  });
});

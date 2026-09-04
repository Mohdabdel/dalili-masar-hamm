// حوافظ تحقق معزولة للنموذج المتوافق مع الإطار — للاختبار فقط.
// لا تدخل كتالوج الإنتاج ولا تُعرض للأسر، وليست محتوى مُرحّلاً.

import type {
  CandidateFunctionalParticipation,
  FunctionalParticipation,
  PreferredContext,
  FrameworkEvent,
  ExecutionBlock,
} from "../reference-model";

export const FIXTURE_EVENT: FrameworkEvent = {
  kind: "event",
  id: "FX-EVENT-001",
  title: "وقت تجهيز مائدة العشاء",
  life_context: "تجتمع الأسرة لتناول العشاء في المساء.",
};

export const FIXTURE_PREFERRED_CONTEXT: PreferredContext = {
  kind: "preferred_context",
  id: "FX-PC-001",
  description: "الأسرة تفضّل الجلوس معاً حول المائدة قبل بدء الأكل.",
  origin: "reference_suggested",
};

function blocks(...texts: string[]): ExecutionBlock[] {
  return texts.map((text, i) => ({
    kind: "execution_block",
    id: `FX-EB-${i + 1}`,
    order: i + 1,
    text,
  }));
}

/** A — مشاركة فردية صالحة بمستوى بسيط. */
export const FIXTURE_SIMPLE: FunctionalParticipation = {
  kind: "functional_participation",
  provenance: "framework_reference",
  id: "FX-FP-SIMPLE",
  title: "توزيع الأطباق على المائدة",
  life_context: "قبل عشاء الأسرة، المائدة جاهزة والأطباق ما زالت في المطبخ.",
  functional_intent: "المائدة تحتاج طبقاً أمام كل مقعد حتى يبدأ الجميع معاً.",
  observable_effect: "يصبح أمام كل مقعد طبق في مكانه.",
  natural_completion: "ينتهي الدور حين يكون لكل مقعد طبق.",
  standalone_role_meaning:
    "توزيع الأطباق دور له معنى في أي مائدة، حتى لو لم يشارك أحد في بقية التجهيز.",
  participation_mode: "individual",
  complexity: {
    level: "simple",
    dimensions: {
      c1_elements: "عنصر واحد متكرر: الأطباق.",
      c2_coordination: "لا يحتاج تزامناً مع دور آخر.",
      c3_variability: "الوضع ثابت في كل مرة.",
      c4_choice_uncertainty: "لا خيارات مفتوحة؛ لكل مقعد طبق واحد.",
    },
    rationale: "بنية الدور: عنصر واحد، بلا تنسيق، بلا تغيّر، بلا اختيار.",
  },
  execution_blocks: blocks(
    "أخذ الأطباق من المطبخ",
    "وضع طبق أمام كل مقعد",
  ),
  event_id: FIXTURE_EVENT.id,
  preferred_context_id: FIXTURE_PREFERRED_CONTEXT.id,
};

/** B — مشاركة تشاركية صالحة (النمط لا يغيّر المستوى). */
export const FIXTURE_SHARED: FunctionalParticipation = {
  ...FIXTURE_SIMPLE,
  id: "FX-FP-SHARED",
  title: "حمل صينية الطعام مع فرد آخر",
  functional_intent:
    "الصينية ثقيلة على شخص واحد، والمائدة تحتاجها قبل جلوس الجميع.",
  observable_effect: "تنتقل الصينية من المطبخ إلى وسط المائدة.",
  natural_completion: "ينتهي الدور حين تستقر الصينية على المائدة.",
  standalone_role_meaning:
    "حمل الصينية مع طرف آخر دور تكاملي واضح في أي نقل مشترك.",
  participation_mode: "shared",
  execution_blocks: blocks(
    "الإمساك بطرف الصينية",
    "المشي معاً حتى المائدة",
    "إنزال الصينية معاً",
  ),
};

/** C — مشاركة صالحة بمستوى متوسط. */
export const FIXTURE_MODERATE: FunctionalParticipation = {
  kind: "functional_participation",
  provenance: "framework_reference",
  id: "FX-FP-MODERATE",
  title: "تجهيز سلة الغسيل قبل التشغيل",
  life_context: "في يوم الغسيل تتجمع الملابس في أماكن مختلفة من البيت.",
  functional_intent: "الغسالة تحتاج ملابس مفروزة حسب النوع قبل التشغيل.",
  observable_effect: "تصبح الملابس في سلال منفصلة جاهزة للغسل.",
  natural_completion: "ينتهي الدور حين تخلو الأرض من الملابس المتناثرة.",
  standalone_role_meaning:
    "فرز الملابس دور مفهوم بذاته حتى لو شغّل شخص آخر الغسالة.",
  participation_mode: "individual",
  complexity: {
    level: "moderate",
    dimensions: {
      c1_elements: "عدة أنواع من الملابس وسلال متعددة.",
      c2_coordination: "ترتيب الفرز قبل التشغيل.",
      c3_variability: "كمية الملابس وأنواعها تختلف كل مرة.",
      c4_choice_uncertainty: "قرار وضع القطعة في سلة دون أخرى.",
    },
    rationale:
      "بنية الدور: عناصر متعددة مع تنسيق داخلي وتغيّر في المحتوى واختيارات فرز.",
  },
  execution_blocks: blocks(
    "جمع الملابس من الغرف",
    "فصل الفاتح عن الداكن",
    "وضع كل نوع في سلته",
  ),
};

/** D — ضبط المستوى المتقدم من بنية الدور لا من قدرة الشخص. */
export const FIXTURE_ADVANCED: FunctionalParticipation = {
  kind: "functional_participation",
  provenance: "framework_reference",
  id: "FX-FP-ADVANCED",
  title: "إدارة طلبات المائدة أثناء العشاء",
  life_context: "أثناء عشاء يجتمع فيه عدد من أفراد الأسرة والضيوف.",
  functional_intent:
    "المائدة تحتاج من يتابع ما ينقص ويوصله في وقته أثناء استمرار الأكل.",
  observable_effect: "لا يبقى طلب على المائدة دون استجابة.",
  natural_completion: "ينتهي الدور حين تنتهي المائدة ويقوم الجالسون.",
  standalone_role_meaning:
    "متابعة نواقص المائدة دور تنسيقي قائم بذاته في أي تجمّع طعام.",
  participation_mode: "shared",
  complexity: {
    level: "advanced",
    dimensions: {
      c1_elements: "عناصر كثيرة: أطباق، مشروبات، أدوات، أشخاص.",
      c2_coordination: "تنسيق متزامن مع أدوار أخرى على المائدة.",
      c3_variability: "الطلبات تتغيّر لحظياً.",
      c4_choice_uncertainty: "ترتيب الأولويات غير محدد مسبقاً.",
    },
    rationale:
      "بنية الدور: عناصر متعددة، تنسيق متزامن، تغيّر لحظي، وقرارات أولوية مفتوحة.",
  },
  execution_blocks: blocks(
    "ملاحظة ما نقص على المائدة",
    "إحضار العنصر الناقص",
    "متابعة الطلب التالي",
  ),
};

/** E — صياغة هدف تدريبي (يجب أن تسقط عند بوابة حياد الأداء). */
export const FIXTURE_TRAINING_OBJECTIVE: CandidateFunctionalParticipation = {
  id: "FX-FP-TRAINING",
  title: "تمرين لتعلّم ترتيب الأطباق",
  life_context: "جلسة تدريب على ترتيب الأطباق لإتقان المهارة.",
  functional_intent: "هدف تدريبي: رفع استقلالية الطفل في ترتيب المائدة.",
  observable_effect: "ترتيب الأطباق بنسبة صحيحة أعلى.",
  natural_completion: "ينتهي التمرين بعد عشر مرات صحيحة.",
  standalone_role_meaning: "تمرين مستقل على المهارة.",
  participation_mode: "individual",
  execution_blocks: [],
};

/** F — حدث فقط بلا دور وظيفي. */
export const FIXTURE_EVENT_ONLY: CandidateFunctionalParticipation = {
  id: "FX-FP-EVENT-ONLY",
  title: "وقت مشاهدة التلفاز",
  life_context: "تجلس الأسرة أمام التلفاز في المساء.",
  execution_blocks: [],
};

/** G — كتلة تنفيذ فقط بلا سياق مشاركة كافٍ. */
export const FIXTURE_BLOCK_ONLY: CandidateFunctionalParticipation = {
  id: "FX-FP-BLOCK-ONLY",
  title: "توصيل القابس بالكهرباء",
  standalone_role_meaning: "توصيل القابس بالكهرباء",
  participation_mode: "individual",
  execution_blocks: [
    {
      kind: "execution_block",
      id: "FX-EB-ONLY",
      order: 1,
      text: "توصيل القابس بالكهرباء",
    },
  ],
};

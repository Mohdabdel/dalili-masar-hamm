// محتوى مرجعي متوافق مع الإطار يُستخدم في «البداية السهلة» فقط.
// لا يُدخَل في Legacy Master ولا يعدّله (D02، IM-01).
// كل مرشح هنا يمرّ على عقد صلاحية المشاركة الوظيفية قبل عرضه (FP-09).

import type { FunctionalParticipation } from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  listFrameworkParticipations,
  registerFrameworkParticipation,
} from "./reference-registry";

interface Seed extends Omit<FunctionalParticipation, "kind" | "provenance"> {
  /** السياق المفضّل الذي يظهر تحته هذا المرشح. */
  preferred_context_id: string;
}

const SEEDS: Seed[] = [
  {
    id: "FR-POPCORN-BRING-001",
    title: "إحضار البوب كورن إلى مكان جلوس الأسرة",
    life_context: "أمسية يجتمع فيها أفراد الأسرة حول التلفاز ويُطلب البوب كورن",
    functional_intent: "الجلسة تحتاج من ينقل الوعاء من المطبخ إلى مكان الجلوس",
    observable_effect: "يصل الوعاء إلى الطاولة فيبدأ الجالسون بتناوله",
    natural_completion: "يستقر الوعاء أمام الجالسين وتبدأ الأمسية",
    standalone_role_meaning: "نقل ما يُؤكل معاً إلى مكان اجتماع الأسرة",
    participation_mode: "shared",
    preferred_context_id: "PCTX-POPCORN-EVENING",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "وعاء واحد ومسار قصير داخل البيت",
        c2_coordination: "حمل ثابت مع المشي حتى الطاولة",
        c3_variability: "مكان الجلوس قد يتغير بين أمسية وأخرى",
        c4_choice_uncertainty: "اختيار مكان وضع الوعاء على الطاولة",
      },
      rationale: "الدور يجمع حملاً ثابتاً مع انتقال داخل البيت.",
    },
    execution_blocks: [
      { kind: "execution_block", id: "FR-POPCORN-BRING-001-B1", order: 1, text: "يمسك الوعاء بكلتا يديه" },
      { kind: "execution_block", id: "FR-POPCORN-BRING-001-B2", order: 2, text: "يسير إلى مكان جلوس الأسرة" },
      { kind: "execution_block", id: "FR-POPCORN-BRING-001-B3", order: 3, text: "يضع الوعاء على الطاولة أمام الجالسين" },
    ],
  },
  {
    id: "FR-POPCORN-SHARE-001",
    title: "توزيع البوب كورن على أفراد الأسرة",
    life_context: "أمسية أسرية يتشارك فيها الجميع البوب كورن",
    functional_intent: "الجلسة تحتاج من يقدّم نصيب كل جالس",
    observable_effect: "يحصل كل جالس على نصيبه في يده",
    natural_completion: "يصل النصيب إلى آخر جالس",
    standalone_role_meaning: "توصيل نصيب كل شخص في جلسة مشتركة",
    participation_mode: "shared",
    preferred_context_id: "PCTX-POPCORN-EVENING",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "أوعية صغيرة وأشخاص جالسون",
        c2_coordination: "مدّ اليد وتسليم الوعاء",
        c3_variability: "عدد الجالسين يتغير",
        c4_choice_uncertainty: "ترتيب من يبدأ به",
      },
      rationale: "الدور قصير وواضح داخل جلسة واحدة.",
    },
    execution_blocks: [
      { kind: "execution_block", id: "FR-POPCORN-SHARE-001-B1", order: 1, text: "يملأ وعاءً صغيراً" },
      { kind: "execution_block", id: "FR-POPCORN-SHARE-001-B2", order: 2, text: "يقدّمه لأحد الجالسين" },
      { kind: "execution_block", id: "FR-POPCORN-SHARE-001-B3", order: 3, text: "يكمل حتى يصل النصيب للجميع" },
    ],
  },
  {
    id: "FR-WATER-JUG-001",
    title: "تعبئة إبريق الماء لمائدة الأسرة",
    life_context: "تجهيز المائدة قبل جلوس الأسرة للطعام",
    functional_intent: "المائدة تحتاج ماءً جاهزاً أمام الجالسين",
    observable_effect: "يمتلئ الإبريق ويوضع على المائدة",
    natural_completion: "يستقر الإبريق الممتلئ على المائدة",
    standalone_role_meaning: "تجهيز ماء الشرب لمائدة مشتركة",
    participation_mode: "individual",
    preferred_context_id: "PCTX-WATER-PLAY",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "إبريق وصنبور ومائدة",
        c2_coordination: "إمساك الإبريق أثناء التعبئة",
        c3_variability: "حجم الإبريق قد يختلف",
        c4_choice_uncertainty: "اختيار موضع الإبريق على المائدة",
      },
      rationale: "الدور محدود بعنصر واحد ومسار قصير.",
    },
    execution_blocks: [
      { kind: "execution_block", id: "FR-WATER-JUG-001-B1", order: 1, text: "يضع الإبريق تحت الصنبور" },
      { kind: "execution_block", id: "FR-WATER-JUG-001-B2", order: 2, text: "يفتح الماء حتى يمتلئ الإبريق" },
      { kind: "execution_block", id: "FR-WATER-JUG-001-B3", order: 3, text: "يحمل الإبريق إلى المائدة" },
    ],
  },
  {
    id: "FR-OUTING-BAG-001",
    title: "حمل كيس المشتريات الخفيف إلى السيارة",
    life_context: "خروج قصير مع الأسرة ينتهي بحمل المشتريات",
    functional_intent: "الخروج يحتاج من ينقل كيساً خفيفاً حتى السيارة",
    observable_effect: "يصل الكيس إلى صندوق السيارة",
    natural_completion: "يوضع الكيس داخل السيارة ويُغلق الصندوق",
    standalone_role_meaning: "نقل ما اشترته الأسرة إلى وسيلة عودتها",
    participation_mode: "shared",
    preferred_context_id: "PCTX-GOING-OUT",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "كيس واحد ومسار في مكان عام",
        c2_coordination: "حمل الكيس أثناء السير مع الأسرة",
        c3_variability: "ازدحام المكان يتغير",
        c4_choice_uncertainty: "اختيار موضع الكيس في الصندوق",
      },
      rationale: "الدور يمتد في مكان عام مع الأسرة.",
    },
    execution_blocks: [
      { kind: "execution_block", id: "FR-OUTING-BAG-001-B1", order: 1, text: "يمسك مقبض الكيس" },
      { kind: "execution_block", id: "FR-OUTING-BAG-001-B2", order: 2, text: "يسير مع الأسرة حتى السيارة" },
      { kind: "execution_block", id: "FR-OUTING-BAG-001-B3", order: 3, text: "يضع الكيس داخل صندوق السيارة" },
    ],
  },
  {
    id: "FR-MUSIC-PLAY-001",
    title: "تشغيل المقطع الذي تجتمع عليه الأسرة",
    life_context: "وقت مساء تجتمع فيه الأسرة حول أغنية أو مقطع",
    functional_intent: "الجلسة تحتاج من يبدأ تشغيل المقطع للجميع",
    observable_effect: "يُسمع الصوت فينتبه الجالسون ويبدأ الوقت المشترك",
    natural_completion: "ينتهي المقطع وتستمر الجلسة",
    standalone_role_meaning: "فتح باب وقت مشترك بصوت تختاره الأسرة",
    participation_mode: "shared",
    preferred_context_id: "PCTX-MUSIC-GATHER",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "جهاز واحد ومقطع محفوظ",
        c2_coordination: "لمسة واحدة على الجهاز",
        c3_variability: "المقطع قد يتغير بحسب رغبته",
        c4_choice_uncertainty: "اختيار المقطع بين مفضلاته",
      },
      rationale: "الدور قصير ويعتمد على اختيار شخصي واضح.",
    },
    execution_blocks: [
      { kind: "execution_block", id: "FR-MUSIC-PLAY-001-B1", order: 1, text: "يفتح قائمة ما يحبه" },
      { kind: "execution_block", id: "FR-MUSIC-PLAY-001-B2", order: 2, text: "يختار المقطع" },
      { kind: "execution_block", id: "FR-MUSIC-PLAY-001-B3", order: 3, text: "يشغّله ليسمعه الجالسون" },
    ],
  },
];

let ready = false;

/** تسجيل المحتوى المرجعي مرة واحدة، ولا يُسجَّل أي مرشح ساقط الصلاحية (FP-09). */
export function ensureEasyBeginningCorpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of SEEDS) {
    if (getFrameworkParticipation(seed.id)) continue;
    const candidate = {
      ...seed,
      kind: "functional_participation" as const,
      provenance: "framework_reference" as const,
    };
    if (!evaluateFunctionalParticipation(candidate).valid) continue;
    try {
      registerFrameworkParticipation(candidate);
    } catch {
      // سجل غير قابل للتعديل — نتجاهل أي محاولة تسجيل مكررة.
    }
  }
}

/** المرشحون الصالحون المرتبطون بسياق مفضّل مرجعي. */
export function candidatesForPreferredContext(
  preferredContextId: string,
): FunctionalParticipation[] {
  ensureEasyBeginningCorpus();
  return listFrameworkParticipations().filter(
    (p) => p.preferred_context_id === preferredContextId,
  );
}

export function getEasyBeginningCandidate(
  id: string,
): FunctionalParticipation | null {
  ensureEasyBeginningCorpus();
  return getFrameworkParticipation(id);
}

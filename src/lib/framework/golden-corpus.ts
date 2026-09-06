// المجموعة المرجعية الذهبية المجمّدة (DALILI_FRAMEWORK_FREEZE_01 §11).
// خمس حوافظ فقط — لا تُوسَّع ولا تُعدَّل ولا تُشتق من المكتبة القديمة.
// كل تعريف منقول حرفياً من ملف التجميد، ولا يُسجَّل إلا بعد اجتياز البوابات السبع (FP-09).
// المرجع: FP-01..FP-12، CX-01..CX-09، IM-01..IM-03، D02.

import type {
  FrameworkEvent,
  FunctionalParticipation,
  PreferredContext,
} from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  registerFrameworkParticipation,
} from "./reference-registry";

type GoldenSeed = Omit<FunctionalParticipation, "kind" | "provenance"> & {
  /** ضابط تحقق فقط — لا معنى إنتاجياً له ولا أثر على التعقيد. */
  validation_control?: boolean;
};

function blocks(
  id: string,
  texts: string[],
): FunctionalParticipation["execution_blocks"] {
  return texts.map((text, index) => ({
    kind: "execution_block" as const,
    id: `${id}-b${index + 1}`,
    order: index + 1,
    text,
  }));
}

/** الأحداث المرجعية المجمّدة الداعمة للمجموعة الذهبية. */
export const GOLDEN_EVENTS: readonly FrameworkEvent[] = Object.freeze([
  { kind: "event", id: "EV-LIVING-TIDY", title: "ترتيب غرفة المعيشة", life_context: "ترتيب غرفة المعيشة" },
  { kind: "event", id: "EV-HOSTING", title: "ضيافة الأسرة", life_context: "ضيافة الأسرة" },
  { kind: "event", id: "EV-POPCORN-PREP", title: "تجهيز البوب كورن مع الأسرة", life_context: "تجهيز البوب كورن مع الأسرة" },
  { kind: "event", id: "EV-FAMILY-SNACK", title: "تناول البوب كورن مع الأسرة", life_context: "تناول البوب كورن مع الأسرة" },
] as FrameworkEvent[]);

/** محطات الروتين المرجعية — عدسة اكتشاف فقط، بلا وقت أو إنجاز (EN-03). */
export const GOLDEN_ROUTINE_STATIONS = Object.freeze([
  { id: "RS-MEALTIME", title: "وقت الطعام", event_ids: ["EV-HOSTING", "EV-POPCORN-PREP", "EV-FAMILY-SNACK"] },
  { id: "RS-HOME-ORDER", title: "لحظات ترتيب البيت", event_ids: ["EV-LIVING-TIDY"] },
] as const);

/** المجالات المرجعية — سطح اتساع للاكتشاف فقط. */
export const GOLDEN_DOMAINS = Object.freeze([
  { id: "DM-FAMILY-LIFE", title: "حياة الأسرة في البيت", event_ids: ["EV-LIVING-TIDY", "EV-HOSTING"] },
  { id: "DM-SHARED-MOMENTS", title: "لحظات المشاركة والمتعة", event_ids: ["EV-FAMILY-SNACK", "EV-POPCORN-PREP"] },
] as const);

/** السياق المفضّل المرجعي المجمّد مع توسعته. */
export const GOLDEN_PREFERRED_CONTEXT: PreferredContext & {
  expansion: readonly string[];
  participation_ids: readonly string[];
} = Object.freeze({
  kind: "preferred_context",
  id: "PC-POPCORN",
  description: "تناول البوب كورن مع الأسرة",
  origin: "reference_suggested",
  expansion: Object.freeze([
    "يطلب البوب كورن بنفسه أو يتّجه إليه",
    "يجلس مع الأسرة عندما يكون البوب كورن موجوداً",
    "يتكرّر هذا الموقف في البيت بصورة طبيعية",
    "تستطيع الأسرة أن تدخل هذه اللحظة وتصنع لنفسها مكاناً معه فيها",
  ]),
  participation_ids: Object.freeze(["GJ-EASY-001", "GJ-SHARED-001"]),
});

const GOLDEN_SEEDS: GoldenSeed[] = [
  {
    id: "GJ-EASY-001",
    title: "إحضار البوب كورن إلى مكان جلوس الأسرة",
    life_context: "تناول البوب كورن مع الأسرة",
    functional_intent: "إيصال البوب كورن إلى مكان المشاركة الأسرية",
    observable_effect: "أصبح البوب كورن موجوداً في مكان جلوس الأسرة",
    natural_completion: "وصل البوب كورن إلى المكان المقصود",
    standalone_role_meaning:
      "إيصال شيء إلى مكان المشاركة دور وظيفي مفهوم بذاته، وليس مجرد حركة تمكينية.",
    participation_mode: "individual",
    event_id: "EV-FAMILY-SNACK",
    preferred_context_id: "PC-POPCORN",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عنصر واحد يُنقل إلى مكان واحد.",
        c2_coordination: "لا يتطلب تزامناً أو مطابقة بين عناصر.",
        c3_variability: "المطلوب ثابت أثناء حدوث الدور.",
        c4_choice_uncertainty: "لا توجد بدائل أو نتائج غير محددة.",
      },
      rationale:
        "غرض واحد واضح، عدد قليل من العناصر، علاقة مباشرة بين الفعل ونتيجته، ولا يتطلب تنسيقاً أو اختيارات متعددة.",
    },
    execution_blocks: blocks("GJ-EASY-001", [
      "نذهب إلى مكان البوب كورن",
      "نأخذ البوب كورن",
      "نحضره إلى مكان جلوسنا",
      "انتهينا",
    ]),
  },
  {
    id: "GJ-DISCOVERY-001",
    title: "إعادة أجهزة التحكم المستخدمة إلى مكانها",
    life_context: "ترتيب غرفة المعيشة",
    functional_intent: "إعادة الأشياء المستخدمة إلى موضعها المعتاد",
    observable_effect: "أصبحت أجهزة التحكم في أماكنها",
    natural_completion: "أعيدت الأجهزة المقصودة إلى أماكنها",
    standalone_role_meaning:
      "إعادة الأشياء إلى موضعها دور وظيفي مفهوم بذاته داخل حدث الترتيب.",
    participation_mode: "individual",
    event_id: "EV-LIVING-TIDY",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عناصر قليلة متشابهة وأماكن معروفة.",
        c2_coordination: "لا يتطلب ترتيباً زمنياً دقيقاً.",
        c3_variability: "المطلوب ثابت.",
        c4_choice_uncertainty: "لا توجد قرارات ذات أثر داخل الدور.",
      },
      rationale:
        "غرض واحد واضح وعناصر قليلة متشابهة، والعلاقة بين الفعل والنتيجة مباشرة دون تنسيق أو تغيّر في المطلوب.",
    },
    execution_blocks: blocks("GJ-DISCOVERY-001", [
      "نجد أجهزة التحكم المستخدمة",
      "نعيدها إلى مكانها",
      "انتهينا",
    ]),
  },
  {
    id: "GJ-SHARED-001",
    title: "تثبيت الوعاء بينما يضع فرد الأسرة البوب كورن فيه",
    life_context: "تجهيز البوب كورن مع الأسرة",
    functional_intent: "تثبيت الوعاء ليسمح بإكمال وضع البوب كورن فيه",
    observable_effect: "يبقى الوعاء في الموضع المطلوب أثناء وضع البوب كورن",
    natural_completion: "ينتهي الدور عند اكتمال وضع البوب كورن في الوعاء",
    standalone_role_meaning:
      "التثبيت دور وظيفي مكتمل بذاته: بدونه لا يمكن إكمال وضع البوب كورن. وهو دور تكميلي، لا أداء ناقص.",
    participation_mode: "shared",
    event_id: "EV-POPCORN-PREP",
    preferred_context_id: "PC-POPCORN",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عنصر واحد (الوعاء) في موضع واحد.",
        c2_coordination: "تزامن واحد بسيط: البقاء في الموضع أثناء فعل الطرف الآخر.",
        c3_variability: "المطلوب لا يتغير أثناء حدوث الدور.",
        c4_choice_uncertainty: "لا توجد بدائل أو قرارات داخل الدور.",
      },
      rationale:
        "الدور تكميلي وواضح الغرض: عنصر واحد يُثبت في موضع واحد. كونه دوراً مشتركاً لا يزيد عناصره ولا تنسيقه ولا اختياراته، لذلك يبقى بسيطاً.",
    },
    execution_blocks: blocks("GJ-SHARED-001", [
      "نضع أيدينا على الوعاء",
      "نُبقي الوعاء ثابتاً",
      "انتهينا",
    ]),
  },
  {
    id: "GJ-MODERATE-001",
    title: "توزيع الأكواب والأطباق المناسبة على الضيوف",
    life_context: "ضيافة الأسرة",
    functional_intent: "أن يجد كل ضيف ما يحتاجه أمامه قبل تقديم الضيافة",
    observable_effect: "أصبح أمام كل ضيف كوب وطبق في موضعه",
    natural_completion: "ينتهي الدور عندما يكون لكل ضيف حاضر كوب وطبق أمامه",
    standalone_role_meaning:
      "التوزيع دور وظيفي قائم بذاته داخل حدث الضيافة، ويمكن فهمه دون بقية الحدث.",
    participation_mode: "individual",
    event_id: "EV-HOSTING",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "نوعان من العناصر بعدد يتبع عدد الضيوف.",
        c2_coordination: "مطابقة عنصر/شخص/موضع لكل ضيف.",
        c3_variability: "عدد الضيوف ومواضع الجلوس قد تتغير أثناء الدور.",
        c4_choice_uncertainty: "قرارات في ترتيب التوزيع والمواضع المناسبة.",
      },
      rationale:
        "زيادة معنوية في العناصر والعلاقات: أكثر من نوع عنصر، ومطابقة بين العناصر والأشخاص والمواضع، وعدد الضيوف قد يتغير أثناء الدور، مع بعض القرارات في الترتيب. ومع ذلك يبقى الدور محدداً.",
    },
    execution_blocks: blocks("GJ-MODERATE-001", [
      "ننظر إلى أماكن جلوس الضيوف",
      "نأخذ الأكواب والأطباق",
      "نضع لكل ضيف كوباً وطبقاً",
      "نتأكد أن كل ضيف أمامه ما يحتاجه",
      "انتهينا",
    ]),
  },
  {
    id: "GJ-ADVANCED-001",
    title: "تلقّي طلبات المشروبات من الضيوف وتسليم كل مشروب لصاحبه",
    life_context: "ضيافة الأسرة",
    functional_intent: "أن يصل كل مشروب إلى الضيف الذي طلبه أثناء تقديم الضيافة",
    observable_effect: "أصبح بين يدي كل ضيف المشروب الذي طلبه",
    natural_completion:
      "ينتهي الدور عندما يصل إلى كل ضيف طلب مشروباً مشروبه الذي طلبه",
    standalone_role_meaning:
      "تلقّي الطلب وتسليمه دور وظيفي واحد قائم بذاته، مستقل عن تحضير المشروبات أو تنظيم المجلس.",
    participation_mode: "individual",
    event_id: "EV-HOSTING",
    validation_control: true,
    complexity: {
      level: "advanced",
      dimensions: {
        c1_elements: "طلب مختلف لكل ضيف، وعناصر مشروبات متعددة غير متماثلة.",
        c2_coordination: "مطابقة ثلاثية (طلب/مشروب/ضيف) مع ترتيب زمني بين التلقّي والتسليم.",
        c3_variability: "الطلبات قد تتغير أو تُضاف بعد بدء الدور.",
        c4_choice_uncertainty: "بدائل وقرارات عند تشابه المشروبات أو تعارض الطلبات.",
      },
      rationale:
        "متطلبات متعددة متفاعلة داخل بنية الدور نفسه: معلومات مختلفة (طلب لكل ضيف) تُحمل في الوقت نفسه، ومطابقة بين مشروب وضيف وموضع، وطلبات تتغير أو تُضاف أثناء حدوث الدور، وقرارات ذات أثر عند التشابه أو التعارض. الدور متقدم بسبب بنيته لا لأنه يمثل الحدث كله.",
    },
    execution_blocks: blocks("GJ-ADVANCED-001", [
      "نسأل كل ضيف عن مشروبه",
      "نتذكر طلب كل ضيف",
      "نأخذ المشروبات الجاهزة",
      "نعطي كل ضيف مشروبه الذي طلبه",
      "انتهينا",
    ]),
  },
];

/** المعرّفات الخمسة المجمّدة — أي توسعة ممنوعة (FREEZE §11). */
export const GOLDEN_PARTICIPATION_IDS = Object.freeze(
  GOLDEN_SEEDS.map((s) => s.id),
);

let ready = false;

/** تسجيل المجموعة الذهبية مرة واحدة داخل سجل الإطار غير القابل للتعديل. */
export function ensureGoldenCorpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of GOLDEN_SEEDS) {
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
      // السجل غير قابل للتعديل — تجاهل أي تسجيل مكرر.
    }
  }
}

export function getGoldenParticipation(
  id: string,
): FunctionalParticipation | null {
  ensureGoldenCorpus();
  if (!GOLDEN_PARTICIPATION_IDS.includes(id)) return null;
  return getFrameworkParticipation(id);
}

export function listGoldenParticipations(): FunctionalParticipation[] {
  ensureGoldenCorpus();
  return GOLDEN_PARTICIPATION_IDS.map((id) => getFrameworkParticipation(id)!).filter(
    Boolean,
  );
}

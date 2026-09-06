// مجموعة الدفعة 02 — مراجع إطارية مشتقة من قرارات هجرة موثّقة على المكتبة القديمة.
// كل سجل هنا تمثيل جديد منفصل تماماً: صف المكتبة القديمة يبقى كما هو ولا يُحوَّل في مكانه.
// لا يُسجَّل أي تعريف إلا بعد اجتياز البوابات السبع (FP-09)، ويصبح غير قابل للتعديل (IM-01).
// المرجع: FP-01..FP-12، CX-01..CX-09، IM-01..IM-03، D02.

import type { FunctionalParticipation } from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  registerFrameworkParticipation,
} from "./reference-registry";

/** نَسَب حتمي وقابل للتدقيق لكل سجل مُنتَج من المكتبة القديمة. */
export interface MigrationLineage {
  /** معرّف صف المكتبة القديمة الذي اشتُقّ منه التمثيل — لا يُعدَّل ذلك الصف. */
  legacy_id: string;
  legacy_title: string;
  legacy_event_id: string;
  domain_id: string;
  batch: "BATCH_02";
  disposition: "KEEP" | "EDIT";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  routing: "GREEN";
  reference_source: "framework_reference";
}

type Batch02Seed = Omit<FunctionalParticipation, "kind" | "provenance"> & {
  lineage: MigrationLineage;
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

const BATCH02_SEEDS: Batch02Seed[] = [
  {
    id: "FR-B02-COMM-005-OP001",
    title: "تحديد موعد اللقاء الأسري ومكانه مع الأسرة",
    life_context: "لقاء أسري خارج المنزل",
    functional_intent:
      "الوصول مع الأسرة إلى موعد ومكان يتّفق عليهما الجميع قبل الخروج",
    observable_effect:
      "أصبح للقاء موعد ومكان محدّدان يعرفهما أفراد الأسرة",
    natural_completion: "استقرّ الاختيار على موعد ومكان واحد للقاء",
    standalone_role_meaning:
      "المساهمة في قرار أسري مشترك دور له معنى بذاته داخل تخطيط اللقاء، وليس خطوة تنفيذية داخله.",
    participation_mode: "shared",
    event_id: "COMM-005",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "عنصران يُحسمان معاً: الموعد والمكان.",
        c2_coordination: "يتطلب مواءمة بين رأي أكثر من فرد في الأسرة.",
        c3_variability: "الخيارات المتاحة تختلف من لقاء إلى آخر.",
        c4_choice_uncertainty:
          "الاختيار بين بدائل مطروحة، ونتيجته غير محسومة قبل النقاش.",
      },
      rationale:
        "بنية الدور تجمع عنصرين يُحسمان بالمواءمة بين أكثر من رأي مع بدائل مطروحة، وهذا وحده يرفعه فوق المستوى البسيط.",
    },
    execution_blocks: blocks("FR-B02-COMM-005-OP001", [
      "نبدأ: ننظر إلى الخيارات المطروحة",
      "نشير إلى الموعد أو المكان المفضّل",
      "نسمع رأي بقية الأسرة",
      "انتهينا: صار للقاء موعد ومكان",
    ]),
    lineage: {
      legacy_id: "COMM-005-OP001",
      legacy_title: "تحديد موعد ومكان اللقاء الأسري",
      legacy_event_id: "COMM-005",
      domain_id: "DOM-COMM",
      batch: "BATCH_02",
      disposition: "EDIT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B02-COMM-002-OP001",
    title: "تجهيز أغراض النزهة في حقيبة الخروج",
    life_context: "زيارة الحديقة العامة",
    functional_intent: "أن تخرج الأسرة ومعها كل ما تحتاجه في النزهة",
    observable_effect: "أصبحت أغراض النزهة مجموعة في الحقيبة المخصّصة",
    natural_completion: "لم يبقَ غرض من قائمة النزهة خارج الحقيبة",
    standalone_role_meaning:
      "تجهيز ما تحتاجه الأسرة قبل الخروج دور مفهوم بذاته، ويظل له معنى حتى لو تأجّلت الزيارة.",
    participation_mode: "individual",
    event_id: "COMM-002",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عدة أغراض معروفة تُنقل إلى وعاء واحد.",
        c2_coordination: "لا يتطلب تزامناً مع دور آخر.",
        c3_variability: "قائمة الأغراض معتادة وثابتة غالباً.",
        c4_choice_uncertainty: "لا بدائل تحتاج حسماً أثناء الدور.",
      },
      rationale:
        "غرض واحد واضح ووجهة واحدة للأغراض، بلا تنسيق أو حسم بدائل أثناء الدور.",
    },
    execution_blocks: blocks("FR-B02-COMM-002-OP001", [
      "نبدأ: نحضر الحقيبة المخصّصة للنزهة",
      "نحضر كل غرض من مكانه",
      "نضعه داخل الحقيبة",
      "انتهينا: الحقيبة جاهزة للخروج",
    ]),
    lineage: {
      legacy_id: "COMM-002-OP001",
      legacy_title: "تجهيز أغراض النزهة",
      legacy_event_id: "COMM-002",
      domain_id: "DOM-COMM",
      batch: "BATCH_02",
      disposition: "EDIT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B02-HEALTH-014-OP001",
    title: "ضبط منبّه لموعد الجرعة",
    life_context: "متابعة مواعيد جرعات الدواء في البيت",
    functional_intent: "أن يصل تنبيه في الوقت الذي حدّدته الأسرة للجرعة",
    observable_effect: "أصبح في الجهاز منبّه مضبوط على وقت الجرعة",
    natural_completion: "حُفظ المنبّه على الوقت المطلوب",
    standalone_role_meaning:
      "ضبط تنبيه لموعد متّفق عليه دور له أثر مستقل في يوم الأسرة، حتى لو نفّذ غيرُه بقية المتابعة.",
    participation_mode: "individual",
    event_id: "HEALTH-014",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عنصر واحد: وقت واحد داخل تطبيق واحد.",
        c2_coordination: "لا يتطلب تنسيقاً مع دور آخر أثناء الضبط.",
        c3_variability: "الوقت محدّد سلفاً ولا يتغيّر أثناء الدور.",
        c4_choice_uncertainty: "لا بدائل تُحسم أثناء الدور.",
      },
      rationale:
        "عنصر واحد ونتيجة مباشرة مرئية فوراً، بلا تنسيق أو بدائل.",
    },
    execution_blocks: blocks("FR-B02-HEALTH-014-OP001", [
      "نبدأ: نفتح تطبيق المنبّه",
      "نضيف منبّهاً جديداً",
      "نضبط وقت الجرعة المتّفق عليه",
      "انتهينا: المنبّه محفوظ",
    ]),
    lineage: {
      legacy_id: "HEALTH-014-OP001",
      legacy_title: "ضبط منبه لموعد الدواء",
      legacy_event_id: "HEALTH-014",
      domain_id: "DOM-HEALTH",
      batch: "BATCH_02",
      disposition: "EDIT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B02-SHOP-066-OP001",
    title: "توزيع عبوات العناية على الحمامات",
    life_context: "تخزين مستلزمات العناية الشخصية بعد التسوق",
    functional_intent: "أن يجد كل فرد عبوته في الحمام الذي يستعمله",
    observable_effect: "أصبحت العبوات موجودة داخل الحمامات لا في أكياس التسوق",
    natural_completion: "لم تبقَ عبوة عناية خارج مكانها",
    standalone_role_meaning:
      "توصيل المشتريات إلى أماكن استعمالها دور مفهوم بذاته وينفصل عن رحلة التسوق نفسها.",
    participation_mode: "individual",
    event_id: "SHOP-066",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "عدة عبوات مختلفة وأكثر من حمّام.",
        c2_coordination: "يتطلب مطابقة كل عبوة بالمكان الذي تخصّه.",
        c3_variability: "ما يُشترى يختلف من مرة إلى أخرى.",
        c4_choice_uncertainty: "توزيع العبوة المكرّرة يحتاج حسماً بسيطاً.",
      },
      rationale:
        "تعدّد العناصر مع مطابقتها بأكثر من وجهة يجعل بنية الدور أوسع من نقل عنصر واحد إلى مكان واحد.",
    },
    execution_blocks: blocks("FR-B02-SHOP-066-OP001", [
      "نبدأ: نخرج عبوات العناية من الأكياس",
      "نحمل عبوات الحمّام الأول",
      "نضعها في مكانها هناك",
      "نكرّر مع بقية الحمّامات",
      "انتهينا: كل عبوة في مكانها",
    ]),
    lineage: {
      legacy_id: "SHOP-066-OP001",
      legacy_title: "توزيع عبوات الشامبو والصابون في الحمامات",
      legacy_event_id: "SHOP-066",
      domain_id: "DOM-SHOP",
      batch: "BATCH_02",
      disposition: "EDIT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B02-SHOP-019-OP002",
    title: "طلب تجربة الجهاز من البائع",
    life_context: "شراء جهاز إلكتروني من المتجر",
    functional_intent: "أن ترى الأسرة الجهاز وهو يعمل قبل قرار الشراء",
    observable_effect: "أحضر البائع الجهاز وشغّله أمام الأسرة",
    natural_completion: "انتهت التجربة أمام الأسرة",
    standalone_role_meaning:
      "طلب شيء من شخص خارج الأسرة دور تواصلي قائم بذاته، وأثره يظهر في المتجر مهما كان قرار الشراء.",
    participation_mode: "individual",
    event_id: "SHOP-019",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "طرف آخر خارج الأسرة وجهاز محدّد.",
        c2_coordination: "يتطلب انتظار استجابة البائع ومجاراتها.",
        c3_variability: "ردّ البائع وترتيب المتجر يختلفان كل مرة.",
        c4_choice_uncertainty: "مسار الحوار غير محدّد سلفاً.",
      },
      rationale:
        "وجود طرف خارجي غير متوقّع الاستجابة يجعل بنية الدور غير ثابتة أثناء حدوثه.",
    },
    execution_blocks: blocks("FR-B02-SHOP-019-OP002", [
      "نبدأ: نتّجه إلى البائع",
      "نطلب تجربة الجهاز",
      "ننتظر حتى يجهّزه",
      "انتهينا: رأينا الجهاز يعمل",
    ]),
    lineage: {
      legacy_id: "SHOP-019-OP002",
      legacy_title: "طلب تجربة الجهاز من البائع",
      legacy_event_id: "SHOP-019",
      domain_id: "DOM-SHOP",
      batch: "BATCH_02",
      disposition: "EDIT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
];

/** حدّ الدفعة: خمسة سجلات كحد أقصى — لا توسعة داخل هذه الدفعة. */
export const BATCH02_PARTICIPATION_IDS = Object.freeze(
  BATCH02_SEEDS.map((s) => s.id),
);

const lineageById = new Map<string, MigrationLineage>(
  BATCH02_SEEDS.map((s) => [s.id, Object.freeze({ ...s.lineage })]),
);

let ready = false;

/** تسجيل مراجع الدفعة 02 مرة واحدة داخل السجل غير القابل للتعديل. */
export function ensureBatch02Corpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of BATCH02_SEEDS) {
    if (getFrameworkParticipation(seed.id)) continue;
    const { lineage: _lineage, ...rest } = seed;
    const candidate = {
      ...rest,
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

export function getBatch02Participation(
  id: string,
): FunctionalParticipation | null {
  ensureBatch02Corpus();
  if (!BATCH02_PARTICIPATION_IDS.includes(id)) return null;
  return getFrameworkParticipation(id);
}

export function listBatch02Participations(): FunctionalParticipation[] {
  ensureBatch02Corpus();
  return BATCH02_PARTICIPATION_IDS.map(
    (id) => getFrameworkParticipation(id)!,
  ).filter(Boolean);
}

/** النَسَب الحتمي لمرجع مُشتق من المكتبة القديمة، أو null لغير سجلات الدفعة 02. */
export function getMigrationLineage(id: string): MigrationLineage | null {
  return lineageById.get(id) ?? null;
}

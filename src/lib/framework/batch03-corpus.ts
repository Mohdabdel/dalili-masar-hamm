// مجموعة الدفعة 03 — مراجع إطارية مشتقة من خطة مراجعة موثّقة بعد اختبار مكتبي.
// كل سجل هنا تمثيل جديد منفصل: صفوف Legacy Master تبقى كما هي وتستعمل كنَسَب فقط.
// المرجع: DALILI_MIGRATION_BATCH_03_PLAN_01 و DALILI_BATCH_03_TEST_PROTOCOL_01.

import type { FunctionalParticipation } from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  registerFrameworkParticipation,
} from "./reference-registry";

export interface Batch03Lineage {
  candidate_id: string;
  source_artifact:
    | "DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE"
    | "DALILI_CONTROLLED_EXPANSION_WAVE_A_12_CANDIDATES_01";
  source_evidence_ids: readonly string[];
  source_titles: readonly string[];
  batch: "BATCH_03";
  disposition: "DESK_REVIEW_ACCEPT";
  confidence: "HIGH" | "MEDIUM" | "LOW";
  routing: "GREEN";
  reference_source: "framework_reference";
}

type Batch03Seed = Omit<FunctionalParticipation, "kind" | "provenance"> & {
  lineage: Batch03Lineage;
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

const BATCH03_SEEDS: Batch03Seed[] = [
  {
    id: "FR-B03-FOOD-001-OP002",
    title: "تجهيز مائدة الإفطار",
    life_context: "تجهيز مائدة الإفطار للأسرة",
    functional_intent:
      "جعل أدوات التقديم اللازمة للإفطار جاهزة لاستخدام الأسرة",
    observable_effect:
      "تكون أدوات المائدة/التقديم المطلوبة جاهزة في مكان الإفطار",
    natural_completion: "عندما تصبح الأدوات المطلوبة جاهزة للاستخدام",
    standalone_role_meaning:
      "تجهيز مائدة الإفطار دور له معنى داخل تجهيز مائدة الإفطار للأسرة، لأنه يترك أثرًا محددًا في الموقف حتى إذا تولى آخرون بقية النشاط.",
    participation_mode: "shared",
    event_id: "FOOD-001",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عناصر قليلة ومباشرة داخل الدور: تجهيز مائدة الإفطار.",
        c2_coordination:
          "يوجد ربط بين هذا الدور وسياق الأسرة أو ترتيب الحدث.",
        c3_variability: "الموقف ثابت غالبًا ويتكرر بصورة مألوفة.",
        c4_choice_uncertainty: "الاختيارات محدودة ومحددة مسبقًا.",
      },
      rationale:
        "بنية الدور صنفت simple اعتمادًا على العناصر والتنسيق والتغير والاختيار فقط (C1=0, C2=1, C3=0, C4=0), دون أي معيار متعلق بالشخص أو الدعم أو عدد الخطوات.",
    },
    execution_blocks: blocks("FR-B03-FOOD-001-OP002", [
      "تحضير الأطباق والأكواب",
      "تحضير المشروبات المرافقة",
    ]),
    lineage: {
      candidate_id: "FP-CAND-001",
      source_artifact: "DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE",
      source_evidence_ids: ["FOOD-001-OP002", "FOOD-001-OP004"],
      source_titles: ["تحضير الأطباق والأكواب", "تحضير المشروبات المرافقة"],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B03-SHOP-009-OP001",
    title: "تجهيز أكياس التسوق للخروج",
    life_context: "الذهاب إلى السوبرماركت",
    functional_intent: "جعل أكياس التسوق اللازمة متاحة للرحلة",
    observable_effect: "تكون الأكياس المطلوبة موجودة في السيارة/مع الأسرة",
    natural_completion: "عندما تصبح الأكياس جاهزة قبل الانطلاق",
    standalone_role_meaning:
      "تجهيز أكياس التسوق للخروج دور له معنى داخل الذهاب إلى السوبرماركت، لأنه يترك أثرًا محددًا في الموقف حتى إذا تولى آخرون بقية النشاط.",
    participation_mode: "individual",
    event_id: "SHOP-004",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements:
          "عناصر قليلة ومباشرة داخل الدور: تجهيز أكياس التسوق للخروج.",
        c2_coordination:
          "تسلسل مباشر لا يحتاج ربطًا ملحوظًا مع أدوار أخرى.",
        c3_variability: "الموقف ثابت غالبًا ويتكرر بصورة مألوفة.",
        c4_choice_uncertainty: "الاختيارات محدودة ومحددة مسبقًا.",
      },
      rationale:
        "بنية الدور صنفت simple اعتمادًا على العناصر والتنسيق والتغير والاختيار فقط (C1=0, C2=0, C3=0, C4=0), دون أي معيار متعلق بالشخص أو الدعم أو عدد الخطوات.",
    },
    execution_blocks: blocks("FR-B03-SHOP-009-OP001", [
      "حمل الأكياس الفارغة إلى السيارة",
    ]),
    lineage: {
      candidate_id: "FP-CAND-011",
      source_artifact: "DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE",
      source_evidence_ids: ["SHOP-004-OP002"],
      source_titles: ["حمل الأكياس الفارغة إلى السيارة"],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B03-HOME-018-OP001",
    title: "إعادة الكتب إلى الرفوف",
    life_context: "ترتيب الكتب والرفوف",
    functional_intent:
      "إعادة الكتب المستخدمة إلى تنظيم يجعل الرف قابلًا للاستخدام",
    observable_effect:
      "تكون الكتب المستهدفة عائدة إلى الرفوف وفق التنظيم المستخدم في المنزل",
    natural_completion: "عندما تعود الكتب المستهدفة إلى أماكنها",
    standalone_role_meaning:
      "إعادة الكتب إلى الرفوف دور له معنى داخل ترتيب الكتب والرفوف، لأنه يترك أثرًا محددًا في الموقف حتى إذا تولى آخرون بقية النشاط.",
    participation_mode: "individual",
    event_id: "HOME-007",
    complexity: {
      level: "simple",
      dimensions: {
        c1_elements: "عناصر قليلة ومباشرة داخل الدور: إعادة الكتب إلى الرفوف.",
        c2_coordination:
          "تسلسل مباشر لا يحتاج ربطًا ملحوظًا مع أدوار أخرى.",
        c3_variability: "الموقف ثابت غالبًا ويتكرر بصورة مألوفة.",
        c4_choice_uncertainty: "الاختيارات محدودة ومحددة مسبقًا.",
      },
      rationale:
        "بنية الدور صنفت simple اعتمادًا على العناصر والتنسيق والتغير والاختيار فقط (C1=0, C2=0, C3=0, C4=0), دون أي معيار متعلق بالشخص أو الدعم أو عدد الخطوات.",
    },
    execution_blocks: blocks("FR-B03-HOME-018-OP001", [
      "جمع الكتب المتناثرة",
      "إعادة الكتب وتصفيفها بشكل عمودي",
    ]),
    lineage: {
      candidate_id: "FP-CAND-018",
      source_artifact: "DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE",
      source_evidence_ids: ["HOME-007-OP001", "HOME-007-OP003"],
      source_titles: [
        "جمع الكتب المتناثرة.",
        "إعادة الكتب وتصفيفها بشكل عمودي.",
      ],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "MEDIUM",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B03-COMM-002-OP001",
    title: "تجهيز أغراض النزهة العائلية",
    life_context: "الذهاب في نزهة عائلية إلى الحديقة",
    functional_intent: "جعل أغراض النزهة المطلوبة جاهزة قبل الخروج مع الأسرة",
    observable_effect:
      "تكون أغراض النزهة المتفق عليها موضوعة في الحقيبة أو السيارة قبل الانطلاق",
    natural_completion:
      "عندما توضع أغراض النزهة المتفق عليها في الحقيبة أو السيارة",
    standalone_role_meaning:
      "تجهيز أغراض النزهة العائلية دور له معنى داخل الذهاب في نزهة عائلية إلى الحديقة، لأنه يترك أثرًا محددًا في الموقف حتى إذا تولى آخرون بقية النشاط.",
    participation_mode: "shared",
    event_id: "COMM-002",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements:
          "عدة عناصر مرتبطة بالدور وتحتاج ترتيبًا واضحًا: تجهيز أغراض النزهة العائلية.",
        c2_coordination:
          "يوجد ربط بين هذا الدور وسياق الأسرة أو ترتيب الحدث.",
        c3_variability:
          "قد تختلف العناصر أو المكان أو تفاصيل الموقف من مرة لأخرى.",
        c4_choice_uncertainty: "الاختيارات محدودة ومحددة مسبقًا.",
      },
      rationale:
        "بنية الدور صنفت moderate اعتمادًا على العناصر والتنسيق والتغير والاختيار فقط (C1=1, C2=1, C3=1, C4=0), دون أي معيار متعلق بالشخص أو الدعم أو عدد الخطوات.",
    },
    execution_blocks: blocks("FR-B03-COMM-002-OP001", [
      "تجهيز أغراض النزهة",
      "وضع الأغراض في الحقيبة أو السيارة",
    ]),
    lineage: {
      candidate_id: "FP-CAND-020",
      source_artifact: "DALILI_CANDIDATE_LIBRARY_03_PRODUCTION_CONTRACT_COMPLETE",
      source_evidence_ids: ["COMM-002-OP001"],
      source_titles: ["تجهيز أغراض النزهة"],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B03-HEALTH-001-OP001",
    title: "البحث عن رقم العيادة",
    life_context:
      "أثناء حجز موعد طبي، الاتصال بالعيادة أو التطبيق لتحديد موعد زيارة طبية.",
    functional_intent:
      "جعل رقم العيادة متاحًا للأسرة قبل إكمال حجز الموعد.",
    observable_effect:
      "يصبح رقم العيادة المطلوب ظاهرًا ويمكن استخدامه لإكمال الحجز.",
    natural_completion:
      "ينتهي الدور عندما يظهر رقم العيادة المطلوب أمام الأسرة.",
    standalone_role_meaning:
      "البحث عن رقم العيادة دور له معنى داخل حجز موعد طبي، لأنه يغيّر حالة محددة في الموقف حتى إذا تولى آخرون بقية النشاط.",
    participation_mode: "shared",
    event_id: "HEALTH-001",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements: "عدة عناصر مرتبطة بالدور: البحث عن رقم العيادة.",
        c2_coordination:
          "يتطلب تنسيقًا واضحًا بين ترتيب الحدث ومتطلبات الأسرة أو الجهة الخارجية.",
        c3_variability:
          "قد تختلف التفاصيل أو العناصر أو المكان ضمن حدود مألوفة.",
        c4_choice_uncertainty: "يوجد اختيار محدود بين بدائل واضحة.",
      },
      rationale:
        "بنية الدور صنفت moderate اعتمادًا على عناصر الدور وتنسيقه وتغيره وخياراته فقط: role_scope=moderate, organization=advanced, variation=moderate.",
    },
    execution_blocks: blocks("FR-B03-HEALTH-001-OP001", [
      "فتح مصدر الأرقام",
      "البحث عن اسم العيادة",
      "تحديد الرقم المطلوب",
    ]),
    lineage: {
      candidate_id: "FP-WAVE-A-001",
      source_artifact: "DALILI_CONTROLLED_EXPANSION_WAVE_A_12_CANDIDATES_01",
      source_evidence_ids: ["HEALTH-001-OP001"],
      source_titles: ["البحث عن رقم العيادة"],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
  {
    id: "FR-B03-CLO-011-OP001",
    title: "فرز الملابس المتسخة قبل الغسيل",
    life_context:
      "أثناء جمع الملابس قبل الغسيل، تفصل الأسرة الملابس المتسخة إلى مجموعات واضحة قبل تشغيل الغسالة.",
    functional_intent:
      "للمساهمة في تجهيز الغسيل قبل بدء الغسالة عبر فصل الملابس إلى مجموعات واضحة.",
    observable_effect: "تصبح الملابس المتسخة مفصولة إلى مجموعات واضحة قبل الغسيل.",
    natural_completion:
      "ينتهي الدور عندما توضع كل مجموعة ملابس في مكانها المحدد قبل تشغيل الغسالة.",
    standalone_role_meaning:
      "فرز الملابس المتسخة قبل الغسيل دور له معنى داخل جمع الملابس للغسيل، لأنه يجهز المجموعات التي ستدخل الغسالة حتى إذا تولى آخرون تشغيلها.",
    participation_mode: "individual",
    event_id: "CLO-011",
    complexity: {
      level: "moderate",
      dimensions: {
        c1_elements:
          "عدة عناصر مرتبطة بالدور: فرز الملابس المتسخة قبل الغسيل.",
        c2_coordination:
          "يتطلب تنسيقًا واضحًا بين ترتيب الحدث ومتطلبات الأسرة أو الجهة الخارجية.",
        c3_variability:
          "قد تختلف التفاصيل أو العناصر أو المكان ضمن حدود مألوفة.",
        c4_choice_uncertainty: "يوجد اختيار محدود بين بدائل واضحة.",
      },
      rationale:
        "بنية الدور صنفت moderate اعتمادًا على عناصر الدور وتنسيقه وتغيره وخياراته فقط: role_scope=moderate, organization=advanced, variation=moderate.",
    },
    execution_blocks: blocks("FR-B03-CLO-011-OP001", [
      "فصل الملابس الفاتحة عن الداكنة",
      "فصل الأقمشة الحساسة",
      "تجميع كل مجموعة معًا",
    ]),
    lineage: {
      candidate_id: "FP-WAVE-A-005",
      source_artifact: "DALILI_CONTROLLED_EXPANSION_WAVE_A_12_CANDIDATES_01",
      source_evidence_ids: ["CLO-011-OP001"],
      source_titles: ["فرز الملابس المتسخة قبل الغسيل"],
      batch: "BATCH_03",
      disposition: "DESK_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  },
];

export const BATCH03_PARTICIPATION_IDS = Object.freeze(
  BATCH03_SEEDS.map((seed) => seed.id),
);

const lineageById = new Map<string, Batch03Lineage>(
  BATCH03_SEEDS.map((seed) => [seed.id, Object.freeze({ ...seed.lineage })]),
);

let ready = false;

export function ensureBatch03Corpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of BATCH03_SEEDS) {
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

export function getBatch03Participation(
  id: string,
): FunctionalParticipation | null {
  ensureBatch03Corpus();
  if (!BATCH03_PARTICIPATION_IDS.includes(id)) return null;
  return getFrameworkParticipation(id);
}

export function listBatch03Participations(): FunctionalParticipation[] {
  ensureBatch03Corpus();
  return BATCH03_PARTICIPATION_IDS.map(
    (id) => getFrameworkParticipation(id)!,
  ).filter(Boolean);
}

export function getBatch03Lineage(id: string): Batch03Lineage | null {
  return lineageById.get(id) ?? null;
}

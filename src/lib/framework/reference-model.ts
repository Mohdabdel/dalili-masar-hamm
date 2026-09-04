// النموذج القياسي المتوافق مع الإطار المجمّد (Foundation 02).
// إضافي بالكامل: لا يمسّ محتوى المكتبة القديم (Legacy Master) ولا يعدّله.
// المراجع: FP-01..FP-12، CX-01..CX-09، IM-01..IM-03.

/** مصدر السجل المرجعي — يميز المحتوى القديم عن المحتوى المتوافق مع الإطار. */
export type ReferenceProvenance = "legacy_master" | "framework_reference";

/** نمط المشاركة — مستقل تماماً عن مستوى التعقيد (FP-08، CX-08). */
export type ParticipationMode = "individual" | "shared";

/** المستويات التشغيلية الثلاثة حصراً (CX-03). */
export type ComplexityLevel = "simple" | "moderate" | "advanced";

/** أبعاد التعقيد الأربعة حصراً (CX-02) — تُؤلَّف تحريرياً ولا تُحسب (CX-04). */
export interface ComplexityDimensions {
  /** C1 العناصر */
  c1_elements: string;
  /** C2 التنسيق */
  c2_coordination: string;
  /** C3 التغيّر */
  c3_variability: string;
  /** C4 الاختيار / عدم اليقين */
  c4_choice_uncertainty: string;
}

export interface FrameworkComplexity {
  level: ComplexityLevel;
  dimensions: ComplexityDimensions;
  /** مبرر بنيوي للدور فقط، بلا معيار شخصي (CX-09). */
  rationale: string;
}

/** السياق المفضّل — مفهوم مستقل، إما عائلي أو مقترح مرجعي (D01). */
export interface PreferredContext {
  kind: "preferred_context";
  id: string;
  description: string;
  origin: "family_described" | "reference_suggested";
}

/** الحدث — سجل مستقل قد يحتوي أكثر من مشاركة وظيفية (FP-10). */
export interface FrameworkEvent {
  kind: "event";
  id: string;
  title: string;
  life_context: string;
}

/** كتلة التنفيذ — سجل مستقل لا يساوي الدور نفسه (FP-11). */
export interface ExecutionBlock {
  kind: "execution_block";
  id: string;
  order: number;
  text: string;
}

/** المشاركة الوظيفية المتوافقة مع الإطار. */
export interface FunctionalParticipation {
  kind: "functional_participation";
  provenance: "framework_reference";
  id: string;
  title: string;
  /** بوابة 1 (FP-02) */
  life_context: string;
  /** بوابة 2 (FP-03) */
  functional_intent: string;
  /** بوابة 3 (FP-04) */
  observable_effect: string;
  /** بوابة 4 (FP-05) */
  natural_completion: string;
  /** بوابة 5 (FP-06): معنى الدور عند فصله عن النشاط الأكبر */
  standalone_role_meaning: string;
  /** بوابة 7 (FP-08) */
  participation_mode: ParticipationMode;
  complexity: FrameworkComplexity;
  execution_blocks: ExecutionBlock[];
  event_id?: string;
  preferred_context_id?: string;
}

/** غلاف للسجل القديم — يحفظ المصدر دون نسخ المحتوى أو تحويله (D02). */
export interface LegacyReferenceRecord {
  kind: "legacy_opportunity";
  provenance: "legacy_master";
  id: string;
  title: string;
  /** المرجع القديم كما هو، بلا تعديل. */
  legacy: unknown;
}

export type ReferenceRecord = FunctionalParticipation | LegacyReferenceRecord;

export function isFrameworkParticipation(
  record: ReferenceRecord | null | undefined,
): record is FunctionalParticipation {
  return !!record && record.provenance === "framework_reference";
}

export function isLegacyReference(
  record: ReferenceRecord | null | undefined,
): record is LegacyReferenceRecord {
  return !!record && record.provenance === "legacy_master";
}

/** المشاركة الوظيفية مرشحة قبل التحقق: قد تنقص حقول أو تحمل صياغة ممنوعة. */
export type CandidateFunctionalParticipation = Partial<
  Omit<FunctionalParticipation, "kind" | "provenance">
> & { id: string };

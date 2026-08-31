// نماذج بيانات الـVertical Slice داخل Lab فقط.
// لا تقييم، لا نسب، لا مؤشرات إتقان، ولا وصف لقدرة الشخص.

export type SliceLevel = "simple" | "moderate" | "advanced";
export type SlicePhase = "before" | "during" | "after";
export type SliceContext = "home" | "community";

/** طريقة تنفيذ بديلة متكافئة لنفس الخطوة — ليست خطوة تالية ولا مستوى أعلى. */
export interface LabExecutionOption {
  id: string;
  label_ar: string;
  visual_asset?: string | null;
}

export interface LabSubstep {
  id: string;
  order: number;
  instruction_family_ar: string;
  instruction_short_ar: string;
  visual_asset?: string | null;
  executionOptions?: LabExecutionOption[];
}

export interface LabMajorStep {
  id: string;
  order: number;
  instruction_family_ar: string;
  instruction_short_ar: string;
  visual_asset?: string | null;
  substeps: LabSubstep[];
}

export interface LabParticipationSpec {
  id: string;
  eventId: string;
  eventTitle_ar: string;
  phase?: SlicePhase;
  level: SliceLevel;
  context: SliceContext;
  title_ar: string;
  majorSteps: LabMajorStep[];
}

/** كيف تُعرض الخطوة للمشارك: صورة وجملة، صورة فقط، أو جملة فقط. */
export type StepPresentationMode = "both" | "visual" | "text";

/** ترتيب الكتلتين داخل بطاقة الخطوة. */
export type StepBlockOrder = "visual-text" | "text-visual";

/**
 * مرجع صورة الخطوة: أصل مصدر، وأصل مشتق (مقصوص) اختياري.
 * المصدر لا يُعدَّل أبداً؛ الاشتقاق يُسجَّل هنا فقط.
 */
export interface LabStepImageRef {
  sourceAssetCode: string;
  derivedAssetCode?: string | null;
}


/** اختيار الأسرة لهذه المرة — بترتيب تنفيذ صريح. */
export interface LabThisTimeSelection {
  specId: string;
  selected: { stepId: string; order: number }[];
  chosenExecutionOptionByStepId: Record<string, string>;
  supportTools: string[];
  /** نص الأسرة المحلي لكل خطوة — لا يعدّل مكتبة الحياة. */
  familyTextByStepId?: Record<string, string>;
  /** الصورة التي اختارتها الأسرة لكل خطوة ("" = بلا صورة). */
  visualByStepId?: Record<string, string>;
  /** خطوات اختارت الأسرة إبقاءها نصًا فقط (توافق قديم مع presentationByStepId). */
  textOnlyStepIds?: string[];
  /** كيف تُعرض كل خطوة: صورة وجملة / صورة فقط / جملة فقط. */
  presentationByStepId?: Record<string, StepPresentationMode>;
  /** ترتيب الصورة والجملة داخل بطاقة الخطوة. */
  blockOrderByStepId?: Record<string, StepBlockOrder>;
  /** مرجع صورة كل خطوة: مصدر ← مشتق. مستقل تماماً عن نص الأسرة. */
  imageRefByStepId?: Record<string, LabStepImageRef | null>;
  /** ظهور الصورة لكل خطوة — مستقل عن ظهور النص. */
  imageVisibleByStepId?: Record<string, boolean>;
  /** ظهور العبارة لكل خطوة — مستقل عن الصورة. */
  textVisibleByStepId?: Record<string, boolean>;
  /** نبدأ من / نتوقف عند كما اختارتهما الأسرة. */
  startStepId?: string;
  endStepId?: string;
  /** اعتبارات اختارتها الأسرة للاحتفاظ بها مع هذه المشاركة (اختيارية تماماً). */
  considerationIds?: string[];
  /** بدأنا من مسودة مولّدة تلقائيًا؟ */
  drafted?: boolean;
}

/** إطار مجمّد داخل البطاقة: نص وصورة منسوخان وقت الاعتماد. */
export interface LabCardFrame {
  sourceStepId: string;
  order: number;
  /** النص المعتمد للعرض = نص الأسرة. */
  text_short_ar: string;
  /** النص المرجعي من مكتبة الحياة — للمرجع فقط. */
  sourceText_ar?: string;
  assetRef: string | null;
  executionOptionLabel_ar?: string;
  /** كيف اعتمدت الأسرة عرض هذه الخطوة. */
  presentation?: StepPresentationMode;
  /** ترتيب الصورة/الجملة كما اعتمدته الأسرة. */
  blockOrder?: StepBlockOrder;
}

export interface LabCardSnapshot {
  id: string;
  participationSpecId: string;
  version: number;
  createdAt: string;
  title_ar: string;
  frames: LabCardFrame[];
  supportTools: string[];
  /** مرجع الحدث والمشاركة الأصلية — منسوخ وقت الاعتماد. */
  eventId?: string;
  eventTitle_ar?: string;
  participationTitle_ar?: string;
  level?: SliceLevel;
  context?: SliceContext;
  domainName_ar?: string;
  date?: string;
  startText_ar?: string;
  endText_ar?: string;
  /** مراجع مخرجات الدعم المستقلة — ليست جزءًا من بطاقة المشارك. */
  supportAssetIds?: string[];
}

export type SliceTone = "comfortable" | "usual" | "difficult_today";

export interface SliceFeedback {
  snapshotId: string;
  date: string;
  tone: SliceTone;
  reasons: string[];
}

export type SliceLifecycleChoice =
  | "repeat"
  | "adjust"
  | "expand"
  | "make_routine"
  | "not_now"
  | "close_card";

/**
 * DALILI-FINAL-PATCH — طبقات إضافية فوق النموذج الحالي.
 * لا تغيّر المسار الأساسي: حدث → مستوى → مشاركة → مساحة الأسرة → بطاقة مجمّدة.
 */

/** حالة الدعم البصري لخطوة — جاهزية تكييف، وليست وصفًا لأي شخص. */
export type LabVisualStatus =
  | "exact"
  | "functional"
  | "object"
  | "sequence"
  | "communication"
  | "schedule"
  | "needed"
  | "not_required";

export type LabSupportAssetType = "communication" | "time" | "schedule";

/** شكل الوسيلة البصرية المولّدة من مسودّة الأسرة. */
export type LabSupportAssetKind = "schedule" | "now-next" | "choice-board" | "sequence";

/** عنصر واحد داخل الوسيلة — منسوخ من المسودة وقت التوليد. */
export interface LabSupportAssetEntry {
  stepId: string;
  /** عبارة الأسرة كما هي في المسودة وقت التوليد. */
  text: string;
  /** رمز الأصل البصري المستخدم (مشتق أو مفرد)، أو null. */
  assetCode: string | null;
  src: string | null;
}

/** تكوين الوسيلة البصرية — يوثّق مصدرها من مسودة الأسرة. */
export interface LabSupportAssetConfig {
  kind: LabSupportAssetKind;
  entries: LabSupportAssetEntry[];
  /** الخطوات التي كانت في المسودة وقت التوليد (بعد الحذف والترتيب). */
  sourceStepIds: string[];
  generatedFrom: "family_draft";
}

/** مخرج دعم مستقل — لا يُدمج داخل بطاقة المشارك. */
export interface LabSupportAsset {
  id: string;
  type: LabSupportAssetType;
  label_ar: string;
  specId: string;
  snapshotId?: string;
  createdAt: string;
  items: string[];
  config?: LabSupportAssetConfig;
}

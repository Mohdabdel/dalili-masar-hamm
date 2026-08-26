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

/** اختيار الأسرة لهذه المرة — بترتيب تنفيذ صريح. */
export interface LabThisTimeSelection {
  specId: string;
  selected: { stepId: string; order: number }[];
  chosenExecutionOptionByStepId: Record<string, string>;
  supportTools: string[];
}

/** إطار مجمّد داخل البطاقة: نص وصورة منسوخان وقت الاعتماد. */
export interface LabCardFrame {
  sourceStepId: string;
  order: number;
  text_short_ar: string;
  assetRef: string | null;
  executionOptionLabel_ar?: string;
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
  date?: string;
  startText_ar?: string;
  endText_ar?: string;
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

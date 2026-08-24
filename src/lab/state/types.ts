// نماذج بيانات النموذج التجريبي (Lab) — وهمية بالكامل.
// لا اتصال بقاعدة البيانات، ولا حقول تقييم أو إتقان أو نسب إكمال.

export type LabContext = "home" | "community";
export type LabMode = "single" | "routine";
export type LabPhase = "before" | "during" | "after";
export type LabLevel = "simple" | "moderate" | "advanced";
export type LabUiState = "ready" | "empty" | "loading" | "error";
export type LabTimeOfDay = "morning" | "afternoon" | "evening";

/** نبرة المشاركة كما تصفها الأسرة — ليست تقييماً للشخص. */
export type LabTone = "comfortable" | "usual" | "difficult_today";

export type LabLifecycleState =
  | "draft"
  | "active"
  | "repeated"
  | "continue"
  | "adjust"
  | "expand"
  | "routine"
  | "archive";

export type LabCadence =
  | "daily"
  | "specific_days"
  | "weekly"
  | "monthly"
  | "occasional";

export interface LabPath {
  stationId?: string;
  phase?: LabPhase;
  componentId?: string;
  level?: LabLevel;
}

export interface LabRoutineEvent {
  id: string;
  eventId: string;
  label: string;
  order: number;
  /** بعض الأحداث فقط تحمل محطة مشاركة — وهذا اختياري تماماً. */
  isParticipationStation: boolean;
  timeOfDay: LabTimeOfDay;
}

export interface LabRoutine {
  cadence: LabCadence;
  days: string[];
  events: LabRoutineEvent[];
}

export interface LabParticipation {
  id: string;
  opportunityId: string;
  opportunityName: string;
  eventId: string;
  eventName: string;
  context: LabContext;
  level?: LabLevel;
  lifecycle: LabLifecycleState;
  /** عدد مرات المشاركة فقط — ليس مقياس تقدم. */
  timesShared: number;
  lastSharedAt?: string;
  stableInRoutine: boolean;
  /** نسخة موسّعة اختارتها الأسرة (النسخة السابقة تبقى محفوظة). */
  expandedFrom?: string;
}

export interface LabSetup {
  /** أجزاء شارك فيها من قبل — اختيارية، وعدم اختيارها لا يعني عدم القدرة. */
  priorSteps: number[];
  /** أين تكون نهاية المشاركة هذه المرة — نقطة توقف، وليست تقييماً. */
  stopPointStepIndex?: number;
  supports: string[];
}

export interface LabCard {
  id: string;
  participationId: string;
  version: number;
  date: string;
  steps: string[];
  stopPointStepIndex?: number;
  supports: string[];
  approvedAt?: string;
}

export interface LabRun {
  cardId: string;
  date: string;
  /**
   * لإدارة انتقال الشاشة بين الخطوات داخل Lab فقط.
   * ليس مؤشر إنجاز ولا نسبة إكمال، ولا يُشتق منه أي تقدم أو تقييم.
   */
  completedSteps: number[];
}

export interface LabFeedback {
  cardId: string;
  date: string;
  tone: LabTone;
  reasons: string[];
}

export interface LabInterest {
  id: string;
  text: string;
}

export interface LabSuggestion {
  id: string;
  kind: "assist" | "weaving" | "routine" | "visual" | "reuse";
  title: string;
  body: string;
  actionLabel?: string;
  to?: string;
}

export interface LabState {
  scenario: string;
  uiState: LabUiState;
  timeOfDay: LabTimeOfDay;
  context: LabContext;
  mode: LabMode;
  path: LabPath;
  routine: LabRoutine;
  participations: LabParticipation[];
  setups: Record<string, LabSetup>;
  cards: LabCard[];
  runs: LabRun[];
  feedback: LabFeedback[];
  weaving: { interests: LabInterest[] };
  acceptedSuggestions: string[];
}

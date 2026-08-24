// بيانات وهمية للنموذج التجريبي فقط.

import type {
  LabCard,
  LabFeedback,
  LabParticipation,
  LabRoutine,
  LabRun,
  LabSetup,
} from "@/lab/state/types";
import { getMatch, getStations, getMatches } from "@/lab/data/knowledge-read";

export const REASON_OPTIONS = [
  "الوقت لم يكن مناسباً",
  "كانت طويلة",
  "لم تكن واضحة",
  "احتاجت دعماً أكثر",
  "لم يرغب فيها اليوم",
  "شيء آخر",
];

export const SUPPORT_TOOLS = [
  { id: "visual_schedule", label: "جدول بصري", hint: "ترتيب أحداث اليوم بالصور" },
  { id: "visual_sequence", label: "تسلسل بصري", hint: "خطوات المشاركة صورة بصورة" },
  { id: "now_next", label: "الآن / بعد ذلك", hint: "لوحة بسيطة بخطوتين" },
  { id: "timer", label: "منظم أو مؤقت بصري", hint: "يوضح مدة المشاركة" },
  { id: "choice_board", label: "لوحة اختيارات", hint: "خيارات يختار منها بنفسه" },
  { id: "tell_before", label: "أخبره مسبقاً", hint: "تهيئة قبل الحدث بوقت كافٍ" },
  { id: "builder", label: "Visual Builder", hint: "بناء وسيلة خاصة بكم" },
] as const;

export const supportToolLabel = (id: string) =>
  SUPPORT_TOOLS.find((t) => t.id === id)?.label ?? id;

/** أمثلة «شيء يحبه أو يفعله بالفعل» وكلمات البحث المرتبطة بها. */
export const WEAVING_EXAMPLES: { text: string; query: string }[] = [
  { text: "يحب اللعب بالماء", query: "ماء" },
  { text: "يلف العجين", query: "عجين" },
  { text: "يرتب الأشياء", query: "ترتيب" },
  { text: "يملأ ويفرغ الأوعية", query: "تعبئة" },
  { text: "يوزع الأكواب بالفعل", query: "توزيع" },
];

export const emptyRoutine: LabRoutine = { cadence: "daily", days: [], events: [] };

function today(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

export function buildSampleRoutine(): LabRoutine {
  const stations = getStations("home").slice(0, 6);
  return {
    cadence: "daily",
    days: [],
    events: stations.map((s, i) => ({
      id: `re-${s.id}`,
      eventId: s.id,
      label: s.title,
      order: i,
      isParticipationStation: i % 2 === 0,
      timeOfDay: s.timeOfDay,
    })),
  };
}

function firstOpportunityId(): string | null {
  for (const s of getStations("home")) {
    const m = getMatches({ eventId: s.id, limit: 1 });
    if (m[0]) return m[0].opportunityId;
  }
  return null;
}

export interface SampleParticipation {
  participation: LabParticipation;
  setup: LabSetup;
  card: LabCard;
  runs: LabRun[];
  feedback: LabFeedback[];
}

export function buildSampleParticipation(options: {
  timesShared: number;
  stable?: boolean;
  lastTone?: LabFeedback["tone"];
}): SampleParticipation | null {
  const oppId = firstOpportunityId();
  const match = oppId ? getMatch(oppId) : null;
  if (!match) return null;

  const participationId = `lp-${match.opportunityId}`;
  const cardId = `lc-${match.opportunityId}-1`;

  const participation: LabParticipation = {
    id: participationId,
    opportunityId: match.opportunityId,
    opportunityName: match.name,
    eventId: match.eventId,
    eventName: match.eventName,
    context: "home",
    level: match.level,
    lifecycle: options.timesShared > 1 ? "repeated" : "active",
    timesShared: options.timesShared,
    lastSharedAt: today(1),
    stableInRoutine: Boolean(options.stable),
  };

  const setup: LabSetup = {
    priorSteps: options.timesShared > 1 ? [0] : [],
    stopPointStepIndex: Math.min(1, Math.max(0, match.steps.length - 1)),
    supports: options.timesShared > 1 ? ["visual_sequence"] : [],
  };

  const card: LabCard = {
    id: cardId,
    participationId,
    version: 1,
    date: today(),
    steps: match.steps,
    stopPointStepIndex: setup.stopPointStepIndex,
    supports: setup.supports,
    approvedAt: today(2),
  };

  const runs: LabRun[] = Array.from({ length: options.timesShared }, (_, i) => ({
    cardId,
    date: today(options.timesShared - i),
    completedSteps: [],
  }));

  const feedback: LabFeedback[] = options.lastTone
    ? [
        {
          cardId,
          date: today(1),
          tone: options.lastTone,
          reasons: options.lastTone === "difficult_today" ? ["كانت طويلة"] : [],
        },
      ]
    : [];

  return { participation, setup, card, runs, feedback };
}

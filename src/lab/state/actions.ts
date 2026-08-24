// بناة كائنات الحالة داخل النموذج التجريبي (بدون أي أثر جانبي).

import type {
  LabCard,
  LabContext,
  LabLevel,
  LabParticipation,
  LabSetup,
} from "@/lab/state/types";
import type { LabMatch } from "@/lab/data/knowledge-read";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function participationIdFor(opportunityId: string) {
  return `lp-${opportunityId}`;
}

export function buildParticipation(
  match: LabMatch,
  context: LabContext,
  level?: LabLevel,
): LabParticipation {
  return {
    id: participationIdFor(match.opportunityId),
    opportunityId: match.opportunityId,
    opportunityName: match.name,
    eventId: match.eventId,
    eventName: match.eventName,
    context,
    level: level ?? match.level,
    lifecycle: "draft",
    timesShared: 0,
    stableInRoutine: false,
  };
}

export function buildCard(
  participation: LabParticipation,
  setup: LabSetup,
  steps: string[],
  version: number,
): LabCard {
  return {
    id: `lc-${participation.opportunityId}-${version}`,
    participationId: participation.id,
    version,
    date: todayISO(),
    steps,
    stopPointStepIndex: setup.stopPointStepIndex,
    supports: setup.supports,
  };
}

/** خطوات البطاقة حتى نقطة التوقف التي اختارتها الأسرة. */
export function stepsUpToStop(steps: string[], stopIndex?: number): string[] {
  if (stopIndex === undefined) return steps;
  return steps.slice(0, Math.min(steps.length, stopIndex + 1));
}

export const lifecycleLabel: Record<string, string> = {
  draft: "قيد الإعداد",
  active: "بدأناها",
  repeated: "نكررها",
  continue: "نستمر كما هي",
  adjust: "نجعلها أسهل",
  expand: "مشاركة أوسع",
  routine: "من مشاركاتنا المعتادة",
  archive: "مؤجلة الآن",
};

export const toneLabel: Record<string, string> = {
  comfortable: "كانت مريحة",
  usual: "كانت كالمعتاد",
  difficult_today: "كانت صعبة اليوم",
};

export const cadenceLabel: Record<string, string> = {
  daily: "كل يوم",
  specific_days: "أيام محددة",
  weekly: "مرة في الأسبوع",
  monthly: "مرة في الشهر",
  occasional: "من وقت لآخر",
};

export const contextLabel: Record<LabContext, string> = {
  home: "داخل البيت",
  community: "خارج البيت",
};

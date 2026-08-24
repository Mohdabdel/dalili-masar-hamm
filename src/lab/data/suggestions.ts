// محاكاة اقتراحات (بدون ذكاء اصطناعي فعلي): اقتراحات اختيارية فقط، والقرار للأسرة.

import type { LabState, LabSuggestion } from "@/lab/state/types";
import { getMatches } from "@/lab/data/knowledge-read";

export function buildSuggestions(state: LabState): LabSuggestion[] {
  const out: LabSuggestion[] = [];

  const stations = state.routine.events.filter((e) => e.isParticipationStation);
  if (state.routine.events.length === 0) {
    out.push({
      id: "sg-routine-empty",
      kind: "routine",
      title: "نبدأ من محطة واحدة",
      body: "يكفي اختيار حدث واحد يتكرر عندكم يومياً، ثم نرى إن كان له مكان مناسب.",
      actionLabel: "نبني روتيننا",
      to: "/lab/routine",
    });
  } else if (stations.length === 0) {
    out.push({
      id: "sg-station",
      kind: "routine",
      title: "اختاروا محطة مشاركة واحدة",
      body: "روتينكم جاهز، ويمكن تعليم حدث واحد فقط كمحطة مشاركة مبدئياً.",
      actionLabel: "فتح روتيننا",
      to: "/lab/routine",
    });
  }

  const lastDifficult = state.feedback.find((f) => f.tone === "difficult_today");
  if (lastDifficult) {
    const card = state.cards.find((c) => c.id === lastDifficult.cardId);
    const participation = state.participations.find((p) => p.id === card?.participationId);
    if (participation) {
      out.push({
        id: `sg-adjust-${participation.id}`,
        kind: "assist",
        title: "يمكن جعلها أخف هذه المرة",
        body: "تقصير نقطة النهاية أو إضافة تسلسل بصري قد يريح الجميع. القرار لكم بالكامل.",
        actionLabel: "فتح مساحة الأسرة",
        to: `/lab/workspace/${participation.id}`,
      });
    }
  }

  for (const participation of state.participations) {
    if (participation.timesShared >= 3 && !participation.stableInRoutine) {
      out.push({
        id: `sg-expand-${participation.id}`,
        kind: "reuse",
        title: `«${participation.opportunityName}» تتكرر معكم`,
        body: "إن رأيتم أنها صارت مألوفة، يمكنكم اعتبارها من مشاركاتكم المعتادة أو توسيعها. هذا اقتراح فقط.",
        actionLabel: "فتح مساحة الأسرة",
        to: `/lab/workspace/${participation.id}`,
      });
    }
  }

  const interest = state.weaving.interests[0];
  if (interest) {
    out.push({
      id: `sg-weaving-${interest.id}`,
      kind: "weaving",
      title: `ابدأوا من: ${interest.text}`,
      body: "هناك مواضع في يومكم قريبة من هذا الاهتمام.",
      actionLabel: "عرض المواضع",
      to: "/lab/weaving",
    });
  }

  const firstStation = stations[0];
  if (firstStation && getMatches({ eventId: firstStation.eventId, limit: 1 }).length > 0) {
    out.push({
      id: `sg-visual-${firstStation.id}`,
      kind: "visual",
      title: "وسيلة بصرية ليوم أوضح",
      body: "جدول بصري بسيط لمحطات يومكم قد يقلل الأسئلة المتكررة.",
      actionLabel: "عرض الوسائل",
      to: "/lab/visual",
    });
  }

  return out.filter((s) => !state.acceptedSuggestions.includes(s.id));
}

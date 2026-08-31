// اختيار الاعتبارات المناسبة لهذه المشاركة داخل مساحة الأسرة.
// المصدر الوحيد للمحتوى هو المرجع المعتمد (participation-considerations)؛
// هنا نرشّح فقط ما يناسب سياق المشاركة الحالي — بلا صياغة جديدة وبلا تقييم لأي شخص.

import {
  CONSIDERATION_GROUPS,
  type Consideration,
} from "@/lib/participation-considerations";
import type { LabParticipationSpec } from "@/lab/slice/types";

export interface ContextualConsideration extends Consideration {
  groupId: string;
  groupTitle: string;
  /** مقترح تلقائياً لسياق هذه المشاركة. */
  suggested: boolean;
}

export interface ConsiderationContext {
  spec: LabParticipationSpec;
  /** عبارات الأسرة كما هي في المسودة الآن. */
  texts: string[];
  stepCount: number;
}

const ALWAYS = ["refusal", "slow-start", "no-wait-time", "unclear-role"];
const COMMUNITY = ["new-places", "noise", "unfamiliar", "long-wait", "social", "accessibility"];
const HOME = ["attention", "tools", "timing"];
const LONG = ["big-step", "duration", "sub-skills", "transitions"];
const ADVANCED = ["ungraded-help", "doing-instead", "not-adaptable"];
const SIMPLE = ["over-help", "no-outcome"];

/** كلمات في نص الخطوات تستدعي اعتباراً بعينه. */
const TEXT_HINTS: { id: string; words: string[] }[] = [
  { id: "env-risk", words: ["سكين", "ساخن", "نار", "زجاج", "فرن", "منظف"] },
  { id: "risk", words: ["سكين", "ساخن", "نار", "زجاج", "شارع", "فرن"] },
  { id: "sensory", words: ["ماء", "صابون", "رائحة", "صوت", "مبلل"] },
  { id: "waiting", words: ["انتظر", "انتظار", "حتى ينتهي", "دقيقة"] },
  { id: "stopping", words: ["أنهِ", "ننهي", "توقف", "الأخيرة"] },
  { id: "few-choices", words: ["اختر", "اختيار", "نختار"] },
];

export function contextualConsiderations(ctx: ConsiderationContext): ContextualConsideration[] {
  const suggested = new Set<string>(ALWAYS);
  for (const id of ctx.spec.context === "community" ? COMMUNITY : HOME) suggested.add(id);
  if (ctx.stepCount > 4) for (const id of LONG) suggested.add(id);
  if (ctx.spec.level === "advanced") for (const id of ADVANCED) suggested.add(id);
  if (ctx.spec.level === "simple") for (const id of SIMPLE) suggested.add(id);

  const haystack = ctx.texts.join(" ");
  for (const hint of TEXT_HINTS) {
    if (hint.words.some((w) => haystack.includes(w))) suggested.add(hint.id);
  }

  const all: ContextualConsideration[] = [];
  for (const group of CONSIDERATION_GROUPS) {
    for (const item of group.items) {
      all.push({
        ...item,
        groupId: group.id,
        groupTitle: group.title,
        suggested: suggested.has(item.id),
      });
    }
  }
  return all;
}

export function considerationById(id: string): ContextualConsideration | null {
  for (const group of CONSIDERATION_GROUPS) {
    const item = group.items.find((i) => i.id === id);
    if (item) return { ...item, groupId: group.id, groupTitle: group.title, suggested: false };
  }
  return null;
}

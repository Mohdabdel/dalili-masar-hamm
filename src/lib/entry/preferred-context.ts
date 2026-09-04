// السياق المفضّل (D01): نقطة انطلاق «البداية السهلة».
// مصدران فقط: عائلي (تكتبه الأسرة) أو مقترح مرجعي (ثابت لا يُعدَّل).
// السياق المفضّل ليس حدثاً وليس مشاركة وظيفية، ولا يُخزَّن كأيٍّ منهما.

export type PreferredContextSource = "family" | "reference";

export interface PreferredContextValue {
  /** معرّف المقترح المرجعي عند الاختيار منه، وإلا معرّف عائلي محلي. */
  id: string;
  source: PreferredContextSource;
  /** نص المقترح المرجعي كما هو — لا تُكتب عليه صياغة الأسرة أبداً. */
  referenceText?: string;
  /** صياغة الأسرة الخاصة — تُخزَّن منفصلة عن نص المرجع. */
  familyText?: string;
}

export interface ReferencePreferredContext {
  readonly id: string;
  readonly text: string;
  /** أمثلة يومية تساعد الأسرة على التعرف على السياق. */
  readonly hint: string;
}

/** مقترحات مرجعية ثابتة (IM-01): مجمّدة ولا تُعدَّل من الواجهة. */
export const REFERENCE_PREFERRED_CONTEXTS: readonly ReferencePreferredContext[] =
  Object.freeze([
    Object.freeze({
      id: "PCTX-POPCORN-EVENING",
      text: "أمسية يجتمع فيها أفراد الأسرة، ويطلب البوب كورن ويستمتع به معهم",
      hint: "شيء يطلبه ويعود إليه مع الأسرة",
    }),
    Object.freeze({
      id: "PCTX-WATER-PLAY",
      text: "لحظات يحب فيها الماء وسكبه وتعبئة الأوعية",
      hint: "شيء يستمتع به ويكرّر الاقتراب منه",
    }),
    Object.freeze({
      id: "PCTX-GOING-OUT",
      text: "خروج قصير مع الأسرة يستمتع به وينتظره",
      hint: "شيء يحبه خارج المنزل",
    }),
    Object.freeze({
      id: "PCTX-MUSIC-GATHER",
      text: "وقت يجتمع فيه أفراد الأسرة حول أغنية أو مقطع يحبه",
      hint: "شيء يبحث عنه ويعود إليه",
    }),
  ]);

export function findReferencePreferredContext(
  id: string,
): ReferencePreferredContext | null {
  return REFERENCE_PREFERRED_CONTEXTS.find((c) => c.id === id) ?? null;
}

/** النص المعروض للأسرة: صياغتها إن وُجدت، وإلا نص المقترح المرجعي كما هو. */
export function preferredContextDisplayText(
  value: PreferredContextValue | null | undefined,
): string {
  if (!value) return "";
  return value.familyText?.trim() || value.referenceText?.trim() || "";
}

// اختيار «آخر مشاركة استخدمتها أو عدّلتها الأسرة» لبطاقة «متابعة المشاركة» في الرئيسية.
// منطق خالص يعمل على البيانات المحفوظة حاليًا دون أي تغيير في قاعدة البيانات.

export interface LatestCandidate {
  specId: string;
  title: string;
  /** "card": لها بطاقة معتمدة مفتوحة؛ "draft": مسودة لم تُعتمد بعد. */
  kind: "card" | "draft";
  /** أحدث نشاط معروف (تعديل مسودة، اعتماد، تشغيل بطاقة) بصيغة ISO. */
  lastActivity: string;
}

/** أحدث تاريخ صالح من القائمة، أو سلسلة فارغة. */
export function latestTimestamp(values: Array<string | null | undefined>): string {
  let best = "";
  let bestMs = -Infinity;
  for (const v of values) {
    if (!v) continue;
    const ms = Date.parse(v);
    if (Number.isNaN(ms)) continue;
    if (ms > bestMs) {
      bestMs = ms;
      best = v;
    }
  }
  return best;
}

/**
 * يعيد المرشح صاحب أحدث نشاط. عند التعادل تُقدَّم البطاقة المعتمدة على المسودة،
 * ثم يُحافظ على ترتيب الإدخال.
 */
export function pickLatestParticipation(candidates: LatestCandidate[]): LatestCandidate | null {
  let best: LatestCandidate | null = null;
  let bestMs = -Infinity;
  for (const c of candidates) {
    const parsed = Date.parse(c.lastActivity);
    const ms = Number.isNaN(parsed) ? -Infinity : parsed;
    if (
      best === null ||
      ms > bestMs ||
      (ms === bestMs && c.kind === "card" && best.kind === "draft")
    ) {
      best = c;
      bestMs = ms;
    }
  }
  return best;
}

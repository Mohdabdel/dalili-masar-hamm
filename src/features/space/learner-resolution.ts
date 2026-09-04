// حسم بطاقة المشارك (Foundation 05).
// الاستخدام الفعلي للمشاركة لا يبدأ إلا بنسخة معتمدة مجمّدة مُختارة صراحةً.
// لا اختيار ضمني لـ«الأحدث» أبداً، ولا بناء محتوى من CSV/المرجع لحظة الاستخدام.

import type { LabCardSnapshot } from "@/lab/slice/types";

export type LearnerBlockReason =
  | "missing-selection"
  | "not-found"
  | "not-approved"
  | "wrong-participation"
  | "empty";

export interface LearnerResolution {
  ok: boolean;
  snapshot: LabCardSnapshot | null;
  reason: LearnerBlockReason | null;
}

export const LEARNER_BLOCK_TEXT: Record<LearnerBlockReason, string> = {
  "missing-selection": "لم تُحدَّد نسخة معتمدة لهذه المشاركة.",
  "not-found": "لا توجد بطاقة معتمدة بهذا الرقم لهذه الأسرة.",
  "not-approved": "هذه البطاقة غير معتمدة بعد.",
  "wrong-participation": "هذه البطاقة تخص مشاركة أسرية أخرى.",
  empty: "هذه النسخة المعتمدة بلا خطوات قابلة للعرض.",
};

/**
 * المصدر الوحيد المسموح: قائمة النسخ المعتمدة المملوكة للأسرة (RLS)،
 * ثم مطابقة صريحة بالمعرّف المطلوب. عند أي فشل: منع، بلا بديل.
 */
export function resolveLearnerLaunch(params: {
  snapshotId: string | null | undefined;
  /** نسخ معتمدة محمّلة ضمن نطاق المستخدم فقط. */
  approvedSnapshots: LabCardSnapshot[];
  /** اختياري: المشاركة الأسرية المتوقعة (مفتاح توافق specId). */
  expectedSpecId?: string | null;
}): LearnerResolution {
  const { snapshotId, approvedSnapshots, expectedSpecId } = params;
  if (!snapshotId) return { ok: false, snapshot: null, reason: "missing-selection" };

  const snapshot = approvedSnapshots.find((s) => s.id === snapshotId) ?? null;
  if (!snapshot) return { ok: false, snapshot: null, reason: "not-found" };

  if (expectedSpecId && snapshot.participationSpecId !== expectedSpecId) {
    return { ok: false, snapshot: null, reason: "wrong-participation" };
  }

  const usable = snapshot.frames.filter((f) => f.sourceStepId !== "__done__");
  if (usable.length === 0) return { ok: false, snapshot: null, reason: "empty" };

  return { ok: true, snapshot, reason: null };
}

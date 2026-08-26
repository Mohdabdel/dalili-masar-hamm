// اعتبارات المشاركة داخل مساحة عمل الأسرة فقط.
// قصيرة، سياقية، غير علاجية وغير تقييمية — ولا تظهر أبداً لبطاقة المشارك.

import type { LabParticipationSpec } from "@/lab/slice/types";

export interface ConsiderationBlock {
  title: string;
  items: string[];
}

export function considerationsFor(
  spec: LabParticipationSpec,
  supportTools: string[],
  stepCount: number,
): ConsiderationBlock[] {
  const before: string[] = ["جهّزوا المكان والأدوات قبل البدء."];
  const during: string[] = ["امنحوه وقتاً للاستجابة قبل أي مساعدة."];

  if (spec.context === "community") {
    before.push("أخبروه بالمكان والوقت قبل الخروج.");
    during.push("قلّلوا الكلام إن كان المكان مزدحماً.");
  } else {
    before.push("قلّلوا المشتتات في المكان قدر الإمكان.");
  }

  if (stepCount > 4) before.push("يمكن تقسيم هذه المشاركة على أكثر من بطاقة.");
  if (spec.level === "advanced") during.push("لا بأس أن تشاركوه جزءاً من الخطوة.");

  if (supportTools.length > 0) {
    before.push("تأكدوا أن وسيلة الدعم المختارة جاهزة في متناول اليد.");
    during.push("استخدموا الدعم المختار عند الحاجة فقط.");
  }

  during.push("احترموا الاختيار أو الرفض، وأنهوا المشاركة بشكل مريح.");

  return [
    { title: "قبل المشاركة", items: before },
    { title: "أثناء المشاركة", items: during },
  ];
}

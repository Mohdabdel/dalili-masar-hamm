// فحص معجم اللغة داخل Lab: يمنع تسرّب مصطلحات التدريب أو التقييم.

export const FORBIDDEN_TERMS = [
  "تدريب",
  "تدريبية",
  "تعليم",
  "علاج",
  "إتقان",
  "اتقان",
  "تقييم",
  "درجة",
  "نجاح",
  "فشل",
  "مستوى الأداء",
  "قدرة",
  "عدم القدرة",
  "اختبار الطفل",
  "تدخل",
];

export function findForbiddenTerms(text: string): string[] {
  return FORBIDDEN_TERMS.filter((t) => text.includes(t));
}

/** ينقّي نصاً قادماً من المستودع قبل عرضه داخل النموذج. */
export function safeText(text: string | undefined | null): string {
  if (!text) return "";
  let out = text;
  const replacements: [string, string][] = [
    ["التدريب", "المشاركة"],
    ["تدريب", "مشاركة"],
    ["التعليم", "المشاركة"],
    ["تقييم", "ملاحظة"],
    ["إتقان", "تكرار"],
    ["اتقان", "تكرار"],
  ];
  for (const [from, to] of replacements) out = out.split(from).join(to);
  return out;
}

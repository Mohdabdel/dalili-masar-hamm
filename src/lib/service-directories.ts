/**
 * DALILI-THREE-SERVICE-HOME-01
 * طبقة بيانات مستقلة لدليلي الخدمات (المجتمعي والتعليمي).
 * مستقلة تمامًا عن ملفات المعرفة 01–04 وعن بطاقات المشاركة.
 * لا تُضاف هنا أي جهة إلا ببيانات فعلية موثقة.
 */

export const EMIRATES = [
  "أبوظبي",
  "دبي",
  "الشارقة",
  "عجمان",
  "أم القيوين",
  "رأس الخيمة",
  "الفجيرة",
] as const;

export type Emirate = (typeof EMIRATES)[number];

export interface ServiceProvider {
  id: string;
  name: string;
  category: string;
  emirate: Emirate | "على مستوى الدولة";
  summary: string;
  phone?: string;
  website?: string;
  accessibilityNotes?: string;
}

export const COMMUNITY_CATEGORIES = [
  "الترفيه والفعاليات",
  "المراكز والمرافق المجتمعية",
  "التسهيلات وإمكانية الوصول",
  "النقل والخدمات المساندة",
  "الجهات والمبادرات المجتمعية",
] as const;

export const EDUCATION_CATEGORIES = [
  "التربية الخاصة",
  "التأهيل",
  "النطق واللغة",
  "العلاج الوظيفي",
  "العلاج الطبيعي",
  "التدريب المهني",
  "الاستشارات والبرامج التعليمية",
] as const;

/** لا توجد بيانات جهات موثقة بعد — يُعرض Empty State مهني. */
export const COMMUNITY_PROVIDERS: ServiceProvider[] = [];

/** لا توجد بيانات جهات موثقة بعد — يُعرض Empty State مهني. */
export const EDUCATION_PROVIDERS: ServiceProvider[] = [];

export function filterProviders(
  providers: ServiceProvider[],
  { query, emirate, category }: { query: string; emirate: string; category: string },
): ServiceProvider[] {
  const q = query.trim();
  return providers.filter((p) => {
    if (emirate !== "all" && p.emirate !== emirate) return false;
    if (category !== "all" && p.category !== category) return false;
    if (!q) return true;
    return `${p.name} ${p.category} ${p.summary}`.includes(q);
  });
}

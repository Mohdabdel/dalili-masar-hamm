// أجزاء اليوم المستخدمة في روتين الأسرة.
// مصدر الأحداث اليومية يبقى ملفات CSV عبر knowledge-base.ts فقط،
// وهذا الملف يضيف طبقة عرض (تجميع حسب جزء اليوم) دون أي نموذج بيانات ثانٍ.

import { findEventById, getAllEvents, type FlatEvent } from "@/lib/knowledge-base";

export type PartOfDay = "morning" | "afternoon" | "evening";

export const PARTS_OF_DAY: PartOfDay[] = ["morning", "afternoon", "evening"];

export const partOfDayLabel: Record<PartOfDay, string> = {
  morning: "الصباح",
  afternoon: "بعد الظهر",
  evening: "المساء",
};

export function isPartOfDay(v: string | null | undefined): v is PartOfDay {
  return v === "morning" || v === "afternoon" || v === "evening";
}

/** أحداث مقترحة لكل جزء من اليوم (معرفات موجودة فعلاً في المستودع). */
const SUGGESTED: Record<PartOfDay, string[]> = {
  morning: ["HEALTH-013", "FOOD-009", "FOOD-062", "CLO-017"],
  afternoon: ["CLO-011", "CLO-016", "FOOD-017", "HOME-052", "SHOP-068"],
  evening: ["FOOD-006", "FOOD-064", "FOOD-042"],
};

export interface DailyEventOption {
  eventId: string;
  title: string;
  domainId: string;
  domainName: string;
  opportunityCount: number;
}

function toOption(ctx: FlatEvent): DailyEventOption {
  return {
    eventId: ctx.event.id,
    title: ctx.event.name,
    domainId: ctx.domain.id,
    domainName: ctx.domain.name,
    opportunityCount: ctx.event.opportunities.length,
  };
}

/** الأحداث المقترحة لجزء اليوم، بعد التحقق من وجودها في المستودع. */
export function getSuggestedEvents(part: PartOfDay): DailyEventOption[] {
  return SUGGESTED[part]
    .map((id) => findEventById(id))
    .filter((x): x is FlatEvent => Boolean(x))
    .map(toOption);
}

/** كل الأحداث المتاحة للاختيار (للبحث عند إضافة حدث آخر). */
export function getAllDailyEventOptions(): DailyEventOption[] {
  return getAllEvents().map(toOption);
}

/** بيانات عرض حدث يومي واحد. */
export function getDailyEventOption(eventId: string): DailyEventOption | null {
  const ctx = findEventById(eventId);
  return ctx ? toOption(ctx) : null;
}

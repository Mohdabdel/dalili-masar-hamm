// طبقة قراءة فقط من مستودع المعرفة الحالي (CSV) لصالح النموذج التجريبي.
// ممنوع أي كتابة، وممنوع استيراد Supabase أو طبقات الحساب الإنتاجية هنا.

import {
  getAllEvents,
  findEventById,
  findOpportunityContextById,
  getHomeDomains,
  getCommunityDomains,
  participationLevelLabel,
  participationLevelDescription,
  type FlatEvent,
  type FlatOpportunity,
} from "@/lib/knowledge-base";
import {
  getSuggestedEvents,
  partOfDayLabel,
  PARTS_OF_DAY,
  type PartOfDay,
} from "@/lib/daily-events";
import type { LabContext, LabLevel, LabPhase } from "@/lab/state/types";

export { participationLevelLabel, participationLevelDescription, partOfDayLabel, PARTS_OF_DAY };
export type { PartOfDay, FlatEvent, FlatOpportunity };

export const phaseLabel: Record<LabPhase, string> = {
  before: "قبل الحدث",
  during: "أثناء الحدث",
  after: "بعد الحدث",
};

export const phaseHint: Record<LabPhase, string> = {
  before: "التجهيز والاستعداد قبل أن يبدأ الحدث",
  during: "لحظة الحدث نفسه ومجرياته",
  after: "ما يأتي بعد انتهاء الحدث",
};

const BEFORE_HINTS = ["تحضير", "إعداد", "تجهيز", "اختيار", "قائمة", "قبل", "جمع", "شراء"];
const AFTER_HINTS = ["ترتيب", "تنظيف", "غسل", "مسح", "إعادة", "تخزين", "بعد", "فرز", "تفريغ"];

/** تصنيف الفرصة إلى قبل/أثناء/بعد اعتماداً على صياغتها في المستودع. */
export function phaseOf(name: string): LabPhase {
  if (BEFORE_HINTS.some((h) => name.includes(h))) return "before";
  if (AFTER_HINTS.some((h) => name.includes(h))) return "after";
  return "during";
}

export interface LabStation {
  id: string;
  title: string;
  domainName: string;
  timeOfDay: PartOfDay;
  opportunityCount: number;
}

function toStation(ctx: FlatEvent, timeOfDay: PartOfDay): LabStation {
  return {
    id: ctx.event.id,
    title: ctx.event.name,
    domainName: ctx.domain.name,
    timeOfDay,
    opportunityCount: ctx.event.opportunities.length,
  };
}

/** محطات اليوم المقترحة (من الأحداث الموجودة فعلاً في المستودع). */
export function getStations(context: LabContext): LabStation[] {
  const allowed = new Set(
    (context === "home" ? getHomeDomains() : getCommunityDomains()).map((d) => d.id),
  );
  const out: LabStation[] = [];
  for (const part of PARTS_OF_DAY) {
    for (const opt of getSuggestedEvents(part)) {
      const ctx = findEventById(opt.eventId);
      if (!ctx || !allowed.has(ctx.domain.id)) continue;
      if (out.some((s) => s.id === ctx.event.id)) continue;
      out.push(toStation(ctx, part));
    }
  }
  if (out.length < 6) {
    for (const ctx of getAllEvents()) {
      if (out.length >= 12) break;
      if (!allowed.has(ctx.domain.id)) continue;
      if (ctx.event.opportunities.length === 0) continue;
      if (out.some((s) => s.id === ctx.event.id)) continue;
      out.push(toStation(ctx, "morning"));
    }
  }
  return out;
}

/** كل الأحداث المتاحة لبناء الروتين. */
export function getRoutineEventOptions(context: LabContext): LabStation[] {
  const allowed = new Set(
    (context === "home" ? getHomeDomains() : getCommunityDomains()).map((d) => d.id),
  );
  return getAllEvents()
    .filter((c) => allowed.has(c.domain.id))
    .slice(0, 60)
    .map((c) => toStation(c, "morning"));
}

export function getStation(eventId: string): LabStation | null {
  const ctx = findEventById(eventId);
  return ctx ? toStation(ctx, "morning") : null;
}

export interface LabEventComponent {
  id: string;
  label: string;
  phase: LabPhase;
  opportunityIds: string[];
}

function componentKey(name: string): { id: string; label: string } {
  const tokens = name.trim().split(/\s+/).slice(0, 2);
  const label = tokens.join(" ") || name;
  return { id: encodeURIComponent(label), label };
}

/** مكوّنات الحدث داخل طور محدد (تجميع لغوي للفرص المتقاربة). */
export function getEventComponents(eventId: string, phase: LabPhase): LabEventComponent[] {
  const ctx = findEventById(eventId);
  if (!ctx) return [];
  const map = new Map<string, LabEventComponent>();
  for (const opp of ctx.event.opportunities) {
    if (phaseOf(opp.name) !== phase) continue;
    const { id, label } = componentKey(opp.name);
    const existing = map.get(id);
    if (existing) existing.opportunityIds.push(opp.id);
    else map.set(id, { id, label, phase, opportunityIds: [opp.id] });
  }
  return [...map.values()];
}

/** توزيع فرص الحدث على الأطوار الثلاثة. */
export function getPhaseCounts(eventId: string): Record<LabPhase, number> {
  const ctx = findEventById(eventId);
  const counts: Record<LabPhase, number> = { before: 0, during: 0, after: 0 };
  if (!ctx) return counts;
  for (const opp of ctx.event.opportunities) counts[phaseOf(opp.name)] += 1;
  return counts;
}

export interface LabMatch {
  opportunityId: string;
  name: string;
  eventId: string;
  eventName: string;
  domainName: string;
  level?: LabLevel;
  steps: string[];
  whyParticipate?: string;
  support?: string;
  setupText?: string;
  supportResources?: string[];
}

function toMatch(ctx: FlatOpportunity): LabMatch {
  const card = ctx.opportunity.card;
  return {
    opportunityId: ctx.opportunity.id,
    name: ctx.opportunity.name,
    eventId: ctx.event.id,
    eventName: ctx.event.name,
    domainName: ctx.domain.name,
    level: ctx.opportunity.participationLevel as LabLevel | undefined,
    steps: card?.steps?.length ? card.steps : ["نبدأ مع الأسرة", "نشارك في الجزء المتفق عليه", "نختم المشاركة"],
    whyParticipate: card?.whyParticipate,
    support: card?.support,
    setupText: card?.setup,
    supportResources: card?.supportResources,
  };
}

/** فرص المشاركة داخل مكوّن حدث محدد، مع ترشيح اختياري بالمستوى. */
export function getMatches(input: {
  eventId?: string;
  componentId?: string;
  phase?: LabPhase;
  level?: LabLevel;
  limit?: number;
}): LabMatch[] {
  const { eventId, componentId, phase, level, limit = 24 } = input;
  const ctx = eventId ? findEventById(eventId) : null;
  const source = ctx ? ctx.event.opportunities : [];
  const out: LabMatch[] = [];
  for (const opp of source) {
    if (phase && phaseOf(opp.name) !== phase) continue;
    if (componentId && componentKey(opp.name).id !== componentId) continue;
    if (level && opp.participationLevel !== level) continue;
    const full = findOpportunityContextById(opp.id);
    if (full) out.push(toMatch(full));
    if (out.length >= limit) break;
  }
  return out;
}

export function getMatch(opportunityId: string): LabMatch | null {
  const ctx = findOpportunityContextById(opportunityId);
  return ctx ? toMatch(ctx) : null;
}

/** بحث حر عن فرص مرتبطة بنص (يستخدمه Participation Weaving). */
export function searchOpportunities(query: string, limit = 12): LabMatch[] {
  const q = query.trim();
  if (!q) return [];
  const out: LabMatch[] = [];
  for (const ctx of getAllEvents()) {
    for (const opp of ctx.event.opportunities) {
      if (!opp.name.includes(q) && !ctx.event.name.includes(q)) continue;
      const full = findOpportunityContextById(opp.id);
      if (full) out.push(toMatch(full));
      if (out.length >= limit) return out;
    }
  }
  return out;
}

// طبقة بيانات مركزية: تقرأ ملفات CSV المعتمدة كمصدر حقيقة وحيد
// وتبني الفهارس حسب المعرفات: domain_id → event_id → opportunity_id → card_id.
// أي تعديل على المحتوى يتم عبر تحديث ملفات CSV فقط.

import domainsCsv from "@/data/knowledge/01_domains.csv?raw";
import eventsCsv from "@/data/knowledge/02_events.csv?raw";
import opportunitiesCsv from "@/data/knowledge/03_participation_opportunities.csv?raw";
import cardsCsv from "@/data/knowledge/04_participation_cards.csv?raw";

import type {
  FullCard,
  HomeDomain,
  GeneralActivity,
  LifeEvent,
  Opportunity,
  ParticipationLevels,
  ParticipationLevelKey,
} from "@/lib/home-hierarchy";

// ---------- مستويات المشاركة ----------
/** يصف المستوى فرصة المشاركة نفسها، لا قدرة الشخص. */
export const PARTICIPATION_LEVEL_KEYS = [
  "simple",
  "moderate",
  "advanced",
] as const;

export const participationLevelLabel: Record<ParticipationLevelKey, string> = {
  simple: "مستوى مشاركة بسيط",
  moderate: "مستوى مشاركة متوسط",
  advanced: "مستوى مشاركة متقدم",
};

export const participationLevelDescription: Record<
  ParticipationLevelKey,
  string
> = {
  simple:
    "دور واحد محدود وواضح، بإجراء أو خطوات قليلة مباشرة، وبداية ونهاية واضحتان.",
  moderate:
    "جزء وظيفي متكامل من الحدث، يتضمن عدة إجراءات مترابطة أو بعض الاختيارات.",
  advanced:
    "دور ممتد أو مسؤولية عن مرحلة كبيرة من الحدث، يتضمن تنظيمًا أو قرارات ومتابعة أو تنسيق عدة عناصر.",
};

export function isParticipationLevel(
  value: string | undefined | null,
): value is ParticipationLevelKey {
  return (
    value === "simple" || value === "moderate" || value === "advanced"
  );
}

function toLevelKey(value: string | undefined): ParticipationLevelKey {
  return isParticipationLevel(value) ? value : "moderate";
}

// ---------- CSV parser (يدعم الحقول المقتبسة والأسطر متعددة الأسطر) ----------
function parseCsv(text: string): Record<string, string>[] {
  // remove BOM
  const src = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cur.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && src[i + 1] === "\n") i++;
        cur.push(field);
        field = "";
        // skip fully empty lines
        if (!(cur.length === 1 && cur[0] === "")) rows.push(cur);
        cur = [];
      } else {
        field += ch;
      }
    }
  }
  if (field !== "" || cur.length > 0) {
    cur.push(field);
    if (!(cur.length === 1 && cur[0] === "")) rows.push(cur);
  }
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = (r[idx] ?? "").trim();
    });
    return obj;
  });
}

// ---------- Row shapes ----------
interface DomainRow {
  domain_id: string;
  domain_name_ar: string;
  category: string;
  display_order: string;
  status: string;
}
interface EventRow {
  event_id: string;
  domain_id: string;
  event_name: string;
  description: string;
  display_order: string;
  status: string;
}
interface OpportunityRow {
  opportunity_id: string;
  event_id: string;
  opportunity_name_ar: string;
  display_order: string;
  status: string;
  participation_level: string;
  role_scope: string;
  organization_demand: string;
  variation_demand: string;
  classification_reason: string;
  review_required: string;
}
interface CardRow {
  card_id: string;
  opportunity_id: string;
  why: string;
  before_start: string;
  participation_steps: string;
  make_it_easier: string;
  participation_levels: string;
  indicators: string;
  whats_next: string;
  support_notes: string;
  status: string;
}

// ---------- Utilities ----------
const num = (s: string) => {
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
};

/**
 * قسّم نصاً حراً إلى جمل قصيرة صالحة كعناصر قائمة
 * دون تعديل النص الأصلي أو إعادة صياغته.
 */
function splitSentences(text: string): string[] {
  if (!text) return [];
  return text
    .split(/(?<=[.!?؟])\s+|\n+/u)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function buildLevels(raw: string): ParticipationLevels {
  const parts = splitSentences(raw);
  return {
    guided: parts[0] ?? "",
    shared: parts[1] ?? "",
    independent: parts[2] ?? parts.slice(2).join(" ") ?? "",
  };
}

function buildCard(
  row: CardRow,
  opportunityName: string,
  eventDescription: string,
): FullCard {
  return {
    title: opportunityName,
    description: eventDescription || undefined,
    whyParticipate: row.why,
    setup: row.before_start,
    steps: splitSentences(row.participation_steps),
    support: row.make_it_easier,
    levels: buildLevels(row.participation_levels),
    progressIndicators: splitSentences(row.indicators),
    supportResources: row.support_notes
      ? row.support_notes
          .split(/[،,\n]+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
    nextStep: row.whats_next,
  };
}

// ---------- Categories ----------
/** تصنيفات المجالات كما تظهر في العمود `category` داخل 01_domains.csv. */
export type DomainCategory = "منزلي" | "مجتمعي" | "منزلي/مجتمعي";

const HOME_CATEGORIES: ReadonlySet<string> = new Set<DomainCategory>([
  "منزلي",
  "منزلي/مجتمعي",
]);
const COMMUNITY_CATEGORIES: ReadonlySet<string> = new Set<DomainCategory>([
  "مجتمعي",
  "منزلي/مجتمعي",
]);

// ---------- Build indexed model ----------
function build(): {
  domains: HomeDomain[];
  categoryByDomainId: Map<string, string>;
  pendingOpportunityIds: string[];
} {
  const domainRows = parseCsv(domainsCsv) as unknown as DomainRow[];
  const eventRows = parseCsv(eventsCsv) as unknown as EventRow[];
  const opportunityRows = parseCsv(
    opportunitiesCsv,
  ) as unknown as OpportunityRow[];
  const cardRows = parseCsv(cardsCsv) as unknown as CardRow[];

  const domainById = new Map<string, DomainRow>();
  domainRows.forEach((d) => d.domain_id && domainById.set(d.domain_id, d));

  const eventsByDomain = new Map<string, EventRow[]>();
  eventRows.forEach((e) => {
    if (!e.event_id || !domainById.has(e.domain_id)) return; // drop orphans
    const arr = eventsByDomain.get(e.domain_id) ?? [];
    arr.push(e);
    eventsByDomain.set(e.domain_id, arr);
  });

  const validEventIds = new Set(
    eventRows
      .filter((e) => domainById.has(e.domain_id))
      .map((e) => e.event_id),
  );

  const opportunitiesByEvent = new Map<string, OpportunityRow[]>();
  opportunityRows.forEach((op) => {
    if (!op.opportunity_id || !validEventIds.has(op.event_id)) return;
    const arr = opportunitiesByEvent.get(op.event_id) ?? [];
    arr.push(op);
    opportunitiesByEvent.set(op.event_id, arr);
  });

  const validOpportunityIds = new Set(
    opportunityRows
      .filter((o) => validEventIds.has(o.event_id))
      .map((o) => o.opportunity_id),
  );

  const cardByOpportunity = new Map<string, CardRow>();
  cardRows.forEach((c) => {
    if (!c.card_id || !validOpportunityIds.has(c.opportunity_id)) return;
    const required = [
      c.why,
      c.before_start,
      c.participation_steps,
      c.make_it_easier,
      c.participation_levels,
      c.indicators,
      c.whats_next,
    ];
    if (required.some((v) => !v || !v.trim())) return; // card_pending
    if (!cardByOpportunity.has(c.opportunity_id)) {
      cardByOpportunity.set(c.opportunity_id, c);
    }
  });

  const pendingOpportunityIds: string[] = [];
  const categoryByDomainId = new Map<string, string>();

  const sortedDomains = [...domainRows].sort(
    (a, b) => num(a.display_order) - num(b.display_order),
  );

  const domains: HomeDomain[] = sortedDomains.map((d) => {
    categoryByDomainId.set(d.domain_id, d.category);

    const events = (eventsByDomain.get(d.domain_id) ?? [])
      .slice()
      .sort((a, b) => num(a.display_order) - num(b.display_order));

    const lifeEvents: LifeEvent[] = events.map((ev) => {
      const opps = (opportunitiesByEvent.get(ev.event_id) ?? [])
        .slice()
        .sort((a, b) => num(a.display_order) - num(b.display_order));

      const opportunities: Opportunity[] = [];
      for (const op of opps) {
        const card = cardByOpportunity.get(op.opportunity_id);
        if (!card) {
          pendingOpportunityIds.push(op.opportunity_id);
          continue;
        }
        const full = buildCard(card, op.opportunity_name_ar, ev.description);
        const level = toLevelKey(op.participation_level);
        opportunities.push({
          id: op.opportunity_id,
          name: op.opportunity_name_ar,
          levels: full.levels,
          card: full,
          participationLevel: level,
          classification: {
            level,
            roleScope: toLevelKey(op.role_scope),
            organizationDemand: toLevelKey(op.organization_demand),
            variationDemand: toLevelKey(op.variation_demand),
            reason: op.classification_reason ?? "",
            reviewRequired: (op.review_required ?? "").toLowerCase() === "true",
          },
        });
      }

      return {
        id: ev.event_id,
        name: ev.event_name,
        opportunities,
      };
    });

    const activity: GeneralActivity = {
      id: `${d.domain_id}-ALL`,
      name: d.domain_name_ar,
      events: lifeEvents.filter((e) => e.opportunities.length > 0),
    };

    return {
      id: d.domain_id,
      name: d.domain_name_ar,
      activities: activity.events.length > 0 ? [activity] : [],
    };
  });

  return { domains, categoryByDomainId, pendingOpportunityIds };
}

const built = build();

/**
 * جميع المجالات المعتمدة من ملفات CSV (منزلية ومجتمعية).
 * يبقى هذا التصدير للحفاظ على توافق المكونات الحالية،
 * والتي كانت تستهلك المجالات المنزلية فقط قبل توسّع المستودع.
 * استخدم `getHomeDomains()` أو `getCommunityDomains()` للتمييز.
 */
export const knowledgeDomains: HomeDomain[] = built.domains.filter((d) =>
  HOME_CATEGORIES.has(built.categoryByDomainId.get(d.id) ?? ""),
);

/** فرص بلا بطاقات مكتملة — لا تُعرض للمستخدم النهائي (تشخيص فقط). */
export const pendingOpportunityIds: string[] = built.pendingOpportunityIds;

/** تصنيف المجال كما ورد في 01_domains.csv. */
export function getDomainCategory(domainId: string): string | undefined {
  return built.categoryByDomainId.get(domainId);
}

/** المجالات التي تظهر في تبويب الأنشطة المنزلية (منزلي + منزلي/مجتمعي). */
export function getHomeDomains(): HomeDomain[] {
  return built.domains.filter((d) =>
    HOME_CATEGORIES.has(built.categoryByDomainId.get(d.id) ?? ""),
  );
}

/** المجالات التي تظهر في تبويب الأنشطة المجتمعية (مجتمعي + منزلي/مجتمعي). */
export function getCommunityDomains(): HomeDomain[] {
  return built.domains.filter((d) =>
    COMMUNITY_CATEGORIES.has(built.categoryByDomainId.get(d.id) ?? ""),
  );
}

/**
 * إرجاع المجالات المطابقة لتصنيف واحد كما هو مكتوب في CSV
 * ("منزلي" | "مجتمعي" | "منزلي/مجتمعي").
 * السجل المشترك "منزلي/مجتمعي" يُعاد كنسخة واحدة دون تكرار.
 */
export function getDomainsByCategory(category: string): HomeDomain[] {
  return built.domains.filter(
    (d) => built.categoryByDomainId.get(d.id) === category,
  );
}

/** بحث موحّد عن فرصة مشاركة داخل مستودع المعرفة. */
export function findOpportunityById(id: string): Opportunity | null {
  for (const domain of built.domains) {
    for (const activity of domain.activities) {
      for (const event of activity.events) {
        for (const opp of event.opportunities) {
          if (opp.id === id) return opp;
        }
      }
    }
  }
  return null;
}

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    `[knowledge-base] domains=${built.domains.length} home=${getHomeDomains().length} community=${getCommunityDomains().length} pending_cards=${pendingOpportunityIds.length}`,
  );
}



// ---------- فلترة حسب مستوى المشاركة ----------
/**
 * ترشيح شجرة المجالات بحيث تبقى فرص المشاركة المطابقة للمستوى فقط،
 * مع الحفاظ على العلاقات domain → event → opportunity → card.
 * تمرير مستوى غير محدد يعيد كل المحتوى (fallback آمن).
 */
export function filterDomainsByLevel(
  domains: HomeDomain[],
  level?: ParticipationLevelKey,
): HomeDomain[] {
  if (!level) return domains;
  return domains
    .map((d) => ({
      ...d,
      activities: d.activities
        .map((a) => ({
          ...a,
          events: a.events
            .map((e) => ({
              ...e,
              opportunities: e.opportunities.filter(
                (o) => o.participationLevel === level,
              ),
            }))
            .filter((e) => e.opportunities.length > 0),
        }))
        .filter((a) => a.events.length > 0),
    }))
    .filter((d) => d.activities.length > 0);
}

export interface FlatOpportunity {
  domain: HomeDomain;
  activity: GeneralActivity;
  event: LifeEvent;
  opportunity: Opportunity;
}

/** كل فرص المشاركة (منزلية ومجتمعية) مسطّحة، مع ترشيح اختياري بالمستوى. */
export function getAllOpportunities(
  level?: ParticipationLevelKey,
): FlatOpportunity[] {
  const out: FlatOpportunity[] = [];
  for (const domain of built.domains) {
    for (const activity of domain.activities) {
      for (const event of activity.events) {
        for (const opportunity of event.opportunities) {
          if (level && opportunity.participationLevel !== level) continue;
          out.push({ domain, activity, event, opportunity });
        }
      }
    }
  }
  return out;
}

/** إحصاء الفرص المنشورة لكل مستوى مشاركة. */
export function countOpportunitiesByLevel(): Record<
  ParticipationLevelKey,
  number
> {
  const counts: Record<ParticipationLevelKey, number> = {
    simple: 0,
    moderate: 0,
    advanced: 0,
  };
  for (const { opportunity } of getAllOpportunities()) {
    const level = opportunity.participationLevel;
    if (level) counts[level] += 1;
  }
  return counts;
}

// ---------- الأحداث اليومية (Daily Events) ----------
export interface FlatEvent {
  domain: HomeDomain;
  activity: GeneralActivity;
  event: LifeEvent;
}

/** كل الأحداث المنشورة في المستودع (مصدر الأحداث اليومية الوحيد). */
export function getAllEvents(): FlatEvent[] {
  const out: FlatEvent[] = [];
  for (const domain of built.domains) {
    for (const activity of domain.activities) {
      for (const event of activity.events) {
        out.push({ domain, activity, event });
      }
    }
  }
  return out;
}

/** بحث عن حدث يومي واحد بمعرّفه كما في 02_events.csv. */
export function findEventById(eventId: string): FlatEvent | null {
  return getAllEvents().find((e) => e.event.id === eventId) ?? null;
}

/** بحث عن فرصة مشاركة مع سياقها الكامل (مجال ← حدث). */
export function findOpportunityContextById(
  opportunityId: string,
): FlatOpportunity | null {
  return (
    getAllOpportunities().find((x) => x.opportunity.id === opportunityId) ?? null
  );
}

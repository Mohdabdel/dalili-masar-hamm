import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Archive,
  DoorClosed,
  Pill,
  Users,
  FileText,
  PawPrint,
  ChevronLeft,
} from "lucide-react";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import type {
  HomeDomain,
  GeneralActivity,
  LifeEvent,
  Opportunity,
} from "@/lib/home-hierarchy";
import { knowledgeDomains } from "@/lib/knowledge-base";

interface TodayEventDef {
  title: string;
  /** معرف الحدث كما هو في 02_events.csv (مستودع المعرفة الحالي). */
  eventId: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface TimeGroup {
  label: string;
  events: TodayEventDef[];
}

/**
 * الربط يتم بمعرفات المستودع الحالية فقط.
 * أي حدث لا يمكن إثبات مطابقته أو لا يملك فرص مشاركة منشورة لا يُعرض إطلاقًا.
 */
const TIME_GROUPS: TimeGroup[] = [
  {
    label: "الصباح",
    events: [
      { title: "لدينا دواء اليوم", eventId: "HEALTH-013", icon: Pill },
      { title: "سنعدّ وجبة سريعة", eventId: "FOOD-009", icon: UtensilsCrossed },
      { title: "سنتفقد إغلاق الغاز أو الكهرباء", eventId: "FOOD-062", icon: DoorClosed },
    ],
  },
  {
    label: "منتصف اليوم",
    events: [
      { title: "سنفرز الملابس قبل الغسيل", eventId: "CLO-011", icon: Shirt },
      { title: "سنطوي الملابس النظيفة", eventId: "CLO-016", icon: Shirt },
      { title: "سننظف منطقة إعداد الطعام", eventId: "FOOD-017", icon: Sparkles },
      { title: "سنرتب خزانة المؤن", eventId: "HOME-052", icon: Archive },
      { title: "سنراجع الفاتورة والإيصالات", eventId: "SHOP-068", icon: FileText },
    ],
  },
  {
    label: "المساء",
    events: [
      { title: "سنعلّق الملابس في الخزانة", eventId: "CLO-017", icon: Shirt },
      { title: "سنستقبل ضيوفاً", eventId: "FOOD-006", icon: Users },
      { title: "سنجفف الأطباق ونعيدها للرفوف", eventId: "FOOD-064", icon: UtensilsCrossed },
      { title: "سنعتني بالحيوان الأليف", eventId: "FOOD-042", icon: PawPrint },
    ],
  },
];

interface EventMatch {
  domain: HomeDomain;
  activity: GeneralActivity;
  event: LifeEvent;
}

function findEvent(eventId: string): EventMatch | null {
  for (const domain of knowledgeDomains) {
    for (const activity of domain.activities) {
      for (const event of activity.events) {
        if (event.id === eventId) return { domain, activity, event };
      }
    }
  }
  return null;
}

interface ActiveCtx extends EventMatch {
  opportunity: Opportunity;
}

function formatOpportunityCount(count: number): string {
  if (count === 1) return "فرصة مشاركة متدرجة واحدة";
  return `${count} فرصة مشاركة متدرجة`;
}

export function TodayEvents() {
  const [openEvent, setOpenEvent] = useState<EventMatch | null>(null);
  const [active, setActive] = useState<ActiveCtx | null>(null);

  const groups = useMemo(
    () =>
      TIME_GROUPS.map((g) => ({
        label: g.label,
        items: g.events
          .map((def) => {
            const match = findEvent(def.eventId);
            const count = match?.event.opportunities.length ?? 0;
            return { def, match, count };
          })
          // استبعاد أي سجل غير قابل للمطابقة بدل كسر الرحلة
          .filter(
            (x): x is { def: TodayEventDef; match: EventMatch; count: number } =>
              !!x.match && x.count > 0,
          ),
      })).filter((g) => g.items.length > 0),
    [],
  );

  const toData = (ctx: ActiveCtx): ParticipationCardData => {
    const c = ctx.opportunity.card;
    const levels =
      c?.levels ??
      ctx.opportunity.levels ?? { guided: "", shared: "", independent: "" };
    return {
      id: ctx.opportunity.id,
      title: c?.title ?? ctx.opportunity.name,
      description: c?.description,
      domain: ctx.domain.name,
      generalActivity: ctx.activity.name,
      lifeEvent: ctx.event.name,
      opportunity: ctx.opportunity.name,
      whyParticipate: c?.whyParticipate,
      setup: c?.setup,
      steps: c?.steps,
      support: c?.support,
      levels,
      progressIndicators: c?.progressIndicators,
      teachingAids: c?.teachingAids,
      nextStep: c?.nextStep,
    };
  };

  const goNext = () => {
    if (!active) return;
    const opps = active.event.opportunities;
    const idx = opps.findIndex((o) => o.id === active.opportunity.id);
    const next = opps[idx + 1];
    if (next) setActive({ ...active, opportunity: next });
  };

  const hasNext = active
    ? active.event.opportunities.findIndex(
        (o) => o.id === active.opportunity.id,
      ) <
      active.event.opportunities.length - 1
    : false;

  return (
    <>
      <p className="mb-4 text-right text-sm leading-relaxed text-muted-foreground">
        ابدأ بما يحدث فعلاً داخل المنزل اليوم، ثم اختر فرصة مشاركة مناسبة للشاب أو البالغ.
      </p>

      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-2.5 text-right text-sm font-bold text-foreground">
              {group.label}
            </h3>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {group.items.map(({ def, match, count }) => {
                const Icon = def.icon;
                return (
                  <li key={def.eventId}>
                    <button
                      type="button"
                      onClick={() => setOpenEvent(match)}
                      className="group flex w-full items-center gap-3 rounded-2xl border-2 border-border/60 bg-card p-4 text-right shadow-card-soft transition-all hover:border-gold/60 hover:bg-gold/5"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-foreground">
                          {def.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-muted-foreground">
                          {formatOpportunityCount(count)}
                        </span>
                      </span>
                      <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <Sheet
        open={!!openEvent}
        onOpenChange={(o) => !o && setOpenEvent(null)}
      >
        <SheetContent
          side="bottom"
          className="max-h-[85vh] overflow-y-auto rounded-t-3xl border-t-0 bg-background p-0"
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />
          <SheetHeader className="px-5 pt-4 pb-2 text-right">
            <SheetTitle className="text-right text-lg font-bold">
              {openEvent?.event.name}
            </SheetTitle>
            <p className="text-xs text-muted-foreground">
              اختر فرصة مشاركة لبدء التنفيذ خطوة بخطوة.
            </p>
          </SheetHeader>
          <ul className="space-y-2 px-5 pb-6">
            {openEvent?.event.opportunities.map((op) => (
              <li key={op.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (!openEvent) return;
                    setActive({ ...openEvent, opportunity: op });
                    setOpenEvent(null);
                  }}
                  className="group flex w-full items-center justify-between gap-2 rounded-xl border border-border/60 bg-card p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
                >
                  <span className="min-w-0 flex-1 text-sm font-semibold text-foreground">
                    {op.name}
                  </span>
                  <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                </button>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>

      <ParticipationCard
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        data={active ? toData(active) : null}
        onNext={hasNext ? goNext : undefined}
      />
    </>
  );
}

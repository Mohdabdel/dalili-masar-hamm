import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import {
  homeHierarchy,
  type HomeDomain,
  type Opportunity,
  type GeneralActivity,
  type LifeEvent,
} from "@/lib/home-hierarchy";

interface HierarchyViewProps {
  domains?: HomeDomain[];
  /** Deep-link: auto-open this opportunity id on mount. */
  openOpportunityId?: string;
}

interface ActiveContext {
  domain: HomeDomain;
  activity: GeneralActivity;
  event: LifeEvent;
  opportunity: Opportunity;
}

export function HomeHierarchy({ domains = homeHierarchy, openOpportunityId }: HierarchyViewProps) {
  const [active, setActive] = useState<ActiveContext | null>(null);

  useEffect(() => {
    if (!openOpportunityId) return;
    for (const domain of domains) {
      for (const activity of domain.activities) {
        for (const event of activity.events) {
          for (const opportunity of event.opportunities) {
            if (opportunity.id === openOpportunityId) {
              setActive({ domain, activity, event, opportunity });
              return;
            }
          }
        }
      }
    }
  }, [openOpportunityId, domains]);


  const toData = (ctx: ActiveContext): ParticipationCardData => {
    const c = ctx.opportunity.card;
    const levels = c?.levels ??
      ctx.opportunity.levels ?? {
        guided: "",
        shared: "",
        independent: "",
      };
    return {
      id: ctx.opportunity.id,
      title: c?.title ?? ctx.opportunity.name,
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
    ? active.event.opportunities.findIndex((o) => o.id === active.opportunity.id) <
      active.event.opportunities.length - 1
    : false;

  return (
    <>
      <Accordion type="multiple" className="space-y-3">
        {domains.map((domain) => (
          <AccordionItem
            key={domain.id}
            value={domain.id}
            className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
          >
            <AccordionTrigger className="px-4 py-3 text-right text-sm font-bold hover:no-underline">
              <span className="flex items-center gap-2">
                <span className="rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                  {domain.id}
                </span>
                {domain.name}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              {domain.activities.length === 0 ? (
                <EmptyNote text="سيتم إضافة الأنشطة قريباً." />
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {domain.activities.map((act) => (
                    <AccordionItem
                      key={act.id}
                      value={act.id}
                      className="overflow-hidden rounded-xl border border-border/50 bg-background"
                    >
                      <AccordionTrigger className="px-3 py-2.5 text-right text-sm font-semibold hover:no-underline">
                        {act.name}
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        {act.events.length === 0 ? (
                          <EmptyNote text="سيتم إضافة أحداث الحياة قريباً." />
                        ) : (
                          <Accordion type="multiple" className="space-y-2">
                            {act.events.map((ev) => (
                              <AccordionItem
                                key={ev.id}
                                value={ev.id}
                                className="overflow-hidden rounded-lg border border-border/40 bg-card"
                              >
                                <AccordionTrigger className="px-3 py-2 text-right text-[13px] font-medium hover:no-underline">
                                  {ev.name}
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                  {ev.opportunities.length === 0 ? (
                                    <EmptyNote text="سيتم إضافة فرص المشاركة قريباً." />
                                  ) : (
                                    <ul className="space-y-2">
                                      {ev.opportunities.map((op) => (
                                        <li key={op.id}>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              setActive({
                                                domain,
                                                activity: act,
                                                event: ev,
                                                opportunity: op,
                                              })
                                            }
                                            className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
                                          >
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-semibold text-muted-foreground">
                                                  {op.id}
                                                </span>
                                                <span className="truncate text-sm font-semibold text-foreground">
                                                  {op.name}
                                                </span>
                                                {op.card && (
                                                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                                    بطاقة كاملة
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                            <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <ParticipationCard
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        data={active ? toData(active) : null}
        onNext={hasNext ? goNext : undefined}
      />
    </>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

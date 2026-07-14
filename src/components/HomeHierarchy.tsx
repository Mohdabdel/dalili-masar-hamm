import { useEffect, useMemo, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, Shirt, Archive, Briefcase, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import {
  type HomeDomain,
  type Opportunity,
  type GeneralActivity,
  type LifeEvent,
} from "@/lib/home-hierarchy";
import { knowledgeDomains } from "@/lib/knowledge-base";

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

const CLOTHES_DOMAIN_ID = "H-CLOTHES";

const featuredClothesEvents: {
  title: string;
  eventId: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { title: "اليوم يوم غسل الملابس", eventId: "EV-WASH", icon: Shirt },
  { title: "نحتاج ترتيب الدولاب", eventId: "EV-ARRANGE", icon: Archive },
  { title: "نجهز ملابس الخروج أو العمل", eventId: "EV-WORK", icon: Briefcase },
  { title: "نراجع الملابس التي تحتاج استبدالاً", eventId: "EV-DISPOSE", icon: RefreshCw },
];

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
              <span className="text-foreground">{domain.name}</span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <DomainBody
                domain={domain}
                onOpen={(ctx) => setActive(ctx)}
              />
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

function DomainBody({
  domain,
  onOpen,
}: {
  domain: HomeDomain;
  onOpen: (ctx: ActiveContext) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const allEvents: { activity: GeneralActivity; event: LifeEvent }[] = useMemo(
    () =>
      domain.activities.flatMap((a) =>
        a.events.map((e) => ({ activity: a, event: e })),
      ),
    [domain],
  );

  if (domain.activities.length === 0 || allEvents.length === 0) {
    return <EmptyNote text="سيتم إضافة أحداث هذا المجال قريباً." />;
  }

  // Special featured layout for clothes domain
  if (domain.id === CLOTHES_DOMAIN_ID) {
    return (
      <div className="space-y-3">
        <div>
          <h4 className="mb-2 px-1 text-xs font-bold text-muted-foreground">
            أكثر أحداث الملابس استخداماً
          </h4>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {featuredClothesEvents.map((fe) => {
              const match = allEvents.find((x) => x.event.id === fe.eventId);
              if (!match) return null;
              const Icon = fe.icon;
              const disabled = match.event.opportunities.length === 0;
              return (
                <li key={fe.eventId}>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      const first = match.event.opportunities[0];
                      if (!first) return;
                      onOpen({
                        domain,
                        activity: match.activity,
                        event: match.event,
                        opportunity: first,
                      });
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl border-2 border-border/60 bg-background p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5 disabled:opacity-50"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-foreground">
                      {fe.title}
                    </span>
                    <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {!showAll ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAll(true)}
          >
            عرض جميع أحداث الملابس
          </Button>
        ) : (
          <EventsList
            domain={domain}
            allEvents={allEvents}
            onOpen={onOpen}
          />
        )}
      </div>
    );
  }

  return <EventsList domain={domain} allEvents={allEvents} onOpen={onOpen} />;
}

function EventsList({
  domain,
  allEvents,
  onOpen,
}: {
  domain: HomeDomain;
  allEvents: { activity: GeneralActivity; event: LifeEvent }[];
  onOpen: (ctx: ActiveContext) => void;
}) {
  return (
    <Accordion type="multiple" className="space-y-2">
      {allEvents.map(({ activity, event }) => (
        <AccordionItem
          key={event.id}
          value={event.id}
          className="overflow-hidden rounded-xl border border-border/50 bg-background"
        >
          <AccordionTrigger className="px-3 py-2.5 text-right text-[13px] font-semibold hover:no-underline">
            {event.name}
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            {event.opportunities.length === 0 ? (
              <EmptyNote text="سيتم إضافة فرص المشاركة قريباً." />
            ) : (
              <ul className="space-y-2">
                {event.opportunities.map((op) => (
                  <li key={op.id}>
                    <button
                      type="button"
                      onClick={() =>
                        onOpen({ domain, activity, event, opportunity: op })
                      }
                      className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                        {op.name}
                      </span>
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
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

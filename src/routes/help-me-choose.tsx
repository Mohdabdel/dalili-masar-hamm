import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import {
  PARTICIPATION_LEVEL_KEYS,
  participationLevelDescription,
  participationLevelLabel,
  getAllOpportunities,
  type FlatOpportunity,
} from "@/lib/knowledge-base";
import type { ParticipationLevelKey } from "@/lib/home-hierarchy";
import {
  PARTS_OF_DAY,
  partOfDayLabel,
  getSuggestedEvents,
  type PartOfDay,
} from "@/lib/daily-events";

export const Route = createFileRoute("/help-me-choose")({
  head: () => ({
    meta: [
      { title: "ساعدني في الاختيار | دليلي للمشاركة الحياتية" },
      {
        name: "description",
        content:
          "ثلاث خطوات قصيرة: وقت اليوم، ثم الحدث اليومي، ثم مستوى المشاركة — لنقترح عليكم فرص مشاركة مناسبة الآن.",
      },
      {
        property: "og:title",
        content: "ساعدني في الاختيار | دليلي للمشاركة الحياتية",
      },
      {
        property: "og:description",
        content: "مسار موجّه يقترح فرصة مشاركة مناسبة لأسرتكم في دقائق.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HelpMeChoosePage,
});

function toData(ctx: FlatOpportunity): ParticipationCardData {
  const c = ctx.opportunity.card;
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
    levels:
      c?.levels ??
      ctx.opportunity.levels ?? { guided: "", shared: "", independent: "" },
    progressIndicators: c?.progressIndicators,
    supportResources: c?.supportResources,
    nextStep: c?.nextStep,
    participationLevel: ctx.opportunity.participationLevel,
  };
}

function Choice({
  title,
  subtitle,
  onClick,
}: {
  title: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 text-start shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-base font-bold text-foreground">{title}</span>
        {subtitle && (
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {subtitle}
          </span>
        )}
      </span>
      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
    </button>
  );
}

function HelpMeChoosePage() {
  const [part, setPart] = useState<PartOfDay | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);
  const [level, setLevel] = useState<ParticipationLevelKey | null>(null);
  const [card, setCard] = useState<ParticipationCardData | null>(null);

  const events = useMemo(
    () => (part ? getSuggestedEvents(part) : []),
    [part],
  );

  const results = useMemo(() => {
    if (!eventId || !level) return [];
    return getAllOpportunities(level).filter((o) => o.event.id === eventId);
  }, [eventId, level]);

  const step = !part ? 1 : !eventId ? 2 : !level ? 3 : 4;

  return (
    <PageShell
      title="ساعدني في الاختيار"
      subtitle="ثلاث خطوات قصيرة لنقترح عليكم فرصة مشاركة مناسبة الآن"
      breadcrumbs={[
        { label: "دليلي للمشاركة الحياتية", to: "/activities" },
        { label: "ساعدني في الاختيار" },
      ]}
    >
      <div dir="rtl" className="space-y-4 text-start">
        <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-secondary p-4">
          <Sparkles className="h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm font-semibold text-foreground/90">
            الخطوة {step} من 4
          </p>
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                if (level) setLevel(null);
                else if (eventId) setEventId(null);
                else setPart(null);
              }}
              className="ms-auto text-xs font-bold text-gold underline-offset-4 hover:underline"
            >
              رجوع خطوة
            </button>
          )}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="px-1 text-base font-bold text-foreground">
              في أي وقت من اليوم تريدون المشاركة؟
            </h2>
            {PARTS_OF_DAY.map((p) => (
              <Choice
                key={p}
                title={partOfDayLabel[p]}
                onClick={() => setPart(p)}
              />
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="px-1 text-base font-bold text-foreground">
              ما الذي يحدث عادة في هذا الوقت؟
            </h2>
            {events.map((e) => (
              <Choice
                key={e.eventId}
                title={e.title}
                subtitle={`${e.domainName} · ${e.opportunityCount} فرصة مشاركة`}
                onClick={() => setEventId(e.eventId)}
              />
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="px-1 text-base font-bold text-foreground">
              ما مستوى فرصة المشاركة المناسب الآن؟
            </h2>
            {PARTICIPATION_LEVEL_KEYS.map((k) => (
              <Choice
                key={k}
                title={participationLevelLabel[k]}
                subtitle={participationLevelDescription[k]}
                onClick={() => setLevel(k)}
              />
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="px-1 text-base font-bold text-foreground">
              فرص مشاركة مقترحة لكم
            </h2>
            {results.length === 0 ? (
              <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  لا توجد فرص بهذا المستوى داخل هذا الحدث. جرّبوا مستوى آخر.
                </p>
                <button
                  type="button"
                  onClick={() => setLevel(null)}
                  className="text-sm font-bold text-gold underline-offset-4 hover:underline"
                >
                  تغيير المستوى
                </button>
              </div>
            ) : (
              results.map((ctx) => (
                <Choice
                  key={ctx.opportunity.id}
                  title={ctx.opportunity.name}
                  subtitle={`${ctx.domain.name} · ${ctx.event.name}`}
                  onClick={() => setCard(toData(ctx))}
                />
              ))
            )}

            <Link
              to="/activities/level"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card p-4 text-sm font-bold text-foreground transition-colors hover:border-gold"
            >
              استعراض كل فرص المشاركة
            </Link>
          </div>
        )}
      </div>

      <ParticipationCard
        open={Boolean(card)}
        onOpenChange={(o) => !o && setCard(null)}
        data={card}
      />
    </PageShell>
  );
}

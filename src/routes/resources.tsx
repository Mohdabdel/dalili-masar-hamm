import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ServiceCard, type ServiceCardData } from "@/components/ServiceCard";
import {
  supportPortal,
  type ServiceDomainNode,
  type ServiceItem,
  type ServiceOpportunity,
} from "@/lib/support-portal";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "بوابة الدعم والخدمات | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "بوابة تساعد الأسرة على معرفة الخدمة المناسبة ومتى تستخدمها وماذا تجهز.",
      },
    ],
  }),
  component: SupportPortalPage,
});

interface ActiveCtx {
  domain: ServiceDomainNode;
  service: ServiceItem;
  opportunity: ServiceOpportunity;
}

function SupportPortalPage() {
  const [active, setActive] = useState<ActiveCtx | null>(null);

  const toData = (ctx: ActiveCtx): ServiceCardData => {
    const c = ctx.opportunity.card;
    return {
      id: ctx.opportunity.id,
      title: c?.title ?? ctx.opportunity.name,
      domain: ctx.domain.name,
      service: ctx.service.name,
      opportunity: ctx.opportunity.name,
      whyNeed: c?.whyNeed,
      whenToUse: c?.whenToUse,
      whatToPrepare: c?.whatToPrepare,
      generalSteps: c?.generalSteps,
      whatNext: c?.whatNext,
      relatedServices: c?.relatedServices,
      externalLink: c?.externalLink,
    };
  };

  const goNext = () => {
    if (!active) return;
    const opps = active.service.opportunities;
    const idx = opps.findIndex((o) => o.id === active.opportunity.id);
    const next = opps[idx + 1];
    if (next) setActive({ ...active, opportunity: next });
  };

  const hasNext = active
    ? active.service.opportunities.findIndex((o) => o.id === active.opportunity.id) <
      active.service.opportunities.length - 1
    : false;

  return (
    <PageShell
      title="بوابة الدعم والخدمات"
      subtitle="مجال ← خدمة ← فرصة استفادة ← بطاقة"
    >
      <Accordion type="multiple" className="space-y-3">
        {supportPortal.map((domain) => (
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
              {domain.services.length === 0 ? (
                <EmptyNote text="سيتم إضافة الخدمات قريباً." />
              ) : (
                <Accordion type="multiple" className="space-y-2">
                  {domain.services.map((svc) => (
                    <AccordionItem
                      key={svc.id}
                      value={svc.id}
                      className="overflow-hidden rounded-xl border border-border/50 bg-background"
                    >
                      <AccordionTrigger className="px-3 py-2.5 text-right text-sm font-semibold hover:no-underline">
                        <span className="flex-1 text-right">
                          <span className="block">{svc.name}</span>
                          {svc.brief && (
                            <span className="mt-1 block text-[11px] font-normal text-muted-foreground">
                              {svc.brief}
                            </span>
                          )}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-3 pb-3">
                        {svc.opportunities.length === 0 ? (
                          <EmptyNote text="سيتم إضافة فرص الاستفادة قريباً." />
                        ) : (
                          <ul className="space-y-2">
                            {svc.opportunities.map((op) => (
                              <li key={op.id}>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActive({ domain, service: svc, opportunity: op })
                                  }
                                  className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-card p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
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

      <ServiceCard
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        data={active ? toData(active) : null}
        onNext={hasNext ? goNext : undefined}
      />
    </PageShell>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

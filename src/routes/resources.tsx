import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { DetailSheet } from "@/components/DetailSheet";
import { supportPortal, type ServiceOpportunity } from "@/lib/support-portal";

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

function SupportPortalPage() {
  const [active, setActive] = useState<ServiceOpportunity | null>(null);

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
                                  onClick={() => setActive(op)}
                                  className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-card p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
                                >
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-semibold text-muted-foreground">
                                        {op.id}
                                      </span>
                                      <span className="text-sm font-semibold text-foreground">
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

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.id}
        title={active?.card?.title ?? active?.name ?? ""}
        headline={active?.card?.whyNeed}
        headlineLabel="لماذا قد تحتاج هذه الخدمة"
        checklist={active?.card?.generalSteps.map((s, i) => ({
          key: `${active.id}-${i}`,
          label: s,
        }))}
        checklistTitle="خطوات عامة"
        sections={buildSections(active)}
      />
    </PageShell>
  );
}

function buildSections(op: ServiceOpportunity | null) {
  if (!op?.card) return [];
  const c = op.card;
  const sections: { id: string; title: string; content: React.ReactNode }[] = [];

  if (c.whenToUse) {
    sections.push({
      id: "when",
      title: "متى تستخدمها",
      content: <p className="leading-relaxed">{c.whenToUse}</p>,
    });
  }
  if (c.whatToPrepare?.length) {
    sections.push({
      id: "prepare",
      title: "ماذا تجهز",
      content: (
        <ul className="list-inside list-disc space-y-1 leading-relaxed">
          {c.whatToPrepare.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ),
    });
  }
  if (c.whatNext?.length) {
    sections.push({
      id: "next",
      title: "ماذا بعد",
      content: (
        <ul className="list-inside list-disc space-y-1 leading-relaxed">
          {c.whatNext.map((it) => (
            <li key={it}>{it}</li>
          ))}
        </ul>
      ),
    });
  }
  if (c.relatedServices?.length) {
    sections.push({
      id: "related",
      title: "خدمات مرتبطة",
      content: (
        <div className="flex flex-wrap gap-2">
          {c.relatedServices.map((s) => (
            <span
              key={s}
              className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary"
            >
              {s}
            </span>
          ))}
        </div>
      ),
    });
  }
  sections.push({
    id: "link",
    title: "الرابط الرسمي",
    content: c.externalLink ? (
      <a
        href={c.externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
      >
        <ExternalLink className="h-4 w-4" />
        فتح الرابط
      </a>
    ) : (
      <p className="text-xs text-muted-foreground">
        سيتم إضافة الرابط الرسمي لاحقاً.
      </p>
    ),
  });
  return sections;
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

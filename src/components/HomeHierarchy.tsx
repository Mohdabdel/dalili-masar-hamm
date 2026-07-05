import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { DetailSheet } from "@/components/DetailSheet";
import { homeHierarchy, type Opportunity, type HomeDomain } from "@/lib/home-hierarchy";

interface HierarchyViewProps {
  domains?: HomeDomain[];
}

export function HomeHierarchy({ domains = homeHierarchy }: HierarchyViewProps) {
  const [active, setActive] = useState<Opportunity | null>(null);


  const renderLevels = (o: Opportunity) => {
    const levels = o.card?.levels ?? o.levels;
    if (!levels) return null;
    return (
      <div className="grid gap-2 text-xs">
        <LevelRow label="موجهة" text={levels.guided} tone="soft" />
        <LevelRow label="مشتركة" text={levels.shared} tone="mid" />
        <LevelRow label="مستقلة" text={levels.independent} tone="strong" />
      </div>
    );
  };

  return (
    <>
      <Accordion type="multiple" className="space-y-3">
        {homeHierarchy.map((domain) => (
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
                                            onClick={() => setActive(op)}
                                            className="group flex w-full items-center justify-between gap-2 rounded-lg border border-border/50 bg-background p-3 text-right transition-all hover:border-gold/60 hover:bg-gold/5"
                                          >
                                            <div className="flex-1 space-y-2">
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
                                              {renderLevels(op)}
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

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.id}
        title={active?.card?.title ?? active?.name ?? ""}
        headline={active?.card?.whyParticipate}
        headlineLabel="لماذا نشارك"
        checklist={active?.card?.steps.map((s, i) => ({
          key: `${active.id}-${i}`,
          label: s,
        }))}
        checklistTitle="الخطوات"
        sections={buildSections(active)}
      />
    </>
  );
}

function buildSections(op: Opportunity | null) {
  if (!op) return [];
  const levels = op.card?.levels ?? op.levels;
  const sections: { id: string; title: string; content: React.ReactNode }[] = [];

  if (op.card?.setup) {
    sections.push({
      id: "setup",
      title: "التهيئة",
      content: <p className="leading-relaxed">{op.card.setup}</p>,
    });
  }
  if (op.card?.support) {
    sections.push({
      id: "support",
      title: "الدعم",
      content: <p className="leading-relaxed">{op.card.support}</p>,
    });
  }
  if (levels) {
    sections.push({
      id: "levels",
      title: "مستويات المشاركة",
      content: (
        <div className="space-y-2">
          <LevelRow label="موجهة" text={levels.guided} tone="soft" />
          <LevelRow label="مشتركة" text={levels.shared} tone="mid" />
          <LevelRow label="مستقلة" text={levels.independent} tone="strong" />
        </div>
      ),
    });
  }
  if (op.card?.progressIndicators?.length) {
    sections.push({
      id: "progress",
      title: "مؤشرات التقدم",
      content: (
        <div className="flex flex-wrap gap-2">
          {op.card.progressIndicators.map((p) => (
            <span
              key={p}
              className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary"
            >
              {p}
            </span>
          ))}
        </div>
      ),
    });
  }
  if (op.card?.nextStep) {
    sections.push({
      id: "next",
      title: "ماذا بعد",
      content: <p className="leading-relaxed">{op.card.nextStep}</p>,
    });
  }
  return sections;
}

function LevelRow({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "soft" | "mid" | "strong";
}) {
  const toneClasses =
    tone === "soft"
      ? "border-border/60 bg-background"
      : tone === "mid"
        ? "border-gold/40 bg-gold/5"
        : "border-primary/40 bg-primary/5";
  return (
    <div className={`rounded-lg border p-2.5 ${toneClasses}`}>
      <div className="mb-1 text-[10px] font-bold text-primary">{label}</div>
      <div className="text-[12px] leading-relaxed text-foreground">{text}</div>
    </div>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/50 bg-muted/30 p-3 text-center text-xs text-muted-foreground">
      {text}
    </p>
  );
}

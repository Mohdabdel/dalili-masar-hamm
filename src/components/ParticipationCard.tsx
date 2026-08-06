import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import { SupportResourcesPrototype } from "@/components/SupportResourcesPrototype";
import { VisualAidPrototype } from "@/components/VisualAidPrototype";

export interface ParticipationLevelsInput {
  guided: string;
  shared: string;
  independent: string;
}

export interface ParticipationCardData {
  id: string;
  title: string;
  description?: string;
  domain: string;
  generalActivity: string;
  lifeEvent: string;
  opportunity: string;
  whyParticipate?: string;
  setup?: string;
  steps?: string[];
  support?: string;
  levels: ParticipationLevelsInput;
  progressIndicators?: string[];
  teachingAids?: string[];
  nextStep?: string;
}


interface ParticipationCardProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: ParticipationCardData | null;
  onNext?: () => void;
}

export function ParticipationCard({ open, onOpenChange, data, onNext }: ParticipationCardProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) {
      setChecked({});
      return;
    }
    if (data) {
      try {
        const list = JSON.parse(localStorage.getItem("saved-participation") ?? "[]");
        setSaved(Array.isArray(list) && list.includes(data.id));
      } catch {
        setSaved(false);
      }
    }
  }, [open, data]);

  if (!data) return null;

  const total = data.steps?.length ?? 0;
  const done = Object.values(checked).filter(Boolean).length;

  const handleSave = () => {
    try {
      const list = JSON.parse(localStorage.getItem("saved-participation") ?? "[]");
      const set = new Set<string>(Array.isArray(list) ? list : []);
      if (set.has(data.id)) {
        set.delete(data.id);
        setSaved(false);
        toast("أزيلت من المحفوظات");
      } else {
        set.add(data.id);
        setSaved(true);
        toast("تم الحفظ");
      }
      localStorage.setItem("saved-participation", JSON.stringify([...set]));
    } catch {
      /* ignore */
    }
  };

  const handleShare = async () => {
    const text = `${data.title} — ${data.opportunity}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.title, text });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        toast("نُسخ الرابط");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-t-0 bg-background p-0"
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />

        <SheetHeader className="px-5 pt-4 pb-2 text-right">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-[10px]">{data.domain}</Badge>
            <Badge variant="outline" className="text-[10px]">{data.lifeEvent}</Badge>
          </div>
          <SheetTitle className="text-right text-xl font-bold leading-snug">
            {data.title}
          </SheetTitle>
          {data.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {data.description}
            </p>
          )}
        </SheetHeader>


        <div className="space-y-4 px-5 pb-6">
          {data.whyParticipate && (
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-elegant">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                لماذا نشارك
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">
                {data.whyParticipate}
              </p>
            </div>
          )}

          {data.setup && (
            <Section title="قبل أن تبدأ">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {data.setup}
              </p>
            </Section>
          )}

          {data.steps && data.steps.length > 0 && (
            <Section
              title="خطوات المشاركة"
              right={
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {done} / {total}
                </span>
              }
            >
              <ul className="space-y-2">
                {data.steps.map((s, i) => {
                  const key = `${data.id}-${i}`;
                  const isDone = !!checked[key];
                  return (
                    <li key={key}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                          isDone
                            ? "border-gold/60 bg-gold/10"
                            : "border-border/60 bg-background hover:border-primary/40"
                        }`}
                      >
                        <Checkbox
                          checked={isDone}
                          onCheckedChange={(v) =>
                            setChecked((p) => ({ ...p, [key]: !!v }))
                          }
                          className="mt-0.5"
                        />
                        <span
                          className={`text-sm leading-relaxed ${
                            isDone ? "text-muted-foreground line-through" : "text-foreground"
                          }`}
                        >
                          {s}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </Section>
          )}

          {data.support && (
            <Section title="كيف أجعل المشاركة أسهل؟">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {data.support}
              </p>
            </Section>
          )}

          <Accordion type="multiple" className="space-y-2">
            <Item value="levels" title="ابدأ من المستوى المناسب">
              <div className="space-y-2">
                <Level label="موجهة" text={data.levels.guided} tone="soft" />
                <Level label="مشتركة" text={data.levels.shared} tone="mid" />
                <Level label="مستقلة" text={data.levels.independent} tone="strong" />
              </div>
            </Item>
            {data.progressIndicators && data.progressIndicators.length > 0 && (
              <Item value="progress" title="مؤشرات التقدم">
                <div className="flex flex-wrap gap-2">
                  {data.progressIndicators.map((p) => (
                    <span
                      key={p}
                      className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </Item>
            )}
          </Accordion>

          {data.id === "OP-COLLECT" && <SupportResourcesPrototype />}

          {data.nextStep && (
            <Accordion type="multiple" className="space-y-2">
              <Item value="next" title="ماذا بعد؟">
                <p className="leading-relaxed">{data.nextStep}</p>
              </Item>
            </Accordion>
          )}
        </div>

        <div className="sticky bottom-0 grid grid-cols-3 gap-2 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
            {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {saved ? "محفوظ" : "حفظ"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="h-4 w-4" />
            مشاركة
          </Button>
          <Button
            size="sm"
            onClick={onNext}
            disabled={!onNext}
            className="gap-1.5"
          >
            التالي
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-bold text-foreground">{title}</h4>
        {right}
      </div>
      {children}
    </div>
  );
}

function Item({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem
      value={value}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
    >
      <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

function Level({ label, text, tone }: { label: string; text: string; tone: "soft" | "mid" | "strong" }) {
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

import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Share2,
  ArrowLeft,
  Check,
  Images,
  Info,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";
import { SupportDuringExecution } from "@/components/SupportDuringExecution";
import { NoAssetNotice } from "@/components/NoAssetNotice";
import { HumanSafetyNotice } from "@/components/HumanSafetyNotice";
import { getSupportDecisionForOpportunity } from "@/lib/support-decisions";
import { participationLevelLabel } from "@/lib/knowledge-base";
import type { ParticipationLevelKey } from "@/lib/home-hierarchy";

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
  /** مستوى فرصة المشاركة (يصف الفرصة، لا قدرة الشخص). */
  participationLevel?: ParticipationLevelKey;
  progressIndicators?: string[];
  supportResources?: string[];
  nextStep?: string;
}

interface ParticipationCardProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: ParticipationCardData | null;
  onNext?: () => void;
}

const todayKey = () => `did-today:${new Date().toISOString().slice(0, 10)}`;

function readSet(key: string): Set<string> {
  try {
    const list = JSON.parse(localStorage.getItem(key) ?? "[]");
    return new Set<string>(Array.isArray(list) ? list : []);
  } catch {
    return new Set<string>();
  }
}

export function ParticipationCard({ open, onOpenChange, data, onNext }: ParticipationCardProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [doneToday, setDoneToday] = useState(false);
  const [running, setRunning] = useState(false);
  const [showVisual, setShowVisual] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [todayLogId, setTodayLogId] = useState<string | undefined>(undefined);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!open) {
      setChecked({});
      setSafetyAcknowledged(false);
      setRunning(false);
      setShowVisual(false);
      setShowDetails(false);
      return;
    }
    if (!data) return;
    setSaved(readSet("saved-participation").has(data.id));
    setDoneToday(readSet(todayKey()).has(data.id));
    setActiveId(null);
    setTodayLogId(undefined);

    let cancelled = false;
    (async () => {
      try {
        const active = await findActiveParticipationByOpportunity(data.id);
        if (cancelled || !active) return;
        setActiveId(active.id);
        const log = await getTodayLog(active.id);
        if (cancelled) return;
        setTodayLogId(log?.id);
        setDoneToday(!!log?.did_participate);
      } catch {
        /* تصفح حر أو بدون جلسة: يبقى السلوك المحلي */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, data]);


  if (!data) return null;

  const supportDecision = getSupportDecisionForOpportunity(data.id);
  const total = data.steps?.length ?? 0;
  const done = Object.values(checked).filter(Boolean).length;
  const context = [data.generalActivity, data.lifeEvent]
    .filter(Boolean)
    .join(" › ");

  const toggleStored = (key: string, on: boolean) => {
    const set = readSet(key);
    if (on) set.add(data.id);
    else set.delete(data.id);
    try {
      localStorage.setItem(key, JSON.stringify([...set]));
    } catch {
      /* ignore */
    }
  };

  const handleSave = () => {
    const next = !saved;
    setSaved(next);
    toggleStored("saved-participation", next);
    toast(next ? "تم الحفظ" : "أزيلت من المحفوظات");
  };

  const handleDoneToday = () => {
    const next = !doneToday;
    setDoneToday(next);
    toggleStored(todayKey(), next);
    toast(next ? "سُجّلت مشاركة اليوم" : "أُلغي تسجيل اليوم");
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
          <SheetTitle className="text-right text-xl font-bold leading-snug">
            {data.title}
          </SheetTitle>
          {context && (
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              ضمن: {context}
            </p>
          )}
        </SheetHeader>

        <div className="space-y-4 px-5 pb-6">
          {/* ما نحتاجه */}
          {!running && data.setup && (
            <Section title="ما نحتاجه">
              <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
                {data.setup}
              </p>
            </Section>
          )}

          {/* خطوات المشاركة — المصدر كما هو */}
          {!running && data.steps && data.steps.length > 0 && (
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

          {/* هل فعلنا هذا اليوم؟ */}
          {!running && (
            <Section title="هل فعلنا هذا اليوم؟">
              <Button
                variant={doneToday ? "default" : "outline"}
                className="min-h-11 w-full gap-2"
                onClick={handleDoneToday}
                aria-pressed={doneToday}
              >
                <CalendarCheck className="h-4 w-4" />
                {doneToday ? "نعم، شاركنا اليوم" : "تسجيل مشاركة اليوم"}
              </Button>
            </Section>
          )}

          {/* إجراءات أساسية */}
          {!running && (
            <div className="grid gap-2 sm:grid-cols-2">
              <Button
                variant="outline"
                className="min-h-11 w-full gap-2"
                onClick={() => setShowVisual((v) => !v)}
                aria-expanded={showVisual}
              >
                <Images className="h-4 w-4" />
                {showVisual ? "إخفاء الخطوات البصرية" : "عرض الخطوات البصرية"}
              </Button>
              <Button variant="outline" className="min-h-11 w-full gap-2" asChild>
                <Link to="/participation-guide" search={{ tab: "considerations" }}>
                  <Info className="h-4 w-4" />
                  عرض الاعتبارات
                </Link>
              </Button>
            </div>
          )}

          {(showVisual || running) && (
            <SupportDuringExecution
              opportunityId={data.id}
              hasSteps={(data.steps?.length ?? 0) > 0}
              onRunModeChange={(r) => {
                setRunning(r);
                if (!r) setShowDetails(false);
              }}
            />
          )}

          {supportDecision?.decision === "Not Required" && !running && (
            <NoAssetNotice decision={supportDecision} />
          )}

          {supportDecision?.decision === "Human Support Required" && (
            <HumanSafetyNotice
              decision={supportDecision}
              acknowledged={safetyAcknowledged}
              onAcknowledge={() => setSafetyAcknowledged(true)}
              onFocusModeChange={(f) => {
                setRunning(f);
                if (!f) setShowDetails(false);
              }}
            />
          )}

          {/* محتوى ثانوي مطوي */}
          {!running && (
            <Accordion type="multiple" className="space-y-2">
              {data.whyParticipate && (
                <Item value="why" title="لماذا نشارك">
                  <p className="leading-relaxed text-foreground">{data.whyParticipate}</p>
                </Item>
              )}
              {data.support && (
                <Item value="easier" title="كيف أجعل المشاركة أسهل؟">
                  <p className="whitespace-pre-line leading-relaxed text-foreground">
                    {data.support}
                  </p>
                </Item>
              )}
              <Item value="levels" title="ابدأ من المستوى المناسب">
                <div className="space-y-2">
                  <Level label="موجهة" text={data.levels.guided} tone="soft" />
                  <Level label="مستقلة جزئياً" text={data.levels.shared} tone="mid" />
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
              {data.nextStep && (
                <Item value="next" title="ماذا بعد؟">
                  <p className="leading-relaxed">{data.nextStep}</p>
                </Item>
              )}
              <Item value="context" title="أين تقع هذه المشاركة؟">
                <ul className="space-y-1.5 text-foreground">
                  <li>المجال: {data.domain}</li>
                  {data.generalActivity && <li>السياق اليومي: {data.generalActivity}</li>}
                  {data.lifeEvent && <li>حدث الحياة: {data.lifeEvent}</li>}
                  {data.participationLevel && (
                    <li>{participationLevelLabel[data.participationLevel]}</li>
                  )}
                </ul>
              </Item>
            </Accordion>
          )}
        </div>

        {!running && (
          <div className="sticky bottom-0 grid grid-cols-3 gap-2 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
            <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
              {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              {saved ? "محفوظ" : "حفظ"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" />
              مشاركة
            </Button>
            <Button size="sm" onClick={onNext} disabled={!onNext} className="gap-1.5">
              التالي
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
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

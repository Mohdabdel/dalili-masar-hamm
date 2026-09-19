// اعتبارات المشاركة داخل مساحة الأسرة — قسم قابل للطي، غير إلزامي.
// المحتوى منقول كما هو من المرجع المعتمد؛ الأسرة تختار ما يناسبها فقط.
// لا يظهر شيء من هذا القسم في بطاقة المشارك.

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { contextualConsiderations } from "@/features/space/considerations-context";
import type { LabParticipationSpec } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export function ConsiderationsPanel({
  spec,
  texts,
  stepCount,
  selectedIds,
  onToggle,
}: {
  spec: LabParticipationSpec;
  texts: string[];
  stepCount: number;
  selectedIds: string[];
  onToggle: (id: string, next: boolean) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);

  const all = useMemo(
    () => contextualConsiderations({ spec, texts, stepCount }),
    [spec, texts, stepCount],
  );

  const selected = new Set(selectedIds);
  const visible = showAll ? all : all.filter((c) => c.suggested || selected.has(c.id));

  const active = visible.find((item) => item.id === activeId) ?? visible[0];
  const showSolutions = active?.id === revealedId;
  const tones = ["border-teal/30 bg-teal/10", "border-coral/30 bg-coral/10", "border-primary/20 bg-accent/50", "border-border bg-muted/70"];

  return (
    <section className="rounded-2xl border border-border bg-card p-3">
      <h2 className="text-base font-bold">اعتبارات أثناء التطبيق</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        في مواقف قد تواجهكم أثناء التطبيق، يمكنكم تجربة الحلول المقترحة.
      </p>

      <div role="tablist" aria-label="مواقف أثناء التطبيق" className="mt-4 flex flex-wrap gap-2">
        {visible.map((item, index) => (
          <button key={item.id} type="button" role="tab" id={`situation-${item.id}`}
            aria-controls="situation-solutions" aria-selected={active?.id === item.id}
            tabIndex={active?.id === item.id ? 0 : -1}
            onClick={() => { setActiveId(item.id); setRevealedId(null); }}
            onKeyDown={(event) => {
              const direction = event.key === "ArrowLeft" ? 1 : event.key === "ArrowRight" ? -1 : 0;
              if (!direction && event.key !== "Home" && event.key !== "End") return;
              event.preventDefault();
              const next = event.key === "Home" ? 0 : event.key === "End" ? visible.length - 1
                : (index + direction + visible.length) % visible.length;
              setActiveId(visible[next].id);
              setRevealedId(null);
              const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
              buttons?.[next]?.focus();
            }}
            className={cn("min-h-11 rounded-xl border px-3 py-2 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", tones[index % tones.length],
              active?.id === item.id && "ring-2 ring-primary ring-offset-2")}
          >
            {item.title}{selected.has(item.id) ? " ✓" : ""}
          </button>
        ))}
      </div>

      {active && <div id="situation-solutions" role="tabpanel" aria-labelledby={`situation-${active.id}`}
        className="mt-4 rounded-xl border border-border bg-background p-4">
        <h3 className="font-bold">{active.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{active.notice}</p>
        <button type="button" onClick={() => setRevealedId(showSolutions ? null : active.id)}
          aria-expanded={showSolutions} aria-controls="situation-solutions-content"
          className="mt-3 min-h-11 rounded-xl border border-border px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {showSolutions ? "إخفاء الحلول المقترحة" : "جرّب الحلول المقترحة"}
        </button>
        {showSolutions && <div id="situation-solutions-content">
          <p className="mt-3 text-sm leading-relaxed">{active.considerations}</p>
          <ul className="mt-3 list-disc space-y-2 pe-5 text-sm leading-relaxed">
            {active.actions.map((action) => <li key={action}>{action}</li>)}
          </ul>
          <button type="button" onClick={() => onToggle(active.id, !selected.has(active.id))}
            aria-pressed={selected.has(active.id)}
            className="mt-4 inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {selected.has(active.id) && <Check className="h-4 w-4" aria-hidden />}
            {selected.has(active.id) ? "محفوظ معنا" : "احفظوه معنا"}
          </button>
        </div>}
      </div>}

      <button
        type="button"
        onClick={() => setShowAll(!showAll)}
        className="mt-3 min-h-11 rounded-xl border border-border px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {showAll ? "اعرضوا المناسب لهذه المشاركة فقط" : `اعرضوا كل الاعتبارات (${all.length})`}
      </button>
    </section>
  );
}

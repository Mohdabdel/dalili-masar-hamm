// اعتبارات المشاركة داخل مساحة الأسرة — قسم قابل للطي، غير إلزامي.
// المحتوى منقول كما هو من المرجع المعتمد؛ الأسرة تختار ما يناسبها فقط.
// لا يظهر شيء من هذا القسم في بطاقة المشارك.

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import {
  contextualConsiderations,
  type ContextualConsideration,
} from "@/features/space/considerations-context";
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

  const all = useMemo(
    () => contextualConsiderations({ spec, texts, stepCount }),
    [spec, texts, stepCount],
  );

  const selected = new Set(selectedIds);
  const visible = showAll ? all : all.filter((c) => c.suggested || selected.has(c.id));

  const groups = useMemo(() => {
    const map = new Map<string, { title: string; items: ContextualConsideration[] }>();
    for (const item of visible) {
      const entry = map.get(item.groupId) ?? { title: item.groupTitle, items: [] };
      entry.items.push(item);
      map.set(item.groupId, entry);
    }
    return [...map.values()];
  }, [visible]);

  return (
    <details className="rounded-2xl border border-border bg-card p-3">
      <summary className="cursor-pointer text-sm font-bold">
        اعتبارات قد تساعد ({selectedIds.length > 0 ? `اخترتم ${selectedIds.length}` : "اختيارية"})
      </summary>

      <p className="mt-3 text-sm text-muted-foreground">
        ملاحظات موقفية للأسرة فقط. لا شيء منها مطلوب، ولا يظهر أي منها للمشارك. اختاروا ما يناسب
        مشاركتكم لتبقى معكم.
      </p>

      <div className="mt-3 space-y-4">
        {groups.map((group) => (
          <section key={group.title}>
            <h3 className="mb-2 text-sm font-bold text-foreground">{group.title}</h3>
            <ul className="space-y-2">
              {group.items.map((item) => {
                const isOn = selected.has(item.id);
                return (
                  <li
                    key={item.id}
                    className={cn(
                      "rounded-xl border p-3",
                      isOn ? "border-primary bg-accent/40" : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="min-w-0 text-base font-bold">{item.title}</span>
                      <button
                        type="button"
                        onClick={() => onToggle(item.id, !isOn)}
                        aria-pressed={isOn}
                        className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {isOn && <Check className="h-4 w-4" aria-hidden />}
                        {isOn ? "محفوظ معنا" : "احفظوه معنا"}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.notice}</p>
                    {isOn && (
                      <>
                        <p className="mt-2 text-sm leading-relaxed">{item.considerations}</p>
                        <ul className="mt-2 list-disc space-y-1 pe-5 text-sm text-muted-foreground">
                          {item.actions.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAll(!showAll)}
        className="mt-3 min-h-11 rounded-xl border border-border px-4 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {showAll ? "اعرضوا المناسب لهذه المشاركة فقط" : `اعرضوا كل الاعتبارات (${all.length})`}
      </button>
    </details>
  );
}

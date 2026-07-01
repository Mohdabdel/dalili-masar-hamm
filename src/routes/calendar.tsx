import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, MapPin } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { calendarEvents } from "@/lib/data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "تقويم الفعاليات 2026 | دليلي - مسار همم" },
      { name: "description", content: "أبرز فعاليات ومناسبات أصحاب الهمم في الإمارات لعام 2026." },
    ],
  }),
  component: CalendarPage,
});

const typeColor: Record<string, string> = {
  "رسمي": "bg-primary/10 text-primary",
  "رسمي وطني": "bg-primary/15 text-primary",
  "أكاديمي": "bg-blue-500/10 text-blue-700",
  "رياضي": "bg-emerald-500/10 text-emerald-700",
  "اجتماعي": "bg-pink-500/10 text-pink-700",
  "معرض عالمي": "bg-gold/20 text-primary",
};

function CalendarPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return calendarEvents;
    return calendarEvents.filter((e) =>
      [e.date, e.name, e.type, e.location, e.description].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="تقويم الفعاليات 2026" subtitle="أبرز المحطات المجتمعية لأصحاب الهمم">
      <SearchBar value={q} onChange={setQ} placeholder="ابحث في الفعاليات..." />
      <div className="space-y-4">
        {filtered.map((e, idx) => (
          <article
            key={idx}
            className="flex overflow-hidden rounded-3xl border border-border bg-card shadow-card-soft"
          >
            <div className="flex w-24 flex-col items-center justify-center bg-gradient-primary px-2 py-4 text-center text-primary-foreground">
              <CalendarDays className="mb-1 h-5 w-5 text-gold" />
              <span className="text-[11px] font-bold leading-tight">{e.date}</span>
            </div>
            <div className="flex-1 space-y-2 px-4 py-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-bold leading-snug text-foreground">
                  {e.name}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    typeColor[e.type] ?? "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {e.type}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {e.location}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-foreground/80">{e.description}</p>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة.</p>
        )}
      </div>
    </PageShell>
  );
}

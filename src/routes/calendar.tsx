import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarDays, Globe } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { SmallCard } from "@/components/SmallCard";
import { DetailSheet } from "@/components/DetailSheet";
import { calendarEvents, type CalendarEvent } from "@/lib/data";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "تقويم الفعاليات 2026 | دليلي - مسار همم" },
      { name: "description", content: "أهم الفعاليات والمناسبات المتعلقة بأصحاب الهمم لعام 2026." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<CalendarEvent | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return calendarEvents;
    return calendarEvents.filter((e) =>
      [e.id, e.name, e.date, e.location].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="تقويم الفعاليات 2026" subtitle={`${filtered.length} فعالية قادمة`} breadcrumbs={[{ label: "الفعاليات" }]}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن فعالية..." />
      <div className="mt-4 space-y-3">
        {filtered.map((e) => (
          <SmallCard
            key={e.id}
            title={e.name}
            meta={`📅 ${e.date}`}
            icon={e.location.includes("عالمي") ? Globe : CalendarDays}
            onClick={() => setActive(e)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
        )}
      </div>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.date}
        title={active?.name ?? ""}
        headline={active?.location}
        headlineLabel="المكان"
        sections={
          active
            ? [{ id: "desc", title: "وصف الفعالية", content: active.description }]
            : []
        }
      />
    </PageShell>
  );
}

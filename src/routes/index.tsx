import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Moon, Tv, Sprout, Sparkles, ShoppingCart, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { SmallCard } from "@/components/SmallCard";
import { DetailSheet } from "@/components/DetailSheet";
import { homeEvents, type HomeEvent } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الأنشطة والمشاركات | دليلي - مسار همم" },
      { name: "description", content: "أنشطة يومية منظمة لأصحاب الهمم مع خطوات تفاعلية وأفكار للدعم الحسي." },
    ],
  }),
  component: ActivitiesPage,
});

const iconMap: Record<string, LucideIcon> = {
  "EV-01": Moon,
  "EV-02": Tv,
  "EV-03": Sprout,
  "EV-04": Sparkles,
  "EV-05": ShoppingCart,
};

function ActivitiesPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<HomeEvent | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return homeEvents;
    return homeEvents.filter((e) =>
      [e.id, e.name, e.currentTask].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="الأنشطة والمشاركات" subtitle={`${filtered.length} نشاط جاهز للتنفيذ`}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن نشاط..." />
      <div className="mt-4 space-y-3">
        {filtered.map((e) => (
          <SmallCard
            key={e.id}
            title={e.name}
            meta={`⏱ ${e.duration}`}
            icon={iconMap[e.id] ?? Sparkles}
            onClick={() => setActive(e)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            لا توجد نتائج مطابقة
          </p>
        )}
      </div>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.id}
        title={active?.name ?? ""}
        headline={active?.currentTask}
        headlineLabel={`المهمة الحالية · ${active?.duration ?? ""}`}
        checklist={active?.steps.map((s, i) => ({ key: `${active.id}-${i}`, label: s }))}
        sections={
          active
            ? [
                {
                  id: "req",
                  title: "متطلبات تحسين المشاركة والدعم الحسي",
                  content: active.requirements,
                },
                {
                  id: "fun",
                  title: "أفكار لجعل المشاركة ممتعة",
                  content: active.fun,
                },
              ]
            : []
        }
      />
    </PageShell>
  );
}

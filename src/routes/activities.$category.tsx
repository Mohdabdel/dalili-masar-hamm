import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Moon, Tv, Sprout, Sparkles, ShoppingCart, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { SmallCard } from "@/components/SmallCard";
import { DetailSheet } from "@/components/DetailSheet";
import { homeEvents, type HomeEvent, type ActivityCategory } from "@/lib/data";

export const Route = createFileRoute("/activities/$category")({
  parseParams: (p) => {
    if (p.category !== "home" && p.category !== "community") throw notFound();
    return { category: p.category as ActivityCategory };
  },
  head: ({ params }) => {
    const isHome = params.category === "home";
    const title = isHome ? "الأنشطة المنزلية" : "الأنشطة المجتمعية";
    return {
      meta: [
        { title: `${title} | دليلي - مسار همم` },
        { name: "description", content: `${title} مع خطوات تفاعلية وأفكار للدعم الحسي.` },
      ],
    };
  },
  component: ActivitiesPage,
  notFoundComponent: () => (
    <PageShell title="غير موجود">
      <p className="text-center text-muted-foreground">الفئة غير متوفرة.</p>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell title="خطأ">
      <p className="text-center text-muted-foreground">حدث خطأ غير متوقع.</p>
    </PageShell>
  ),
});

const iconMap: Record<string, LucideIcon> = {
  "EV-01": Moon,
  "EV-02": Tv,
  "EV-03": Sprout,
  "EV-04": Sparkles,
  "EV-05": ShoppingCart,
};

function ActivitiesPage() {
  const { category } = Route.useParams();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<HomeEvent | null>(null);

  const items = useMemo(
    () => homeEvents.filter((e) => e.category === category),
    [category],
  );
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return items;
    return items.filter((e) =>
      [e.id, e.name, e.currentTask].some((f) => f.includes(s)),
    );
  }, [q, items]);

  const title = category === "home" ? "الأنشطة المنزلية" : "الأنشطة المجتمعية";

  return (
    <PageShell title={title} subtitle={`${filtered.length} نشاط جاهز للتنفيذ`}>
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
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
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
                { id: "req", title: "متطلبات تحسين المشاركة والدعم الحسي", content: active.requirements },
                { id: "fun", title: "أفكار لجعل المشاركة ممتعة", content: active.fun },
              ]
            : []
        }
      />
    </PageShell>
  );
}

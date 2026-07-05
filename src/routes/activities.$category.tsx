import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { HomeHierarchy } from "@/components/HomeHierarchy";
import { communityHierarchy } from "@/lib/community-hierarchy";
import type { ActivityCategory } from "@/lib/data";


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

function ActivitiesPage() {
  const { category } = Route.useParams();

  if (category === "home") {
    return (
      <PageShell
        title="الأنشطة المنزلية"
        subtitle="مجال ← نشاط عام ← حدث حياة ← فرصة مشاركة ← بطاقة"
      >
        <HomeHierarchy />
      </PageShell>
    );
  }

  return <CommunityView />;
}

function CommunityView() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<HomeEvent | null>(null);

  const items = useMemo(
    () => homeEvents.filter((e) => e.category === "community"),
    [],
  );
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return items;
    return items.filter((e) =>
      [e.id, e.name, e.currentTask].some((f) => f.includes(s)),
    );
  }, [q, items]);

  return (
    <PageShell title="الأنشطة المجتمعية" subtitle={`${filtered.length} نشاط جاهز للتنفيذ`}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن نشاط..." />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {filtered.map((e) => (
          <ImageTile
            key={e.id}
            title={e.name}
            meta={e.duration}
            image={activityImages[e.id]}
            onClick={() => setActive(e)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">لا توجد نتائج مطابقة</p>
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


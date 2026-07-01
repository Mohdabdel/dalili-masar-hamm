import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Briefcase, Bus, Building2, type LucideIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { SmallCard } from "@/components/SmallCard";
import { DetailSheet } from "@/components/DetailSheet";
import { resources, type Resource } from "@/lib/data";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "دليل الخدمات والتسهيلات | دليلي - مسار همم" },
      { name: "description", content: "مرجع للجهات والخدمات الحكومية للأشخاص أصحاب الهمم في الإمارات." },
    ],
  }),
  component: ResourcesPage,
});

const iconMap: Record<string, LucideIcon> = {
  "RES-01": Briefcase,
  "RES-02": Bus,
};

function ResourcesPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<Resource | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return resources;
    return resources.filter((r) =>
      [r.id, r.name, r.entity].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="دليل الخدمات والتسهيلات" subtitle={`${filtered.length} خدمة معتمدة`}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن خدمة أو جهة..." />
      <div className="mt-4 space-y-3">
        {filtered.map((r) => (
          <SmallCard
            key={r.id}
            title={r.name}
            meta={r.entity}
            icon={iconMap[r.id] ?? Building2}
            onClick={() => setActive(r)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">لا توجد نتائج</p>
        )}
      </div>

      <DetailSheet
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        eyebrow={active?.id}
        title={active?.name ?? ""}
        headline={active?.entity}
        headlineLabel="الجهة المسؤولة"
        sections={
          active
            ? [
                { id: "steps", title: "خطوات التقديم", content: active.steps },
                { id: "benefits", title: "المزايا والحقوق", content: active.benefits },
              ]
            : []
        }
      />
    </PageShell>
  );
}

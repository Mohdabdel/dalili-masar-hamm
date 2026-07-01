import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, ListOrdered, Gift } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { resources } from "@/lib/data";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "دليل الخدمات والتسهيلات | دليلي - مسار همم" },
      { name: "description", content: "12 خدمة حكومية وتسهيل معتمد لأصحاب الهمم في دولة الإمارات." },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return resources;
    return resources.filter((r) =>
      [r.id, r.name, r.entity, r.benefits].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="دليل الخدمات والتسهيلات" subtitle="خدمات حكومية معتمدة في دولة الإمارات">
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن خدمة أو جهة..." />
      <div className="space-y-4">
        {filtered.map((r) => (
          <article
            key={r.id}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-card-soft"
          >
            <div className="border-b border-border/60 bg-gradient-to-l from-secondary/60 to-transparent px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                  {r.id}
                </span>
              </div>
              <h2 className="mt-2 text-base font-bold leading-snug text-foreground">
                {r.name}
              </h2>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-xl bg-gold/15 px-2.5 py-1 text-xs font-semibold text-primary">
                <Building2 className="h-3.5 w-3.5" />
                {r.entity}
              </div>
            </div>

            <div className="space-y-3 px-5 py-4">
              <div>
                <div className="mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <ListOrdered className="h-4 w-4 text-gold" />
                  خطوات التقديم
                </div>
                <p className="text-sm leading-relaxed text-foreground/85">{r.guide}</p>
              </div>
              <div className="rounded-2xl bg-gold/10 p-3">
                <div className="mb-1 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <Gift className="h-4 w-4 text-gold" />
                  المزايا والإعفاءات
                </div>
                <p className="text-sm leading-relaxed text-foreground">{r.benefits}</p>
              </div>
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

import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, ListChecks, Sparkles, Wrench } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { homeEvents } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "الأنشطة والمشاركات | دليلي - مسار همم" },
      { name: "description", content: "14 نشاطاً يومياً منظماً لأصحاب الهمم مع خطوات تنفيذ وتحسينات حسية." },
    ],
  }),
  component: ActivitiesPage,
});

function ActivitiesPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim();
    if (!s) return homeEvents;
    return homeEvents.filter((e) =>
      [e.id, e.name, e.currentTask, e.steps].some((f) => f.includes(s)),
    );
  }, [q]);

  return (
    <PageShell title="الأنشطة والمشاركات" subtitle={`${filtered.length} نشاط منظم للتنفيذ اليومي`}>
      <SearchBar value={q} onChange={setQ} placeholder="ابحث عن نشاط أو مهمة..." />
      <div className="space-y-4">
        {filtered.map((e) => (
          <article
            key={e.id}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-card-soft transition-shadow hover:shadow-elegant"
          >
            <div className="flex items-start justify-between gap-3 border-b border-border/60 bg-gradient-to-l from-secondary/60 to-transparent px-5 py-4">
              <div className="flex-1">
                <span className="inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-primary-foreground">
                  {e.id}
                </span>
                <h2 className="mt-2 text-base font-bold leading-snug text-foreground">
                  {e.name}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 rounded-xl bg-gold/15 px-2.5 py-1.5 text-xs font-bold text-primary">
                <Clock className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">{e.duration}</span>
              </div>
            </div>

            <div className="space-y-4 px-5 py-4">
              <Section icon={<ListChecks className="h-4 w-4" />} label="المهمة الحالية">
                {e.currentTask}
              </Section>
              <Section icon={<ListChecks className="h-4 w-4" />} label="خطوات التنفيذ">
                {e.steps}
              </Section>
              <Section icon={<Wrench className="h-4 w-4" />} label="متطلبات تحسين المشاركة">
                {e.requirements}
              </Section>
              <Section icon={<Sparkles className="h-4 w-4" />} label="لجعلها ممتعة أكثر" tone="gold">
                {e.fun}
              </Section>
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

function Section({
  icon,
  label,
  children,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  tone?: "default" | "gold";
}) {
  const isGold = tone === "gold";
  return (
    <div>
      <div
        className={`mb-1.5 inline-flex items-center gap-1.5 text-xs font-bold ${
          isGold ? "text-gold-foreground" : "text-primary"
        }`}
      >
        <span className={isGold ? "text-gold" : "text-gold"}>{icon}</span>
        {label}
      </div>
      <p
        className={`text-sm leading-relaxed ${
          isGold ? "rounded-2xl bg-gold/10 p-3 text-foreground" : "text-foreground/85"
        }`}
      >
        {children}
      </p>
    </div>
  );
}

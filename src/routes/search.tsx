import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { searchIndex, kindLabel, type SearchKind } from "@/lib/search-index";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "البحث | دليلي" },
      { name: "description", content: "ابحث في الأنشطة المنزلية والمجتمعية وخدمات الدعم." },
    ],
  }),
  component: SearchPage,
});

type LevelFilter = "any" | "guided" | "shared" | "independent";
type TimeFilter = "any" | "short" | "medium" | "long"; // <15 | 15-30 | >30
type BoolFilter = "any" | "yes" | "no";

interface Filters {
  kinds: SearchKind[];
  level: LevelFilter;
  time: TimeFilter;
  outside: BoolFilter;
  tools: BoolFilter;
}

const initialFilters: Filters = {
  kinds: [],
  level: "any",
  time: "any",
  outside: "any",
  tools: "any",
};

function SearchPage() {
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filters>(initialFilters);

  const results = useMemo(() => {
    const s = q.trim();
    return searchIndex.filter((it) => {
      if (f.kinds.length > 0 && !f.kinds.includes(it.kind)) return false;
      if (f.outside !== "any") {
        if (f.outside === "yes" && !it.needsOutside) return false;
        if (f.outside === "no" && it.needsOutside) return false;
      }
      if (f.tools !== "any") {
        if (f.tools === "yes" && !it.needsTools) return false;
        if (f.tools === "no" && it.needsTools) return false;
      }
      if (f.time !== "any") {
        const m = it.expectedMinutes;
        if (m == null) return false;
        if (f.time === "short" && m > 15) return false;
        if (f.time === "medium" && (m < 15 || m > 30)) return false;
        if (f.time === "long" && m <= 30) return false;
      }
      // Level filter: only applies when we have data with cards
      if (f.level !== "any" && !it.hasCard) return false;

      if (!s) return true;
      const hay = [
        it.title,
        it.domain,
        it.activityOrService,
        it.event ?? "",
        it.opportunity,
        ...it.keywords,
      ].join(" ");
      return hay.includes(s);
    });
  }, [q, f]);

  const toggleKind = (k: SearchKind) =>
    setF((p) => ({
      ...p,
      kinds: p.kinds.includes(k) ? p.kinds.filter((x) => x !== k) : [...p.kinds, k],
    }));

  const activeFilterCount =
    f.kinds.length +
    (f.level !== "any" ? 1 : 0) +
    (f.time !== "any" ? 1 : 0) +
    (f.outside !== "any" ? 1 : 0) +
    (f.tools !== "any" ? 1 : 0);

  return (
    <PageShell
      title="البحث"
      subtitle={`${results.length} نتيجة`}
      breadcrumbs={[{ label: "البحث" }]}
    >
      <SearchBar value={q} onChange={setQ} placeholder="ابحث في المجالات والأنشطة والخدمات..." />

      <div className="mb-4 space-y-3 rounded-2xl border border-border/60 bg-card p-3 shadow-card-soft">
        <FilterGroup label="النوع">
          {(["home", "community", "services"] as SearchKind[]).map((k) => (
            <Chip key={k} active={f.kinds.includes(k)} onClick={() => toggleKind(k)}>
              {kindLabel[k]}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="مستوى المشاركة">
          {(
            [
              ["any", "الكل"],
              ["guided", "موجهة"],
              ["shared", "مشتركة"],
              ["independent", "مستقلة"],
            ] as [LevelFilter, string][]
          ).map(([v, label]) => (
            <Chip key={v} active={f.level === v} onClick={() => setF((p) => ({ ...p, level: v }))}>
              {label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="الوقت المتوقع">
          {(
            [
              ["any", "الكل"],
              ["short", "أقل من 15 د"],
              ["medium", "15–30 د"],
              ["long", "أكثر من 30 د"],
            ] as [TimeFilter, string][]
          ).map(([v, label]) => (
            <Chip key={v} active={f.time === v} onClick={() => setF((p) => ({ ...p, time: v }))}>
              {label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="الخروج من المنزل">
          {(
            [
              ["any", "الكل"],
              ["yes", "يحتاج خروج"],
              ["no", "لا يحتاج"],
            ] as [BoolFilter, string][]
          ).map(([v, label]) => (
            <Chip key={v} active={f.outside === v} onClick={() => setF((p) => ({ ...p, outside: v }))}>
              {label}
            </Chip>
          ))}
        </FilterGroup>

        <FilterGroup label="الأدوات">
          {(
            [
              ["any", "الكل"],
              ["yes", "يحتاج أدوات"],
              ["no", "بدون أدوات"],
            ] as [BoolFilter, string][]
          ).map(([v, label]) => (
            <Chip key={v} active={f.tools === v} onClick={() => setF((p) => ({ ...p, tools: v }))}>
              {label}
            </Chip>
          ))}
        </FilterGroup>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setF(initialFilters)}
            className="w-full gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            مسح الفلاتر ({activeFilterCount})
          </Button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          لا توجد نتائج مطابقة
        </p>
      ) : (
        <ul className="space-y-2">
          {results.map((r) => (
            <li key={r.id}>
              <Link
                to={r.kind === "services" ? "/resources" : "/activities/$category"}
                params={
                  r.kind === "services"
                    ? undefined
                    : { category: r.kind === "home" ? "home" : "community" }
                }
                search={r.kind === "services" ? undefined : { open: r.id, view: "domains" as const }}
                className="group flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-3 shadow-card-soft transition-all hover:border-gold/60"
              >

                <div className="min-w-0 flex-1 text-right">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary" className="bg-primary/10 text-[10px] text-primary">
                      {kindLabel[r.kind]}
                    </Badge>
                    {r.hasCard && (
                      <Badge variant="outline" className="text-[10px]">
                        بطاقة كاملة
                      </Badge>
                    )}
                    {r.expectedMinutes != null && (
                      <Badge variant="outline" className="text-[10px]">
                        {r.expectedMinutes} د
                      </Badge>
                    )}
                  </div>
                  <div className="truncate text-sm font-semibold text-foreground">
                    {r.title}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {r.domain} · {r.activityOrService}
                    {r.event ? ` · ${r.event}` : ""}
                  </div>
                </div>
                <ChevronLeft className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 text-[11px] font-semibold text-muted-foreground">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border/60 bg-background text-muted-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );
}

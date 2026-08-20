import { useMemo, useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import { Input } from "@/components/ui/input";
import { getAllOpportunities, type FlatOpportunity } from "@/lib/knowledge-base";
import type { ParticipationLevelKey } from "@/lib/home-hierarchy";

const PAGE_SIZE = 40;

function toData(ctx: FlatOpportunity): ParticipationCardData {
  const c = ctx.opportunity.card;
  const levels =
    c?.levels ??
    ctx.opportunity.levels ?? { guided: "", shared: "", independent: "" };
  return {
    id: ctx.opportunity.id,
    title: c?.title ?? ctx.opportunity.name,
    description: c?.description,
    domain: ctx.domain.name,
    generalActivity: ctx.activity.name,
    lifeEvent: ctx.event.name,
    opportunity: ctx.opportunity.name,
    whyParticipate: c?.whyParticipate,
    setup: c?.setup,
    steps: c?.steps,
    support: c?.support,
    levels,
    progressIndicators: c?.progressIndicators,
    supportResources: c?.supportResources,
    nextStep: c?.nextStep,
    participationLevel: ctx.opportunity.participationLevel,
  };
}

export function GeneralParticipationList({
  level,
}: {
  level?: ParticipationLevelKey;
}) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [active, setActive] = useState<FlatOpportunity | null>(null);

  const all = useMemo(() => getAllOpportunities(level), [level]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return all;
    return all.filter(
      (x) =>
        x.opportunity.name.includes(q) ||
        x.event.name.includes(q) ||
        x.domain.name.includes(q),
    );
  }, [all, query]);

  const visible = filtered.slice(0, limit);

  return (
    <div dir="rtl" className="text-start">
      <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
        جميع فرص المشاركة المطابقة للمستوى المختار عبر المجالات والأحداث
        ({filtered.length} فرصة).
      </p>

      <div className="relative mb-3">
        <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setLimit(PAGE_SIZE);
          }}
          placeholder="ابحث في فرص المشاركة"
          className="pe-9 text-start"
        />
      </div>

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
          لا توجد فرص مشاركة مطابقة حالياً.
        </p>
      ) : (
        <ul className="space-y-2">
          {visible.map((item) => (
            <li key={item.opportunity.id}>
              <button
                type="button"
                onClick={() => setActive(item)}
                className="group flex w-full items-center gap-2 rounded-xl border border-border/60 bg-card p-3 text-start transition-all hover:border-gold/60 hover:bg-gold/5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {item.opportunity.name}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {item.domain.name} — {item.event.name}
                  </span>
                </span>
                <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-0.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {filtered.length > visible.length && (
        <button
          type="button"
          onClick={() => setLimit((n) => n + PAGE_SIZE)}
          className="mt-3 w-full rounded-xl border-2 border-border bg-card p-3 text-sm font-bold text-foreground transition-colors hover:border-gold"
        >
          عرض المزيد
        </button>
      )}

      <ParticipationCard
        open={!!active}
        onOpenChange={(o) => !o && setActive(null)}
        data={active ? toData(active) : null}
      />
    </div>
  );
}

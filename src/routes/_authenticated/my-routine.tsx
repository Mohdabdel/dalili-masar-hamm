import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronDown, Search, CalendarRange } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getResolvedStations } from "@/lib/daily-stations";

export const Route = createFileRoute("/_authenticated/my-routine")({
  head: () => ({
    meta: [
      { title: "مشاركات الروتين اليومي — دليلي" },
      {
        name: "description",
        content:
          "محطات يوم الأسرة المتكررة، وما قد تتضمنه من فرص مشاركة بسيطة في الحياة اليومية.",
      },
      { property: "og:title", content: "مشاركات الروتين اليومي — دليلي" },
      {
        property: "og:description",
        content: "استعرضوا محطات اليوم واختاروا موقفاً قد تتاح فيه مشاركة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DailyRoutineParticipations,
});

type Mode = "browse" | "plan";

function DailyRoutineParticipations() {
  const stations = useMemo(() => getResolvedStations(), []);
  const [mode, setMode] = useState<Mode>("browse");
  const [openId, setOpenId] = useState<string | null>(stations[0]?.id ?? null);
  const [planned, setPlanned] = useState<Record<string, boolean>>({});

  const plannedCount = Object.values(planned).filter(Boolean).length;

  return (
    <PageShell
      title="مشاركات الروتين اليومي"
      subtitle="يمر يوم الأسرة بمحطات متكررة يمكن أن تتضمن فرصاً بسيطة للمشاركة."
    >
      <div dir="rtl" className="text-start">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMode("browse")}
            aria-pressed={mode === "browse"}
            className={`rounded-2xl border-2 p-4 text-start transition-colors ${
              mode === "browse"
                ? "border-gold bg-gold/10"
                : "border-border/60 bg-card hover:border-gold/50"
            }`}
          >
            <span className="flex items-center gap-2 text-base font-bold text-foreground">
              <Search className="h-4 w-4" />
              ابحث عن مشاركة في يومكم
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              استعرضوا محطات اليوم واختاروا موقفاً قد يناسبكم.
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMode("plan")}
            aria-pressed={mode === "plan"}
            className={`rounded-2xl border-2 p-4 text-start transition-colors ${
              mode === "plan"
                ? "border-gold bg-gold/10"
                : "border-border/60 bg-card hover:border-gold/50"
            }`}
          >
            <span className="flex items-center gap-2 text-base font-bold text-foreground">
              <CalendarRange className="h-4 w-4" />
              خطط لفرص المشاركة
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              يمكنكم التفكير مسبقاً في المحطات التي قد تتاح فيها مشاركة خلال
              اليوم. خيار اختياري تماماً.
            </span>
          </button>
        </div>

        {mode === "browse" ? (
          <div className="mt-8 space-y-1">
            {stations.map((station, i) => {
              const isOpen = openId === station.id;
              return (
                <section key={station.id} className="border-b border-border/60">
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? null : station.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center gap-3 py-4 text-start"
                    >
                      <span className="w-6 shrink-0 text-sm font-bold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-bold text-foreground">
                          {station.title}
                        </span>
                        {!isOpen && (
                          <span className="mt-0.5 block text-xs text-muted-foreground">
                            {station.note}
                          </span>
                        )}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </h2>

                  {isOpen && (
                    <div className="pb-6 ps-9">
                      <p className="mb-3 text-sm text-muted-foreground">
                        {station.note}
                      </p>
                      <ul className="space-y-3">
                        {station.picks.map((pick) => (
                          <li
                            key={pick.opportunityId}
                            className="rounded-xl bg-muted/40 p-4"
                          >
                            <p className="text-base font-bold text-foreground">
                              {pick.title}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {pick.hint}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground/80">
                              ضمن: {pick.context}
                            </p>
                            <Link
                              to="/activities/$category"
                              params={{ category: "home" }}
                              search={{
                                open: pick.opportunityId,
                                view: "domains" as const,
                              }}
                              className="mt-3 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
                            >
                              اختر هذه المشاركة
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-sm leading-relaxed text-muted-foreground">
              أين قد توجد فرصة مشاركة اليوم؟ اختاروا المحطات التي قد ترغبون في
              تهيئة مشاركة فيها، ثم عودوا لاستعراضها.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {stations.map((station) => {
                const on = !!planned[station.id];
                return (
                  <li key={station.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setPlanned((p) => ({ ...p, [station.id]: !on }))
                      }
                      aria-pressed={on}
                      className={`w-full rounded-xl border-2 p-4 text-start transition-colors ${
                        on
                          ? "border-gold bg-gold/10"
                          : "border-border/60 bg-card hover:border-gold/50"
                      }`}
                    >
                      <span className="block text-base font-bold text-foreground">
                        {station.title}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {station.picks.length} فرصة مشاركة مرتبطة
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {plannedCount > 0 && (
              <button
                type="button"
                onClick={() => setMode("browse")}
                className="mt-5 inline-flex h-12 items-center rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground"
              >
                استعرضوا فرص هذه المحطات ({plannedCount})
              </button>
            )}
          </div>
        )}
      </div>
    </PageShell>
  );
}

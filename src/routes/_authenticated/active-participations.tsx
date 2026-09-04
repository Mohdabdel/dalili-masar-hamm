import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import { findOpportunityContextById } from "@/lib/knowledge-base";
import { partOfDayLabel, isPartOfDay } from "@/lib/daily-events";
import {
  getActiveRoutine,
  getStations,
  type RoutineStation,
} from "@/lib/family-routine";
import {
  closeParticipation,
  completeParticipationManually,
  listActiveParticipations,
  listTodayLogs,
  setTodayLog,
  type ActiveParticipation,
  type DailyLog,
} from "@/lib/active-participations";

export const Route = createFileRoute("/_authenticated/active-participations")({
  head: () => ({
    meta: [
      { title: "المشاركات النشطة — دليلي" },
      {
        name: "description",
        content:
          "تابعوا المشاركات النشطة لأسرتكم حسب محطات الروتين، وسجّلوا ما فعلتموه اليوم.",
      },
      { property: "og:title", content: "المشاركات النشطة — دليلي" },
      {
        property: "og:description",
        content: "لوحة متابعة المشاركات النشطة والإنجاز اليومي داخل دليلي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ActiveParticipationsPage,
});

function ActiveParticipationsPage() {
  const [items, setItems] = useState<ActiveParticipation[]>([]);
  const [stations, setStations] = useState<RoutineStation[]>([]);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [card, setCard] = useState<ParticipationCardData | null>(null);

  const load = async () => {
    try {
      const [list, todayLogs, routine] = await Promise.all([
        listActiveParticipations(),
        listTodayLogs(),
        getActiveRoutine(),
      ]);
      setItems(list);
      setLogs(todayLogs);
      setStations(routine ? await getStations(routine.id) : []);
    } catch (e) {
      toast.error("تعذّر تحميل المشاركات");
      // eslint-disable-next-line no-console
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stationById = useMemo(
    () => new Map(stations.map((s) => [s.id, s])),
    [stations],
  );

  const visible = items.filter((i) => i.status !== "closed");

  const groups = useMemo(() => {
    const map = new Map<string, ActiveParticipation[]>();
    visible.forEach((item) => {
      const key = item.routine_station_id ?? "__none__";
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return [...map.entries()];
  }, [visible]);

  const openCard = (opportunityId: string) => {
    const ctx = findOpportunityContextById(opportunityId);
    if (!ctx) {
      toast.error("لم نعثر على بطاقة المشاركة في المستودع");
      return;
    }
    const op = ctx.opportunity;
    setCard({
      id: op.id,
      title: op.card?.title ?? op.name,
      description: op.card?.description,
      domain: ctx.domain.name,
      generalActivity: ctx.activity.name,
      lifeEvent: ctx.event.name,
      opportunity: op.name,
      whyParticipate: op.card?.whyParticipate,
      setup: op.card?.setup,
      steps: op.card?.steps,
      support: op.card?.support,
      levels:
        op.card?.levels ??
        op.levels ?? { guided: "", shared: "", independent: "" },
      progressIndicators: op.card?.progressIndicators,
      supportResources: op.card?.supportResources,
      nextStep: op.card?.nextStep,
      participationLevel: op.participationLevel,
    });
  };

  if (loading) {
    return (
      <PageShell title="المشاركات النشطة" subtitle="جارٍ التحميل…">
        <p className="text-sm text-muted-foreground">لحظة من فضلك…</p>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="المشاركات النشطة"
      subtitle="ما تشاركون فيه حالياً، مرتباً حسب محطات الروتين"
    >
      <div dir="rtl" className="space-y-6 text-start">
        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            لا توجد مشاركات نشطة الآن. ابدأوا مشاركة من محطة في روتين يومكم.
          </p>
        ) : (
          groups.map(([key, list]) => {
            const station = key === "__none__" ? null : stationById.get(key);
            const part = station && isPartOfDay(station.part_of_day)
              ? partOfDayLabel[station.part_of_day]
              : null;
            return (
              <section key={key} className="space-y-3">
                <h2 className="text-lg font-bold text-foreground">
                  {station
                    ? `${station.label ?? "محطة الروتين"}${part ? ` · ${part}` : ""}`
                    : "مشاركات خارج الروتين"}
                </h2>
                <ul className="space-y-2">
                  {list.map((item) => {
                    const ctx = findOpportunityContextById(item.opportunity_id ?? "");
                    const log = logs.find(
                      (l) => l.active_participation_id === item.id,
                    );
                    const doneToday = Boolean(log?.did_participate);
                    return (
                      <li key={item.id}>
                        <Card>
                          <CardContent className="space-y-3 p-4">
                            <div>
                              <p className="text-base font-bold text-foreground">
                                {ctx?.opportunity.card?.title ??
                                  ctx?.opportunity.name ??
                                  item.opportunity_id}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {ctx ? `${ctx.domain.name} › ${ctx.event.name}` : ""}
                                {item.status === "completed"
                                  ? ` · مكتملة${
                                      item.completion_source === "routine_station"
                                        ? " عبر محطة الروتين"
                                        : ""
                                    }`
                                  : ""}
                              </p>
                            </div>

                            <label className="flex items-center gap-3 rounded-xl border border-border/70 bg-secondary/60 p-3">
                              <Checkbox
                                checked={doneToday}
                                disabled={busy}
                                onCheckedChange={async (v) => {
                                  setBusy(true);
                                  try {
                                    await setTodayLog(
                                      item.id,
                                      Boolean(v),
                                      log?.id,
                                    );
                                    setLogs(await listTodayLogs());
                                  } catch {
                                    toast.error("تعذّر حفظ سجل اليوم");
                                  } finally {
                                    setBusy(false);
                                  }
                                }}
                              />
                              <span className="text-sm font-bold text-foreground">
                                هل فعلنا هذا اليوم؟
                              </span>
                            </label>

                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => openCard(item.opportunity_id ?? "")}
                                disabled={!item.opportunity_id}
                              >
                                فتح
                              </Button>
                              {item.status === "active" && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  disabled={busy}
                                  onClick={async () => {
                                    setBusy(true);
                                    try {
                                      await completeParticipationManually(item.id);
                                      setItems(await listActiveParticipations());
                                    } finally {
                                      setBusy(false);
                                    }
                                  }}
                                >
                                  إتمام
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                onClick={async () => {
                                  setBusy(true);
                                  try {
                                    await closeParticipation(item.id);
                                    setItems(await listActiveParticipations());
                                  } finally {
                                    setBusy(false);
                                  }
                                }}
                              >
                                إغلاق
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })
        )}
      </div>

      <ParticipationCard
        open={Boolean(card)}
        onOpenChange={(o) => !o && setCard(null)}
        data={card}
      />
    </PageShell>
  );
}

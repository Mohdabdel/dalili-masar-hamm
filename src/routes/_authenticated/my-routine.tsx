import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, CheckCircle2, Plus, Trash2, X } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  ParticipationCard,
  type ParticipationCardData,
} from "@/components/ParticipationCard";
import {
  PARTS_OF_DAY,
  getAllDailyEventOptions,
  getDailyEventOption,
  getSuggestedEvents,
  isPartOfDay,
  partOfDayLabel,
  type DailyEventOption,
  type PartOfDay,
} from "@/lib/daily-events";
import { findEventById } from "@/lib/knowledge-base";
import {
  addStation,
  completeStation,
  createRoutine,
  getActiveRoutine,
  getStations,
  removeStation,
  reopenStation,
  setStationPosition,
  type FamilyRoutine,
  type RoutineStation,
} from "@/lib/family-routine";
import { startParticipation } from "@/lib/active-participations";

export const Route = createFileRoute("/_authenticated/my-routine")({
  head: () => ({
    meta: [
      { title: "روتين يومنا — دليلي" },
      {
        name: "description",
        content:
          "ابنِ روتين يومكم من الأحداث اليومية ورتّب محطاته حسب الصباح وبعد الظهر والمساء.",
      },
      { property: "og:title", content: "روتين يومنا — دليلي" },
      {
        property: "og:description",
        content: "روتين أسري يومي مبني على أحداث الحياة اليومية في دليلي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyRoutinePage,
});

function MyRoutinePage() {
  const [routine, setRoutine] = useState<FamilyRoutine | null>(null);
  const [stations, setStations] = useState<RoutineStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [pickerPart, setPickerPart] = useState<PartOfDay | null>(null);
  const [openStation, setOpenStation] = useState<RoutineStation | null>(null);

  const load = async () => {
    try {
      const r = await getActiveRoutine();
      setRoutine(r);
      setStations(r ? await getStations(r.id) : []);
    } catch (e) {
      toast.error("تعذّر تحميل الروتين");
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

  const build = async () => {
    setBusy(true);
    try {
      const r = await createRoutine();
      setRoutine(r);
      setStations([]);
    } catch {
      toast.error("تعذّر إنشاء الروتين");
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = async (part: PartOfDay, option: DailyEventOption) => {
    if (!routine) return;
    if (stations.some((s) => s.daily_event_id === option.eventId)) {
      toast.info("هذا الحدث موجود في الروتين");
      return;
    }
    setBusy(true);
    try {
      const position = stations.length
        ? Math.max(...stations.map((s) => s.position)) + 1
        : 0;
      await addStation({
        routineId: routine.id,
        dailyEventId: option.eventId,
        domainId: option.domainId,
        label: option.title,
        partOfDay: part,
        position,
      });
      setStations(await getStations(routine.id));
      toast.success("أُضيفت المحطة إلى الروتين");
    } catch {
      toast.error("تعذّر حفظ المحطة");
    } finally {
      setBusy(false);
    }
  };

  const refresh = async () => {
    if (routine) setStations(await getStations(routine.id));
  };

  const move = async (station: RoutineStation, dir: -1 | 1) => {
    const ordered = [...stations].sort((a, b) => a.position - b.position);
    const idx = ordered.findIndex((s) => s.id === station.id);
    const target = ordered[idx + dir];
    if (!target) return;
    setBusy(true);
    try {
      await setStationPosition(station.id, target.position);
      await setStationPosition(target.id, station.position);
      await refresh();
    } catch {
      toast.error("تعذّر تغيير الترتيب");
    } finally {
      setBusy(false);
    }
  };

  const grouped = useMemo(() => {
    const map: Record<PartOfDay, RoutineStation[]> = {
      morning: [],
      afternoon: [],
      evening: [],
    };
    [...stations]
      .sort((a, b) => a.position - b.position)
      .forEach((s) => {
        const p = isPartOfDay(s.part_of_day) ? s.part_of_day : "morning";
        map[p].push(s);
      });
    return map;
  }, [stations]);

  if (loading) {
    return (
      <PageShell title="روتين يومنا" subtitle="جارٍ التحميل…">
        <p className="text-sm text-muted-foreground">لحظة من فضلك…</p>
      </PageShell>
    );
  }

  if (!routine) {
    return (
      <PageShell
        title="روتين يومنا"
        subtitle="رتّبوا يومكم انطلاقاً من أحداث الحياة اليومية"
      >
        <Card>
          <CardContent className="space-y-4 p-6 text-start" dir="rtl">
            <h2 className="text-xl font-bold text-foreground">ابنِ روتين يومكم</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              اختاروا الأحداث التي تحدث فعلاً في يومكم، ورتّبوها حسب الصباح وبعد
              الظهر والمساء. يبقى الروتين محفوظاً لحسابكم وحدكم.
            </p>
            <Button onClick={build} disabled={busy} className="h-12 w-full text-base">
              ابدأ بناء الروتين
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="يومكم"
      subtitle="محطات روتين أسرتكم مرتبة حسب أجزاء اليوم"
    >
      <div dir="rtl" className="space-y-6 text-start">
        {PARTS_OF_DAY.map((part) => (
          <section key={part} className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-foreground">
                {partOfDayLabel[part]}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPickerPart(part)}
              >
                <Plus className="ms-1 h-4 w-4" />
                إضافة حدث
              </Button>
            </div>

            {grouped[part].length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                لا توجد محطات في {partOfDayLabel[part]} بعد.
              </p>
            ) : (
              <ul className="space-y-2">
                {grouped[part].map((station) => {
                  const ctx = findEventById(station.daily_event_id);
                  const count = ctx?.event.opportunities.length ?? 0;
                  return (
                    <li key={station.id}>
                      <Card>
                        <CardContent className="space-y-3 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-base font-bold text-foreground">
                                {station.label ?? ctx?.event.name ?? station.daily_event_id}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {partOfDayLabel[part]} · الترتيب {station.position + 1} ·{" "}
                                {count} فرصة مشاركة
                                {station.status === "completed" ? " · مكتملة" : ""}
                              </p>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="تحريك لأعلى"
                                disabled={busy}
                                onClick={() => move(station, -1)}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="تحريك لأسفل"
                                disabled={busy}
                                onClick={() => move(station, 1)}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="حذف المحطة"
                                disabled={busy}
                                onClick={async () => {
                                  await removeStation(station.id);
                                  await refresh();
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setOpenStation(station)}
                            >
                              عرض فرص المشاركة
                            </Button>
                            {station.status === "completed" ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                onClick={async () => {
                                  await reopenStation(station.id);
                                  await refresh();
                                }}
                              >
                                <X className="ms-1 h-4 w-4" />
                                إلغاء الإكمال
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={busy}
                                onClick={async () => {
                                  await completeStation(station.id);
                                  await refresh();
                                  toast.success("تم إكمال المحطة");
                                }}
                              >
                                <CheckCircle2 className="ms-1 h-4 w-4" />
                                إكمال المحطة
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      <EventPicker
        part={pickerPart}
        onClose={() => setPickerPart(null)}
        onPick={async (part, option) => {
          await handleAdd(part, option);
          setPickerPart(null);
        }}
      />

      <StationParticipations
        station={openStation}
        onClose={() => setOpenStation(null)}
      />
    </PageShell>
  );
}

function EventPicker({
  part,
  onClose,
  onPick,
}: {
  part: PartOfDay | null;
  onClose: () => void;
  onPick: (part: PartOfDay, option: DailyEventOption) => void;
}) {
  const [query, setQuery] = useState("");
  const suggested = useMemo(
    () => (part ? getSuggestedEvents(part) : []),
    [part],
  );
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return getAllDailyEventOptions()
      .filter((o) => o.title.includes(q) || o.domainName.includes(q))
      .slice(0, 40);
  }, [query]);

  const list = query.trim() ? results : suggested;

  return (
    <Sheet open={Boolean(part)} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto" dir="rtl">
        <SheetHeader>
          <SheetTitle className="text-start">
            إضافة حدث إلى {part ? partOfDayLabel[part] : ""}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-3 text-start">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في الأحداث اليومية"
            className="text-start"
          />
          {list.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد نتائج.</p>
          ) : (
            <ul className="space-y-2 pb-6">
              {list.map((option) => (
                <li key={option.eventId}>
                  <button
                    type="button"
                    onClick={() => part && onPick(part, option)}
                    className="w-full rounded-xl border border-border bg-card p-3 text-start transition-colors hover:border-gold"
                  >
                    <span className="block text-sm font-bold text-foreground">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {option.domainName} · {option.opportunityCount} فرصة مشاركة
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StationParticipations({
  station,
  onClose,
}: {
  station: RoutineStation | null;
  onClose: () => void;
}) {
  const [card, setCard] = useState<ParticipationCardData | null>(null);
  const [adding, setAdding] = useState<string | null>(null);
  const ctx = station ? findEventById(station.daily_event_id) : null;
  const eventOption = station ? getDailyEventOption(station.daily_event_id) : null;

  return (
    <>
      <Sheet open={Boolean(station)} onOpenChange={(o) => !o && onClose()}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="text-start">
              {eventOption?.title ?? "فرص المشاركة"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-2 pb-6 text-start">
            {!ctx || ctx.event.opportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                لا توجد فرص مشاركة منشورة لهذا الحدث.
              </p>
            ) : (
              ctx.event.opportunities.map((op) => (
                <div
                  key={op.id}
                  className="rounded-xl border border-border bg-card p-3"
                >
                  <p className="text-sm font-bold text-foreground">{op.name}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
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
                            op.levels ?? {
                              guided: "",
                              shared: "",
                              independent: "",
                            },
                          progressIndicators: op.card?.progressIndicators,
                          supportResources: op.card?.supportResources,
                          nextStep: op.card?.nextStep,
                          participationLevel: op.participationLevel,
                        })
                      }
                    >
                      فتح البطاقة
                    </Button>
                    <Button
                      size="sm"
                      disabled={adding === op.id}
                      onClick={async () => {
                        if (!station) return;
                        setAdding(op.id);
                        try {
                          await startParticipation({
                            opportunityId: op.id,
                            routineStationId: station.id,
                          });
                          toast.success("أُضيفت إلى المشاركات النشطة");
                        } catch {
                          toast.error("تعذّر بدء المشاركة");
                        } finally {
                          setAdding(null);
                        }
                      }}
                    >
                      ابدأ هذه المشاركة
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <ParticipationCard
        open={Boolean(card)}
        onOpenChange={(o) => !o && setCard(null)}
        data={card}
      />
    </>
  );
}

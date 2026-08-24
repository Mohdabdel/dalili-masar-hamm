import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUp, ArrowDown, X, Plus, Star } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabStateBoundary,
  LabNote,
  LabButton,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { getRoutineEventOptions, partOfDayLabel, PARTS_OF_DAY } from "@/lab/data/knowledge-read";
import { cadenceLabel, contextLabel } from "@/lab/state/actions";
import type { LabCadence, LabRoutineEvent, LabTimeOfDay } from "@/lab/state/types";

export const Route = createFileRoute("/lab/routine")({
  component: LabRoutinePage,
  head: labHead("روتيننا", "بناء محطات اليوم كما ترتبها الأسرة، مع محطات مشاركة اختيارية."),
});

const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

function LabRoutinePage() {
  const { state, dispatch } = useLab();
  const [adding, setAdding] = useState(false);
  const options = useMemo(() => getRoutineEventOptions(state.context), [state.context]);
  const routine = state.routine;

  const setEvents = (events: LabRoutineEvent[]) =>
    dispatch({
      type: "routine",
      value: { ...routine, events: events.map((e, i) => ({ ...e, order: i })) },
    });

  const addEvent = (eventId: string, label: string, timeOfDay: LabTimeOfDay) => {
    if (routine.events.some((e) => e.eventId === eventId)) return;
    setEvents([
      ...routine.events,
      {
        id: `re-${eventId}-${routine.events.length}`,
        eventId,
        label,
        order: routine.events.length,
        isParticipationStation: false,
        timeOfDay,
      },
    ]);
    setAdding(false);
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = [...routine.events];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setEvents(next);
  };

  return (
    <LabPage
      title="روتيننا"
      intro={`محطات ${contextLabel[state.context]} كما تحدث عندكم. رتبوها كما هي فعلاً، لا كما "يجب" أن تكون.`}
    >
      <LabStateBoundary emptyTitle="لم تبنوا روتيناً بعد" emptyHint="أضيفوا حدثاً واحداً فقط للبداية.">
        <LabSection title="كل كم يتكرر هذا الروتين؟">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(cadenceLabel) as LabCadence[]).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={routine.cadence === c}
                onClick={() => dispatch({ type: "routine", value: { ...routine, cadence: c } })}
                className={`min-h-[44px] rounded-xl border px-4 text-sm font-bold ${
                  routine.cadence === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card"
                }`}
              >
                {cadenceLabel[c]}
              </button>
            ))}
          </div>
          {routine.cadence === "specific_days" && (
            <div className="mt-3 flex flex-wrap gap-2">
              {DAYS.map((d) => {
                const on = routine.days.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      dispatch({
                        type: "routine",
                        value: {
                          ...routine,
                          days: on ? routine.days.filter((x) => x !== d) : [...routine.days, d],
                        },
                      })
                    }
                    className={`min-h-[40px] rounded-lg border px-3 text-sm ${
                      on ? "border-primary bg-primary/10 font-bold" : "border-border bg-card"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          )}
        </LabSection>

        <LabSection
          title="محطات اليوم"
          description="النجمة تعني: هذه محطة نرى فيها مكاناً للمشاركة. اختيارية تماماً."
        >
          {routine.events.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              لا توجد محطات بعد.
            </p>
          ) : (
            <ol className="space-y-2">
              {routine.events.map((e, i) => (
                <li
                  key={e.id}
                  className="flex items-center gap-2 rounded-2xl border border-border bg-card p-3"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-foreground">{e.label}</span>
                    <span className="block text-xs text-muted-foreground">
                      {partOfDayLabel[e.timeOfDay]}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`تعليم ${e.label} كمحطة مشاركة`}
                    aria-pressed={e.isParticipationStation}
                    onClick={() =>
                      setEvents(
                        routine.events.map((x) =>
                          x.id === e.id ? { ...x, isParticipationStation: !x.isParticipationStation } : x,
                        ),
                      )
                    }
                    className={`grid h-11 w-11 place-items-center rounded-xl border ${
                      e.isParticipationStation
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    <Star className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`تحريك ${e.label} للأعلى`}
                    onClick={() => move(i, -1)}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground"
                  >
                    <ArrowUp className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`تحريك ${e.label} للأسفل`}
                    onClick={() => move(i, 1)}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground"
                  >
                    <ArrowDown className="h-4 w-4" aria-hidden />
                  </button>
                  <button
                    type="button"
                    aria-label={`حذف ${e.label}`}
                    onClick={() => setEvents(routine.events.filter((x) => x.id !== e.id))}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-3">
            <LabButton variant="ghost" onClick={() => setAdding((v) => !v)}>
              <Plus className="h-4 w-4" aria-hidden />
              إضافة محطة
            </LabButton>
          </div>

          {adding && (
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto rounded-2xl border border-border p-3">
              {options.map((o) => (
                <div key={o.id} className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="font-semibold">{o.title}</span>{" "}
                    <span className="text-muted-foreground">— {o.domainName}</span>
                  </span>
                  <div className="flex gap-1">
                    {PARTS_OF_DAY.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => addEvent(o.id, o.title, p)}
                        className="min-h-[36px] rounded-lg border border-border px-2 text-xs font-semibold hover:bg-accent"
                      >
                        {partOfDayLabel[p]}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </LabSection>

        <LabSection title="محطات المشاركة" description="من هنا نكمل نحو دور صغير داخل الحدث.">
          {routine.events.filter((e) => e.isParticipationStation).length === 0 ? (
            <LabNote>لم تختاروا محطة مشاركة بعد. يمكن ترك الروتين كما هو تماماً.</LabNote>
          ) : (
            <ul className="space-y-2">
              {routine.events
                .filter((e) => e.isParticipationStation)
                .map((e) => (
                  <li key={e.id}>
                    <Link
                      to="/lab/event/$eventId"
                      params={{ eventId: e.eventId }}
                      className="flex min-h-[56px] items-center justify-between rounded-2xl border border-primary/40 bg-primary/5 px-4 text-base font-bold hover:bg-primary/10"
                    >
                      {e.label}
                      <span className="text-sm font-semibold text-primary">نرى ما يمكن مشاركته</span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}

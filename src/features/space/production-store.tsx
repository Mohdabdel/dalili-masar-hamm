// المزوّد الإنتاجي لمساحة الأسرة: نفس المخزن، لكن التخزين في Lovable Cloud (Supabase)
// مع RLS وملكية المستخدم. لا sessionStorage ولا بيانات مؤقتة.

import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  SliceCtx,
  initialSliceState,
  sliceReducer,
  type SliceAction,
  type SliceState,
} from "@/features/space/store";
import type {
  LabCardSnapshot,
  LabSupportAsset,
  LabThisTimeSelection,
  SliceFeedback,
  SliceLifecycleChoice,
} from "@/lab/slice/types";
import {
  addStation as addRoutineStation,
  createRoutine,
  getActiveRoutine,
  getStations,
  removeStation as removeRoutineStation,
} from "@/lib/family-routine";

const log = (context: string) => (error: unknown) => {
  if (error) console.error(`[space:${context}]`, error);
};

/** فشل حفظ لا يُبتلع: الأسرة تُخبَر أن التعديل لم يُحفظ. */
const failed = (context: string, message: string) => (error: unknown) => {
  if (!error) return false;
  log(context)(error);
  toast.error(message);
  return true;
};

interface Refs {
  /** specId → active_participations.id */
  participationBySpec: Record<string, string>;
  /** snapshotId → family_participation_id */
  participationBySnapshot: Record<string, string>;
  /** eventId → routine_stations.id */
  stationRowByEvent: Record<string, string>;
  routineId: string | null;
}

async function findParticipation(specId: string): Promise<string | null> {
  const { data } = await supabase
    .from("active_participations")
    .select("id")
    .eq("opportunity_id", specId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data?.id ?? null;
}

/**
 * مشاركة أسرية واحدة لكل فرصة — لا تكرار.
 * البحث أولاً، ثم الإنشاء، ثم البحث مجدداً عند تعارض الفهرس الفريد.
 */
async function ensureParticipation(
  refs: Refs,
  specId: string,
  eventId?: string,
): Promise<string | null> {
  const cached = refs.participationBySpec[specId];
  if (cached) return cached;

  const found = await findParticipation(specId);
  if (found) {
    refs.participationBySpec[specId] = found;
    await linkParticipationToStation(refs, found, eventId);
    return found;
  }

  const stationId = eventId ? (refs.stationRowByEvent[eventId] ?? null) : null;
  const { data, error } = await supabase
    .from("active_participations")
    .insert({
      opportunity_id: specId,
      daily_event_id: eventId ?? null,
      routine_station_id: stationId,
      source: "family_workspace",
      status: "active",
    })
    .select("id")
    .single();

  if (error || !data) {
    // تعارض الفهرس الفريد يعني أن المشاركة موجودة فعلاً — نستعيدها بدل إنشاء نسخة ثانية.
    const retry = await findParticipation(specId);
    if (retry) {
      refs.participationBySpec[specId] = retry;
      await linkParticipationToStation(refs, retry, eventId);
      return retry;
    }
    log("ensureParticipation")(error);
    toast.error("تعذّر فتح مشاركة الأسرة — حاولوا مرة أخرى");
    return null;
  }
  refs.participationBySpec[specId] = data.id;
  await linkParticipationToStation(refs, data.id, eventId);
  return data.id;
}

/** ربط المشاركة بمحطة الروتين — صف واحد فقط لكل (مشاركة، محطة). */
async function linkParticipationToStation(
  refs: Refs,
  participationId: string,
  eventId?: string,
): Promise<void> {
  if (!eventId) return;
  const stationId = refs.stationRowByEvent[eventId];
  if (!stationId) return;
  const { data: existing } = await supabase
    .from("participation_station_links")
    .select("id")
    .eq("family_participation_id", participationId)
    .eq("routine_station_id", stationId)
    .maybeSingle();
  if (existing) return;
  const { error } = await supabase.from("participation_station_links").insert({
    family_participation_id: participationId,
    routine_station_id: stationId,
  });
  log("stationLink")(error);
  await supabase
    .from("active_participations")
    .update({ routine_station_id: stationId })
    .eq("id", participationId)
    .is("routine_station_id", null);
}

async function ensureRoutineId(refs: Refs): Promise<string | null> {
  if (refs.routineId) return refs.routineId;
  try {
    const routine = (await getActiveRoutine()) ?? (await createRoutine());
    refs.routineId = routine.id;
    return routine.id;
  } catch (error) {
    log("ensureRoutine")(error);
    return null;
  }
}

export function ProductionSpaceProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(sliceReducer, initialSliceState);
  const [hydrated, markHydrated] = useReducer(() => true, false);
  const refs = useRef<Refs>({
    participationBySpec: {},
    participationBySnapshot: {},
    stationRowByEvent: {},
    routineId: null,
  });

  // ---------- تحميل حالة الأسرة من قاعدة البيانات ----------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return;

      const [participations, snapshots, drafts, cardStates, runs, feedback, assets] =
        await Promise.all([
          supabase
            .from("active_participations")
            .select("id, opportunity_id, lifecycle_choice, status"),

          supabase
            .from("participation_snapshots")
            .select("id, family_participation_id, snapshot_data, version_number, approved_at")
            .order("version_number", { ascending: true }),
          supabase.from("participation_drafts").select("spec_id, selection"),
          supabase.from("participation_card_states").select("snapshot_id, closed"),
          supabase
            .from("participation_runs")
            .select("id, snapshot_id, started_at, ended_at")
            .order("started_at", { ascending: false }),

          supabase
            .from("participation_feedback")
            .select("snapshot_id, log_date, tone, reasons")
            .order("created_at", { ascending: false }),
          supabase
            .from("family_support_assets")
            .select("id, spec_id, snapshot_id, type, label, items, config, created_at")
            .order("created_at", { ascending: false }),
        ]);

      if (cancelled) return;

      const next: SliceState = { ...initialSliceState };

      for (const row of participations.data ?? []) {
        refs.current.participationBySpec[row.opportunity_id] = row.id;
        if (row.lifecycle_choice) {
          next.lifecycleBySpec[row.opportunity_id] = row.lifecycle_choice as SliceLifecycleChoice;
        }
        if (row.status === "closed") next.closedSpecs.push(row.opportunity_id);
      }


      next.snapshots = (snapshots.data ?? []).map((row) => {
        refs.current.participationBySnapshot[row.id] = row.family_participation_id;
        const snap = row.snapshot_data as unknown as LabCardSnapshot;
        return { ...snap, id: row.id, version: row.version_number };
      });

      for (const row of drafts.data ?? []) {
        next.selections[row.spec_id] = row.selection as unknown as LabThisTimeSelection;
      }

      next.closedCards = (cardStates.data ?? [])
        .filter((r) => r.closed)
        .map((r) => r.snapshot_id);

      next.runs = (runs.data ?? []).map((r) => ({
        id: r.id,
        snapshotId: r.snapshot_id,
        date: String(r.started_at).slice(0, 10),
        startedAt: String(r.started_at),
        endedAt: r.ended_at ? String(r.ended_at) : undefined,
      }));


      next.feedback = (feedback.data ?? []).map((r) => ({
        snapshotId: r.snapshot_id,
        date: r.log_date,
        tone: r.tone,
        reasons: (r.reasons as unknown as string[]) ?? [],
      })) as SliceFeedback[];

      next.supportAssets = (assets.data ?? []).map((r) => ({
        id: r.id,
        type: r.type,
        label_ar: r.label,
        specId: r.spec_id,
        snapshotId: r.snapshot_id ?? undefined,
        createdAt: String(r.created_at).slice(0, 10),
        items: (r.items as unknown as string[]) ?? [],
        config: (r.config as unknown as LabSupportAsset["config"]) ?? undefined,
      })) as LabSupportAsset[];

      // محطات الأسرة من الروتين الفعلي
      try {
        const routine = await getActiveRoutine();
        if (routine) {
          refs.current.routineId = routine.id;
          const stations = await getStations(routine.id);
          for (const s of stations) refs.current.stationRowByEvent[s.daily_event_id] = s.id;
          next.stations = stations.map((s) => s.daily_event_id);
        }
      } catch (error) {
        log("loadStations")(error);
      }

      if (!cancelled) {
        rawDispatch({ type: "hydrate", value: next });
        markHydrated();
      }
    })()
      .catch(log("load"))
      .finally(() => {
        if (!cancelled) markHydrated();
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- الحفظ ----------
  const persist = useCallback(async (action: SliceAction, snapshotState: SliceState) => {
    const r = refs.current;
    switch (action.type) {
      case "selection": {
        const sel = action.value;
        await supabase
          .from("participation_drafts")
          .upsert(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { spec_id: sel.specId, selection: sel as any },
            { onConflict: "user_id,spec_id" },
          )
          .then(({ error }) => log("draft")(error));
        break;
      }
      case "snapshot": {
        const snap = action.value;
        const participationId = await ensureParticipation(
          r,
          snap.participationSpecId,
          snap.eventId,
        );
        if (!participationId) return;
        const { error } = await supabase.from("participation_snapshots").insert({
          id: snap.id,
          family_participation_id: participationId,
          version_number: snap.version,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          snapshot_data: snap as any,
        });
        log("snapshot")(error);
        r.participationBySnapshot[snap.id] = participationId;
        break;
      }
      case "run.start": {
        // بدء التنفيذ يفتح Run جديدة فقط — لا يُنشئ مشاركة أسرية جديدة أبداً.
        const snap = snapshotState.snapshots.find((s) => s.id === action.snapshotId);
        let participationId = r.participationBySnapshot[action.snapshotId] ?? null;
        if (!participationId && snap) {
          participationId = r.participationBySpec[snap.participationSpecId] ?? null;
          if (!participationId) {
            const { data } = await supabase
              .from("active_participations")
              .select("id")
              .eq("opportunity_id", snap.participationSpecId)
              .maybeSingle();
            if (data) {
              participationId = data.id;
              r.participationBySpec[snap.participationSpecId] = data.id;
            }
          }
          if (participationId) r.participationBySnapshot[action.snapshotId] = participationId;
        }
        if (!participationId) return;
        const { error } = await supabase.from("participation_runs").insert({
          id: action.runId,
          family_participation_id: participationId,
          snapshot_id: action.snapshotId,
        });
        log("runStart")(error);
        break;
      }
      case "run.end": {
        // «انتهينا» تُغلق هذه المرة فقط — البطاقة والمشاركة تبقيان كما هما.
        const { error } = await supabase
          .from("participation_runs")
          .update({ ended_at: new Date().toISOString() })
          .eq("id", action.runId)
          .is("ended_at", null);
        log("runEnd")(error);
        break;
      }
      case "participation.close":
      case "participation.reopen": {
        const participationId = r.participationBySpec[action.specId];
        if (!participationId) return;
        const closing = action.type === "participation.close";
        const { error } = await supabase
          .from("active_participations")
          .update({
            status: closing ? "closed" : "active",
            closed_at: closing ? new Date().toISOString() : null,
          })
          .eq("id", participationId);
        log("participationState")(error);
        break;
      }

      case "card.close":
      case "card.reopen": {
        const { error } = await supabase.from("participation_card_states").upsert(
          {
            snapshot_id: action.snapshotId,
            closed: action.type === "card.close",
          },
          { onConflict: "user_id,snapshot_id" },
        );
        log("cardState")(error);
        break;
      }
      case "feedback": {
        const { error } = await supabase.from("participation_feedback").insert({
          snapshot_id: action.value.snapshotId,
          log_date: action.value.date,
          tone: action.value.tone,
          reasons: action.value.reasons,
        });
        log("feedback")(error);
        break;
      }
      case "lifecycle": {
        const participationId = await ensureParticipation(r, action.specId);
        if (!participationId) return;
        const { error } = await supabase
          .from("active_participations")
          .update({ lifecycle_choice: action.value })
          .eq("id", participationId);
        log("lifecycle")(error);
        break;
      }
      case "support.add": {
        const a = action.value;
        const { error } = await supabase.from("family_support_assets").insert({
          id: a.id,
          spec_id: a.specId,
          type: a.type,
          label: a.label_ar,
          items: a.items,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: (a.config ?? {}) as any,
        });
        log("supportAdd")(error);
        break;
      }
      case "support.remove": {
        const { error } = await supabase
          .from("family_support_assets")
          .delete()
          .eq("id", action.id);
        log("supportRemove")(error);
        break;
      }
      case "station.add": {
        const routineId = await ensureRoutineId(r);
        if (!routineId || r.stationRowByEvent[action.eventId]) return;
        try {
          await addRoutineStation({
            routineId,
            dailyEventId: action.eventId,
            partOfDay: "morning",
            position: Object.keys(r.stationRowByEvent).length,
          });
          const stations = await getStations(routineId);
          for (const s of stations) r.stationRowByEvent[s.daily_event_id] = s.id;
        } catch (error) {
          log("stationAdd")(error);
        }
        break;
      }
      case "station.remove": {
        const rowId = r.stationRowByEvent[action.eventId];
        if (!rowId) return;
        try {
          await removeRoutineStation(rowId);
          delete r.stationRowByEvent[action.eventId];
        } catch (error) {
          log("stationRemove")(error);
        }
        break;
      }
      default:
        break;
    }
  }, []);

  const stateRef = useRef(state);
  stateRef.current = state;

  const dispatch = useCallback(
    (action: SliceAction) => {
      // معرّف دائم للنسخة المجمّدة (uuid) قبل الحفظ.
      const prepared: SliceAction =
        action.type === "snapshot"
          ? {
              ...action,
              value: {
                ...action.value,
                id:
                  typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : action.value.id,
              },
            }
          : action.type === "support.add"
            ? {
                ...action,
                value: {
                  ...action.value,
                  id:
                    typeof crypto !== "undefined" && "randomUUID" in crypto
                      ? crypto.randomUUID()
                      : action.value.id,
                },
              }
            : action;

      rawDispatch(prepared);
      void persist(prepared, stateRef.current);
    },
    [persist],
  );

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  // لا نعرض المساحة قبل استرجاع بيانات الأسرة، حتى لا تُستبدل مسودة محفوظة بمسودة جديدة.
  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10" role="status" aria-live="polite">
        <span className="sr-only">جارٍ فتح مساحة الأسرة</span>
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return <SliceCtx.Provider value={value}>{children}</SliceCtx.Provider>;
}

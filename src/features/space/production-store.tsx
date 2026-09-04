// المزوّد الإنتاجي لمساحة الأسرة: نفس المخزن، لكن التخزين في Lovable Cloud (Supabase)
// مع RLS وملكية المستخدم. لا sessionStorage ولا بيانات مؤقتة.

import { useCallback, useEffect, useMemo, useReducer, useRef, type ReactNode } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { resolveSession } from "@/lib/auth-session";
import {
  SliceCtx,
  initialSliceState,
  sliceReducer,
  type SliceAction,
  type SliceState,
} from "@/features/space/store";
import type {
  LabCardSnapshot,
  LabParticipationImage,
  LabSupportAsset,
  LabThisTimeSelection,
  SliceFeedback,
  SliceLifecycleChoice,
} from "@/lab/slice/types";
import { buildFamilyParticipationRow } from "@/lib/family-participation";
import { familySpecId, isFamilySpecId, participationIdFromFamilySpecId } from "@/lib/entry/family-spec";
import {
  addStation as addRoutineStation,
  createRoutine,
  getActiveRoutine,
  getStations,
  removeStation as removeRoutineStation,
} from "@/lib/family-routine";

/** نطاق مخصص لصورة المشاركة داخل مرفقات الأسرة — مفصول عن الدعم وعن صور الكتل. */
const PARTICIPATION_IMAGE_SCOPE = "participation_image";

function encodeParticipationImage(image: LabParticipationImage): string {
  return image.source === "family_upload"
    ? `upload:${image.uploadedPath ?? ""}`
    : `asset:${image.assetCode ?? ""}`;
}

function decodeParticipationImage(raw: string | null): LabParticipationImage | null {
  if (!raw) return null;
  if (raw.startsWith("upload:")) {
    return { source: "family_upload", uploadedPath: raw.slice(7) };
  }
  if (raw.startsWith("asset:")) {
    return { source: "family_library", assetCode: raw.slice(6) };
  }
  return null;
}

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
  /** مرات تنفيذ بدأت فعلاً في هذه الجلسة — تمنع أي إدراج مكرر لنفس runId. */
  startedRuns: Set<string>;
}

async function findParticipation(specId: string): Promise<string | null> {
  // مشاركة تملكها الأسرة: المعرّف نفسه محفور في مفتاح المواصفة — لا بحث بمرجع.
  const owned = participationIdFromFamilySpecId(specId);
  if (owned) {
    const { data } = await supabase
      .from("active_participations")
      .select("id")
      .eq("id", owned)
      .maybeSingle();
    return data?.id ?? null;
  }
  const { data } = await supabase
    .from("active_participations")
    .select("id")
    .eq("reference_spec_id", specId)
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

  // لا تُنشأ مشاركة مرجعية بديلة لمشاركة تملكها الأسرة (بداية سهلة / أخطط بنفسي).
  if (isFamilySpecId(specId)) return null;

  const stationId = eventId ? (refs.stationRowByEvent[eventId] ?? null) : null;
  // هوية المشاركة تُولَّد للأسرة؛ specId يُخزَّن كإثبات مصدر مرجعي فقط.
  const { data, error } = await supabase
    .from("active_participations")
    .insert(
      buildFamilyParticipationRow({
        origin: "reference",
        reference: { specId, source: "legacy_master" },
        dailyEventId: eventId ?? null,
        routineStationId: stationId,
      }),
    )
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
    startedRuns: new Set<string>(),
  });

  // ---------- تحميل حالة الأسرة من قاعدة البيانات ----------
  useEffect(() => {
    let cancelled = false;

    (async () => {
      // لا قراءة مملوكة للمستخدم قبل حسم الجلسة (يمنع 401 عند إعادة التحميل).
      const session = await resolveSession();
      if (!session) return;

      const [participations, snapshots, drafts, cardStates, runs, feedback, assets, participationImages] =
        await Promise.all([
          supabase
            .from("active_participations")
            .select("id, opportunity_id, origin, reference_spec_id, lifecycle_choice, status"),

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
            .select("snapshot_id, run_id, log_date, tone, reasons")
            .order("created_at", { ascending: false }),
          supabase
            .from("family_support_assets")
            .select("id, spec_id, snapshot_id, type, label, items, config, created_at")
            .order("created_at", { ascending: false }),
          // صورة المشاركة ككل — مخزّنة بمعرّف المشاركة الأسرية، بلا حاجة لأي معرّف مكتبة.
          supabase
            .from("resource_attachments")
            .select("ref_id, external_url, label, created_at")
            .eq("scope", PARTICIPATION_IMAGE_SCOPE)
            .order("created_at", { ascending: false }),
        ]);

      if (cancelled) return;

      const next: SliceState = { ...initialSliceState };

      for (const row of participations.data ?? []) {
        // الهوية القانونية هي row.id؛ specId مجرد مفتاح توافق للمشاركات المرجعية.
        const specKey =
          row.origin === "reference"
            ? (row.reference_spec_id ?? row.opportunity_id)
            : familySpecId(row.id);
        if (!specKey) continue;
        refs.current.participationBySpec[specKey] = row.id;
        if (row.lifecycle_choice) {
          next.lifecycleBySpec[specKey] = row.lifecycle_choice as SliceLifecycleChoice;
        }
        if (row.status === "closed") next.closedSpecs.push(specKey);
      }


      next.snapshots = (snapshots.data ?? []).map((row) => {
        refs.current.participationBySnapshot[row.id] = row.family_participation_id;
        const snap = row.snapshot_data as unknown as LabCardSnapshot;
        return { ...snap, id: row.id, version: row.version_number };
      });

      for (const row of drafts.data ?? []) {
        next.selections[row.spec_id] = row.selection as unknown as LabThisTimeSelection;
      }

      // مفتاح العرض يُشتق من هوية المشاركة، لا العكس.
      const specByParticipation: Record<string, string> = {};
      for (const [specKey, id] of Object.entries(refs.current.participationBySpec)) {
        specByParticipation[id] = specKey;
      }
      for (const row of participationImages.data ?? []) {
        const specKey = specByParticipation[row.ref_id];
        if (!specKey || specKey in next.participationImages) continue;
        const image = decodeParticipationImage(row.external_url);
        if (image) next.participationImages[specKey] = image;
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
        runId: r.run_id ?? undefined,
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
        // الصفوف الأقدم لا تحمل فئة معلنة — تُحسم عند العرض عبر حدّ التوافق.
        categoryId: (r.config as { categoryId?: string } | null)?.categoryId,
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
          .then(({ error }) => failed("draft", "تعذّر حفظ التعديل")(error));
        break;
      }
      case "snapshot": {
        const snap = action.value;
        const participationId = await ensureParticipation(
          r,
          snap.participationSpecId,
          snap.eventId,
        );
        if (!participationId) {
          rawDispatch({ type: "snapshot.revert", snapshotId: snap.id });
          return;
        }

        // رقم النسخة يُحسم من قاعدة البيانات لا من الحالة المحلية (تبويبان أو نقر مزدوج).
        const nextVersion = async () => {
          const { data } = await supabase
            .from("participation_snapshots")
            .select("version_number")
            .eq("family_participation_id", participationId)
            .order("version_number", { ascending: false })
            .limit(1)
            .maybeSingle();
          return (data?.version_number ?? 0) + 1;
        };

        let version = await nextVersion();
        let lastError: unknown = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const { error } = await supabase.from("participation_snapshots").insert({
            id: snap.id,
            family_participation_id: participationId,
            version_number: version,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            snapshot_data: { ...snap, version } as any,
          });
          if (!error) {
            lastError = null;
            break;
          }
          lastError = error;
          version = await nextVersion();
        }

        if (lastError) {
          log("snapshot")(lastError);
          toast.error("تعذّر اعتماد البطاقة — لم تُحفظ بعد");
          rawDispatch({ type: "snapshot.revert", snapshotId: snap.id });
          return;
        }

        if (version !== snap.version) {
          rawDispatch({ type: "snapshot.version", snapshotId: snap.id, version });
        }
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
            const found = await findParticipation(snap.participationSpecId);
            if (found) {
              participationId = found;
              r.participationBySpec[snap.participationSpecId] = found;
            }
          }
          if (participationId) r.participationBySnapshot[action.snapshotId] = participationId;
        }
        if (!participationId) return;
        // إدراج واحد فقط لكل runId مهما تكرر تنفيذ الـeffect.
        if (r.startedRuns.has(action.runId)) return;
        r.startedRuns.add(action.runId);
        const { error } = await supabase.from("participation_runs").upsert(
          {
            id: action.runId,
            family_participation_id: participationId,
            snapshot_id: action.snapshotId,
          },
          { onConflict: "id", ignoreDuplicates: true },
        );
        if (error) r.startedRuns.delete(action.runId);
        failed("runStart", "تعذّر بدء هذه المرة")(error);
        break;
      }
      case "run.end": {
        // «انتهينا» تُغلق هذه المرة فقط — البطاقة والمشاركة تبقيان كما هما.
        const { error } = await supabase
          .from("participation_runs")
          .update({ ended_at: new Date().toISOString() })
          .eq("id", action.runId)
          .is("ended_at", null);
        failed("runEnd", "تعذّر إغلاق هذه المرة")(error);
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
        failed("participationState", "تعذّر تحديث حالة المشاركة")(error);
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
        failed("cardState", "تعذّر تحديث حالة البطاقة")(error);
        break;
      }
      case "feedback": {
        const { error } = await supabase.from("participation_feedback").insert({
          snapshot_id: action.value.snapshotId,
          run_id: action.value.runId ?? null,
          log_date: action.value.date,
          tone: action.value.tone,
          reasons: action.value.reasons,
        });
        failed("feedback", "تعذّر حفظ الانطباع")(error);
        break;
      }
      case "lifecycle": {
        const participationId = await ensureParticipation(r, action.specId);
        if (!participationId) return;
        const { error } = await supabase
          .from("active_participations")
          .update({ lifecycle_choice: action.value })
          .eq("id", participationId);
        failed("lifecycle", "تعذّر حفظ اختياركم")(error);
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
          // فئة الدعم تُحفظ داخل config — إضافة غير هادمة بلا تغيير مخطط.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          config: { ...(a.config ?? {}), categoryId: a.categoryId } as any,
        });
        failed("supportAdd", "تعذّر حفظ وسيلة الدعم")(error);
        break;
      }
      case "participationImage.set": {
        // الهوية القانونية للصورة هي معرّف المشاركة الأسرية — لا specId ولا KB-*.
        const participationId = await ensureParticipation(r, action.specId);
        if (!participationId) return;
        await supabase
          .from("resource_attachments")
          .delete()
          .eq("scope", PARTICIPATION_IMAGE_SCOPE)
          .eq("ref_id", participationId);
        if (!action.value) break;
        const { error } = await supabase.from("resource_attachments").insert({
          scope: PARTICIPATION_IMAGE_SCOPE,
          ref_id: participationId,
          external_url: encodeParticipationImage(action.value),
          label: "صورة المشاركة",
        });
        failed("participationImage", "تعذّر حفظ صورة المشاركة")(error);
        break;
      }
      case "support.remove": {
        const { error } = await supabase
          .from("family_support_assets")
          .delete()
          .eq("id", action.id);
        failed("supportRemove", "تعذّر حذف وسيلة الدعم")(error);
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
            position: (await getStations(routineId)).length,
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

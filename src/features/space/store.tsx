// المخزن المشترك لمساحة الأسرة (Vertical Slice المثبت).
// نفس النموذج يعمل خلف مزوّدين: تجريبي (sessionStorage داخل Lab) وإنتاجي (Supabase).

import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from "react";
import { Link } from "@tanstack/react-router";
import type {
  LabCardSnapshot,
  LabParticipationImage,
  LabSupportAsset,
  LabThisTimeSelection,
  SliceFeedback,
  SliceLevel,
  SliceLifecycleChoice,
} from "@/lab/slice/types";

export interface SliceState {
  levelByEvent: Record<string, SliceLevel>;
  selections: Record<string, LabThisTimeSelection>;
  snapshots: LabCardSnapshot[];
  feedback: SliceFeedback[];
  lifecycleBySpec: Record<string, SliceLifecycleChoice>;
  /** محطات هذه الأسرة (معرفات أحداث من مكتبة الحياة). */
  stations: string[];
  /** محطات افتراضية أزالتها الأسرة. */
  removedStations: string[];
  /** بطاقات أُغلقت — لا تعني اكتمال المشاركة كلها. */
  closedCards: string[];
  /** سجل التنفيذ: كل مرة فُتحت فيها البطاقة للتنفيذ (Run). بلا إتقان ولا تقدّم. */
  runs: { id: string; snapshotId: string; date: string; startedAt: string; endedAt?: string }[];
  /** مشاركات أسرية أُغلقت — السجل يبقى محفوظاً. */
  closedSpecs: string[];
  /** مخرجات دعم مستقلة. */
  supportAssets: LabSupportAsset[];
  /**
   * صورة المشاركة ككل. المفتاح هنا مفتاح عرض (specId)،
   * أما التخزين القانوني فبمعرّف المشاركة الأسرية نفسه (active_participations.id).
   */
  participationImages: Record<string, LabParticipationImage | null>;
}

export const initialSliceState: SliceState = {
  levelByEvent: {},
  selections: {},
  snapshots: [],
  feedback: [],
  lifecycleBySpec: {},
  stations: [],
  removedStations: [],
  closedCards: [],
  closedSpecs: [],
  runs: [],
  supportAssets: [],
  participationImages: {},

};

export type SliceAction =
  | { type: "hydrate"; value: SliceState }
  | { type: "level"; eventId: string; value: SliceLevel }
  | { type: "selection"; value: LabThisTimeSelection }
  | { type: "snapshot"; value: LabCardSnapshot }
  | { type: "feedback"; value: SliceFeedback }
  | { type: "lifecycle"; specId: string; value: SliceLifecycleChoice }
  | { type: "station.add"; eventId: string }
  | { type: "station.remove"; eventId: string }
  | { type: "card.close"; snapshotId: string }
  | { type: "card.reopen"; snapshotId: string }
  | { type: "run.start"; runId: string; snapshotId: string }
  | { type: "run.end"; runId: string }
  | { type: "participation.close"; specId: string }
  | { type: "participation.reopen"; specId: string }

  | { type: "support.add"; value: LabSupportAsset }
  | { type: "support.remove"; id: string }
  | { type: "participationImage.set"; specId: string; value: LabParticipationImage | null }
  /** تصحيح رقم النسخة بعد الحفظ الفعلي (المصدر النهائي لرقم النسخة هو قاعدة البيانات). */
  | { type: "snapshot.version"; snapshotId: string; version: number }
  /** تراجع محلي عن اعتماد لم يُحفظ فعلياً. */
  | { type: "snapshot.revert"; snapshotId: string }
  | { type: "reset" };

export function sliceReducer(state: SliceState, action: SliceAction): SliceState {
  switch (action.type) {
    case "hydrate":
      return { ...initialSliceState, ...action.value };
    case "station.add":
      return {
        ...state,
        stations: state.stations.includes(action.eventId)
          ? state.stations
          : [...state.stations, action.eventId],
        removedStations: state.removedStations.filter((id) => id !== action.eventId),
      };
    case "station.remove":
      return {
        ...state,
        stations: state.stations.filter((id) => id !== action.eventId),
        removedStations: state.removedStations.includes(action.eventId)
          ? state.removedStations
          : [...state.removedStations, action.eventId],
      };
    case "card.close":
      return {
        ...state,
        closedCards: state.closedCards.includes(action.snapshotId)
          ? state.closedCards
          : [...state.closedCards, action.snapshotId],
      };
    case "card.reopen":
      return { ...state, closedCards: state.closedCards.filter((id) => id !== action.snapshotId) };
    case "run.start": {
      if (state.runs.some((r) => r.id === action.runId)) return state;
      const now = new Date().toISOString();
      return {
        ...state,
        runs: [
          {
            id: action.runId,
            snapshotId: action.snapshotId,
            date: now.slice(0, 10),
            startedAt: now,
          },
          ...state.runs,
        ],
      };
    }
    case "run.end":
      return {
        ...state,
        runs: state.runs.map((r) =>
          r.id === action.runId && !r.endedAt ? { ...r, endedAt: new Date().toISOString() } : r,
        ),
      };
    case "participation.close":
      return {
        ...state,
        closedSpecs: state.closedSpecs.includes(action.specId)
          ? state.closedSpecs
          : [...state.closedSpecs, action.specId],
      };
    case "participation.reopen":
      return { ...state, closedSpecs: state.closedSpecs.filter((id) => id !== action.specId) };

    case "support.add":
      return { ...state, supportAssets: [action.value, ...state.supportAssets] };
    case "support.remove":
      return { ...state, supportAssets: state.supportAssets.filter((a) => a.id !== action.id) };
    case "participationImage.set":
      return {
        ...state,
        participationImages: { ...state.participationImages, [action.specId]: action.value },
      };
    case "level":
      return { ...state, levelByEvent: { ...state.levelByEvent, [action.eventId]: action.value } };
    case "selection":
      return {
        ...state,
        selections: { ...state.selections, [action.value.specId]: action.value },
      };
    case "snapshot":
      // البطاقات السابقة تبقى كما هي؛ الاعتماد الجديد يضيف نسخة أعلى فقط.
      return { ...state, snapshots: [...state.snapshots, action.value] };
    case "snapshot.version":
      return {
        ...state,
        snapshots: state.snapshots.map((s) =>
          s.id === action.snapshotId ? { ...s, version: action.version } : s,
        ),
      };
    case "snapshot.revert":
      return {
        ...state,
        snapshots: state.snapshots.filter((s) => s.id !== action.snapshotId),
      };
    case "feedback":
      return { ...state, feedback: [action.value, ...state.feedback] };
    case "lifecycle":
      return {
        ...state,
        lifecycleBySpec: { ...state.lifecycleBySpec, [action.specId]: action.value },
      };
    case "reset":
      return initialSliceState;
    default:
      return state;
  }
}

export interface SliceStore {
  state: SliceState;
  dispatch: (a: SliceAction) => void;
}

export const SliceCtx = createContext<SliceStore | null>(null);

export function useSlice(): SliceStore {
  const ctx = useContext(SliceCtx);
  if (!ctx) throw new Error("useSlice must be used inside a space store provider");
  return ctx;
}

export function useSliceHelpers() {
  const { state, dispatch } = useSlice();

  const selectionFor = useCallback(
    (specId: string): LabThisTimeSelection =>
      state.selections[specId] ?? {
        specId,
        selected: [],
        chosenExecutionOptionByStepId: {},
        supportTools: [],
        familyTextByStepId: {},
        visualByStepId: {},
        textOnlyStepIds: [],
        drafted: false,
      },
    [state.selections],
  );

  const snapshotById = useCallback(
    (id: string) => state.snapshots.find((s) => s.id === id) ?? null,
    [state.snapshots],
  );

  const snapshotsFor = useCallback(
    (specId: string) => state.snapshots.filter((s) => s.participationSpecId === specId),
    [state.snapshots],
  );

  const supportAssetsFor = useCallback(
    (specId: string) => state.supportAssets.filter((a) => a.specId === specId),
    [state.supportAssets],
  );

  return { state, dispatch, selectionFor, snapshotById, snapshotsFor, supportAssetsFor };
}

/** جذر المسار الحالي: "/lab/slice" للنموذج التجريبي أو "/space" للإنتاج. */
const BaseCtx = createContext<string>("/space");
export const SpaceBaseProvider = BaseCtx.Provider;
export function useSpaceBase(): string {
  return useContext(BaseCtx);
}

/** رابط داخل مساحة الأسرة — يحترم جذر المسار الحالي. */
export function SpaceLink({
  to,
  params,
  className,
  children,
}: {
  to: string;
  params?: Record<string, string>;
  className?: string;
  children: ReactNode;
}) {
  const base = useSpaceBase();
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={`${base}${to}` as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      params={params as any}
      className={className}
    >
      {children}
    </Link>
  );
}

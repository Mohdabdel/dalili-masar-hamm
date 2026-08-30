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
  /** سجل التنفيذ: متى فُتحت البطاقة للتنفيذ. */
  runs: { snapshotId: string; date: string }[];
  /** مخرجات دعم مستقلة. */
  supportAssets: LabSupportAsset[];
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
  runs: [],
  supportAssets: [],
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
  | { type: "run"; snapshotId: string }
  | { type: "support.add"; value: LabSupportAsset }
  | { type: "support.remove"; id: string }
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
    case "run":
      return {
        ...state,
        runs: [
          { snapshotId: action.snapshotId, date: new Date().toISOString().slice(0, 10) },
          ...state.runs,
        ],
      };
    case "support.add":
      return { ...state, supportAssets: [action.value, ...state.supportAssets] };
    case "support.remove":
      return { ...state, supportAssets: state.supportAssets.filter((a) => a.id !== action.id) };
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

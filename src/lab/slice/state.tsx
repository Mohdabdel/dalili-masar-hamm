// حالة الـVertical Slice: في الذاكرة + sessionStorage فقط. لا Supabase ولا كتابة خارجية.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type {
  LabCardSnapshot,
  LabThisTimeSelection,
  SliceFeedback,
  SliceLevel,
  SliceLifecycleChoice,
} from "@/lab/slice/types";

const KEY = "dalili-lab-slice-v1";

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
}

const initial: SliceState = {
  levelByEvent: {},
  selections: {},
  snapshots: [],
  feedback: [],
  lifecycleBySpec: {},
  stations: [],
  removedStations: [],
  closedCards: [],
  runs: [],
};

type Action =
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
  | { type: "reset" };

function reducer(state: SliceState, action: Action): SliceState {
  switch (action.type) {
    case "hydrate":
      return { ...initial, ...action.value };
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
      return initial;
    default:
      return state;
  }
}

interface SliceStore {
  state: SliceState;
  dispatch: (a: Action) => void;
}

const Ctx = createContext<SliceStore | null>(null);

export function SliceStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const [hydrated, markHydrated] = useReducer(() => true, false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) dispatch({ type: "hydrate", value: JSON.parse(raw) as SliceState });
    } catch {
      /* التجربة لا تعتمد على التخزين */
    }
    markHydrated();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* تجاهل */
    }
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSlice(): SliceStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSlice must be used inside SliceStateProvider");
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

  return { state, dispatch, selectionFor, snapshotById, snapshotsFor };
}

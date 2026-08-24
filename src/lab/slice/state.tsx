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
}

const initial: SliceState = {
  levelByEvent: {},
  selections: {},
  snapshots: [],
  feedback: [],
  lifecycleBySpec: {},
};

type Action =
  | { type: "hydrate"; value: SliceState }
  | { type: "level"; eventId: string; value: SliceLevel }
  | { type: "selection"; value: LabThisTimeSelection }
  | { type: "snapshot"; value: LabCardSnapshot }
  | { type: "feedback"; value: SliceFeedback }
  | { type: "lifecycle"; specId: string; value: SliceLifecycleChoice }
  | { type: "reset" };

function reducer(state: SliceState, action: Action): SliceState {
  switch (action.type) {
    case "hydrate":
      return { ...initial, ...action.value };
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

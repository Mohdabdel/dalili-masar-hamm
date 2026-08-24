// حالة النموذج التجريبي: في الذاكرة + sessionStorage فقط.
// لا كتابة إلى أي خدمة خارجية، ولا أي اشتقاق تقييمي من البيانات.

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
  LabCard,
  LabContext as LabCtx,
  LabFeedback,
  LabLevel,
  LabLifecycleState,
  LabMode,
  LabParticipation,
  LabPhase,
  LabRoutine,
  LabSetup,
  LabState,
  LabTimeOfDay,
  LabTone,
  LabUiState,
} from "@/lab/state/types";
import { baseState, buildScenario } from "@/lab/state/scenarios";

const STORAGE_KEY = "dalili-lab-v1";

type Action =
  | { type: "reset" }
  | { type: "scenario"; id: string }
  | { type: "uiState"; value: LabUiState }
  | { type: "timeOfDay"; value: LabTimeOfDay }
  | { type: "context"; value: LabCtx }
  | { type: "mode"; value: LabMode }
  | { type: "path"; value: { stationId?: string; phase?: LabPhase; componentId?: string; level?: LabLevel } }
  | { type: "routine"; value: LabRoutine }
  | { type: "participation.upsert"; value: LabParticipation }
  | { type: "participation.lifecycle"; id: string; value: LabLifecycleState; stable?: boolean }
  | { type: "setup"; participationId: string; value: Partial<LabSetup> }
  | { type: "card.upsert"; value: LabCard }
  | { type: "card.approve"; id: string }
  | { type: "run.step"; cardId: string; stepIndex: number }
  | { type: "run.finish"; cardId: string; participationId: string }
  | { type: "feedback"; value: LabFeedback }
  | { type: "weaving.add"; text: string }
  | { type: "weaving.clear" }
  | { type: "suggestion.accept"; id: string };

function reducer(state: LabState, action: Action): LabState {
  switch (action.type) {
    case "reset":
      return baseState();
    case "scenario":
      return buildScenario(action.id);
    case "uiState":
      return { ...state, uiState: action.value };
    case "timeOfDay":
      return { ...state, timeOfDay: action.value };
    case "context":
      return { ...state, context: action.value, path: {} };
    case "mode":
      return { ...state, mode: action.value };
    case "path":
      return { ...state, path: { ...state.path, ...action.value } };
    case "routine":
      return { ...state, routine: action.value };
    case "participation.upsert": {
      const others = state.participations.filter((p) => p.id !== action.value.id);
      return { ...state, participations: [action.value, ...others] };
    }
    case "participation.lifecycle":
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.id
            ? {
                ...p,
                lifecycle: action.value,
                stableInRoutine: action.stable ?? p.stableInRoutine,
              }
            : p,
        ),
      };
    case "setup": {
      const current = state.setups[action.participationId] ?? {
        priorSteps: [],
        supports: [],
      };
      return {
        ...state,
        setups: {
          ...state.setups,
          [action.participationId]: { ...current, ...action.value },
        },
      };
    }
    case "card.upsert": {
      const others = state.cards.filter((c) => c.id !== action.value.id);
      return { ...state, cards: [...others, action.value] };
    }
    case "card.approve":
      return {
        ...state,
        cards: state.cards.map((c) =>
          c.id === action.id ? { ...c, approvedAt: new Date().toISOString().slice(0, 10) } : c,
        ),
      };
    case "run.step": {
      const date = new Date().toISOString().slice(0, 10);
      const existing = state.runs.find((r) => r.cardId === action.cardId && r.date === date);
      const run = existing ?? { cardId: action.cardId, date, completedSteps: [] };
      const completedSteps = run.completedSteps.includes(action.stepIndex)
        ? run.completedSteps
        : [...run.completedSteps, action.stepIndex];
      const others = state.runs.filter((r) => !(r.cardId === action.cardId && r.date === date));
      return { ...state, runs: [...others, { ...run, completedSteps }] };
    }
    case "run.finish": {
      const date = new Date().toISOString().slice(0, 10);
      return {
        ...state,
        participations: state.participations.map((p) =>
          p.id === action.participationId
            ? { ...p, timesShared: p.timesShared + 1, lastSharedAt: date, lifecycle: p.timesShared >= 1 ? "repeated" : "active" }
            : p,
        ),
      };
    }
    case "feedback":
      return { ...state, feedback: [action.value, ...state.feedback] };
    case "weaving.add":
      return {
        ...state,
        weaving: {
          interests: [
            { id: `wi-${Date.now()}`, text: action.text },
            ...state.weaving.interests,
          ],
        },
      };
    case "weaving.clear":
      return { ...state, weaving: { interests: [] } };
    case "suggestion.accept":
      return {
        ...state,
        acceptedSuggestions: [...new Set([...state.acceptedSuggestions, action.id])],
      };
    default:
      return state;
  }
}

function readStored(): LabState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LabState) : null;
  } catch {
    return null;
  }
}

interface LabStore {
  state: LabState;
  dispatch: (a: Action) => void;
  hydrated: boolean;
}

const Ctx = createContext<LabStore | null>(null);

export function LabStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, baseState);
  const [hydrated, markHydrated] = useReducer(() => true, false);

  useEffect(() => {
    const stored = readStored();
    if (stored) dispatch({ type: "scenario", id: stored.scenario });
    markHydrated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* تجاهل: النموذج لا يعتمد على التخزين */
    }
  }, [state, hydrated]);

  const value = useMemo(() => ({ state, dispatch, hydrated }), [state, hydrated]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLab(): LabStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLab must be used inside LabStateProvider");
  return ctx;
}

/** مساعدات قراءة مشتقة (بلا أي مؤشر تقييم). */
export function useLabHelpers() {
  const { state, dispatch } = useLab();

  const participationById = useCallback(
    (id: string) => state.participations.find((p) => p.id === id) ?? null,
    [state.participations],
  );
  const cardById = useCallback(
    (id: string) => state.cards.find((c) => c.id === id) ?? null,
    [state.cards],
  );
  const setupFor = useCallback(
    (id: string): LabSetup => state.setups[id] ?? { priorSteps: [], supports: [] },
    [state.setups],
  );
  const cardsFor = useCallback(
    (participationId: string) =>
      state.cards
        .filter((c) => c.participationId === participationId)
        .sort((a, b) => a.version - b.version),
    [state.cards],
  );
  const lastTone = useCallback(
    (cardId: string): LabTone | null => state.feedback.find((f) => f.cardId === cardId)?.tone ?? null,
    [state.feedback],
  );

  return { state, dispatch, participationById, cardById, setupFor, cardsFor, lastTone };
}

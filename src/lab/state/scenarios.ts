// سيناريوهات النموذج التجريبي — لتبديل الحالة بسرعة أثناء الاختبار.

import type { LabState, LabUiState } from "@/lab/state/types";
import {
  buildSampleParticipation,
  buildSampleRoutine,
  emptyRoutine,
} from "@/lab/data/fixtures";

export interface ScenarioDef {
  id: string;
  label: string;
  hint: string;
}

export const SCENARIOS: ScenarioDef[] = [
  { id: "new_family", label: "أسرة جديدة", hint: "لا يوجد روتين ولا مشاركات بعد" },
  { id: "existing_routine", label: "روتين قائم", hint: "روتين يومي مبني مسبقاً" },
  { id: "first_time", label: "مشاركة لأول مرة", hint: "بطاقة معتمدة ولم تُستخدم بعد" },
  { id: "repeated", label: "مشاركة متكررة", hint: "تكررت عدة مرات" },
  { id: "hard_today", label: "مشاركة كانت صعبة اليوم", hint: "آخر مشاركة كانت صعبة" },
  { id: "stable", label: "مشاركة مستقرة في الروتين", hint: "من مشاركاتنا المعتادة" },
  { id: "busy_day", label: "يوم مزدحم", hint: "روتين مكتظ بأحداث كثيرة" },
  { id: "weaving", label: "اهتمام/فعل موجود", hint: "مدخل Participation Weaving" },
];

export const UI_STATES: { id: LabUiState; label: string }[] = [
  { id: "ready", label: "جاهزة" },
  { id: "empty", label: "فارغة" },
  { id: "loading", label: "تحميل" },
  { id: "error", label: "خطأ" },
];

export function baseState(): LabState {
  return {
    scenario: "new_family",
    uiState: "ready",
    timeOfDay: "morning",
    context: "home",
    mode: "single",
    path: {},
    routine: emptyRoutine,
    participations: [],
    setups: {},
    cards: [],
    runs: [],
    feedback: [],
    weaving: { interests: [] },
    acceptedSuggestions: [],
  };
}

export function buildScenario(id: string): LabState {
  const state = baseState();
  state.scenario = id;

  const withParticipation = (
    times: number,
    opts: { stable?: boolean; tone?: "comfortable" | "usual" | "difficult_today" } = {},
  ) => {
    const sample = buildSampleParticipation({
      timesShared: times,
      stable: opts.stable,
      lastTone: opts.tone,
    });
    if (!sample) return;
    if (opts.stable) {
      sample.participation.stableInRoutine = true;
      sample.participation.lifecycle = "routine";
    }
    state.participations = [sample.participation];
    state.setups = { [sample.participation.id]: sample.setup };
    state.cards = [sample.card];
    state.runs = sample.runs;
    state.feedback = sample.feedback;
  };

  switch (id) {
    case "existing_routine":
      state.routine = buildSampleRoutine();
      state.mode = "routine";
      break;
    case "first_time":
      state.routine = buildSampleRoutine();
      withParticipation(0);
      break;
    case "repeated":
      state.routine = buildSampleRoutine();
      withParticipation(4, { tone: "usual" });
      break;
    case "hard_today":
      state.routine = buildSampleRoutine();
      withParticipation(3, { tone: "difficult_today" });
      break;
    case "stable":
      state.routine = buildSampleRoutine();
      withParticipation(9, { stable: true, tone: "comfortable" });
      break;
    case "busy_day": {
      const routine = buildSampleRoutine();
      state.routine = {
        ...routine,
        events: [
          ...routine.events,
          ...routine.events.map((e, i) => ({
            ...e,
            id: `${e.id}-b${i}`,
            order: routine.events.length + i,
            isParticipationStation: false,
          })),
        ],
      };
      withParticipation(2, { tone: "usual" });
      break;
    }
    case "weaving":
      state.weaving = { interests: [{ id: "wi-1", text: "يحب اللعب بالماء" }] };
      break;
    default:
      break;
  }

  return state;
}

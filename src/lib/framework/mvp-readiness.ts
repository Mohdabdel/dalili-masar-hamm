import {
  MVP_JOURNEY_PROBES,
  MVP_SCOPE_ID,
  MVP_SCOPE_PARTICIPATION_IDS,
} from "./mvp-scope";

export const MVP_READINESS_ID = "DALILI_MVP_READINESS_GATE_01" as const;
export const MVP_CURRENT_STAGE = "MVP_READY_CANDIDATE" as const;
export const MVP_READY_CANDIDATE = true as const;
export const MVP_READY = false as const;

export type MvpReadinessGateId =
  | "architecture"
  | "content"
  | "familyJourney"
  | "governanceDataIntegrity";

export type MvpReadinessStatus = "PASS";

export interface MvpReadinessGate {
  readonly id: MvpReadinessGateId;
  readonly title: string;
  readonly status: MvpReadinessStatus;
  readonly evidence: readonly string[];
  readonly pending: readonly string[];
}

export const MVP_READINESS_GATES = Object.freeze([
  {
    id: "architecture",
    title: "Architecture Ready",
    status: "PASS",
    evidence: Object.freeze([
      "Frozen framework references are discoverable through the canonical registry.",
      "Legacy Master rows remain source/backlog lineage, not promoted runtime records.",
      "Production card composition resolves fixed framework references.",
    ]),
    pending: Object.freeze([]),
  },
  {
    id: "content",
    title: "Content Ready",
    status: "PASS",
    evidence: Object.freeze([
      `${MVP_SCOPE_ID} freezes 30 framework references only.`,
      "The scope covers home, food, shopping, community, health, and clothing contexts.",
      "The scope covers simple, moderate, and advanced participation levels.",
    ]),
    pending: Object.freeze([]),
  },
  {
    id: "familyJourney",
    title: "Family Journey Ready",
    status: "PASS",
    evidence: Object.freeze([
      "Three journey probes resolve through the workspace/card runtime.",
      "Draft composition, family wording edits, visible rows, and frozen snapshots are covered by tests.",
      "Manual UI smoke confirms single-step editing, next/previous navigation, preview modes, and approval entry.",
    ]),
    pending: Object.freeze([]),
  },
  {
    id: "governanceDataIntegrity",
    title: "Governance / Data Integrity Ready",
    status: "PASS",
    evidence: Object.freeze([
      "Source boundary tests protect legacy/framework separation.",
      "MVP scope and journey evidence are represented as audit artifacts.",
      "Local MVP commits are synced to origin/main through e29d30d.",
    ]),
    pending: Object.freeze([]),
  },
] as const satisfies readonly MvpReadinessGate[]);

export const MVP_READINESS_PENDING_ITEMS = Object.freeze(
  MVP_READINESS_GATES.flatMap((gate) => gate.pending),
);

export function mvpReadinessSummary() {
  return {
    id: MVP_READINESS_ID,
    scopeId: MVP_SCOPE_ID,
    scopeSize: MVP_SCOPE_PARTICIPATION_IDS.length,
    journeyCount: MVP_JOURNEY_PROBES.length,
    currentStage: MVP_CURRENT_STAGE,
    mvpReadyCandidate: MVP_READY_CANDIDATE,
    mvpReady: MVP_READY,
    gates: MVP_READINESS_GATES,
    pendingItems: MVP_READINESS_PENDING_ITEMS,
  };
}

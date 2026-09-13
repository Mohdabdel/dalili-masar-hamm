import {
  MVP_JOURNEY_PROBES,
  MVP_SCOPE_ID,
  MVP_SCOPE_PARTICIPATION_IDS,
} from "./mvp-scope";

export const MVP_READINESS_ID = "DALILI_MVP_READINESS_GATE_01" as const;
export const MVP_CURRENT_STAGE = "FAMILY_JOURNEY_TESTABLE" as const;
export const MVP_READY = false as const;

export type MvpReadinessGateId =
  | "architecture"
  | "content"
  | "familyJourney"
  | "governanceDataIntegrity";

export type MvpReadinessStatus =
  | "PASS"
  | "PASS_FOR_SCOPE"
  | "PENDING";

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
    status: "PASS_FOR_SCOPE",
    evidence: Object.freeze([
      `${MVP_SCOPE_ID} freezes 30 framework references only.`,
      "The scope covers home, food, shopping, community, health, and clothing contexts.",
      "The scope covers simple, moderate, and advanced participation levels.",
    ]),
    pending: Object.freeze([
      "Do not expand beyond the fixed MVP scope until journey/manual smoke is complete.",
    ]),
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
    status: "PENDING",
    evidence: Object.freeze([
      "Source boundary tests protect legacy/framework separation.",
      "MVP scope and journey evidence are represented as audit artifacts.",
    ]),
    pending: Object.freeze([
      "Push local MVP journey/readiness commits to origin/main when GitHub sync is available.",
    ]),
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
    mvpReady: MVP_READY,
    gates: MVP_READINESS_GATES,
    pendingItems: MVP_READINESS_PENDING_ITEMS,
  };
}

import { describe, expect, it } from "vitest";
import {
  MVP_CURRENT_STAGE,
  MVP_READINESS_GATES,
  MVP_READINESS_ID,
  MVP_READINESS_PENDING_ITEMS,
  MVP_READY,
  MVP_READY_CANDIDATE,
  mvpReadinessSummary,
} from "../mvp-readiness";

describe("DALILI MVP readiness gate 01", () => {
  it("يثبت أن المشروع وصل إلى محطة MVP Ready Candidate وليس إعلان MVP Ready النهائي", () => {
    const summary = mvpReadinessSummary();

    expect(summary.id).toBe(MVP_READINESS_ID);
    expect(summary.currentStage).toBe(MVP_CURRENT_STAGE);
    expect(summary.mvpReadyCandidate).toBe(MVP_READY_CANDIDATE);
    expect(summary.mvpReadyCandidate).toBe(true);
    expect(summary.mvpReady).toBe(MVP_READY);
    expect(summary.mvpReady).toBe(false);
    expect(summary.scopeSize).toBe(30);
    expect(summary.journeyCount).toBe(3);
  });

  it("يغطي البوابات الأربع ويترك البنود المعلقة صريحة", () => {
    expect(MVP_READINESS_GATES.map((gate) => gate.id)).toEqual([
      "architecture",
      "content",
      "familyJourney",
      "governanceDataIntegrity",
    ]);

    expect(MVP_READINESS_GATES.find((gate) => gate.id === "architecture")?.status).toBe(
      "PASS",
    );
    expect(MVP_READINESS_GATES.find((gate) => gate.id === "content")?.status).toBe(
      "PASS",
    );
    expect(MVP_READINESS_GATES.find((gate) => gate.id === "familyJourney")?.status).toBe(
      "PASS",
    );
    expect(
      MVP_READINESS_GATES.find((gate) => gate.id === "governanceDataIntegrity")?.status,
    ).toBe("PASS");

    expect(MVP_READINESS_PENDING_ITEMS).toHaveLength(0);
    expect(MVP_READINESS_PENDING_ITEMS).not.toContain(
      "Run manual UI smoke for Home / Family journey.",
    );
  });
});

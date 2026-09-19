import { describe, expect, it } from "vitest";
import { CURATED_EXPLORE, curatedByEvent, curatedBySpec } from "../curated-explore";
import { mvpParticipationsForEvent } from "@/lab/data/space/catalog";

describe("curated family exploration", () => {
  it("offers four distinct, complete roles per lens without a level choice", () => {
    const all = [...CURATED_EXPLORE.event, ...CURATED_EXPLORE.station];
    expect(CURATED_EXPLORE.event).toHaveLength(4);
    expect(CURATED_EXPLORE.station).toHaveLength(4);
    expect(new Set(all.map((item) => item.specId)).size).toBe(8);
    expect(new Set(all.map((item) => item.eventId)).size).toBe(8);
    for (const item of all) {
      const spec = mvpParticipationsForEvent(item.eventId).find((row) => row.id === item.specId);
      expect(spec, item.specId).toBeDefined();
      expect(spec?.majorSteps.length, item.specId).toBeGreaterThanOrEqual(3);
      expect(spec?.majorSteps.every((step) => Boolean(step.instruction_family_ar.trim())), item.specId).toBe(true);
      expect(curatedByEvent(item.eventId)?.specId).toBe(item.specId);
      expect(curatedBySpec(item.specId)).toBe(
        CURATED_EXPLORE.event.some((entry) => entry.specId === item.specId) ? "event" : "station",
      );
    }
  });
});

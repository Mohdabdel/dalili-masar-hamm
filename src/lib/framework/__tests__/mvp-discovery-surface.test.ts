import { describe, expect, it } from "vitest";
import { mvpParticipationsForEvent, mvpSpaceEvents } from "@/lab/data/space/catalog";
import { MVP_SCOPE_PARTICIPATION_IDS } from "../mvp-scope";

describe("MVP discovery surface", () => {
  it("يعرض نطاق الـ30 المرجعي فقط دون صفوف Legacy", () => {
    const events = mvpSpaceEvents();
    const participations = events.flatMap((event) => mvpParticipationsForEvent(event.id));

    expect(participations.map((participation) => participation.id).sort()).toEqual(
      [...MVP_SCOPE_PARTICIPATION_IDS].sort(),
    );
    expect(participations).toHaveLength(30);
    expect(participations.every((participation) => !participation.id.startsWith("KB-"))).toBe(true);
  });
});

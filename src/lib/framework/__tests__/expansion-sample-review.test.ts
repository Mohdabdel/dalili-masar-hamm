import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateFunctionalParticipation } from "../fp-validity";
import type { CandidateFunctionalParticipation } from "../reference-model";

interface ExpansionSamplePacket {
  items: CandidateFunctionalParticipation[];
}

function readCorrectedSample(): ExpansionSamplePacket {
  const raw = readFileSync(
    join(
      process.cwd(),
      "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_CORRECTED_01.json",
    ),
    "utf8",
  );
  return JSON.parse(raw) as ExpansionSamplePacket;
}

describe("Expansion sample 12 corrected review packet", () => {
  it("keeps the corrected packet as review data, not a runtime migration", () => {
    const packet = readCorrectedSample();
    expect(packet.items).toHaveLength(12);
    expect(new Set(packet.items.map((item) => item.id)).size).toBe(12);
    expect(packet.items.every((item) => item.id.startsWith("FR-EXP12-"))).toBe(true);
  });

  it("passes the frozen functional participation gates after review fixes", () => {
    const packet = readCorrectedSample();
    for (const item of packet.items) {
      const result = evaluateFunctionalParticipation(item);
      expect(result.valid, `${item.id}: ${result.codes.join(",")}`).toBe(true);
    }
  });
});

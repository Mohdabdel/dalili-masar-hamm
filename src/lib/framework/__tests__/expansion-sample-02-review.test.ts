import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateFunctionalParticipation } from "../fp-validity";
import type { CandidateFunctionalParticipation } from "../reference-model";

interface CorrectedSample02Candidate extends CandidateFunctionalParticipation {
  sample_id: string;
  proposed_framework_reference_id: string;
  candidate_id: string;
  event_id: string;
  source_evidence_ids: string[];
}

interface CorrectedSample02Packet {
  artifact: "DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01";
  status: "CORRECTED_REVIEW_CANDIDATES_READY_FOR_RECHECK";
  materialization: "not_materialized";
  candidates: CorrectedSample02Candidate[];
}

function readCorrectedSample02(): CorrectedSample02Packet {
  const raw = readFileSync(
    join(
      process.cwd(),
      "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01.json",
    ),
    "utf8",
  );
  return JSON.parse(raw) as CorrectedSample02Packet;
}

describe("Expansion sample 12-02 corrected review packet", () => {
  it("keeps the corrected packet behind the materialization gate", () => {
    const packet = readCorrectedSample02();
    expect(packet.artifact).toBe("DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01");
    expect(packet.status).toBe("CORRECTED_REVIEW_CANDIDATES_READY_FOR_RECHECK");
    expect(packet.materialization).toBe("not_materialized");
    expect(packet.candidates).toHaveLength(12);
  });

  it("passes the frozen functional participation gates after review fixes", () => {
    const packet = readCorrectedSample02();
    for (const candidate of packet.candidates) {
      const result = evaluateFunctionalParticipation(candidate);
      expect(result.valid, `${candidate.candidate_id}: ${result.codes.join(",")}`).toBe(true);
    }
  });

  it("does not keep execution blocks equal to the role title", () => {
    const packet = readCorrectedSample02();
    for (const candidate of packet.candidates) {
      for (const [index, block] of (candidate.execution_blocks ?? []).entries()) {
        expect(block.id, candidate.candidate_id).toBe(
          `${candidate.proposed_framework_reference_id}-b${index + 1}`,
        );
        expect(block.text, candidate.candidate_id).not.toBe(candidate.title);
      }
    }
  });

  it("preserves source evidence while proposing separate framework ids", () => {
    const packet = readCorrectedSample02();
    for (const candidate of packet.candidates) {
      expect(candidate.proposed_framework_reference_id).toMatch(/^FR-EXP12-02-/);
      expect(candidate.source_evidence_ids.length).toBeGreaterThan(0);
      for (const evidenceId of candidate.source_evidence_ids) {
        expect(candidate.proposed_framework_reference_id).not.toBe(evidenceId);
      }
    }
  });

  it("keeps externally sensitive roles framed as family participation", () => {
    const packet = readCorrectedSample02();
    const byId = new Map(packet.candidates.map((candidate) => [candidate.candidate_id, candidate]));
    expect(byId.get("FP-CAND-023")?.participation_mode).toBe("shared");
    expect(byId.get("FP-CAND-028")?.participation_mode).toBe("shared");
    expect(byId.get("FP-CAND-029")?.participation_mode).toBe("shared");
    expect(byId.get("FP-CAND-029")?.complexity?.level).toBe("moderate");
    expect(byId.get("FP-WAVE-A-004")?.functional_intent).toContain("الأسرة");
  });
});

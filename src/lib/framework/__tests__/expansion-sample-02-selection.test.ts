import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BATCH03_PARTICIPATION_IDS, getBatch03Lineage } from "../batch03-corpus";
import { BATCH04_PARTICIPATION_IDS, getBatch04Lineage } from "../batch04-corpus";
import { evaluateFunctionalParticipation } from "../fp-validity";
import type { CandidateFunctionalParticipation } from "../reference-model";

interface ExpansionSample02Candidate extends CandidateFunctionalParticipation {
  sample_id: string;
  proposed_framework_reference_id: string;
  candidate_id: string;
  domain: string;
  event_id: string;
  participation_mode: "individual" | "shared";
  source_evidence_ids: string[];
  review_focus: string[];
  source_artifact: string;
}

interface ExpansionSample02Packet {
  artifact: "DALILI_EXPANSION_SAMPLE_12_02";
  status: "REVIEW_PACKET_READY_NOT_MATERIALIZED";
  candidate_count: number;
  candidates: ExpansionSample02Candidate[];
}

function readSample02(): ExpansionSample02Packet {
  const raw = readFileSync(
    join(process.cwd(), "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02.json"),
    "utf8",
  );
  return JSON.parse(raw) as ExpansionSample02Packet;
}

function readSample02ScorecardHeader(): string[] {
  return readFileSync(
    join(
      process.cwd(),
      "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_SCORECARD.csv",
    ),
    "utf8",
  )
    .split(/\r?\n/, 1)[0]
    .split(",");
}

function materializedEvidenceIds(): Set<string> {
  const out = new Set<string>();
  for (const id of BATCH03_PARTICIPATION_IDS) {
    for (const evidenceId of getBatch03Lineage(id)?.source_evidence_ids ?? []) {
      out.add(evidenceId);
    }
  }
  for (const id of BATCH04_PARTICIPATION_IDS) {
    for (const evidenceId of getBatch04Lineage(id)?.source_evidence_ids ?? []) {
      out.add(evidenceId);
    }
  }
  return out;
}

describe("Expansion sample 12-02 selection packet", () => {
  it("is a review packet only, not a runtime materialization", () => {
    const packet = readSample02();
    expect(packet.artifact).toBe("DALILI_EXPANSION_SAMPLE_12_02");
    expect(packet.status).toBe("REVIEW_PACKET_READY_NOT_MATERIALIZED");
    expect(packet.candidate_count).toBe(12);
    expect(packet.candidates).toHaveLength(12);
    expect(
      packet.candidates.every((candidate) =>
        candidate.proposed_framework_reference_id.startsWith("FR-EXP12-02-"),
      ),
    ).toBe(true);
  });

  it("selects two candidates from each major domain", () => {
    const packet = readSample02();
    const counts = new Map<string, number>();
    for (const candidate of packet.candidates) {
      counts.set(candidate.domain, (counts.get(candidate.domain) ?? 0) + 1);
    }
    expect([...counts.values()].sort()).toEqual([2, 2, 2, 2, 2, 2]);
    expect(counts.size).toBe(6);
  });

  it("does not reuse source evidence already materialized in Batch03 or Batch04", () => {
    const packet = readSample02();
    const used = materializedEvidenceIds();
    const allEvidence = packet.candidates.flatMap(
      (candidate) => candidate.source_evidence_ids,
    );
    expect(new Set(allEvidence).size).toBe(allEvidence.length);
    for (const evidenceId of allEvidence) {
      expect(used.has(evidenceId), evidenceId).toBe(false);
    }
  });

  it("keeps enough edge coverage for the next precision-review gate", () => {
    const packet = readSample02();
    expect(
      packet.candidates.some((candidate) =>
        candidate.review_focus.some((focus) => focus.includes("staff")),
      ),
    ).toBe(true);
    expect(packet.candidates.some((candidate) => candidate.domain.includes("الصحة"))).toBe(true);
    expect(packet.candidates.some((candidate) => candidate.domain.includes("الملابس"))).toBe(true);
    expect(packet.candidates.some((candidate) => candidate.complexity?.level === "advanced")).toBe(true);
    expect(packet.candidates.some((candidate) => candidate.participation_mode === "individual")).toBe(true);
    expect(packet.candidates.some((candidate) => candidate.participation_mode === "shared")).toBe(true);
  });

  it("contains directly reviewable fields and currently passes the frozen FP gates", () => {
    const packet = readSample02();
    for (const candidate of packet.candidates) {
      expect(candidate.life_context).toBeTruthy();
      expect(candidate.functional_intent).toBeTruthy();
      expect(candidate.observable_effect).toBeTruthy();
      expect(candidate.natural_completion).toBeTruthy();
      expect(candidate.standalone_role_meaning).toBeTruthy();
      expect(candidate.execution_blocks?.length).toBeGreaterThan(0);
      const result = evaluateFunctionalParticipation(candidate);
      expect(result.valid, `${candidate.id}: ${result.codes.join(",")}`).toBe(true);
    }
  });

  it("separates image review from the content decision in the scorecard", () => {
    const header = readSample02ScorecardHeader();
    expect(header).toContain("decision");
    expect(header).toContain("image_review_status");
    expect(header.indexOf("image_review_status")).toBeGreaterThan(
      header.indexOf("decision"),
    );
  });
});

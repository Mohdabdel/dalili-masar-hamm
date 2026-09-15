import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { evaluateComplexity } from "../complexity-validity";

const dataDir = path.resolve(process.cwd(), "docs/audit/data");
const read = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));

const ledger = read("DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json");
const direct = read("DALILI_CA_0001_DRAFT_FP_ACCEPT_REWRITE.json");
const splitMerge = read("DALILI_CA_0001_DRAFT_SPLIT_MERGE.json");
const nonFp = read("DALILI_CA_0001_DRAFT_NON_FP_ROUTING.json");
const result = read("DALILI_CA_0001_CONTRACT_ALIGNMENT_RESULT_01.json");

const directCandidates = direct.candidates;
const splitCandidates = splitMerge.split_sources.flatMap(
  (source: { candidates: unknown[] }) => source.candidates,
);
const candidates = [...directCandidates, ...splitCandidates];
const accountedSourceIds = [
  ...directCandidates.flatMap(
    (candidate: { lineage: { legacy_source_ids: string[] } }) =>
      candidate.lineage.legacy_source_ids,
  ),
  ...splitMerge.split_sources.map(
    (source: { legacy_id: string }) => source.legacy_id,
  ),
  ...splitMerge.merged_sources.map(
    (source: { legacy_id: string }) => source.legacy_id,
  ),
  ...nonFp.records.map((source: { legacy_id: string }) => source.legacy_id),
];

describe("CA-0001 contract-alignment draft gate", () => {
  it("accounts for exactly 50 unique frozen Legacy sources", () => {
    expect(accountedSourceIds).toHaveLength(50);
    expect(new Set(accountedSourceIds).size).toBe(50);
    const ledgerIds = new Set(
      ledger.records.map((record: { legacy_id: string }) => record.legacy_id),
    );
    expect(accountedSourceIds.every((id) => ledgerIds.has(id))).toBe(true);
  });

  it("creates 48 unique draft FP candidates and no materialized records", () => {
    expect(directCandidates).toHaveLength(24);
    expect(splitCandidates).toHaveLength(24);
    expect(candidates).toHaveLength(48);
    expect(new Set(candidates.map((candidate) => candidate.id)).size).toBe(48);
    expect(direct.execution_boundary.materialization_performed).toBe(false);
    expect(splitMerge.boundaries.materialization_performed).toBe(false);
    expect(nonFp.verification_summary.materialized_count).toBe(0);
  });

  it.each(candidates.map((candidate) => [candidate.id, candidate] as const))(
    "%s passes the unchanged canonical FP validator",
    (_id, candidate) => {
      const result = evaluateFunctionalParticipation(candidate);
      expect(result.valid, JSON.stringify(result)).toBe(true);
      expect(result.gates).toHaveLength(7);
    },
  );

  it.each(candidates.map((candidate) => [candidate.id, candidate] as const))(
    "%s passes the independent complexity validator",
    (_id, candidate) => {
      const result = evaluateComplexity(candidate);
      expect(result.valid, JSON.stringify(result)).toBe(true);
      expect(result.gates).toHaveLength(9);
    },
  );

  it("preserves split cardinality and never creates merge candidates", () => {
    expect(splitMerge.split_sources).toHaveLength(10);
    expect(
      splitMerge.split_sources.every(
        (source: { output_count: number; candidates: unknown[] }) =>
          source.output_count >= 2 && source.output_count === source.candidates.length,
      ),
    ).toBe(true);
    expect(splitMerge.merged_sources).toHaveLength(11);
    expect(
      splitMerge.merged_sources.every(
        (source: { candidate_created: boolean }) => !source.candidate_created,
      ),
    ).toBe(true);
  });

  it("routes all five non-FP sources without inventing an FP", () => {
    expect(nonFp.records).toHaveLength(5);
    expect(nonFp.verification_summary.destination_counts.fp_candidates).toBe(0);
    expect(nonFp.verification_summary.lineage_complete_count).toBe(5);
    expect(nonFp.verification_summary.silent_drops).toBe(0);
    expect(nonFp.verification_summary.orphan_destinations).toBe(0);
  });

  it("records the final fail-closed routing decision for all 50 sources", () => {
    expect(result.source_accounted_count).toBe(50);
    expect(result.route_counts).toEqual({ GREEN: 47, AMBER: 2, RED: 1 });
    expect(result.exception_sources.amber).toEqual([
      "HEALTH-014-OP001",
      "HEALTH-016-OP002",
    ]);
    expect(result.exception_sources.red).toEqual(["HOME-003-OP002"]);
    expect(result.conservation.gate).toBe("PASS");
    expect(result.execution_boundary.materialization_performed).toBe(false);
  });
});

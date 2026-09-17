import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateFunctionalParticipation } from "../fp-validity";
import { evaluateComplexity } from "../complexity-validity";
import { evaluateContractAlignmentDraftQuality } from "../contract-alignment-quality";

const dataDir = path.resolve(process.cwd(), "docs/audit/data");
const read = (name: string) =>
  JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));

const selection = read("DALILI_CA_0002_SELECTION_01.json");
const laneA = read("DALILI_CA_0002_DRAFT_LANE_A.json");
const laneB = read("DALILI_CA_0002_DRAFT_LANE_B.json");
const laneC = read("DALILI_CA_0002_DRAFT_LANE_C.json");

const candidates = [
  ...laneA.candidates,
  ...laneB.records.flatMap((record: { candidates?: unknown[] }) => record.candidates ?? []),
  ...laneC.candidates,
];
const sourceResults = [
  ...laneA.source_results.map((source: { source_id: string; routing: string }) => ({
    id: source.source_id,
    route: source.routing,
  })),
  ...laneB.records.map((source: { legacy_id: string; route: string }) => ({
    id: source.legacy_id,
    route: source.route,
  })),
  ...laneC.source_results.map((source: { legacy_id: string; route: string }) => ({
    id: source.legacy_id,
    route: source.route,
  })),
];

describe("CA-0002 governed expansion gate", () => {
  it("accounts for the exact frozen 100-source selection across three lanes", () => {
    const expected = selection.records.map((row: { legacy_id: string }) => row.legacy_id).sort();
    const actual = sourceResults.map((row) => row.id).sort();
    expect(actual).toEqual(expected);
    expect(new Set(actual).size).toBe(100);
    expect(laneA.selection.source_count).toBe(34);
    expect(laneB.selection.source_count).toBe(33);
    expect(laneC.selection.source_count).toBe(33);
  });

  it("creates 104 unique draft candidates and no materialized records", () => {
    expect(candidates).toHaveLength(104);
    expect(new Set(candidates.map((candidate) => candidate.id)).size).toBe(104);
    expect(laneA.execution_boundary.materialization_performed).toBe(false);
    expect(laneB.boundaries.materialization_performed).toBe(false);
    expect(laneC.execution_boundary.materialization_performed).toBe(false);
  });

  it.each(candidates.map((candidate) => [candidate.id, candidate] as const))(
    "%s passes canonical, complexity, and semantic-quality gates",
    (_id, candidate) => {
      expect(evaluateFunctionalParticipation(candidate).valid).toBe(true);
      expect(evaluateComplexity(candidate).valid).toBe(true);
      expect(evaluateContractAlignmentDraftQuality(candidate).valid).toBe(true);
    },
  );

  it("routes source results fail-closed with only documented safety exceptions", () => {
    const counts = sourceResults.reduce<Record<string, number>>((total, source) => {
      total[source.route] = (total[source.route] ?? 0) + 1;
      return total;
    }, {});
    expect(counts).toEqual({ GREEN: 92, AMBER: 8 });
  });

  it("keeps merge dispositions as provenance links without duplicate candidates", () => {
    expect(laneA.provenance_links).toHaveLength(1);
    expect(laneB.records.filter((record: { disposition: string }) => record.disposition === "MERGED_BY_PROVENANCE")).toHaveLength(1);
    expect(laneC.provenance_links).toHaveLength(0);
    const mergedSourceIds = new Set(
      selection.records
        .filter((row: { disposition: string }) => row.disposition === "MERGED_BY_PROVENANCE")
        .map((row: { legacy_id: string }) => row.legacy_id),
    );
    expect(
      candidates.some((candidate) =>
        (candidate.source_evidence_ids ?? []).some((id: string) => mergedSourceIds.has(id)),
      ),
    ).toBe(false);
  });
});

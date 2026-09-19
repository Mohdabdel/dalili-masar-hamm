/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { evaluateAlignmentSourceOutcome } from "../contract-alignment-batch-gate";
import { evaluateComplexity } from "../complexity-validity";
import { evaluateContractAlignmentDraftQuality } from "../contract-alignment-quality";
import { evaluateFunctionalParticipation } from "../fp-validity";

const dataDir = path.resolve(process.cwd(), "docs/audit/data");
const read = (name: string) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const selection = read("DALILI_CA_0003_SELECTION_01.json");
const lanes = ["A", "B", "C"].map((lane) =>
  read(`DALILI_CA_0003_DRAFT_LANE_${lane}.json`),
);
const reviewedRecordCountPerLane = 100;
const records = lanes.flatMap((lane) => lane.records.slice(0, reviewedRecordCountPerLane));
const candidates = records.flatMap((record) => record.candidates);
const mergeTargets = new Set(
  records.flatMap((record) => record.provenance_links.map((link: any) => link.target_id)),
);
const identities = records.map((record) => ({
  sourceId: record.source.legacy_id,
  sourceHash: record.source.source_record_sha256,
  parentEventId: record.source.source_identity.parent_event_id,
  domainId: record.source.source_identity.domain_id,
}));
const normalize = (value: string) =>
  value.normalize("NFKC").replace(/[«».,،؛:()]/gu, " ").replace(/\s+/gu, " ").trim();
const semanticFields = (candidate: any) => [
  candidate.life_context,
  candidate.functional_intent,
  candidate.observable_effect,
  candidate.natural_completion,
  candidate.standalone_role_meaning,
  ...Object.values(candidate.complexity.dimensions),
  candidate.complexity.rationale,
  ...candidate.execution_blocks.map((block: any) => block.text),
];

describe("CA-0003 reviewed micro-batches substantive acceptance", () => {
  it("matches every reviewed frozen source in each lane", () => {
    expect(records).toHaveLength(reviewedRecordCountPerLane * 3);
    for (const record of records) {
      const frozen = selection.records.find((row: any) => row.legacy_id === record.source.legacy_id);
      expect(record.source).toEqual(frozen);
    }
  });

  it.each(candidates.map((candidate) => [candidate.id, candidate]))(
    "%s passes FP, complexity, and semantic-quality gates",
    (_id, candidate) => {
      expect(evaluateFunctionalParticipation(candidate).valid).toBe(true);
      expect(evaluateComplexity(candidate).valid).toBe(true);
      expect(evaluateContractAlignmentDraftQuality(candidate).valid).toBe(true);
    },
  );

  it("reconciles source hash, lineage, mappings, safety, and stored route", () => {
    for (const record of records) {
      const outcome = {
        sourceId: record.source.legacy_id,
        sourceHash: record.source.source_record_sha256,
        parentEventId: record.source.source_identity.parent_event_id,
        domainId: record.source.source_identity.domain_id,
        disposition: record.source.disposition,
        candidateIds: record.candidates.map((candidate: any) => candidate.id),
        mergeTargetId: record.provenance_links[0]?.target_id,
        declaredRoute: record.route,
        materializationPerformed: false,
      };
      expect(evaluateAlignmentSourceOutcome(outcome, candidates, identities, mergeTargets)).toMatchObject({
        valid: true,
        codes: [],
      });
    }
  });

  it("has no duplicated semantic field and no repeated eight-word scaffold", () => {
    const values = candidates.flatMap(semanticFields).map(normalize);
    expect(new Set(values).size).toBe(values.length);
    const grams = new Map<string, Set<string>>();
    for (const candidate of candidates) {
      for (const value of semanticFields(candidate)) {
        const words = normalize(value).split(" ");
        for (let index = 0; index <= words.length - 8; index += 1) {
          const gram = words.slice(index, index + 8).join(" ");
          const ids = grams.get(gram) ?? new Set<string>();
          ids.add(candidate.id);
          grams.set(gram, ids);
        }
      }
    }
    const repeated = [...grams.entries()].filter(([, ids]) => ids.size >= 3);
    expect(repeated).toEqual([]);
  });

  it("retains the non-materialization boundary", () => {
    expect(lanes.every((lane) => lane.execution_boundary.materialization_performed === false)).toBe(true);
  });
});

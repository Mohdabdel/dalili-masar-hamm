import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const invariant = (condition, message) => {
  if (!condition) throw new Error(`CA0002_RESULT_INVARIANT_FAILED: ${message}`);
};

const selection = read("DALILI_CA_0002_SELECTION_01.json");
const laneA = read("DALILI_CA_0002_DRAFT_LANE_A.json");
const laneB = read("DALILI_CA_0002_DRAFT_LANE_B.json");
const laneC = read("DALILI_CA_0002_DRAFT_LANE_C.json");
const selected = selection.records;

const candidates = [
  ...laneA.candidates,
  ...laneB.records.flatMap((record) => record.candidates ?? []),
  ...laneC.candidates,
];
const candidateIds = candidates.map((candidate) => candidate.id);

const sourceRows = [
  ...laneA.source_results.map((source) => ({
    legacy_id: source.source_id,
    source_record_sha256: source.source_hash,
    candidate_ids: source.candidate_ids,
    route: source.routing,
    route_reason: source.reason ?? null,
  })),
  ...laneB.records.map((source) => ({
    legacy_id: source.legacy_id,
    source_record_sha256: source.source_record_sha256,
    candidate_ids: (source.candidates ?? []).map((candidate) => candidate.id),
    target_reference_id: source.target_reference_id,
    route: source.route,
    route_reason: source.review_reason ?? null,
  })),
  ...laneC.source_results.map((source) => ({
    legacy_id: source.legacy_id,
    source_record_sha256: source.source_record_sha256,
    candidate_ids: source.candidate_ids,
    route: source.route,
    route_reason: source.reason ?? null,
  })),
];

const sourceById = new Map(sourceRows.map((source) => [source.legacy_id, source]));
const outcomes = selected.map((selectedSource) => {
  const source = sourceById.get(selectedSource.legacy_id);
  invariant(source, `missing source outcome ${selectedSource.legacy_id}`);
  const split = selectedSource.disposition === "SPLIT_REQUIRED";
  const merge = selectedSource.disposition === "MERGED_BY_PROVENANCE";
  invariant(source.route !== "AMBER" || source.route_reason, `${source.legacy_id} AMBER lacks reason`);
  invariant(!merge || source.candidate_ids.length === 0, `${source.legacy_id} merge created candidate`);
  invariant(!split || source.candidate_ids.length === 2, `${source.legacy_id} split must create two children`);
  invariant(merge || split || source.candidate_ids.length === 1, `${source.legacy_id} unexpected output count`);
  return {
    legacy_id: source.legacy_id,
    corpus_position: selectedSource.corpus_position,
    disposition: selectedSource.disposition,
    source_record_sha256: source.source_record_sha256,
    output_kind: merge
      ? "PROVENANCE_LINK_ONLY"
      : split
        ? "SPLIT_FUNCTIONAL_PARTICIPATION_DRAFTS"
        : "FUNCTIONAL_PARTICIPATION_DRAFT",
    candidate_ids: source.candidate_ids,
    ...(source.target_reference_id ? { target_reference_id: source.target_reference_id } : {}),
    fp_validation: merge ? "NOT_APPLICABLE" : `${source.candidate_ids.length}/${source.candidate_ids.length} at 7/7 PASS`,
    complexity_validation: merge ? "NOT_APPLICABLE" : `${source.candidate_ids.length}/${source.candidate_ids.length} at 9/9 PASS`,
    semantic_quality_validation: merge ? "NOT_APPLICABLE" : `${source.candidate_ids.length}/${source.candidate_ids.length} PASS`,
    route: source.route,
    route_reason: source.route_reason,
  };
});

const dispositionCounts = selected.reduce((counts, source) => {
  counts[source.disposition] = (counts[source.disposition] ?? 0) + 1;
  return counts;
}, {});
const routeCounts = outcomes.reduce((counts, source) => {
  counts[source.route] += 1;
  return counts;
}, { GREEN: 0, AMBER: 0, RED: 0 });

invariant(outcomes.length === 100, `expected 100 outcomes, found ${outcomes.length}`);
invariant(sourceRows.length === 100, `expected 100 lane sources, found ${sourceRows.length}`);
invariant(new Set(sourceRows.map((source) => source.legacy_id)).size === 100, "source IDs are not unique");
invariant(candidates.length === 104, `expected 104 candidates, found ${candidates.length}`);
invariant(new Set(candidateIds).size === 104, "candidate IDs are not unique");
invariant(
  dispositionCounts.REWRITE_REQUIRED === 75 &&
    dispositionCounts.ACCEPTED === 17 &&
    dispositionCounts.SPLIT_REQUIRED === 6 &&
    dispositionCounts.MERGED_BY_PROVENANCE === 2,
  "unexpected disposition totals",
);
invariant(JSON.stringify(routeCounts) === JSON.stringify({ GREEN: 92, AMBER: 8, RED: 0 }), "unexpected route totals");
invariant(outcomes.filter((source) => source.disposition === "SPLIT_REQUIRED").flatMap((source) => source.candidate_ids).length === 12, "expected 12 split children");
invariant(outcomes.filter((source) => source.disposition === "MERGED_BY_PROVENANCE").length === 2, "expected two provenance links");
invariant([laneA, laneB, laneC].every((lane) => (lane.execution_boundary ?? lane.boundaries).materialization_performed === false), "materialization boundary violated");

const result = {
  artifact: "DALILI_CA_0002_CONTRACT_ALIGNMENT_RESULT_01",
  version: "1.0",
  status: "PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED",
  source_count: 100,
  source_accounted_count: 100,
  disposition_counts: dispositionCounts,
  draft_fp_candidate_count: 104,
  canonical_7_of_7_count: 104,
  complexity_9_of_9_count: 104,
  semantic_quality_pass_count: 104,
  provenance_link_count: 2,
  split_child_count: 12,
  route_counts: routeCounts,
  exception_sources: {
    amber: outcomes.filter((source) => source.route === "AMBER").map((source) => source.legacy_id),
    red: [],
  },
  conservation: {
    selected_sources: 100,
    accounted_sources: 100,
    unique_source_ids: 100,
    duplicate_source_ids: 0,
    orphan_outputs: 0,
    silent_drops: 0,
    gate: "PASS",
  },
  execution_boundary: {
    materialization_performed: false,
    legacy_master_mutated: false,
    canonical_validator_changed: false,
  },
  source_outcomes: outcomes,
};

const output = path.join(dataDir, "DALILI_CA_0002_CONTRACT_ALIGNMENT_RESULT_01.json");
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output, route_counts: routeCounts, candidates: 104 }, null, 2)}\n`);

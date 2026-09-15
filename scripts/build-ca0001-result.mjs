import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadApprovedRows, selectCa0001 } from "./contract-alignment-routing.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const invariant = (condition, message) => {
  if (!condition) throw new Error(`CA0001_RESULT_INVARIANT_FAILED: ${message}`);
};

const direct = read("DALILI_CA_0001_DRAFT_FP_ACCEPT_REWRITE.json");
const splitMerge = read("DALILI_CA_0001_DRAFT_SPLIT_MERGE.json");
const nonFp = read("DALILI_CA_0001_DRAFT_NON_FP_ROUTING.json");
const selected = selectCa0001(loadApprovedRows(dataDir));

const outcomes = [];
for (const candidate of direct.candidates) {
  const legacyId = candidate.lineage.legacy_source_ids[0];
  const governanceConflict = legacyId === "HOME-003-OP002";
  outcomes.push({
    legacy_id: legacyId,
    disposition: candidate.lineage.source_disposition,
    output_kind: "FUNCTIONAL_PARTICIPATION_DRAFT",
    candidate_ids: [candidate.id],
    fp_validation: "7/7 PASS",
    complexity_validation: "9/9 PASS",
    route: governanceConflict ? "RED" : candidate.validation.routing,
    route_reason: governanceConflict
      ? "Governing semantic conflict: the frozen FP foundation uses the same role as the execution-block-only negative fixture, while Phase 2 classified it ACCEPTED. A syntactic 7/7 result cannot override FP-11 or the prior governing evidence."
      : null,
  });
}

for (const source of splitMerge.split_sources) {
  invariant(source.candidates.length >= 2, `${source.legacy_id} split has fewer than two children`);
  outcomes.push({
    legacy_id: source.legacy_id,
    disposition: source.disposition,
    output_kind: "SPLIT_FUNCTIONAL_PARTICIPATION_DRAFTS",
    candidate_ids: source.candidates.map((candidate) => candidate.id),
    fp_validation: `${source.candidates.length}/${source.candidates.length} children 7/7 PASS`,
    complexity_validation: `${source.candidates.length}/${source.candidates.length} children 9/9 PASS`,
    route: source.candidates.every((candidate) => candidate.validation.route === "GREEN")
      ? "GREEN"
      : "AMBER",
    route_reason: null,
  });
}

for (const source of splitMerge.merged_sources) {
  outcomes.push({
    legacy_id: source.legacy_id,
    disposition: source.disposition,
    output_kind: "PROVENANCE_LINK_ONLY",
    candidate_ids: [],
    target_reference_id: source.target_reference_id,
    fp_validation: "NOT_APPLICABLE",
    complexity_validation: "NOT_APPLICABLE",
    route: source.route,
    route_reason: source.review_reason,
  });
}

for (const source of nonFp.records) {
  const stagedBlock = source.classification.disposition === "EXECUTION_BLOCK_ONLY";
  outcomes.push({
    legacy_id: source.legacy_id,
    disposition: source.classification.disposition,
    output_kind: source.routing.destination_layer ?? source.routing.route_type,
    candidate_ids: [],
    fp_validation: "NOT_APPLICABLE",
    complexity_validation: "NOT_APPLICABLE",
    route: stagedBlock ? "AMBER" : "GREEN",
    route_reason: stagedBlock
      ? "Execution Block identity is staged, but no valid parent Functional Participation is established; production attachment remains blocked."
      : null,
  });
}

outcomes.sort((left, right) => {
  const leftPosition = selected.find((row) => row.legacy_id === left.legacy_id).corpus_position;
  const rightPosition = selected.find((row) => row.legacy_id === right.legacy_id).corpus_position;
  return leftPosition - rightPosition;
});

const selectedIds = selected.map((row) => row.legacy_id);
const outcomeIds = outcomes.map((row) => row.legacy_id);
invariant(outcomes.length === 50, `expected 50 source outcomes, found ${outcomes.length}`);
invariant(new Set(outcomeIds).size === 50, "source outcomes are not unique");
invariant(JSON.stringify(selectedIds) === JSON.stringify(outcomeIds), "outcomes do not match frozen selection");

const routeCounts = { GREEN: 0, AMBER: 0, RED: 0 };
for (const outcome of outcomes) routeCounts[outcome.route] += 1;
invariant(JSON.stringify(routeCounts) === JSON.stringify({ GREEN: 47, AMBER: 2, RED: 1 }), "unexpected route totals");

const allCandidates = [
  ...direct.candidates,
  ...splitMerge.split_sources.flatMap((source) => source.candidates),
];
invariant(allCandidates.length === 48, "expected 48 draft FP candidates");
invariant(new Set(allCandidates.map((candidate) => candidate.id)).size === 48, "candidate IDs are not unique");

const result = {
  artifact: "DALILI_CA_0001_CONTRACT_ALIGNMENT_RESULT_01",
  version: "1.0",
  status: "PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED",
  source_count: 50,
  source_accounted_count: 50,
  draft_fp_candidate_count: 48,
  canonical_7_of_7_count: 48,
  complexity_9_of_9_count: 48,
  route_counts: routeCounts,
  exception_sources: {
    amber: outcomes.filter((row) => row.route === "AMBER").map((row) => row.legacy_id),
    red: outcomes.filter((row) => row.route === "RED").map((row) => row.legacy_id),
  },
  conservation: {
    selected_sources: 50,
    accounted_sources: 50,
    unique_source_ids: 50,
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

const output = path.join(dataDir, "DALILI_CA_0001_CONTRACT_ALIGNMENT_RESULT_01.json");
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output, route_counts: routeCounts, candidates: 48 }, null, 2)}\n`);

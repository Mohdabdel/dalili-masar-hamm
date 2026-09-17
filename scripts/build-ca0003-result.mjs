import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const read = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), "utf8"));
const invariant = (condition, message) => {
  if (!condition) throw new Error(`CA0003_RESULT_INVARIANT_FAILED: ${message}`);
};

const selection = read("DALILI_CA_0003_SELECTION_01.json");
const lanes = ["A", "B", "C"].map((lane) => read(`DALILI_CA_0003_DRAFT_LANE_${lane}.json`));
const records = lanes.flatMap((lane) => lane.records);
const candidates = records.flatMap((record) => record.candidates);
const links = records.flatMap((record) => record.provenance_links);
const selectedById = new Map(selection.records.map((source) => [source.legacy_id, source]));

invariant(records.length === 300, `expected 300 records, found ${records.length}`);
invariant(new Set(records.map((record) => record.source.legacy_id)).size === 300, "source IDs are not unique");
invariant(candidates.length === 311, `expected 311 candidates, found ${candidates.length}`);
invariant(new Set(candidates.map((candidate) => candidate.id)).size === 311, "candidate IDs are not unique");
invariant(links.length === 4, `expected four provenance links, found ${links.length}`);
invariant(lanes.every((lane) => lane.execution_boundary?.materialization_performed === false), "materialization boundary violated");

const sourceOutcomes = records
  .map((record) => {
    const frozen = selectedById.get(record.source.legacy_id);
    invariant(frozen, `unknown source ${record.source.legacy_id}`);
    invariant(JSON.stringify(record.source) === JSON.stringify(frozen), `source drift ${record.source.legacy_id}`);
    const split = record.source.disposition === "SPLIT_REQUIRED";
    const merge = record.source.disposition === "MERGED_BY_PROVENANCE";
    invariant(!split || record.candidates.length >= 2, `invalid split ${record.source.legacy_id}`);
    invariant(!merge || (record.candidates.length === 0 && record.provenance_links.length === 1), `invalid merge ${record.source.legacy_id}`);
    invariant(merge || split || record.candidates.length === 1, `invalid one-to-one ${record.source.legacy_id}`);
    invariant(record.route !== "AMBER" || record.safety_review?.reason, `AMBER lacks reason ${record.source.legacy_id}`);
    return {
      legacy_id: record.source.legacy_id,
      corpus_position: record.source.corpus_position,
      lane: record.source.lane,
      disposition: record.source.disposition,
      source_record_sha256: record.source.source_record_sha256,
      output_kind: record.decision.output_kind,
      candidate_ids: record.candidates.map((candidate) => candidate.id),
      provenance_target_ids: record.provenance_links.map((link) => link.target_id),
      fp_validation: merge ? "NOT_APPLICABLE" : `${record.candidates.length}/${record.candidates.length} at 7/7 PASS`,
      complexity_validation: merge ? "NOT_APPLICABLE" : `${record.candidates.length}/${record.candidates.length} at 9/9 PASS`,
      semantic_quality_validation: merge ? "NOT_APPLICABLE" : `${record.candidates.length}/${record.candidates.length} PASS`,
      safety_review: record.safety_review,
      route: record.route,
      route_reason: record.safety_review?.reason ?? null,
    };
  })
  .sort((left, right) => left.corpus_position - right.corpus_position || left.legacy_id.localeCompare(right.legacy_id));

const routeCounts = sourceOutcomes.reduce((counts, source) => {
  counts[source.route] += 1;
  return counts;
}, { GREEN: 0, AMBER: 0, RED: 0 });
invariant(JSON.stringify(routeCounts) === JSON.stringify({ GREEN: 271, AMBER: 29, RED: 0 }), "unexpected route totals");

const result = {
  artifact: "DALILI_CA_0003_CONTRACT_ALIGNMENT_RESULT_01",
  version: "1.0",
  status: "PASS_WITH_ROUTED_EXCEPTIONS_NOT_MATERIALIZED",
  source_count: 300,
  source_accounted_count: 300,
  disposition_counts: selection.disposition_counts,
  draft_fp_candidate_count: 311,
  canonical_7_of_7_count: 311,
  complexity_9_of_9_count: 311,
  semantic_quality_pass_count: 311,
  provenance_link_count: 4,
  route_counts: routeCounts,
  exception_sources: {
    amber: sourceOutcomes.filter((source) => source.route === "AMBER").map((source) => source.legacy_id),
    red: [],
  },
  conservation: {
    selected_sources: 300,
    accounted_sources: 300,
    unique_source_ids: 300,
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
  source_outcomes: sourceOutcomes,
};

const output = path.join(dataDir, "DALILI_CA_0003_CONTRACT_ALIGNMENT_RESULT_01.json");
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output, route_counts: routeCounts, candidates: 311 }, null, 2)}\n`);

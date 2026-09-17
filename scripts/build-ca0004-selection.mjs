import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadApprovedRows,
  selectCa0001,
  selectCa0002,
  selectCa0003,
  selectCa0004,
} from "./contract-alignment-routing.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const rows = loadApprovedRows(dataDir);
const ledger = JSON.parse(
  fs.readFileSync(path.join(dataDir, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json"), "utf8"),
);
const ledgerById = new Map(ledger.records.map((record) => [record.legacy_id, record]));
const priorIds = new Set([
  ...selectCa0001(rows).map((row) => row.legacy_id),
  ...selectCa0002(rows).map((row) => row.legacy_id),
  ...selectCa0003(rows).map((row) => row.legacy_id),
]);
const selected = selectCa0004(rows);

if (selected.length !== 300) throw new Error("CA-0004 selection must contain 300 sources");
if (new Set(selected.map((row) => row.legacy_id)).size !== 300) {
  throw new Error("Duplicate CA-0004 source");
}
if (selected.some((row) => priorIds.has(row.legacy_id))) {
  throw new Error("CA-0001/CA-0002/CA-0003 overlap detected");
}
if (selected.some((row) => row.domain === "DOM-CLO")) {
  throw new Error("CA-0004 must not invent exhausted DOM-CLO coverage");
}

const records = selected.map((row, index) => {
  const source = ledgerById.get(row.legacy_id);
  if (!source) throw new Error(`Missing authoritative ledger row for ${row.legacy_id}`);
  return {
    selection_ordinal: index + 1,
    lane: ["A", "B", "C"][Math.floor(index / 100)],
    lane_ordinal: (index % 100) + 1,
    ...row,
    source_record_sha256: source.source_record_sha256,
    source_identity: source.source_identity,
    classification_artifact: source.classification_artifact,
  };
});
const countBy = (items, field) =>
  Object.fromEntries(
    [...new Set(items.map((row) => row[field]))].map((value) => [
      value,
      items.filter((row) => row[field] === value).length,
    ]),
  );
const laneCounts = countBy(records, "lane");
if (JSON.stringify(laneCounts) !== JSON.stringify({ A: 100, B: 100, C: 100 })) {
  throw new Error(`Invalid sequential lane counts: ${JSON.stringify(laneCounts)}`);
}
for (const lane of ["A", "B", "C"]) {
  const laneRecords = records.filter((row) => row.lane === lane);
  if (new Set(laneRecords.map((row) => row.domain)).size !== 5) {
    throw new Error(`CA-0004 lane ${lane} does not cover all five available domains`);
  }
}

const result = {
  artifact: "DALILI_CA_0004_SELECTION_01",
  version: "1.0",
  status: "FROZEN_DETERMINISTIC_SELECTION_NOT_MATERIALIZED",
  selection_rule:
    "selectCa0004; excludes CA-0001, CA-0002, and CA-0003; largest-remainder proportional quotas over the remaining eligible source ledger; deterministic round-robin across the five available domains; balanced sequential 100-source lanes A/B/C.",
  proportional_basis: {
    remaining_eligible_count: 963,
    remaining_disposition_counts: {
      REWRITE_REQUIRED: 740,
      ACCEPTED: 160,
      SPLIT_REQUIRED: 48,
      MERGED_BY_PROVENANCE: 15,
    },
    selected_disposition_quotas: {
      REWRITE_REQUIRED: 231,
      ACCEPTED: 50,
      SPLIT_REQUIRED: 15,
      MERGED_BY_PROVENANCE: 4,
    },
  },
  available_domains: ["DOM-COMM", "DOM-FOOD", "DOM-HEALTH", "DOM-HOME", "DOM-SHOP"],
  exhausted_domains: ["DOM-CLO"],
  source_count: 300,
  lane_counts: laneCounts,
  disposition_counts: countBy(records, "disposition"),
  domain_counts: countBy(records, "domain"),
  lane_summaries: Object.fromEntries(
    ["A", "B", "C"].map((lane) => {
      const laneRecords = records.filter((row) => row.lane === lane);
      return [lane, {
        source_count: laneRecords.length,
        disposition_counts: countBy(laneRecords, "disposition"),
        domain_counts: countBy(laneRecords, "domain"),
      }];
    }),
  ),
  invariants: {
    prior_batches_excluded: true,
    unique_source_ids: true,
    exact_source_count: true,
    proportional_quotas_satisfied: true,
    all_five_available_domains_covered: true,
    exhausted_domain_not_invented: true,
    sequential_lane_partition: true,
    authoritative_hash_and_identity_embedded: true,
  },
  execution_boundary: {
    candidates_created: false,
    materialization_performed: false,
    legacy_master_mutated: false,
    canonical_validator_changed: false,
  },
  records,
};

const output = path.join(dataDir, "DALILI_CA_0004_SELECTION_01.json");
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output, source_count: 300, lane_counts: laneCounts }, null, 2)}\n`);

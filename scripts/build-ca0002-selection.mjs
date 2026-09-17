import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadApprovedRows, selectCa0001, selectCa0002 } from "./contract-alignment-routing.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const first = selectCa0001(loadApprovedRows(dataDir));
const selected = selectCa0002(loadApprovedRows(dataDir));
const firstIds = new Set(first.map((row) => row.legacy_id));

if (selected.length !== 100) throw new Error("CA-0002 selection must contain 100 sources");
if (new Set(selected.map((row) => row.legacy_id)).size !== 100) throw new Error("Duplicate CA-0002 source");
if (selected.some((row) => firstIds.has(row.legacy_id))) throw new Error("CA-0001 overlap detected");

const records = selected.map((row, index) => ({
  selection_ordinal: index + 1,
  lane: ["A", "B", "C"][index % 3],
  ...row,
}));

const countBy = (field) =>
  Object.fromEntries(
    [...new Set(records.map((row) => row[field]))].map((value) => [
      value,
      records.filter((row) => row[field] === value).length,
    ]),
  );

const result = {
  artifact: "DALILI_CA_0002_SELECTION_01",
  version: "1.0",
  status: "FROZEN_DETERMINISTIC_SELECTION_NOT_MATERIALIZED",
  selection_rule: "selectCa0002; excludes CA-0001; frozen disposition quotas; round-robin domain coverage.",
  source_count: 100,
  lane_counts: countBy("lane"),
  disposition_counts: countBy("disposition"),
  domain_counts: countBy("domain"),
  execution_boundary: {
    materialization_performed: false,
    legacy_master_mutated: false,
    canonical_validator_changed: false,
  },
  records,
};

const output = path.join(dataDir, "DALILI_CA_0002_SELECTION_01.json");
fs.writeFileSync(output, `${JSON.stringify(result, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ output, source_count: 100, lane_counts: result.lane_counts }, null, 2)}\n`);

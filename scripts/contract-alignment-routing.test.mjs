import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DISPOSITIONS,
  FULL_CORPUS_DISTRIBUTION,
  assertConservation,
  loadApprovedRows,
  routeContractCandidate,
  selectCa0001,
  validateSourceLedger,
} from "./contract-alignment-routing.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(here, "../docs/audit/data");
const approved = loadApprovedRows(dataDir);

test("unified source ledger proves the complete 1413-record universe", () => {
  const ledger = JSON.parse(
    readFileSync(path.join(dataDir, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json"), "utf8"),
  );
  assert.deepEqual(validateSourceLedger(ledger), {
    count: 1413,
    distribution: FULL_CORPUS_DISTRIBUTION,
  });
  assert.equal(approved.length, 1413);
});

test("CA-0001 selects 50 real approved source rows deterministically", () => {
  const first = selectCa0001(approved);
  const second = selectCa0001(approved);
  assert.equal(first.length, 50);
  assert.deepEqual(first, second);
  assert.equal(new Set(first.map((row) => row.legacy_id)).size, 50);
  assert.ok(first.every((row) => approved.some((source) =>
    source.legacy_id === row.legacy_id &&
    source.corpus_position === row.corpus_position &&
    source.disposition === row.disposition,
  )));
});

test("CA-0001 covers every approved disposition and all six domains", () => {
  const selected = selectCa0001(approved);
  assert.deepEqual(new Set(selected.map((row) => row.disposition)), new Set(DISPOSITIONS));
  assert.equal(new Set(selected.map((row) => row.domain)).size, 6);
});

test("routing is deterministic and fail-closed", () => {
  const green = {
    contract_complete: true,
    canonical: { passed_gates: 7, total_gates: 7 },
    complexity: { valid: true },
    provenance: { complete: true },
    duplicate_conflict: false,
    safety_concern: false,
  };
  assert.equal(routeContractCandidate(green), "GREEN");
  assert.equal(routeContractCandidate(green), "GREEN");
  assert.equal(routeContractCandidate({ ...green, repairable: true, contract_complete: false }), "AMBER");
  assert.equal(routeContractCandidate({ ...green, canonical: { ...green.canonical, unsafe: true } }), "RED");
  assert.equal(routeContractCandidate({}), "RED");
});

test("conservation detects duplicates, orphans and silent drops", () => {
  const input = selectCa0001(approved);
  assert.equal(assertConservation({ input, routed: input }).pass, true);
  const damaged = [...input.slice(1), input[1], { ...input[0], legacy_id: "ORPHAN-ID" }];
  const result = assertConservation({ input, routed: damaged });
  assert.equal(result.pass, false);
  assert.deepEqual(result.duplicate_ids, [input[1].legacy_id]);
  assert.deepEqual(result.orphan_ids, ["ORPHAN-ID"]);
  assert.deepEqual(result.silent_drop_ids, [input[0].legacy_id]);
});

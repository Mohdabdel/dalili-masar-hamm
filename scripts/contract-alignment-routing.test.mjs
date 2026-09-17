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
  selectCa0002,
  selectCa0003,
  selectCa0004,
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

test("CA-0004 selects 300 new sources across the five remaining domains", () => {
  const prior = new Set([
    ...selectCa0001(approved).map((row) => row.legacy_id),
    ...selectCa0002(approved).map((row) => row.legacy_id),
    ...selectCa0003(approved).map((row) => row.legacy_id),
  ]);
  const selected = selectCa0004(approved);
  assert.equal(selected.length, 300);
  assert.equal(new Set(selected.map((row) => row.legacy_id)).size, 300);
  assert.equal(selected.some((row) => prior.has(row.legacy_id)), false);
  assert.deepEqual(
    Object.fromEntries(
      ["REWRITE_REQUIRED", "ACCEPTED", "SPLIT_REQUIRED", "MERGED_BY_PROVENANCE"].map(
        (disposition) => [disposition, selected.filter((row) => row.disposition === disposition).length],
      ),
    ),
    { REWRITE_REQUIRED: 231, ACCEPTED: 50, SPLIT_REQUIRED: 15, MERGED_BY_PROVENANCE: 4 },
  );
  assert.deepEqual(
    [...new Set(selected.map((row) => row.domain))].sort(),
    ["DOM-COMM", "DOM-FOOD", "DOM-HEALTH", "DOM-HOME", "DOM-SHOP"],
  );
  const lanes = [selected.slice(0, 100), selected.slice(100, 200), selected.slice(200, 300)];
  assert.deepEqual(lanes.map((lane) => lane.length), [100, 100, 100]);
  assert.ok(lanes.every((lane) => new Set(lane.map((row) => row.domain)).size === 5));
  assert.deepEqual(selected, selectCa0004(approved));

  const ledger = JSON.parse(
    readFileSync(path.join(dataDir, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json"), "utf8"),
  );
  const ledgerById = new Map(ledger.records.map((row) => [row.legacy_id, row]));
  const artifact = JSON.parse(
    readFileSync(path.join(dataDir, "DALILI_CA_0004_SELECTION_01.json"), "utf8"),
  );
  assert.equal(artifact.records.length, 300);
  for (const record of artifact.records) {
    const source = ledgerById.get(record.legacy_id);
    assert.ok(source);
    assert.equal(record.source_record_sha256, source.source_record_sha256);
    assert.deepEqual(record.source_identity, source.source_identity);
    assert.equal(record.classification_artifact, source.classification_artifact);
  }
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

test("CA-0002 selects 100 new sources with frozen quotas and six-domain coverage", () => {
  const first = selectCa0001(approved);
  const second = selectCa0002(approved);
  assert.equal(second.length, 100);
  assert.equal(new Set(second.map((row) => row.legacy_id)).size, 100);
  assert.equal(
    second.some((row) => first.some((prior) => prior.legacy_id === row.legacy_id)),
    false,
  );
  assert.deepEqual(
    Object.fromEntries(
      ["REWRITE_REQUIRED", "ACCEPTED", "SPLIT_REQUIRED", "MERGED_BY_PROVENANCE"].map(
        (disposition) => [disposition, second.filter((row) => row.disposition === disposition).length],
      ),
    ),
    { REWRITE_REQUIRED: 75, ACCEPTED: 17, SPLIT_REQUIRED: 6, MERGED_BY_PROVENANCE: 2 },
  );
  assert.equal(new Set(second.map((row) => row.domain)).size, 6);
  assert.deepEqual(second, selectCa0002(approved));
});

test("CA-0003 selects 300 new sources proportionally with sequential 100-source lanes", () => {
  const prior = new Set([
    ...selectCa0001(approved).map((row) => row.legacy_id),
    ...selectCa0002(approved).map((row) => row.legacy_id),
  ]);
  const selected = selectCa0003(approved);
  assert.equal(selected.length, 300);
  assert.equal(new Set(selected.map((row) => row.legacy_id)).size, 300);
  assert.equal(selected.some((row) => prior.has(row.legacy_id)), false);
  assert.deepEqual(
    Object.fromEntries(
      ["REWRITE_REQUIRED", "ACCEPTED", "SPLIT_REQUIRED", "MERGED_BY_PROVENANCE"].map(
        (disposition) => [disposition, selected.filter((row) => row.disposition === disposition).length],
      ),
    ),
    { REWRITE_REQUIRED: 231, ACCEPTED: 50, SPLIT_REQUIRED: 15, MERGED_BY_PROVENANCE: 4 },
  );
  assert.equal(new Set(selected.map((row) => row.domain)).size, 6);
  const lanes = [selected.slice(0, 100), selected.slice(100, 200), selected.slice(200, 300)];
  assert.deepEqual(lanes.map((lane) => lane.length), [100, 100, 100]);
  assert.ok(lanes.every((lane) => new Set(lane.map((row) => row.domain)).size === 6));
  assert.deepEqual(selected, selectCa0003(approved));

  const ledger = JSON.parse(
    readFileSync(path.join(dataDir, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json"), "utf8"),
  );
  const ledgerById = new Map(ledger.records.map((row) => [row.legacy_id, row]));
  const artifact = JSON.parse(
    readFileSync(path.join(dataDir, "DALILI_CA_0003_SELECTION_01.json"), "utf8"),
  );
  assert.equal(artifact.records.length, 300);
  for (const record of artifact.records) {
    const source = ledgerById.get(record.legacy_id);
    assert.ok(source);
    assert.equal(record.source_record_sha256, source.source_record_sha256);
    assert.deepEqual(record.source_identity, source.source_identity);
    assert.equal(record.classification_artifact, source.classification_artifact);
  }
});

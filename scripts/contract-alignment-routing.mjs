import fs from "node:fs";
import path from "node:path";

export const DISPOSITIONS = Object.freeze([
  "ACCEPTED",
  "REWRITE_REQUIRED",
  "SPLIT_REQUIRED",
  "MERGED_BY_PROVENANCE",
  "EVENT_ONLY",
  "EXECUTION_BLOCK_ONLY",
  "EXCLUDED_WITH_REASON",
]);

export const FULL_CORPUS_DISTRIBUTION = Object.freeze({
  ACCEPTED: 238,
  REWRITE_REQUIRED: 1059,
  SPLIT_REQUIRED: 79,
  MERGED_BY_PROVENANCE: 32,
  EVENT_ONLY: 2,
  EXECUTION_BLOCK_ONLY: 1,
  EXCLUDED_WITH_REASON: 2,
});

const DOMAIN_BY_PREFIX = Object.freeze({
  CLO: "DOM-CLO",
  COMM: "DOM-COMM",
  FOOD: "DOM-FOOD",
  HEALTH: "DOM-HEALTH",
  HOME: "DOM-HOME",
  SHOP: "DOM-SHOP",
});

export function loadApprovedRows(dataDir) {
  const ledgerPath = path.join(dataDir, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json");
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8"));
  validateSourceLedger(ledger);
  return ledger.records.map((record) => ({
    corpus_position: record.corpus_position,
    legacy_id: record.legacy_id,
    domain: record.source_identity.domain_id,
    disposition: record.disposition,
    source_artifact: record.classification_artifact.replace(/\.json$/, ""),
  })).sort(
    (a, b) => a.corpus_position - b.corpus_position || a.legacy_id.localeCompare(b.legacy_id),
  );
}

export function validateSourceLedger(ledger) {
  if (!Array.isArray(ledger.records) || ledger.records.length !== 1413) {
    throw new Error("Source ledger must contain exactly 1413 records");
  }
  const ids = ledger.records.map((record) => record.legacy_id);
  const positions = ledger.records.map((record) => record.corpus_position);
  if (new Set(ids).size !== 1413) throw new Error("Source ledger legacy IDs are not unique");
  if (new Set(positions).size !== 1413) throw new Error("Source ledger positions are not unique");
  const sortedPositions = [...positions].sort((a, b) => a - b);
  if (sortedPositions.some((position, index) => position !== index + 1)) {
    throw new Error("Source ledger coverage is not continuous from 1 to 1413");
  }
  const distribution = Object.fromEntries(DISPOSITIONS.map((disposition) => [disposition, 0]));
  for (const record of ledger.records) {
    if (!DISPOSITIONS.includes(record.disposition)) {
      throw new Error(`Unsupported ledger disposition ${record.disposition}`);
    }
    if (!record.source_identity?.domain_id || !record.classification_artifact) {
      throw new Error(`Incomplete source identity for ${record.legacy_id}`);
    }
    distribution[record.disposition] += 1;
  }
  if (JSON.stringify(distribution) !== JSON.stringify(FULL_CORPUS_DISTRIBUTION)) {
    throw new Error(`Full-corpus distribution mismatch: ${JSON.stringify(distribution)}`);
  }
  if (
    ledger.conservation?.coverage_gate !== "PASS" ||
    ledger.conservation?.uniqueness_gate !== "PASS" ||
    ledger.conservation?.source_identity_gate !== "PASS" ||
    ledger.conservation?.distribution_gate !== "PASS"
  ) {
    throw new Error("Source ledger governing conservation gates are not PASS");
  }
  return { count: 1413, distribution };
}

export function selectCa0001(rows, target = 50) {
  if (target < DISPOSITIONS.length) throw new Error("Target cannot cover every disposition");
  const selected = new Map();
  const add = (row) => row && selected.set(row.legacy_id, row);

  for (const disposition of DISPOSITIONS) {
    add(rows.find((row) => row.disposition === disposition));
  }
  for (const domain of Object.values(DOMAIN_BY_PREFIX)) {
    add(rows.find((row) => row.domain === domain));
  }

  let cursor = 0;
  while (selected.size < target) {
    const disposition = DISPOSITIONS[cursor % DISPOSITIONS.length];
    add(rows.find((row) => row.disposition === disposition && !selected.has(row.legacy_id)));
    cursor += 1;
    if (cursor > rows.length * DISPOSITIONS.length) {
      throw new Error(`Unable to select ${target} distinct approved rows`);
    }
  }

  return [...selected.values()].sort(
    (a, b) => a.corpus_position - b.corpus_position || a.legacy_id.localeCompare(b.legacy_id),
  );
}

/**
 * أول دفعة توسع قياسية بعد المعايرة. تستبعد CA-0001 وتوزع كل حصة
 * دوريًا على المجالات الستة لمنع استهلاك مجال واحد قبل اختبار البقية.
 */
export function selectCa0002(rows) {
  const excluded = new Set(selectCa0001(rows).map((row) => row.legacy_id));
  const quotas = Object.freeze({
    REWRITE_REQUIRED: 75,
    ACCEPTED: 17,
    SPLIT_REQUIRED: 6,
    MERGED_BY_PROVENANCE: 2,
  });
  const domains = Object.values(DOMAIN_BY_PREFIX);
  const selected = [];

  for (const [disposition, quota] of Object.entries(quotas)) {
    const pools = new Map(
      domains.map((domain) => [
        domain,
        rows.filter(
          (row) =>
            row.disposition === disposition &&
            row.domain === domain &&
            !excluded.has(row.legacy_id),
        ),
      ]),
    );
    let domainCursor = 0;
    while (selected.filter((row) => row.disposition === disposition).length < quota) {
      let added = false;
      for (let attempt = 0; attempt < domains.length; attempt += 1) {
        const domain = domains[(domainCursor + attempt) % domains.length];
        const row = pools.get(domain).shift();
        if (row) {
          selected.push(row);
          excluded.add(row.legacy_id);
          domainCursor = (domains.indexOf(domain) + 1) % domains.length;
          added = true;
          break;
        }
      }
      if (!added) throw new Error(`Unable to satisfy CA-0002 quota for ${disposition}`);
    }
  }

  return selected.sort(
    (a, b) => a.corpus_position - b.corpus_position || a.legacy_id.localeCompare(b.legacy_id),
  );
}

/**
 * دفعة التوسع الثالثة: 300 مصدر جديد بعد استبعاد الدفعتين السابقتين.
 * الحصص تمثل أكبر البواقي للتوزيع النسبي للمخزون المتبقي (1263 مصدرًا):
 * 971 إعادة صياغة، 210 مقبول، 63 تقسيم، 19 دمج بالمصدر.
 */
export function selectCa0003(rows) {
  const priorIds = new Set([
    ...selectCa0001(rows).map((row) => row.legacy_id),
    ...selectCa0002(rows).map((row) => row.legacy_id),
  ]);
  const quotas = Object.freeze({
    REWRITE_REQUIRED: 231,
    ACCEPTED: 50,
    SPLIT_REQUIRED: 15,
    MERGED_BY_PROVENANCE: 4,
  });
  const domains = Object.values(DOMAIN_BY_PREFIX);
  const selected = [];

  for (const [disposition, quota] of Object.entries(quotas)) {
    const pools = new Map(
      domains.map((domain) => [
        domain,
        rows.filter(
          (row) =>
            row.disposition === disposition &&
            row.domain === domain &&
            !priorIds.has(row.legacy_id),
        ),
      ]),
    );
    let domainCursor = 0;
    let dispositionCount = 0;
    while (dispositionCount < quota) {
      let added = false;
      for (let attempt = 0; attempt < domains.length; attempt += 1) {
        const domain = domains[(domainCursor + attempt) % domains.length];
        const row = pools.get(domain).shift();
        if (row) {
          selected.push(row);
          priorIds.add(row.legacy_id);
          dispositionCount += 1;
          domainCursor = (domains.indexOf(domain) + 1) % domains.length;
          added = true;
          break;
        }
      }
      if (!added) throw new Error(`Unable to satisfy CA-0003 quota for ${disposition}`);
    }
  }

  const domainPools = new Map(
    domains.map((domain) => [
      domain,
      selected
        .filter((row) => row.domain === domain)
        .sort(
          (a, b) =>
            a.corpus_position - b.corpus_position || a.legacy_id.localeCompare(b.legacy_id),
        ),
    ]),
  );
  const lanes = [[], [], []];
  let laneCursor = 0;
  for (const domain of domains) {
    for (const row of domainPools.get(domain)) {
      const minimum = Math.min(...lanes.map((lane) => lane.length));
      let laneIndex = -1;
      for (let attempt = 0; attempt < lanes.length; attempt += 1) {
        const candidate = (laneCursor + attempt) % lanes.length;
        if (lanes[candidate].length === minimum) {
          laneIndex = candidate;
          break;
        }
      }
      if (laneIndex < 0) throw new Error("Unable to balance CA-0003 lanes");
      lanes[laneIndex].push(row);
      laneCursor = (laneIndex + 1) % lanes.length;
    }
  }
  return lanes.flat();
}

/**
 * دفعة التوسع الرابعة: 300 مصدر جديد بعد استبعاد CA-0001/2/3.
 * الحصص هي ناتج أكبر البواقي للمخزون المتبقي البالغ 963 مصدرًا.
 * لا يوجد مخزون متبقٍ في DOM-CLO، لذا يجري التوزيع على المجالات الخمسة
 * المتاحة فقط دون إنشاء تمثيل مصطنع للمجال المنفد.
 */
export function selectCa0004(rows) {
  const priorIds = new Set([
    ...selectCa0001(rows).map((row) => row.legacy_id),
    ...selectCa0002(rows).map((row) => row.legacy_id),
    ...selectCa0003(rows).map((row) => row.legacy_id),
  ]);
  const quotas = Object.freeze({
    REWRITE_REQUIRED: 231,
    ACCEPTED: 50,
    SPLIT_REQUIRED: 15,
    MERGED_BY_PROVENANCE: 4,
  });
  const domains = Object.values(DOMAIN_BY_PREFIX).filter((domain) => domain !== "DOM-CLO");
  const selected = [];

  for (const [disposition, quota] of Object.entries(quotas)) {
    const pools = new Map(
      domains.map((domain) => [
        domain,
        rows.filter(
          (row) =>
            row.disposition === disposition &&
            row.domain === domain &&
            !priorIds.has(row.legacy_id),
        ),
      ]),
    );
    let domainCursor = 0;
    let dispositionCount = 0;
    while (dispositionCount < quota) {
      let added = false;
      for (let attempt = 0; attempt < domains.length; attempt += 1) {
        const domain = domains[(domainCursor + attempt) % domains.length];
        const row = pools.get(domain).shift();
        if (row) {
          selected.push(row);
          priorIds.add(row.legacy_id);
          dispositionCount += 1;
          domainCursor = (domains.indexOf(domain) + 1) % domains.length;
          added = true;
          break;
        }
      }
      if (!added) throw new Error(`Unable to satisfy CA-0004 quota for ${disposition}`);
    }
  }

  const domainPools = new Map(
    domains.map((domain) => [
      domain,
      selected
        .filter((row) => row.domain === domain)
        .sort(
          (a, b) =>
            a.corpus_position - b.corpus_position || a.legacy_id.localeCompare(b.legacy_id),
        ),
    ]),
  );
  const lanes = [[], [], []];
  let laneCursor = 0;
  for (const domain of domains) {
    for (const row of domainPools.get(domain)) {
      const minimum = Math.min(...lanes.map((lane) => lane.length));
      let laneIndex = -1;
      for (let attempt = 0; attempt < lanes.length; attempt += 1) {
        const candidate = (laneCursor + attempt) % lanes.length;
        if (lanes[candidate].length === minimum) {
          laneIndex = candidate;
          break;
        }
      }
      if (laneIndex < 0) throw new Error("Unable to balance CA-0004 lanes");
      lanes[laneIndex].push(row);
      laneCursor = (laneIndex + 1) % lanes.length;
    }
  }
  return lanes.flat();
}

export function routeContractCandidate(candidate) {
  const canonical = candidate.canonical ?? {};
  const complexity = candidate.complexity ?? {};
  const provenance = candidate.provenance ?? {};
  const hardRed =
    canonical.unsafe === true ||
    canonical.prohibited_semantics === true ||
    provenance.source_conflict === true ||
    provenance.unresolved === true ||
    candidate.duplicate_conflict === true;
  if (hardRed) return "RED";

  const green =
    candidate.contract_complete === true &&
    canonical.passed_gates === 7 &&
    canonical.total_gates === 7 &&
    complexity.valid === true &&
    provenance.complete === true &&
    candidate.duplicate_conflict === false &&
    candidate.safety_concern === false;
  if (green) return "GREEN";

  const repairable =
    candidate.repairable === true ||
    canonical.wording_issue === true ||
    complexity.rationale_issue === true ||
    provenance.limited_ambiguity === true ||
    candidate.split_merge_decision_needed === true;
  return repairable ? "AMBER" : "RED";
}

export function assertConservation({ input, routed }) {
  const inputIds = input.map((row) => row.legacy_id);
  const routedIds = routed.map((row) => row.legacy_id);
  const duplicates = routedIds.filter((id, index) => routedIds.indexOf(id) !== index);
  const inputSet = new Set(inputIds);
  const routedSet = new Set(routedIds);
  const orphans = routedIds.filter((id) => !inputSet.has(id));
  const silentDrops = inputIds.filter((id) => !routedSet.has(id));
  return {
    pass:
      inputIds.length === routedIds.length &&
      duplicates.length === 0 &&
      orphans.length === 0 &&
      silentDrops.length === 0,
    input_count: inputIds.length,
    routed_count: routedIds.length,
    duplicate_ids: [...new Set(duplicates)],
    orphan_ids: [...new Set(orphans)],
    silent_drop_ids: [...new Set(silentDrops)],
  };
}

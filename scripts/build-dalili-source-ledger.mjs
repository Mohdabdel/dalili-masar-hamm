import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dataDirectory = resolve(repositoryRoot, "docs/audit/data");
const legacyPath = resolve(dataDirectory, "DALILI_LEGACY_CORPUS_EXPORT_01.json");
const closurePath = resolve(dataDirectory, "DALILI_CLASSIFICATION_FULL_CORPUS_CLOSURE_01.json");
const outputPath = resolve(dataDirectory, "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01.json");

const approvedDistribution = {
  ACCEPTED: 238,
  REWRITE_REQUIRED: 1059,
  SPLIT_REQUIRED: 79,
  MERGED_BY_PROVENANCE: 32,
  EVENT_ONLY: 2,
  EXECUTION_BLOCK_ONLY: 1,
  EXCLUDED_WITH_REASON: 2,
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value !== null && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function invariant(condition, message) {
  if (!condition) throw new Error(`SOURCE_LEDGER_INVARIANT_FAILED: ${message}`);
}

function classifyArtifact(artifact, sourceRecords, start, end) {
  const rows = [];
  const sourceSlice = sourceRecords.slice(start - 1, end);
  const byId = new Map(sourceSlice.map((record, offset) => [record.legacy_id, { record, position: start + offset }]));

  const add = (position, legacyId, classification) => {
    const source = sourceRecords[position - 1];
    invariant(source, `missing source at corpus position ${position}`);
    invariant(source.legacy_id === legacyId, `position/id mismatch at ${position}: ${legacyId} != ${source.legacy_id}`);
    rows.push({ corpus_position: position, legacy_id: legacyId, ...classification });
  };

  if (Array.isArray(artifact.results)) {
    for (const result of artifact.results) {
      add(result.corpus_position, result.legacy_id, {
        disposition: result.disposition,
        confidence: result.confidence ?? null,
        semantic_type: result.semantic_type ?? null,
        needs_human_review: result.needs_human_review ?? false,
        functional_role_statement: result.functional_role_statement ?? null,
        existing_framework_lineage_assessment: result.existing_framework_lineage_assessment ?? null,
        existing_framework_lineage_evidence: result.existing_framework_lineage_evidence ?? [],
        duplicate_assessment: result.duplicate_assessment ?? null,
      });
    }
  } else if (Array.isArray(artifact.record_manifest)) {
    for (const result of artifact.record_manifest) {
      add(result.corpus_position, result.legacy_id, {
        disposition: result.disposition,
        confidence: result.confidence ?? null,
        semantic_type: result.semantic_type ?? null,
        needs_human_review: result.needs_human_review ?? false,
        functional_role_statement: result.functional_role_statement ?? null,
        existing_framework_lineage_assessment: result.existing_framework_lineage_assessment ?? null,
        existing_framework_lineage_evidence: result.existing_framework_lineage_evidence ?? [],
        duplicate_assessment: result.duplicate_assessment ?? null,
      });
    }
  } else if (Array.isArray(artifact.approved_ranges)) {
    for (const range of artifact.approved_ranges) {
      for (const [legacyId, disposition] of Object.entries(range.decisions)) {
        const match = byId.get(legacyId);
        invariant(match, `decision ${legacyId} is outside declared source range ${start}-${end}`);
        add(match.position, legacyId, {
          disposition,
          confidence: "HIGH",
          semantic_type: disposition === "SPLIT_REQUIRED" ? "MULTI_ROLE" : "FUNCTIONAL_PARTICIPATION",
          needs_human_review: false,
          functional_role_statement: null,
          existing_framework_lineage_assessment: disposition === "MERGED_BY_PROVENANCE" ? "PRESERVED" : "NONE",
          existing_framework_lineage_evidence: [],
          duplicate_assessment: null,
        });
      }
    }
  } else if (artifact.representation === "DEFAULT_PLUS_OVERRIDES") {
    for (let offset = 0; offset < sourceSlice.length; offset += 1) {
      const source = sourceSlice[offset];
      const override = artifact.overrides?.[source.legacy_id];
      const classification = override ?? artifact.default_classification;
      add(start + offset, source.legacy_id, {
        disposition: classification.disposition,
        confidence: classification.governing_confidence ?? null,
        semantic_type: classification.disposition === "SPLIT_REQUIRED" ? "MULTI_ROLE" : "FUNCTIONAL_PARTICIPATION",
        needs_human_review: classification.needs_human_review ?? false,
        functional_role_statement: null,
        existing_framework_lineage_assessment:
          classification.disposition === "MERGED_BY_PROVENANCE" ? "ALIGNED" : "NONE",
        existing_framework_lineage_evidence: [],
        duplicate_assessment: null,
      });
    }
  } else if (artifact.governing_decisions) {
    for (let offset = 0; offset < sourceSlice.length; offset += 1) {
      const source = sourceSlice[offset];
      const disposition = artifact.governing_decisions[source.legacy_id] ?? "REWRITE_REQUIRED";
      add(start + offset, source.legacy_id, {
        disposition,
        confidence: "HIGH",
        semantic_type: "FUNCTIONAL_PARTICIPATION",
        needs_human_review: false,
        functional_role_statement: null,
        existing_framework_lineage_assessment: disposition === "MERGED_BY_PROVENANCE" ? "ALIGNED" : "NONE",
        existing_framework_lineage_evidence:
          disposition === "MERGED_BY_PROVENANCE" && artifact.merged_reference
            ? [{ framework_reference_id: artifact.merged_reference, source: artifact.artifact }]
            : [],
        duplicate_assessment: null,
      });
    }
  } else if (artifact.default_disposition) {
    for (let offset = 0; offset < sourceSlice.length; offset += 1) {
      const source = sourceSlice[offset];
      add(start + offset, source.legacy_id, {
        disposition: artifact.default_disposition,
        confidence: artifact.governing_confidence ?? "HIGH",
        semantic_type: artifact.semantic_type ?? "FUNCTIONAL_PARTICIPATION",
        needs_human_review: artifact.needs_human_review ?? false,
        functional_role_statement: null,
        existing_framework_lineage_assessment: artifact.lineage ?? "NONE",
        existing_framework_lineage_evidence: [],
        duplicate_assessment: artifact.duplicates ?? null,
      });
    }
  } else {
    throw new Error(`Unsupported classification representation: ${artifact.artifact}`);
  }

  invariant(rows.length === end - start + 1, `${artifact.artifact} produced ${rows.length} rows, expected ${end - start + 1}`);
  return rows.sort((left, right) => left.corpus_position - right.corpus_position);
}

async function main() {
  const legacyRaw = await readFile(legacyPath);
  const closureRaw = await readFile(closurePath);
  const legacy = JSON.parse(legacyRaw);
  const closure = JSON.parse(closureRaw);

  invariant(legacy.records.length === closure.target_count, "Legacy record count does not match closure target");
  invariant(sha256(legacyRaw) === closure.legacy_source_sha256, "Legacy SHA-256 does not match frozen closure hash");

  const classificationArtifacts = [];
  const normalizedClassifications = [];
  for (const range of closure.ranges) {
    const artifactPath = resolve(dataDirectory, range.file);
    const raw = await readFile(artifactPath);
    const artifact = JSON.parse(raw);
    classificationArtifacts.push({
      file: range.file,
      start: range.start,
      end: range.end,
      count: range.count,
      sha256: sha256(raw),
    });
    normalizedClassifications.push(...classifyArtifact(artifact, legacy.records, range.start, range.end));
  }

  const positionSet = new Set(normalizedClassifications.map((row) => row.corpus_position));
  const legacyIdSet = new Set(normalizedClassifications.map((row) => row.legacy_id));
  invariant(normalizedClassifications.length === 1413, "normalized row count must equal 1413");
  invariant(positionSet.size === 1413, "corpus positions must be unique");
  invariant(legacyIdSet.size === 1413, "Legacy IDs must be unique");
  invariant(normalizedClassifications.every((row, index) => row.corpus_position === index + 1), "coverage must be continuous 1-1413");

  const distribution = Object.fromEntries(Object.keys(approvedDistribution).map((key) => [key, 0]));
  for (const row of normalizedClassifications) {
    invariant(Object.hasOwn(distribution, row.disposition), `unsupported disposition ${row.disposition}`);
    distribution[row.disposition] += 1;
  }
  invariant(stableJson(distribution) === stableJson(approvedDistribution), "distribution does not match approved classification totals");

  const records = normalizedClassifications.map((classification) => {
    const source = legacy.records[classification.corpus_position - 1];
    return {
      corpus_position: classification.corpus_position,
      legacy_id: classification.legacy_id,
      source_identity: {
        opportunity_id: source.opportunity_id,
        opportunity_title_ar: source.opportunity_title_ar,
        parent_event_id: source.parent_event_id,
        parent_event_title_ar: source.parent_event_title_ar,
        domain_id: source.domain_id,
      },
      source_record_sha256: sha256(stableJson(source)),
      classification_artifact: classification.classification_artifact,
      disposition: classification.disposition,
      confidence: classification.confidence,
      semantic_type: classification.semantic_type,
      needs_human_review: classification.needs_human_review,
      functional_role_statement: classification.functional_role_statement,
      existing_framework_lineage_assessment: classification.existing_framework_lineage_assessment,
      existing_framework_lineage_evidence: classification.existing_framework_lineage_evidence,
      duplicate_assessment: classification.duplicate_assessment,
      contract_alignment_state: "PENDING",
    };
  });

  for (const range of closure.ranges) {
    for (let position = range.start; position <= range.end; position += 1) {
      normalizedClassifications[position - 1].classification_artifact = range.file;
      records[position - 1].classification_artifact = range.file;
    }
  }

  const ledger = {
    artifact: "DALILI_CONTRACT_ALIGNMENT_SOURCE_LEDGER_01",
    version: "1.0",
    governance_status: "GENERATED_VERIFIED_INPUT_CONTROL",
    purpose: "Deterministic one-row-per-Legacy-source ledger for Contract Alignment planning only.",
    execution_boundary: {
      materialization_performed: false,
      legacy_master_mutated: false,
      canonical_validator_changed: false,
    },
    source_control: {
      legacy_file: "DALILI_LEGACY_CORPUS_EXPORT_01.json",
      legacy_sha256: sha256(legacyRaw),
      classification_closure_file: "DALILI_CLASSIFICATION_FULL_CORPUS_CLOSURE_01.json",
      classification_closure_sha256: sha256(closureRaw),
      classification_artifacts: classificationArtifacts,
      per_record_hash: {
        algorithm: "SHA-256",
        canonicalization: "Recursive lexicographic object-key ordering; array order preserved; compact JSON encoding.",
        scope: "Complete corresponding object from DALILI_LEGACY_CORPUS_EXPORT_01.json records[]",
      },
    },
    approved_distribution: approvedDistribution,
    governing_rules: {
      source_cardinality: "Exactly one ledger row per frozen Legacy source record.",
      identity_join: "Both corpus_position and legacy_id must match the frozen Legacy export.",
      uniqueness: "corpus_position and legacy_id must each be globally unique across all 1,413 rows.",
      conservation: "The ledger must cover every integer position 1-1413 exactly once and preserve the approved disposition total of 1,413.",
      split_accounting: "Future split children are outputs linked to one source row; they never increase source-ledger cardinality.",
      merge_accounting: "MERGED_BY_PROVENANCE links a source to an existing reference and never authorizes a duplicate output.",
      immutable_boundary: "Generation must not alter Legacy Master, the canonical validator, or any production/materialized dataset.",
    },
    conservation: {
      target_source_count: 1413,
      ledger_record_count: records.length,
      continuous_coverage: "1-1413",
      unique_corpus_positions: positionSet.size,
      unique_legacy_ids: legacyIdSet.size,
      unresolved: 0,
      coverage_gate: "PASS",
      uniqueness_gate: "PASS",
      source_identity_gate: "PASS",
      distribution_gate: "PASS",
    },
    representation_notes: [
      "Every Legacy source has exactly one ledger row regardless of future output cardinality.",
      "SPLIT_REQUIRED children must be tracked separately and must not increase the Legacy source count.",
      "MERGED_BY_PROVENANCE rows link to existing references and do not authorize creation of a duplicate reference.",
      "An empty lineage-evidence array means the compact approved classification artifact did not embed a target; it does not revoke the approved disposition.",
    ],
    records,
  };

  await writeFile(outputPath, `${JSON.stringify(ledger, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify({ output: outputPath, records: records.length, distribution, conservation: ledger.conservation }, null, 2)}\n`);
}

await main();

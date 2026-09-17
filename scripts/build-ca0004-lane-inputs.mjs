import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "docs/audit/data");
const selection = JSON.parse(
  fs.readFileSync(path.join(dataDir, "DALILI_CA_0004_SELECTION_01.json"), "utf8"),
);

const draftingContract = {
  source_outcome_schema: {
    source: "exact selection row including source_record_sha256 and source_identity",
    decision: {
      output_kind: "FP_CANDIDATE | SPLIT_FP_CANDIDATES | PROVENANCE_LINK",
      relationship: "NEUTRAL_REWRITE | ACCEPTED_ALIGNMENT | SPLIT_DERIVATION | MERGED_PROVENANCE",
      decision_rationale: "source-grounded, non-generic text",
    },
    candidates: "array; one for ACCEPTED/REWRITE, at least two for SPLIT, zero for MERGE",
    provenance_links: "one verified target link for MERGE, otherwise empty",
    safety_review: {
      status: "CLEAR | OPEN_REPAIRABLE | BLOCKING",
      hazard_classes: "controlled array",
      missing_conditions: "required when OPEN_REPAIRABLE",
      reason: "required when not CLEAR",
    },
    route: "GREEN | AMBER | RED; must be independently derivable",
  },
  candidate_required_fields: [
    "id", "title", "life_context", "functional_intent", "observable_effect",
    "natural_completion", "standalone_role_meaning", "participation_mode", "complexity.level",
    "complexity.dimensions.c1_elements", "complexity.dimensions.c2_coordination",
    "complexity.dimensions.c3_variability", "complexity.dimensions.c4_choice_uncertainty",
    "complexity.rationale", "execution_blocks", "lineage",
  ],
  hazard_classes: [
    "SHARP", "HEAT", "ELECTRICITY", "CHEMICAL", "MEDICATION", "BIOLOGICAL",
    "TRAFFIC", "HEIGHT", "FIRE", "PRIVACY_FINANCIAL", "OTHER",
  ],
  prohibitions: [
    "No materialization or production registration.",
    "Do not alter source identity, hash, disposition, Legacy Master, or canonical validator.",
    "Do not copy generic identity, complexity, rationale, or execution-block templates.",
    "Do not invent merge targets or safety conditions absent from governing evidence.",
    "Do not mark a hazard-bearing candidate GREEN when a required condition is missing.",
  ],
};

for (const lane of ["A", "B", "C"]) {
  const records = selection.records.filter((record) => record.lane === lane);
  if (records.length !== 100) throw new Error(`CA-0004 lane ${lane} must contain 100 sources`);
  const artifact = {
    artifact: `DALILI_CA_0004_LANE_${lane}_INPUT_01`,
    version: "1.0",
    status: "AUTHORITATIVE_DRAFTING_INPUT_NOT_MATERIALIZED",
    batch_id: "CA-0004",
    lane_id: lane,
    selection_artifact: selection.artifact,
    source_count: records.length,
    drafting_contract: draftingContract,
    records,
  };
  fs.writeFileSync(
    path.join(dataDir, `DALILI_CA_0004_LANE_${lane}_INPUT_01.json`),
    `${JSON.stringify(artifact, null, 2)}\n`,
  );
}

process.stdout.write(`${JSON.stringify({ batch: "CA-0004", lanes: { A: 100, B: 100, C: 100 } }, null, 2)}\n`);

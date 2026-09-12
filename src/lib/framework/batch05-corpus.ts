// مجموعة الدفعة 05 — تفعيل عينة التوسعة الثانية بعد المراجعة الدقيقة.
// كل سجل مرجع إطاري جديد منفصل، مع إبقاء Legacy Master مصدر نسب فقط.
// المرجع: DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01.

import correctedSampleRaw from "../../../docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01.json?raw";
import type { FunctionalParticipation } from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  registerFrameworkParticipation,
} from "./reference-registry";

export interface Batch05Lineage {
  candidate_id: string;
  source_artifact: "DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01";
  source_evidence_ids: readonly string[];
  source_titles: readonly string[];
  batch: "BATCH_05";
  disposition: "PRECISION_REVIEW_ACCEPT";
  confidence: "HIGH" | "MEDIUM";
  routing: "GREEN";
  reference_source: "framework_reference";
  image_review_status: "IMAGE_REPLACE_LATER";
}

type CorrectedSampleCandidate = Omit<FunctionalParticipation, "id"> & {
  id: string;
  proposed_framework_reference_id: string;
  sample_id: string;
  candidate_id: string;
  source_evidence_ids: string[];
  source_titles: string[];
  confidence?: "HIGH" | "MEDIUM" | "LOW";
};

type Batch05Seed = Omit<FunctionalParticipation, "kind" | "provenance"> & {
  lineage: Batch05Lineage;
};

const correctedSample = JSON.parse(correctedSampleRaw) as {
  artifact: "DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01";
  candidates: CorrectedSampleCandidate[];
};

const BATCH05_SEEDS: Batch05Seed[] = correctedSample.candidates.map(
  (candidate) => {
    const {
      kind: _kind,
      provenance: _provenance,
      proposed_framework_reference_id,
      sample_id: _sample_id,
      candidate_id,
      source_evidence_ids,
      source_titles,
      confidence,
      ...rest
    } = candidate;
    return {
      ...rest,
      id: proposed_framework_reference_id,
      lineage: {
        candidate_id,
        source_artifact: "DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01",
        source_evidence_ids,
        source_titles,
        batch: "BATCH_05",
        disposition: "PRECISION_REVIEW_ACCEPT",
        confidence: confidence === "MEDIUM" ? "MEDIUM" : "HIGH",
        routing: "GREEN",
        reference_source: "framework_reference",
        image_review_status: "IMAGE_REPLACE_LATER",
      },
    };
  },
);

export const BATCH05_PARTICIPATION_IDS = Object.freeze(
  BATCH05_SEEDS.map((seed) => seed.id),
);

const lineageById = new Map<string, Batch05Lineage>(
  BATCH05_SEEDS.map((seed) => [seed.id, Object.freeze({ ...seed.lineage })]),
);

let ready = false;

export function ensureBatch05Corpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of BATCH05_SEEDS) {
    if (getFrameworkParticipation(seed.id)) continue;
    const { lineage: _lineage, ...rest } = seed;
    const candidate = {
      ...rest,
      kind: "functional_participation" as const,
      provenance: "framework_reference" as const,
    };
    if (!evaluateFunctionalParticipation(candidate).valid) continue;
    try {
      registerFrameworkParticipation(candidate);
    } catch {
      // السجل غير قابل للتعديل — تجاهل أي تسجيل مكرر.
    }
  }
}

export function getBatch05Participation(
  id: string,
): FunctionalParticipation | null {
  ensureBatch05Corpus();
  if (!BATCH05_PARTICIPATION_IDS.includes(id)) return null;
  return getFrameworkParticipation(id);
}

export function listBatch05Participations(): FunctionalParticipation[] {
  ensureBatch05Corpus();
  return BATCH05_PARTICIPATION_IDS.map(
    (id) => getFrameworkParticipation(id)!,
  ).filter(Boolean);
}

export function getBatch05Lineage(id: string): Batch05Lineage | null {
  return lineageById.get(id) ?? null;
}

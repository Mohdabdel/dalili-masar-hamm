// مجموعة الدفعة 04 — تفعيل عينة التوسعة بعد المراجعة الدقيقة.
// كل سجل هنا مرجع إطاري جديد منفصل، مع إبقاء Legacy Master مصدر نسب فقط.
// المرجع: DALILI_EXPANSION_SAMPLE_12_CORRECTED_01.

import correctedSampleRaw from "../../../docs/audit/data/DALILI_EXPANSION_SAMPLE_12_CORRECTED_01.json?raw";
import type { FunctionalParticipation } from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";
import {
  getFrameworkParticipation,
  registerFrameworkParticipation,
} from "./reference-registry";

export interface Batch04Lineage {
  candidate_id: string;
  source_artifact: "DALILI_EXPANSION_SAMPLE_12_CORRECTED_01";
  source_evidence_ids: readonly string[];
  source_titles: readonly string[];
  batch: "BATCH_04";
  disposition: "PRECISION_REVIEW_ACCEPT";
  confidence: "HIGH";
  routing: "GREEN";
  reference_source: "framework_reference";
}

type CorrectedSampleItem = FunctionalParticipation & {
  lineage: {
    source_opportunity_id: string;
    source_card: "legacy_master";
    sample_id: string;
  };
};

type Batch04Seed = Omit<FunctionalParticipation, "kind" | "provenance"> & {
  lineage: Batch04Lineage;
};

const correctedSample = JSON.parse(correctedSampleRaw) as {
  id: "DALILI_EXPANSION_SAMPLE_12_CORRECTED_01";
  items: CorrectedSampleItem[];
};

const BATCH04_SEEDS: Batch04Seed[] = correctedSample.items.map((item) => {
  const { kind: _kind, provenance: _provenance, lineage, ...rest } = item;
  return {
    ...rest,
    lineage: {
      candidate_id: lineage.sample_id,
      source_artifact: "DALILI_EXPANSION_SAMPLE_12_CORRECTED_01",
      source_evidence_ids: [lineage.source_opportunity_id],
      source_titles: [item.title],
      batch: "BATCH_04",
      disposition: "PRECISION_REVIEW_ACCEPT",
      confidence: "HIGH",
      routing: "GREEN",
      reference_source: "framework_reference",
    },
  };
});

export const BATCH04_PARTICIPATION_IDS = Object.freeze(
  BATCH04_SEEDS.map((seed) => seed.id),
);

const lineageById = new Map<string, Batch04Lineage>(
  BATCH04_SEEDS.map((seed) => [seed.id, Object.freeze({ ...seed.lineage })]),
);

let ready = false;

export function ensureBatch04Corpus(): void {
  if (ready) return;
  ready = true;
  for (const seed of BATCH04_SEEDS) {
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

export function getBatch04Participation(
  id: string,
): FunctionalParticipation | null {
  ensureBatch04Corpus();
  if (!BATCH04_PARTICIPATION_IDS.includes(id)) return null;
  return getFrameworkParticipation(id);
}

export function listBatch04Participations(): FunctionalParticipation[] {
  ensureBatch04Corpus();
  return BATCH04_PARTICIPATION_IDS.map(
    (id) => getFrameworkParticipation(id)!,
  ).filter(Boolean);
}

export function getBatch04Lineage(id: string): Batch04Lineage | null {
  return lineageById.get(id) ?? null;
}

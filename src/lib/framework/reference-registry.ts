// حدّ الحلّ المرجعي بين المحتوى القديم والمحتوى المتوافق مع الإطار.
// إضافي: لا يغيّر أي مسار إنتاجي قائم، ولا يستهلكه أحد بعد.
// المرجع: D02 (فصل Legacy Master عن Reference Knowledge)، IM-01 (المرجع غير قابل للكتابة).

import { findOpportunityById } from "@/lib/knowledge-base";
import type {
  FunctionalParticipation,
  LegacyReferenceRecord,
  ReferenceRecord,
} from "./reference-model";
import { evaluateFunctionalParticipation } from "./fp-validity";

const registry = new Map<string, FunctionalParticipation>();

/**
 * تسجيل مشاركة وظيفية متوافقة مع الإطار.
 * السجل غير قابل للتعديل بعد التسجيل (IM-01)، ولا يُقبل إن سقطت أي بوابة (FP-09).
 */
export function registerFrameworkParticipation(
  participation: FunctionalParticipation,
): FunctionalParticipation {
  if (registry.has(participation.id)) {
    throw new Error(
      `Reference Knowledge is immutable: ${participation.id} already registered`,
    );
  }
  const result = evaluateFunctionalParticipation(participation);
  if (!result.valid) {
    throw new Error(
      `Invalid Functional Participation ${participation.id}: ${result.failedGates.join(", ")}`,
    );
  }
  const frozen = Object.freeze({
    ...participation,
    execution_blocks: Object.freeze(
      participation.execution_blocks.map((b) => Object.freeze({ ...b })),
    ) as FunctionalParticipation["execution_blocks"],
    complexity: Object.freeze({
      ...participation.complexity,
      dimensions: Object.freeze({ ...participation.complexity.dimensions }),
    }),
  }) as FunctionalParticipation;
  registry.set(frozen.id, frozen);
  return frozen;
}

/** يُستخدم في الاختبارات المعزولة فقط لتفريغ السجل. */
export function __resetFrameworkRegistry(): void {
  registry.clear();
}

export function getFrameworkParticipation(
  id: string,
): FunctionalParticipation | null {
  return registry.get(id) ?? null;
}

export function listFrameworkParticipations(): FunctionalParticipation[] {
  return [...registry.values()];
}

/** غلاف للسجل القديم — يشير إلى المحتوى الأصلي دون نسخه أو تحويله. */
export function asLegacyReference(
  id: string,
): LegacyReferenceRecord | null {
  const legacy = findOpportunityById(id);
  if (!legacy) return null;
  return {
    kind: "legacy_opportunity",
    provenance: "legacy_master",
    id,
    title: legacy.title,
    legacy,
  };
}

/**
 * حلّ مرجعي موحّد: المحتوى المتوافق مع الإطار أولاً، ثم المحتوى القديم كما هو.
 * لا يحوّل أي سجل قديم إلى مشاركة وظيفية متوافقة.
 */
export function resolveReference(id: string): ReferenceRecord | null {
  return getFrameworkParticipation(id) ?? asLegacyReference(id);
}

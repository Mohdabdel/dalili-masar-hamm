// حدّ المصدر في القراءة الإنتاجية (FP-01).
// كل فرصة تدخل مساراً حساساً للإطار يجب أن تحمل تصنيف مصدرها صراحةً:
// framework_reference (تحققت من البوابات السبع) أو legacy_master (محتوى قديم كما هو).
// التصنيف يُشتق من حالة النموذج فقط — لا معرّفات مثبّتة ولا استثناءات خاصة.

import { findOpportunityById } from "@/lib/knowledge-base";
import { getFrameworkParticipation } from "./reference-registry";
import { ensureEasyBeginningCorpus } from "./easy-beginning-corpus";
import type { ReferenceProvenance } from "./reference-model";

export type SourceClassification =
  | { source: ReferenceProvenance; frameworkValidated: boolean }
  | null;

/**
 * تصنيف مصدر فرصة مرجعية.
 * - مسجّلة في سجل الإطار → framework_reference (تحققت بالفعل عند التسجيل).
 * - موجودة في المكتبة القديمة فقط → legacy_master، ولا تُرقّى تلقائياً.
 * - غير موجودة → null.
 */
export function classifyReferenceSource(id: string): SourceClassification {
  ensureEasyBeginningCorpus();
  for (const candidate of referenceIdVariants(id)) {
    if (getFrameworkParticipation(candidate)) {
      return { source: "framework_reference", frameworkValidated: true };
    }
  }
  for (const candidate of referenceIdVariants(id)) {
    if (findOpportunityById(candidate)) {
      return { source: "legacy_master", frameworkValidated: false };
    }
  }
  return null;
}

/** معرّف المواصفة قد يحمل بادئة توافقية (KB-) فوق معرّف الفرصة نفسه. */
function referenceIdVariants(id: string): string[] {
  const raw = id.trim();
  return raw.startsWith("KB-") ? [raw, raw.slice(3)] : [raw];
}

/** هل يجوز التعامل مع هذا المعرّف كمشاركة وظيفية متحققة؟ */
export function isFrameworkValidatedSource(id: string): boolean {
  return classifyReferenceSource(id)?.frameworkValidated === true;
}

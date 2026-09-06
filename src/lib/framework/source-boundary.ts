// حدّ المصدر في القراءة الإنتاجية (FP-01).
// كل فرصة تدخل مساراً حساساً للإطار يجب أن تحمل تصنيف مصدرها صراحةً:
// framework_reference (تحققت من البوابات السبع) أو legacy_master (محتوى قديم كما هو).
// التصنيف يُشتق من حالة النموذج فقط — لا معرّفات مثبّتة ولا استثناءات خاصة.

import { findOpportunityById } from "@/lib/knowledge-base";
import { getFrameworkParticipation } from "./reference-registry";
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
  if (getFrameworkParticipation(id)) {
    return { source: "framework_reference", frameworkValidated: true };
  }
  if (findOpportunityById(id)) {
    return { source: "legacy_master", frameworkValidated: false };
  }
  return null;
}

/** هل يجوز التعامل مع هذا المعرّف كمشاركة وظيفية متحققة؟ */
export function isFrameworkValidatedSource(id: string): boolean {
  return classifyReferenceSource(id)?.frameworkValidated === true;
}

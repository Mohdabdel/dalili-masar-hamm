// حلّ مواصفة المشاركة داخل مساحة الأسرة — مصدر واحد لكل الأصول.
// مرجعي (KB-*) ← من المكتبة، عائلي (FAM-*) ← من مسودّة الأسرة المحفوظة.

import { getSpaceSpec } from "@/lab/data/space/catalog";
import { isFamilySpecId } from "@/lib/entry/family-spec";
import type { LabParticipationSpec, LabThisTimeSelection } from "@/lab/slice/types";

export function resolveSpaceSpec(
  specId: string,
  selections: Record<string, LabThisTimeSelection>,
): LabParticipationSpec | null {
  if (isFamilySpecId(specId)) return selections[specId]?.familySpec ?? null;
  return getSpaceSpec(specId);
}

/** هل لهذه المواصفة صياغة مرجعية ثابتة تُعرض للأسرة؟ */
export function hasReferenceWording(spec: LabParticipationSpec | null): boolean {
  return !!spec && spec.provenance !== "family";
}

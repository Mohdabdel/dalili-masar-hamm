// قراءة فقط للأصول البصرية الحالية داخل النموذج التجريبي.

import { getVisualSupportListForOpportunity } from "@/lib/visual-support-map";
import { getRenderableVisualAssets } from "@/lib/visual-asset-catalog";
import { getLearnerCard, type LearnerCardData } from "@/lib/learner-card";

export interface LabVisualItem {
  src: string;
  title: string;
}

export function visualsForOpportunity(opportunityId: string): LabVisualItem[] {
  return getVisualSupportListForOpportunity(opportunityId).map((a) => ({
    src: a.src,
    title: a.titleAr,
  }));
}

export function sampleVisualLibrary(limit = 12): LabVisualItem[] {
  return getRenderableVisualAssets()
    .slice(0, limit)
    .map((a) => ({ src: a.assetPath, title: a.titleAr || a.assetCode }));
}

export function learnerCardFor(opportunityId: string): LearnerCardData | null {
  return getLearnerCard(opportunityId);
}

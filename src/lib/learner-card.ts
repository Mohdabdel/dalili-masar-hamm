/**
 * المرحلة 5 — LearnerCard
 * طبقة عرض فقط: تبني خطوات "نسخة المتعلم" من مصدر الحقيقة الحالي (CSV عبر knowledge-base)
 * وتربط كل خطوة بصورة قابلة للعرض إن وُجدت. لا تكتب أي بيانات ولا تنشئ مصدرًا موازيًا.
 */
import { findOpportunityById } from "@/lib/knowledge-base";
import { getVisualSupportListForOpportunity } from "@/lib/visual-support-map";
import { executionUnitIdFor } from "@/lib/execution-support";
import { getRecipeByExecutionUnit, getRecipeFrames } from "@/lib/execution-frames";

export interface LearnerStep {
  text: string;
  image: string | null;
  imageAlt: string;
}

export interface LearnerCardData {
  title: string;
  context: string;
  steps: LearnerStep[];
}

function imagesForOpportunity(opportunityId: string): Array<{ src: string; alt: string }> {
  const recipe = getRecipeByExecutionUnit(executionUnitIdFor(opportunityId));
  if (recipe) {
    const frames = getRecipeFrames(recipe);
    if (frames.length > 0) {
      return frames.map((f) => ({ src: f.assetPath, alt: f.altTextAr || f.titleAr }));
    }
  }
  return getVisualSupportListForOpportunity(opportunityId).map((a) => ({
    src: a.src,
    alt: a.titleAr,
  }));
}

export function getLearnerCard(opportunityId: string): LearnerCardData | null {
  const opp = findOpportunityById(opportunityId);
  const card = opp?.card;
  const rawSteps = card?.steps ?? [];
  if (!opp || !card || rawSteps.length === 0) return null;

  const images = imagesForOpportunity(opportunityId);
  // نربط صورة بخطوة فقط عندما يتطابق العدد — لا نخمّن ولا نكرر صورة على كل الخطوات.
  const aligned = images.length === rawSteps.length;

  return {
    title: card.title,
    context: card.description ?? "",
    steps: rawSteps.map((text, i) => ({
      text,
      image: aligned ? images[i].src : null,
      imageAlt: aligned ? images[i].alt : "",
    })),
  };
}

// Mapping داخل Lab فقط: step_id → صورة موجودة فعلاً في المشروع.
// لا نربط صورة إلا إذا كانت مطابقة بصرياً للخطوة. ما عدا ذلك → Placeholder باسم الخطوة.

export const STEP_VISUAL_MAP: Record<string, string> = {
  // طي الملابس — صورة نهائية معتمدة في كتالوج الأصول
  "LAU-FOLD": "/assets/execution/visual/VRS-HOME-CLOTHES-FOLD-001.webp",
  "LAU-FOLD-2": "/assets/execution/visual/VRS-HOME-CLOTHES-FOLD-001.webp",
  // إعادة الملابس إلى الخزانة
  "LAU-RETURN": "/assets/execution/visual/VRS-HOME-CLOSET-ORGANIZE-001.webp",
  "LAU-RETURN-3": "/assets/execution/visual/VRS-HOME-CLOSET-ORGANIZE-001.webp",
};

export function assetForStep(stepId: string): string | null {
  return STEP_VISUAL_MAP[stepId] ?? null;
}

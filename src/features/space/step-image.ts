// طبقة صور الخطوة داخل مساحة الأسرة الإنتاجية.
// قاعدة السلامة البصرية: الصورة المركّبة (عدة مشاهد في ملف واحد) لا تُقدَّم كصورة خطوة واحدة.
// البنية تحفظ العلاقة: أصل مصدر → أصل مشتق (مقصوص) → استخدام في خطوة، دون تعديل المصدر.

import {
  getCanonicalVisualAsset,
  getRenderableVisualAssets,
  type CanonicalVisualAsset,
} from "@/lib/visual-asset-catalog";
import type { LabStepImageRef } from "@/lab/slice/types";

/** دفعات أُنتجت كلوحات متعددة المشاهد — غير صالحة كصورة خطوة واحدة قبل الاشتقاق. */
const COMPOSITE_SOURCES = new Set(["DALILI_VISUAL_BATCH_03"]);

export function isCompositeAsset(asset: CanonicalVisualAsset): boolean {
  return COMPOSITE_SOURCES.has(asset.source) || /SHEET/i.test(asset.assetCode);
}

export interface StepImageOption {
  code: string;
  title: string;
  src: string;
}

let optionsCache: StepImageOption[] | null = null;

/** الصور الصالحة لاستخدامها كصورة خطوة واحدة (بعد استبعاد المركّب). */
export function stepImageOptions(): StepImageOption[] {
  if (!optionsCache) {
    optionsCache = getRenderableVisualAssets()
      .filter((a) => a.assetPath && !isCompositeAsset(a))
      .map((a) => ({ code: a.assetCode, title: a.titleAr, src: a.assetPath as string }));
  }
  return optionsCache;
}

let bySrcCache: Map<string, CanonicalVisualAsset> | null = null;

function assetBySrc(src: string): CanonicalVisualAsset | null {
  if (!bySrcCache) {
    bySrcCache = new Map();
    for (const a of getRenderableVisualAssets()) {
      if (a.assetPath) bySrcCache.set(a.assetPath, a);
    }
  }
  return bySrcCache.get(src) ?? null;
}

export interface ResolvedStepImage {
  /** رابط العرض، أو null عندما لا توجد صورة صالحة لهذه الخطوة. */
  src: string | null;
  /** الصورة المتاحة مركّبة ولم تُشتق بعد — نعرض مساحة بديلة بدلاً منها. */
  compositePending: boolean;
  title: string | null;
}

const EMPTY: ResolvedStepImage = { src: null, compositePending: false, title: null };

/** يحلّ مرجع صورة الخطوة: المشتق أولاً، ثم المصدر إن لم يكن مركّباً. */
export function resolveStepImage(ref: LabStepImageRef | null | undefined): ResolvedStepImage {
  if (!ref) return EMPTY;
  if (ref.derivedAssetCode) {
    const derived = getCanonicalVisualAsset(ref.derivedAssetCode);
    if (derived && !derived.missingBinary && derived.assetPath) {
      return { src: derived.assetPath, compositePending: false, title: derived.titleAr };
    }
  }
  if (!ref.sourceAssetCode) return EMPTY;
  const source = getCanonicalVisualAsset(ref.sourceAssetCode);
  if (!source || source.missingBinary || !source.assetPath) return EMPTY;
  if (isCompositeAsset(source)) {
    return { src: null, compositePending: true, title: source.titleAr };
  }
  return { src: source.assetPath, compositePending: false, title: source.titleAr };
}

/** يبني مرجعاً من رابط صورة قديم محفوظ في المسودة (توافق مع ما قبل TASK 03). */
export function refFromLegacySrc(src: string | null | undefined): LabStepImageRef | null {
  if (!src) return null;
  const asset = assetBySrc(src);
  if (!asset) return null;
  return { sourceAssetCode: asset.assetCode };
}

/** الصورة المقترحة تلقائياً لخطوة — تُستبعد المركّبة. */
export function suggestStepImage(text: string): LabStepImageRef | null {
  const clean = text.replace(/[.،]/g, " ");
  let best: { code: string; hits: number } | null = null;
  for (const option of stepImageOptions()) {
    const words = option.title
      .replace(/[.،]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    let hits = 0;
    for (const w of words) if (clean.includes(w)) hits += 1;
    if (hits > 0 && (!best || hits > best.hits)) best = { code: option.code, hits };
  }
  return best ? { sourceAssetCode: best.code } : null;
}

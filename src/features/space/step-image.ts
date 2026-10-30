// طبقة صور الخطوة داخل مساحة الأسرة الإنتاجية.
// قاعدة السلامة البصرية: الصورة المركّبة (عدة مشاهد في ملف واحد) لا تُقدَّم كصورة خطوة واحدة.
// البنية تحفظ العلاقة: أصل مصدر → أصل مشتق (مقصوص) → استخدام في خطوة، دون تعديل المصدر.

import {
  getCanonicalVisualAsset,
  getRenderableVisualAssets,
  type CanonicalVisualAsset,
} from "@/lib/visual-asset-catalog";
import { isDerivedAsset } from "@/features/space/derived-assets";
import { peekUploadedUrl } from "@/features/space/family-uploads";
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
  /** مشهد مشتق من لوحة مركّبة — الأصل المصدر باقٍ كما هو. */
  derived: boolean;
}

let optionsCache: StepImageOption[] | null = null;

/** الصور الصالحة لاستخدامها كصورة خطوة واحدة: المفردة + المشاهد المشتقة. */
export function stepImageOptions(): StepImageOption[] {
  if (!optionsCache) {
    optionsCache = getRenderableVisualAssets()
      .filter((a) => a.assetPath && !isCompositeAsset(a))
      .map((a) => ({
        code: a.assetCode,
        title: a.titleAr,
        src: a.assetPath as string,
        derived: isDerivedAsset(a.assetCode),
      }));
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
  // صورة رفعتها الأسرة من جهازها تسبق أي أصل مرجعي — تُحل من ذاكرة الروابط الموقّعة.
  if (ref.uploadedPath) {
    return {
      src: peekUploadedUrl(ref.uploadedPath),
      compositePending: false,
      title: "صورة رفعتموها",
    };
  }
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
    // لا نختار أول مشهد اعتباطياً؛ يلزم اختيار مشهد محدد للخطوة.
    return { src: null, compositePending: true, title: source.titleAr };
  }
  return { src: source.assetPath, compositePending: false, title: source.titleAr };
}

/** رمز الأصل الفعلي المعروض لمرجع خطوة — لتوثيقه داخل وسائل الدعم. */
export function resolvedAssetCode(ref: LabStepImageRef | null | undefined): string | null {
  if (!ref) return null;
  if (ref.uploadedPath) return null; // صورة الأسرة الخاصة ليست أصلاً من المكتبة
  if (ref.derivedAssetCode) return ref.derivedAssetCode;
  if (!ref.sourceAssetCode) return null;
  const source = getCanonicalVisualAsset(ref.sourceAssetCode);
  if (!source) return null;
  if (isCompositeAsset(source)) return null;
  return source.assetCode;
}

/** يبني مرجعاً من رابط صورة قديم محفوظ في المسودة (توافق مع ما قبل TASK 03). */
export function refFromLegacySrc(src: string | null | undefined): LabStepImageRef | null {
  if (!src) return null;
  const asset = assetBySrc(src);
  if (!asset) return null;
  return { sourceAssetCode: asset.assetCode };
}

export interface StepImageSuggestionOptions {
  preferredAssetCodePrefix?: string;
}

/** الصورة المقترحة تلقائياً لخطوة — تُستبعد المركّبة. */
export function suggestStepImage(
  text: string,
  options: StepImageSuggestionOptions = {},
): LabStepImageRef | null {
  const clean = text.replace(/[.،]/g, " ");
  const normalizedClean = normalizeForMatch(clean);
  const choices = prioritizeOptions(options.preferredAssetCodePrefix);
  const exact = choices.find(
    (option) => normalizeForMatch(option.title) === normalizedClean,
  );
  if (exact) return { sourceAssetCode: exact.code };

  // التخمين بكلمة مشتركة قد يعرض فعلاً مختلفاً. اتركوا النص عند غياب تطابق دقيق.
  return null;
}

function prioritizeOptions(prefix: string | undefined): StepImageOption[] {
  const options = stepImageOptions();
  if (!prefix) return options;
  const preferred = options.filter((option) => option.code.startsWith(prefix));
  if (preferred.length === 0) return options;
  return preferred;
}

function normalizeForMatch(value: string): string {
  return value.replace(/[.،]/g, " ").replace(/\s+/g, " ").trim();
}

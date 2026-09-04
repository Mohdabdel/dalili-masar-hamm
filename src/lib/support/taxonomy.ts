// Foundation 08 — تصنيف الدعم (D03 / Cluster 9).
// فئة الدعم ≠ الوسيلة نفسها ≠ الصورة ≠ عبارة الأسرة.
// سجلّ معلن قابل للتوسّع: إضافة فئة معتمدة مستقبلاً لا تتطلب تعديل المحتوى المرجعي،
// ولا منطق صلاحية المشاركة الوظيفية، ولا التعقيد، ولا إعادة كتابة أي نسخة معتمدة.

import type {
  LabSupportAsset,
  LabSupportAssetConfig,
  LabSupportAssetKind,
  LabSupportAssetType,
} from "@/lab/slice/types";

/** الوسم القانوني لفئة الدعم — نص حر مُسجَّل، لا enum مغلق. */
export type SupportCategoryId = string;

/** كيف تُغذّى الوسيلة بمحتواها — ليست كل فئة مولّدة، وليست كل فئة مصوّرة. */
export type SupportContentMode = "generated_from_draft" | "family_authored" | "external_asset";

export interface SupportCategory {
  id: SupportCategoryId;
  /** كلمة الأسرة — بلا مصطلحات حوكمة. */
  label_ar: string;
  hint_ar: string;
  /** الوسم المخزَّن في العمود القديم `type` — حدّ توافق فقط، ليس هوية الفئة. */
  legacyStorageType: LabSupportAssetType;
  /** الوسم القديم في config.kind إن وُجد — للتوافق مع الصفوف السابقة. */
  legacyKind?: LabSupportAssetKind;
  contentMode: SupportContentMode;
  /** 0 = كل خطوات المسودة. */
  entriesTake: number;
  requiresImage: boolean;
  /** فئة اختبارية/غير منشورة لا تظهر للأسر. */
  experimental?: boolean;
}

const registry = new Map<SupportCategoryId, SupportCategory>();

export function registerSupportCategory(category: SupportCategory): SupportCategory {
  registry.set(category.id, category);
  return category;
}

export function unregisterSupportCategory(id: SupportCategoryId): void {
  registry.delete(id);
}

export function getSupportCategory(id: SupportCategoryId): SupportCategory | null {
  return registry.get(id) ?? null;
}

/** الفئات المتاحة للأسر (تستبعد الفئات الاختبارية غير المعتمدة). */
export function listSupportCategories(): SupportCategory[] {
  return [...registry.values()].filter((c) => !c.experimental);
}

export function listAllSupportCategories(): SupportCategory[] {
  return [...registry.values()];
}

// ---------- الفئات المعتمدة اليوم (أمثلة مرجعية موثّقة، لا كوناً مغلقاً) ----------

export const SUPPORT_CATEGORY_SCHEDULE = registerSupportCategory({
  id: "visual_schedule",
  label_ar: "جدول مصور",
  hint_ar: "كل الخطوات بترتيبها.",
  legacyStorageType: "schedule",
  legacyKind: "schedule",
  contentMode: "generated_from_draft",
  entriesTake: 0,
  requiresImage: false,
});

export const SUPPORT_CATEGORY_SEQUENCE = registerSupportCategory({
  id: "step_sequence",
  label_ar: "تسلسل مصوّر",
  hint_ar: "الخطوات صورة بعد صورة.",
  legacyStorageType: "schedule",
  legacyKind: "sequence",
  contentMode: "generated_from_draft",
  entriesTake: 0,
  requiresImage: false,
});

export const SUPPORT_CATEGORY_NOW_NEXT = registerSupportCategory({
  id: "now_next",
  label_ar: "الآن / بعد",
  hint_ar: "خطوتان فقط في كل مرة.",
  legacyStorageType: "time",
  legacyKind: "now-next",
  contentMode: "generated_from_draft",
  entriesTake: 2,
  requiresImage: false,
});

export const SUPPORT_CATEGORY_CHOICE_BOARD = registerSupportCategory({
  id: "choice_board",
  label_ar: "لوحة اختيارات",
  hint_ar: "خيارات مصوّرة للطلب أو الاختيار.",
  legacyStorageType: "communication",
  legacyKind: "choice-board",
  contentMode: "generated_from_draft",
  entriesTake: 4,
  requiresImage: false,
});

/** فئة غير معروفة: تُحفظ بأمانة كما هي بدل تخمين تصنيف. */
export const LEGACY_UNKNOWN_CATEGORY_ID = "legacy_unknown";

export interface SupportCategoryResolution {
  categoryId: SupportCategoryId;
  category: SupportCategory | null;
  certainty: "declared" | "legacy_mapped" | "unknown";
  legacyValue: string;
}

/**
 * حدّ توافق للصفوف السابقة لـ Foundation 08.
 * الأولوية: categoryId معلن → config.kind القديم → (type وحده = غير قاطع) → legacy_unknown.
 */
export function resolveSupportCategory(input: {
  categoryId?: string | null;
  type?: string | null;
  config?: { kind?: string | null } | null;
}): SupportCategoryResolution {
  const legacyValue = `${input.type ?? "-"}/${input.config?.kind ?? "-"}`;

  if (input.categoryId) {
    const declared = registry.get(input.categoryId);
    if (declared) {
      return { categoryId: declared.id, category: declared, certainty: "declared", legacyValue };
    }
  }

  const kind = input.config?.kind ?? null;
  if (kind) {
    const byKind = [...registry.values()].find((c) => c.legacyKind === kind);
    if (byKind) {
      return { categoryId: byKind.id, category: byKind, certainty: "legacy_mapped", legacyValue };
    }
  }

  // `type` وحده ليس قاطعاً (schedule يخدم فئتين) — لا تخمين.
  return {
    categoryId: LEGACY_UNKNOWN_CATEGORY_ID,
    category: null,
    certainty: "unknown",
    legacyValue,
  };
}

/** نسخة الوسيلة كما تُعرض/تُجمَّد: فئة + هوية وسيلة مستقلة + محتوى اختياري. */
export interface SupportInstanceView {
  /** هوية الوسيلة نفسها — ليست هوية الفئة. */
  instanceId: string;
  categoryId: SupportCategoryId;
  categoryLabel_ar: string;
  certainty: SupportCategoryResolution["certainty"];
  label_ar: string;
  /** المشاركة الأسرية المالكة (مفتاح العرض) — لا يشترط أي معرّف مرجعي. */
  specId: string;
  items: string[];
  hasAsset: boolean;
  provenance: LabSupportAssetConfig["generatedFrom"] | "unknown";
}

export function toSupportInstance(asset: LabSupportAsset): SupportInstanceView {
  const resolution = resolveSupportCategory({
    categoryId: asset.categoryId,
    type: asset.type,
    config: asset.config ?? null,
  });
  return {
    instanceId: asset.id,
    categoryId: resolution.categoryId,
    categoryLabel_ar: resolution.category?.label_ar ?? "وسيلة محفوظة سابقاً",
    certainty: resolution.certainty,
    label_ar: asset.label_ar,
    specId: asset.specId,
    items: [...asset.items],
    hasAsset: Boolean(asset.config?.entries?.some((e) => Boolean(e.src))),
    provenance: asset.config?.generatedFrom ?? "unknown",
  };
}

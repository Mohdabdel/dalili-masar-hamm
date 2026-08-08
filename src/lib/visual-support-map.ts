// DALILI-VISUAL-PREVIOUS-ASSETS-AUDIT-AND-LINK-01
// Mapping تنفيذي فقط (execution layer): يربط فرص المشاركة بأكواد الأصول Canonical.
// لا يعدّل مصدر الحقيقة المعرفي (01..04 CSV) ولا يُدخل أي أصل archive/rejected/regenerate.

import {
  getCanonicalVisualAsset,
  resolveVisualAssetSrc,
} from "@/lib/visual-asset-catalog";

/** opportunity_id → أكواد الأصول Canonical المرتبطة (بالترتيب المعتمد للعرض) */
const OPPORTUNITY_TO_ASSETS: Record<string, string[]> = {
  // دفعة DALILI_VISUAL_BATCH_03 (لوحة واحدة canonical لكل فرصة)
  "HOME-001-OP001": ["VRS-HOME-BED-MAKE-001"],
  "HOME-008-OP002": ["VRS-HOME-ITEMS-ORGANIZE-001"],
  "HOME-009-OP003": ["VRS-HOME-WASTE-OUT-001"],
  "FOOD-008-OP003": ["VRS-HOME-WATER-FILL-001"],
  "FOOD-009-OP002": ["VRS-HOME-SNACK-PREP-001"],
  "FOOD-064-OP003": ["VRS-HOME-DISH-UNLOAD-001"],
  "CLO-016-OP001": ["VRS-HOME-CLOTHES-FOLD-001"],
  "CLO-017-OP001": ["VRS-HOME-CLOSET-ORGANIZE-001"],
  // إنتاج سابق: مجموعة خيارات الوجبة (خياران متكاملان، وليسا نسختين لنفس الأصل)
  "COMM-007-OP002": ["VRS-COMM-MEAL-CHOICE-001", "VRS-COMM-MEAL-CHOICE-002"],
  // إنتاج سابق: إطارات خزانة المؤن — تُعرض عبر مشغّل الإطارات (VisualFramePilot)
  "HOME-052-OP001": [
    "VRS-HOME-PANTRY-SHELF-FR001",
    "VRS-HOME-PANTRY-SHELF-FR002",
    "VRS-HOME-PANTRY-SHELF-FR003",
  ],
};

/** فرص تُعرض أصولها داخل مشغّل مخصص، فلا يكررها قسم التوضيح البصري العام. */
const HANDLED_BY_DEDICATED_PLAYER = new Set(["HOME-052-OP001"]);

export interface VisualSupportBinding {
  assetCode: string;
  titleAr: string;
  /** مسار قابل للعرض فعليًا (الملف الثنائي موجود). */
  src: string;
}

/** أكواد الأصول المرتبطة بالفرصة. */
export function getAssetCodesForOpportunity(opportunityId: string): string[] {
  return OPPORTUNITY_TO_ASSETS[opportunityId.trim()] ?? [];
}

function bind(code: string): VisualSupportBinding | null {
  const src = resolveVisualAssetSrc(code);
  if (!src) return null;
  const asset = getCanonicalVisualAsset(code);
  return { assetCode: code, titleAr: asset?.titleAr ?? "", src };
}

/** كل الأصول القابلة للعرض فعليًا لفرصة معيّنة (قد تكون فارغة). */
export function getVisualSupportListForOpportunity(
  opportunityId: string,
): VisualSupportBinding[] {
  return getAssetCodesForOpportunity(opportunityId)
    .map(bind)
    .filter((b): b is VisualSupportBinding => b !== null);
}

/** الأصول التي يعرضها قسم "التوضيح البصري" العام داخل بطاقة المشاركة. */
export function getGeneralVisualSupport(opportunityId: string): VisualSupportBinding[] {
  if (HANDLED_BY_DEDICATED_PLAYER.has(opportunityId.trim())) return [];
  return getVisualSupportListForOpportunity(opportunityId);
}

/** أول أصل قابل للعرض، أو null. */
export function getVisualSupportForOpportunity(
  opportunityId: string,
): VisualSupportBinding | null {
  return getVisualSupportListForOpportunity(opportunityId)[0] ?? null;
}

/** الفرص التي تملك أصولًا قابلة للعرض فعليًا (للتشخيص/التدقيق). */
export function getActiveVisualSupportLinks(): Array<{
  opportunityId: string;
  assets: VisualSupportBinding[];
}> {
  return Object.keys(OPPORTUNITY_TO_ASSETS)
    .map((id) => ({ opportunityId: id, assets: getVisualSupportListForOpportunity(id) }))
    .filter((x) => x.assets.length > 0);
}

/** كل الروابط المعرّفة (بما فيها ما لا يملك ملفًا ثنائيًا). */
export function getAllVisualSupportMappings(): Record<string, string[]> {
  return OPPORTUNITY_TO_ASSETS;
}

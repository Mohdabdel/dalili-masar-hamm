// DALILI-VISUAL-SUPPORT-INTEGRATION-01
// Mapping تنفيذي فقط (execution layer): يربط فرص المشاركة التجريبية الحالية
// بأكواد الأصول البصرية Canonical الثمانية.
// لا يعدّل مصدر الحقيقة المعرفي (01..04 CSV) ولا يضيف أي أصل archive.

import {
  getCanonicalVisualAsset,
  resolveVisualAssetSrc,
  type CanonicalVisualAsset,
} from "@/lib/visual-asset-catalog";

/** opportunity_id → asset_code (canonical واحد فقط لكل فرصة) */
const OPPORTUNITY_TO_ASSET: Record<string, string> = {
  "HOME-001-OP001": "VRS-HOME-BED-MAKE-001",
  "HOME-008-OP002": "VRS-HOME-ITEMS-ORGANIZE-001",
  "HOME-009-OP003": "VRS-HOME-WASTE-OUT-001",
  "FOOD-008-OP003": "VRS-HOME-WATER-FILL-001",
  "FOOD-009-OP002": "VRS-HOME-SNACK-PREP-001",
  "FOOD-064-OP003": "VRS-HOME-DISH-UNLOAD-001",
  "CLO-016-OP001": "VRS-HOME-CLOTHES-FOLD-001",
  "CLO-017-OP001": "VRS-HOME-CLOSET-ORGANIZE-001",
};

export interface VisualSupportBinding {
  assetCode: string;
  titleAr: string;
  /** مسار قابل للعرض فعليًا (الملف الثنائي موجود). */
  src: string;
}

/** كود الأصل المرتبط بالفرصة، أو null. */
export function getAssetCodeForOpportunity(opportunityId: string): string | null {
  return OPPORTUNITY_TO_ASSET[opportunityId.trim()] ?? null;
}

/**
 * الربط الجاهز للعرض: يعيد null إذا لم توجد فرصة مرتبطة
 * أو إذا لم يصل الملف الثنائي (لا صورة مكسورة، ولا رسالة جديدة للمستخدم).
 */
export function getVisualSupportForOpportunity(
  opportunityId: string,
): VisualSupportBinding | null {
  const code = getAssetCodeForOpportunity(opportunityId);
  if (!code) return null;
  const src = resolveVisualAssetSrc(code);
  if (!src) return null;
  const asset: CanonicalVisualAsset | null = getCanonicalVisualAsset(code);
  return { assetCode: code, titleAr: asset?.titleAr ?? "", src };
}

/** الفرص التي تملك أصلًا قابلًا للعرض فعليًا (للتشخيص/الاختبار). */
export function getActiveVisualSupportLinks(): Array<
  VisualSupportBinding & { opportunityId: string }
> {
  return Object.keys(OPPORTUNITY_TO_ASSET)
    .map((id) => {
      const b = getVisualSupportForOpportunity(id);
      return b ? { opportunityId: id, ...b } : null;
    })
    .filter((x): x is VisualSupportBinding & { opportunityId: string } => x !== null);
}

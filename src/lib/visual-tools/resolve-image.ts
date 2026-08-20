import { resolveVisualAssetSrc } from "@/lib/visual-asset-catalog";
import type { VisualToolItem } from "./types";

/** مصدر عرض الصورة لعنصر أداة: مكتبة الأصول Canonical أو صورة الأسرة الخاصة. */
export function resolveItemImage(item: VisualToolItem): string | null {
  if (item.imageSource === "asset" && item.imageAssetId) {
    return resolveVisualAssetSrc(item.imageAssetId);
  }
  if (item.imageSource === "url" && item.imageUrl) return item.imageUrl;
  return null;
}

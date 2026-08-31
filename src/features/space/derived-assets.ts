// سجل الاشتقاق البصري — DALILI_VISUAL_DERIVED_01.
// كل صف يوثّق العلاقة: أصل مصدر مركّب (عدة مشاهد) → أصل مشتق بمشهد واحد.
// المصدر لا يُعدَّل ولا يُحذف؛ الاشتقاق ملف مستقل داخل /assets/execution/derived.

export interface DerivedAssetRecord {
  derivedAssetCode: string;
  sourceAssetCode: string;
  /** رقم المشهد داخل اللوحة المصدر. */
  panel: number;
  /** تخطيط اللوحة المصدر كما رُصد وقت الاشتقاق. */
  layout: string;
  /** حدود القص داخل المصدر: [x0, y0, x1, y1]. */
  cropBox: [number, number, number, number];
}

export const DERIVED_ASSETS: DerivedAssetRecord[] = [
  { derivedAssetCode: "VRS-HOME-BED-MAKE-001-P1", sourceAssetCode: "VRS-HOME-BED-MAKE-001", panel: 1, layout: "1x4", cropBox: [4,4,303,828] },
  { derivedAssetCode: "VRS-HOME-BED-MAKE-001-P2", sourceAssetCode: "VRS-HOME-BED-MAKE-001", panel: 2, layout: "1x4", cropBox: [315,4,618,828] },
  { derivedAssetCode: "VRS-HOME-BED-MAKE-001-P3", sourceAssetCode: "VRS-HOME-BED-MAKE-001", panel: 3, layout: "1x4", cropBox: [630,4,932,828] },
  { derivedAssetCode: "VRS-HOME-BED-MAKE-001-P4", sourceAssetCode: "VRS-HOME-BED-MAKE-001", panel: 4, layout: "1x4", cropBox: [944,4,1244,828] },
  { derivedAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001-P1", sourceAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001", panel: 1, layout: "2x2", cropBox: [4,4,616,408] },
  { derivedAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001-P2", sourceAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001", panel: 2, layout: "2x2", cropBox: [629,4,1244,408] },
  { derivedAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001-P3", sourceAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001", panel: 3, layout: "2x2", cropBox: [4,423,616,828] },
  { derivedAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001-P4", sourceAssetCode: "VRS-HOME-CLOSET-ORGANIZE-001", panel: 4, layout: "2x2", cropBox: [629,423,1244,828] },
  { derivedAssetCode: "VRS-HOME-CLOTHES-FOLD-001-P1", sourceAssetCode: "VRS-HOME-CLOTHES-FOLD-001", panel: 1, layout: "2x2", cropBox: [4,4,618,410] },
  { derivedAssetCode: "VRS-HOME-CLOTHES-FOLD-001-P2", sourceAssetCode: "VRS-HOME-CLOTHES-FOLD-001", panel: 2, layout: "2x2", cropBox: [629,4,1244,410] },
  { derivedAssetCode: "VRS-HOME-CLOTHES-FOLD-001-P3", sourceAssetCode: "VRS-HOME-CLOTHES-FOLD-001", panel: 3, layout: "2x2", cropBox: [4,421,618,828] },
  { derivedAssetCode: "VRS-HOME-CLOTHES-FOLD-001-P4", sourceAssetCode: "VRS-HOME-CLOTHES-FOLD-001", panel: 4, layout: "2x2", cropBox: [629,421,1244,828] },
  { derivedAssetCode: "VRS-HOME-DISH-UNLOAD-001-P1", sourceAssetCode: "VRS-HOME-DISH-UNLOAD-001", panel: 1, layout: "2x2", cropBox: [4,4,615,407] },
  { derivedAssetCode: "VRS-HOME-DISH-UNLOAD-001-P2", sourceAssetCode: "VRS-HOME-DISH-UNLOAD-001", panel: 2, layout: "2x2", cropBox: [631,4,1244,407] },
  { derivedAssetCode: "VRS-HOME-DISH-UNLOAD-001-P3", sourceAssetCode: "VRS-HOME-DISH-UNLOAD-001", panel: 3, layout: "2x2", cropBox: [4,423,615,828] },
  { derivedAssetCode: "VRS-HOME-DISH-UNLOAD-001-P4", sourceAssetCode: "VRS-HOME-DISH-UNLOAD-001", panel: 4, layout: "2x2", cropBox: [631,423,1244,828] },
  { derivedAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001-P1", sourceAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001", panel: 1, layout: "2x2", cropBox: [4,4,608,400] },
  { derivedAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001-P2", sourceAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001", panel: 2, layout: "2x2", cropBox: [639,4,1244,400] },
  { derivedAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001-P3", sourceAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001", panel: 3, layout: "2x2", cropBox: [4,431,608,828] },
  { derivedAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001-P4", sourceAssetCode: "VRS-HOME-ITEMS-ORGANIZE-001", panel: 4, layout: "2x2", cropBox: [639,431,1244,828] },
  { derivedAssetCode: "VRS-HOME-SNACK-PREP-001-P1", sourceAssetCode: "VRS-HOME-SNACK-PREP-001", panel: 1, layout: "2x2", cropBox: [4,4,617,409] },
  { derivedAssetCode: "VRS-HOME-SNACK-PREP-001-P2", sourceAssetCode: "VRS-HOME-SNACK-PREP-001", panel: 2, layout: "2x2", cropBox: [630,4,1244,409] },
  { derivedAssetCode: "VRS-HOME-SNACK-PREP-001-P3", sourceAssetCode: "VRS-HOME-SNACK-PREP-001", panel: 3, layout: "2x2", cropBox: [4,422,617,828] },
  { derivedAssetCode: "VRS-HOME-SNACK-PREP-001-P4", sourceAssetCode: "VRS-HOME-SNACK-PREP-001", panel: 4, layout: "2x2", cropBox: [630,422,1244,828] },
  { derivedAssetCode: "VRS-HOME-WASTE-OUT-001-P1", sourceAssetCode: "VRS-HOME-WASTE-OUT-001", panel: 1, layout: "2x2", cropBox: [4,4,616,407] },
  { derivedAssetCode: "VRS-HOME-WASTE-OUT-001-P2", sourceAssetCode: "VRS-HOME-WASTE-OUT-001", panel: 2, layout: "2x2", cropBox: [631,4,1244,407] },
  { derivedAssetCode: "VRS-HOME-WASTE-OUT-001-P3", sourceAssetCode: "VRS-HOME-WASTE-OUT-001", panel: 3, layout: "2x2", cropBox: [4,421,616,828] },
  { derivedAssetCode: "VRS-HOME-WASTE-OUT-001-P4", sourceAssetCode: "VRS-HOME-WASTE-OUT-001", panel: 4, layout: "2x2", cropBox: [631,421,1244,828] },
  { derivedAssetCode: "VRS-HOME-WATER-FILL-001-P1", sourceAssetCode: "VRS-HOME-WATER-FILL-001", panel: 1, layout: "1x4", cropBox: [4,4,305,828] },
  { derivedAssetCode: "VRS-HOME-WATER-FILL-001-P2", sourceAssetCode: "VRS-HOME-WATER-FILL-001", panel: 2, layout: "1x4", cropBox: [319,4,617,828] },
  { derivedAssetCode: "VRS-HOME-WATER-FILL-001-P3", sourceAssetCode: "VRS-HOME-WATER-FILL-001", panel: 3, layout: "1x4", cropBox: [630,4,928,828] },
  { derivedAssetCode: "VRS-HOME-WATER-FILL-001-P4", sourceAssetCode: "VRS-HOME-WATER-FILL-001", panel: 4, layout: "1x4", cropBox: [942,4,1244,828] }
];

const byDerived = new Map(DERIVED_ASSETS.map((d) => [d.derivedAssetCode, d]));

const bySource = new Map<string, DerivedAssetRecord[]>();
for (const d of DERIVED_ASSETS) {
  const list = bySource.get(d.sourceAssetCode) ?? [];
  list.push(d);
  bySource.set(d.sourceAssetCode, list);
}

/** المشاهد المشتقة من أصل مصدر مركّب، مرتّبة كما في اللوحة. */
export function derivedFor(sourceAssetCode: string): DerivedAssetRecord[] {
  return [...(bySource.get(sourceAssetCode) ?? [])].sort((a, b) => a.panel - b.panel);
}

/** سجل الاشتقاق لأصل مشتق — لعرض علاقة المصدر عند الحاجة. */
export function derivedRecord(derivedAssetCode: string): DerivedAssetRecord | null {
  return byDerived.get(derivedAssetCode) ?? null;
}

export function isDerivedAsset(assetCode: string): boolean {
  return byDerived.has(assetCode);
}

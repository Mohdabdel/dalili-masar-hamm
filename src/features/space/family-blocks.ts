// كتل التنفيذ التي تنشئها الأسرة داخل تركيب مشاركتها.
// هوية مستقلة وثابتة: ليست معرّف خطوة مرجعية، ولا رقم ترتيب، ولا موضع في مصفوفة.
// لا نص مرجعي لها إطلاقاً — ولا يُنسخ نص الأسرة إلى حقل المصدر لإرضاء شكل قديم.

import type { LabFamilyBlock, LabThisTimeSelection } from "@/lab/slice/types";

const PREFIX = "FBLK-";

export function isFamilyBlockId(id: string): boolean {
  return id.startsWith(PREFIX);
}

export function newFamilyBlockId(): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${PREFIX}${rand}`;
}

export function createFamilyBlock(familyText: string): LabFamilyBlock {
  return {
    id: newFamilyBlockId(),
    familyText,
    createdAt: new Date().toISOString(),
    source: "family",
  };
}

export function findFamilyBlock(
  selection: LabThisTimeSelection,
  blockId: string,
): LabFamilyBlock | null {
  return selection.familyBlocks?.find((b) => b.id === blockId) ?? null;
}

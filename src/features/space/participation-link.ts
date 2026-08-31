// ربط فرصة المشاركة الإنتاجية (من مكتبة المعرفة) بمساحة عمل الأسرة الإنتاجية.
// قراءة فقط: لا يُعدَّل أي محتوى مرجعي، ويُشتق المعرّف من معرّف الفرصة نفسه.

const KB_PREFIX = "KB-";

/** معرّف مساحة العمل المقابل لفرصة مشاركة إنتاجية. */
export function workspaceSpecIdFor(opportunityId: string): string {
  return opportunityId.startsWith(KB_PREFIX) ? opportunityId : `${KB_PREFIX}${opportunityId}`;
}

/** معرّف الفرصة المرجعية خلف معرّف مساحة العمل. */
export function opportunityIdFromSpecId(specId: string): string {
  return specId.startsWith(KB_PREFIX) ? specId.slice(KB_PREFIX.length) : specId;
}

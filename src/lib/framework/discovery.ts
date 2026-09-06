// حدّ الاكتشاف المرجعي (Discovery Gate 01).
// يجعل المحتوى المتوافق مع الإطار مرئياً في مسارات الاكتشاف الإنتاجية،
// جنباً إلى جنب مع محتوى المكتبة القديم، مع بقاء تصنيف المصدر صريحاً.
// لا ترقية تلقائية، ولا حذف لأي صف قديم، ولا دمج دلالي بين المصدرين.

import {
  ensureGoldenCorpus,
  GOLDEN_EVENTS,
} from "./golden-corpus";
import { ensureBatch02Corpus, getMigrationLineage } from "./batch02-corpus";
import { ensureEasyBeginningCorpus } from "./easy-beginning-corpus";
import { listFrameworkParticipations } from "./reference-registry";
import type { FunctionalParticipation } from "./reference-model";

/** تحميل كل الحوافظ المرجعية المسجّلة مرة واحدة. */
export function ensureFrameworkCorpora(): void {
  ensureEasyBeginningCorpus();
  ensureGoldenCorpus();
  ensureBatch02Corpus();
}

/** كل المشاركات المرجعية المتاحة للاكتشاف. */
export function discoverableFrameworkParticipations(): FunctionalParticipation[] {
  ensureFrameworkCorpora();
  return listFrameworkParticipations();
}

/** المشاركات المرجعية المرتبطة بحدث معيّن (سواء حدث مرجعي أو حدث مكتبة). */
export function frameworkParticipationsForEvent(
  eventId: string,
): FunctionalParticipation[] {
  return discoverableFrameworkParticipations().filter(
    (p) => p.event_id === eventId,
  );
}

/** الأحداث المرجعية المجمّدة التي لا وجود لها في مكتبة CSV. */
export function frameworkOnlyEvents(): Array<{
  id: string;
  title: string;
  life_context: string;
  participationCount: number;
}> {
  ensureFrameworkCorpora();
  const all = listFrameworkParticipations();
  return GOLDEN_EVENTS.map((e) => ({
    id: e.id,
    title: e.title,
    life_context: e.life_context,
    participationCount: all.filter((p) => p.event_id === e.id).length,
  })).filter((e) => e.participationCount > 0);
}

/**
 * قاعدة الأسبقية عند وجود نَسَب معروف:
 * الصف القديم يبقى في مكانه بلا تعديل، لكنه لا يُعرض كمرشح ثانٍ
 * بجانب تمثيله المرجعي المتحقَّق داخل نفس مجموعة المرشحين.
 */
export function legacyIdsSupersededByFramework(): Set<string> {
  const out = new Set<string>();
  for (const p of discoverableFrameworkParticipations()) {
    const lineage = getMigrationLineage(p.id);
    if (lineage) out.add(lineage.legacy_id);
  }
  return out;
}

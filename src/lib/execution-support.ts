// DALILI-MVP-INSTITUTIONAL-READINESS-01
// طبقة تنفيذ فقط: تحدد ما هو *متاح فعليًا* من أدوات الدعم أثناء التطبيق لفرصة معيّنة.
// لا تعدّل مصدر الحقيقة المعرفي (01..04) ولا تضيف محتوى جديدًا.

import { getRecipeByExecutionUnit, getRecipeFrames } from "@/lib/execution-frames";
import { getReminderAssetByExecutionUnit } from "@/lib/reminder-assets";
import { getGeneralVisualSupport } from "@/lib/visual-support-map";

/** معرف وحدة التنفيذ المشتق من معرف الفرصة (اصطلاح ثابت في ملفات التنفيذ). */
export function executionUnitIdFor(opportunityId: string): string {
  return `EXU-${opportunityId.trim()}-001`;
}

export interface SupportAvailability {
  executionUnitId: string;
  /** توضيح بصري ثابت (صورة/صور canonical). */
  hasVisualAid: boolean;
  /** تسلسل مصور قابل للتشغيل خطوة بخطوة. */
  hasFrameSequence: boolean;
  /** بطاقة تذكير قابلة للاستخدام والإرسال. */
  hasReminderCard: boolean;
  /** أي أداة دعم متاحة على الإطلاق. */
  any: boolean;
}

export function getSupportAvailability(opportunityId: string): SupportAvailability {
  const executionUnitId = executionUnitIdFor(opportunityId);

  const hasVisualAid = getGeneralVisualSupport(opportunityId).length > 0;

  const recipe = getRecipeByExecutionUnit(executionUnitId);
  const hasFrameSequence = !!recipe && getRecipeFrames(recipe).length > 0;

  const reminder = getReminderAssetByExecutionUnit(executionUnitId);
  const hasReminderCard = !!reminder;

  return {
    executionUnitId,
    hasVisualAid,
    hasFrameSequence,
    hasReminderCard,
    any: hasVisualAid || hasFrameSequence || hasReminderCard,
  };
}

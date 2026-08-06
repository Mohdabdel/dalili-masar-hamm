// طبقة قراءة مركزية لقرارات الدعم أثناء التطبيق.
// المصدر الوحيد للحقيقة هو 13_support_decisions.csv؛ لا حالة محفوظة ولا قاعدة بيانات.

import decisionsCsv from "@/data/execution/13_support_decisions.csv?raw";
import { parseCsv } from "@/lib/execution-frames";

const bool = (v: string) => v.toLowerCase() === "true";

export type SupportDecisionType = "Not Required" | "Human Support Required";

export interface SupportDecision {
  executionUnitId: string;
  decision: SupportDecisionType;
  reasonAr: string;
  riskLevel: string;
  humanSupportRequired: boolean;
  visualSupportRole: string;
  visualSupportStatus: string;
  safetyMessageAr: string;
  safetySecondaryAr: string;
  status: string;
  version: string;
}

const decisions: SupportDecision[] = parseCsv(decisionsCsv)
  .filter((r) => (r["execution_unit_id"] ?? "").length > 0 && (r["decision"] ?? "").length > 0)
  .map((r) => ({
    executionUnitId: r["execution_unit_id"] ?? "",
    decision: (r["decision"] ?? "") as SupportDecisionType,
    reasonAr: r["reason_ar"] ?? "",
    riskLevel: r["risk_level"] ?? "",
    humanSupportRequired: bool(r["human_support_required"] ?? ""),
    visualSupportRole: r["visual_support_role"] ?? "",
    visualSupportStatus: r["visual_support_status"] ?? "",
    safetyMessageAr: r["safety_message_ar"] ?? "",
    safetySecondaryAr: r["safety_secondary_ar"] ?? "",
    status: r["status"] ?? "",
    version: r["version"] ?? "",
  }));

const byUnit = new Map(decisions.map((d) => [d.executionUnitId, d]));

/** معرف وحدة التنفيذ الافتراضية لفرصة مشاركة. */
export function executionUnitIdFor(opportunityId: string): string {
  return `EXU-${opportunityId}-001`;
}

export function getSupportDecision(executionUnitId: string): SupportDecision | null {
  return byUnit.get(executionUnitId) ?? null;
}

export function getSupportDecisionForOpportunity(opportunityId: string): SupportDecision | null {
  return getSupportDecision(executionUnitIdFor(opportunityId));
}

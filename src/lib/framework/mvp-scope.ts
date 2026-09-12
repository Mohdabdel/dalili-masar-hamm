// نطاق MVP المرشح: حزمة صغيرة ممثلة لا ترحيل شامل للمكتبة القديمة.
// الـ1413 فرصة تبقى Legacy Master/مصدر نسب؛ هذه القائمة وحدها تدخل اختبار MVP.

import { discoverableFrameworkParticipations } from "./discovery";
import type { FunctionalParticipation } from "./reference-model";

export const MVP_SCOPE_ID = "DALILI_MVP_SCOPE_01" as const;

export const MVP_SCOPE_PARTICIPATION_IDS = Object.freeze([
  // Golden freeze: رحلة عائلية منزلية أساسية ومتدرجة.
  "GJ-EASY-001",
  "GJ-DISCOVERY-001",
  "GJ-SHARED-001",
  "GJ-MODERATE-001",
  "GJ-ADVANCED-001",

  // Batch02: عقد Production بعد محاذاة التمثيل.
  "FR-B02-COMM-005-OP001",
  "FR-B02-COMM-002-OP001",
  "FR-B02-HEALTH-014-OP001",
  "FR-B02-SHOP-066-OP001",
  "FR-B02-SHOP-019-OP002",

  // Batch03: أول محتوى قابل للاكتشاف بعد اختبار مكتبي.
  "FR-B03-FOOD-001-OP002",
  "FR-B03-SHOP-009-OP001",
  "FR-B03-HOME-018-OP001",
  "FR-B03-COMM-002-OP001",
  "FR-B03-HEALTH-001-OP001",
  "FR-B03-CLO-011-OP001",

  // Batch04: عينة توسع ممثلة عبر المجالات.
  "FR-EXP12-HOME-052-OP001",
  "FR-EXP12-HOME-052-OP003",
  "FR-EXP12-FOOD-002-OP002",
  "FR-EXP12-FOOD-006-OP001",
  "FR-EXP12-CLO-016-OP001",
  "FR-EXP12-SHOP-001-OP002",
  "FR-EXP12-COMM-006-OP002",
  "FR-EXP12-HEALTH-003-OP001",

  // Batch05: حواف MVP العملية: صحة/موظف/شراء/ملابس/بيت.
  "FR-EXP12-02-FOOD002-OP001",
  "FR-EXP12-02-SHOP005-OP003",
  "FR-EXP12-02-HOME002-OP005",
  "FR-EXP12-02-COMM007-OP007",
  "FR-EXP12-02-HEALTH007-OP010",
  "FR-EXP12-02-CLO003-OP012",
] as const);

export const MVP_JOURNEY_PROBES = Object.freeze([
  {
    id: "home-family",
    title: "مسار منزلي/أسري",
    participation_ids: Object.freeze([
      "GJ-EASY-001",
      "GJ-SHARED-001",
      "FR-B03-HOME-018-OP001",
      "FR-EXP12-HOME-052-OP001",
      "FR-EXP12-02-HOME002-OP005",
    ]),
  },
  {
    id: "community-health",
    title: "مسار مجتمعي/صحي",
    participation_ids: Object.freeze([
      "FR-B02-COMM-005-OP001",
      "FR-B03-HEALTH-001-OP001",
      "FR-EXP12-COMM-006-OP002",
      "FR-EXP12-HEALTH-003-OP001",
      "FR-EXP12-02-HEALTH007-OP010",
    ]),
  },
  {
    id: "usable-card",
    title: "مسار بطاقة قابلة للاستخدام",
    participation_ids: Object.freeze([
      "FR-B03-FOOD-001-OP002",
      "FR-EXP12-FOOD-006-OP001",
      "FR-EXP12-02-FOOD002-OP001",
      "FR-EXP12-02-SHOP005-OP003",
      "FR-EXP12-02-CLO003-OP012",
    ]),
  },
] as const);

export function listMvpScopeParticipations(): FunctionalParticipation[] {
  const byId = new Map(
    discoverableFrameworkParticipations().map((participation) => [
      participation.id,
      participation,
    ]),
  );
  return MVP_SCOPE_PARTICIPATION_IDS.map((id) => byId.get(id)).filter(
    (participation): participation is FunctionalParticipation => Boolean(participation),
  );
}

// Fixtures تجريبية داخل Lab — الإفطار / قبل الإفطار / بسيط.
// ليست محتوى إنتاجياً، ولا تُكتب في أي CSV أو قاعدة بيانات.

import type { LabParticipationSpec } from "@/lab/slice/types";

const base = {
  eventId: "BREAKFAST",
  eventTitle_ar: "الإفطار",
  phase: "before" as const,
  level: "simple" as const,
  context: "home" as const,
};

export const BREAKFAST_SPECS: LabParticipationSpec[] = [
  {
    ...base,
    id: "SPEC-BREAKFAST-TABLE",
    title_ar: "تحضير الطاولة",
    majorSteps: [
      {
        id: "BRK-TABLE-1",
        order: 1,
        instruction_family_ar: "فرش المنضدة",
        instruction_short_ar: "افرش المنضدة",
        substeps: [
          {
            id: "BRK-TABLE-1-1",
            order: 1,
            instruction_family_ar: "أحضر المفرش من مكانه",
            instruction_short_ar: "أحضر المفرش",
          },
          {
            id: "BRK-TABLE-1-2",
            order: 2,
            instruction_family_ar: "ضع المفرش على سطح المنضدة",
            instruction_short_ar: "ضع المفرش",
          },
          {
            id: "BRK-TABLE-1-3",
            order: 3,
            instruction_family_ar: "افرد المفرش حتى يغطي المنضدة",
            instruction_short_ar: "افرد المفرش",
          },
        ],
      },
      {
        id: "BRK-TABLE-2",
        order: 2,
        instruction_family_ar: "تحضير أدوات الطعام بعدد المشاركين",
        instruction_short_ar: "حضّر الأدوات",
        substeps: [
          {
            id: "BRK-TABLE-2-1",
            order: 1,
            instruction_family_ar: "حدد عدد الأماكن على المنضدة",
            instruction_short_ar: "حدد العدد",
          },
          {
            id: "BRK-TABLE-2-2",
            order: 2,
            instruction_family_ar: "أحضر الأطباق بعدد الأماكن",
            instruction_short_ar: "أحضر الأطباق",
          },
          {
            id: "BRK-TABLE-2-3",
            order: 3,
            instruction_family_ar: "أحضر الملاعق والشوك",
            instruction_short_ar: "أحضر الملاعق",
          },
        ],
      },
      {
        id: "BRK-TABLE-3",
        order: 3,
        instruction_family_ar: "وضع الأدوات على المائدة",
        instruction_short_ar: "رتّب المائدة",
        substeps: [
          {
            id: "BRK-TABLE-3-1",
            order: 1,
            instruction_family_ar: "ضع الأطباق في أماكنها",
            instruction_short_ar: "ضع الأطباق",
          },
          {
            id: "BRK-TABLE-3-2",
            order: 2,
            instruction_family_ar: "ضع الملاعق والشوك بجانب الأطباق",
            instruction_short_ar: "ضع الملاعق",
          },
          {
            id: "BRK-TABLE-3-3",
            order: 3,
            instruction_family_ar: "ضع الأكواب على المائدة",
            instruction_short_ar: "ضع الأكواب",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-BREAKFAST-INGREDIENTS",
    title_ar: "إحضار مكونات الوصفة",
    majorSteps: [
      {
        id: "BRK-ING-1",
        order: 1,
        instruction_family_ar: "انظر إلى قائمة المكونات",
        instruction_short_ar: "انظر للقائمة",
        substeps: [
          {
            id: "BRK-ING-1-1",
            order: 1,
            instruction_family_ar: "افتح القائمة المصورة للمكونات",
            instruction_short_ar: "افتح القائمة",
          },
          {
            id: "BRK-ING-1-2",
            order: 2,
            instruction_family_ar: "اقرأ أو انظر إلى أول مكوّن",
            instruction_short_ar: "أول مكوّن",
          },
        ],
      },
      {
        id: "BRK-ING-2",
        order: 2,
        instruction_family_ar: "أحضر المكونات من الثلاجة أو الرف",
        instruction_short_ar: "أحضر المكونات",
        substeps: [
          {
            id: "BRK-ING-2-1",
            order: 1,
            instruction_family_ar: "افتح الثلاجة وأحضر ما فيها من مكونات",
            instruction_short_ar: "من الثلاجة",
          },
          {
            id: "BRK-ING-2-2",
            order: 2,
            instruction_family_ar: "أحضر باقي المكونات من الرف",
            instruction_short_ar: "من الرف",
          },
        ],
      },
      {
        id: "BRK-ING-3",
        order: 3,
        instruction_family_ar: "ضع المكونات على سطح المطبخ",
        instruction_short_ar: "ضعها معاً",
        substeps: [
          {
            id: "BRK-ING-3-1",
            order: 1,
            instruction_family_ar: "ضع المكونات في مكان واحد قريب",
            instruction_short_ar: "ضعها معاً",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-BREAKFAST-SERVE",
    title_ar: "وضع الطعام على المائدة",
    majorSteps: [
      {
        id: "BRK-SRV-1",
        order: 1,
        instruction_family_ar: "احمل الطبق بيدين",
        instruction_short_ar: "احمل الطبق",
        substeps: [
          {
            id: "BRK-SRV-1-1",
            order: 1,
            instruction_family_ar: "أمسك الطبق من الجانبين بيدين",
            instruction_short_ar: "أمسك بيدين",
          },
        ],
      },
      {
        id: "BRK-SRV-2",
        order: 2,
        instruction_family_ar: "انقل الطعام إلى المائدة",
        instruction_short_ar: "انقل الطعام",
        substeps: [
          {
            id: "BRK-SRV-2-1",
            order: 1,
            instruction_family_ar: "امشِ إلى المائدة بهدوء",
            instruction_short_ar: "امشِ بهدوء",
          },
          {
            id: "BRK-SRV-2-2",
            order: 2,
            instruction_family_ar: "ضع الطبق في وسط المائدة",
            instruction_short_ar: "ضع الطبق",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-BREAKFAST-CALL",
    title_ar: "إبلاغ الأسرة بأن الإفطار جاهز",
    majorSteps: [
      {
        id: "BRK-CALL-1",
        order: 1,
        instruction_family_ar: "حدد الشخص الذي ستخبره",
        instruction_short_ar: "حدد الشخص",
        substeps: [
          {
            id: "BRK-CALL-1-1",
            order: 1,
            instruction_family_ar: "اختر من ستخبره أولاً",
            instruction_short_ar: "اختر الشخص",
          },
        ],
      },
      {
        id: "BRK-CALL-2",
        order: 2,
        instruction_family_ar: "اذهب إليه في مكانه",
        instruction_short_ar: "اذهب إليه",
        substeps: [
          {
            id: "BRK-CALL-2-1",
            order: 1,
            instruction_family_ar: "امشِ إلى المكان الذي هو فيه",
            instruction_short_ar: "اذهب إليه",
          },
        ],
      },
      {
        id: "BRK-CALL-3",
        order: 3,
        instruction_family_ar: "أخبره أن الإفطار جاهز",
        instruction_short_ar: "أخبره",
        substeps: [
          {
            id: "BRK-CALL-3-1",
            order: 1,
            instruction_family_ar: "أخبره بالطريقة التي تناسبكم",
            instruction_short_ar: "أخبره",
            executionOptions: [
              { id: "opt-card", label_ar: "إظهار بطاقة «الإفطار جاهز»" },
              { id: "opt-sign", label_ar: "إشارة متفق عليها" },
              { id: "opt-phrase", label_ar: "عبارة قصيرة" },
            ],
          },
        ],
      },
    ],
  },
];

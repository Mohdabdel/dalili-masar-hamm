// Fixtures تجريبية داخل Lab — التسوق (يمتد من البيت إلى خارجه).

import type { LabParticipationSpec } from "@/lab/slice/types";

const base = {
  eventId: "SHOPPING",
  eventTitle_ar: "التسوق",
  level: "simple" as const,
  context: "community" as const,
};

export const SHOPPING_SPECS: LabParticipationSpec[] = [
  {
    ...base,
    id: "SPEC-SHOP-LIST",
    phase: "before",
    title_ar: "مراجعة قائمة التسوق",
    majorSteps: [
      {
        id: "SHP-LIST-1",
        order: 1,
        instruction_family_ar: "افتح القائمة المصورة",
        instruction_short_ar: "افتح القائمة",
        substeps: [
          {
            id: "SHP-LIST-1-1",
            order: 1,
            instruction_family_ar: "أحضر ورقة القائمة أو افتحها على الشاشة",
            instruction_short_ar: "أحضر القائمة",
          },
        ],
      },
      {
        id: "SHP-LIST-2",
        order: 2,
        instruction_family_ar: "راجع الأغراض واحداً واحداً",
        instruction_short_ar: "راجع الأغراض",
        substeps: [
          {
            id: "SHP-LIST-2-1",
            order: 1,
            instruction_family_ar: "انظر إلى صورة كل غرض في القائمة",
            instruction_short_ar: "انظر للصور",
          },
          {
            id: "SHP-LIST-2-2",
            order: 2,
            instruction_family_ar: "أضف غرضاً تحبونه إلى القائمة",
            instruction_short_ar: "أضف غرضاً",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-SHOP-FIND",
    phase: "during",
    title_ar: "العثور على غرض مألوف",
    majorSteps: [
      {
        id: "SHP-FIND-1",
        order: 1,
        instruction_family_ar: "انظر إلى صورة الغرض في القائمة",
        instruction_short_ar: "انظر للصورة",
        substeps: [
          {
            id: "SHP-FIND-1-1",
            order: 1,
            instruction_family_ar: "اختر غرضاً واحداً من القائمة",
            instruction_short_ar: "اختر غرضاً",
          },
        ],
      },
      {
        id: "SHP-FIND-2",
        order: 2,
        instruction_family_ar: "ابحث عنه في الرف",
        instruction_short_ar: "ابحث بالرف",
        substeps: [
          {
            id: "SHP-FIND-2-1",
            order: 1,
            instruction_family_ar: "امشِ إلى الممر الذي فيه الغرض",
            instruction_short_ar: "امشِ للممر",
          },
          {
            id: "SHP-FIND-2-2",
            order: 2,
            instruction_family_ar: "خذ الغرض من الرف",
            instruction_short_ar: "خذ الغرض",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-SHOP-CART",
    phase: "during",
    title_ar: "وضع الأغراض في العربة",
    majorSteps: [
      {
        id: "SHP-CART-1",
        order: 1,
        instruction_family_ar: "ضع الغرض داخل العربة",
        instruction_short_ar: "ضعه بالعربة",
        substeps: [
          {
            id: "SHP-CART-1-1",
            order: 1,
            instruction_family_ar: "ضع الغرض برفق داخل العربة",
            instruction_short_ar: "ضعه برفق",
          },
        ],
      },
      {
        id: "SHP-CART-2",
        order: 2,
        instruction_family_ar: "علّم على الغرض في القائمة",
        instruction_short_ar: "علّم عليه",
        substeps: [
          {
            id: "SHP-CART-2-1",
            order: 1,
            instruction_family_ar: "ضع علامة أمام صورة الغرض",
            instruction_short_ar: "ضع علامة",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-SHOP-PAY",
    phase: "during",
    title_ar: "المشاركة عند الدفع",
    majorSteps: [
      {
        id: "SHP-PAY-1",
        order: 1,
        instruction_family_ar: "ضع الأغراض على الحزام",
        instruction_short_ar: "ضع الأغراض",
        substeps: [
          {
            id: "SHP-PAY-1-1",
            order: 1,
            instruction_family_ar: "أخرج الأغراض من العربة وضعها على الحزام",
            instruction_short_ar: "أخرج الأغراض",
          },
        ],
      },
      {
        id: "SHP-PAY-2",
        order: 2,
        instruction_family_ar: "شارك في لحظة الدفع",
        instruction_short_ar: "شارك بالدفع",
        substeps: [
          {
            id: "SHP-PAY-2-1",
            order: 1,
            instruction_family_ar: "أعطِ البطاقة أو النقود للموظف",
            instruction_short_ar: "أعطِ البطاقة",
            executionOptions: [
              { id: "opt-card-pay", label_ar: "إعطاء البطاقة" },
              { id: "opt-cash", label_ar: "إعطاء النقود" },
              { id: "opt-watch", label_ar: "الوقوف بجانب الأسرة" },
            ],
          },
          {
            id: "SHP-PAY-2-2",
            order: 2,
            instruction_family_ar: "خذ الأكياس معك",
            instruction_short_ar: "خذ الأكياس",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-SHOP-UNPACK",
    phase: "after",
    title_ar: "إدخال المشتريات بعد العودة",
    majorSteps: [
      {
        id: "SHP-UNP-1",
        order: 1,
        instruction_family_ar: "ضع الأكياس على سطح المطبخ",
        instruction_short_ar: "ضع الأكياس",
        substeps: [
          {
            id: "SHP-UNP-1-1",
            order: 1,
            instruction_family_ar: "احمل الأكياس إلى المطبخ وضعها على السطح",
            instruction_short_ar: "احملها للمطبخ",
          },
        ],
      },
      {
        id: "SHP-UNP-2",
        order: 2,
        instruction_family_ar: "رتّب المشتريات في أماكنها",
        instruction_short_ar: "رتّب المشتريات",
        substeps: [
          {
            id: "SHP-UNP-2-1",
            order: 1,
            instruction_family_ar: "ضع البارد في الثلاجة",
            instruction_short_ar: "البارد بالثلاجة",
          },
          {
            id: "SHP-UNP-2-2",
            order: 2,
            instruction_family_ar: "ضع البقية على الرف",
            instruction_short_ar: "البقية بالرف",
          },
        ],
      },
    ],
  },
];

// Fixtures تجريبية داخل Lab — الغسيل والملابس (بلا فرض قبل/أثناء/بعد).

import type { LabParticipationSpec } from "@/lab/slice/types";

const base = {
  eventId: "LAUNDRY",
  eventTitle_ar: "الغسيل والملابس",
  level: "simple" as const,
  context: "home" as const,
};

export const LAUNDRY_SPECS: LabParticipationSpec[] = [
  {
    ...base,
    id: "SPEC-LAUNDRY-COLLECT",
    title_ar: "جمع الملابس",
    majorSteps: [
      {
        id: "LAU-COLLECT-1",
        order: 1,
        instruction_family_ar: "أحضر سلة الملابس",
        instruction_short_ar: "أحضر السلة",
        substeps: [
          {
            id: "LAU-COLLECT-1-1",
            order: 1,
            instruction_family_ar: "خذ السلة من مكانها المعتاد",
            instruction_short_ar: "خذ السلة",
          },
        ],
      },
      {
        id: "LAU-COLLECT-2",
        order: 2,
        instruction_family_ar: "اجمع الملابس من الغرف",
        instruction_short_ar: "اجمع الملابس",
        substeps: [
          {
            id: "LAU-COLLECT-2-1",
            order: 1,
            instruction_family_ar: "التقط الملابس من الأرض والكرسي",
            instruction_short_ar: "التقط الملابس",
          },
          {
            id: "LAU-COLLECT-2-2",
            order: 2,
            instruction_family_ar: "ضع الملابس داخل السلة",
            instruction_short_ar: "ضعها في السلة",
          },
        ],
      },
      {
        id: "LAU-COLLECT-3",
        order: 3,
        instruction_family_ar: "انقل السلة إلى مكان الغسيل",
        instruction_short_ar: "انقل السلة",
        substeps: [
          {
            id: "LAU-COLLECT-3-1",
            order: 1,
            instruction_family_ar: "احمل السلة إلى غرفة الغسيل",
            instruction_short_ar: "احمل السلة",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-LAUNDRY-SORT",
    title_ar: "فرز الملابس",
    majorSteps: [
      {
        id: "LAU-SORT-1",
        order: 1,
        instruction_family_ar: "أفرغ السلة أمامك",
        instruction_short_ar: "أفرغ السلة",
        substeps: [
          {
            id: "LAU-SORT-1-1",
            order: 1,
            instruction_family_ar: "ضع الملابس على الأرض أو على سطح نظيف",
            instruction_short_ar: "ضع الملابس",
          },
        ],
      },
      {
        id: "LAU-SORT-2",
        order: 2,
        instruction_family_ar: "افصل الملابس إلى كومتين",
        instruction_short_ar: "افصل كومتين",
        substeps: [
          {
            id: "LAU-SORT-2-1",
            order: 1,
            instruction_family_ar: "ضع الملابس الفاتحة في كومة",
            instruction_short_ar: "الفاتح هنا",
          },
          {
            id: "LAU-SORT-2-2",
            order: 2,
            instruction_family_ar: "ضع الملابس الداكنة في كومة أخرى",
            instruction_short_ar: "الداكن هنا",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-LAUNDRY-LOAD",
    title_ar: "وضع الملابس في الغسالة",
    majorSteps: [
      {
        id: "LAU-LOAD-1",
        order: 1,
        instruction_family_ar: "افتح باب الغسالة",
        instruction_short_ar: "افتح الباب",
        substeps: [
          {
            id: "LAU-LOAD-1-1",
            order: 1,
            instruction_family_ar: "اسحب باب الغسالة حتى يفتح",
            instruction_short_ar: "افتح الباب",
          },
        ],
      },
      {
        id: "LAU-LOAD-2",
        order: 2,
        instruction_family_ar: "ضع الملابس داخل الغسالة",
        instruction_short_ar: "ضع الملابس",
        substeps: [
          {
            id: "LAU-LOAD-2-1",
            order: 1,
            instruction_family_ar: "أدخل الملابس قطعة قطعة",
            instruction_short_ar: "قطعة قطعة",
          },
          {
            id: "LAU-LOAD-2-2",
            order: 2,
            instruction_family_ar: "أغلق باب الغسالة",
            instruction_short_ar: "أغلق الباب",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-LAUNDRY-UNLOAD",
    title_ar: "إخراج الملابس بعد الغسيل",
    majorSteps: [
      {
        id: "LAU-UNLOAD-1",
        order: 1,
        instruction_family_ar: "افتح الغسالة بعد انتهائها",
        instruction_short_ar: "افتح الغسالة",
        substeps: [
          {
            id: "LAU-UNLOAD-1-1",
            order: 1,
            instruction_family_ar: "انتظر توقف الغسالة ثم افتح الباب",
            instruction_short_ar: "افتح الباب",
          },
        ],
      },
      {
        id: "LAU-UNLOAD-2",
        order: 2,
        instruction_family_ar: "انقل الملابس إلى السلة أو النشر",
        instruction_short_ar: "انقل الملابس",
        substeps: [
          {
            id: "LAU-UNLOAD-2-1",
            order: 1,
            instruction_family_ar: "أخرج الملابس وضعها في السلة",
            instruction_short_ar: "أخرج الملابس",
          },
          {
            id: "LAU-UNLOAD-2-2",
            order: 2,
            instruction_family_ar: "انقل السلة إلى مكان النشر أو التجفيف",
            instruction_short_ar: "انقل السلة",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-LAUNDRY-FOLD",
    title_ar: "طي الملابس",
    majorSteps: [
      {
        id: "LAU-FOLD-1",
        order: 1,
        instruction_family_ar: "ضع القطعة مفرودة أمامك",
        instruction_short_ar: "افرد القطعة",
        substeps: [
          {
            id: "LAU-FOLD-1-1",
            order: 1,
            instruction_family_ar: "ضع القطعة على سطح مستوٍ وافردها",
            instruction_short_ar: "افرد القطعة",
          },
        ],
      },
      {
        id: "LAU-FOLD",
        order: 2,
        instruction_family_ar: "اطوِ القطعة",
        instruction_short_ar: "اطوِ القطعة",
        substeps: [
          {
            id: "LAU-FOLD-2",
            order: 1,
            instruction_family_ar: "اطوِ الكمّين إلى الداخل ثم اطوِ القطعة نصفين",
            instruction_short_ar: "اطوِ نصفين",
          },
        ],
      },
      {
        id: "LAU-FOLD-3",
        order: 3,
        instruction_family_ar: "ضع القطعة المطوية في الكومة",
        instruction_short_ar: "ضعها في الكومة",
        substeps: [
          {
            id: "LAU-FOLD-3-1",
            order: 1,
            instruction_family_ar: "ضع القطعة فوق بقية الملابس المطوية",
            instruction_short_ar: "ضعها فوقها",
          },
        ],
      },
    ],
  },
  {
    ...base,
    id: "SPEC-LAUNDRY-RETURN",
    title_ar: "إعادة الملابس إلى أماكنها",
    majorSteps: [
      {
        id: "LAU-RETURN-1",
        order: 1,
        instruction_family_ar: "احمل الملابس المطوية",
        instruction_short_ar: "احمل الملابس",
        substeps: [
          {
            id: "LAU-RETURN-1-1",
            order: 1,
            instruction_family_ar: "احمل كومة الملابس بيدين",
            instruction_short_ar: "احمل بيدين",
          },
        ],
      },
      {
        id: "LAU-RETURN",
        order: 2,
        instruction_family_ar: "ضع الملابس في الخزانة",
        instruction_short_ar: "ضعها بالخزانة",
        substeps: [
          {
            id: "LAU-RETURN-3",
            order: 1,
            instruction_family_ar: "افتح الخزانة وضع كل نوع في رفّه",
            instruction_short_ar: "كل نوع برفّه",
          },
        ],
      },
    ],
  },
];

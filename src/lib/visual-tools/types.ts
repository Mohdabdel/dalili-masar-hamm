/**
 * DALILI-VISUAL-TOOLS-BUILDER-01
 * نماذج بيانات "أدوات ووسائل داعمة".
 * كل ما تنشئه الأسرة هنا بيانات خاصة بالأسرة فقط:
 * لا يدخل مستودع دليلي الرسمي ولا الفرص العامة ولا أحداث اليوم ولا أدلة المصادر.
 */

export type VisualToolType =
  | "visual_schedule"
  | "visual_sequence"
  | "choice_board"
  | "communication_board"
  | "custom_participation";

export type VisualToolLayout = "list" | "grid2" | "grid3";

export type ImageSource = "none" | "asset" | "url";

export interface VisualToolItem {
  id: string;
  projectId: string;
  sortOrder: number;
  hidden: boolean;
  text: string;
  imageSource: ImageSource;
  /** كود أصل Canonical من مكتبة الأصول البصرية. */
  imageAssetId: string | null;
  /** رابط صورة خاصة بالأسرة (رابط أو صورة مرفوعة كـ data URL). */
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VisualToolProject {
  id: string;
  /** مالك البيانات محليًا — الأسرة صاحبة الجهاز. */
  userId: string;
  type: VisualToolType;
  title: string;
  layout: VisualToolLayout;
  /** ربط اختياري بروتين الأسرة (خاص بالأسرة، لا يُنشر). */
  linkedRoutineId: string | null;
  items: VisualToolItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VisualToolTypeMeta {
  type: VisualToolType;
  titleAr: string;
  descriptionAr: string;
  defaultLayout: VisualToolLayout;
  itemLabelAr: string;
  addLabelAr: string;
}

export const VISUAL_TOOL_TYPES: VisualToolTypeMeta[] = [
  {
    type: "visual_schedule",
    titleAr: "الجدول البصري",
    descriptionAr: "ترتيب أحداث اليوم بصورة وكلمة قصيرة ليعرف الشخص ما القادم.",
    defaultLayout: "list",
    itemLabelAr: "خطوة اليوم",
    addLabelAr: "إضافة حدث",
  },
  {
    type: "visual_sequence",
    titleAr: "التسلسل البصري",
    descriptionAr: "تقسيم مشاركة واحدة إلى خطوات متتابعة واضحة بالصور.",
    defaultLayout: "list",
    itemLabelAr: "خطوة",
    addLabelAr: "إضافة خطوة",
  },
  {
    type: "choice_board",
    titleAr: "لوحة الاختيار",
    descriptionAr: "عرض خيارين أو أكثر جنبًا إلى جنب ليختار الشخص بنفسه.",
    defaultLayout: "grid2",
    itemLabelAr: "خيار",
    addLabelAr: "إضافة خيار",
  },
  {
    type: "communication_board",
    titleAr: "لوحة التواصل البسيطة",
    descriptionAr: "مجموعة عبارات وصور يستخدمها الشخص للتعبير عن حاجته.",
    defaultLayout: "grid3",
    itemLabelAr: "عبارة",
    addLabelAr: "إضافة عبارة",
  },
  {
    type: "custom_participation",
    titleAr: "صمّم مشاركة",
    descriptionAr:
      "بناء مشاركة خاصة بأسرتك بخطواتها وصورها. تبقى خاصة بك ولا تُضاف إلى مستودع دليلي.",
    defaultLayout: "list",
    itemLabelAr: "خطوة المشاركة",
    addLabelAr: "إضافة خطوة",
  },
];

export function getToolMeta(type: VisualToolType): VisualToolTypeMeta {
  return VISUAL_TOOL_TYPES.find((t) => t.type === type) ?? VISUAL_TOOL_TYPES[0];
}

export function isVisualToolType(value: string): value is VisualToolType {
  return VISUAL_TOOL_TYPES.some((t) => t.type === value);
}

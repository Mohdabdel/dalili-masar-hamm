// محطات اليوم الطبيعية للأسرة، وكل محطة ترتبط بفرص مشاركة حقيقية من مستودع المعرفة (CSV).
// لا تُكتب هنا أي بيانات مشاركة جديدة: الأسماء تُطابق فرصًا موجودة فعلاً، وأي فرصة لا تُطابق تُستبعد.

import { getAllOpportunities, type FlatOpportunity } from "@/lib/knowledge-base";

export interface StationPick {
  /** الاسم كما تراه الأسرة. */
  title: string;
  /** وصف قصير جدًا يساعد على الاختيار فقط. */
  hint: string;
  /** كلمات مفتاحية للمطابقة مع اسم الفرصة في المستودع (كلها يجب أن تظهر). */
  match: string[];
}

export interface StationDef {
  id: string;
  title: string;
  note: string;
  picks: StationPick[];
}

export const DAILY_STATIONS: StationDef[] = [
  {
    id: "morning",
    title: "الصباح",
    note: "بداية اليوم داخل البيت.",
    picks: [
      { title: "اختيار ملابس اليوم", hint: "ما يناسب الطقس والخروج.", match: ["اختيار ملابس النهار"] },
      { title: "ارتداء الملابس", hint: "خطوة صباحية معتادة.", match: ["ارتداء الملابس"] },
      { title: "تحضير الأطباق والأكواب", hint: "قبل الفطور.", match: ["تحضير الأطباق والأكواب"] },
      { title: "مسح طاولة الطعام", hint: "بعد انتهاء الفطور.", match: ["مسح طاولة الطعام"] },
    ],
  },
  {
    id: "getting-ready",
    title: "الاستعداد للخروج",
    note: "ما نجهزه قبل مغادرة البيت.",
    picks: [
      { title: "تجهيز الحقيبة الشخصية", hint: "وضع ما نحتاجه اليوم.", match: ["تجهيز الحقيبة الشخصية"] },
      { title: "ارتداء الحذاء", hint: "قبل الخروج من الباب.", match: ["ارتداء الحذاء"] },
      { title: "اختيار ملابس مناسبة للمناسبة", hint: "عند وجود زيارة أو مناسبة.", match: ["اختيار ملابس مناسبة"] },
    ],
  },
  {
    id: "outside",
    title: "خارج المنزل",
    note: "مشاوير الأسرة المعتادة.",
    picks: [
      { title: "اختيار المنتجات", hint: "المشاركة في اختيار ما نشتريه.", match: ["اختيار المنتجات"] },
      { title: "الدفع والمغادرة", hint: "لحظة إنهاء الشراء.", match: ["الدفع والمغادرة"] },
      { title: "حمل الأكياس والمشتريات", hint: "مشاركة في الحمل حسب المستطاع.", match: ["حمل الأكياس"] },
    ],
  },
  {
    id: "back-home",
    title: "العودة إلى المنزل",
    note: "أول دقائق الرجوع.",
    picks: [
      { title: "خلع الحذاء في مكانه", hint: "أول خطوة بعد الدخول.", match: ["خلع الحذاء في المكان"] },
      { title: "تفريغ الأكياس على المائدة", hint: "إخراج ما أحضرناه.", match: ["تفريغ الأكياس وتوزيع"] },
      { title: "ترتيب الأحذية في مكانها", hint: "عند المدخل.", match: ["ترتيب الأحذية في مكان"] },
    ],
  },
  {
    id: "mealtime",
    title: "وقت الطعام",
    note: "قبل الأكل وبعده.",
    picks: [
      { title: "ترتيب المائدة", hint: "تجهيز الطاولة للجميع.", match: ["ترتيب المائدة"] },
      { title: "تجهيز أدوات المائدة", hint: "الملاعق والأكواب.", match: ["تجهيز أدوات المائدة"] },
      { title: "تجميع مكونات الوجبة", hint: "إعداد ساندويتش أو وجبة بسيطة.", match: ["الساندويتش"] },
      { title: "توزيع الأكواب والأطباق", hint: "قبل بدء الطعام.", match: ["توزيع الأكواب والأطباق"] },
      { title: "جمع الأطباق بعد الطعام", hint: "بعد انتهاء الجميع.", match: ["جمع الأكواب والأطباق بعد"] },
    ],
  },
  {
    id: "housework",
    title: "أعمال المنزل",
    note: "أعمال متكررة يمكن مشاركتها.",
    picks: [
      { title: "فرز الملابس قبل الغسيل", hint: "قبل تشغيل الغسيل.", match: ["فرز الملابس المتسخة"] },
      { title: "نشر الملابس", hint: "بعد انتهاء الغسيل.", match: ["نشر الملابس"] },
      { title: "طي الملابس النظيفة", hint: "بعد الجفاف.", match: ["طي الملابس النظيفة"] },
      { title: "فرز الصحون والأكواب", hint: "قبل الغسل أو بعده.", match: ["فرز الصحون"] },
      { title: "مسح الطاولة", hint: "تنظيف سريع بعد الاستخدام.", match: ["مسح الطاولة"] },
      { title: "كنس الأرضية", hint: "بعد الطعام أو التحضير.", match: ["كنس الأرضية من الفتات"] },
    ],
  },
  {
    id: "family-time",
    title: "وقت الأسرة",
    note: "وقت مشترك في البيت.",
    picks: [
      { title: "ترتيب صينية الضيافة", hint: "قبل جلسة الأسرة أو الضيوف.", match: ["ترتيب صينية الضيافة"] },
      { title: "وضع أكياس الشاي أو البن", hint: "تحضير مشروب للجميع.", match: ["أكياس الشاي"] },
      { title: "تنظيف سطح الطاولة", hint: "قبل الجلسة أو بعدها.", match: ["تنظيف سطح الطاولة"] },
    ],
  },
  {
    id: "evening",
    title: "المساء",
    note: "ترتيب البيت قبل نهاية اليوم.",
    picks: [
      { title: "فرد كيس القمامة في السلة", hint: "بعد إفراغ السلة.", match: ["فرد كيس القمامة"] },
      { title: "خلع الملابس في نهاية اليوم", hint: "ووضعها في مكانها.", match: ["خلع الملابس في نهاية اليوم"] },
      { title: "مسح سطح العمل", hint: "إغلاق المطبخ لليوم.", match: ["مسح سطح العمل"] },
    ],
  },
  {
    id: "bedtime",
    title: "الاستعداد للنوم",
    note: "آخر محطة في اليوم.",
    picks: [
      { title: "اختيار ملابس النوم", hint: "قبل النوم مباشرة.", match: ["اختيار ملابس النوم"] },
      { title: "تغيير الملابس", hint: "استبدال ملابس اليوم.", match: ["تغيير الملابس"] },
    ],
  },
];

export interface ResolvedPick {
  title: string;
  hint: string;
  /** سياق الحدث من المستودع (يظهر عند الحاجة فقط). */
  context: string;
  opportunityId: string;
}

export interface ResolvedStation {
  id: string;
  title: string;
  note: string;
  picks: ResolvedPick[];
}

let cache: ResolvedStation[] | null = null;

function resolvePick(pick: StationPick, all: FlatOpportunity[], used: Set<string>): ResolvedPick | null {
  const found = all.find(
    (o) =>
      !used.has(o.opportunity.id) &&
      pick.match.every((m) => o.opportunity.name.includes(m)),
  );
  if (!found) return null;
  used.add(found.opportunity.id);
  return {
    title: pick.title,
    hint: pick.hint,
    context: found.event.name,
    opportunityId: found.opportunity.id,
  };
}

/** محطات اليوم بعد ربط كل فرصة بمعرف حقيقي من المستودع. */
export function getResolvedStations(): ResolvedStation[] {
  if (cache) return cache;
  const all = getAllOpportunities();
  const used = new Set<string>();
  cache = DAILY_STATIONS.map((s) => ({
    id: s.id,
    title: s.title,
    note: s.note,
    picks: s.picks
      .map((p) => resolvePick(p, all, used))
      .filter((p): p is ResolvedPick => p !== null),
  })).filter((s) => s.picks.length > 0);
  return cache;
}

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
      { title: "ترتيب السرير", hint: "بعد الاستيقاظ مباشرة.", match: ["ترتيب السرير"] },
      { title: "تنسيق الوسائد", hint: "جزء صغير من ترتيب الغرفة.", match: ["الوسائد", "تنسيق"] },
      { title: "تجهيز الأطباق والأكواب", hint: "قبل الفطور.", match: ["تحضير الأطباق"] },
      { title: "ترتيب فرش الأسنان", hint: "بعد العناية الصباحية.", match: ["فرش الأسنان"] },
    ],
  },
  {
    id: "getting-ready",
    title: "الاستعداد للخروج",
    note: "ما نجهزه قبل مغادرة البيت.",
    picks: [
      { title: "تجهيز الحقيبة الشخصية", hint: "وضع ما نحتاجه اليوم.", match: ["تجهيز الحقيبة"] },
      { title: "ارتداء الحذاء", hint: "قبل الخروج من الباب.", match: ["ارتداء الحذاء"] },
      { title: "إغلاق الحقيبة ووضعها في مكانها", hint: "خطوة أخيرة قبل الخروج.", match: ["إغلاق الحقيبة"] },
    ],
  },
  {
    id: "outside",
    title: "خارج المنزل",
    note: "مشاوير الأسرة المعتادة.",
    picks: [
      { title: "حمل الأغراض", hint: "المشاركة في حمل ما اشتريناه.", match: ["حمل"] },
      { title: "اختيار المنتجات", hint: "المشاركة في اختيار ما نحتاجه.", match: ["اختيار المنتجات"] },
      { title: "الدفع عند الصندوق", hint: "لحظة إنهاء الشراء.", match: ["الدفع"] },
    ],
  },
  {
    id: "back-home",
    title: "العودة إلى المنزل",
    note: "أول دقائق الرجوع.",
    picks: [
      { title: "خلع الحذاء في مكانه", hint: "أول خطوة بعد الدخول.", match: ["خلع الحذاء", "المخصص"] },
      { title: "إخراج المنتجات من الأكياس", hint: "تفريغ ما أحضرناه.", match: ["إخراج المنتجات من الأكياس"] },
      { title: "توزيع الأغراض على أماكنها", hint: "كل شيء إلى مكانه.", match: ["توزيع"] },
    ],
  },
  {
    id: "mealtime",
    title: "وقت الطعام",
    note: "قبل الأكل وبعده.",
    picks: [
      { title: "ترتيب المائدة", hint: "تجهيز الطاولة للجميع.", match: ["ترتيب المائدة"] },
      { title: "تجهيز أدوات المائدة", hint: "الملاعق والأكواب.", match: ["تجهيز أدوات المائدة"] },
      { title: "تجميع مكونات الساندويتش", hint: "إعداد وجبة بسيطة.", match: ["الساندويتش"] },
      { title: "إعادة الأطباق إلى الخزائن", hint: "بعد انتهاء الطعام.", match: ["إعادة الأكواب والأطباق"] },
    ],
  },
  {
    id: "housework",
    title: "أعمال المنزل",
    note: "أعمال متكررة يمكن مشاركتها.",
    picks: [
      { title: "فرز الملابس قبل الغسيل", hint: "قبل تشغيل الغسيل.", match: ["فرز الملابس المتسخة"] },
      { title: "نشر الملابس", hint: "بعد انتهاء الغسيل.", match: ["نشر الملابس"] },
      { title: "طي الملابس النظيفة", hint: "بعد الجفاف.", match: ["طي الملابس"] },
      { title: "مسح الطاولة", hint: "تنظيف سريع بعد الاستخدام.", match: ["مسح الطاولة"] },
      { title: "فرز الصحون والأكواب", hint: "قبل الغسل أو بعده.", match: ["فرز الصحون"] },
      { title: "ترتيب الأحذية", hint: "عند المدخل.", match: ["ترتيب الأحذية"] },
    ],
  },
  {
    id: "family-time",
    title: "وقت الأسرة",
    note: "وقت مشترك في البيت.",
    picks: [
      { title: "ترتيب الطاولة الوسطية", hint: "قبل جلسة الأسرة.", match: ["الطاولة الوسطية"] },
      { title: "تجهيز الضيافة", hint: "عند وجود ضيوف.", match: ["الضيافة"] },
      { title: "ري النباتات", hint: "عناية بسيطة بالبيت.", match: ["ري النباتات"] },
    ],
  },
  {
    id: "evening",
    title: "المساء",
    note: "ترتيب البيت قبل نهاية اليوم.",
    picks: [
      { title: "جمع القمامة للتخلص منها", hint: "خطوة مسائية معتادة.", match: ["جمع القمامة"] },
      { title: "ربط كيس القمامة", hint: "قبل إخراجه.", match: ["ربط كيس القمامة"] },
      { title: "إعادة الأغراض إلى أماكنها", hint: "جولة ترتيب قصيرة.", match: ["إعادة", "مكان"] },
    ],
  },
  {
    id: "bedtime",
    title: "الاستعداد للنوم",
    note: "آخر محطة في اليوم.",
    picks: [
      { title: "اختيار ملابس النوم", hint: "قبل النوم مباشرة.", match: ["ملابس النوم"] },
      { title: "إدخال الوسائد في أغطيتها", hint: "عند تغيير الفراش.", match: ["إدخال الوسائد"] },
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

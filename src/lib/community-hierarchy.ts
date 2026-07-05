// الهيكل الهرمي للأنشطة المجتمعية
import type {
  ParticipationLevels,
  FullCard,
  Opportunity,
  LifeEvent,
  GeneralActivity,
} from "./home-hierarchy";

export interface CommunityDomain {
  id: string;
  name: string;
  activities: GeneralActivity[];
}

const defaultLevels: ParticipationLevels = {
  guided: "يشارك في خطوة واحدة بعد تلميح مباشر.",
  shared: "ينفذ عدة خطوات بمساندة بسيطة.",
  independent: "يتابع الفرصة كاملة ويتحقق من النتيجة.",
};

const opp = (
  id: string,
  name: string,
  levels: ParticipationLevels = defaultLevels,
): Opportunity => ({ id, name, levels });

const pickProductCard: FullCard = {
  title: "اختيار منتج من الرف",
  whyParticipate:
    "تساعد هذه المشاركة الشاب على اتخاذ قرار استهلاكي واقعي داخل بيئة مجتمعية.",
  setup: "قائمة مشتريات، وقت غير مزدحم، منتج واضح، ميزانية محددة.",
  steps: [
    "الوصول إلى القسم",
    "البحث عن المنتج",
    "مقارنة السعر أو الحجم",
    "اختيار المنتج",
    "وضعه في العربة",
    "مراجعة القائمة",
  ],
  support:
    "تلميح بصري للقسم، تلميح لفظي مختصر، تقليل الخيارات عند الحاجة، إتاحة وقت كافٍ لاتخاذ القرار.",
  levels: {
    guided: "يلتقط المنتج بعد توجيه مباشر.",
    shared: "يختار المنتج من الرف الصحيح مع تلميح.",
    independent: "يقارن السعر والحجم والصلاحية ثم يختار المنتج.",
  },
  progressIndicators: [
    "وصل إلى القسم الصحيح",
    "اختار المنتج المناسب",
    "راجع السعر",
    "احتاج مساعدة أقل",
    "أكمل الخطوة داخل المتجر",
  ],
  nextStep: "الدفع ومراجعة الفاتورة.",
  expectedMinutes: 20,
  needsOutside: true,
  needsTools: false,
  keywords: ["تسوق", "منتج", "متجر", "قائمة", "سعر"],
};

const chooseProductsEvent: LifeEvent = {
  id: "CEV-CHOOSE",
  name: "اختيار المنتجات",
  opportunities: [
    {
      id: "COP-PICK",
      name: "مقارنة المنتجات",
      levels: pickProductCard.levels,
      card: pickProductCard,
    },
    opp("COP-PRICE", "مقارنة الأسعار", {
      guided: "يشير إلى السعر الأقل بعد تلميح.",
      shared: "يقارن سعرين بمساندة بسيطة.",
      independent: "يقارن الأسعار ويختار الأنسب للميزانية.",
    }),
    opp("COP-SIZE", "مقارنة الأحجام"),
    opp("COP-EXPIRY", "قراءة تاريخ الصلاحية", {
      guided: "ينظر إلى التاريخ بعد إشارة مباشرة.",
      shared: "يقرأ التاريخ ويقارنه مع اليوم.",
      independent: "يستبعد المنتج منتهي الصلاحية ذاتياً.",
    }),
    opp("COP-ALT", "اختيار البدائل"),
    opp("COP-QUALITY", "مراجعة الجودة"),
  ],
};

const emptyEvent = (id: string, name: string): LifeEvent => ({
  id,
  name,
  opportunities: [],
});

const shoppingActivity: GeneralActivity = {
  id: "CGA-SHOP",
  name: "التسوق العام",
  events: [
    emptyEvent("CEV-PLAN", "التخطيط للتسوق"),
    emptyEvent("CEV-ARRIVE", "الوصول لمكان التسوق"),
    chooseProductsEvent,
    emptyEvent("CEV-PAY", "الدفع"),
    emptyEvent("CEV-RETURN", "العودة"),
    emptyEvent("CEV-BUDGET", "مراجعة الميزانية"),
    emptyEvent("CEV-REFUND", "الاستبدال أو الإرجاع"),
    emptyEvent("CEV-APPS", "استخدام تطبيقات التسوق"),
  ],
};

const emptyActivity = (id: string, name: string): GeneralActivity => ({
  id,
  name,
  events: [],
});

const emptyDomain = (
  id: string,
  name: string,
  activities: GeneralActivity[] = [],
): CommunityDomain => ({ id, name, activities });

export const communityHierarchy: CommunityDomain[] = [
  {
    id: "C1",
    name: "التسوق والاستهلاك",
    activities: [shoppingActivity],
  },
  emptyDomain("C2", "التنقل والمواصلات"),
  emptyDomain("C3", "الخدمات الصحية"),
  emptyDomain("C4", "الخدمات الحكومية"),
  emptyDomain("C5", "الخدمات البنكية والمالية"),
  emptyDomain("C6", "المطاعم والمقاهي"),
  emptyDomain("C7", "التوظيف والعمل"),
  emptyDomain("C8", "التدريب والتعلم"),
  emptyDomain("C9", "المشاركة الاجتماعية"),
  emptyDomain("C10", "الترفيه ونمط الحياة"),
  emptyDomain("C11", "الخدمات التجارية"),
  emptyDomain("C12", "الاتصالات والتقنية"),
  emptyDomain("C13", "الثقافة والشعائر"),
  emptyDomain("C14", "السفر والتنقل"),
  emptyDomain("C15", "الطوارئ والسلامة المجتمعية"),
];

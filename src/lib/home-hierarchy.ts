// الهيكل الهرمي للأنشطة المنزلية
// مجال ← نشاط عام ← حدث حياة ← فرصة مشاركة ← بطاقة

export interface ParticipationLevels {
  guided: string;
  shared: string;
  independent: string;
}

export interface FullCard {
  title: string;
  whyParticipate: string;
  setup: string;
  steps: string[];
  support: string;
  levels: ParticipationLevels;
  progressIndicators: string[];
  nextStep: string;
}

export interface Opportunity {
  id: string;
  name: string;
  levels?: ParticipationLevels;
  card?: FullCard;
}

export interface LifeEvent {
  id: string;
  name: string;
  opportunities: Opportunity[];
}

export interface GeneralActivity {
  id: string;
  name: string;
  events: LifeEvent[];
}

export interface HomeDomain {
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

// بطاقة جمع الملابس الكاملة (النموذج المرجعي)
const collectClothesCard: FullCard = {
  title: "جمع الملابس قبل الغسيل",
  whyParticipate:
    "تساعد هذه المشاركة الشاب على تحمل مسؤولية جزء من إدارة ملابسه الشخصية.",
  setup: "سلة واضحة، وقت ثابت، تلميح بصري عند الحاجة.",
  steps: [
    "التوجه إلى الغرفة",
    "تحديد الملابس المستخدمة",
    "وضعها في السلة",
    "نقل السلة إلى مكان الغسيل",
  ],
  support: "بصري، لفظي، بيئي، جسدي عند الحاجة.",
  levels: {
    guided: "يضع قطعة واحدة في السلة بعد تلميح مباشر.",
    shared: "يجمع ملابسه من غرفته ويضعها في السلة.",
    independent: "يتابع موعد الغسيل وينقل السلة إلى مكان الغسيل.",
  },
  progressIndicators: ["بدأ", "أكمل", "احتاج دعماً أقل", "كرر المشاركة"],
  nextStep: "فرز الملابس",
};

// حدث: غسل الملابس
const washingEvent: LifeEvent = {
  id: "EV-WASH",
  name: "غسل الملابس",
  opportunities: [
    {
      id: "OP-COLLECT",
      name: "جمع الملابس",
      levels: collectClothesCard.levels,
      card: collectClothesCard,
    },
    opp("OP-SORT", "فرز الملابس", {
      guided: "يفرز قطعتين حسب اللون بمساعدة مباشرة.",
      shared: "يفرز ملابسه إلى أبيض وملون مع تلميح بسيط.",
      independent: "يفرز الملابس كاملة ويجهز كل مجموعة للغسيل.",
    }),
    opp("OP-POCKETS", "مراجعة الجيوب"),
    opp("OP-PROGRAM", "اختيار برنامج الغسيل"),
    opp("OP-DETERGENT", "إضافة المنظف"),
    opp("OP-START", "تشغيل الغسالة"),
    opp("OP-UNLOAD", "إخراج الملابس"),
    opp("OP-HANG", "نشر الملابس", {
      guided: "يعلق قطعة واحدة باستخدام مشابك مناسبة.",
      shared: "يعلق عدة قطع مع تلميح.",
      independent: "ينشر الملابس ويراعي المسافة والتهوية.",
    }),
    opp("OP-COLLECT-DRY", "تجميع الملابس الجافة"),
    opp("OP-FOLD", "طي الملابس"),
    opp("OP-CLOSET", "ترتيب الدولاب", {
      guided: "يضع قطعة مطوية في مكان محدد.",
      shared: "يرتب مجموعة ملابس في الرف الصحيح.",
      independent: "ينظم ملابسه حسب الاستخدام: خروج، منزل، مناسبة.",
    }),
  ],
};

const emptyEvent = (id: string, name: string): LifeEvent => ({
  id,
  name,
  opportunities: [],
});

// نشاط: إدارة الملابس
const clothesActivity: GeneralActivity = {
  id: "GA-CLOTHES",
  name: "إدارة الملابس",
  events: [
    washingEvent,
    emptyEvent("EV-DRY", "تجفيف الملابس"),
    emptyEvent("EV-IRON", "كي الملابس"),
    emptyEvent("EV-ORGANIZE", "ترتيب الملابس"),
    emptyEvent("EV-BUY", "شراء الملابس"),
    emptyEvent("EV-DISPOSE", "التخلص من الملابس القديمة"),
    emptyEvent("EV-WORK", "تجهيز ملابس العمل"),
    emptyEvent("EV-OCCASION", "تجهيز ملابس المناسبات"),
  ],
};

const emptyActivity = (id: string, name: string): GeneralActivity => ({
  id,
  name,
  events: [],
});

// مجال: إدارة المنزل
const houseDomain: HomeDomain = {
  id: "H1",
  name: "إدارة المنزل",
  activities: [
    clothesActivity,
    emptyActivity("GA-ROOMS", "تنظيم الغرف"),
    emptyActivity("GA-CLEAN", "النظافة المنزلية"),
    emptyActivity("GA-MAINT", "الصيانة المنزلية البسيطة"),
    emptyActivity("GA-STOCK", "إدارة المخزون"),
    emptyActivity("GA-WASTE", "إدارة النفايات"),
  ],
};

const emptyDomain = (id: string, name: string): HomeDomain => ({
  id,
  name,
  activities: [],
});

export const homeHierarchy: HomeDomain[] = [
  houseDomain,
  emptyDomain("H2", "إدارة الغذاء"),
  emptyDomain("H3", "إدارة الصحة المنزلية"),
  emptyDomain("H4", "السلامة المنزلية"),
  emptyDomain("H5", "إدارة الوقت والروتين"),
  emptyDomain("H6", "المشاركة الأسرية"),
  emptyDomain("H7", "الحديقة والزراعة"),
  emptyDomain("H8", "رعاية الحيوانات الأليفة"),
];

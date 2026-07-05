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
  teachingAids?: string[];
  nextStep: string;
  expectedMinutes?: number;
  needsOutside?: boolean;
  needsTools?: boolean;
  keywords?: string[];
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

const oppCard = (id: string, card: FullCard): Opportunity => ({
  id,
  name: card.title,
  levels: card.levels,
  card,
});

const opp = (id: string, name: string): Opportunity => ({ id, name });

// ============ بطاقات إدارة الملابس ============
const collectClothesCard: FullCard = {
  title: "جمع الملابس قبل الغسيل",
  whyParticipate:
    "تساعد هذه المشاركة الشاب على تحمل مسؤولية جزء من إدارة ملابسه الشخصية، وتدعم الاستقلالية وتنظيم الروتين اليومي.",
  setup:
    "- اختر وقتاً ثابتاً قريباً من موعد الغسيل.\n- ضع سلة واضحة في مكان ثابت.\n- استخدم تلميحاً بصرياً عند الحاجة.\n- قلل المشتتات في بداية التنفيذ.",
  steps: [
    "التوجه إلى مكان الملابس.",
    "تحديد الملابس المستخدمة.",
    "وضع الملابس في السلة.",
    "نقل السلة إلى مكان الغسيل.",
    "إبلاغ الأسرة بانتهاء الخطوة.",
  ],
  support:
    "- دعم بصري: صورة سلة الملابس.\n- دعم لفظي: تلميح قصير مثل \"وقت الغسيل\".\n- دعم بيئي: وضع السلة في مكان ثابت.\n- دعم جسدي: عند الحاجة فقط وبأقل قدر ممكن.",
  levels: {
    guided: "يضع قطعة واحدة في السلة بعد تلميح مباشر.",
    shared: "يجمع ملابسه من غرفته ويضعها في السلة.",
    independent: "يتابع موعد الغسيل وينقل السلة إلى مكان الغسيل.",
  },
  progressIndicators: [
    "بدأ عند التلميح.",
    "أكمل أكثر من خطوة.",
    "احتاج دعماً أقل من السابق.",
    "كرر المشاركة في يوم آخر.",
  ],
  teachingAids: ["بطاقة مصورة", "قائمة تحقق", "فيديو قصير لاحقاً", "رمز QR لاحقاً"],
  nextStep: "فرز الملابس حسب اللون.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["ملابس", "غسيل", "منزل", "سلة", "جمع"],
};

const sortClothesCard: FullCard = {
  title: "فرز الملابس حسب اللون والنوع",
  whyParticipate:
    "يتعلم الشاب اتخاذ قرار عملي بسيط يحمي الملابس ويجنب الأخطاء الشائعة في الغسيل.",
  setup: "سلتان أو أكثر بألوان مختلفة، مساحة كافية على الأرض، وقت هادئ.",
  steps: [
    "إخراج الملابس من السلة",
    "التمييز بين الأبيض والملون",
    "فصل الملابس الحساسة",
    "وضع كل مجموعة في سلتها",
    "التأكد من عدم اختلاط القطع",
  ],
  support: "بطاقات لونية، تلميح لفظي مختصر، نمذجة أولى ثم مشاركة.",
  levels: {
    guided: "يفرز قطعتين حسب اللون بمساعدة مباشرة.",
    shared: "يفرز ملابسه إلى أبيض وملون مع تلميح بسيط.",
    independent: "يفرز الملابس كاملة ويجهز كل مجموعة للغسيل.",
  },
  progressIndicators: [
    "ميز الأبيض عن الملون",
    "فصل الملابس الحساسة",
    "أكمل الفرز دون خطأ",
    "احتاج مساعدة أقل",
  ],
  teachingAids: ["بطاقة ألوان", "سلال معنونة"],
  nextStep: "تشغيل الغسالة أو اختيار البرنامج المناسب.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["فرز", "ملابس", "ألوان", "غسيل"],
};

const hangClothesCard: FullCard = {
  title: "نشر الملابس بعد الغسيل",
  whyParticipate:
    "يمنح الشاب دوراً واضحاً ومحسوساً في مهمة تنتهي بنتيجة مرئية سريعة.",
  setup: "حبل غسيل أو مجفف قابل للطي، مشابك، مساحة تهوية جيدة، سلة ملابس مبللة.",
  steps: [
    "نقل السلة إلى مكان النشر",
    "التقاط القطعة ونفضها",
    "تعليقها على الحبل",
    "تثبيتها بمشبك",
    "ترك مسافة بين القطع",
  ],
  support: "نمذجة، تلميح جسدي عند الحاجة، مشابك سهلة الاستخدام.",
  levels: {
    guided: "يعلق قطعة واحدة باستخدام مشابك مناسبة.",
    shared: "يعلق عدة قطع مع تلميح.",
    independent: "ينشر الملابس ويراعي المسافة والتهوية.",
  },
  progressIndicators: [
    "نفض القطعة قبل التعليق",
    "استخدم المشبك بشكل صحيح",
    "ترك مسافات مناسبة",
    "أكمل السلة كاملة",
  ],
  teachingAids: ["مشابك ملونة", "صورة توضيحية للمسافة بين القطع"],
  nextStep: "تجميع الملابس الجافة وطيها.",
  expectedMinutes: 15,
  needsOutside: false,
  needsTools: true,
  keywords: ["نشر", "ملابس", "حبل", "مشابك"],
};

const closetCard: FullCard = {
  title: "ترتيب الدولاب",
  whyParticipate:
    "يعزز استقلالية الشاب في إدارة ملابسه اليومية ويسهل عليه اختيار ملابس مناسبة كل يوم.",
  setup: "دولاب مقسم بأرفف أو صناديق، ملابس مطوية جاهزة، وقت غير مزدحم.",
  steps: [
    "فتح الدولاب",
    "تحديد مكان كل نوع",
    "وضع الملابس المطوية في مكانها",
    "تعليق الملابس التي تحتاج علاقة",
    "إغلاق الدولاب",
  ],
  support: "ملصقات على الأرفف، صور توضح مكان كل نوع.",
  levels: {
    guided: "يضع قطعة مطوية في مكان محدد.",
    shared: "يرتب مجموعة ملابس في الرف الصحيح.",
    independent: "ينظم ملابسه حسب الاستخدام: خروج، منزل، مناسبة.",
  },
  progressIndicators: [
    "وضع كل نوع في مكانه",
    "علق الملابس التي تحتاج علاقة",
    "حافظ على ترتيب الأرفف",
    "احتاج تذكيراً أقل",
  ],
  teachingAids: ["ملصقات صور", "علاقات ملونة"],
  nextStep: "اختيار ملابس اليوم التالي بشكل مستقل.",
  expectedMinutes: 15,
  needsOutside: false,
  needsTools: true,
  keywords: ["دولاب", "ترتيب", "ملابس", "تنظيم"],
};

const washingEvent: LifeEvent = {
  id: "EV-WASH",
  name: "غسل الملابس",
  opportunities: [
    oppCard("OP-COLLECT", collectClothesCard),
    oppCard("OP-SORT", sortClothesCard),
    opp("OP-POCKETS", "مراجعة الجيوب"),
    opp("OP-PROGRAM", "اختيار برنامج الغسيل"),
    opp("OP-DETERGENT", "إضافة المنظف"),
    opp("OP-START", "تشغيل الغسالة"),
    opp("OP-REMOVE", "إخراج الملابس"),
    oppCard("OP-HANG", hangClothesCard),
    opp("OP-GATHER", "تجميع الملابس الجافة"),
    opp("OP-FOLD", "طي الملابس"),
    oppCard("OP-CLOSET", closetCard),
  ],
};

const clothesEvents: LifeEvent[] = [
  washingEvent,
  { id: "EV-DRY", name: "تجفيف الملابس", opportunities: [] },
  { id: "EV-IRON", name: "كي الملابس", opportunities: [] },
  { id: "EV-ARRANGE", name: "ترتيب الملابس", opportunities: [] },
  { id: "EV-BUY", name: "شراء الملابس", opportunities: [] },
  { id: "EV-DISPOSE", name: "التخلص من الملابس القديمة", opportunities: [] },
  { id: "EV-WORK", name: "تجهيز ملابس العمل", opportunities: [] },
  { id: "EV-OCCASION", name: "تجهيز ملابس المناسبات", opportunities: [] },
];

const clothesActivity: GeneralActivity = {
  id: "GA-CLOTHES",
  name: "إدارة الملابس",
  events: clothesEvents,
};

const homeManagementActivities: GeneralActivity[] = [
  clothesActivity,
  { id: "GA-ROOMS", name: "تنظيم الغرف", events: [] },
  { id: "GA-CLEAN", name: "النظافة المنزلية", events: [] },
  { id: "GA-MAINTAIN", name: "الصيانة المنزلية البسيطة", events: [] },
  { id: "GA-STOCK-HOME", name: "إدارة المخزون", events: [] },
  { id: "GA-WASTE", name: "إدارة النفايات", events: [] },
];

// ============ بطاقات إدارة الغذاء ============
const fridgeCard: FullCard = {
  title: "مراجعة الثلاجة",
  whyParticipate:
    "يتعلم الشاب متابعة ما هو متوفر وما ينقص قبل إعداد قائمة المشتريات، ويقلل الهدر.",
  setup: "ثلاجة نظيفة نسبياً، ورقة وقلم أو تطبيق ملاحظات، وقت هادئ قبل التسوق.",
  steps: [
    "فتح الثلاجة",
    "مراجعة كل رف",
    "تسجيل المنتجات الناقصة",
    "التخلص من المنتهي الصلاحية",
    "إغلاق الثلاجة",
  ],
  support: "قائمة مرجعية مصورة، تلميح لفظي، نمذجة أولى.",
  levels: {
    guided: "يفتح الثلاجة ويشير إلى صنف ناقص بعد تلميح.",
    shared: "يراجع رفاً كاملاً ويسجل ما ينقص بمساعدة.",
    independent: "يراجع الثلاجة كاملة ويعد قائمة أولية.",
  },
  progressIndicators: [
    "فحص كل رف",
    "سجل الناقص",
    "لاحظ منتجات قاربت على النفاد",
    "أكمل الخطوة دون تذكير",
  ],
  teachingAids: ["قائمة مصورة", "بطاقات أصناف"],
  nextStep: "إعداد قائمة المشتريات النهائية.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["ثلاجة", "غذاء", "مخزون", "تسوق"],
};

const shoppingListCard: FullCard = {
  title: "إعداد قائمة مشتريات",
  whyParticipate:
    "يمنح الشاب دوراً في تخطيط احتياجات الأسرة ويربطه بمهارات القراءة والكتابة العملية.",
  setup: "ورقة وقلم أو تطبيق ملاحظات، نتيجة مراجعة الثلاجة، وقت هادئ.",
  steps: [
    "مراجعة الأصناف الناقصة",
    "إضافة كل صنف إلى القائمة",
    "تجميع الأصناف حسب القسم",
    "مراجعة القائمة النهائية",
    "حفظ القائمة أو طباعتها",
  ],
  support: "قائمة نموذجية، صور للأصناف، تلميح لفظي.",
  levels: {
    guided: "يضيف صنفاً واحداً بعد تلميح مباشر.",
    shared: "يكتب عدة أصناف مع تذكير بسيط.",
    independent: "يعد القائمة كاملة ويرتبها حسب أقسام المتجر.",
  },
  progressIndicators: [
    "سجل كل الأصناف",
    "رتبها حسب القسم",
    "راجع القائمة",
    "احتاج تذكيراً أقل",
  ],
  teachingAids: ["نموذج قائمة", "صور الأصناف"],
  nextStep: "الذهاب إلى المتجر واختيار المنتجات.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["قائمة", "مشتريات", "تسوق", "تخطيط"],
};

const setTableCard: FullCard = {
  title: "إعداد المائدة",
  whyParticipate:
    "دور يومي واضح النتيجة يعزز شعور الشاب بالمساهمة في وجبة العائلة.",
  setup: "أدوات مائدة نظيفة، مفرش، عدد الأشخاص محدد مسبقاً، مساحة كافية.",
  steps: [
    "عد الأشخاص",
    "فرد المفرش",
    "توزيع الأطباق",
    "توزيع الأدوات والأكواب",
    "وضع الماء والخبز",
  ],
  support: "بطاقة صورة للترتيب النهائي، نمذجة، تلميح بصري.",
  levels: {
    guided: "يضع طبقاً واحداً في مكانه بعد تلميح.",
    shared: "يوزع الأطباق والأدوات لأفراد الأسرة مع تذكير.",
    independent: "يجهز المائدة كاملة ويراعي عدد الأشخاص.",
  },
  progressIndicators: [
    "عد الأشخاص بدقة",
    "وزع الأدوات بشكل صحيح",
    "أضاف الماء والخبز",
    "أكمل قبل موعد الوجبة",
  ],
  teachingAids: ["صورة مرجعية للترتيب", "قائمة عدد القطع"],
  nextStep: "المشاركة في تقديم الطعام أو رفع المائدة بعد الوجبة.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["مائدة", "طعام", "وجبة", "أسرة"],
};

const foodActivity: GeneralActivity = {
  id: "GA-FOOD",
  name: "تحضير الطعام والمخزون",
  events: [
    {
      id: "EV-STOCK",
      name: "إدارة مخزون الغذاء",
      opportunities: [
        oppCard("OP-FRIDGE", fridgeCard),
        oppCard("OP-LIST", shoppingListCard),
      ],
    },
    {
      id: "EV-MEAL",
      name: "تجهيز الوجبات",
      opportunities: [oppCard("OP-TABLE", setTableCard)],
    },
  ],
};

// ============ بطاقات السلامة المنزلية ============
const closingHomeCard: FullCard = {
  title: "فحص إغلاق المنزل قبل النوم أو الخروج",
  whyParticipate:
    "يعزز الشعور بالمسؤولية عن سلامة الأسرة ويبني روتين ختامي واضح لليوم.",
  setup: "قائمة فحص قصيرة، وقت ثابت قبل النوم أو الخروج، إضاءة كافية.",
  steps: [
    "فحص باب المنزل الرئيسي",
    "فحص النوافذ",
    "إغلاق مصادر الغاز",
    "فحص الحنفيات",
    "إطفاء الأضواء غير الضرورية",
  ],
  support: "قائمة مصورة، تلميح لفظي، مرافقة أولى ثم مشاركة تدريجية.",
  levels: {
    guided: "يفحص بنداً واحداً بعد تلميح مباشر.",
    shared: "يفحص عدة بنود بمساعدة بسيطة.",
    independent: "ينفذ الفحص كاملاً ويؤكد الإغلاق.",
  },
  progressIndicators: [
    "أكمل كل بنود القائمة",
    "لاحظ خللاً وأبلغ عنه",
    "التزم بالوقت الثابت",
    "احتاج تذكيراً أقل",
  ],
  teachingAids: ["قائمة فحص مصورة", "بطاقة تذكير على الباب"],
  nextStep: "تسجيل إتمام الفحص في روتين المساء.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: false,
  keywords: ["سلامة", "إغلاق", "منزل", "روتين"],
};

const safetyActivity: GeneralActivity = {
  id: "GA-SAFETY",
  name: "روتين السلامة اليومية",
  events: [
    {
      id: "EV-CLOSE",
      name: "تأمين المنزل",
      opportunities: [oppCard("OP-CLOSE", closingHomeCard)],
    },
  ],
};

// ============ بطاقات الصحة المنزلية ============
const medicineCard: FullCard = {
  title: "تجهيز الدواء اليومي",
  whyParticipate:
    "يبني عادة صحية مسؤولة ويقلل خطر نسيان الجرعات، ويعزز الاستقلالية في إدارة الصحة الشخصية.",
  setup:
    "علبة أدوية مقسمة حسب أيام الأسبوع، وصفة طبية واضحة، ماء، وقت ثابت يومياً.",
  steps: [
    "غسل اليدين",
    "فتح علبة الدواء المخصصة لليوم",
    "التأكد من نوع الجرعة",
    "تناول الدواء مع الماء",
    "إغلاق العلبة وتسجيل الجرعة",
  ],
  support:
    "علبة أسبوعية ملونة، منبه في الهاتف، جدول مصور، إشراف الأسرة على الجرعات الحساسة.",
  levels: {
    guided: "يفتح خانة اليوم بعد تلميح مباشر.",
    shared: "يجهز جرعته ويتناولها بمساندة بسيطة.",
    independent: "يتابع مواعيده ويجهز جرعاته دون تذكير.",
  },
  progressIndicators: [
    "التزم بالموعد",
    "تأكد من الجرعة الصحيحة",
    "سجل تناول الدواء",
    "احتاج تذكيراً أقل",
  ],
  teachingAids: ["جدول جرعات مصور", "منبه صوتي"],
  nextStep: "متابعة تعبئة العلبة الأسبوعية أو مراجعة الوصفة.",
  expectedMinutes: 5,
  needsOutside: false,
  needsTools: true,
  keywords: ["دواء", "صحة", "جرعة", "روتين"],
};

const healthActivity: GeneralActivity = {
  id: "GA-HEALTH",
  name: "الصحة المنزلية اليومية",
  events: [
    {
      id: "EV-MED",
      name: "إدارة الدواء",
      opportunities: [oppCard("OP-MED", medicineCard)],
    },
  ],
};

// ============ بطاقات المشاركة الأسرية ============
const familyMeetingCard: FullCard = {
  title: "المشاركة في اجتماع عائلي",
  whyParticipate:
    "يمنح الشاب صوتاً حقيقياً في قرارات الأسرة ويعزز مهاراته الاجتماعية والانتماء.",
  setup:
    "وقت متفق عليه، مكان هادئ، جدول أعمال مختصر، دور واضح للشاب، مدة قصيرة في البداية.",
  steps: [
    "الحضور في الموعد",
    "الاستماع إلى الموضوع",
    "التعبير عن الرأي بجملة قصيرة",
    "الاستماع لآراء الآخرين",
    "المشاركة في القرار النهائي",
  ],
  support:
    "بطاقة تعبير مصورة، تلميح لفظي لطلب الكلمة، تلخيص أسري بسيط بعد كل نقطة.",
  levels: {
    guided: "يحضر ويستمع دون مقاطعة بعد تلميح.",
    shared: "يعبر عن رأيه بجملة قصيرة بمساندة.",
    independent: "يشارك في النقاش ويصوت في القرار.",
  },
  progressIndicators: [
    "حضر الاجتماع",
    "انتظر دوره",
    "عبّر عن رأي واضح",
    "شارك في قرار جماعي",
  ],
  teachingAids: ["بطاقة أدوار", "بطاقة تعبير مصورة"],
  nextStep: "متابعة تنفيذ القرار الذي شارك فيه.",
  expectedMinutes: 20,
  needsOutside: false,
  needsTools: false,
  keywords: ["اجتماع", "أسرة", "قرار", "مشاركة"],
};

const familyActivity: GeneralActivity = {
  id: "GA-FAMILY",
  name: "الحياة الأسرية المشتركة",
  events: [
    {
      id: "EV-MEET",
      name: "الاجتماعات والقرارات الأسرية",
      opportunities: [oppCard("OP-MEET", familyMeetingCard)],
    },
  ],
};

// ============ المجالات ============
const emptyDomain = (id: string, name: string): HomeDomain => ({
  id,
  name,
  activities: [],
});

export const homeHierarchy: HomeDomain[] = [
  { id: "H1", name: "إدارة المنزل", activities: homeManagementActivities },
  { id: "H2", name: "إدارة الغذاء", activities: [foodActivity] },
  { id: "H3", name: "إدارة الصحة المنزلية", activities: [healthActivity] },
  { id: "H4", name: "السلامة المنزلية", activities: [safetyActivity] },
  emptyDomain("H5", "إدارة الوقت والروتين"),
  { id: "H6", name: "المشاركة الأسرية", activities: [familyActivity] },
  emptyDomain("H7", "الحديقة والزراعة"),
  emptyDomain("H8", "رعاية الحيوانات الأليفة"),
];

// الهيكل الهرمي للأنشطة المجتمعية
import type {
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

const oppCard = (id: string, card: FullCard): Opportunity => ({
  id,
  name: card.title,
  levels: card.levels,
  card,
});

// ============ التسوق ============
const shopListCard: FullCard = {
  title: "إعداد قائمة التسوق قبل الخروج",
  whyParticipate:
    "يحول الخروج للتسوق إلى نشاط منظم يشارك فيه الشاب في قرارات الأسرة الاستهلاكية.",
  setup: "ورقة أو تطبيق ملاحظات، مراجعة سريعة للثلاجة والمخزن، وقت هادئ قبل الخروج.",
  steps: [
    "مراجعة الأصناف الناقصة",
    "إضافة أصناف اليوم",
    "ترتيب القائمة حسب أقسام المتجر",
    "مراجعة الميزانية المتوقعة",
    "حفظ القائمة أو طباعتها",
  ],
  support: "نموذج قائمة، صور للأصناف، تلميح لفظي.",
  levels: {
    guided: "يضيف صنفاً بعد تلميح مباشر.",
    shared: "يكمل عدة أصناف بمساعدة.",
    independent: "يعد القائمة ويرتبها ويقدر ميزانيتها.",
  },
  progressIndicators: [
    "سجل الأصناف بدقة",
    "رتبها حسب القسم",
    "قدر الميزانية",
    "احتاج تذكيراً أقل",
  ],
  supportResources: ["نموذج قائمة", "صور أقسام المتجر"],
  nextStep: "الذهاب إلى المتجر واختيار المنتجات.",
  expectedMinutes: 10,
  needsOutside: false,
  needsTools: true,
  keywords: ["قائمة", "تسوق", "تخطيط", "متجر"],
};

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
  supportResources: ["صورة القسم", "بطاقة مقارنة سعر"],
  nextStep: "الدفع ومراجعة الفاتورة.",
  expectedMinutes: 20,
  needsOutside: true,
  needsTools: false,
  keywords: ["تسوق", "منتج", "متجر", "قائمة", "سعر"],
};

const reviewInvoiceCard: FullCard = {
  title: "مراجعة الفاتورة بعد الدفع",
  whyParticipate:
    "يبني وعياً مالياً عملياً ويعلم الشاب التحقق من دقة العمليات المالية اليومية.",
  setup: "فاتورة ورقية أو إلكترونية، قائمة الأصناف الأصلية، مكان هادئ بعد الدفع.",
  steps: [
    "استلام الفاتورة",
    "مراجعة الأصناف",
    "مطابقة الأسعار مع الرفوف",
    "التحقق من المجموع النهائي",
    "الاحتفاظ بالفاتورة أو تصويرها",
  ],
  support: "تلميح لفظي، بطاقة توضح بنود الفاتورة، وقت كافٍ للمراجعة.",
  levels: {
    guided: "ينظر إلى الفاتورة بعد تلميح.",
    shared: "يطابق عدة أصناف مع الفاتورة بمساعدة.",
    independent: "يراجع الفاتورة كاملة ويلاحظ أي اختلاف.",
  },
  progressIndicators: [
    "طابق الأصناف",
    "تحقق من المجموع",
    "لاحظ أي خطأ",
    "احتفظ بالفاتورة",
  ],
  supportResources: ["نموذج فاتورة موضحة", "بطاقة أرقام"],
  nextStep: "حفظ الفاتورة أو استخدامها للاسترجاع لاحقاً عند الحاجة.",
  expectedMinutes: 10,
  needsOutside: true,
  needsTools: true,
  keywords: ["فاتورة", "دفع", "مراجعة", "مال"],
};

const shoppingActivity: GeneralActivity = {
  id: "CGA-SHOP",
  name: "التسوق العام",
  events: [
    {
      id: "CEV-PLAN",
      name: "التخطيط للتسوق",
      opportunities: [oppCard("COP-LIST", shopListCard)],
    },
    {
      id: "CEV-CHOOSE",
      name: "اختيار المنتجات",
      opportunities: [oppCard("COP-PICK", pickProductCard)],
    },
    {
      id: "CEV-PAY",
      name: "الدفع ومراجعة الفاتورة",
      opportunities: [oppCard("COP-INVOICE", reviewInvoiceCard)],
    },
  ],
};

// ============ التنقل ============
const taxiCard: FullCard = {
  title: "طلب سيارة أجرة عبر التطبيق",
  whyParticipate:
    "يمنح الشاب أداة تنقل مستقلة داخل حدود آمنة ويعزز ثقته بالخروج المستقل.",
  setup: "هاتف بشبكة إنترنت، تطبيق نقل مثبت، عنوان واضح للوجهة، وقت غير مزدحم.",
  steps: [
    "فتح التطبيق",
    "تحديد الموقع الحالي",
    "إدخال الوجهة",
    "اختيار نوع السيارة",
    "تأكيد الطلب",
    "متابعة وصول السيارة",
    "التأكد من لوحة السيارة قبل الركوب",
  ],
  support: "بطاقة خطوات مصورة للتطبيق، تلميح لفظي، اتصال طوارئ جاهز.",
  levels: {
    guided: "يفتح التطبيق ويؤكد الطلب بعد تلميح.",
    shared: "يدخل الوجهة ويؤكد الطلب بمساعدة بسيطة.",
    independent: "يطلب السيارة ويتحقق من بياناتها ويصل بأمان.",
  },
  progressIndicators: [
    "أدخل الوجهة بدقة",
    "تحقق من لوحة السيارة",
    "استخدم حزام الأمان",
    "أكمل الرحلة دون قلق",
  ],
  supportResources: ["دليل مصور للتطبيق", "بطاقة رقم طوارئ"],
  nextStep: "تقييم الرحلة والدفع داخل التطبيق.",
  expectedMinutes: 15,
  needsOutside: true,
  needsTools: true,
  keywords: ["أجرة", "تنقل", "تطبيق", "سيارة"],
};

const transportActivity: GeneralActivity = {
  id: "CGA-TRANS",
  name: "استخدام وسائل النقل",
  events: [
    {
      id: "CEV-TAXI",
      name: "طلب سيارة أجرة",
      opportunities: [oppCard("COP-TAXI", taxiCard)],
    },
  ],
};

// ============ الصحة ============
const clinicCheckinCard: FullCard = {
  title: "تسجيل الوصول للعيادة",
  whyParticipate:
    "يعلم الشاب متابعة موعده الطبي ويقلل قلقه من الإجراءات المتكررة في المرافق الصحية.",
  setup: "الهوية، بطاقة التأمين، رقم الموعد، الوصول قبل الموعد بربع ساعة.",
  steps: [
    "الدخول إلى العيادة",
    "التوجه إلى مكتب الاستقبال",
    "تقديم الهوية وبطاقة التأمين",
    "تأكيد الموعد",
    "استلام رقم الانتظار",
    "الجلوس في المنطقة المحددة",
  ],
  support: "بطاقة خطوات مصورة، تلميح لفظي، إمكانية استخدام سماعات للحد من الضجيج.",
  levels: {
    guided: "يقدم الهوية بعد تلميح.",
    shared: "يجري خطوات التسجيل مع مرافق.",
    independent: "يسجل وصوله ويتابع رقم انتظاره بشكل مستقل.",
  },
  progressIndicators: [
    "وصل قبل الموعد",
    "قدم الوثائق المطلوبة",
    "التزم بمنطقة الانتظار",
    "دخل غرفة الفحص في موعده",
  ],
  supportResources: ["بطاقة موعد", "بطاقة صور للاستقبال"],
  nextStep: "الدخول إلى غرفة الفحص أو استلام الوصفة الطبية.",
  expectedMinutes: 15,
  needsOutside: true,
  needsTools: true,
  keywords: ["عيادة", "موعد", "صحة", "تسجيل"],
};

const pharmacyCard: FullCard = {
  title: "استلام الدواء من الصيدلية",
  whyParticipate:
    "يعزز مسؤولية الشاب في متابعة علاجه الشخصي ويطور تفاعله في بيئة خدمية.",
  setup: "الوصفة الطبية، بطاقة التأمين، الهوية، وسيلة دفع، الوصول في وقت غير مزدحم.",
  steps: [
    "الدخول إلى الصيدلية",
    "الوقوف في الطابور",
    "تقديم الوصفة والتأمين",
    "الانتظار حتى تجهيز الدواء",
    "الاستماع لشرح الصيدلي",
    "الدفع واستلام الدواء",
  ],
  support: "بطاقة أسئلة جاهزة، تلميح لفظي، صورة عبوة الدواء المتوقعة.",
  levels: {
    guided: "يقدم الوصفة بعد تلميح.",
    shared: "يتابع الخطوات مع مرافق.",
    independent: "يستلم الدواء ويفهم طريقة الاستخدام ويطرح سؤالاً عند الحاجة.",
  },
  progressIndicators: [
    "قدم الوصفة",
    "استمع لشرح الصيدلي",
    "دفع بشكل صحيح",
    "تأكد من اسم الدواء",
  ],
  supportResources: ["بطاقة أسئلة", "قائمة أدوية الأسرة"],
  nextStep: "تخزين الدواء في مكانه الصحيح في المنزل.",
  expectedMinutes: 15,
  needsOutside: true,
  needsTools: true,
  keywords: ["صيدلية", "دواء", "وصفة", "صحة"],
};

const healthActivity: GeneralActivity = {
  id: "CGA-HEALTH",
  name: "زيارة المرافق الصحية",
  events: [
    {
      id: "CEV-CLINIC",
      name: "زيارة العيادة",
      opportunities: [oppCard("COP-CHECKIN", clinicCheckinCard)],
    },
    {
      id: "CEV-PHARM",
      name: "زيارة الصيدلية",
      opportunities: [oppCard("COP-PHARM", pharmacyCard)],
    },
  ],
};

// ============ الخدمات الحكومية ============
const submitDocCard: FullCard = {
  title: "تقديم مستند في مركز خدمة",
  whyParticipate:
    "يبني قدرة الشاب على التعامل مع المعاملات الرسمية بأسلوب هادئ ومنظم.",
  setup: "المستند الأصلي وصورة منه، الهوية، رقم الطلب إن وجد، الوصول قبل الموعد.",
  steps: [
    "الدخول إلى المركز",
    "أخذ رقم الدور",
    "الجلوس في منطقة الانتظار",
    "التوجه للموظف عند مناداة الرقم",
    "تقديم المستند وشرح المطلوب",
    "استلام إيصال الاستلام",
  ],
  support: "بطاقة موقف مصورة، تلميح لفظي، سماعات للحد من الضجيج عند الحاجة.",
  levels: {
    guided: "يقدم المستند بعد تلميح مباشر.",
    shared: "يتابع الخطوات مع مرافق.",
    independent: "ينفذ الإجراء ويحتفظ بالإيصال بشكل مستقل.",
  },
  progressIndicators: [
    "التزم بمكان الانتظار",
    "قدم المستند بدقة",
    "استلم الإيصال",
    "حافظ على هدوئه",
  ],
  supportResources: ["بطاقة صور للمركز", "قائمة مستندات مطلوبة"],
  nextStep: "متابعة حالة الطلب عبر القناة الرسمية.",
  expectedMinutes: 25,
  needsOutside: true,
  needsTools: true,
  keywords: ["مركز خدمة", "معاملة", "مستند", "حكومي"],
};

const govActivity: GeneralActivity = {
  id: "CGA-GOV",
  name: "المعاملات الحكومية",
  events: [
    {
      id: "CEV-SUBMIT",
      name: "تقديم مستند رسمي",
      opportunities: [oppCard("COP-DOC", submitDocCard)],
    },
  ],
};

// ============ المطاعم ============
const restaurantCard: FullCard = {
  title: "طلب وجبة في مطعم",
  whyParticipate:
    "يمنح الشاب تجربة اجتماعية عملية ويطور مهاراته في التواصل وطلب الخدمة.",
  setup: "قائمة الطعام في المطعم، وسيلة دفع، وقت غير مزدحم، خيارات معروفة مسبقاً.",
  steps: [
    "الدخول والجلوس",
    "قراءة القائمة",
    "اختيار الوجبة",
    "استدعاء النادل",
    "طلب الوجبة بوضوح",
    "الانتظار وتناول الوجبة",
    "طلب الفاتورة والدفع",
  ],
  support: "قائمة مصورة، بطاقة عبارات جاهزة، تلميح لفظي، خيار مطعم مألوف.",
  levels: {
    guided: "يشير إلى الوجبة في القائمة بعد تلميح.",
    shared: "يطلب الوجبة بجملة قصيرة بمساعدة.",
    independent: "يطلب ويتفاعل مع النادل ويدفع بشكل مستقل.",
  },
  progressIndicators: [
    "قرأ القائمة",
    "طلب الوجبة بوضوح",
    "تعامل مع النادل بأدب",
    "أكمل الدفع",
  ],
  supportResources: ["قائمة مصورة", "بطاقة عبارات مهذبة"],
  nextStep: "تقييم التجربة والاحتفاظ بالفاتورة إن لزم.",
  expectedMinutes: 45,
  needsOutside: true,
  needsTools: false,
  keywords: ["مطعم", "طلب", "وجبة", "خدمة"],
};

const restaurantActivity: GeneralActivity = {
  id: "CGA-REST",
  name: "زيارة المطاعم",
  events: [
    {
      id: "CEV-ORDER",
      name: "طلب وجبة",
      opportunities: [oppCard("COP-ORDER", restaurantCard)],
    },
  ],
};

// ============ التوظيف ============
const interviewFileCard: FullCard = {
  title: "تجهيز ملف مقابلة عمل",
  whyParticipate:
    "يهيئ الشاب لمرحلة عمل حقيقية ويعزز ثقته بالجاهزية والاستعداد.",
  setup: "السيرة الذاتية، صورة الهوية، الشهادات، ملف بلاستيكي، وقت هادئ قبل يوم المقابلة.",
  steps: [
    "طباعة السيرة الذاتية",
    "تجهيز صور الشهادات",
    "تجهيز صورة الهوية",
    "ترتيب الملف بترتيب مناسب",
    "تجهيز ملابس مناسبة",
    "التأكد من عنوان المقابلة وموعدها",
  ],
  support: "قائمة تحقق مطبوعة، نمذجة أولى، مراجعة أسرية قبل الخروج.",
  levels: {
    guided: "يضع مستنداً في الملف بعد تلميح.",
    shared: "يجمع الملف مع مرافق.",
    independent: "يجهز الملف كاملاً ويراجع عنوان المقابلة بنفسه.",
  },
  progressIndicators: [
    "أكمل قائمة المستندات",
    "رتب الملف",
    "جهز ملابسه",
    "تأكد من الموعد والعنوان",
  ],
  supportResources: ["قائمة تحقق", "نموذج سيرة ذاتية مبسط"],
  nextStep: "الذهاب للمقابلة في الموعد بهدوء وثقة.",
  expectedMinutes: 30,
  needsOutside: false,
  needsTools: true,
  keywords: ["توظيف", "مقابلة", "ملف", "سيرة ذاتية"],
};

const jobActivity: GeneralActivity = {
  id: "CGA-JOB",
  name: "التقدم للعمل",
  events: [
    {
      id: "CEV-INT",
      name: "التحضير للمقابلة",
      opportunities: [oppCard("COP-FILE", interviewFileCard)],
    },
  ],
};

// ============ الطوارئ ============
const emergencyHelpCard: FullCard = {
  title: "طلب المساعدة في موقف طارئ",
  whyParticipate:
    "يحمي الشاب في المواقف الحرجة ويعطيه أداة استجابة واضحة ومحفوظة.",
  setup:
    "بطاقة أرقام طوارئ في المحفظة، هاتف مشحون، جملة تعريفية محفوظة، تدريب مسبق على السيناريو.",
  steps: [
    "الابتعاد عن الخطر إن أمكن",
    "الاتصال بالرقم المناسب",
    "قول اسمه بوضوح",
    "شرح المشكلة بجملة قصيرة",
    "ذكر مكانه",
    "البقاء على الخط حتى وصول المساعدة",
  ],
  support:
    "بطاقة سيناريو مصورة، جملة محفوظة تدريبياً، رقم أسري في مكان بارز، تدريب دوري.",
  levels: {
    guided: "يضغط زر الاتصال بالرقم المحفوظ بعد تلميح.",
    shared: "يتصل ويقول جملته التعريفية بمساندة صوتية.",
    independent: "يبلغ عن الموقف ويتبع تعليمات المشغل.",
  },
  progressIndicators: [
    "استخدم الرقم الصحيح",
    "قال اسمه ومكانه",
    "التزم بتعليمات المشغل",
    "حافظ على هدوئه قدر الإمكان",
  ],
  supportResources: ["بطاقة أرقام طوارئ", "بطاقة سيناريو مصور"],
  nextStep: "إبلاغ الأسرة بالموقف بعد انتهاء الحالة.",
  expectedMinutes: 5,
  needsOutside: true,
  needsTools: true,
  keywords: ["طوارئ", "مساعدة", "سلامة", "اتصال"],
};

const emergencyActivity: GeneralActivity = {
  id: "CGA-EMERG",
  name: "الاستجابة للطوارئ",
  events: [
    {
      id: "CEV-HELP",
      name: "طلب المساعدة",
      opportunities: [oppCard("COP-EMERG", emergencyHelpCard)],
    },
  ],
};

// ============ المجالات ============
const emptyDomain = (
  id: string,
  name: string,
  activities: GeneralActivity[] = [],
): CommunityDomain => ({ id, name, activities });

export const communityHierarchy: CommunityDomain[] = [
  { id: "C1", name: "التسوق والاستهلاك", activities: [shoppingActivity] },
  { id: "C2", name: "التنقل والمواصلات", activities: [transportActivity] },
  { id: "C3", name: "الخدمات الصحية", activities: [healthActivity] },
  { id: "C4", name: "الخدمات الحكومية", activities: [govActivity] },
  emptyDomain("C5", "الخدمات البنكية والمالية"),
  { id: "C6", name: "المطاعم والمقاهي", activities: [restaurantActivity] },
  { id: "C7", name: "التوظيف والعمل", activities: [jobActivity] },
  emptyDomain("C8", "التدريب والتعلم"),
  emptyDomain("C9", "المشاركة الاجتماعية"),
  emptyDomain("C10", "الترفيه ونمط الحياة"),
  emptyDomain("C11", "الخدمات التجارية"),
  emptyDomain("C12", "الاتصالات والتقنية"),
  emptyDomain("C13", "الثقافة والشعائر"),
  emptyDomain("C14", "السفر والتنقل"),
  {
    id: "C15",
    name: "الطوارئ والسلامة المجتمعية",
    activities: [emergencyActivity],
  },
];

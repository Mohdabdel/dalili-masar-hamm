// بوابة الدعم والخدمات - الهيكل الهرمي
// مجال ← خدمة ← فرصة استفادة ← بطاقة خدمة

export interface ServiceFullCard {
  title: string;
  whyNeed: string;
  whenToUse: string;
  whatToPrepare: string[];
  generalSteps: string[];
  whatNext: string[];
  externalLink?: string;
  hotline?: string;
  relatedServices?: string[];
  needsOutside?: boolean;
  needsTools?: boolean;
  keywords?: string[];
}

export interface ServiceOpportunity {
  id: string;
  name: string;
  card?: ServiceFullCard;
  brief?: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  brief?: string;
  opportunities: ServiceOpportunity[];
}

export interface ServiceDomainNode {
  id: string;
  name: string;
  services: ServiceItem[];
}

const opp = (id: string, card: ServiceFullCard): ServiceOpportunity => ({
  id,
  name: card.title,
  card,
});

// ============ الهوية والوثائق ============
const issueCard: ServiceFullCard = {
  title: "إصدار بطاقة أصحاب الهمم",
  whyNeed:
    "تساعد البطاقة الأسرة والشاب على إثبات الأهلية للاستفادة من التسهيلات المرتبطة بالدعم والنقل والتوظيف والخدمات المجتمعية.",
  whenToUse:
    "عند بداية تنظيم ملف الخدمات، أو عند الحاجة للتقديم على تسهيلات مرتبطة بذوي الهمم.",
  whatToPrepare: [
    "الهوية الإماراتية",
    "تقرير طبي أو تشخيصي حديث",
    "بيانات التواصل",
    "صورة شخصية بخلفية بيضاء",
    "حساب على تطبيق أو موقع الجهة المختصة",
  ],
  generalSteps: [
    "التأكد من توفر المستندات",
    "الدخول إلى قناة الجهة المختصة",
    "تعبئة البيانات",
    "رفع المستندات",
    "متابعة حالة الطلب",
    "حفظ البطاقة أو نسخة منها في الملف الشخصي",
  ],
  whatNext: [
    "مراجعة خدمات النقل",
    "مراجعة خدمات التوظيف",
    "مراجعة الخدمات الصحية",
    "حفظ نسخة داخل ملف الوثائق",
  ],
  externalLink: "",
  relatedServices: ["تجديد بطاقة أصحاب الهمم", "تصريح المواقف", "خدمات النقل"],
  needsOutside: false,
  needsTools: true,
  keywords: ["بطاقة", "أصحاب الهمم", "هوية", "تسهيلات"],
};

const renewCard: ServiceFullCard = {
  title: "تجديد بطاقة أصحاب الهمم",
  whyNeed:
    "يضمن التجديد استمرار الاستفادة من الخدمات والتسهيلات دون انقطاع.",
  whenToUse: "قبل انتهاء صلاحية البطاقة بشهر على الأقل، أو عند تغير البيانات.",
  whatToPrepare: [
    "البطاقة الحالية",
    "الهوية الإماراتية",
    "تقرير طبي محدث عند الطلب",
    "بيانات تواصل حديثة",
  ],
  generalSteps: [
    "الدخول إلى تطبيق الجهة المختصة",
    "اختيار خدمة تجديد البطاقة",
    "تحديث البيانات إن لزم",
    "رفع المستندات المطلوبة",
    "دفع الرسوم إن وجدت",
    "استلام البطاقة الجديدة",
  ],
  whatNext: [
    "تحديث نسخة البطاقة في الملف الشخصي",
    "مراجعة الخدمات المرتبطة بالبطاقة",
  ],
  externalLink: "",
  relatedServices: ["إصدار بطاقة أصحاب الهمم", "خدمات النقل"],
  needsOutside: false,
  needsTools: true,
  keywords: ["تجديد", "بطاقة", "أصحاب الهمم"],
};

const parkingPermitCard: ServiceFullCard = {
  title: "تصريح مواقف أصحاب الهمم",
  whyNeed:
    "يتيح التصريح استخدام المواقف المخصصة قرب المرافق العامة ويسهل التنقل اليومي.",
  whenToUse: "بعد إصدار بطاقة أصحاب الهمم، وقبل الاعتماد على التنقل بالسيارة الخاصة.",
  whatToPrepare: [
    "بطاقة أصحاب الهمم سارية",
    "ملكية المركبة",
    "رخصة القيادة",
    "الهوية الإماراتية",
  ],
  generalSteps: [
    "الدخول إلى تطبيق سلطة المواقف",
    "اختيار خدمة تصريح أصحاب الهمم",
    "رفع المستندات",
    "دفع الرسوم إن وجدت",
    "استلام التصريح الرقمي أو الملصق",
    "لصق الملصق في المكان الصحيح",
  ],
  whatNext: [
    "معرفة أماكن المواقف المخصصة",
    "تجديد التصريح قبل انتهائه",
  ],
  externalLink: "",
  relatedServices: ["إصدار بطاقة أصحاب الهمم", "خدمات النقل"],
  needsOutside: false,
  needsTools: true,
  keywords: ["مواقف", "تصريح", "سيارة", "تنقل"],
};

const idDomain: ServiceDomainNode = {
  id: "SD-ID",
  name: "الهوية والوثائق",
  services: [
    {
      id: "SV-DIS-CARD",
      name: "بطاقة أصحاب الهمم",
      brief: "وثيقة تثبت الأهلية للاستفادة من التسهيلات والخدمات.",
      opportunities: [
        opp("SOP-ISSUE", issueCard),
        opp("SOP-RENEW", renewCard),
      ],
    },
    {
      id: "SV-PARK",
      name: "تصاريح المواقف",
      brief: "تصريح يتيح استخدام المواقف المخصصة قرب المرافق.",
      opportunities: [opp("SOP-PARK", parkingPermitCard)],
    },
  ],
};

// ============ النقل ============
const transportCard: ServiceFullCard = {
  title: "خدمات النقل لأصحاب الهمم",
  whyNeed:
    "توفر بدائل نقل ميسرة وآمنة تقلل عوائق الوصول إلى العمل والمرافق العامة.",
  whenToUse:
    "عند عدم توفر وسيلة نقل خاصة، أو عند الحاجة إلى نقل مخصص بأسعار مخفضة.",
  whatToPrepare: [
    "بطاقة أصحاب الهمم سارية",
    "الهوية الإماراتية",
    "حساب على تطبيق النقل المعتمد",
    "عنوان الوجهة",
  ],
  generalSteps: [
    "التسجيل في الخدمة عبر التطبيق أو الموقع",
    "رفع بطاقة أصحاب الهمم",
    "اختيار نوع الرحلة",
    "تحديد الموعد والموقع",
    "متابعة وصول المركبة",
    "الدفع بالخصم المعتمد إن توفر",
  ],
  whatNext: [
    "حفظ العناوين المتكررة",
    "مراجعة تقييم الخدمة بعد الرحلة",
  ],
  externalLink: "",
  relatedServices: ["بطاقة أصحاب الهمم", "تصاريح المواقف"],
  needsOutside: true,
  needsTools: true,
  keywords: ["نقل", "تنقل", "خدمات", "أصحاب الهمم"],
};

const transportDomain: ServiceDomainNode = {
  id: "SD-TRANS",
  name: "النقل",
  services: [
    {
      id: "SV-TRANS",
      name: "خدمات النقل الميسر",
      brief: "بدائل نقل بأسعار مخفضة أو مركبات مجهزة.",
      opportunities: [opp("SOP-TRANS", transportCard)],
    },
  ],
};

// ============ الصحة ============
const insuranceCard: ServiceFullCard = {
  title: "التأمين الصحي",
  whyNeed:
    "يغطي التأمين الصحي تكاليف العلاج والأدوية ويضمن الوصول للخدمات الطبية دون عبء مالي كبير.",
  whenToUse:
    "عند بدء العمل، أو تغيير جهة العمل، أو انتهاء صلاحية بطاقة التأمين الحالية.",
  whatToPrepare: [
    "الهوية الإماراتية",
    "بطاقة أصحاب الهمم إن وجدت",
    "تقرير طبي حديث",
    "بيانات جهة العمل أو الأسرة",
  ],
  generalSteps: [
    "اختيار مزود التأمين المناسب",
    "تعبئة نموذج الاشتراك",
    "رفع المستندات",
    "استلام بطاقة التأمين",
    "تفعيل البطاقة عبر التطبيق",
    "معرفة شبكة المستشفيات المعتمدة",
  ],
  whatNext: [
    "حفظ بطاقة التأمين في المحفظة الرقمية",
    "معرفة الخدمات المشمولة",
    "متابعة مواعيد التجديد",
  ],
  externalLink: "",
  relatedServices: ["الصيدليات", "بطاقة أصحاب الهمم"],
  needsOutside: false,
  needsTools: true,
  keywords: ["تأمين", "صحة", "علاج", "مستشفى"],
};

const pharmacyServiceCard: ServiceFullCard = {
  title: "التعامل مع الصيدليات",
  whyNeed:
    "توفر الصيدليات الأدوية اليومية والمزمنة، وبعضها يقدم خدمة توصيل تسهل على الأسرة.",
  whenToUse:
    "عند صرف وصفة طبية جديدة، أو تجديد دواء مزمن، أو الحاجة لمنتجات صحية.",
  whatToPrepare: [
    "الوصفة الطبية",
    "بطاقة التأمين الصحي",
    "الهوية الإماراتية",
    "قائمة الأدوية الحالية",
  ],
  generalSteps: [
    "اختيار صيدلية معتمدة ضمن التأمين",
    "تقديم الوصفة",
    "التأكد من اسم الدواء والجرعة",
    "الاستماع لتعليمات الاستخدام",
    "طلب خدمة التوصيل عند الحاجة",
    "حفظ الفاتورة",
  ],
  whatNext: [
    "تخزين الدواء في مكان مناسب",
    "إعداد جدول جرعات في المنزل",
    "تجديد الوصفة قبل نفاد الدواء",
  ],
  externalLink: "",
  relatedServices: ["التأمين الصحي"],
  needsOutside: true,
  needsTools: true,
  keywords: ["صيدلية", "دواء", "وصفة", "صحة"],
};

const healthDomain: ServiceDomainNode = {
  id: "SD-HEALTH",
  name: "الصحة",
  services: [
    {
      id: "SV-INS",
      name: "التأمين الصحي",
      brief: "تغطية تكاليف العلاج والأدوية.",
      opportunities: [opp("SOP-INS", insuranceCard)],
    },
    {
      id: "SV-PHARM",
      name: "الصيدليات",
      brief: "صرف الأدوية والمنتجات الصحية.",
      opportunities: [opp("SOP-PHARM", pharmacyServiceCard)],
    },
  ],
};

// ============ التوظيف والتدريب ============
const jobRegCard: ServiceFullCard = {
  title: "التسجيل في خدمات التوظيف",
  whyNeed:
    "يفتح باب الترشح لفرص العمل المخصصة أو الشاملة لأصحاب الهمم مع دعم توجيهي.",
  whenToUse: "عند الجاهزية للعمل أو الرغبة في تجربة عملية.",
  whatToPrepare: [
    "السيرة الذاتية",
    "بطاقة أصحاب الهمم",
    "الهوية الإماراتية",
    "الشهادات الدراسية أو التدريبية",
    "بيانات تواصل حديثة",
  ],
  generalSteps: [
    "إنشاء حساب في منصة التوظيف المعتمدة",
    "تعبئة الملف الشخصي بدقة",
    "رفع السيرة والوثائق",
    "تحديد نوع الوظيفة والقطاع",
    "التقديم على الفرص المناسبة",
    "متابعة المقابلات والردود",
  ],
  whatNext: [
    "تجهيز ملف مقابلة عمل",
    "الاطلاع على برامج التدريب المرتبطة",
  ],
  externalLink: "",
  relatedServices: ["التدريب المهني", "بطاقة أصحاب الهمم"],
  needsOutside: false,
  needsTools: true,
  keywords: ["توظيف", "عمل", "تسجيل", "سيرة"],
};

const trainingCard: ServiceFullCard = {
  title: "التدريب المهني",
  whyNeed:
    "يبني مهارات عملية تزيد فرص الحصول على عمل وتعزز الاستقلالية.",
  whenToUse: "بعد إنهاء التعليم أو قبل الدخول لسوق العمل أو عند تغيير المسار المهني.",
  whatToPrepare: [
    "السيرة الذاتية",
    "بطاقة أصحاب الهمم",
    "الشهادات السابقة",
    "خطاب اهتمام قصير إن طلب",
  ],
  generalSteps: [
    "اختيار برنامج تدريبي معتمد",
    "التسجيل عبر الجهة المقدمة",
    "حضور المقابلة التمهيدية",
    "بدء البرنامج التدريبي",
    "الالتزام بالحضور والتقييم",
    "استلام شهادة الإتمام",
  ],
  whatNext: [
    "التقديم على وظيفة مرتبطة بالتدريب",
    "إضافة الشهادة إلى السيرة الذاتية",
  ],
  externalLink: "",
  relatedServices: ["التسجيل في خدمات التوظيف"],
  needsOutside: true,
  needsTools: true,
  keywords: ["تدريب", "مهارات", "تأهيل", "عمل"],
};

const jobDomain: ServiceDomainNode = {
  id: "SD-JOB",
  name: "التوظيف والتدريب",
  services: [
    {
      id: "SV-JOB",
      name: "خدمات التوظيف",
      brief: "منصات ترشح لفرص عمل شاملة أو مخصصة.",
      opportunities: [opp("SOP-JOB", jobRegCard)],
    },
    {
      id: "SV-TRAIN",
      name: "التدريب المهني",
      brief: "برامج بناء مهارات عملية.",
      opportunities: [opp("SOP-TRAIN", trainingCard)],
    },
  ],
};

// ============ دعم الأسرة ============
const familyGuideCard: ServiceFullCard = {
  title: "الإرشاد الأسري",
  whyNeed:
    "يقدم دعماً متخصصاً للأسرة في إدارة التحديات اليومية والتواصل مع الشاب من ذوي الهمم.",
  whenToUse:
    "عند مواجهة تحديات سلوكية، أو مراحل انتقالية، أو الحاجة لخطة مشاركة أسرية.",
  whatToPrepare: [
    "بيانات الأسرة الأساسية",
    "بطاقة أصحاب الهمم",
    "التقارير السابقة إن وجدت",
    "قائمة أسئلة قصيرة",
  ],
  generalSteps: [
    "التواصل مع مركز الإرشاد المعتمد",
    "حجز موعد استشارة",
    "حضور الجلسة الأولى",
    "الاتفاق على خطة متابعة",
    "تنفيذ التوصيات في المنزل",
    "متابعة الجلسات الدورية",
  ],
  whatNext: [
    "توثيق التوصيات في ملف الأسرة",
    "إشراك الشاب في القرارات المناسبة",
  ],
  externalLink: "",
  relatedServices: ["الطوارئ"],
  needsOutside: true,
  needsTools: false,
  keywords: ["إرشاد", "أسرة", "دعم", "استشارة"],
};

const familyDomain: ServiceDomainNode = {
  id: "SD-FAMILY",
  name: "دعم الأسرة",
  services: [
    {
      id: "SV-COUNSEL",
      name: "الإرشاد الأسري",
      brief: "استشارات متخصصة لدعم الأسرة.",
      opportunities: [opp("SOP-COUNSEL", familyGuideCard)],
    },
  ],
};

// ============ الطوارئ ============
const emergencyCard: ServiceFullCard = {
  title: "خدمات الطوارئ",
  whyNeed:
    "توفر استجابة سريعة لحوادث السلامة أو الحالات الصحية أو المواقف الحرجة داخل المنزل وخارجه.",
  whenToUse:
    "عند وقوع حادث صحي، حريق، فقدان الشاب في مكان عام، أو أي موقف يتطلب تدخلاً فورياً.",
  whatToPrepare: [
    "بطاقة أرقام الطوارئ في المحفظة",
    "هاتف مشحون",
    "معلومات صحية موجزة للشاب",
    "عنوان المنزل الحالي",
    "تدريب مسبق على السيناريو",
  ],
  generalSteps: [
    "التأكد من سلامة المحيط",
    "الاتصال بالرقم المناسب",
    "شرح الموقف بجملة قصيرة",
    "تحديد المكان بدقة",
    "اتباع تعليمات المشغل",
    "البقاء حتى وصول الفريق المختص",
  ],
  whatNext: [
    "توثيق الحادث في ملف الأسرة",
    "مراجعة خطة السلامة المنزلية",
    "التواصل مع الإرشاد الأسري عند الحاجة",
  ],
  externalLink: "",
  hotline: "999",
  relatedServices: ["الإرشاد الأسري", "التأمين الصحي"],
  needsOutside: false,
  needsTools: true,
  keywords: ["طوارئ", "سلامة", "استجابة", "999"],
};

const emergencyDomain: ServiceDomainNode = {
  id: "SD-EMERG",
  name: "الطوارئ",
  services: [
    {
      id: "SV-EMERG",
      name: "خدمات الطوارئ",
      brief: "استجابة سريعة للحوادث والمواقف الحرجة.",
      opportunities: [opp("SOP-EMERG", emergencyCard)],
    },
  ],
};

// ============ المجالات ============
const emptyDomain = (id: string, name: string): ServiceDomainNode => ({
  id,
  name,
  services: [],
});

const eduDomain: ServiceDomainNode = {
  id: "SD-EDU",
  name: "التعليم والتدريب",
  services: [
    {
      id: "SV-EDU-TRAIN",
      name: "التدريب المهني",
      brief: "برامج بناء مهارات عملية.",
      opportunities: [opp("SOP-EDU-TRAIN", trainingCard)],
    },
  ],
};

const jobOnlyDomain: ServiceDomainNode = {
  id: "SD-JOB",
  name: "التوظيف",
  services: [
    {
      id: "SV-JOB",
      name: "خدمات التوظيف",
      brief: "منصات ترشح لفرص عمل شاملة أو مخصصة.",
      opportunities: [opp("SOP-JOB", jobRegCard)],
    },
  ],
};

// jobDomain isn't exported directly; we split it above.
void jobDomain;

export const supportPortal: ServiceDomainNode[] = [
  idDomain,
  healthDomain,
  eduDomain,
  jobOnlyDomain,
  emptyDomain("SD-FIN", "الدعم المالي"),
  emptyDomain("SD-HOME", "الإسكان والمعيشة"),
  transportDomain,
  emptyDomain("SD-TECH", "التكنولوجيا المساندة"),
  emptyDomain("SD-COMM", "المشاركة المجتمعية"),
  emptyDomain("SD-RIGHTS", "الحماية والحقوق"),
  familyDomain,
  emergencyDomain,
];


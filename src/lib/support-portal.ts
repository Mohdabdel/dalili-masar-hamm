// بوابة الدعم والخدمات - الهيكل الهرمي
// مجال ← خدمة ← فرصة استفادة ← بطاقة خدمة

export interface ServiceFullCard {
  title: string;
  whyNeed: string;
  whenToUse: string;
  whatToPrepare: string[];
  generalSteps: string[];
  whatNext: string[];
  externalLink?: string; // قابل للتعبئة لاحقاً
  relatedServices?: string[]; // أسماء خدمات مرتبطة
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
  brief?: string; // فائدة عملية موجزة
  opportunities: ServiceOpportunity[];
}

export interface ServiceDomainNode {
  id: string;
  name: string;
  services: ServiceItem[];
}

const issueCard: ServiceFullCard = {
  title: "إصدار بطاقة أصحاب الهمم",
  whyNeed:
    "تساعد البطاقة الأسرة والشاب على إثبات الأهلية للاستفادة من عدد من الخدمات والتسهيلات المرتبطة بالدعم، والنقل، والتوظيف، وبعض الخدمات المجتمعية.",
  whenToUse:
    "عند بداية تنظيم ملف الخدمات، أو عند الحاجة للتقديم على تسهيلات أو خدمات مرتبطة بذوي الهمم.",
  whatToPrepare: [
    "الهوية الإماراتية",
    "تقرير طبي أو تشخيصي عند الحاجة",
    "بيانات التواصل",
    "صورة شخصية عند الحاجة",
    "حساب إلكتروني أو تطبيق الجهة المعنية إن وجد",
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
  relatedServices: ["الهوية الإماراتية", "التقارير الطبية"],
};

const emptyOpp = (id: string, name: string): ServiceOpportunity => ({ id, name });

const disabilityCardService: ServiceItem = {
  id: "SV-DIS-CARD",
  name: "بطاقة أصحاب الهمم",
  brief:
    "وثيقة تثبت الأهلية للاستفادة من التسهيلات في النقل والتوظيف والخدمات المجتمعية.",
  opportunities: [
    { id: "SOP-ISSUE", name: "إصدار البطاقة", card: issueCard },
    emptyOpp("SOP-RENEW", "تجديد البطاقة"),
    emptyOpp("SOP-USE", "استخدام البطاقة في الخدمات"),
    emptyOpp("SOP-UPDATE", "تحديث البيانات"),
    emptyOpp("SOP-LOST", "استخراج بدل فاقد"),
  ],
};

const emptyService = (id: string, name: string, brief?: string): ServiceItem => ({
  id,
  name,
  brief,
  opportunities: [],
});

const identityDomain: ServiceDomainNode = {
  id: "SD-ID",
  name: "الهوية والوثائق",
  services: [
    disabilityCardService,
    emptyService(
      "SV-EID",
      "الهوية الإماراتية",
      "وثيقة الهوية الرسمية اللازمة لأغلب المعاملات الحكومية والخاصة.",
    ),
    emptyService("SV-PASS", "جواز السفر", "وثيقة سفر رسمية للسفر خارج الدولة."),
    emptyService(
      "SV-RES",
      "إثبات السكن",
      "مستند مطلوب في كثير من الخدمات الحكومية والتعليمية.",
    ),
    emptyService(
      "SV-MED",
      "التقارير الطبية",
      "مستندات داعمة للتشخيص والتقييم في خدمات الصحة والدعم.",
    ),
  ],
};

const emptyDomain = (id: string, name: string): ServiceDomainNode => ({
  id,
  name,
  services: [],
});

export const supportPortal: ServiceDomainNode[] = [
  identityDomain,
  emptyDomain("SD-HEALTH", "الصحة"),
  emptyDomain("SD-EDU", "التعليم والتدريب"),
  emptyDomain("SD-JOB", "التوظيف"),
  emptyDomain("SD-FIN", "الدعم المالي"),
  emptyDomain("SD-HOME", "الإسكان والمعيشة"),
  emptyDomain("SD-TRANS", "النقل"),
  emptyDomain("SD-TECH", "التكنولوجيا المساندة"),
  emptyDomain("SD-COMM", "المشاركة المجتمعية"),
  emptyDomain("SD-RIGHTS", "الحماية والحقوق"),
  emptyDomain("SD-FAMILY", "دعم الأسرة"),
  emptyDomain("SD-EMERG", "الطوارئ"),
];

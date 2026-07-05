// المحتوى المعرفي المستخرج من الوثيقة التنفيذية لمنصة دليلي (MVP)

export type PortalKind = "home" | "community" | "services";

export interface LifeDomain {
  code: string;                 // H1, C3, S2 ...
  portal: PortalKind;
  name: string;                 // اسم المجال
  generalActivities: string;    // الأنشطة العامة التابعة
}

// ============ مجالات الحياة المنزلية ============
export const homeDomains: LifeDomain[] = [
  { code: "H1", portal: "home", name: "إدارة المنزل", generalActivities: "إدارة الملابس، تنظيم الغرف، النظافة المنزلية، الصيانة البسيطة، إدارة المخزون، إدارة النفايات" },
  { code: "H2", portal: "home", name: "إدارة الغذاء", generalActivities: "التخطيط للوجبات، إعداد الوجبات، حفظ الأغذية، تنظيم الثلاجة، تنظيم المخزن، شراء الاحتياجات" },
  { code: "H3", portal: "home", name: "إدارة الصحة المنزلية", generalActivities: "الدواء، المواعيد، النوم، الراحة، النشاط البدني، متابعة المؤشرات الصحية" },
  { code: "H4", portal: "home", name: "السلامة المنزلية", generalActivities: "السلامة الكهربائية، سلامة المطبخ، إغلاق المنزل، الطوارئ المنزلية" },
  { code: "H5", portal: "home", name: "إدارة الوقت والروتين", generalActivities: "الروتين اليومي، التخطيط للأسبوع، توزيع المهام، متابعة الإنجاز" },
  { code: "H6", portal: "home", name: "المشاركة الأسرية", generalActivities: "استقبال الضيوف، المناسبات، الحوار الأسري، اتخاذ القرار، توزيع المسؤوليات" },
  { code: "H7", portal: "home", name: "الحديقة والزراعة", generalActivities: "الري، العناية بالنباتات، ترتيب الأدوات، متابعة نمو النباتات" },
  { code: "H8", portal: "home", name: "رعاية الحيوانات الأليفة", generalActivities: "التغذية، النظافة، المتابعة، السلامة" },
];

// ============ مجالات الحياة المجتمعية ============
export const communityDomains: LifeDomain[] = [
  { code: "C1", portal: "community", name: "التسوق والاستهلاك", generalActivities: "التسوق الغذائي، الملابس، الأجهزة، الاحتياجات الشخصية" },
  { code: "C2", portal: "community", name: "التنقل والمواصلات", generalActivities: "سيارة الأسرة، الأجرة، النقل العام، المشي، التطبيقات" },
  { code: "C3", portal: "community", name: "الخدمات الصحية", generalActivities: "المستشفى، العيادة، الصيدلية، المختبر" },
  { code: "C4", portal: "community", name: "الخدمات الحكومية", generalActivities: "الهوية، الجواز، مراكز الخدمة، تحديث البيانات" },
  { code: "C5", portal: "community", name: "الخدمات البنكية والمالية", generalActivities: "البنك، الصراف، التطبيقات البنكية" },
  { code: "C6", portal: "community", name: "المطاعم والمقاهي", generalActivities: "اختيار المكان، الطلب، الدفع، تناول الطعام" },
  { code: "C7", portal: "community", name: "التوظيف والعمل", generalActivities: "البحث، الملف المهني، المقابلة، مباشرة العمل" },
  { code: "C8", portal: "community", name: "التدريب والتعلم", generalActivities: "التسجيل، الحضور، المشاركة، الشهادة" },
  { code: "C9", portal: "community", name: "المشاركة الاجتماعية", generalActivities: "الزيارات، المناسبات، التطوع" },
  { code: "C10", portal: "community", name: "الترفيه وجودة الحياة", generalActivities: "الحدائق، السينما، الشاطئ، المكتبة، النادي" },
  { code: "C11", portal: "community", name: "الخدمات التجارية", generalActivities: "الحلاق، المغسلة، الخياط، صيانة الهاتف، صيانة السيارة" },
  { code: "C12", portal: "community", name: "الاتصالات والتقنية", generalActivities: "شحن الرصيد، تحديث البيانات، التطبيقات" },
  { code: "C13", portal: "community", name: "الثقافة والشعائر", generalActivities: "المسجد، المكتبة، المعارض، الفعاليات" },
  { code: "C14", portal: "community", name: "السفر والتنقل", generalActivities: "الحجز، الأمتعة، المطار، الفندق" },
  { code: "C15", portal: "community", name: "الطوارئ والسلامة", generalActivities: "طلب المساعدة، الشرطة، الإسعاف، الدفاع المدني" },
];

// ============ مجالات الدعم والخدمات ============
export const serviceDomains: LifeDomain[] = [
  { code: "S1", portal: "services", name: "الهوية والوثائق", generalActivities: "بطاقة أصحاب الهمم، الهوية الإماراتية، الجواز، إثبات السكن" },
  { code: "S2", portal: "services", name: "الصحة", generalActivities: "المواعيد، التأمين، العلاج، الصيدليات، الطوارئ" },
  { code: "S3", portal: "services", name: "التعليم والتدريب", generalActivities: "التدريب المهني، الدورات، التعليم المستمر" },
  { code: "S4", portal: "services", name: "التوظيف", generalActivities: "منصات التوظيف، التدريب أثناء العمل، التوظيف المدعوم" },
  { code: "S5", portal: "services", name: "الدعم المالي", generalActivities: "الإعانات، الخصومات، المنح، الدعم الاجتماعي" },
  { code: "S6", portal: "services", name: "الإسكان والمعيشة", generalActivities: "الإسكان، صيانة المنزل، التجهيزات المساندة" },
  { code: "S7", portal: "services", name: "النقل", generalActivities: "بطاقة المواقف، سالك، النقل العام، النقل المخصص" },
  { code: "S8", portal: "services", name: "التكنولوجيا المساندة", generalActivities: "الأجهزة، التطبيقات، وسائل التواصل البديل" },
  { code: "S9", portal: "services", name: "المشاركة المجتمعية", generalActivities: "الأندية، التطوع، الرياضة، الثقافة" },
  { code: "S10", portal: "services", name: "الحماية والحقوق", generalActivities: "الشكاوى، الحقوق القانونية، الحماية من الإساءة" },
  { code: "S11", portal: "services", name: "دعم الأسرة", generalActivities: "الإرشاد الأسري، مجموعات الدعم، التدريب" },
  { code: "S12", portal: "services", name: "الطوارئ", generalActivities: "الشرطة، الإسعاف، الدفاع المدني، الطوارئ الصحية" },
];

// ============ بطاقات المشاركة (نموذج المحتوى المعرفي) ============
export interface ParticipationCard {
  id: string;
  portal: "home" | "community";
  domain: string;             // اسم المجال
  generalActivity: string;    // النشاط العام
  lifeEvent: string;          // حدث الحياة
  opportunity: string;        // فرصة المشاركة
  guided: string;             // مشاركة موجهة
  shared: string;             // مشاركة مشتركة
  independent: string;        // مشاركة مستقلة
}

export const participationCards: ParticipationCard[] = [
  // منزلية
  { id: "PH-01", portal: "home", domain: "إدارة المنزل", generalActivity: "إدارة الملابس", lifeEvent: "غسل الملابس", opportunity: "جمع الملابس", guided: "يضع قطعة واحدة في السلة بعد تلميح مباشر", shared: "يجمع ملابسه من غرفته ويضعها في السلة", independent: "يتابع موعد الغسيل وينقل السلة إلى مكان الغسيل" },
  { id: "PH-02", portal: "home", domain: "إدارة المنزل", generalActivity: "إدارة الملابس", lifeEvent: "غسل الملابس", opportunity: "فرز الملابس", guided: "يفرز قطعتين حسب اللون بمساعدة مباشرة", shared: "يفرز ملابسه إلى أبيض وملون مع تلميح بسيط", independent: "يفرز الملابس كاملة ويجهز كل مجموعة للغسيل" },
  { id: "PH-03", portal: "home", domain: "إدارة المنزل", generalActivity: "إدارة الملابس", lifeEvent: "تجفيف الملابس", opportunity: "نشر الملابس على منشر منخفض", guided: "يعلق قطعة واحدة باستخدام مشابك مناسبة", shared: "يعلق عدة قطع", independent: "ينشر الملابس ويراعي المسافة والتهوية" },
  { id: "PH-04", portal: "home", domain: "إدارة المنزل", generalActivity: "إدارة الملابس", lifeEvent: "ترتيب الدولاب", opportunity: "ترتيب الملابس", guided: "يضع قطعة مطوية في مكان محدد", shared: "يرتب مجموعة ملابس في الرف الصحيح", independent: "ينظم ملابسه حسب الاستخدام: خروج، منزل، مناسبة" },
  { id: "PH-05", portal: "home", domain: "إدارة الغذاء", generalActivity: "تنظيم الثلاجة", lifeEvent: "مراجعة المحتويات", opportunity: "تحديد الناقص", guided: "يشير إلى عبوة ناقصة بعد توجيه", shared: "يراجع رفاً محدداً ويحدد الناقص", independent: "يراجع الثلاجة ويقترح ما يضاف لقائمة الشراء" },
  { id: "PH-06", portal: "home", domain: "إدارة الغذاء", generalActivity: "إعداد الوجبات", lifeEvent: "تجهيز وجبة خفيفة", opportunity: "تجهيز المكونات", guided: "يحضر مكوناً واحداً", shared: "يجمع مكونات قصيرة من قائمة", independent: "يجهز المكونات والأدوات ويتحقق من النظافة" },
  { id: "PH-07", portal: "home", domain: "إدارة الغذاء", generalActivity: "إعداد المائدة", lifeEvent: "تجهيز المكان", opportunity: "توزيع الأدوات", guided: "يضع طبقاً أو كوباً في مكان محدد", shared: "يجهز مكانه ومكان فرد آخر", independent: "يجهز المائدة وفق عدد الحاضرين" },
  { id: "PH-08", portal: "home", domain: "إدارة السلامة", generalActivity: "مغادرة المنزل", lifeEvent: "فحص الإغلاق", opportunity: "التأكد من الباب والإنارة", guided: "يتحقق من عنصر واحد", shared: "يراجع قائمة قصيرة", independent: "ينفذ فحص المغادرة ويبلغ الأسرة" },
  { id: "PH-09", portal: "home", domain: "إدارة الصحة", generalActivity: "موعد الدواء", lifeEvent: "تجهيز الدواء", opportunity: "مطابقة الجدول", guided: "يحضر علبة الدواء عند التذكير", shared: "يطابق الدواء مع جدول مبسط", independent: "يتابع موعد الدواء ويبلغ عند الحاجة للتجديد" },
  { id: "PH-10", portal: "home", domain: "المشاركة الأسرية", generalActivity: "اجتماع عائلي", lifeEvent: "التعبير عن الرأي", opportunity: "اختيار بديل", guided: "يختار بين خيارين", shared: "يوضح تفضيله وسبباً بسيطاً", independent: "يشارك في القرار ويتابع نتيجة الاتفاق" },
  // مجتمعية
  { id: "PC-01", portal: "community", domain: "التسوق والاستهلاك", generalActivity: "التسوق الغذائي", lifeEvent: "التخطيط للتسوق", opportunity: "إعداد القائمة", guided: "يختار 3 منتجات من صور", shared: "يضيف احتياجاته لقائمة الأسرة", independent: "يعد قائمة منظمة حسب الأقسام" },
  { id: "PC-02", portal: "community", domain: "التسوق والاستهلاك", generalActivity: "التسوق الغذائي", lifeEvent: "داخل المتجر", opportunity: "اختيار المنتج", guided: "يلتقط المنتج من الرف الصحيح", shared: "يختار المنتج بعد المقارنة السريعة", independent: "يقارن السعر والحجم والصلاحية" },
  { id: "PC-03", portal: "community", domain: "التسوق والاستهلاك", generalActivity: "التسوق الغذائي", lifeEvent: "الدفع", opportunity: "مراجعة الفاتورة", guided: "يستلم الإيصال", shared: "يراجع عدد المنتجات", independent: "يراجع الفاتورة والرصيد المتبقي" },
  { id: "PC-04", portal: "community", domain: "التنقل", generalActivity: "سيارة أجرة", lifeEvent: "طلب المركبة", opportunity: "تحديد الموقع", guided: "يشاهد الموقع على التطبيق", shared: "يؤكد الموقع على التطبيق", independent: "يطلب المركبة ويتابع وصولها" },
  { id: "PC-05", portal: "community", domain: "التنقل", generalActivity: "المشي", lifeEvent: "عبور الطريق", opportunity: "انتظار الإشارة", guided: "ينتظر بجانب الأسرة", shared: "يراقب الإشارة ويتحرك مع تلميح", independent: "يعبر وفق الإشارة بعد التأكد من السلامة" },
  { id: "PC-06", portal: "community", domain: "الصحة", generalActivity: "العيادة", lifeEvent: "تسجيل الدخول", opportunity: "أخذ رقم الانتظار", guided: "يحمل بطاقة الموعد", shared: "يقدم البطاقة للموظف بمساعدة رقم النداء", independent: "يسجل الوصول ويتابع حالة الطلب" },
  { id: "PC-07", portal: "community", domain: "الصحة", generalActivity: "الصيدلية", lifeEvent: "استلام الدواء", opportunity: "مراجعة الدواء", guided: "يستلم الكيس", shared: "يطابق الاسم مع الوصفة", independent: "يسأل عن الجرعة ويحفظ الدواء" },
  { id: "PC-08", portal: "community", domain: "الخدمات الحكومية", generalActivity: "مركز خدمة", lifeEvent: "تقديم طلب", opportunity: "تجهيز الوثائق", guided: "يحمل ملف الوثائق", shared: "يقدم الوثائق عند الطلب", independent: "يراجع المتطلبات ويتابع حالة الطلب" },
  { id: "PC-09", portal: "community", domain: "البنوك", generalActivity: "الصراف الآلي", lifeEvent: "السحب", opportunity: "استخدام البطاقة", guided: "يشاهد خطوات السحب", shared: "يدخل الرقم بمساندة آمنة", independent: "يسحب مبلغاً محدداً ويراجع الإيصال" },
  { id: "PC-10", portal: "community", domain: "المطاعم", generalActivity: "مطعم", lifeEvent: "طلب وجبة", opportunity: "اختيار الطلب", guided: "يطلب من صورتين", shared: "يطلب وجبة محددة", independent: "يقرأ القائمة ويطلب ويدفع" },
  { id: "PC-11", portal: "community", domain: "التوظيف", generalActivity: "مقابلة", lifeEvent: "تجهيز الملف", opportunity: "تنظيم المستندات", guided: "يضع الوثائق في الملف", shared: "يرتب الوثائق حسب المطلوب", independent: "يراجع الملف ويتأكد من جاهزيته" },
  { id: "PC-12", portal: "community", domain: "المشاركة الاجتماعية", generalActivity: "زيارة", lifeEvent: "تقديم التحية", opportunity: "بدء التفاعل", guided: "يحيي بإشارة أو كلمة", shared: "يتبادل التحية وسؤالاً قصيراً", independent: "يبدأ التحية ويشارك في الحديث المناسب" },
  { id: "PC-13", portal: "community", domain: "الترفيه", generalActivity: "حديقة", lifeEvent: "استخدام المرفق", opportunity: "اختيار نشاط", guided: "يختار بين نشاطين", shared: "يشارك في نشاط محدد", independent: "يخطط للزيارة ويختار النشاط المناسب" },
  { id: "PC-14", portal: "community", domain: "الطوارئ", generalActivity: "طلب مساعدة", lifeEvent: "وصف الحالة", opportunity: "التواصل", guided: "يضغط زر اتصال معد مسبقاً", shared: "يذكر اسمه ومكانه بمساعدة", independent: "يصف الحالة والموقع بوضوح" },
];

// ============ بطاقات الدعم والخدمات ============
export interface ServiceCard {
  id: string;
  domain: string;
  service: string;
  opportunity: string;
  whenToUse: string;
  whatToPrepare: string;
  whatNext: string;
}

export const serviceCards: ServiceCard[] = [
  { id: "SC-01", domain: "الهوية والوثائق", service: "بطاقة أصحاب الهمم", opportunity: "إصدار البطاقة", whenToUse: "عند الحاجة لإثبات الأهلية للخدمات", whatToPrepare: "الهوية، التقارير، بيانات التواصل", whatNext: "استخدام البطاقة في خدمات النقل والتوظيف والدعم" },
  { id: "SC-02", domain: "الهوية والوثائق", service: "بطاقة أصحاب الهمم", opportunity: "تجديد البطاقة", whenToUse: "قبل انتهاء الصلاحية", whatToPrepare: "البطاقة السابقة، الهوية، التقرير عند الحاجة", whatNext: "تحديث البيانات في الجهات المرتبطة" },
  { id: "SC-03", domain: "النقل", service: "بطاقة مواقف أصحاب الهمم", opportunity: "طلب تصريح مواقف", whenToUse: "عند الحاجة لتسهيل الوصول للمرافق", whatToPrepare: "بطاقة أصحاب الهمم، بيانات المركبة", whatNext: "استخدام التصريح أثناء المراجعات والزيارات" },
  { id: "SC-04", domain: "النقل", service: "سالك", opportunity: "طلب إعفاء أو خدمة مرتبطة", whenToUse: "عند استخدام الطرق برسوم", whatToPrepare: "بيانات المركبة، الهوية، بطاقة أصحاب الهمم", whatNext: "ربط الخدمة بمشاوير المستشفى والعمل" },
  { id: "SC-05", domain: "الصحة", service: "التأمين الصحي", opportunity: "مراجعة التغطية", whenToUse: "قبل الموعد الطبي أو العلاج", whatToPrepare: "بطاقة التأمين، الهوية، الموعد", whatNext: "التأكد من الصيدلية أو العيادة المعتمدة" },
  { id: "SC-06", domain: "الصحة", service: "الصيدليات", opportunity: "استلام الدواء", whenToUse: "بعد الوصفة الطبية", whatToPrepare: "الوصفة، الهوية، التأمين", whatNext: "حفظ الدواء ومتابعة الجرعات" },
  { id: "SC-07", domain: "التوظيف", service: "منصة توظيف", opportunity: "التسجيل للبحث عن عمل", whenToUse: "عند الاستعداد للعمل", whatToPrepare: "السيرة الذاتية، الهوية، الشهادات", whatNext: "تجهيز مقابلة أو تدريب قصير" },
  { id: "SC-08", domain: "التدريب", service: "تدريب مهني", opportunity: "التسجيل في دورة", whenToUse: "عند الحاجة لاكتساب مهارة عملية", whatToPrepare: "الهوية، بيانات التواصل، مستوى الدعم", whatNext: "ربط التدريب بفرص العمل أو التطوع" },
  { id: "SC-09", domain: "الأسرة", service: "إرشاد أسري", opportunity: "طلب استشارة", whenToUse: "عند وجود تحديات", whatToPrepare: "وصف مختصر", whatNext: "تطبيق توصيات عملية" },
  { id: "SC-10", domain: "الطوارئ", service: "الإسعاف", opportunity: "طلب مساعدة صحية عاجلة", whenToUse: "عند وجود خطر صحي مباشر", whatToPrepare: "الموقع، وصف الحالة، بيانات الشخص", whatNext: "متابعة التقرير الطبي وخطة السلامة" },
  { id: "SC-11", domain: "الحماية والحقوق", service: "الشكاوى", opportunity: "تقديم بلاغ أو شكوى", whenToUse: "عند وجود حرمان من خدمة أو إساءة", whatToPrepare: "تفاصيل الواقعة، مستندات داعمة", whatNext: "متابعة رقم البلاغ والرد الرسمي" },
];

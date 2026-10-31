// نماذج مجتمعية تجريبية — corpus تجريبي مستقل ومعلن المصدر: community-pilot-corpus.
// العينة: 8 أحداث مجتمعية × مشاركتين فقط (16 مشاركة)، مُعاد صياغتها وفق عقد دليلي الحالي:
// حدث حقيقي، دور وظيفي، نتيجة قابلة للملاحظة، نهاية طبيعية، وخطوات تنفيذ.
// لا تُعرض حقول المستويات (simple/moderate/advanced) ولا environment كتصنيف واجهة.
// الصياغات تصف دورًا فعليًا في الحدث — لا تقييم قدرة ولا تدريبًا على الاستقلال.
// هذا المصدر قراءة فقط: لا يغيّر سجل المعرفة ولا النماذج الثمانية المعتمدة ولا بطاقات الأسر.

import type { LabMajorStep, LabParticipationSpec } from "@/lab/slice/types";

export const COMMUNITY_PILOT_CORPUS = "community-pilot-corpus" as const;

export interface PilotParticipation {
  /** معرّف إنتاجي تجريبي غير متعارض مع معرفات المكتبة. */
  id: string;
  eventId: string;
  title: string;
  /** الدور الوظيفي داخل الحدث. */
  role: string;
  /** النتيجة القابلة للملاحظة. */
  outcome: string;
  /** النهاية الطبيعية للمشاركة. */
  naturalEnding: string;
  /** خطوات التنفيذ بصياغة أسرية. */
  steps: string[];
  /** دعم مقترح اختياري. */
  support: string;
  /** المعرفات المصدرية محفوظة كما وردت في العينة. */
  provenance: {
    corpus: typeof COMMUNITY_PILOT_CORPUS;
    sourceEventId: string;
    sourceParticipationId: string;
  };
}

export interface PilotEvent {
  id: string;
  title: string;
  description: string;
  participations: PilotParticipation[];
}

function pilot(
  sourceEventId: string,
  sourceId: string,
  eventId: string,
  data: Omit<PilotParticipation, "id" | "eventId" | "provenance">,
): PilotParticipation {
  return {
    id: `PILOT-${sourceId}`,
    eventId,
    ...data,
    provenance: {
      corpus: COMMUNITY_PILOT_CORPUS,
      sourceEventId,
      sourceParticipationId: sourceId,
    },
  };
}

const E_COMM_002 = "PILOT-EV-COMM-002";
const E_COMM_007 = "PILOT-EV-COMM-007";
const E_COMM_009 = "PILOT-EV-COMM-009";
const E_COMM_012 = "PILOT-EV-COMM-012";
const E_COMM_035 = "PILOT-EV-COMM-035";
const E_COMM_042 = "PILOT-EV-COMM-042";
const E_COMM_044 = "PILOT-EV-COMM-044";
const E_COMM_078 = "PILOT-EV-COMM-078";

export const COMMUNITY_PILOT_EVENTS: PilotEvent[] = [
  {
    id: E_COMM_002,
    title: "زيارة الحديقة العامة",
    description: "قضاء وقت في الحديقة العامة للمشي أو الراحة مع الأسرة.",
    participations: [
      pilot("COMM-002", "COMM-002-OP001", E_COMM_002, {
        title: "تجهيز حقيبة النزهة",
        role: "يجهّز حقيبة النزهة مع الأسرة قبل الخروج.",
        outcome: "الحقيبة جاهزة وفيها كل الأغراض المتفق عليها.",
        naturalEnding: "تُغلق الحقيبة وتوضع عند الباب استعدادًا للخروج.",
        steps: [
          "نحدد معًا الأغراض التي نحتاجها للنزهة.",
          "يحضر كل غرض ويضعه في الحقيبة أو السلة المخصصة.",
          "نراجع الأغراض معًا قبل الإغلاق.",
          "يغلق الحقيبة ويضعها عند الباب.",
        ],
        support: "قائمة صور قصيرة للأغراض المعتادة، وسلة أو حقيبة ثابتة للنزهة.",
      }),
      pilot("COMM-002", "COMM-002-OP002", E_COMM_002, {
        title: "اختيار مكان الجلوس في الحديقة",
        role: "يختار مكان جلوس الأسرة في الحديقة.",
        outcome: "الأسرة تجلس في المكان الذي اختاره.",
        naturalEnding: "تستقر الأسرة في المكان المختار وتبدأ وقتها.",
        steps: [
          "نتجول معًا وننظر إلى الأماكن المتاحة.",
          "يشير إلى المكان الذي يفضّله.",
          "نتجه إلى المكان ونجلس فيه.",
        ],
        support: "تقليل الخيارات إلى مكانين، أو صورتان لمكانين مقترحين.",
      }),
    ],
  },
  {
    id: E_COMM_007,
    title: "تناول وجبة في مطعم",
    description: "تناول الطعام داخل مطعم أو محل وجبات جاهزة مع الأسرة.",
    participations: [
      pilot("COMM-007", "COMM-007-OP001", E_COMM_007, {
        title: "اختيار طاولة الأسرة",
        role: "يشارك في اختيار الطاولة التي ستجلس عليها الأسرة.",
        outcome: "الأسرة تجلس على طاولة اختارها أو وافق عليها.",
        naturalEnding: "تجلس الأسرة على الطاولة ويبدأ الطلب.",
        steps: [
          "ندخل معًا وننظر إلى الطاولات المتاحة.",
          "يشير إلى الطاولة التي يفضّلها.",
          "نتجه إلى الطاولة ونجلس.",
        ],
        support: "تقليل الخيارات إلى طاولتين، أو عبارة جاهزة لطلب طاولة من الموظف.",
      }),
      pilot("COMM-007", "COMM-007-OP002", E_COMM_007, {
        title: "اختيار وجبته من القائمة",
        role: "يختار وجبته بنفسه من قائمة المطعم.",
        outcome: "الوجبة التي اختارها تصل إلى الطاولة.",
        naturalEnding: "تصل الوجبة المختارة ويبدأ الأكل.",
        steps: [
          "نتصفح القائمة معًا وننظر إلى الخيارات أو الصور.",
          "يشير إلى الوجبة التي يريدها.",
          "نخبر الموظف بالطلب.",
          "تصل الوجبة إلى الطاولة.",
        ],
        support: "قائمة مصوّرة، أو تقليل الخيارات إلى وجبتين مألوفتين.",
      }),
    ],
  },
  {
    id: E_COMM_009,
    title: "زيارة المكتبة العامة",
    description: "الدخول إلى المكتبة العامة لتصفح الكتب أو الاستفادة من مرافقها.",
    participations: [
      pilot("COMM-009", "COMM-009-OP001", E_COMM_009, {
        title: "تقديم بطاقة العضوية",
        role: "يقدّم بطاقة عضويته عند مكتب الاستعلامات.",
        outcome: "الموظف يسجّل البطاقة ويستقبل الطلب.",
        naturalEnding: "يستلم البطاقة بعد التسجيل ونكمل الزيارة.",
        steps: [
          "نتجه معًا إلى مكتب الاستعلامات.",
          "يخرج البطاقة من مكانها المعتاد.",
          "يقدّمها للموظف عند الطلب.",
          "يستلمها بعد التسجيل ويعيدها إلى مكانها.",
        ],
        support: "مكان ثابت لحفظ البطاقة يسهل الوصول إليه.",
      }),
      pilot("COMM-009", "COMM-009-OP002", E_COMM_009, {
        title: "الوصول إلى قسم الكتب المطلوب",
        role: "يقود الوصول إلى قسم الكتب الذي يريد تصفحه.",
        outcome: "نصل إلى القسم المطلوب ويبدأ التصفح.",
        naturalEnding: "يصل إلى القسم ويبدأ تصفح الكتب.",
        steps: [
          "نحدد معًا نوع الكتب أو القسم المطلوب.",
          "نمشي بين الأقسام أو نسأل الموظف عن مكان القسم.",
          "نصل إلى القسم ويبدأ التصفح.",
        ],
        support: "خريطة بسيطة للمكتبة إن توفرت، أو مرافقة قريبة في أول زيارة.",
      }),
    ],
  },
  {
    id: E_COMM_012,
    title: "حضور فعالية ثقافية",
    description: "حضور محاضرة أو حفل أو نشاط ثقافي في مكان عام.",
    participations: [
      pilot("COMM-012", "COMM-012-OP001", E_COMM_012, {
        title: "تقديم تذكرة الدخول",
        role: "يقدّم تذكرة الحضور للموظف عند المدخل.",
        outcome: "الموظف يفحص التذكرة وندخل إلى القاعة.",
        naturalEnding: "ندخل بعد فحص التذكرة ونستلمها من جديد.",
        steps: [
          "تكون التذكرة في جيبه أو مكانها المعتاد.",
          "يخرج التذكرة عند الوصول إلى المدخل.",
          "يقدّمها للموظف.",
          "يستلمها وندخل إلى القاعة.",
        ],
        support: "جيب أو حقيبة ثابتة لحفظ التذكرة قبل الوصول.",
      }),
      pilot("COMM-012", "COMM-012-OP002", E_COMM_012, {
        title: "الوصول إلى مقعده",
        role: "يصل إلى مقعده المخصص ويجلس فيه.",
        outcome: "جالس في مقعده قبل بدء الفعالية.",
        naturalEnding: "يجلس في مقعده وتبدأ الفعالية.",
        steps: [
          "نقرأ رقم المقعد المكتوب على التذكرة.",
          "نمشي معًا نحو الصف والمقعد.",
          "يجلس في مقعده.",
        ],
        support: "رقم المقعد مكتوبًا على التذكرة كمرجع، أو مرافقة حتى المقعد في أول مرة.",
      }),
    ],
  },
  {
    id: E_COMM_035,
    title: "المشاركة في عمل تطوعي مجتمعي",
    description: "المساعدة في نشاط تطوعي في جمعية أو مؤسسة خيرية.",
    participations: [
      pilot("COMM-035", "COMM-035-OP001", E_COMM_035, {
        title: "الوصول إلى مقر النشاط التطوعي",
        role: "يصل إلى مقر النشاط التطوعي في موعده.",
        outcome: "داخل المقر ومسجّل حضوره لدى المسؤول.",
        naturalEnding: "يدخل المقر ويحيي المسؤول ويبدأ النشاط.",
        steps: [
          "نعرف موعد النشاط ومكانه مسبقًا.",
          "نسير معًا نحو المقر.",
          "ندخل ونحيي المسؤول عن النشاط.",
        ],
        support: "مرافقة قريبة في أول زيارة لمعرفة الطريق والمكان.",
      }),
      pilot("COMM-035", "COMM-035-OP002", E_COMM_035, {
        title: "استلام مهمته من مسؤول التطوع",
        role: "يستلم مهمته مباشرة من مسؤول التطوع.",
        outcome: "يعرف مهمته ويبدأ تنفيذها.",
        naturalEnding: "يبدأ تنفيذ المهمة التي استلمها.",
        steps: [
          "نتجه إلى مسؤول التطوع.",
          "يستمع إلى توضيح المهمة.",
          "يسأل إن احتاج توضيحًا إضافيًا.",
          "يبدأ تنفيذ المهمة.",
        ],
        support: "الاتفاق المسبق على مهمة مناسبة، وتوضيح مصوّر أو مكتوب بسيط من المسؤول.",
      }),
    ],
  },
  {
    id: E_COMM_042,
    title: "زيارة الصيدلية",
    description: "الذهاب إلى الصيدلية لشراء دواء أو استشارة الصيدلي.",
    participations: [
      pilot("COMM-042", "COMM-042-OP001", E_COMM_042, {
        title: "الوصول إلى الصيدلية",
        role: "يصل إلى الصيدلية لإنجاز مهمة تخص الأسرة.",
        outcome: "داخل الصيدلية وجاهز لتقديم الطلب.",
        naturalEnding: "يدخل الصيدلية ويتجه إلى الصيدلي.",
        steps: [
          "نحدد الغرض من الزيارة مسبقًا.",
          "نسير معًا نحو الصيدلية.",
          "ندخل ونتجه إلى الصيدلي.",
        ],
        support: "مرافقة قريبة في أول زيارة لمعرفة الطريق والمكان.",
      }),
      pilot("COMM-042", "COMM-042-OP002", E_COMM_042, {
        title: "تقديم طلب الدواء للصيدلي",
        role: "يقدّم طلب الدواء إلى الصيدلي بنفسه.",
        outcome: "الصيدلي يجهّز الطلب ونستلمه.",
        naturalEnding: "نستلم الدواء ونغادر الصيدلية.",
        steps: [
          "نتجه إلى الصيدلي.",
          "يذكر الطلب أو يقدّم البطاقة المكتوبة.",
          "يستلم الدواء من الصيدلي.",
        ],
        support: "بطاقة مكتوبة بالطلب تُقدَّم للصيدلي بدل الكلام إن رغب.",
      }),
    ],
  },
  {
    id: E_COMM_044,
    title: "الانتظار في طابور خدمة عامة",
    description: "الوقوف في صف انتظار لدى جهة خدمية أو مطعم أو مركز تجاري.",
    participations: [
      pilot("COMM-044", "COMM-044-OP001", E_COMM_044, {
        title: "أخذ مكانه في الطابور",
        role: "يأخذ مكانه في نهاية الطابور مثل بقية المنتظرين.",
        outcome: "واقف في مكانه الصحيح في الصف.",
        naturalEnding: "يقف في مكانه ويبدأ الانتظار مع الصف.",
        steps: [
          "ننظر إلى الطابور ونحدد نهايته.",
          "يقف خلف آخر شخص في الصف.",
          "يثبت في مكانه وينتظر دوره.",
        ],
        support: "الوقوف بجانب فرد من الأسرة كمرجع لموقع الوقوف.",
      }),
      pilot("COMM-044", "COMM-044-OP002", E_COMM_044, {
        title: "إتمام الانتظار حتى يصل دوره",
        role: "يحافظ على دوره في الطابور حتى يصل.",
        outcome: "يصل إلى مقدمة الطابور ويُنجَز طلبه.",
        naturalEnding: "يصل إلى الموظف ويُنجز الطلب ويغادر الصف.",
        steps: [
          "يقف في مكانه في الصف.",
          "يتقدم مع تحرك الصف خطوة خطوة.",
          "يصل إلى الموظف ويُنجز الطلب.",
        ],
        support: "نشاط هادئ بسيط لوقت الانتظار، ومعرفة المدة التقريبية مسبقًا.",
      }),
    ],
  },
  {
    id: E_COMM_078,
    title: "استخدام خدمة نقل عام",
    description: "ركوب حافلة أو مترو أو مركبة نقل عام للتنقل في المدينة.",
    participations: [
      pilot("COMM-078", "COMM-078-OP001", E_COMM_078, {
        title: "الانتظار في الموقف",
        role: "ينتظر وسيلة النقل في المكان المخصص للانتظار.",
        outcome: "واقف في الموقف عند وصول المركبة.",
        naturalEnding: "تصل المركبة ويتجهز للصعود.",
        steps: [
          "نعرف موعد الوصول ومكان الموقف مسبقًا.",
          "نقف في مكان الانتظار المخصص.",
          "نترقب وصول المركبة.",
        ],
        support: "مرافقة قريبة في أول تجربة لمعرفة مكان الموقف وطريقة الانتظار.",
      }),
      pilot("COMM-078", "COMM-078-OP002", E_COMM_078, {
        title: "الصعود إلى المركبة",
        role: "يصعد إلى المركبة ويصل إلى مكانه داخلها.",
        outcome: "جالس أو واقف في مكانه داخل المركبة وهي تتحرك.",
        naturalEnding: "يستقر في مكانه وتبدأ الرحلة.",
        steps: [
          "تتوقف المركبة ونقترب من الباب.",
          "يصعد إلى المركبة.",
          "يتجه إلى مكان الجلوس أو الوقوف المتفق عليه.",
        ],
        support: "مرافقة قريبة في أول تجربة صعود.",
      }),
    ],
  },
];

export function pilotEventById(eventId: string): PilotEvent | null {
  return COMMUNITY_PILOT_EVENTS.find((event) => event.id === eventId) ?? null;
}

export function pilotParticipationById(specId: string): PilotParticipation | null {
  for (const event of COMMUNITY_PILOT_EVENTS) {
    const found = event.participations.find((p) => p.id === specId);
    if (found) return found;
  }
  return null;
}

function shortText(text: string): string {
  const words = text.replace(/[.،]/g, "").trim().split(/\s+/);
  return words.slice(0, 3).join(" ");
}

/** تحويل مشاركة تجريبية إلى مواصفة عرض بعقد دليلي الحالي — بلا مستويات في الواجهة. */
function specFromPilot(p: PilotParticipation, eventTitle: string): LabParticipationSpec {
  const majorSteps: LabMajorStep[] = p.steps.map((text, i) => ({
    id: `${p.id}-S${i + 1}`,
    order: i + 1,
    instruction_family_ar: text,
    instruction_short_ar: shortText(text),
    visual_asset: null,
    substeps: [],
  }));
  return {
    id: p.id,
    eventId: p.eventId,
    eventTitle_ar: eventTitle,
    // قيمة داخلية فقط لتلبية النوع؛ لا تُعرض في واجهة الأسرة ولا تُستخدم للتصنيف.
    level: "moderate",
    context: "community",
    title_ar: p.title,
    majorSteps,
    provenance: "community_pilot",
  };
}

export function pilotSpecsForEvent(eventId: string): LabParticipationSpec[] {
  const event = pilotEventById(eventId);
  if (!event) return [];
  return event.participations.map((p) => specFromPilot(p, event.title));
}

export function pilotSpecById(specId: string): LabParticipationSpec | null {
  const p = pilotParticipationById(specId);
  if (!p) return null;
  const event = pilotEventById(p.eventId);
  return specFromPilot(p, event?.title ?? "");
}

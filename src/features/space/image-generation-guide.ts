import type { LabThisTimeSelection } from "@/lab/slice/types";

/** نص يُنسخ يدوياً؛ لا يرسله دليلي لأي خدمة خارجية. */
export function buildStepImagePrompt(description: string): string {
  return `أنشئ صورة داعمة لفهم خطوة واحدة من مشاركة يومية.

الفعل المطلوب:
${description.trim() || "[اكتبوا الفعل الذي تريدون توضيحه هنا]"}

المواصفات الثابتة:
- مشهد واحد يوضح الفعل المذكور فقط، دون إضافة إجراءات أخرى.
- رسم توضيحي واقعي مبسط، محترم وغير طفولي، مناسب لعمر الشخص المقصود.
- لا تفترض أن الشخص طفل أو تضف ملامح إعاقة أو أدوات مساندة لم تُذكر.
- إظهار اليد والأداة وموضع الفعل بوضوح؛ لا يلزم إظهار الوجه.
- خلفية بسيطة غير مزدحمة، وألوان واضحة وتباين جيد.
- دون كتابة أو تعليق نصي أو أرقام أو شعارات؛ ستضيف الأسرة العبارة في دليلي.
- دون لوحات متعددة المشاهد أو تقسيمات أو أسهم.
- تكوين مربع، مع إبقاء العناصر المهمة داخل الحدود.

بعد التوليد: راجعوا صحة الفعل ووضوح الصورة، واحفظوها بصيغة PNG أو JPG ثم ارفعوها في دليلي.`;
}

export const EXTERNAL_IMAGE_TOOLS = [
  { name: "Adobe Firefly", href: "https://firefly.adobe.com/" },
  { name: "Bing Image Creator", href: "https://www.bing.com/images/create" },
] as const;

/** تغيير واحد يحفظ النص والصورة السابقة، ويخفي الصورة من العرض النهائي. */
export function textOnlySelection(selection: LabThisTimeSelection, stepId: string): LabThisTimeSelection {
  return {
    ...selection,
    imageVisibleByStepId: { ...selection.imageVisibleByStepId, [stepId]: false },
    textVisibleByStepId: { ...selection.textVisibleByStepId, [stepId]: true },
    presentationByStepId: { ...selection.presentationByStepId, [stepId]: "text" },
    visualByStepId: { ...selection.visualByStepId, [stepId]: "" },
  };
}

import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/participation-guide")({
  head: () => ({
    meta: [
      { title: "دليل المشاركة | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "الشرح الكامل لفلسفة دليل المشاركة الحياتية: معنى فرصة المشاركة، كيفية استخدام الدليل، والاستفادة من الدعم أثناء التطبيق.",
      },
      { property: "og:title", content: "دليل المشاركة | دليلي - مسار همم" },
      {
        property: "og:description",
        content:
          "فلسفة المشاركة الحياتية وكيفية تحويل أحداث اليوم إلى فرص مشاركة عملية داخل الأسرة.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ParticipationGuidePage,
});

type Section = { title: string; body: string; points?: string[] };

const SECTIONS: Section[] = [
  {
    title: "الفلسفة: نستثمر ما يحدث بالفعل",
    body: "ينطلق دليل المشاركة الحياتية من قناعة بسيطة: يوم الأسرة ممتلئ أصلاً بالأحداث، والطفل أو الشاب حاضر في هذه الأحداث سواء شارك فيها أو لا. لذلك لا نطلب من الأسرة وقتاً إضافياً ولا جلسات تدريب منفصلة، بل نعيد النظر في الحدث القائم ونحوّله إلى فرصة مشاركة لها معنى.",
    points: [
      "لا أنشطة جديدة تُضاف إلى جدول الأسرة.",
      "لا فصل بين «وقت التدريب» و«وقت الحياة».",
      "المشاركة تحدث في مكانها الطبيعي وزمنها الطبيعي.",
    ],
  },
  {
    title: "ما معنى «فرصة مشاركة»؟",
    body: "فرصة المشاركة هي جزء محدد وواقعي من حدث يومي يمكن للشخص أن يؤديه أو يشارك فيه بدرجة ما. هي ليست مهارة مجردة، بل دور واضح داخل حدث حقيقي: جمع الملابس قبل الغسيل، اختيار الوجبة من القائمة، ترتيب خزانة المؤن، الوصول إلى موعد رسمي.",
    points: [
      "مرتبطة بحدث حقيقي في المنزل أو المجتمع.",
      "قابلة للتنفيذ اليوم، لا بعد إعداد طويل.",
      "متدرجة: من المشاركة بالحضور إلى المشاركة بالاستقلال.",
    ],
  },
  {
    title: "كيف تستخدم الدليل؟",
    body: "ابدأ من نقطة البداية الأقرب لواقعكم اليوم، ثم افتح بطاقة الفرصة واقرأها كاملة قبل التنفيذ. البطاقة مبنية بترتيب ثابت حتى تعرف دائماً أين تجد ما تحتاجه.",
    points: [
      "«أحداث يومي»: ابدأ من أحداث يومكم الحالي.",
      "«حسب أحداث اليوم»: استعرض الأحداث المتاحة واختر ما يناسبكم الآن.",
      "«حسب المجالات»: تصفح الفرص حسب مجالات الحياة.",
      "افتح بطاقة الفرصة، واقرأ «قبل أن تبدأ» ثم «الخطوات».",
      "اختر المستوى الذي يناسب الشخص، ولا تبدأ من الأصعب.",
    ],
  },
  {
    title: "الدعم أثناء التطبيق",
    body: "لا نترك الأسرة وحدها لحظة التنفيذ. داخل كل بطاقة مساحة «مصادر الدعم أثناء التطبيق» توفر ما يعين على الأداء في نفس اللحظة، دون الحاجة للخروج من الحدث.",
    points: [
      "معينات بصرية وصور تنفيذ تُعرض خطوة بخطوة.",
      "نسخة مبسطة للمتعلم بخط كبير وتباين عالٍ.",
      "تنبيهات السلامة والدعم البشري عند الحاجة.",
      "روابط داعمة ومصادر إضافية عند توفرها.",
    ],
  },
  {
    title: "كيف نعرف أننا تقدّمنا؟",
    body: "التقدم في المشاركة الحياتية لا يُقاس بعدد الجلسات، بل بتغيّر دور الشخص داخل الحدث نفسه: من مراقب، إلى مشارك بمساعدة، إلى منفّذ بإشراف، إلى مستقل. كل بطاقة تحدد مؤشرات واضحة تساعدكم على ملاحظة هذا التحول.",
  },
];

function ParticipationGuidePage() {
  return (
    <PageShell
      title="دليل المشاركة"
      subtitle="الفلسفة، طريقة الاستخدام، ومعنى فرصة المشاركة"
      breadcrumbs={[
        { label: "دليل المشاركة الحياتية", to: "/activities" },
        { label: "دليل المشاركة" },
      ]}
    >
      <div className="space-y-4">
        {SECTIONS.map((section, index) => (
          <section
            key={section.title}
            className="rounded-2xl border border-border/70 bg-card p-5 text-right shadow-card-soft"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-gold text-sm font-bold text-primary">
                {index + 1}
              </span>
              <h2 className="mt-0.5 text-lg font-bold leading-snug text-foreground">
                {section.title}
              </h2>
            </div>
            <p className="mt-3 text-[0.95rem] leading-relaxed text-muted-foreground">
              {section.body}
            </p>
            {section.points && (
              <ul className="mt-3 space-y-2">
                {section.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-[0.95rem] leading-relaxed text-foreground/90"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </PageShell>
  );
}

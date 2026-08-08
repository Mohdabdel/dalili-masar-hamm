import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CONSIDERATION_GROUPS,
  STOP_SIGNALS,
} from "@/lib/participation-considerations";

export const Route = createFileRoute("/participation-guide")({
  head: () => ({
    meta: [
      { title: "دليل الاستخدام واعتبارات المشاركة | دليلي" },
      {
        name: "description",
        content:
          "دليل استخدام دليلي للمشاركة الحياتية: الفلسفة، معنى فرصة المشاركة، مستويات المشاركة، والدعم أثناء التطبيق، مع اعتبارات عملية للأسرة.",
      },
      {
        property: "og:title",
        content: "دليل الاستخدام واعتبارات المشاركة | دليلي",
      },
      {
        property: "og:description",
        content:
          "كيف تستخدم دليلي للمشاركة الحياتية، واعتبارات عملية للأسرة: المشارك، الداعم، الفرصة، والبيئة.",
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
    body: "ينطلق دليلي للمشاركة الحياتية من قناعة بسيطة: يوم الأسرة ممتلئ أصلاً بالأحداث، والطفل أو الشاب حاضر في هذه الأحداث سواء شارك فيها أو لا. لذلك لا نطلب من الأسرة وقتاً إضافياً ولا جلسات تدريب منفصلة، بل نعيد النظر في الحدث القائم ونحوّله إلى فرصة مشاركة لها معنى.",
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
    title: "مستويات المشاركة",
    body: "تُصنَّف فرص المشاركة إلى ثلاثة مستويات: بسيط، متوسط، متقدم. المستوى يصف حجم وتعقيد فرصة المشاركة نفسها (حجم الدور، ترابط الخطوات وتنظيمها، ومقدار الاختيار والتكيف)، وليس قدرة الشخص. اختاروا المستوى الذي يناسب الحدث ووقت الأسرة اليوم.",
    points: [
      "مستوى مشاركة بسيط: دور واحد محدود وواضح، بخطوات قليلة مباشرة وبداية ونهاية واضحتان.",
      "مستوى مشاركة متوسط: جزء وظيفي متكامل من الحدث، بعدة إجراءات مترابطة أو بعض الاختيارات.",
      "مستوى مشاركة متقدم: دور ممتد أو مسؤولية عن مرحلة كبيرة، يتضمن تنظيماً أو قرارات ومتابعة أو تنسيق عدة عناصر.",
      "داخل كل بطاقة تبقى درجات الدعم: مشاركة موجهة، مشاركة مستقلة جزئياً، مشاركة مستقلة.",
    ],
  },

  {
    title: "كيف نعرف أننا تقدّمنا؟",
    body: "التقدم في المشاركة الحياتية لا يُقاس بعدد الجلسات، بل بتغيّر دور الشخص داخل الحدث نفسه: من مراقب، إلى مشارك بمساعدة، إلى منفّذ بإشراف، إلى مستقل. كل بطاقة تحدد مؤشرات واضحة تساعدكم على ملاحظة هذا التحول.",
  },
];

function GuideTab() {
  return (
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
  );
}

function ConsiderationsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary p-4 text-right">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
        <p className="text-sm leading-relaxed text-foreground/90">
          هذه الاعتبارات إرشادات دعم عامة وليست تشخيصاً أو خطة علاجية، وتُعدّل
          بحسب الشخص والسياق.
        </p>
      </div>

      {CONSIDERATION_GROUPS.map((group) => (
        <section
          key={group.id}
          className="rounded-2xl border border-border/70 bg-card p-4 text-right shadow-card-soft"
        >
          <h2 className="text-base font-bold text-foreground">{group.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {group.intro}
          </p>
          <Accordion type="single" collapsible dir="rtl" className="mt-2">
            {group.items.map((item) => (
              <AccordionItem key={item.id} value={`${group.id}-${item.id}`}>
                <AccordionTrigger className="text-right text-[0.95rem] font-bold text-foreground">
                  {item.title}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pb-1">
                    <div>
                      <h3 className="text-xs font-bold tracking-wide text-gold">
                        ما الذي قد تلاحظه؟
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.notice}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold tracking-wide text-gold">
                        اعتبارات قبل وأثناء المشاركة
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {item.considerations}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold tracking-wide text-gold">
                        إجراءات عملية
                      </h3>
                      <ul className="mt-1 space-y-1.5">
                        {item.actions.map((action) => (
                          <li
                            key={action}
                            className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}

      <section className="rounded-2xl border-2 border-destructive/40 bg-card p-5 text-right shadow-card-soft">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-6 w-6 shrink-0 text-destructive" />
          <div>
            <h2 className="text-base font-bold text-foreground">
              متى نوقف المشاركة أو نعدّلها فوراً؟
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              السلامة والكرامة أولاً. المشاركة دعوة وليست إجباراً، وإيقافها في
              الوقت المناسب قرار صحيح لا تراجع.
            </p>
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {STOP_SIGNALS.map((signal) => (
            <li
              key={signal}
              className="flex items-start gap-2 text-sm leading-relaxed text-foreground/90"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <span>{signal}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ParticipationGuidePage() {
  return (
    <PageShell
      title="دليل الاستخدام"
      subtitle="طريقة الاستخدام واعتبارات المشاركة"
      breadcrumbs={[
        { label: "دليلي للمشاركة الحياتية", to: "/activities" },
        { label: "دليل الاستخدام" },
      ]}
    >
      <Tabs defaultValue="guide" dir="rtl" className="w-full">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="guide" className="text-sm font-bold">
            دليل الاستخدام
          </TabsTrigger>
          <TabsTrigger value="considerations" className="text-sm font-bold">
            اعتبارات المشاركة
          </TabsTrigger>
        </TabsList>
        <TabsContent value="guide">
          <GuideTab />
        </TabsContent>
        <TabsContent value="considerations">
          <ConsiderationsTab />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}


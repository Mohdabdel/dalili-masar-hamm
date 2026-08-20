import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, Info, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "دليلي للمشاركة الحياتية | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "خطوات بسيطة مستمرة تحقق مشاركة مستدامة: تعرّف على دليلي للمشاركة الحياتية ودليل الاستخدام واعتبارات الاستخدام، ثم ابدأ الآن.",
      },
      {
        property: "og:title",
        content: "دليلي للمشاركة الحياتية | دليلي - مسار همم",
      },
      {
        property: "og:description",
        content:
          "حوّل أحداث الحياة اليومية إلى فرص مشاركة حقيقية بخطوات بسيطة مستمرة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ActivitiesHubPage,
});

function AboutTab() {
  return (
    <div className="space-y-4 text-start">
      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-card-soft">
        <h2 className="text-base font-bold text-foreground">
          ما هو دليلي للمشاركة الحياتية؟
        </h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          دليل يساعد الأسرة على استثمار أحداث الحياة اليومية وتحويلها إلى فرص
          مشاركة عملية وهادفة، دون إضافة مهام جديدة إلى اليوم أو جلسات منفصلة.
        </p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-card-soft">
        <h2 className="text-base font-bold text-foreground">
          لماذا تستخدم دليلي للمشاركة الحياتية؟
        </h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
          الهدف الأساسي من هذا الدليل هو خلق مساحة حقيقية للشاب أو
          الشابة من ذوي الإعاقة داخل أحداث الحياة اليومية للأسرة. فاستمرار
          المشاركة في أنشطة الحياة والقيام بدور حقيقي فيها يسهم في تعزيز الاستقرار
          والروتين والشعور بالانتماء والفاعلية، ويزيد من فرص المشاركة مع مرور
          الوقت.
        </p>
      </section>

      <section className="rounded-2xl border border-border/70 bg-secondary p-5">
        <h2 className="text-base font-bold text-foreground">قاعدة الـ15 دقيقة</h2>
        <div className="mt-2 space-y-2 text-[0.95rem] leading-relaxed text-foreground/90">
          <p>
            صُمم هذا الدليل ليكون عمليًا وقابلًا للتطبيق داخل الحياة اليومية، ولا
            يتطلب من الأسرة وقتًا طويلًا أو ترتيبات خاصة.
          </p>
          <p>
            استثمروا روتينكم اليومي كما هو؛ سيعرض لكم دليلي أنشطة مألوفة داخل
            المنزل وفي المجتمع يمكن تحويلها إلى فرص حقيقية للمشاركة.
          </p>
          <p>
            لا تحتاج البداية إلى أكثر من 15 دقيقة يوميًا. اختاروا مستوى المشاركة
            الذي يجعل للشاب أو الشابة دورًا حقيقيًا يمكن تنفيذه، حتى لو كان هذا
            الدور بسيطًا جدًا.
          </p>
          <p>
            استمروا في إتاحة الفرصة للمشاركة في النشاط نفسه بصورة متكررة، وقدّموا
            الدعم عند الحاجة بصورة متدرجة، مع ترك مساحة أكبر للمبادرة والأداء كلما
            أصبح ذلك ممكنًا.
          </p>
          <p>
            عندما تصبح المشاركة في هذا النشاط أكثر ثباتًا، يمكن إضافة نشاط آخر.
            ومع تكرار هذه الفرص بمرور الوقت، تتسع مساحة مشاركة الشاب أو الشابة في
            أحداث الحياة اليومية.
          </p>
        </div>
      </section>
    </div>
  );
}

function EntryLink({
  title,
  description,
  icon: Icon,
  tab,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  tab: "guide" | "considerations";
}) {
  return (
    <Link
      to="/participation-guide"
      search={{ tab }}
      className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
        <Icon className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="min-w-0 flex-1 text-start">
        <span className="block text-base font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
          {description}
        </span>
      </span>
      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
    </Link>
  );
}

function ActivitiesHubPage() {
  return (
    <PageShell
      title="دليلي للمشاركة الحياتية"
      subtitle="خطوات بسيطة مستمرة تحقق مشاركة مستدامة"
      breadcrumbs={[{ label: "دليلي للمشاركة الحياتية" }]}
    >
      <div dir="rtl" className="text-start">
        <Tabs defaultValue="about" dir="rtl" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-3">
            <TabsTrigger value="about" className="text-[0.72rem] font-bold sm:text-sm">
              ما هو دليلي
            </TabsTrigger>
            <TabsTrigger value="guide" className="text-[0.72rem] font-bold sm:text-sm">
              دليل الاستخدام
            </TabsTrigger>
            <TabsTrigger
              value="considerations"
              className="text-[0.72rem] font-bold sm:text-sm"
            >
              اعتبارات الاستخدام
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <AboutTab />
          </TabsContent>

          <TabsContent value="guide">
            <EntryLink
              title="دليل الاستخدام"
              description="طريقة استخدام الدليل خطوة بخطوة: من الحدث اليومي إلى بطاقة فرصة المشاركة."
              icon={BookOpen}
              tab="guide"
            />
          </TabsContent>

          <TabsContent value="considerations">
            <EntryLink
              title="اعتبارات الاستخدام"
              description="اعتبارات عملية تخص المشارك والداعم والفرصة والبيئة، ومتى نوقف المشاركة."
              icon={ShieldCheck}
              tab="considerations"
            />
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm leading-relaxed text-foreground/90">
            قراءة هذه المداخل اختيارية، ويمكنكم البدء مباشرة في أي وقت.
          </p>
        </div>

        <Link
          to="/activities/level"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-gold p-4 text-base font-bold text-primary shadow-elegant transition-transform hover:-translate-y-0.5"
        >
          ابدأ الآن
          <ChevronLeft className="h-5 w-5" />
        </Link>
      </div>
    </PageShell>
  );
}

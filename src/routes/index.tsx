import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  CalendarClock,
  Sparkles,
  ListChecks,
  Library,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — المشاركة هي الحياة نفسها" },
      {
        name: "description",
        content:
          "دليلي يساعد الأسرة على تهيئة فرص مشاركة الأشخاص ذوي الإعاقة في أحداث حياتهم اليومية. الفرصة الموجودة تكفي.",
      },
      { property: "og:title", content: "دليلي — المشاركة هي الحياة نفسها" },
      {
        property: "og:description",
        content:
          "الفرصة الموجودة تكفي: جزء صغير من حدث معتاد يكفي لتبدأ المشاركة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LandingPage,
});

const INFO_TABS = [
  {
    id: "what",
    title: "ما هو دليلي؟",
    body: [
      "دليلي مساحة تساعد الأسرة على استثمار أحداث حياتها اليومية كما هي، وتحويل جزء منها إلى مشاركة حقيقية للابن أو الابنة — دون إضافة مهام جديدة إلى اليوم.",
      "لا نبحث عمّا يستطيع أن يتقنه لاحقًا، بل عمّا يستطيع أن يشارك فيه اليوم.",
    ],
  },
  {
    id: "why",
    title: "لماذا دليلي؟",
    body: [
      "لأن الفرص موجودة أصلًا في يومكم: وجبة، غسيل، تسوّق، ترتيب. ما ينقص عادةً هو طريقة بسيطة لإتاحة جزء من الحدث للمشاركة.",
      "لا يشترط إكمال الحدث كله؛ خطوة واحدة لها معنى تكفي، وتتكرر كلما عاد الحدث طبيعيًا في يومكم.",
    ],
  },
  {
    id: "guide",
    title: "دليل الاستخدام",
    body: [
      "اختاروا حدثًا معتادًا في يومكم، ثم حدّدوا الجزء الذي يمكن مشاركته، وجهّزوا بطاقة مشاركة قصيرة بلغتكم وصوركم.",
      "تجدون الشرح الكامل في صفحة دليل المشاركة.",
    ],
    link: true,
  },
];

const DISCOVERY_PATHS = [
  {
    title: "مشاركات الروتين اليومي",
    description: "رتّبوا محطات يومكم واربطوا بها مشاركات مناسبة.",
    icon: CalendarClock,
    to: "/my-routine" as const,
  },
  {
    title: "ساعدني في الاختيار",
    description: "ثلاث خطوات قصيرة تقترح عليكم فرصة مشاركة مناسبة الآن.",
    icon: Sparkles,
    to: "/help-me-choose" as const,
  },
  {
    title: "مكتبة المشاركات",
    description: "تصفّحوا أحداث الحياة والمشاركات المتاحة داخل المنزل وخارجه.",
    icon: Library,
    to: "/activities/browse" as const,
  },
];

function LandingPage() {
  return (
    <PageShell
      title="دليلي"
      description="مساحة مشاركات الأسرة داخل الحياة اليومية"
      headerExtra={
        <Accordion type="single" collapsible className="space-y-2">
          {INFO_TABS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              className="overflow-hidden rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 px-3"
            >
              <AccordionTrigger className="py-2.5 text-sm font-bold text-primary-foreground hover:no-underline">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                {item.body.map((p) => (
                  <p
                    key={p}
                    className="mt-1 text-sm leading-relaxed text-primary-foreground/80"
                  >
                    {p}
                  </p>
                ))}
                {item.link && (
                  <Link
                    to="/participation-guide"
                    search={{ tab: "guide" as const }}
                    className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-gold"
                  >
                    افتحوا دليل المشاركة
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                  </Link>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      }
    >
      {/* مقدمة مختصرة */}
      <section className="mt-1 rounded-2xl border border-border bg-card p-5 shadow-card-soft">
        <p className="max-w-[52ch] text-[0.98rem] font-bold leading-relaxed text-foreground">
          دليلي يساعد الأسرة على تهيئة فرص مشاركة الأشخاص ذوي الإعاقة في أحداث
          حياتهم اليومية.
        </p>
        <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-muted-foreground">
          المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها.
        </p>
        <p className="mt-1 text-sm font-bold text-gold">الفرصة الموجودة تكفي.</p>
      </section>


      {/* دعوة الاكتشاف */}
      <section className="mt-7">
        <h2 className="px-1 font-display text-lg font-bold leading-snug text-foreground">
          هل تفكرون في مشاركة ابنكم أو ابنتكم في بعض أحداث حياتكم اليومية؟
        </h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          هل تبحثون عن مشاركة مناسبة لكم؟ جرّبوا أحد المسارات التالية.
        </p>

        <div className="mt-3 space-y-3">
          {DISCOVERY_PATHS.map(({ title, description, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 flex-1 text-right">
                <span className="block text-base font-bold text-foreground">
                  {title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {description}
                </span>
              </span>
              <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* مشاركاتي النشطة */}
      <section className="mt-8 border-t border-border pt-6">
        <h2 className="px-1 font-display text-lg font-bold text-foreground">
          مشاركاتي النشطة
        </h2>
        <p className="mt-1 px-1 text-sm leading-relaxed text-muted-foreground">
          تابعوا المشاركات الجارية وسجّلوا ما فعلتموه اليوم.
        </p>
        <Link
          to="/active-participations"
          className="mt-3 flex items-center justify-between gap-3 rounded-2xl border-2 border-primary/30 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground">
              <ListChecks className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-base font-bold text-foreground">
              افتحوا مشاركاتنا النشطة
            </span>
          </span>
          <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground" />
        </Link>
      </section>
    </PageShell>
  );
}

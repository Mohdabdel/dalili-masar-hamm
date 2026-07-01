import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home as HomeIcon, Users, Landmark, ChevronLeft, Info, Clock, Sparkles, Layers } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { homeEvents, resources } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي - مسار همم" },
      { name: "description", content: "دليل الأسر لمشاركة أبنائهم من ذوي الإعاقة في أحداث الحياة اليومية بخطوات بسيطة مستمرة." },
    ],
  }),
  component: LandingPage,
});

const homeCount = homeEvents.filter((e) => e.category === "home").length;
const communityCount = homeEvents.filter((e) => e.category === "community").length;

const categories = [
  {
    to: "/activities/home" as const,
    title: "أنشطة منزلية",
    subtitle: `${homeCount} نشاط داخل المنزل`,
    icon: HomeIcon,
  },
  {
    to: "/activities/community" as const,
    title: "أنشطة مجتمعية",
    subtitle: `${communityCount} نشاط خارج المنزل`,
    icon: Users,
  },
  {
    to: "/resources" as const,
    title: "مصادر الدعم",
    subtitle: `${resources.length} خدمة وجهة معتمدة`,
    icon: Landmark,
  },
];

const principles = [
  {
    icon: Clock,
    title: "قاعدة الـ 15 دقيقة",
    body: "لا يحتاج النشاط أكثر من ربع ساعة يومياً. التركيز على الاستمرارية والنوعية لا على الكم.",
  },
  {
    icon: Sparkles,
    title: "اقتناص الروتين",
    body: "لا تصنعوا أنشطة جديدة، بل استثمروا ما يحدث فعلاً في يومكم من أحداث مألوفة.",
  },
  {
    icon: Layers,
    title: "خيارات مشاركة متدرجة",
    body: "لكل نشاط مستويات متعددة تناسب مختلف القدرات لضمان وجود دور لابنكم مهما كان بسيطاً.",
  },
];

function LandingPage() {
  const [aboutOpen, setAboutOpen] = useState(false);

  return (
    <PageShell title="دليلي" subtitle="خطوات بسيطة مستمرة · تحقق مشاركة مستدامة">
      {/* Intro card */}
      <section className="mt-1 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-elegant">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
          دليل الأسر لمشاركة الأبناء
        </p>
        <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
          هدفنا ليس مجرد «التدريب»، بل خلق مساحة حقيقية لابنكم من ذوي الإعاقة داخل أحداث حياتكم اليومية.
          الحفاظ على المشاركة هو أحد أهم عوامل استقرار الحالة السلوكية والنفسية للشاب.
        </p>
        <button
          onClick={() => setAboutOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-bold text-primary shadow-card-soft transition hover:opacity-90"
        >
          <Info className="h-4 w-4" />
          آلية استخدام الدليل
        </button>
      </section>

      {/* 3 principles compact strip */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {principles.map(({ icon: Icon, title }) => (
          <div
            key={title}
            className="flex flex-col items-center gap-1.5 rounded-2xl border border-border/60 bg-card p-3 text-center shadow-card-soft"
          >
            <Icon className="h-5 w-5 text-primary" strokeWidth={2.2} />
            <p className="text-[11px] font-bold leading-tight text-foreground">{title}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <h2 className="mt-6 mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        اختر الفئة
      </h2>
      <div className="space-y-3">
        {categories.map(({ to, title, subtitle, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elegant"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
              <Icon className="h-6 w-6" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-foreground">{title}</h3>
              <p className="mt-0.5 text-xs font-medium text-muted-foreground">{subtitle}</p>
            </div>
            <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>

      {/* About sheet */}
      <Sheet open={aboutOpen} onOpenChange={setAboutOpen}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-3xl border-t-0 bg-background p-0">
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />
          <SheetHeader className="px-5 pt-4 pb-2 text-right">
            <SheetTitle className="text-right text-xl font-bold text-foreground">
              آلية استخدام الدليل
            </SheetTitle>
            <p className="text-xs text-muted-foreground">15 دقيقة تصنع الفرق</p>
          </SheetHeader>
          <div className="space-y-4 px-5 pb-8">
            <div className="rounded-2xl bg-muted/50 p-4">
              <p className="text-sm leading-relaxed text-foreground">
                هذا الدليل عملي وواقعي، لا يتطلب تفرغاً طويلاً. استثمر الروتين اليومي، اختر مستوى المشاركة المناسب لقدرات ابنك، وابدأ بخطوات صغيرة متدرجة نحو الاستقلالية.
              </p>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {principles.map((p, i) => (
                <AccordionItem
                  key={p.title}
                  value={`p-${i}`}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
                >
                  <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
                    {p.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem
                value="considerations"
                className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
              >
                <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
                  اعتبارات قبل البدء
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                  <ul className="list-disc space-y-1.5 pe-4">
                    <li>اختر أنشطة من اهتمامات ابنك وواقعية تحدث بشكل يومي أو دوري.</li>
                    <li>حافظ على روتين يومي ثابت؛ فالجداول الزمنية توفر شعوراً بالأمان والتوقع.</li>
                    <li>استخدم لغة تواصل بصرية بسيطة (صور ورموز) مع الكلمة المنطوقة.</li>
                    <li>هيّئ زاوية غير مشتتة، وابدأ بفترات قصيرة تتزايد تدريجياً حسب الاستجابة.</li>
                    <li>اجعل التعليمات بسيطة ومباشرة، ونوّع الأساليب لكسر الملل.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </PageShell>
  );
}

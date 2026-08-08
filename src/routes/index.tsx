import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, HeartHandshake, MapPinned, GraduationCap } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — دعم وتمكين أسر ذوي الإعاقة" },
      {
        name: "description",
        content:
          "دليلي: منصة واحدة بثلاث خدمات — المشاركة الحياتية اليومية، مصادر الدعم المجتمعي، ومصادر الدعم التعليمي والتأهيلي.",
      },
      { property: "og:title", content: "دليلي — دعم وتمكين أسر ذوي الإعاقة" },
      {
        property: "og:description",
        content:
          "ثلاث خدمات مستقلة: المشاركة الحياتية، الدعم المجتمعي، والدعم التعليمي.",
      },
    ],
  }),
  component: LandingPage,
});

const SERVICES = [
  {
    title: "دليلي للمشاركة الحياتية",
    description:
      "حوّل أحداث اليوم العادية إلى فرص مشاركة متدرجة، مع بطاقات عملية ودعم أثناء التطبيق.",
    icon: HeartHandshake,
    to: "/activities" as const,
    accent: "bg-gradient-primary text-primary-foreground",
    tint: "border-primary/30",
  },
  {
    title: "مصادر الدعم المجتمعي",
    description:
      "دليل وصول للمرافق والفعاليات والتسهيلات والنقل والمبادرات المجتمعية.",
    icon: MapPinned,
    to: "/community-support" as const,
    accent: "bg-gradient-sage text-primary-foreground",
    tint: "border-sage/40",
  },
  {
    title: "مصادر الدعم التعليمي",
    description:
      "دليل وصول لمزودي الخدمات التعليمية والتأهيلية: تربية خاصة، نطق، علاج وظيفي وطبيعي، وتدريب مهني.",
    icon: GraduationCap,
    to: "/education-support" as const,
    accent: "bg-gradient-gold text-primary",
    tint: "border-gold/50",
  },
];

function LandingPage() {
  return (
    <PageShell
      title="دليلي"
      description="دليل دعم وتمكين أسر الأشخاص من ذوي الإعاقة"
    >
      <section className="mt-1 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
          منصة واحدة · ثلاث خدمات
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-3xl">
          دليلي
        </h2>
        <p className="mt-2 text-base leading-relaxed text-primary-foreground/90">
          دليل دعم وتمكين أسر الأشخاص من ذوي الإعاقة.
        </p>
        <a
          href="#services"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground shadow-card-soft transition-transform hover:-translate-y-0.5"
        >
          استعرض الخدمات الثلاث
          <ChevronLeft className="h-4 w-4" strokeWidth={2.4} />
        </a>
      </section>

      <section id="services" className="mt-6 space-y-3">
        <h2 className="px-1 font-display text-lg font-bold text-foreground">
          الخدمات
        </h2>
        {SERVICES.map(({ title, description, icon: Icon, to, accent, tint }) => (
          <Link
            key={title}
            to={to}
            className={`group flex items-start gap-4 rounded-2xl border-2 bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant ${tint}`}
          >
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-card-soft ${accent}`}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 text-right">
              <span className="block font-display text-lg font-bold text-foreground">
                {title}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {description}
              </span>
            </span>
            <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </section>

      <section className="mt-6 rounded-2xl border border-border/60 bg-card p-5 shadow-card-soft">
        <h3 className="font-display text-base font-bold text-foreground">
          فكرة دليلي
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          لا نضيف أنشطة جديدة إلى يوم الأسرة، بل نستثمر ما يحدث بالفعل داخل المنزل
          أو المجتمع، ونحوله إلى فرص مشاركة متدرجة وهادفة، مع دليل وصول واضح
          للخدمات المجتمعية والتعليمية.
        </p>
      </section>
    </PageShell>
  );
}

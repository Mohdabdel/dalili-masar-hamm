import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronLeft,
  HeartHandshake,
  CalendarClock,
  Sparkles,
  ListChecks,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — المشاركة هي الحياة نفسها" },
      {
        name: "description",
        content:
          "دليلي: مساحة الأسرة لتحويل أحداث الحياة اليومية إلى مشاركة حقيقية. الفرصة الموجودة تكفي — ابدأوا من حدث معتاد في يومكم.",
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

const FAMILY_TOOLS = [
  {
    title: "بناء روتيننا اليومي",
    description: "رتّبوا محطات يومكم (صباح، بعد الظهر، مساء) واربطوا بها المشاركات.",
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
    title: "مشاركاتي النشطة",
    description: "تابعوا المشاركات الجارية وسجّلوا ما فعلتموه اليوم.",
    icon: ListChecks,
    to: "/active-participations" as const,
  },
];

function LandingPage() {
  return (
    <PageShell
      title="دليلي"
      description="مساحة مشاركات الأسرة داخل الحياة اليومية"
    >
      <section className="mt-1 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant sm:p-8">
        <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          المشاركة ليست تدريبًا على الحياة… المشاركة هي الحياة نفسها.
        </h2>
        <p className="mt-3 text-base font-bold text-gold">الفرصة الموجودة تكفي.</p>
        <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-primary-foreground/90">
          لا تحتاجون إلى تخصيص وقت للمشاركة. عندما يحدث شيء معتاد في يومكم، يمكن
          إتاحة جزء صغير منه للمشاركة — ولو للحظات، وبالقدر الذي يناسب الموقف
          والأسرة.
        </p>
      </section>

      <section className="mt-6">
        <Link
          to="/activities"
          className="group flex items-start gap-4 rounded-2xl border-2 border-primary/30 bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:shadow-elegant"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-card-soft">
            <HeartHandshake className="h-6 w-6" strokeWidth={2} />
          </span>
          <span className="min-w-0 flex-1 text-right">
            <span className="block font-display text-lg font-bold text-foreground">
              مساحة مشاركاتنا
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
              ابدأوا من حدث داخل المنزل أو خارجه، واصنعوا بطاقة مشاركة تناسب أسرتكم.
            </span>
          </span>
          <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
        </Link>
      </section>


      <section id="family-tools" className="mt-6 space-y-3">
        <h2 className="px-1 font-display text-lg font-bold text-foreground">
          ابدأ من هنا
        </h2>
        {FAMILY_TOOLS.map(({ title, description, icon: Icon, to }) => (
          <Link
            key={title}
            to={to}
            className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
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
      </section>

    </PageShell>
  );
}

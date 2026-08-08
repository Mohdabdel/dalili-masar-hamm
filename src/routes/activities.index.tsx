import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Sun, Layers, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/activities/")({
  head: () => ({
    meta: [
      { title: "دليلي للمشاركة الحياتية | دليلي - مسار همم" },
      {
        name: "description",
        content:
          "اختر مسار البدء: أحداث يومي، حسب أحداث اليوم، أو حسب المجالات.",
      },
    ],
  }),
  component: ActivitiesHubPage,
});

type Path = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  to: "/activities/my-day" | "/activities/$category";
  params?: { category: "home" };
  search?: { view: "today" | "domains" };
};

const PATHS: Path[] = [
  {
    title: "أحداث يومي",
    description:
      "اختر أحداثاً من يومكم الحالي، واجعل دليلي يرافقكم في تنفيذ فرص مشاركة قصيرة ومتدرجة.",
    icon: CalendarDays,
    to: "/activities/my-day",
  },
  {
    title: "حسب أحداث اليوم",
    description:
      "استعرض الأحداث اليومية المتاحة داخل المنزل والمجتمع، واختر ما يناسبكم الآن.",
    icon: Sun,
    to: "/activities/$category",
    params: { category: "home" },
    search: { view: "today" },
  },
  {
    title: "حسب المجالات",
    description:
      "استعرض الأنشطة حسب مجالات الحياة مثل الملابس، المطبخ، الصحة، السلامة، والمشاركة الأسرية.",
    icon: Layers,
    to: "/activities/$category",
    params: { category: "home" },
    search: { view: "domains" },
  },
];

function ActivitiesHubPage() {
  return (
    <PageShell
      title="دليلي للمشاركة الحياتية"
      subtitle="اختر نقطة البداية المناسبة لكم اليوم"
      breadcrumbs={[{ label: "دليلي للمشاركة الحياتية" }]}
    >
      <section className="mb-4 rounded-2xl border border-border/70 bg-card p-4 text-right shadow-card-soft">
        <h2 className="text-base font-bold text-foreground">
          ما هو دليلي للمشاركة الحياتية؟
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          دليل يساعد الأسرة على استثمار أحداث الحياة اليومية وتحويلها إلى فرص
          مشاركة عملية وهادفة، دون إضافة أنشطة جديدة إلى اليوم أو تقديم تدريب
          منفصل.
        </p>
        <Link
          to="/participation-guide"
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-gold underline-offset-4 hover:underline"
        >
          دليل الاستخدام
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </section>


      <div className="space-y-3">
        {PATHS.map(({ title, description, icon: Icon, to, params, search }) => (
          <Link
            key={title}
            to={to}
            params={params as never}
            search={search as never}
            className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1 text-right">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>
            <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Home as HomeIcon, Users, Landmark, ChevronLeft } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { homeEvents, resources } from "@/lib/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي - مسار همم" },
      { name: "description", content: "منصة تخطيط انتقالي لأصحاب الهمم: أنشطة منزلية ومجتمعية ومصادر معتمدة." },
    ],
  }),
  component: LandingPage,
});

const homeCount = homeEvents.filter((e) => e.category === "home").length;
const communityCount = homeEvents.filter((e) => e.category === "community").length;

const categories = [
  {
    to: "/activities/home" as const,
    title: "الأنشطة المنزلية",
    subtitle: `${homeCount} نشاط داخل المنزل`,
    icon: HomeIcon,
  },
  {
    to: "/activities/community" as const,
    title: "الأنشطة المجتمعية",
    subtitle: `${communityCount} نشاط خارج المنزل`,
    icon: Users,
  },
  {
    to: "/resources" as const,
    title: "مصادر مجتمعية",
    subtitle: `${resources.length} خدمة وجهة معتمدة`,
    icon: Landmark,
  },
];

function LandingPage() {
  return (
    <PageShell title="اختر الفئة" subtitle="ابدأ رحلتك بتحديد نوع المحتوى">
      <div className="mt-2 space-y-4">
        {categories.map(({ to, title, subtitle, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elegant"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
              <Icon className="h-7 w-7" strokeWidth={2.2} />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-bold text-foreground">{title}</h3>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{subtitle}</p>
            </div>
            <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

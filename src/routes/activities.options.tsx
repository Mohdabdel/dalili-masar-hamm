import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CalendarDays, ChevronLeft, Layers, ListChecks } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  participationLevelDescription,
  participationLevelLabel,
  isParticipationLevel,
} from "@/lib/knowledge-base";
import type { ParticipationLevelKey } from "@/lib/home-hierarchy";

const searchSchema = z.object({
  level: z.string().optional(),
});

export const Route = createFileRoute("/activities/options")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "خيارات المشاركة | دليلي للمشاركة الحياتية" },
      {
        name: "description",
        content:
          "اختر طريقة استعراض فرص المشاركة: حسب المجالات، أو حسب أحداث اليوم، أو مشاركات عامة.",
      },
      {
        property: "og:title",
        content: "خيارات المشاركة | دليلي للمشاركة الحياتية",
      },
      {
        property: "og:description",
        content:
          "ثلاث طرق لاستعراض فرص المشاركة المطابقة للمستوى المختار داخل دليلي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OptionsPage,
});

const OPTIONS: {
  title: string;
  description: string;
  view: "domains" | "today" | "all";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  {
    title: "مشاركات حسب المجالات",
    description:
      "استعرض فرص المشاركة مرتبة حسب مجالات الحياة والأحداث المرتبطة بها.",
    view: "domains",
    icon: Layers,
  },
  {
    title: "مشاركات حسب أحداث اليوم",
    description: "ابدأ مما يحدث فعلاً في يومكم الآن واختر فرصة مناسبة.",
    view: "today",
    icon: CalendarDays,
  },
  {
    title: "مشاركات عامة",
    description:
      "قائمة موحّدة بجميع فرص المشاركة المطابقة للمستوى عبر المجالات والأحداث.",
    view: "all",
    icon: ListChecks,
  },
];

function OptionsPage() {
  const { level: rawLevel } = Route.useSearch();
  const level: ParticipationLevelKey | undefined = isParticipationLevel(rawLevel)
    ? rawLevel
    : undefined;

  return (
    <PageShell
      title="خيارات المشاركة"
      subtitle={
        level
          ? `${participationLevelLabel[level]} — ${participationLevelDescription[level]}`
          : "اختر طريقة استعراض فرص المشاركة"
      }
      breadcrumbs={[
        { label: "دليلي للمشاركة الحياتية", to: "/activities" },
        { label: "اختر مستوى المشاركة", to: "/activities/level" },
        { label: "خيارات المشاركة" },
      ]}
    >
      <div dir="rtl" className="space-y-3 text-start">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-secondary px-4 py-3">
          <span className="text-sm font-bold text-foreground">
            {level ? participationLevelLabel[level] : "جميع المستويات"}
          </span>
          <Link
            to="/activities/level"
            className="text-xs font-bold text-gold underline-offset-4 hover:underline"
          >
            تغيير المستوى
          </Link>
        </div>

        {OPTIONS.map(({ title, description, view, icon: Icon }) => (
          <Link
            key={view}
            to="/activities/browse"
            search={{ level, view }}
            className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
              <Icon className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 text-start">
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
    </PageShell>
  );
}

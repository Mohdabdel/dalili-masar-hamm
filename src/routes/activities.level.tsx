import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, Info, Layers } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import {
  PARTICIPATION_LEVEL_KEYS,
  participationLevelDescription,
  participationLevelLabel,
  countOpportunitiesByLevel,
} from "@/lib/knowledge-base";

export const Route = createFileRoute("/activities/level")({
  head: () => ({
    meta: [
      { title: "اختر مستوى المشاركة | دليلي للمشاركة الحياتية" },
      {
        name: "description",
        content:
          "اختر مستوى فرصة المشاركة: بسيط أو متوسط أو متقدم. المستوى يصف حجم وتعقيد الفرصة، وليس قدرة الشخص.",
      },
      {
        property: "og:title",
        content: "اختر مستوى المشاركة | دليلي للمشاركة الحياتية",
      },
      {
        property: "og:description",
        content:
          "ثلاثة مستويات لفرص المشاركة داخل دليلي للمشاركة الحياتية: بسيط، متوسط، متقدم.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LevelSelectPage,
});

function LevelSelectPage() {
  const counts = countOpportunitiesByLevel();

  return (
    <PageShell
      title="اختر مستوى المشاركة"
      subtitle="ابدأ باختيار مستوى فرصة المشاركة المناسبة لكم الآن"
      breadcrumbs={[
        { label: "دليلي للمشاركة الحياتية", to: "/activities" },
        { label: "اختر مستوى المشاركة" },
      ]}
    >
      <div dir="rtl" className="space-y-3 text-start">
        <div className="flex items-start gap-3 rounded-2xl border border-border/70 bg-secondary p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm leading-relaxed text-foreground/90">
            المستوى يصف حجم وتعقيد فرصة المشاركة، وليس قدرة الشخص.
          </p>
        </div>

        {PARTICIPATION_LEVEL_KEYS.map((key) => (
          <Link
            key={key}
            to="/activities/options"
            search={{ level: key }}
            className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
              <Layers className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="min-w-0 flex-1 text-start">
              <span className="block text-lg font-bold text-foreground">
                {participationLevelLabel[key]}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                {participationLevelDescription[key]}
              </span>
              <span className="mt-2 block text-xs font-semibold text-gold">
                {counts[key]} فرصة مشاركة متاحة
              </span>
            </span>
            <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

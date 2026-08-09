import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { HomeHierarchy } from "@/components/HomeHierarchy";
import { TodayEvents } from "@/components/TodayEvents";
import { GeneralParticipationList } from "@/components/GeneralParticipationList";
import {
  filterDomainsByLevel,
  getCommunityDomains,
  getHomeDomains,
  isParticipationLevel,
  participationLevelDescription,
  participationLevelLabel,
} from "@/lib/knowledge-base";
import type { ParticipationLevelKey } from "@/lib/home-hierarchy";

const searchSchema = z.object({
  level: z.string().optional(),
  view: z.string().optional(),
});

export const Route = createFileRoute("/activities/browse")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "استعراض فرص المشاركة | دليلي للمشاركة الحياتية" },
      {
        name: "description",
        content:
          "استعرض فرص المشاركة المطابقة لمستوى المشاركة المختار حسب المجال أو الأحداث اليومية أو كقائمة عامة.",
      },
      {
        property: "og:title",
        content: "استعراض فرص المشاركة | دليلي للمشاركة الحياتية",
      },
      {
        property: "og:description",
        content:
          "فرص مشاركة عملية مرتبة حسب المستوى والمجال والحدث اليومي داخل دليلي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: BrowsePage,
});

function BrowsePage() {
  const { level: rawLevel, view: rawView } = Route.useSearch();
  const level: ParticipationLevelKey | undefined = isParticipationLevel(rawLevel)
    ? rawLevel
    : undefined;
  const view =
    rawView === "today" || rawView === "all" ? rawView : ("domains" as const);

  const domains = filterDomainsByLevel(
    [...getHomeDomains(), ...getCommunityDomains().filter(
      (c) => !getHomeDomains().some((h) => h.id === c.id),
    )],
    level,
  );

  const titles: Record<string, string> = {
    domains: "مشاركات حسب المجال",
    today: "مشاركات حسب الأحداث اليومية",
    all: "مشاركات عامة",
  };

  return (
    <PageShell
      title={titles[view]}
      subtitle={
        level
          ? `${participationLevelLabel[level]} — ${participationLevelDescription[level]}`
          : "جميع المستويات"
      }
      breadcrumbs={[
        { label: "دليلي للمشاركة الحياتية", to: "/activities" },
        { label: "اختر مستوى المشاركة", to: "/activities/level" },
        { label: titles[view] },
      ]}
    >
      <div dir="rtl" className="text-start">
        <div className="mb-3 flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-secondary px-4 py-3">
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

        {view === "all" && <GeneralParticipationList level={level} />}

        {view === "today" && <TodayEvents level={level} />}

        {view === "domains" &&
          (domains.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              لا توجد فرص مشاركة بهذا المستوى حالياً.
            </p>
          ) : (
            <HomeHierarchy domains={domains} />
          ))}
      </div>
    </PageShell>
  );
}

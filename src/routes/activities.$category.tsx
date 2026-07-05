import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { HomeHierarchy } from "@/components/HomeHierarchy";
import { communityHierarchy } from "@/lib/community-hierarchy";
import type { ActivityCategory } from "@/lib/data";

const searchSchema = z.object({
  open: z.string().optional(),
});

export const Route = createFileRoute("/activities/$category")({
  parseParams: (p) => {
    if (p.category !== "home" && p.category !== "community") throw notFound();
    return { category: p.category as ActivityCategory };
  },
  validateSearch: searchSchema,
  head: ({ params }) => {
    const isHome = params.category === "home";
    const title = isHome ? "الأنشطة المنزلية" : "الأنشطة المجتمعية";
    return {
      meta: [
        { title: `${title} | دليلي - مسار همم` },
        { name: "description", content: `${title} مع خطوات تفاعلية وأفكار للدعم الحسي.` },
      ],
    };
  },
  component: ActivitiesPage,
  notFoundComponent: () => (
    <PageShell title="غير موجود">
      <p className="text-center text-muted-foreground">الفئة غير متوفرة.</p>
    </PageShell>
  ),
  errorComponent: () => (
    <PageShell title="خطأ">
      <p className="text-center text-muted-foreground">حدث خطأ غير متوقع.</p>
    </PageShell>
  ),
});

function ActivitiesPage() {
  const { category } = Route.useParams();
  const { open } = Route.useSearch();

  if (category === "home") {
    return (
      <PageShell
        title="الأنشطة المنزلية"
        subtitle="مجال ← نشاط عام ← حدث حياة ← فرصة مشاركة ← بطاقة"
        breadcrumbs={[{ label: "الأنشطة المنزلية" }]}
      >
        <HomeHierarchy openOpportunityId={open} />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="الأنشطة المجتمعية"
      subtitle="مجال ← نشاط عام ← حدث حياة ← فرصة مشاركة ← بطاقة"
      breadcrumbs={[{ label: "الأنشطة المجتمعية" }]}
    >
      <HomeHierarchy domains={communityHierarchy} openOpportunityId={open} />
    </PageShell>
  );
}





import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";
import { PageShell } from "@/components/PageShell";
import { HomeHierarchy } from "@/components/HomeHierarchy";
import { TodayEvents } from "@/components/TodayEvents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityHierarchy } from "@/lib/community-hierarchy";
import type { ActivityCategory } from "@/lib/data";

const searchSchema = z.object({
  open: z.string().optional(),
  view: z.enum(["today", "domains"]).optional(),
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
  const { open, view } = Route.useSearch();

  if (category === "home") {
    const defaultTab = open ? "domains" : (view ?? "today");
    return (
      <PageShell
        title="الأنشطة المنزلية"
        subtitle="اختر ما يحدث داخل المنزل اليوم، ثم افتح فرصة مشاركة مناسبة يمكن تنفيذها مع الشاب أو البالغ خطوة بخطوة."
        breadcrumbs={[{ label: "الأنشطة المنزلية" }]}
      >
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="today" className="py-2.5 text-sm font-bold">
              أحداث اليوم
            </TabsTrigger>
            <TabsTrigger value="domains" className="py-2.5 text-sm font-bold">
              حسب المجالات
            </TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="mt-4">
            <TodayEvents />
          </TabsContent>
          <TabsContent value="domains" className="mt-4">
            <HomeHierarchy openOpportunityId={open} />
          </TabsContent>
        </Tabs>
      </PageShell>
    );
  }


  return (
    <PageShell
      title="الأنشطة المجتمعية"
      subtitle="اختر ما يحدث خارج المنزل اليوم، ثم افتح فرصة مشاركة مناسبة يمكن تنفيذها مع الشاب أو البالغ خطوة بخطوة."
      breadcrumbs={[{ label: "الأنشطة المجتمعية" }]}
    >
      <HomeHierarchy domains={communityHierarchy} openOpportunityId={open} />
    </PageShell>
  );
}






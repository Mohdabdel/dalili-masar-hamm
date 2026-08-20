import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { ResourceDirectory } from "@/components/ResourceDirectory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getEducationServices, getResources } from "@/lib/service-directories";

export const Route = createFileRoute("/education-support")({
  head: () => ({
    meta: [
      { title: "مصادر الدعم التعليمي | دليلي" },
      {
        name: "description",
        content:
          "دليل وصول لمزودي الخدمات التعليمية والتأهيلية في الإمارات، إضافة إلى مكتبة مصادر تعليمية موثقة: أدلة، قوائم مراجعة، ومنصات تعلم.",
      },
      { property: "og:title", content: "مصادر الدعم التعليمي | دليلي" },
      {
        property: "og:description",
        content:
          "مقدمو الخدمات التعليمية والتأهيلية ومكتبة المصادر التعليمية، مع بحث وفلاتر واضحة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EducationSupportPage,
});

function EducationSupportPage() {
  const services = useMemo(() => getEducationServices(), []);
  const resources = useMemo(() => getResources(), []);

  return (
    <PageShell
      title="مصادر الدعم التعليمي"
      description="مقدمو الخدمات التعليمية والتأهيلية، ومكتبة المصادر التعليمية"
      breadcrumbs={[{ label: "مصادر الدعم التعليمي" }]}
    >
      <Tabs defaultValue="providers" dir="rtl" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers" className="min-h-11 text-xs font-semibold">
            مقدمو الخدمات
          </TabsTrigger>
          <TabsTrigger value="resources" className="min-h-11 text-xs font-semibold">
            المصادر التعليمية
          </TabsTrigger>
          <TabsTrigger value="tools" className="min-h-11 text-xs font-semibold">
            أدوات ووسائل داعمة
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers">
          <ServiceDirectory
            intro="مزودو الخدمات التعليمية والتأهيلية: التربية الخاصة، التعليم العالي وتسهيلات الطلبة، التدريب المهني، وخدمات الانتقال. معلومات وصول فقط دون تقييم أو تفضيل."
            services={services}
            emptyTitle="لا توجد نتائج مطابقة"
            emptyBody="جرّب تعديل كلمة البحث أو إعادة ضبط المرشحات لعرض مقدمي الخدمات المتاحين."
          />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceDirectory
            intro="مكتبة مصادر تعليمية وأدلة وقوائم مراجعة صادرة عن جهات رسمية ومنظمات متخصصة. المصادر ليست مقدمي خدمة، وتُفتح روابطها في نافذة جديدة."
            resources={resources}
          />
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            أدوات بصرية تصنعها الأسرة بنفسها: الجدول البصري، التسلسل البصري، لوحة الاختيار، لوحة
            التواصل البسيطة، وتصميم مشاركة خاصة. كل ما تنشئه يبقى خاصًا بأسرتك ومحفوظًا على جهازك،
            ولا يُضاف إلى محتوى دليلي العام.
          </p>
          <div className="grid gap-2">
            {VISUAL_TOOL_TYPES.map((t) => (
              <div key={t.type} className="rounded-2xl border border-border bg-card p-3">
                <p className="text-sm font-bold text-foreground">{t.titleAr}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {t.descriptionAr}
                </p>
              </div>
            ))}
          </div>
          <Button asChild className="min-h-12 w-full gap-2 text-sm font-semibold">
            <Link to="/tools">
              <Wrench className="h-4 w-4" />
              فتح أدوات ووسائل داعمة
            </Link>
          </Button>
        </TabsContent>
      </Tabs>

    </PageShell>
  );
}

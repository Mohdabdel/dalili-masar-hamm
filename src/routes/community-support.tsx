import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageShell } from "@/components/PageShell";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { getCommunityServices } from "@/lib/service-directories";

export const Route = createFileRoute("/community-support")({
  head: () => ({
    meta: [
      { title: "مصادر الدعم المجتمعي | دليلي" },
      {
        name: "description",
        content:
          "دليل وصول للخدمات المجتمعية: النقل، الرياضة، الثقافة، التسهيلات وإمكانية الوصول، الدعم المالي، ودعم الأسرة والأقران في دولة الإمارات.",
      },
      { property: "og:title", content: "مصادر الدعم المجتمعي | دليلي" },
      {
        property: "og:description",
        content:
          "دليل وصول للخدمات المجتمعية لأسر الأشخاص من ذوي الإعاقة، مع بحث وفلاتر حسب الإمارة والمجال وطريقة الوصول.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommunitySupportPage,
});

function CommunitySupportPage() {
  const services = useMemo(() => getCommunityServices(), []);

  return (
    <PageShell
      title="مصادر الدعم المجتمعي"
      description="دليل وصول للخدمات والمرافق والمبادرات المجتمعية"
      breadcrumbs={[{ label: "مصادر الدعم المجتمعي" }]}
    >
      <ServiceDirectory
        intro="هذا الدليل يساعد الأسرة على الوصول إلى الخدمات المجتمعية المتاحة. يعرض معلومات وصول فقط، دون تقييم أو ترتيب أو تفضيل لأي جهة، وتُوضَّح حالة التحقق من كل خدمة بشفافية."
        services={services}
        emptyTitle="لا توجد نتائج مطابقة"
        emptyBody="جرّب تعديل كلمة البحث أو إعادة ضبط المرشحات لعرض الخدمات المتاحة."
      />
    </PageShell>
  );
}

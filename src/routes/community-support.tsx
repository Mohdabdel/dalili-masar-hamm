import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { COMMUNITY_CATEGORIES, COMMUNITY_PROVIDERS } from "@/lib/service-directories";

export const Route = createFileRoute("/community-support")({
  head: () => ({
    meta: [
      { title: "مصادر الدعم المجتمعي | دليلي" },
      {
        name: "description",
        content:
          "دليل وصول للخدمات المجتمعية: الترفيه والفعاليات، المراكز والمرافق، التسهيلات وإمكانية الوصول، النقل، والمبادرات المجتمعية.",
      },
      { property: "og:title", content: "مصادر الدعم المجتمعي | دليلي" },
      {
        property: "og:description",
        content:
          "دليل وصول للخدمات المجتمعية لأسر الأشخاص من ذوي الإعاقة، مع بحث وفلاتر حسب الإمارة ونوع الخدمة.",
      },
    ],
  }),
  component: CommunitySupportPage,
});

function CommunitySupportPage() {
  return (
    <PageShell
      title="مصادر الدعم المجتمعي"
      description="دليل وصول للخدمات والمرافق والمبادرات المجتمعية"
      breadcrumbs={[{ label: "مصادر الدعم المجتمعي" }]}
    >
      <ServiceDirectory
        intro="هذا الدليل يساعد الأسرة على الوصول إلى الخدمات والمرافق والفعاليات المجتمعية. يعرض معلومات وصول فقط، دون تقييم أو ترتيب أو تفضيل لأي جهة."
        categories={COMMUNITY_CATEGORIES}
        providers={COMMUNITY_PROVIDERS}
        emptyTitle="الدليل جاهز لاستقبال الجهات"
        emptyBody="لم تُضف بعد جهات موثقة ضمن هذه الفئة. البنية والفلاتر جاهزة، وستظهر الجهات هنا فور اعتماد بياناتها الرسمية."
      />
    </PageShell>
  );
}

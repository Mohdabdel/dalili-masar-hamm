import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { EDUCATION_CATEGORIES, EDUCATION_PROVIDERS } from "@/lib/service-directories";

export const Route = createFileRoute("/education-support")({
  head: () => ({
    meta: [
      { title: "مصادر الدعم التعليمي | دليلي" },
      {
        name: "description",
        content:
          "دليل وصول لمزودي الخدمات التعليمية والتأهيلية: التربية الخاصة، التأهيل، النطق واللغة، العلاج الوظيفي والطبيعي، والتدريب المهني.",
      },
      { property: "og:title", content: "مصادر الدعم التعليمي | دليلي" },
      {
        property: "og:description",
        content:
          "دليل وصول لمزودي الخدمات التعليمية والتأهيلية، مع بحث وفلاتر حسب الإمارة ونوع الخدمة.",
      },
    ],
  }),
  component: EducationSupportPage,
});

function EducationSupportPage() {
  return (
    <PageShell
      title="مصادر الدعم التعليمي"
      description="دليل وصول لمزودي الخدمات التعليمية والتأهيلية"
      breadcrumbs={[{ label: "مصادر الدعم التعليمي" }]}
    >
      <ServiceDirectory
        intro="هذا الدليل يساعد الأسرة على الوصول إلى مزودي الخدمات التعليمية والتأهيلية. يعرض معلومات وصول فقط، دون تقييم أو ترتيب أو تفضيل لأي جهة."
        categories={EDUCATION_CATEGORIES}
        providers={EDUCATION_PROVIDERS}
        emptyTitle="الدليل جاهز لاستقبال الجهات"
        emptyBody="لم تُضف بعد جهات موثقة ضمن هذه الفئة. البنية والفلاتر جاهزة، وستظهر الجهات هنا فور اعتماد بياناتها الرسمية."
      />
    </PageShell>
  );
}

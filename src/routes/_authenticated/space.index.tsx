import { redirect as legacyRedirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SpaceHomePage } from "@/features/space/pages/SpaceHomePage";

export const Route = createFileRoute("/_authenticated/space/")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/space/participations", replace: true });
  },
  component: SpaceRoute,
  head: () => ({
    meta: [
      { title: "مساحة مشاركة الأسرة — دليلي" },
      { name: "description", content: "بطاقات مشاركة أسرتكم: ما هو مفتوح الآن وما سبق أن أغلقتموه." },
      { property: "og:title", content: "مساحة مشاركة الأسرة — دليلي" },
      { property: "og:description", content: "بطاقات مشاركة أسرتكم: ما هو مفتوح الآن وما سبق أن أغلقتموه." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function SpaceRoute() {
  return <SpaceHomePage />;
}

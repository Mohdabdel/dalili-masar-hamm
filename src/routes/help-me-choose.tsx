import { redirect as legacyRedirect } from "@tanstack/react-router";
// المسار القديم "ساعدني في الاختيار" كان يوجّه الأسرة عبر مستوى المشاركة.
// دوره القانوني انتقل إلى «بداية سهلة»، التي تبدأ ممّا يحبه الشخص لا ممّا يُقاس عليه.
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/help-me-choose")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/space/easy", replace: true });
  },
  beforeLoad: () => {
    throw redirect({ to: "/space/easy" });
  },
});

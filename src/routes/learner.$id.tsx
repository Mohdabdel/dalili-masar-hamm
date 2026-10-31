// مسار متقاعد (Foundation 05 — D06).
// كان يبني «نسخة المتعلم» مباشرة من بيانات المرجع/CSV بلا نسخة معتمدة.
// لم يعد يقدّم أي محتوى استخدام؛ يحوّل إلى مساحة عمل الأسرة لإعداد بطاقة واعتمادها.
import { createFileRoute, redirect, redirect as legacyRedirect } from "@tanstack/react-router";
import { workspaceSpecIdFor } from "@/features/space/participation-link";

export const Route = createFileRoute("/learner/$id")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/", replace: true });
  },
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/space/workspace/$specId",
      params: { specId: workspaceSpecIdFor(params.id) },
    });
  },
  component: () => null,
});

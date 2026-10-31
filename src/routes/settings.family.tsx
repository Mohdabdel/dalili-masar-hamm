import { createFileRoute, redirect, redirect as legacyRedirect } from "@tanstack/react-router";

// Legacy local-only profile is outside the approved family account flow.
// Keep the URL as a redirect without deleting locally saved information.
export const Route = createFileRoute("/settings/family")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/", replace: true });
  },
  beforeLoad: () => {
    throw redirect({ to: "/settings" });
  },
});

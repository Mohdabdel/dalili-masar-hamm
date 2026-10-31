import { createFileRoute, redirect, redirect as legacyRedirect } from "@tanstack/react-router";

// Legacy local-only form is outside the approved participation flow.
// Keep the URL as a redirect so existing bookmarks return to settings.
export const Route = createFileRoute("/settings/add-event")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/", replace: true });
  },
});

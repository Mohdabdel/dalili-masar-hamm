import { redirect as legacyRedirect } from "@tanstack/react-router";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LabStateProvider } from "@/lab/state/lab-state";
import { LabShell } from "@/lab/components/LabShell";

export const Route = createFileRoute("/lab")({
  // مسار قديم خارج خريطة التجربة المعتمدة: الرابط المباشر يُعاد توجيهه ولا يعرض الواجهة القديمة.
  beforeLoad: () => {
    throw legacyRedirect({ to: "/", replace: true });
  },
  component: LabLayout,
  head: () => ({
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function LabLayout() {
  return (
    <LabStateProvider>
      <LabShell>
        <Outlet />
      </LabShell>
    </LabStateProvider>
  );
}

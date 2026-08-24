import { createFileRoute, Outlet } from "@tanstack/react-router";
import { LabStateProvider } from "@/lab/state/lab-state";
import { LabShell } from "@/lab/components/LabShell";

export const Route = createFileRoute("/lab")({
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

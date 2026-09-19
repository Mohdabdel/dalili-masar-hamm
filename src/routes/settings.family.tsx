import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy local-only profile is outside the approved family account flow.
// Keep the URL as a redirect without deleting locally saved information.
export const Route = createFileRoute("/settings/family")({
  beforeLoad: () => {
    throw redirect({ to: "/settings" });
  },
});

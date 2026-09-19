import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy local-only form is outside the approved participation flow.
// Keep the URL as a redirect so existing bookmarks return to settings.
export const Route = createFileRoute("/settings/add-event")({
  beforeLoad: () => {
    throw redirect({ to: "/settings" });
  },
});

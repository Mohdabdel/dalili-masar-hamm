import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SliceStateProvider } from "@/lab/slice/state";

export const Route = createFileRoute("/lab/slice")({
  component: SliceLayout,
});

function SliceLayout() {
  return (
    <SliceStateProvider>
      <Outlet />
    </SliceStateProvider>
  );
}

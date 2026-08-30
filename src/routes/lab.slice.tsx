import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SliceStateProvider } from "@/lab/slice/state";
import { SpaceBaseProvider } from "@/features/space/store";

export const Route = createFileRoute("/lab/slice")({
  component: SliceLayout,
});

function SliceLayout() {
  return (
    <SliceStateProvider>
      <SpaceBaseProvider value="/lab/slice">
        <Outlet />
      </SpaceBaseProvider>
    </SliceStateProvider>
  );
}

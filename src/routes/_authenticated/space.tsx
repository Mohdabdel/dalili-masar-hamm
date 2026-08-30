import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProductionSpaceProvider } from "@/features/space/production-store";
import { SpaceBaseProvider } from "@/features/space/store";

export const Route = createFileRoute("/_authenticated/space")({
  component: SpaceLayout,
});

function SpaceLayout() {
  return (
    <ProductionSpaceProvider>
      <SpaceBaseProvider value="/space">
        <Outlet />
      </SpaceBaseProvider>
    </ProductionSpaceProvider>
  );
}

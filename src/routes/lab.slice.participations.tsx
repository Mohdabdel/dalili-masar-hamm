// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { AllCardsPage } from "@/features/space/pages/AllCardsPage";

export const Route = createFileRoute("/lab/slice/participations")({
  component: LabWrapper,
  head: labHead("بطاقاتنا", "كل المشاركات التي اعتمدت لها الأسرة بطاقة."),
});

function LabWrapper() {
  return <AllCardsPage />;
}

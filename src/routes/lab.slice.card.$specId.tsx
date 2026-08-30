// غلاف Lab للتجربة نفسها — المكوّن مشترك مع المسار الإنتاجي.
import { createFileRoute, useParams } from "@tanstack/react-router";
import { labHead } from "@/lab/components/lab-ui";
import { CardsPage } from "@/features/space/pages/CardsPage";

export const Route = createFileRoute("/lab/slice/card/$specId")({
  component: LabWrapper,
  head: labHead("بطاقات المشاركة", "كل البطاقات المعتمدة داخل نفس المشاركة الوظيفية."),
});

function LabWrapper() {
  const { specId } = useParams({ from: "/lab/slice/card/$specId" });
  return <CardsPage specId={specId} />;
}

import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabGrid, LabChoiceCard, LabStateBoundary, labHead } from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";

export const Route = createFileRoute("/lab/start")({
  component: LabStart,
  head: labHead("ابدأ من روتينكم", "مدخل تجريبي يبدأ من يوم الأسرة كما هو."),
});

function LabStart() {
  const { state, dispatch } = useLab();
  return (
    <LabPage
      title="ابدأ من روتينكم"
      intro="لا نبدأ بقائمة أنشطة. نبدأ بما يحدث في يومكم أصلاً، ثم نبحث عن مكان مناسب داخله."
    >
      <LabStateBoundary>
        <LabSection title="أين نبدأ؟">
          <LabGrid>
            <LabChoiceCard
              title="داخل البيت"
              hint="محطات اليوم المعتادة"
              selected={state.context === "home"}
              onClick={() => dispatch({ type: "context", value: "home" })}
            />
            <LabChoiceCard
              title="خارج البيت"
              hint="السوق، الزيارات، المشاوير"
              selected={state.context === "community"}
              onClick={() => dispatch({ type: "context", value: "community" })}
            />
          </LabGrid>
        </LabSection>

        <LabSection title="ثم؟">
          <LabGrid>
            <LabChoiceCard title="نبني روتيننا" hint="نرتب محطات اليوم أولاً" to="/lab/routine" />
            <LabChoiceCard title="ابدأوا من شيء يحبه" hint="اهتمام أو فعل موجود فعلاً" to="/lab/weaving" />
          </LabGrid>
        </LabSection>
      </LabStateBoundary>
    </LabPage>
  );
}

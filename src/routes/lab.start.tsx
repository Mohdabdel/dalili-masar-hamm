import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabStateBoundary,
  LabNote,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { contextLabel } from "@/lab/state/actions";

export const Route = createFileRoute("/lab/start")({
  component: LabStart,
  head: labHead("ابدأ من روتينكم", "مدخل تجريبي يبدأ من يوم الأسرة كما هو."),
});

function LabStart() {
  const { state, dispatch } = useLab();
  const navigate = useNavigate();

  return (
    <LabPage
      title="ابدأ من روتينكم"
      intro="لا نبدأ بقائمة أنشطة. نبدأ بما يحدث في يومكم أصلاً، ثم نبحث عن مكان مناسب داخله."
    >
      <LabStateBoundary>
        <LabSection title="أين يحدث هذا عادة؟" description="اختيار واحد فقط، ويمكن تغييره في أي وقت.">
          <LabGrid>
            {(["home", "community"] as const).map((c) => (
              <LabChoiceCard
                key={c}
                title={contextLabel[c]}
                hint={c === "home" ? "محطات اليوم المعتادة داخل المنزل" : "السوق، الزيارات، المشاوير"}
                selected={state.context === c}
                onClick={() => dispatch({ type: "context", value: c })}
              />
            ))}
          </LabGrid>
        </LabSection>

        <LabSection title="كيف تحبون أن نبدأ؟" description="لا يوجد ترتيب صحيح وآخر خاطئ.">
          <LabGrid>
            <LabChoiceCard
              title="محطة واحدة اليوم"
              hint="نختار حدثاً واحداً ونرى ما يمكن مشاركته فيه"
              selected={state.mode === "single"}
              onClick={() => {
                dispatch({ type: "mode", value: "single" });
                void navigate({ to: "/lab/stations" });
              }}
            />
            <LabChoiceCard
              title="نبني روتيننا أولاً"
              hint="نرتب محطات اليوم، ثم نختار محطة مشاركة"
              selected={state.mode === "routine"}
              onClick={() => {
                dispatch({ type: "mode", value: "routine" });
                void navigate({ to: "/lab/routine" });
              }}
            />
          </LabGrid>
        </LabSection>

        <LabSection title="أو ابدأوا من شيء يحبه">
          <LabChoiceCard
            title="شيء يحبه أو يفعله بالفعل"
            hint="نبدأ من اهتمام موجود ونبحث له عن مكان داخل اليوم"
            to="/lab/weaving"
          />
        </LabSection>

        <LabNote>لا حاجة لإعداد مسبق. أي خطوة هنا يمكن تعديلها لاحقاً.</LabNote>
      </LabStateBoundary>
    </LabPage>
  );
}

// أخطط المشاركة بنفسي: الأسرة تعرّف مشاركتها بلا أي مرجع ولا معرّف مكتبة.
// لا يُختلق معرّف KB-*، ولا نص مصدر، ولا مستوى للشخص.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabLinkButton } from "@/lab/components/lab-ui";
import { FamilyParticipationForm } from "@/features/space/components/FamilyParticipationForm";
import { createFamilyAuthoredParticipation } from "@/features/space/entry-create";
import { useSlice, useSpaceBase } from "@/features/space/store";

export function PlanMyselfPage() {
  const base = useSpaceBase();
  const { dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;
  const [error, setError] = useState("");

  return (
    <LabPage
      title="أخطط المشاركة بنفسي"
      intro="صفوا مشاركة من حياتكم كما هي عندكم. لا نحتاج أي مشاركة جاهزة من قوائم دليلي."
    >
      <FamilyParticipationForm
        intro="أسئلة قصيرة عن الموقف نفسه، لا عن الشخص."
        submitLabel="نبدأ مساحة العمل"
        onSubmit={async (answers) => {
          try {
            const specId = await createFamilyAuthoredParticipation({
              answers,
              origin: "family_free",
              dispatch,
            });
            navigate({ to: `${base}/workspace/$specId`, params: { specId } });
          } catch {
            setError("لم نستطع بدء المشاركة الآن. جرّبوا مرة أخرى.");
          }
        }}
      />
      {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      <div className="mt-6">
        <LabLinkButton to="/" variant="ghost">
          رجوع
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

// خططها بنفسك: انتقال مباشر إلى قالب مساحة الأسرة.
// لا أسئلة وسيطة، ولا معرّف KB-*، ولا حقول دلالية مختلقة.

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabLinkButton, LabNote } from "@/lab/components/lab-ui";
import { createBlankFamilyParticipation } from "@/features/space/entry-create";
import { useSlice, useSpaceBase } from "@/features/space/store";

export function PlanMyselfPage() {
  const base = useSpaceBase();
  const { dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;
  const [error, setError] = useState("");
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void createBlankFamilyParticipation({ dispatch })
      .then((specId) => navigate({ to: `${base}/workspace/$specId`, params: { specId }, replace: true }))
      .catch(() => setError("لم نستطع فتح مساحة العمل الآن. جرّبوا مرة أخرى."));
  }, [base, dispatch, navigate]);

  return (
    <LabPage title="خططها بنفسك" intro="جارٍ فتح قالب بناء مشاركة خاصة بأسرتكم.">
      {!error && <LabNote>لا توجد أسئلة قبل مساحة العمل؛ ستكتبون الاسم والخطوات هناك.</LabNote>}
      {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      <div className="mt-6">
        <LabLinkButton to="/" variant="ghost">
          رجوع
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

// خططها بنفسك: انتقال مباشر إلى قالب مساحة الأسرة.
// لا أسئلة وسيطة، ولا معرّف KB-*، ولا حقول دلالية مختلقة.

import { useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabButton, LabLinkButton, LabNote } from "@/lab/components/lab-ui";
import { createBlankFamilyParticipation } from "@/features/space/entry-create";
import { useSlice, useSpaceBase } from "@/features/space/store";

export function PlanMyselfPage() {
  const base = useSpaceBase();
  const { dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;
  const [error, setError] = useState("");
  const started = useRef(false);
  const [busy, setBusy] = useState(false);

  const start = async () => {
    if (started.current) return;
    started.current = true;
    setBusy(true);
    try {
      const specId = await createBlankFamilyParticipation({ dispatch });
      await navigate({ to: `${base}/workspace/$specId`, params: { specId }, replace: true });
    } catch {
      started.current = false;
      setBusy(false);
      setError("لم نستطع فتح مساحة العمل الآن. جرّبوا مرة أخرى.");
    }
  };

  return (
    <LabPage title="خططها بنفسك" intro="اكتبوا اسم المشاركة وخطواتها في مساحة العمل.">
      <LabNote>لن تُنشأ مسودة حتى تختاروا بدء المشاركة.</LabNote>
      {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <LabButton onClick={start} disabled={busy}>{busy ? "جارٍ الفتح…" : "ابدأوا تخطيط المشاركة"}</LabButton>
        <LabLinkButton to="/" variant="ghost">
          الصفحة الرئيسية
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

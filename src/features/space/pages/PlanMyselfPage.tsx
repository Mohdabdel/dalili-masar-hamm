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
  const [title, setTitle] = useState("");
  const [firstStep, setFirstStep] = useState("");
  const ready = title.trim().length > 0 && firstStep.trim().length > 0;

  const start = async () => {
    if (started.current || !ready) return;
    started.current = true;
    setBusy(true);
    try {
      const specId = await createBlankFamilyParticipation({ dispatch, title, firstStep });
      await navigate({ to: `${base}/workspace/$specId`, params: { specId }, replace: true });
    } catch {
      started.current = false;
      setBusy(false);
      setError("لم نستطع فتح مساحة العمل الآن. جرّبوا مرة أخرى.");
    }
  };

  return (
    <LabPage title="خططها بنفسك" intro="اكتبوا اسم المشاركة وخطواتها في مساحة العمل.">
      <div className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-sm font-bold">اسم المشاركة</span>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: غسيل السيارة"
            className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-bold">أول خطوة</span>
          <input type="text" value={firstStep} onChange={(e) => setFirstStep(e.target.value)}
            placeholder="مثال: يحضر الدلو"
            className="min-h-11 w-full rounded-xl border border-border bg-card px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        </label>
      </div>
      <LabNote>لن تُنشأ مسودة حتى تكتبوا الاسم وخطوة واحدة على الأقل ثم تختاروا البدء.</LabNote>
      {error && <p className="mt-3 text-sm font-bold text-destructive">{error}</p>}
      <div className="mt-6 flex flex-wrap gap-3">
        <LabButton onClick={start} disabled={busy || !ready}>{busy ? "جارٍ الفتح…" : "ابدأوا تخطيط المشاركة"}</LabButton>
        <LabLinkButton to="/" variant="ghost">
          الصفحة الرئيسية
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

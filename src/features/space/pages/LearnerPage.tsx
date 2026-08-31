// بطاقة المشارك — وضع التركيز.
// المصدر الوحيد: النسخة المعتمدة المجمّدة (Frozen Snapshot).
// خطوة واحدة في كل شاشة، بلا أي بيانات إدارة أسرية، وتنتهي بـ«انتهينا».

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import { LabPage, LabLinkButton } from "@/lab/components/lab-ui";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";

const DONE_STEP_ID = "__done__";

export function LearnerPage({ snapshotId }: { snapshotId: string }) {
  const base = useSpaceBase();
  const { snapshotById } = useSliceHelpers();
  const { dispatch } = useSlice();
  const snap = snapshotById(snapshotId);
  const [i, setI] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  useEffect(() => {
    if (snap) dispatch({ type: "run", snapshotId });
    // تسجيل مرة واحدة لكل فتح تنفيذ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotId]);

  // الإطارات كما جُمّدت وقت الاعتماد — بلا أي إعادة تركيب من المسودة.
  const frames = useMemo(
    () => (snap ? [...snap.frames].sort((a, b) => a.order - b.order) : []),
    [snap],
  );

  if (!snap) {
    return (
      <LabPage title="لا توجد بطاقة" intro="لم تُعتمد بطاقة بهذا الرقم.">
        <LabLinkButton to={`${base}`}>رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const frame = frames[i];
  const isDone = !frame || frame.sourceStepId === DONE_STEP_ID;
  const stepFrames = frames.filter((f) => f.sourceStepId !== DONE_STEP_ID);
  const showImage = frame ? (frame.imageVisible ?? Boolean(frame.assetRef)) : false;
  const showText = frame ? (frame.textVisible ?? Boolean(frame.text_short_ar)) : false;
  const text = frame?.text_short_ar || frame?.familyText_ar || "";
  const textFirst = frame?.blockOrder === "text-visual";

  const TextBlock = showText && text ? (
    <p className="text-4xl font-extrabold leading-tight text-foreground">{text}</p>
  ) : null;

  const ImageBlock = showImage ? (
    <div className="w-full max-w-sm">
      <StepFrame asset={frame?.assetRef ?? null} label={text} size="lg" />
    </div>
  ) : null;

  return (
    <div className="mx-auto flex min-h-[85dvh] w-full max-w-xl flex-col justify-between px-4 py-6">
      <div className="mb-4 text-center text-base font-bold text-muted-foreground" aria-live="polite">
        {isDone ? "النهاية" : `${i + 1} / ${stepFrames.length}`}
      </div>

      {isDone ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <CheckCircle2 className="h-20 w-20 text-primary" aria-hidden />
          <p className="text-5xl font-extrabold text-foreground">انتهينا</p>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          {textFirst ? (
            <>
              {TextBlock}
              {ImageBlock}
            </>
          ) : (
            <>
              {ImageBlock}
              {TextBlock}
            </>
          )}
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card text-xl font-bold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
          السابق
        </button>
        {isDone ? (
          <button
            type="button"
            onClick={() =>
              navigate({ to: `${base}/feedback/$snapshotId`, params: { snapshotId } })
            }
            className="inline-flex min-h-[64px] flex-1 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            انتهينا
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))}
            className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-bold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            التالي
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

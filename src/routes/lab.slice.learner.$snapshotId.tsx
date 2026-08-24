import { useState } from "react";
import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import { LabPage, LabLinkButton, labHead } from "@/lab/components/lab-ui";
import { useSliceHelpers } from "@/lab/slice/state";

export const Route = createFileRoute("/lab/slice/learner/$snapshotId")({
  component: SliceLearnerCard,
  head: labHead("بطاقة المشارك", "صورة واحدة وكلمات قليلة في كل شاشة."),
});

function SliceLearnerCard() {
  const { snapshotId } = useParams({ from: "/lab/slice/learner/$snapshotId" });
  const { snapshotById } = useSliceHelpers();
  const snap = snapshotById(snapshotId);
  const [i, setI] = useState(0);
  const navigate = useNavigate();

  if (!snap) {
    return (
      <LabPage title="لا توجد بطاقة" intro="لم تُعتمد بطاقة بهذا الرقم في هذه الجلسة.">
        <LabLinkButton to="/lab/slice">رجوع</LabLinkButton>
      </LabPage>
    );
  }

  const frames = [...snap.frames].sort((a, b) => a.order - b.order);
  const frame = frames[i];
  const isLast = i === frames.length - 1;

  return (
    <div className="mx-auto flex min-h-[80vh] w-full max-w-xl flex-col justify-between px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span>
          {i + 1} / {frames.length}
        </span>
        <span>{snap.title_ar}</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="w-full max-w-sm">
          <StepFrame asset={frame.assetRef} label={frame.text_short_ar} size="lg" />
        </div>
        <p className="text-4xl font-extrabold leading-tight text-foreground">
          {frame.text_short_ar}
        </p>
        {frame.executionOptionLabel_ar && (
          <p className="text-xl font-bold text-muted-foreground">{frame.executionOptionLabel_ar}</p>
        )}
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setI((v) => Math.max(0, v - 1))}
          disabled={i === 0}
          className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card text-xl font-bold disabled:opacity-40"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
          السابق
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/lab/slice/feedback/$snapshotId", params: { snapshotId } })
            }
            className="inline-flex min-h-[64px] flex-1 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground"
          >
            انتهينا
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setI((v) => Math.min(frames.length - 1, v + 1))}
            className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl bg-primary text-xl font-bold text-primary-foreground"
          >
            التالي
            <ChevronLeft className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

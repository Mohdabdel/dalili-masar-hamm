import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, ChevronLeft, LifeBuoy } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import { LabPage, LabLinkButton } from "@/lab/components/lab-ui";
import { SPACE_SUPPORT_TOOLS } from "@/lab/data/space/catalog";
import { useSlice, useSliceHelpers, useSpaceBase } from "@/features/space/store";


export function LearnerPage({ snapshotId }: { snapshotId: string }) {
  const base = useSpaceBase();
  const { snapshotById } = useSliceHelpers();
  const { dispatch } = useSlice();
  const snap = snapshotById(snapshotId);
  const [i, setI] = useState(0);
  const [showSupport, setShowSupport] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  useEffect(() => {
    if (snap) dispatch({ type: "run", snapshotId });
    // تسجيل مرة واحدة لكل فتح تنفيذ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshotId]);

  if (!snap) {
    return (
      <LabPage title="لا توجد بطاقة" intro="لم تُعتمد بطاقة بهذا الرقم في هذه الجلسة.">
        <LabLinkButton to={`${base}`}>رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  const frames = [...snap.frames].sort((a, b) => a.order - b.order);
  const frame = frames[i];
  const isLast = i === frames.length - 1;
  const tools = snap.supportTools
    .map((id) => SPACE_SUPPORT_TOOLS.find((t) => t.id === id)?.label)
    .filter(Boolean);

  return (
    <div className="mx-auto flex min-h-[80dvh] w-full max-w-xl flex-col justify-between px-4 py-6">
      <div className="mb-4 flex items-center justify-between text-sm font-semibold text-muted-foreground">
        <span aria-live="polite">
          {i + 1} / {frames.length}
        </span>
        {tools.length > 0 && (
          <button
            type="button"
            aria-expanded={showSupport}
            onClick={() => setShowSupport((v) => !v)}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LifeBuoy className="h-4 w-4" aria-hidden />
            مساعدة
          </button>
        )}
      </div>

      {showSupport && tools.length > 0 && (
        <p className="mb-4 rounded-xl border border-border bg-muted/40 p-3 text-center text-base">
          {tools.join(" — ")}
        </p>
      )}

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
          className="inline-flex min-h-[64px] flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-card text-xl font-bold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-6 w-6" aria-hidden />
          السابق
        </button>
        {isLast ? (
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

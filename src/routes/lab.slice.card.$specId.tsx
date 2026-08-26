import { createFileRoute, useParams } from "@tanstack/react-router";
import { Lock, Unlock } from "lucide-react";
import {
  LabPage,
  LabSection,
  LabNote,
  LabButton,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { StepFrame } from "@/lab/components/StepFrame";
import { getSpaceSpec, SPACE_SUPPORT_TOOLS } from "@/lab/data/space/catalog";
import { useSlice, useSliceHelpers } from "@/lab/slice/state";

export const Route = createFileRoute("/lab/slice/card/$specId")({
  component: SliceCardBlock,
  head: labHead("بطاقات المشاركة", "كل البطاقات المعتمدة داخل نفس المشاركة الوظيفية."),
});

function SliceCardBlock() {
  const { specId } = useParams({ from: "/lab/slice/card/$specId" });
  const spec = getSpaceSpec(specId);
  const { state, dispatch } = useSlice();
  const { snapshotsFor } = useSliceHelpers();
  const snapshots = [...snapshotsFor(specId)].sort((a, b) => b.version - a.version);

  if (!spec) {
    return (
      <LabPage title="هذه المشاركة غير متاحة">
        <LabLinkButton to="/lab/slice">رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  return (
    <LabPage
      title={spec.title_ar}
      intro={`${spec.eventTitle_ar} — كل البطاقات هنا تنتمي إلى هذه المشاركة، حتى لو غطّت أجزاء مختلفة منها.`}
    >
      {snapshots.length === 0 ? (
        <LabNote>لا توجد بطاقة معتمدة بعد لهذه المشاركة.</LabNote>
      ) : (
        <LabSection title={`بطاقات معتمدة (${snapshots.length})`}>
          <ul className="space-y-4">
            {snapshots.map((snap) => {
              const closed = state.closedCards.includes(snap.id);
              const tools = snap.supportTools
                .map((id) => SPACE_SUPPORT_TOOLS.find((t) => t.id === id)?.label)
                .filter(Boolean);
              return (
                <li key={snap.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold">{snap.title_ar}</h3>
                      <p className="text-sm text-muted-foreground">
                        نسخة {snap.version} — {snap.date ?? snap.createdAt} —{" "}
                        {snap.frames.length - 1} خطوة
                      </p>
                    </div>
                    {closed && (
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        بطاقة مغلقة
                      </span>
                    )}
                  </div>

                  <ol className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {snap.frames.map((f) => (
                      <li key={`${snap.id}-${f.order}`}>
                        <StepFrame asset={f.assetRef} label={f.text_short_ar} size="md" />
                        <p className="mt-1 text-center text-sm font-semibold leading-snug">
                          {f.text_short_ar}
                        </p>
                      </li>
                    ))}
                  </ol>

                  {tools.length > 0 && (
                    <p className="mb-3 text-sm text-muted-foreground">
                      ما قد يساعد: {tools.join("، ")} — خارج بطاقة المشارك.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <LabLinkButton
                      to="/lab/slice/learner/$snapshotId"
                      params={{ snapshotId: snap.id }}
                    >
                      بطاقة المشارك
                    </LabLinkButton>
                    <LabButton
                      variant="ghost"
                      onClick={() =>
                        dispatch(
                          closed
                            ? { type: "card.reopen", snapshotId: snap.id }
                            : { type: "card.close", snapshotId: snap.id },
                        )
                      }
                    >
                      {closed ? (
                        <>
                          <Unlock className="h-4 w-4" aria-hidden />
                          إعادة فتح البطاقة
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4" aria-hidden />
                          إغلاق البطاقة
                        </>
                      )}
                    </LabButton>
                  </div>
                </li>
              );
            })}
          </ul>
        </LabSection>
      )}

      <div className="flex flex-wrap gap-3">
        <LabLinkButton to="/lab/slice/workspace/$specId" params={{ specId }} variant="ghost">
          بطاقة جديدة لجزء آخر من نفس المشاركة
        </LabLinkButton>
        <LabLinkButton to="/lab/slice/participations" variant="ghost">
          كل بطاقاتنا
        </LabLinkButton>
      </div>

      <div className="mt-6">
        <LabNote>
          إغلاق بطاقة يخصّ هذه البطاقة فقط، ولا يعني أن المشاركة كلها انتهت.
        </LabNote>
      </div>
    </LabPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import { getSpec, stepsWithoutAsset } from "@/lab/data/slice";
import { useSliceHelpers } from "@/lab/slice/state";
import type { SliceLifecycleChoice } from "@/lab/slice/types";

export const Route = createFileRoute("/lab/slice/participations")({
  component: SliceParticipationsBoard,
  head: labHead("مشاركاتنا", "ما اعتمدناه، وكيف سارت الأيام."),
});

const LIFECYCLE_LABEL: Record<SliceLifecycleChoice, string> = {
  repeat: "نكررها كما هي",
  adjust: "قيد التعديل",
  expand: "نوسّعها",
  make_routine: "صارت جزءاً من الروتين",
  not_now: "متروكة الآن",
};

const TONE_LABEL = {
  comfortable: "مريحة",
  usual: "كالمعتاد",
  difficult_today: "صعبة ذلك اليوم",
} as const;

function SliceParticipationsBoard() {
  const { state } = useSliceHelpers();
  const bySpec = new Map<string, typeof state.snapshots>();
  for (const s of state.snapshots) {
    bySpec.set(s.participationSpecId, [...(bySpec.get(s.participationSpecId) ?? []), s]);
  }
  const missing = stepsWithoutAsset();

  return (
    <LabPage
      title="مشاركاتنا"
      intro="كل بطاقة معتمدة تبقى كما هي، والنسخ الجديدة تُضاف بجانبها."
      footer={<LabLinkButton to="/lab/slice">ابدأوا مشاركة جديدة</LabLinkButton>}
    >
      {bySpec.size === 0 ? (
        <LabNote>لم تعتمدوا أي بطاقة في هذه الجلسة بعد.</LabNote>
      ) : (
        [...bySpec.entries()].map(([specId, snaps]) => {
          const spec = getSpec(specId);
          const latest = [...snaps].sort((a, b) => b.version - a.version)[0];
          const notes = state.feedback.filter((f) => snaps.some((s) => s.id === f.snapshotId));
          const lc = state.lifecycleBySpec[specId];
          return (
            <LabSection key={specId} title={spec?.title_ar ?? specId}>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">
                  النسخة الحالية: {latest.version} · {latest.frames.length} شاشة
                  {lc ? ` · ${LIFECYCLE_LABEL[lc]}` : ""}
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  {notes.slice(0, 3).map((n, i) => (
                    <li key={i}>
                      {n.date}: {TONE_LABEL[n.tone]}
                      {n.reasons.length > 0 ? ` — ${n.reasons.join("، ")}` : ""}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-2">
                  <LabLinkButton
                    to="/lab/slice/learner/$snapshotId"
                    params={{ snapshotId: latest.id }}
                  >
                    فتح بطاقة المشارك
                  </LabLinkButton>
                  <LabLinkButton
                    to="/lab/slice/workspace/$specId"
                    params={{ specId }}
                    variant="ghost"
                  >
                    مساحة العمل
                  </LabLinkButton>
                </div>
              </div>
            </LabSection>
          );
        })
      )}

      <LabSection title="خطوات بلا صورة مطابقة" description="داخل النموذج فقط — للمتابعة.">
        <LabNote>
          {missing.length} خطوة تظهر حالياً بإطار بديل، ولا تُعرض لها صورة غير مطابقة.
        </LabNote>
      </LabSection>
    </LabPage>
  );
}

import { useState } from "react";
import { createFileRoute, useParams } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabNote,
  LabLinkButton,
  labHead,
} from "@/lab/components/lab-ui";
import {
  getSliceEvent,
  levelLabel,
  phaseLabelSlice,
  phasesForEvent,
  specsFor,
} from "@/lab/data/slice";
import { useSlice } from "@/lab/slice/state";
import type { SlicePhase } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/lab/slice/$eventId/participations")({
  component: SliceParticipations,
  head: labHead("مشاركات هذا الحدث", "أماكن حقيقية داخل الحدث يمكن أن تكون له."),
});

function SliceParticipations() {
  const { eventId } = useParams({ from: "/lab/slice/$eventId/participations" });
  const event = getSliceEvent(eventId);
  const { state } = useSlice();
  const level = state.levelByEvent[eventId] ?? "simple";
  const phases = phasesForEvent(eventId);
  const [phase, setPhase] = useState<SlicePhase | undefined>(phases[0]);

  if (!event) {
    return (
      <LabPage title="حدث غير موجود" intro="هذا الحدث ليس ضمن نموذج التجربة.">
        <LabLinkButton to="/lab/slice">رجوع إلى الأحداث</LabLinkButton>
      </LabPage>
    );
  }

  const specs = specsFor(eventId, level, event.hasPhases ? phase : undefined);

  return (
    <LabPage
      title={event.title_ar}
      intro={`مساحة المشاركة الحالية: ${levelLabel[level]}. اختاروا مكاناً واحداً داخل الحدث لنضبطه معاً.`}
      footer={
        <LabLinkButton to="/lab/slice/$eventId/level" params={{ eventId }} variant="ghost">
          تغيير مساحة المشاركة
        </LabLinkButton>
      }
    >
      {event.hasPhases && (
        <div className="mb-5 flex flex-wrap gap-2" role="tablist" aria-label="مراحل الحدث">
          {phases.map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={phase === p}
              onClick={() => setPhase(p)}
              className={cn(
                "min-h-[44px] rounded-xl border px-4 text-base font-bold",
                phase === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground",
              )}
            >
              {phaseLabelSlice[p]}
            </button>
          ))}
        </div>
      )}

      <LabSection title="المشاركات المتاحة">
        {specs.length === 0 ? (
          <LabNote>لا يوجد محتوى لهذه المساحة في النموذج التجريبي بعد.</LabNote>
        ) : (
          <LabGrid>
            {specs.map((s) => (
              <LabChoiceCard
                key={s.id}
                title={s.title_ar}
                hint={`${s.majorSteps.length} أجزاء رئيسية`}
                to="/lab/slice/workspace/$specId"
                params={{ specId: s.id }}
              />
            ))}
          </LabGrid>
        )}
      </LabSection>
    </LabPage>
  );
}

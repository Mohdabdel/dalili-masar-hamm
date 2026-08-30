import { useNavigate } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabLinkButton } from "@/lab/components/lab-ui";
import {
  getSpaceEvent,
  levelCounts,
  spaceLevelHint,
  spaceLevelLabel,
} from "@/lab/data/space/catalog";
import { useSlice, useSpaceBase } from "@/features/space/store";
import type { SliceLevel } from "@/lab/slice/types";
import { cn } from "@/lib/utils";


const LEVELS: SliceLevel[] = ["simple", "moderate", "advanced"];

export function LevelPage({ eventId }: { eventId: string }) {
  const base = useSpaceBase();
  const event = getSpaceEvent(eventId);
  const { state, dispatch } = useSlice();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigate = useNavigate() as any;

  if (!event) {
    return (
      <LabPage title="هذا الحدث غير متاح" intro="ربما تغيّر الرابط أو حُذف الحدث.">
        <LabLinkButton to={`${base}`}>رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  const counts = levelCounts(eventId);
  const current = state.levelByEvent[eventId];

  return (
    <LabPage
      title={event.title}
      intro="ما مستوى المشاركة الذي يناسب ما تريدون القيام به هذه المرة؟"
    >
      <LabSection title="اختاروا المستوى">
        <div role="group" aria-label="مستوى المشاركة" className="grid grid-cols-3 gap-2 sm:gap-3">
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              aria-pressed={current === lv}
              disabled={counts[lv] === 0}
              onClick={() => {
                dispatch({ type: "level", eventId, value: lv });
                navigate({ to: `${base}/$eventId/participations`, params: { eventId } });
              }}
              className={cn(
                "flex min-h-[104px] flex-col items-center justify-center gap-1 rounded-2xl border p-3 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40",
                current === lv
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/60",
              )}
            >
              <span className="text-lg font-extrabold sm:text-xl">{spaceLevelLabel[lv]}</span>
              <span
                className={cn(
                  "text-[11px] leading-snug sm:text-xs",
                  current === lv ? "text-primary-foreground/80" : "text-muted-foreground",
                )}
              >
                {counts[lv] > 0 ? `${counts[lv]} مشاركة` : "لا يوجد الآن"}
              </span>
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
          {LEVELS.map((lv) => (
            <li key={lv}>
              <span className="font-bold text-foreground">{spaceLevelLabel[lv]}:</span>{" "}
              {spaceLevelHint[lv]}
            </li>
          ))}
        </ul>
      </LabSection>

      <LabNote>لا ترتيب إلزامياً بين المستويات، ولا انتقال تلقائي بينها.</LabNote>
    </LabPage>
  );
}

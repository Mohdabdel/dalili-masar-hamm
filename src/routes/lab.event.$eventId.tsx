import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabStateBoundary,
  LabNote,
  labHead,
} from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import {
  getStation,
  getPhaseCounts,
  getEventComponents,
  getMatches,
  phaseLabel,
  phaseHint,
  participationLevelLabel,
  participationLevelDescription,
} from "@/lab/data/knowledge-read";
import { safeText } from "@/lab/data/lexicon";
import type { LabLevel, LabPhase } from "@/lab/state/types";

export const Route = createFileRoute("/lab/event/$eventId")({
  component: LabEvent,
  head: labHead("تفكيك الحدث", "قبل، أثناء، وبعد الحدث — ثم مكوّن واحد ودور صغير داخله."),
});

const PHASES: LabPhase[] = ["before", "during", "after"];
const LEVELS: LabLevel[] = ["simple", "moderate", "advanced"];

function LabEvent() {
  const { eventId } = Route.useParams();
  const { state, dispatch } = useLab();
  const station = useMemo(() => getStation(eventId), [eventId]);
  const counts = useMemo(() => getPhaseCounts(eventId), [eventId]);
  const phase = state.path.phase;
  const componentId = state.path.componentId;
  const level = state.path.level;

  const components = useMemo(
    () => (phase ? getEventComponents(eventId, phase) : []),
    [eventId, phase],
  );
  const matches = useMemo(
    () => (componentId ? getMatches({ eventId, componentId, phase, level }) : []),
    [eventId, componentId, phase, level],
  );

  if (!station) {
    return (
      <LabPage title="لم نجد هذا الحدث">
        <LabNote>ربما تغيّر الحدث في المستودع. عودوا إلى محطات اليوم.</LabNote>
      </LabPage>
    );
  }

  return (
    <LabPage title={station.title} intro={`${station.domainName} — نبحث عن مكان صغير داخل هذا الحدث.`}>
      <LabStateBoundary>
        <LabSection title="أي جزء من الحدث؟" description="الحدث ليس كتلة واحدة؛ له قبل وأثناء وبعد.">
          <LabGrid>
            {PHASES.map((p) => (
              <LabChoiceCard
                key={p}
                title={phaseLabel[p]}
                hint={phaseHint[p]}
                meta={`${counts[p]} موضع مشاركة`}
                selected={phase === p}
                onClick={() => dispatch({ type: "path", value: { phase: p, componentId: undefined } })}
              />
            ))}
          </LabGrid>
        </LabSection>

        {phase && (
          <LabSection title="ما الذي يحدث في هذا الجزء؟">
            {components.length === 0 ? (
              <LabNote>لا توجد مواضع مسجّلة في هذا الجزء لهذا الحدث.</LabNote>
            ) : (
              <LabGrid>
                {components.map((c) => (
                  <LabChoiceCard
                    key={c.id}
                    title={safeText(c.label)}
                    meta={`${c.opportunityIds.length} مشاركة ممكنة`}
                    selected={componentId === c.id}
                    onClick={() => dispatch({ type: "path", value: { componentId: c.id } })}
                  />
                ))}
              </LabGrid>
            )}
          </LabSection>
        )}

        {componentId && (
          <LabSection title="كم يكون الدور اليوم؟" description="اختياري — يمكن عرض كل المشاركات.">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={!level}
                onClick={() => dispatch({ type: "path", value: { level: undefined } })}
                className={`min-h-[44px] rounded-xl border px-4 text-sm font-bold ${
                  !level ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
                }`}
              >
                الكل
              </button>
              {LEVELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={level === l}
                  title={participationLevelDescription(l)}
                  onClick={() => dispatch({ type: "path", value: { level: l } })}
                  className={`min-h-[44px] rounded-xl border px-4 text-sm font-bold ${
                    level === l
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card"
                  }`}
                >
                  {participationLevelLabel(l)}
                </button>
              ))}
            </div>
          </LabSection>
        )}

        {componentId && (
          <LabSection title="مشاركات ممكنة هنا">
            {matches.length === 0 ? (
              <LabNote>لا توجد مشاركة مطابقة بهذا الدور. جرّبوا «الكل».</LabNote>
            ) : (
              <div className="space-y-3">
                {matches.map((m) => (
                  <LabChoiceCard
                    key={m.opportunityId}
                    title={safeText(m.name)}
                    hint={m.whyParticipate ? safeText(m.whyParticipate).slice(0, 110) : undefined}
                    meta={m.level ? participationLevelLabel(m.level) : undefined}
                    to="/lab/match/$opportunityId"
                    params={{ opportunityId: m.opportunityId }}
                  />
                ))}
              </div>
            )}
          </LabSection>
        )}
      </LabStateBoundary>
    </LabPage>
  );
}

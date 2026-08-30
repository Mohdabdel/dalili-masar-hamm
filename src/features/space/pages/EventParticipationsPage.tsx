import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabNote,
  LabLinkButton,
} from "@/lab/components/lab-ui";
import {
  getSpaceEvent,
  participationsForLevel,
  spaceLevelLabel,
} from "@/lab/data/space/catalog";
import { useSlice, useSpaceBase } from "@/features/space/store";


export function EventParticipationsPage({ eventId }: { eventId: string }) {
  const base = useSpaceBase();
  const event = getSpaceEvent(eventId);
  const { state } = useSlice();
  const level = state.levelByEvent[eventId];

  if (!event) {
    return (
      <LabPage title="هذا الحدث غير متاح">
        <LabLinkButton to={`${base}`}>رجوع إلى المحطات</LabLinkButton>
      </LabPage>
    );
  }

  if (!level) {
    return (
      <LabPage title={event.title} intro="اختاروا مستوى المشاركة أولاً.">
        <LabLinkButton to={`${base}/$eventId/level`} params={{ eventId }}>
          اختيار المستوى
        </LabLinkButton>
      </LabPage>
    );
  }

  const specs = participationsForLevel(eventId, level);

  return (
    <LabPage
      title={`${event.title} — مستوى ${spaceLevelLabel[level]}`}
      intro="اختاروا المشاركة التي تريدون العمل عليها هذه المرة."
    >
      <LabSection title={`مشاركات متاحة (${specs.length})`}>
        {specs.length === 0 ? (
          <LabNote>لا توجد مشاركات بهذا المستوى في هذا الحدث. جرّبوا مستوى آخر.</LabNote>
        ) : (
          <LabGrid>
            {specs.map((s) => (
              <LabChoiceCard
                key={s.id}
                title={s.title_ar}
                hint={`${s.majorSteps.length} خطوة في المسار الكامل`}
                to={`${base}/workspace/$specId`}
                params={{ specId: s.id }}
              />
            ))}
          </LabGrid>
        )}
      </LabSection>

      <div className="flex flex-wrap gap-3">
        <LabLinkButton to={`${base}/$eventId/level`} params={{ eventId }} variant="ghost">
          تغيير المستوى
        </LabLinkButton>
        <LabLinkButton to={`${base}`} variant="ghost">
          المحطات
        </LabLinkButton>
      </div>
    </LabPage>
  );
}

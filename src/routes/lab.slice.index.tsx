import { createFileRoute } from "@tanstack/react-router";
import {
  LabPage,
  LabSection,
  LabGrid,
  LabChoiceCard,
  LabNote,
  labHead,
} from "@/lab/components/lab-ui";
import { SLICE_EVENTS } from "@/lab/data/slice";

export const Route = createFileRoute("/lab/slice/")({
  component: SliceStart,
  head: labHead("نموذج المشاركة", "ابدأوا من حدث في يومكم، واضبطوا مشاركة هذه المرة."),
});

function SliceStart() {
  return (
    <LabPage
      title="ابدأوا من حدث في يومكم"
      intro="اختاروا حدثاً يحدث عندكم فعلاً، ثم نرى معاً أين يمكن أن يكون له مكان حقيقي داخله."
    >
      <LabSection title="أحداث هذا النموذج" description="ثلاثة أحداث فقط في هذه التجربة.">
        <LabGrid>
          {SLICE_EVENTS.map((e) => (
            <LabChoiceCard
              key={e.id}
              title={e.title_ar}
              hint={e.hint_ar}
              meta={e.context === "home" ? "داخل البيت" : "يمتد خارج البيت"}
              to="/lab/slice/$eventId/level"
              params={{ eventId: e.id }}
            />
          ))}
        </LabGrid>
      </LabSection>

      <LabNote>
        كل ما في هذه المساحة تجريبي ومؤقت، ولا يؤثر على النسخة الحالية من دليلي.
      </LabNote>
    </LabPage>
  );
}

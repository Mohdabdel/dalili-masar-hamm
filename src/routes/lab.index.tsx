import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabGrid, LabChoiceCard, LabNote, labHead } from "@/lab/components/lab-ui";

export const Route = createFileRoute("/lab/")({
  component: LabIndex,
  head: labHead("المختبر", "مساحة تجريبية لتصوّر مستقبلي لتجربة دليلي، بمعزل عن النسخة الحالية."),
});

function LabIndex() {
  return (
    <LabPage
      title="دليلي Lab"
      intro="مساحة تجربة موازية للتصوّر المستقبلي. لا تؤثر على النسخة الحالية، وكل ما فيها بيانات تجريبية مؤقتة."
    >
      <LabSection
        title="ابدأوا من هنا"
        description="المدخل الأساسي هو يومكم كما هو، لا قائمة أنشطة."
      >
        <LabGrid>
          <LabChoiceCard title="ابدأ من روتينكم" hint="ما الذي يحدث في يومكم عادة؟" to="/lab/start" />
          <LabChoiceCard title="محطات اليوم" hint="اختيار محطة واحدة الآن" to="/lab/stations" />
          <LabChoiceCard title="روتيننا" hint="محطات اليوم كما رتبتموها" to="/lab/routine" />
          <LabChoiceCard title="مشاركاتنا" hint="ما نكرره وما صار معتاداً" to="/lab/participations" />
          <LabChoiceCard title="شيء يحبه" hint="ابدأوا من اهتمام موجود فعلاً" to="/lab/weaving" />
          <LabChoiceCard title="الوسائل البصرية" hint="جدول وتسلسل مولّد من يومكم" to="/lab/visual" />
          <LabChoiceCard title="خارج البيت" hint="مشاركات في المحيط المجتمعي" to="/lab/community" />
          <LabChoiceCard title="اقتراحات" hint="أفكار تختارون منها أو تتجاوزونها" to="/lab/ai" />
          <LabChoiceCard title="حالات الواجهة" hint="فارغة · تحميل · خطأ" to="/lab/states" />
        </LabGrid>
      </LabSection>

      <LabNote>
        المبدأ الحاكم: لا نبحث عن شيء يفعله الشخص أثناء الحياة، بل عن مكان حقيقي له داخل الحياة.
      </LabNote>
    </LabPage>
  );
}

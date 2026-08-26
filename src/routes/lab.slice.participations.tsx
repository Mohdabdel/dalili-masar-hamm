import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, LabLinkButton, labHead } from "@/lab/components/lab-ui";
import { getSpaceSpec } from "@/lab/data/space/catalog";
import { useSlice } from "@/lab/slice/state";

export const Route = createFileRoute("/lab/slice/participations")({
  component: SliceAllCards,
  head: labHead("بطاقاتنا", "كل المشاركات التي اعتمدت لها الأسرة بطاقة."),
});

function SliceAllCards() {
  const { state } = useSlice();

  const specIds = [...new Set(state.snapshots.map((s) => s.participationSpecId))];

  return (
    <LabPage title="بطاقاتنا" intro="كل بطاقة تبقى تابعة للمشاركة الوظيفية التي خرجت منها.">
      {specIds.length === 0 ? (
        <LabNote>لم تُعتمد بطاقات بعد. ابدأوا من المحطات.</LabNote>
      ) : (
        <LabSection title={`مشاركات لها بطاقات (${specIds.length})`}>
          <ul className="space-y-3">
            {specIds.map((specId) => {
              const spec = getSpaceSpec(specId);
              const cards = state.snapshots.filter((s) => s.participationSpecId === specId);
              const open = cards.filter((c) => !state.closedCards.includes(c.id)).length;
              const title = spec?.title_ar ?? cards[0]?.participationTitle_ar ?? "مشاركة";
              const eventTitle = spec?.eventTitle_ar ?? cards[0]?.eventTitle_ar ?? "";
              return (
                <li
                  key={specId}
                  className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {eventTitle} — {cards.length} بطاقة، منها {open} مفتوحة
                    </p>
                  </div>
                  <LabLinkButton to="/lab/slice/card/$specId" params={{ specId }} variant="ghost">
                    فتح البطاقات
                  </LabLinkButton>
                </li>
              );
            })}
          </ul>
        </LabSection>
      )}

      <LabLinkButton to="/lab/slice">المحطات</LabLinkButton>
    </LabPage>
  );
}

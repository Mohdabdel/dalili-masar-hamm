import { createFileRoute } from "@tanstack/react-router";
import { LabPage, LabSection, LabNote, labHead } from "@/lab/components/lab-ui";
import { useLab } from "@/lab/state/lab-state";
import { UI_STATES } from "@/lab/state/scenarios";
import { AlertCircle, Inbox } from "lucide-react";

export const Route = createFileRoute("/lab/states")({
  component: LabStates,
  head: labHead("حالات الواجهة", "معاينة حالات فارغة وتحميل وخطأ داخل النموذج التجريبي."),
});

function LabStates() {
  const { state, dispatch } = useLab();
  return (
    <LabPage title="حالات الواجهة" intro="معاينة موحّدة للحالات الفارغة والتحميل والخطأ كما تظهر في كل شاشات النموذج.">
      <LabSection title="التبديل السريع">
        <div className="flex flex-wrap gap-2">
          {UI_STATES.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => dispatch({ type: "uiState", value: u.id })}
              aria-pressed={state.uiState === u.id}
              className={`min-h-[44px] rounded-xl border px-4 text-sm font-bold ${
                state.uiState === u.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      </LabSection>

      <LabSection title="فارغة">
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
          <Inbox className="mx-auto mb-2 h-7 w-7 text-muted-foreground" aria-hidden />
          <h3 className="text-lg font-bold">لا يوجد شيء هنا بعد</h3>
          <p className="mt-1 text-sm text-muted-foreground">ابدأوا بخطوة واحدة صغيرة، ويمكن العودة في أي وقت.</p>
        </div>
      </LabSection>

      <LabSection title="تحميل">
        <div className="space-y-3" role="status" aria-live="polite">
          <span className="sr-only">جارٍ التحميل</span>
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      </LabSection>

      <LabSection title="خطأ">
        <div role="alert" className="rounded-2xl border border-destructive/40 bg-destructive/5 p-5">
          <AlertCircle className="mb-2 h-6 w-6 text-destructive" aria-hidden />
          <h3 className="text-lg font-bold">تعذّر عرض هذا الجزء الآن</h3>
          <p className="mt-1 text-sm text-muted-foreground">جرّبوا مرة أخرى، أو عودوا لاحقاً.</p>
        </div>
      </LabSection>

      <LabNote>الحالة المختارة هنا تنطبق على بقية شاشات النموذج حتى تغيّروها.</LabNote>
    </LabPage>
  );
}

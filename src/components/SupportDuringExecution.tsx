import { Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VisualSupportAid } from "@/components/VisualSupportAid";
import { VisualFramePilot } from "@/components/VisualFramePilot";
import { ReminderCardPilot } from "@/components/ReminderCardPilot";
import { getSupportAvailability } from "@/lib/execution-support";
import { workspaceSpecIdFor } from "@/features/space/participation-link";

/**
 * DALILI-MVP-INSTITUTIONAL-READINESS-01
 * مساحة "الدعم أثناء التطبيق" داخل بطاقة المشاركة.
 * تعرض فقط الأدوات المتاحة فعليًا لهذه الفرصة — بلا placeholders ولا أزرار معطلة.
 */
export function SupportDuringExecution({
  opportunityId,
  hasSteps,
  onRunModeChange,
}: {
  opportunityId: string;
  hasSteps: boolean;
  onRunModeChange: (running: boolean) => void;
}) {
  const a = getSupportAvailability(opportunityId);
  if (!a.any && !hasSteps) return null;

  return (
    <section className="space-y-2" dir="rtl">
      <h4 className="px-1 text-sm font-bold text-foreground">الدعم أثناء التطبيق</h4>

      {a.hasVisualAid && <VisualSupportAid opportunityId={opportunityId} />}

      {a.hasFrameSequence && (
        <VisualFramePilot
          executionUnitId={a.executionUnitId}
          onRunModeChange={onRunModeChange}
        />
      )}

      {a.hasReminderCard && (
        <ReminderCardPilot
          executionUnitId={a.executionUnitId}
          onUseModeChange={onRunModeChange}
        />
      )}

      {hasSteps && (
        <Button variant="outline" className="min-h-11 w-full gap-2" asChild>
          <Link
            to="/space/workspace/$specId"
            params={{ specId: workspaceSpecIdFor(opportunityId) }}
          >
            <Smartphone className="h-4 w-4" />
            جهّزوا بطاقة المشارك
          </Link>
        </Button>
      )}
    </section>
  );
}

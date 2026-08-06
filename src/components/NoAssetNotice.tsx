import { CheckCircle2 } from "lucide-react";
import type { SupportDecision } from "@/lib/support-decisions";

/** بطاقة ثابتة غير قابلة للتوسعة: لا أداة إضافية مطلوبة لهذه الفرصة. */
export function NoAssetNotice({ decision }: { decision: SupportDecision }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <h4 className="text-sm font-bold text-foreground">لا تحتاج أداة إضافية</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {decision.reasonAr}
          </p>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SupportDecision } from "@/lib/support-decisions";

interface Props {
  decision: SupportDecision;
  acknowledged: boolean;
  onAcknowledge: () => void;
  /** يخبر البطاقة الأم بطيّ بقية الأقسام أثناء إبراز رسالة السلامة. */
  onFocusModeChange?: (focused: boolean) => void;
}

/**
 * بطاقة دعم بشري إلزامي. لا تحتوي أي عنصر يمكن فهمه كإذن بالعبور:
 * لا زر بدء، ولا تأكيد أمان، ولا إشارة خضراء، ولا عدّ تنازلي.
 * زر «فهمت» يؤثر في العرض داخل الجلسة فقط ولا يسجل أي اعتماد دائم.
 */
export function HumanSafetyNotice({
  decision,
  acknowledged,
  onAcknowledge,
  onFocusModeChange,
}: Props) {
  useEffect(() => {
    onFocusModeChange?.(!acknowledged);
    return () => onFocusModeChange?.(false);
  }, [acknowledged, onFocusModeChange]);

  return (
    <div
      role="note"
      className="rounded-2xl border-2 border-gold/60 bg-gold/10 p-5 shadow-card-soft"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="space-y-3">
          <h4 className="text-base font-bold text-foreground">الدعم البشري مطلوب</h4>
          <p className="text-sm font-semibold leading-relaxed text-foreground">
            {decision.safetyMessageAr}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {decision.safetySecondaryAr}
          </p>

          {decision.visualSupportRole && (
            <div className="rounded-xl border border-border/60 bg-background p-3">
              <p className="text-[11px] font-bold text-primary">دور التوضيح البصري</p>
              <p className="mt-1 text-[13px] leading-relaxed text-foreground">
                {decision.visualSupportRole}
              </p>
            </div>
          )}

          {!acknowledged && (
            <Button size="sm" variant="outline" onClick={onAcknowledge}>
              فهمت
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

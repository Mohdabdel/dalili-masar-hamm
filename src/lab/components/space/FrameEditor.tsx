// تحرير بطاقات الخطوات داخل مساحة الأسرة:
// كل خطوة لها كتلتان مستقلتان — الصورة والجملة — يمكن تغيير إحداهما دون الأخرى.

import { useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Repeat2, X } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import { visualLibrary, visualStatusLabel } from "@/lab/data/space/coverage";
import type { LabVisualStatus, StepBlockOrder, StepPresentationMode } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export interface FrameEditRow {
  stepId: string;
  sourceText: string;
  familyText: string;
  suggestedText: string;
  visual: string | null;
  status: LabVisualStatus;
  presentation: StepPresentationMode;
  blockOrder: StepBlockOrder;
  optionLabel?: string;
}

const MODES: { value: StepPresentationMode; label: string }[] = [
  { value: "both", label: "صورة وجملة" },
  { value: "visual", label: "صورة فقط" },
  { value: "text", label: "جملة فقط" },
];

export function FrameEditor({
  rows,
  onText,
  onVisual,
  onPresentation,
  onBlockOrder,
  onMove,
  onRemove,
}: {
  rows: FrameEditRow[];
  onText: (stepId: string, text: string) => void;
  onVisual: (stepId: string, src: string | null) => void;
  onPresentation: (stepId: string, mode: StepPresentationMode) => void;
  onBlockOrder: (stepId: string, order: StepBlockOrder) => void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  onRemove: (stepId: string) => void;
}) {
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const library = visualLibrary();

  return (
    <ol className="space-y-4">
      {rows.map((row, i) => (
        <li key={row.stepId} className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              الخطوة {i + 1} — العبارة المقترحة: {row.suggestedText || row.sourceText}
            </p>
            <div className="flex shrink-0 gap-1">
              <MiniButton onClick={() => onMove(row.stepId, -1)} aria-label="تقديم الخطوة">
                <ArrowUp className="h-4 w-4" aria-hidden />
              </MiniButton>
              <MiniButton onClick={() => onMove(row.stepId, 1)} aria-label="تأخير الخطوة">
                <ArrowDown className="h-4 w-4" aria-hidden />
              </MiniButton>
              <MiniButton onClick={() => onRemove(row.stepId)} aria-label="إزالة الخطوة">
                <X className="h-4 w-4" aria-hidden />
              </MiniButton>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
            {/* كتلة الصورة */}
            <div className={cn(row.presentation === "text" && "opacity-50")}>
              {row.presentation === "text" ? (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border text-xs font-bold text-muted-foreground">
                  بلا صورة
                </div>
              ) : (
                <StepFrame asset={row.visual} label={row.familyText} />
              )}
              <MiniButton
                className="mt-2 w-full justify-center"
                onClick={() => setPickerFor(pickerFor === row.stepId ? null : row.stepId)}
                aria-expanded={pickerFor === row.stepId}
              >
                <ImageIcon className="h-4 w-4" aria-hidden />
                غيّروا الصورة
              </MiniButton>
              <p className="mt-1 text-center text-[11px] text-muted-foreground">
                {visualStatusLabel[row.status]}
              </p>
            </div>

            {/* كتلة الجملة */}
            <div className="min-w-0">
              <label className="block">
                <span className="mb-1 block text-sm font-bold">الجملة التي ستستخدمونها</span>
                <input
                  type="text"
                  value={row.familyText}
                  onChange={(e) => onText(row.stepId, e.target.value)}
                  placeholder="اكتبوا بطريقتكم"
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base font-bold placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              <div className="mt-2 flex flex-wrap gap-1">
                <MiniButton onClick={() => onText(row.stepId, row.suggestedText)}>
                  <Repeat2 className="h-4 w-4" aria-hidden />
                  استخدموا العبارة المقترحة
                </MiniButton>
              </div>

              {row.optionLabel && (
                <p className="mt-2 text-sm text-muted-foreground">{row.optionLabel}</p>
              )}

              <div role="group" aria-label="كيف تظهر هذه الخطوة" className="mt-3 flex flex-wrap gap-1">
                {MODES.map((m) => (
                  <MiniButton
                    key={m.value}
                    aria-pressed={row.presentation === m.value}
                    onClick={() => onPresentation(row.stepId, m.value)}
                    className={cn(
                      row.presentation === m.value && "border-primary bg-primary/10 text-primary",
                    )}
                  >
                    {m.label}
                  </MiniButton>
                ))}
                {row.presentation === "both" && (
                  <MiniButton
                    onClick={() =>
                      onBlockOrder(
                        row.stepId,
                        row.blockOrder === "visual-text" ? "text-visual" : "visual-text",
                      )
                    }
                  >
                    {row.blockOrder === "visual-text" ? "الصورة ثم الجملة" : "الجملة ثم الصورة"}
                  </MiniButton>
                )}
              </div>
            </div>
          </div>

          {pickerFor === row.stepId && (
            <div className="mt-3 rounded-2xl border border-border p-2">
              <p className="mb-2 px-1 text-sm font-bold">اختاروا صورة</p>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onVisual(row.stepId, null);
                      setPickerFor(null);
                    }}
                    className="grid h-20 w-full place-items-center rounded-xl border border-dashed border-border text-xs font-bold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    بلا صورة
                  </button>
                </li>
                {library.map((v) => (
                  <li key={v.code}>
                    <button
                      type="button"
                      onClick={() => {
                        onVisual(row.stepId, v.src);
                        setPickerFor(null);
                      }}
                      title={v.title}
                      className={cn(
                        "block h-20 w-full overflow-hidden rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        row.visual === v.src ? "border-primary ring-2 ring-primary" : "border-border",
                      )}
                    >
                      <img
                        src={v.src}
                        alt={v.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function MiniButton({
  children,
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}

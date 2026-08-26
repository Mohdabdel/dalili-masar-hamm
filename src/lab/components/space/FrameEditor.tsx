// تحرير إطارات البطاقة داخل مساحة عمل الأسرة:
// النص المحلي والصورة منفصلان — يمكن تغيير أحدهما دون الآخر، والإطار قد يكون نصاً فقط.

import { useState } from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Type, X } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import { visualLibrary, visualStatusLabel } from "@/lab/data/space/coverage";
import type { LabVisualStatus } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export interface FrameEditRow {
  stepId: string;
  sourceText: string;
  familyText: string;
  visual: string | null;
  status: LabVisualStatus;
  textOnly: boolean;
  optionLabel?: string;
}

export function FrameEditor({
  rows,
  onText,
  onVisual,
  onTextOnly,
  onMove,
  onRemove,
}: {
  rows: FrameEditRow[];
  onText: (stepId: string, text: string) => void;
  onVisual: (stepId: string, src: string | null) => void;
  onTextOnly: (stepId: string, value: boolean) => void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  onRemove: (stepId: string) => void;
}) {
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const library = visualLibrary();

  return (
    <ol className="space-y-3">
      {rows.map((row, i) => (
        <li key={row.stepId} className="rounded-2xl border border-border bg-card p-3">
          <div className="flex gap-3">
            <div className="w-28 shrink-0">
              {row.textOnly ? (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border text-xs font-bold text-muted-foreground">
                  نص فقط
                </div>
              ) : (
                <StepFrame asset={row.visual} label={row.familyText} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">
                {i + 1}. من المكتبة: {row.sourceText}
              </p>
              <label className="mt-1 block">
                <span className="sr-only">نص الأسرة للخطوة {i + 1}</span>
                <input
                  type="text"
                  value={row.familyText}
                  onChange={(e) => onText(row.stepId, e.target.value)}
                  placeholder="نصّكم لهذه الخطوة"
                  className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base font-bold placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </label>
              {row.optionLabel && (
                <p className="mt-1 text-sm text-muted-foreground">{row.optionLabel}</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                الدعم الحالي: {visualStatusLabel[row.status]}
              </p>

              <div className="mt-2 flex flex-wrap gap-1">
                <MiniButton
                  onClick={() => setPickerFor(pickerFor === row.stepId ? null : row.stepId)}
                  aria-expanded={pickerFor === row.stepId}
                >
                  <ImageIcon className="h-4 w-4" aria-hidden />
                  تغيير الصورة
                </MiniButton>
                <MiniButton
                  onClick={() => onTextOnly(row.stepId, !row.textOnly)}
                  aria-pressed={row.textOnly}
                >
                  <Type className="h-4 w-4" aria-hidden />
                  {row.textOnly ? "أعيدوا الصورة" : "نص فقط"}
                </MiniButton>
                <MiniButton onClick={() => onMove(row.stepId, -1)} aria-label="تقديم الخطوة">
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </MiniButton>
                <MiniButton onClick={() => onMove(row.stepId, 1)} aria-label="تأخير الخطوة">
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </MiniButton>
                <MiniButton onClick={() => onRemove(row.stepId)} aria-label="إزالة الخطوة من هذه البطاقة">
                  <X className="h-4 w-4" aria-hidden />
                </MiniButton>
              </div>
            </div>
          </div>

          {pickerFor === row.stepId && (
            <div className="mt-3 rounded-2xl border border-border p-2">
              <p className="mb-2 px-1 text-sm font-bold">اختاروا صورة من المكتبة</p>
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
        "inline-flex min-h-10 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {children}
    </button>
  );
}

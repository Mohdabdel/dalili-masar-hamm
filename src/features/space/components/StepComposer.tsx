// مُركّب خطوات مساحة الأسرة (إنتاج).
// كل خطوة وحدة واحدة: مساحة الصورة + العبارة + أدوات تخصيص مختصرة.
// كتلة الصورة وكتلة العبارة مستقلتان تماماً: تغيير إحداهما لا يمس الأخرى.

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Image as ImageIcon, Repeat2, Upload, X } from "lucide-react";
import { stepImageOptions, type ResolvedStepImage } from "@/features/space/step-image";
import { cn } from "@/lib/utils";

export interface ComposerStepRow {
  stepId: string;
  sourceText: string;
  familyText: string;
  image: ResolvedStepImage;
  imageVisible: boolean;
  textVisible: boolean;
}

export function StepComposer({
  rows,
  onText,
  onResetText,
  onToggleImage,
  onToggleText,
  onPickImage,
  onUploadImage,
  onMove,
  onRemove,
}: {
  rows: ComposerStepRow[];
  onText: (stepId: string, text: string) => void;
  onResetText: (stepId: string) => void;
  onToggleImage: (stepId: string, visible: boolean) => void;
  onToggleText: (stepId: string, visible: boolean) => void;
  onPickImage: (stepId: string, assetCode: string | null) => void;
  /** يرفع صورة من جهاز الأسرة ويختارها لهذه الخطوة. */
  onUploadImage?: (stepId: string, file: File) => Promise<void> | void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  onRemove: (stepId: string) => void;
}) {
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const options = stepImageOptions();
  const canRemove = rows.length > 1;

  const handleFile = async (stepId: string, file: File | undefined) => {
    if (!file || !onUploadImage) return;
    setUploadingFor(stepId);
    try {
      await onUploadImage(stepId, file);
      setPickerFor(null);
    } finally {
      setUploadingFor(null);
    }
  };

  return (
    <ol className="space-y-3">
      {rows.map((row, i) => (
        <li key={row.stepId} className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-muted-foreground">الخطوة {i + 1}</span>
            <div className="flex shrink-0 gap-1">
              <Mini onClick={() => onMove(row.stepId, -1)} aria-label="تقديم الخطوة">
                <ArrowUp className="h-4 w-4" aria-hidden />
              </Mini>
              <Mini onClick={() => onMove(row.stepId, 1)} aria-label="تأخير الخطوة">
                <ArrowDown className="h-4 w-4" aria-hidden />
              </Mini>
              <Mini
                onClick={() => onRemove(row.stepId)}
                disabled={!canRemove}
                aria-label="إزالة الخطوة من مسودتنا"
                title={canRemove ? "إزالة من مسودتنا" : "لا بد من بقاء خطوة واحدة"}
              >
                <X className="h-4 w-4" aria-hidden />
              </Mini>
            </div>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
            {/* كتلة الصورة — مستقلة */}
            <div>
              {!row.imageVisible ? (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-2 text-center text-xs font-bold text-muted-foreground">
                  بدون صورة
                </div>
              ) : row.image.src ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={row.image.src}
                    alt={row.familyText}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-2 text-center text-xs font-semibold text-muted-foreground">
                  {row.image.compositePending
                    ? "الصورة المتاحة تجمع أكثر من مشهد — نجهّز صورة لهذه الخطوة"
                    : "مساحة الصورة — اختاروا صورة مناسبة"}
                </div>
              )}
              <div className="mt-2 flex gap-1">
                <Mini
                  className="flex-1 justify-center"
                  onClick={() => onToggleImage(row.stepId, !row.imageVisible)}
                  aria-pressed={!row.imageVisible}
                >
                  {row.imageVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  {row.imageVisible ? "إخفاء الصورة" : "إظهار الصورة"}
                </Mini>
                <Mini
                  onClick={() => setPickerFor(pickerFor === row.stepId ? null : row.stepId)}
                  aria-expanded={pickerFor === row.stepId}
                  aria-label="اختيار صورة"
                >
                  <ImageIcon className="h-4 w-4" aria-hidden />
                </Mini>
              </div>
            </div>

            {/* كتلة العبارة — مستقلة */}
            <div className="min-w-0">
              {row.textVisible ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-bold">العبارة التي نستخدمها</span>
                  <input
                    type="text"
                    value={row.familyText}
                    onChange={(e) => onText(row.stepId, e.target.value)}
                    placeholder="اكتبوا بطريقتكم"
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base font-bold placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm font-bold text-muted-foreground">
                  بدون عبارة — الصورة وحدها
                </p>
              )}

              <p className="mt-1 text-xs text-muted-foreground">
                العبارة المقترحة: {row.sourceText}
              </p>

              <div className="mt-2 flex flex-wrap gap-1">
                <Mini
                  onClick={() => onToggleText(row.stepId, !row.textVisible)}
                  aria-pressed={!row.textVisible}
                >
                  {row.textVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  {row.textVisible ? "إخفاء العبارة" : "إظهار العبارة"}
                </Mini>
                {row.textVisible && (
                  <Mini onClick={() => onResetText(row.stepId)}>
                    <Repeat2 className="h-4 w-4" aria-hidden />
                    استخدموا العبارة المقترحة
                  </Mini>
                )}
              </div>
            </div>
          </div>

          {pickerFor === row.stepId && (
            <div className="mt-3 rounded-2xl border border-border p-2">
              <p className="mb-2 px-1 text-sm font-bold">اختاروا صورة لهذه الخطوة</p>
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onPickImage(row.stepId, null);
                      setPickerFor(null);
                    }}
                    className="grid h-20 w-full place-items-center rounded-xl border border-dashed border-border text-xs font-bold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    بلا صورة
                  </button>
                </li>
                {options.map((option) => (
                  <li key={option.code}>
                    <button
                      type="button"
                      title={option.title}
                      onClick={() => {
                        onPickImage(row.stepId, option.code);
                        setPickerFor(null);
                      }}
                      className={cn(
                        "block h-20 w-full overflow-hidden rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        row.image.src === option.src
                          ? "border-primary ring-2 ring-primary"
                          : "border-border",
                      )}
                    >
                      <img
                        src={option.src}
                        alt={option.title}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  </li>
                ))}
              </ul>
              {options.length === 0 && (
                <p className="px-1 text-xs text-muted-foreground">
                  لا توجد صور جاهزة لخطوة واحدة بعد.
                </p>
              )}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function Mini({ children, className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...rest}
      className={cn(
        "inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

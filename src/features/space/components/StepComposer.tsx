// مُركّب خطوات مساحة الأسرة (إنتاج).
// كل خطوة وحدة واحدة: مساحة الصورة + العبارة + أدوات تخصيص مختصرة.
// كتلة الصورة وكتلة العبارة مستقلتان تماماً: تغيير إحداهما لا يمس الأخرى.

import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Repeat2,
  Upload,
  X,
} from "lucide-react";
import { stepImageOptions, type ResolvedStepImage } from "@/features/space/step-image";
import { FamilyPhotoLibrary } from "@/features/space/components/FamilyPhotoLibrary";
import { cn } from "@/lib/utils";

export interface ComposerStepRow {
  stepId: string;
  sourceText: string;
  familyText: string;
  image: ResolvedStepImage;
  imageVisible: boolean;
  textVisible: boolean;
  /** كتلة أنشأتها الأسرة: لا عبارة مرجعية ولا إجراء استرجاع. */
  familyAuthored?: boolean;
}

export function StepComposer({
  rows,
  onText,
  onResetText,
  onToggleImage,
  onToggleText,
  onPickImage,
  onUploadImage,
  onPickFamilyImage,
  onMove,
  onRemove,
  showSourceText = true,
}: {
  rows: ComposerStepRow[];
  onText: (stepId: string, text: string) => void;
  onResetText: (stepId: string) => void;
  onToggleImage: (stepId: string, visible: boolean) => void;
  onToggleText: (stepId: string, visible: boolean) => void;
  onPickImage: (stepId: string, assetCode: string | null) => void;
  /** يرفع صورة من جهاز الأسرة ويختارها لهذه الخطوة. */
  onUploadImage?: (stepId: string, file: File) => Promise<void> | void;
  onPickFamilyImage?: (stepId: string, path: string) => void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  onRemove: (stepId: string) => void;
  /** العبارة المرجعية تُعرض فقط حين يكون للمشاركة مصدر مرجعي ثابت. */
  showSourceText?: boolean;
}) {
  const [pickerFor, setPickerFor] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const previousIds = useRef(rows.map((row) => row.stepId));
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const options = stepImageOptions();
  const canRemove = rows.length > 1;
  const safeIndex = Math.min(activeIndex, Math.max(rows.length - 1, 0));
  const activeRow = rows[safeIndex];

  useEffect(() => {
    const ids = rows.map((row) => row.stepId);
    const addedIndex = ids.findIndex((id) => !previousIds.current.includes(id));
    if (addedIndex >= 0) setActiveIndex(addedIndex);
    previousIds.current = ids;
  }, [rows]);

  useEffect(() => {
    if (activeIndex > Math.max(rows.length - 1, 0)) {
      setActiveIndex(Math.max(rows.length - 1, 0));
    }
  }, [activeIndex, rows.length]);

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

  if (!activeRow) {
    return null;
  }

  const moveActive = (direction: -1 | 1) => {
    onMove(activeRow.stepId, direction);
    setActiveIndex((value) => Math.min(rows.length - 1, Math.max(0, value + direction)));
  };

  const rowHasSource = showSourceText && !activeRow.familyAuthored;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => setActiveIndex((value) => Math.max(0, value - 1))}
          disabled={safeIndex === 0}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
          السابق
        </button>
        <div className="text-center">
          <p className="text-sm font-bold">الخطوة {safeIndex + 1} من {rows.length}</p>
          <p className="text-xs text-muted-foreground">حرروا خطوة واحدة، ثم انتقلوا للتالية.</p>
        </div>
        <button
          type="button"
          onClick={() => setActiveIndex((value) => Math.min(rows.length - 1, value + 1))}
          disabled={safeIndex >= rows.length - 1}
          className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-primary px-3 text-sm font-bold text-primary-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          التالي
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <ol>
        <li key={activeRow.stepId} className="rounded-2xl border border-border bg-card p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-bold text-muted-foreground">
              الخطوة {safeIndex + 1}
              {activeRow.familyAuthored && (
                <span className="ms-2 rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                  من كتابتكم
                </span>
              )}
            </span>
            <div className="flex shrink-0 gap-1">
              <Mini
                onClick={() => moveActive(-1)}
                disabled={safeIndex === 0}
                aria-label="تقديم الخطوة"
              >
                <ArrowUp className="h-4 w-4" aria-hidden />
              </Mini>
              <Mini
                onClick={() => moveActive(1)}
                disabled={safeIndex >= rows.length - 1}
                aria-label="تأخير الخطوة"
              >
                <ArrowDown className="h-4 w-4" aria-hidden />
              </Mini>
              <Mini
                onClick={() => onRemove(activeRow.stepId)}
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
              {!activeRow.imageVisible ? (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-2 text-center text-xs font-bold text-muted-foreground">
                  بدون صورة
                </div>
              ) : activeRow.image.src ? (
                <div className="overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={activeRow.image.src}
                    alt={activeRow.familyText}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
              ) : (
                <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-border bg-muted/30 p-2 text-center text-xs font-semibold text-muted-foreground">
                  {activeRow.image.compositePending
                    ? "الصورة المتاحة تجمع أكثر من مشهد — نجهّز صورة لهذه الخطوة"
                    : "مساحة الصورة — اختاروا صورة مناسبة"}
                </div>
              )}
              <div className="mt-2 flex gap-1">
                <Mini
                  className="flex-1 justify-center"
                  onClick={() => onToggleImage(activeRow.stepId, !activeRow.imageVisible)}
                  aria-pressed={!activeRow.imageVisible}
                >
                  {activeRow.imageVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  {activeRow.imageVisible ? "إخفاء الصورة" : "إظهار الصورة"}
                </Mini>
                <Mini
                  onClick={() =>
                    setPickerFor(pickerFor === activeRow.stepId ? null : activeRow.stepId)
                  }
                  aria-expanded={pickerFor === activeRow.stepId}
                  aria-label="اختيار صورة"
                >
                  <ImageIcon className="h-4 w-4" aria-hidden />
                </Mini>
              </div>
            </div>

            {/* كتلة العبارة — مستقلة */}
            <div className="min-w-0">
              {activeRow.textVisible ? (
                <label className="block">
                  <span className="mb-1 block text-sm font-bold">العبارة التي نستخدمها</span>
                  <input
                    type="text"
                    value={activeRow.familyText}
                    onChange={(e) => onText(activeRow.stepId, e.target.value)}
                    placeholder="اكتبوا بطريقتكم"
                    className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base font-bold placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              ) : (
                <p className="rounded-xl border border-dashed border-border bg-muted/30 px-3 py-3 text-sm font-bold text-muted-foreground">
                  بدون عبارة — الصورة وحدها
                </p>
              )}

              {rowHasSource && (
                <p className="mt-1 text-xs text-muted-foreground">
                  العبارة المقترحة: {activeRow.sourceText}
                </p>
              )}

              <div className="mt-2 flex flex-wrap gap-1">
                <Mini
                  onClick={() => onToggleText(activeRow.stepId, !activeRow.textVisible)}
                  aria-pressed={!activeRow.textVisible}
                >
                  {activeRow.textVisible ? (
                    <EyeOff className="h-4 w-4" aria-hidden />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden />
                  )}
                  {activeRow.textVisible ? "إخفاء العبارة" : "إظهار العبارة"}
                </Mini>
                {activeRow.textVisible && rowHasSource && (
                  <Mini onClick={() => onResetText(activeRow.stepId)}>
                    <Repeat2 className="h-4 w-4" aria-hidden />
                    استخدموا العبارة المقترحة
                  </Mini>
                )}
              </div>
            </div>
          </div>

          {pickerFor === activeRow.stepId && (
            <div className="mt-3 rounded-2xl border border-border p-2">
              <p className="mb-2 px-1 text-sm font-bold">اختاروا صورة لهذه الخطوة</p>
              {onPickFamilyImage && <FamilyPhotoLibrary key={activeRow.stepId} onSelect={(path) => {
                onPickFamilyImage(activeRow.stepId, path);
                setPickerFor(null);
              }} />}
              <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {onUploadImage && (
                  <li>
                    <button
                      type="button"
                      disabled={uploadingFor === activeRow.stepId}
                      onClick={() => fileInputRef.current?.click()}
                      className="grid h-20 w-full place-items-center gap-1 rounded-xl border border-dashed border-primary/60 bg-primary/5 px-1 text-xs font-bold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    >
                      <Upload className="h-4 w-4" aria-hidden />
                      {uploadingFor === activeRow.stepId ? "جارٍ الرفع…" : "ارفعوا صورة"}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      aria-label="رفع صورة من الجهاز"
                      onChange={(e) => {
                        void handleFile(activeRow.stepId, e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </li>
                )}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      onPickImage(activeRow.stepId, null);
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
                        onPickImage(activeRow.stepId, option.code);
                        setPickerFor(null);
                      }}
                      className={cn(
                        "block h-20 w-full overflow-hidden rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        activeRow.image.src === option.src
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
      </ol>
    </div>
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

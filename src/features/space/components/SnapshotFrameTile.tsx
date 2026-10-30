import { StepFrame } from "@/lab/components/StepFrame";
import type { LabCardFrame } from "@/lab/slice/types";

/**
 * يحسم ظهور الصورة/النص من حقول النسخة المعتمدة كما هي.
 * النسخ الأقدم بلا أعلام: presentation إن وُجد، وإلا نفس fallback بطاقة المشارك.
 */
export function frameVisibility(frame: LabCardFrame): { showImage: boolean; showText: boolean } {
  const text = frame.text_short_ar || frame.familyText_ar || "";
  const p = frame.presentation;
  const showImage =
    frame.imageVisible ?? (p ? p !== "text" : Boolean(frame.assetRef));
  const showText =
    frame.textVisible ?? (p ? p !== "visual" : Boolean(text));
  return { showImage, showText: showText && Boolean(text) };
}

export function SnapshotFrameTile({ frame }: { frame: LabCardFrame }) {
  const { showImage, showText } = frameVisibility(frame);
  const text = frame.text_short_ar || frame.familyText_ar || "";
  const image = showImage ? (
    <StepFrame key="img" asset={frame.assetRef} label={text} size="md" />
  ) : null;
  const caption = showText ? (
    <p
      key="txt"
      data-testid="frame-text"
      className={`text-center text-sm font-semibold leading-snug ${showImage ? "mt-1" : "grid min-h-24 place-items-center rounded-2xl border border-border p-3"}`}
    >
      {text}
    </p>
  ) : null;
  const textFirst = frame.blockOrder === "text-visual";
  return <>{textFirst ? [caption, image] : [image, caption]}</>;
}

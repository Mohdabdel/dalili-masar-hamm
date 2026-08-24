// إطار موحّد للصورة داخل الـSlice: صورة حقيقية أو Placeholder واضح باسم الخطوة.

import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function StepFrame({
  asset,
  label,
  size = "md",
}: {
  asset: string | null | undefined;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  const box = size === "lg" ? "aspect-[4/3]" : size === "sm" ? "h-16 w-16" : "aspect-[4/3]";

  if (asset) {
    return (
      <div className={cn("overflow-hidden rounded-2xl border border-border bg-muted", box)}>
        <img src={asset} alt={label} loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-border bg-muted/40 p-3 text-center",
        box,
      )}
    >
      <ImageOff className="h-5 w-5 text-muted-foreground" aria-hidden />
      <span className="text-sm font-semibold leading-snug text-muted-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground">بانتظار صورة مطابقة</span>
    </div>
  );
}

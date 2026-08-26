// مساحة تركيب البطاقة: المكونات المتاحة → بطاقة المشارك.
// السحب والإفلات متاح على سطح المكتب، ومعه دائماً أزرار بديلة للوحة المفاتيح واللمس.

import { useState } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, X } from "lucide-react";
import { StepFrame } from "@/lab/components/StepFrame";
import type { StepBlockOrder, StepPresentationMode } from "@/lab/slice/types";
import { cn } from "@/lib/utils";

export interface ComposerItem {
  stepId: string;
  familyText: string;
  visual: string | null;
  presentation: StepPresentationMode;
  blockOrder: StepBlockOrder;
}

export interface ComposerSpare {
  stepId: string;
  label: string;
}

export function FamilyComposer({
  items,
  spares,
  onAdd,
  onRemove,
  onMove,
  onReorder,
}: {
  items: ComposerItem[];
  spares: ComposerSpare[];
  onAdd: (stepId: string) => void;
  onRemove: (stepId: string) => void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  onReorder: (fromStepId: string, toStepId: string) => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
      <section aria-label="المكونات المتاحة" className="rounded-2xl border border-border p-3">
        <h3 className="mb-2 text-sm font-bold text-muted-foreground">المكونات المتاحة</h3>
        {spares.length === 0 ? (
          <p className="text-sm text-muted-foreground">كل الخطوات التي اخترتموها داخل البطاقة.</p>
        ) : (
          <ul className="space-y-2">
            {spares.map((s) => (
              <li key={s.stepId} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{s.label}</span>
                <button
                  type="button"
                  onClick={() => onAdd(s.stepId)}
                  className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  أضيفوا للبطاقة
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="بطاقة المشارك" className="rounded-2xl border-2 border-dashed border-border p-3">
        <h3 className="mb-2 text-sm font-bold text-muted-foreground">بطاقة المشارك</h3>
        {items.length === 0 ? (
          <p className="p-4 text-sm text-muted-foreground">
            أضيفوا خطوة واحدة على الأقل لتظهر البطاقة.
          </p>
        ) : (
          <ol className="space-y-3">
            {items.map((item, i) => (
              <li
                key={item.stepId}
                draggable
                onDragStart={() => setDragging(item.stepId)}
                onDragEnd={() => setDragging(null)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragging && dragging !== item.stepId) onReorder(dragging, item.stepId);
                  setDragging(null);
                }}
                className={cn(
                  "rounded-2xl border border-border bg-card p-3",
                  dragging === item.stepId && "opacity-60",
                )}
              >
                <div className="flex items-start gap-3">
                  <GripVertical
                    className="mt-1 hidden h-4 w-4 shrink-0 text-muted-foreground lg:block"
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <StepBlocks item={item} index={i + 1} />
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <IconBtn onClick={() => onMove(item.stepId, -1)} label="لأعلى">
                      <ArrowUp className="h-4 w-4" aria-hidden />
                    </IconBtn>
                    <IconBtn onClick={() => onMove(item.stepId, 1)} label="لأسفل">
                      <ArrowDown className="h-4 w-4" aria-hidden />
                    </IconBtn>
                    <IconBtn onClick={() => onRemove(item.stepId)} label="إزالة من البطاقة">
                      <X className="h-4 w-4" aria-hidden />
                    </IconBtn>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

export function StepBlocks({ item, index }: { item: ComposerItem; index?: number }) {
  const visual =
    item.presentation === "text" ? null : (
      <div className="mx-auto w-full max-w-[16rem]">
        <StepFrame asset={item.visual} label={item.familyText} />
      </div>
    );
  const text =
    item.presentation === "visual" ? null : (
      <p className="text-center text-lg font-extrabold leading-snug text-foreground">
        {item.familyText}
      </p>
    );

  return (
    <div className="space-y-2">
      {index !== undefined && (
        <span className="block text-xs font-bold text-muted-foreground">{index}</span>
      )}
      {item.blockOrder === "text-visual" ? (
        <>
          {text}
          {visual}
        </>
      ) : (
        <>
          {visual}
          {text}
        </>
      )}
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {children}
    </button>
  );
}

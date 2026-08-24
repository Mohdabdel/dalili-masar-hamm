// شجرة المشاركة: أجزاء رئيسية، وتفاصيل تُفتح عند الحاجة.
// اختيار مرتّب صراحةً — كل عنصر مختار يحمل رقم ترتيب تنفيذه.

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabMajorStep, LabParticipationSpec, LabSubstep } from "@/lab/slice/types";

export interface StepTreeProps {
  spec: LabParticipationSpec;
  selected: { stepId: string; order: number }[];
  onToggle: (stepId: string) => void;
  chosenOptions: Record<string, string>;
  onChooseOption: (stepId: string, optionId: string) => void;
}

export function StepTree({
  spec,
  selected,
  onToggle,
  chosenOptions,
  onChooseOption,
}: StepTreeProps) {
  const orderOf = (id: string) => selected.find((s) => s.stepId === id)?.order;

  return (
    <ul className="space-y-3">
      {[...spec.majorSteps]
        .sort((a, b) => a.order - b.order)
        .map((major) => (
          <MajorRow
            key={major.id}
            major={major}
            orderOf={orderOf}
            onToggle={onToggle}
            chosenOptions={chosenOptions}
            onChooseOption={onChooseOption}
          />
        ))}
    </ul>
  );
}

function MajorRow({
  major,
  orderOf,
  onToggle,
  chosenOptions,
  onChooseOption,
}: {
  major: LabMajorStep;
  orderOf: (id: string) => number | undefined;
  onToggle: (id: string) => void;
  chosenOptions: Record<string, string>;
  onChooseOption: (stepId: string, optionId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `panel-${major.id}`;

  return (
    <li className="rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 p-3">
        <SelectButton
          label={major.instruction_family_ar}
          order={orderOf(major.id)}
          onClick={() => onToggle(major.id)}
        />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={panelId}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          التفاصيل
          <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </div>

      {open && (
        <div id={panelId} className="border-t border-border p-3">
          <ul className="space-y-2">
            {[...major.substeps]
              .sort((a, b) => a.order - b.order)
              .map((sub) => (
                <li key={sub.id}>
                  <SelectButton
                    label={sub.instruction_family_ar}
                    order={orderOf(sub.id)}
                    onClick={() => onToggle(sub.id)}
                    small
                  />
                  <ExecutionOptions
                    sub={sub}
                    chosen={chosenOptions[sub.id]}
                    onChoose={(optId) => onChooseOption(sub.id, optId)}
                  />
                </li>
              ))}
          </ul>
        </div>
      )}
    </li>
  );
}

function ExecutionOptions({
  sub,
  chosen,
  onChoose,
}: {
  sub: LabSubstep;
  chosen?: string;
  onChoose: (optionId: string) => void;
}) {
  if (!sub.executionOptions?.length) return null;
  return (
    <fieldset className="mt-2 rounded-xl border border-dashed border-border bg-muted/30 p-3">
      <legend className="px-1 text-xs font-bold text-muted-foreground">
        طرق متساوية لتنفيذ هذه الخطوة — اختاروا ما يناسبكم أو اتركوها مفتوحة
      </legend>
      <div className="mt-1 flex flex-wrap gap-2">
        {sub.executionOptions.map((opt) => {
          const on = chosen === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={on}
              onClick={() => onChoose(opt.id)}
              className={cn(
                "min-h-[44px] rounded-xl border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card",
              )}
            >
              {opt.label_ar}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function SelectButton({
  label,
  order,
  onClick,
  small,
}: {
  label: string;
  order?: number;
  onClick: () => void;
  small?: boolean;
}) {
  const on = order !== undefined;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-3 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        small ? "min-h-[52px]" : "min-h-[56px]",
        on ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
    >
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-lg border text-xs font-bold",
          on ? "border-primary bg-primary text-primary-foreground" : "border-border",
        )}
        aria-hidden
      >
        {on ? order : <Check className="h-4 w-4 opacity-25" />}
      </span>
      <span className={cn("leading-relaxed", small ? "text-base" : "text-base font-semibold")}>{label}</span>
      {on && <span className="sr-only">مختارة، ترتيبها {order}</span>}
    </button>
  );
}

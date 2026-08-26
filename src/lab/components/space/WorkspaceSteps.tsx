// اختيار خطوات المشاركة داخل مساحة عمل الأسرة.
// خطوة رئيسية + تفاصيل داخل Accordion، مع طرق تنفيذ متكافئة عند وجودها.

import { useState } from "react";
import { Check, ChevronDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabMajorStep, LabParticipationSpec, LabSubstep } from "@/lab/slice/types";

export interface WorkspaceStepsProps {
  spec: LabParticipationSpec;
  selected: { stepId: string; order: number }[];
  onToggle: (stepId: string) => void;
  onMove: (stepId: string, direction: -1 | 1) => void;
  chosenOptions: Record<string, string>;
  onChooseOption: (stepId: string, optionId: string) => void;
}

export function WorkspaceSteps({
  spec,
  selected,
  onToggle,
  onMove,
  chosenOptions,
  onChooseOption,
}: WorkspaceStepsProps) {
  const orderOf = (id: string) => selected.find((s) => s.stepId === id)?.order;

  return (
    <ul className="space-y-3">
      {[...spec.majorSteps]
        .sort((a, b) => a.order - b.order)
        .map((major) => (
          <li key={major.id} className="rounded-2xl border border-border bg-card">
            <MajorRow
              major={major}
              orderOf={orderOf}
              onToggle={onToggle}
              onMove={onMove}
              chosenOptions={chosenOptions}
              onChooseOption={onChooseOption}
            />
          </li>
        ))}
    </ul>
  );
}

function MajorRow({
  major,
  orderOf,
  onToggle,
  onMove,
  chosenOptions,
  onChooseOption,
}: {
  major: LabMajorStep;
  orderOf: (id: string) => number | undefined;
  onToggle: (id: string) => void;
  onMove: (id: string, d: -1 | 1) => void;
  chosenOptions: Record<string, string>;
  onChooseOption: (stepId: string, optionId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `steps-panel-${major.id}`;
  const hasSubsteps = major.substeps.length > 0;

  return (
    <>
      <div className="flex items-start gap-2 p-3">
        <StepToggle
          label={major.instruction_family_ar}
          order={orderOf(major.id)}
          onToggle={() => onToggle(major.id)}
          onMove={(d) => onMove(major.id, d)}
        />
        {hasSubsteps && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={panelId}
            className="inline-flex min-h-11 shrink-0 items-center gap-1 rounded-xl border border-border px-3 text-sm font-bold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            التفاصيل
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
              aria-hidden
            />
          </button>
        )}
      </div>

      {hasSubsteps && open && (
        <div id={panelId} className="border-t border-border p-3">
          <ul className="space-y-2">
            {[...major.substeps]
              .sort((a, b) => a.order - b.order)
              .map((sub) => (
                <li key={sub.id} className="rounded-xl bg-muted/40 p-2">
                  <StepToggle
                    label={sub.instruction_family_ar}
                    order={orderOf(sub.id)}
                    onToggle={() => onToggle(sub.id)}
                    onMove={(d) => onMove(sub.id, d)}
                    small
                  />
                  {orderOf(sub.id) !== undefined && <Options
                    sub={sub}
                    chosen={chosenOptions[sub.id]}
                    onChoose={(optionId) => onChooseOption(sub.id, optionId)}
                  />}
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
}

function Options({
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
    <fieldset className="mt-2 rounded-xl border border-dashed border-border p-2">
      <legend className="px-1 text-xs font-bold text-muted-foreground">
        طرق متكافئة — اختاروا واحدة أو اتركوها مفتوحة
      </legend>
      <div className="flex flex-wrap gap-2">
        {sub.executionOptions.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={chosen === o.id}
            onClick={() => onChoose(o.id)}
            className={cn(
              "min-h-11 rounded-xl border px-3 text-sm font-semibold",
              chosen === o.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card",
            )}
          >
            {o.label_ar}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function StepToggle({
  label,
  order,
  onToggle,
  onMove,
  small,
}: {
  label: string;
  order?: number;
  onToggle: () => void;
  onMove: (d: -1 | 1) => void;
  small?: boolean;
}) {
  const on = order !== undefined;
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <button
        type="button"
        aria-pressed={on}
        onClick={onToggle}
        className={cn(
          "flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-xl border p-2 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          on ? "border-primary bg-primary/5" : "border-transparent hover:bg-accent",
        )}
      >
        <span
          className={cn(
            "grid h-7 w-7 shrink-0 place-items-center rounded-md border text-xs font-bold",
            on ? "border-primary bg-primary text-primary-foreground" : "border-border",
          )}
        >
          {on ? order : <Check className="h-4 w-4 opacity-0" aria-hidden />}
        </span>
        <span className={cn("leading-relaxed", small ? "text-sm" : "text-base font-semibold")}>
          {label}
        </span>
      </button>
      {on && (
        <span className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`تقديم: ${label}`}
            onClick={() => onMove(-1)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowUp className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`تأخير: ${label}`}
            onClick={() => onMove(1)}
            className="grid h-11 w-11 place-items-center rounded-xl border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowDown className="h-4 w-4" aria-hidden />
          </button>
        </span>
      )}
    </div>
  );
}

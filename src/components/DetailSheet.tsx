import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

interface AccordionSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface DetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eyebrow?: string;
  title: string;
  headline?: string;
  headlineLabel?: string;
  checklist?: { key: string; label: string }[];
  checklistTitle?: string;
  sections: AccordionSection[];
}

export function DetailSheet({
  open,
  onOpenChange,
  eyebrow,
  title,
  headline,
  headlineLabel = "المهمة الحالية",
  checklist,
  checklistTitle = "خطوات التنفيذ",
  sections,
}: DetailSheetProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  useEffect(() => {
    if (!open) setChecked({});
  }, [open]);

  const doneCount = Object.values(checked).filter(Boolean).length;
  const total = checklist?.length ?? 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-t-0 bg-background p-0"
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />

        <SheetHeader className="px-5 pt-4 pb-2 text-right">
          {eyebrow && (
            <Badge variant="secondary" className="mx-0 me-auto w-fit bg-primary/10 text-primary">
              {eyebrow}
            </Badge>
          )}
          <SheetTitle className="text-right text-xl font-bold leading-snug text-foreground">
            {title}
          </SheetTitle>
          <SheetDescription className="text-right text-sm leading-relaxed text-muted-foreground">
            {headline ?? "تفاصيل هذا العنصر داخل دليلي."}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 px-5 pb-8">
          {headline && (
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-elegant">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                {headlineLabel}
              </p>
              <p className="mt-2 text-base font-semibold leading-relaxed">{headline}</p>
            </div>
          )}

          {checklist && checklist.length > 0 && (
            <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">{checklistTitle}</h4>
                <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {doneCount} / {total}
                </span>
              </div>
              <ul className="space-y-2">
                {checklist.map((item) => {
                  const isDone = !!checked[item.key];
                  return (
                    <li key={item.key}>
                      <label
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                          isDone
                            ? "border-gold/60 bg-gold/10"
                            : "border-border/60 bg-background hover:border-primary/40"
                        }`}
                      >
                        <Checkbox
                          checked={isDone}
                          onCheckedChange={(v) =>
                            setChecked((prev) => ({ ...prev, [item.key]: !!v }))
                          }
                          className="mt-0.5"
                        />
                        <span
                          className={`text-sm leading-relaxed ${
                            isDone
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {item.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {sections.length > 0 && (
            <Accordion type="multiple" className="space-y-2">
              {sections.map((s) => (
                <AccordionItem
                  key={s.id}
                  value={s.id}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
                >
                  <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
                    {s.title}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
                    {s.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

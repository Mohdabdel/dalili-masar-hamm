import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import visualAid from "@/assets/visual-aid-meal-choice.jpg";

/**
 * EXU-COMM-007-OP002-001 / EXA-EXU-COMM-007-OP002-001-V001
 * Visual Aid — نموذج أولي، يظهر عند الحاجة فقط (Progressive Disclosure).
 */
const OPTIONS = ["أرز مع دجاج", "مكرونة بالصلصة"];

export function VisualAidPrototype() {
  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem
        value="visual-aid"
        className="overflow-hidden rounded-2xl border border-border/60 bg-card"
      >
        <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
          المعين البصري
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-3" dir="rtl">
            {OPTIONS.map((name) => (
              <figure key={name} className="m-0">
                <img
                  src={visualAid}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  width={1024}
                  height={512}
                  className="h-24 w-full rounded-xl object-cover"
                />
                <figcaption className="mt-2 text-center text-sm font-semibold text-foreground">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

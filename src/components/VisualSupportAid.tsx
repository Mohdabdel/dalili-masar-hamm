import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getVisualSupportForOpportunity } from "@/lib/visual-support-map";

/**
 * DALILI-VISUAL-SUPPORT-INTEGRATION-01
 * التوضيح البصري داخل مساحة "الدعم أثناء التطبيق".
 * المصدر الوحيد للصور: resolver مكتبة الأصول Canonical.
 * عند غياب الأصل: لا يُعرض شيء (لا img مكسورة ولا رسالة جديدة).
 */
export function VisualSupportAid({ opportunityId }: { opportunityId: string }) {
  const binding = getVisualSupportForOpportunity(opportunityId);
  if (!binding) return null;

  return (
    <Accordion type="single" collapsible className="space-y-2">
      <AccordionItem
        value="visual-support"
        className="overflow-hidden rounded-2xl border border-border/60 bg-card"
      >
        <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
          التوضيح البصري
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <figure className="m-0" dir="rtl">
            <img
              src={binding.src}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="w-full rounded-xl object-contain"
            />
            {binding.titleAr && (
              <figcaption className="mt-2 text-center text-sm font-semibold text-foreground">
                {binding.titleAr}
              </figcaption>
            )}
          </figure>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getGeneralVisualSupport } from "@/lib/visual-support-map";

/**
 * DALILI-VISUAL-SUPPORT-INTEGRATION-01 / PREVIOUS-ASSETS-AUDIT-AND-LINK-01
 * التوضيح البصري داخل مساحة "الدعم أثناء التطبيق".
 * المصدر الوحيد للصور: resolver مكتبة الأصول Canonical — لا مسار ملف صلب هنا.
 * عند غياب الأصل: لا يُعرض شيء (لا img مكسورة ولا رسالة جديدة).
 */
export function VisualSupportAid({ opportunityId }: { opportunityId: string }) {
  const assets = getGeneralVisualSupport(opportunityId);
  if (assets.length === 0) return null;

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
          <div
            className={assets.length > 1 ? "grid grid-cols-2 gap-3" : "grid grid-cols-1 gap-3"}
            dir="rtl"
          >
            {assets.map((a) => (
              <figure key={a.assetCode} className="m-0">
                <img
                  src={a.src}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className={
                    assets.length > 1
                      ? "h-32 w-full rounded-xl object-cover"
                      : "w-full rounded-xl object-contain"
                  }
                />
                {a.titleAr && (
                  <figcaption className="mt-2 text-center text-sm font-semibold text-foreground">
                    {a.titleAr}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

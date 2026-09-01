import { useEffect, useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Share2, ArrowLeft, Check, ExternalLink, Phone } from "lucide-react";
import { toast } from "sonner";

export interface ServiceCardData {
  id: string;
  title: string;
  domain: string;
  service: string;
  opportunity: string;
  whyNeed?: string;
  whenToUse?: string;
  whatToPrepare?: string[];
  generalSteps?: string[];
  whatNext?: string[];
  relatedServices?: string[];
  externalLink?: string;
  hotline?: string;
}

interface ServiceCardProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: ServiceCardData | null;
  onNext?: () => void;
}

export function ServiceCard({ open, onOpenChange, data, onNext }: ServiceCardProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open || !data) return;
    try {
      const list = JSON.parse(localStorage.getItem("saved-services") ?? "[]");
      setSaved(Array.isArray(list) && list.includes(data.id));
    } catch {
      setSaved(false);
    }
  }, [open, data]);

  if (!data) return null;

  const handleSave = () => {
    try {
      const list = JSON.parse(localStorage.getItem("saved-services") ?? "[]");
      const set = new Set<string>(Array.isArray(list) ? list : []);
      if (set.has(data.id)) {
        set.delete(data.id);
        setSaved(false);
        toast("أزيلت من المحفوظات");
      } else {
        set.add(data.id);
        setSaved(true);
        toast("تم الحفظ");
      }
      localStorage.setItem("saved-services", JSON.stringify([...set]));
    } catch {
      /* ignore */
    }
  };

  const handleShare = async () => {
    const text = `${data.title} — ${data.service}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: data.title, text });
      } else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        toast("نُسخ الرابط");
      }
    } catch {
      /* cancelled */
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92vh] overflow-y-auto rounded-t-3xl border-t-0 bg-background p-0"
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" />

        <SheetHeader className="px-5 pt-4 pb-2 text-right">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="bg-primary/10 text-primary">{data.id}</Badge>
            <Badge variant="outline" className="text-[10px]">{data.domain}</Badge>
            <Badge variant="outline" className="text-[10px]">{data.service}</Badge>
          </div>
          <SheetTitle className="text-right text-xl font-bold leading-snug">
            {data.title}
          </SheetTitle>
          <SheetDescription className="text-right text-[12px] text-muted-foreground">
            فرصة الاستفادة: <span className="font-semibold text-foreground">{data.opportunity}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-5 pb-6">
          {data.whyNeed && (
            <div className="rounded-2xl bg-gradient-primary p-5 text-primary-foreground shadow-elegant">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
                لماذا قد تحتاج هذه الخدمة
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed">{data.whyNeed}</p>
            </div>
          )}

          <Accordion type="multiple" className="space-y-2" defaultValue={["prepare", "steps"]}>
            {data.whenToUse && (
              <Item value="when" title="متى تستخدمها">
                <p className="leading-relaxed">{data.whenToUse}</p>
              </Item>
            )}
            {data.whatToPrepare && data.whatToPrepare.length > 0 && (
              <Item value="prepare" title="ماذا تجهز">
                <ul className="list-inside list-disc space-y-1 leading-relaxed">
                  {data.whatToPrepare.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Item>
            )}
            {data.generalSteps && data.generalSteps.length > 0 && (
              <Item value="steps" title="خطوات عامة">
                <ol className="list-inside list-decimal space-y-1 leading-relaxed">
                  {data.generalSteps.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </Item>
            )}
            {data.whatNext && data.whatNext.length > 0 && (
              <Item value="next" title="ماذا بعد">
                <ul className="list-inside list-disc space-y-1 leading-relaxed">
                  {data.whatNext.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              </Item>
            )}
            {data.relatedServices && data.relatedServices.length > 0 && (
              <Item value="related" title="خدمات مرتبطة">
                <div className="flex flex-wrap gap-2">
                  {data.relatedServices.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </Item>
            )}
            <Item value="contact" title="روابط وأرقام">
              <div className="space-y-2">
                {data.externalLink ? (
                  <a
                    href={data.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    فتح الرابط الرسمي
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    الرابط الرسمي سيضاف لاحقاً.
                  </p>
                )}
                {data.hotline ? (
                  <a
                    href={`tel:${data.hotline}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {data.hotline}
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    رقم التواصل سيضاف لاحقاً.
                  </p>
                )}
              </div>
            </Item>
          </Accordion>
        </div>

        <div className="sticky bottom-0 grid grid-cols-3 gap-2 border-t border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
          <Button variant="outline" size="sm" onClick={handleSave} className="gap-1.5">
            {saved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {saved ? "محفوظ" : "حفظ"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5">
            <Share2 className="h-4 w-4" />
            مشاركة
          </Button>
          <Button
            size="sm"
            onClick={onNext}
            disabled={!onNext}
            className="gap-1.5"
          >
            التالي
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Item({ value, title, children }: { value: string; title: string; children: ReactNode }) {
  return (
    <AccordionItem
      value={value}
      className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card-soft"
    >
      <AccordionTrigger className="px-4 py-3 text-right text-sm font-semibold hover:no-underline">
        {title}
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </AccordionContent>
    </AccordionItem>
  );
}

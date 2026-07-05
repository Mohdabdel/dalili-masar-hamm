import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Image as ImageIcon,
  ListOrdered,
  Link2,
  Smartphone,
  Send,
  Printer,
  ShoppingBasket,
  Shirt,
  WashingMachine,
} from "lucide-react";

const VISUAL_AIDS = [
  { label: "سلة الملابس", icon: ShoppingBasket },
  { label: "الملابس المستخدمة", icon: Shirt },
  { label: "مكان الغسيل", icon: WashingMachine },
];

const SEQUENCE_STEPS = [
  "اذهب إلى الغرفة",
  "اجمع الملابس",
  "ضعها في السلة",
  "انقل السلة إلى مكان الغسيل",
];

export function SupportResourcesPrototype() {
  const [aidsOpen, setAidsOpen] = useState(false);
  const [learnerOpen, setLearnerOpen] = useState(false);
  const [learnerIdx, setLearnerIdx] = useState(0);

  const openLearner = () => {
    setLearnerIdx(0);
    setLearnerOpen(true);
  };

  const CurrentIcon = LEARNER_STEPS[learnerIdx].icon;

  return (
    <section className="rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft">
      <div className="mb-1 flex flex-wrap items-center gap-2">
        <h4 className="text-sm font-bold text-foreground">مصادر الدعم أثناء التطبيق</h4>
        <Badge className="bg-gold/20 text-primary hover:bg-gold/20 text-[10px]">نموذج أولي</Badge>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        مصادر تساعد الأسرة أثناء تنفيذ المشاركة، ويمكن لاحقاً تطويرها للطباعة أو العرض على جهاز
        المتعلم أو تخصيصها حسب مستوى الدعم.
      </p>

      <div className="space-y-3">
        {/* 1. Visual aids */}
        <ResourceCard
          icon={<ImageIcon className="h-5 w-5" />}
          title="المعينات البصرية"
          description="صور أو رموز تساعد الشاب على فهم المطلوب أثناء تنفيذ المشاركة."
        >
          <ul className="mb-3 grid grid-cols-3 gap-2">
            {VISUAL_AIDS.map((a) => {
              const Icon = a.icon;
              return (
                <li
                  key={a.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border/60 bg-background p-2.5 text-center"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/15 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-semibold text-foreground">{a.label}</span>
                </li>
              );
            })}
          </ul>
          <Button size="sm" variant="outline" className="w-full" onClick={() => setAidsOpen(true)}>
            عرض المعينات البصرية
          </Button>
        </ResourceCard>

        {/* 2. Illustrated sequence */}
        <ResourceCard
          icon={<ListOrdered className="h-5 w-5" />}
          title="التسلسل المصور للخطوات"
          description="خطوات مختصرة يمكن عرضها بصرياً أثناء التنفيذ."
        >
          <ol className="mb-2 space-y-2">
            {SEQUENCE_STEPS.map((s, i) => (
              <li
                key={s}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-background p-3"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-foreground">{s}</span>
              </li>
            ))}
          </ol>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            لاحقاً يمكن استبدال هذه البطاقات بصور حقيقية أو رموز مخصصة للمتعلم.
          </p>
        </ResourceCard>

        {/* 3. Supporting link */}
        <ResourceCard
          icon={<Link2 className="h-5 w-5" />}
          title="رابط داعم"
          description="سيتمكن المختص أو الأسرة لاحقاً من إضافة رابط فيديو أو مورد خارجي يدعم تنفيذ المشاركة."
          badge="قيد التطوير"
        >
          <Input
            disabled
            placeholder="إضافة رابط داعم"
            className="text-right"
            dir="rtl"
          />
        </ResourceCard>

        {/* 4. Learner version */}
        <ResourceCard
          icon={<Smartphone className="h-5 w-5" />}
          title="نسخة المتعلم"
          description="واجهة مبسطة تعرض خطوات المشاركة بخط كبير وبأقل قدر من النص، لاستخدامها على جهاز المتعلم."
        >
          <Button size="sm" className="w-full" onClick={openLearner}>
            فتح نسخة المتعلم
          </Button>
        </ResourceCard>

        {/* 5. Send to device */}
        <ResourceCard
          icon={<Send className="h-5 w-5" />}
          title="إرسال إلى جهاز آخر"
          description="ميزة مستقبلية لإرسال نسخة المتعلم إلى الهاتف أو الجهاز اللوحي الخاص بالمتعلم."
          badge="قيد التطوير"
        >
          <Button size="sm" variant="outline" className="w-full" disabled>
            إرسال إلى جهاز آخر
          </Button>
        </ResourceCard>

        {/* 6. Print version */}
        <ResourceCard
          icon={<Printer className="h-5 w-5" />}
          title="نسخة للطباعة"
          description="نسخة مختصرة يمكن للأسرة طباعتها لاحقاً لاستخدامها أثناء تنفيذ المشاركة."
          badge="قيد التطوير"
        >
          <Button size="sm" variant="outline" className="w-full" disabled>
            طباعة البطاقة
          </Button>
        </ResourceCard>
      </div>

      <p className="mt-4 rounded-xl bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
        هذا القسم نموذج أولي لتوضيح مفهوم مصادر الدعم أثناء التطبيق، وسيتم تطويره في الإصدارات
        القادمة ليشمل موارد بصرية وسمعية وتفاعلية قابلة للتخصيص والطباعة والمشاركة.
      </p>

      {/* Visual aids dialog */}
      <Dialog open={aidsOpen} onOpenChange={setAidsOpen}>
        <DialogContent className="max-w-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">المعينات البصرية</DialogTitle>
          </DialogHeader>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {VISUAL_AIDS.map((a) => {
              const Icon = a.icon;
              return (
                <li
                  key={a.label}
                  className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-background p-6 text-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gold/20 text-primary">
                    <Icon className="h-10 w-10" />
                  </span>
                  <span className="text-base font-bold text-foreground">{a.label}</span>
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>

      {/* Learner view dialog */}
      <Dialog open={learnerOpen} onOpenChange={setLearnerOpen}>
        <DialogContent className="max-w-md p-0" dir="rtl">
          <div className="flex min-h-[80vh] flex-col bg-background">
            <DialogHeader className="border-b border-border/60 px-6 py-4">
              <DialogTitle className="text-right text-2xl font-extrabold">
                جمع الملابس
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
              <span className="flex h-32 w-32 items-center justify-center rounded-3xl bg-gold/20 text-primary">
                <CurrentIcon className="h-16 w-16" />
              </span>
              <div className="text-4xl font-black text-primary">{learnerIdx + 1}</div>
              <div className="text-3xl font-extrabold leading-snug text-foreground">
                {LEARNER_STEPS[learnerIdx].label}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border/60 p-4">
              <Button
                size="lg"
                variant="outline"
                className="h-14 text-lg font-bold"
                disabled={learnerIdx === 0}
                onClick={() => setLearnerIdx((i) => Math.max(0, i - 1))}
              >
                <ChevronRight className="ml-1 h-5 w-5" />
                السابق
              </Button>
              <Button
                size="lg"
                className="h-14 text-lg font-bold"
                disabled={learnerIdx === LEARNER_STEPS.length - 1}
                onClick={() =>
                  setLearnerIdx((i) => Math.min(LEARNER_STEPS.length - 1, i + 1))
                }
              >
                التالي
                <ChevronLeft className="mr-1 h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ResourceCard({
  icon,
  title,
  description,
  badge,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  badge?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-background p-4">
      <div className="mb-2 flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-primary">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h5 className="text-sm font-bold text-foreground">{title}</h5>
            {badge && (
              <Badge variant="outline" className="text-[10px]">
                {badge}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        </div>
      </div>
      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}

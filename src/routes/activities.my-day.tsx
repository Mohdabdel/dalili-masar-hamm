import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Shirt,
  UtensilsCrossed,
  Refrigerator,
  Users,
  Stethoscope,
  ChevronLeft,
} from "lucide-react";

export const Route = createFileRoute("/activities/my-day")({
  head: () => ({
    meta: [
      { title: "أحداث يومي | دليلي" },
      {
        name: "description",
        content:
          "اختر أحداث اليوم من قاعدة المعرفة، ورافق الأسرة في تنفيذ فرص المشاركة.",
      },
    ],
  }),
  component: MyDayPage,
});

type DayEvent = {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "home" | "community";
  openId?: string;
};

const OPTIONS: DayEvent[] = [
  { id: "wash", title: "اليوم يوم غسل الملابس", icon: Shirt, category: "home", openId: "OP-COLLECT" },
  { id: "meal", title: "سنجهز وجبة", icon: UtensilsCrossed, category: "home" },
  { id: "med", title: "لدينا موعد صحي", icon: Stethoscope, category: "community" },
  { id: "stock", title: "سنراجع الثلاجة أو المخزن", icon: Refrigerator, category: "home" },
  { id: "guests", title: "سنستقبل ضيوفاً", icon: Users, category: "home" },
];

const STORAGE_KEY = "dalili-my-day";

function MyDayPage() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) =>
    setSelected((p) => ({ ...p, [id]: !p[id] }));

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      toast("تم حفظ خطة اليوم محلياً");
    } catch {
      toast("تعذر الحفظ");
    }
  };

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <PageShell
      title="أحداث يومي"
      subtitle="نموذج أولي"
      breadcrumbs={[
        { label: "الأنشطة", to: "/activities" },
        { label: "أحداث يومي" },
      ]}
    >
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">نموذج أولي</Badge>
        <span className="text-xs text-muted-foreground">قيد التطوير</span>
      </div>

      <p className="mb-5 rounded-2xl border border-border/60 bg-card p-4 text-sm leading-relaxed text-muted-foreground shadow-card-soft">
        هذه الميزة تساعد الأسرة على تنظيم فرص المشاركة خلال اليوم. سيتم تطويرها
        لاحقاً لحفظ خطة يومية كاملة.
      </p>

      <ul className="space-y-2.5">
        {OPTIONS.map((op) => {
          const Icon = op.icon;
          const isOn = !!selected[op.id];
          return (
            <li key={op.id}>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 transition-all ${
                  isOn ? "border-gold bg-gold/10" : "border-border bg-card hover:border-gold/50"
                }`}
              >
                <Checkbox checked={isOn} onCheckedChange={() => toggle(op.id)} />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-right text-sm font-bold text-foreground">
                  {op.title}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      <div className="sticky bottom-24 mt-6 space-y-3">
        <Button onClick={save} className="w-full" size="lg" disabled={count === 0}>
          حفظ خطة اليوم ({count})
        </Button>
        <Link
          to="/activities/$category"
          params={{ category: "home" }}
          search={{ open: "OP-COLLECT" }}
          className="group flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-gold"
        >
          افتح بطاقة مشاركة تجريبية
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </PageShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Shirt,
  UtensilsCrossed,
  Archive,
  Users,
  Pill,
  ChevronLeft,
} from "lucide-react";
import { knowledgeDomains } from "@/lib/knowledge-base";

export const Route = createFileRoute("/activities/my-day")({
  head: () => ({
    meta: [
      { title: "أحداث يومي | دليلي" },
      {
        name: "description",
        content:
          "اختر أحداث اليوم من قاعدة المعرفة، ورافق الأسرة في تنفيذ فرص المشاركة.",
      },
      { property: "og:title", content: "أحداث يومي | دليلي" },
      {
        property: "og:description",
        content: "اختر أحداث اليوم ورافق الأسرة في تنفيذ فرص المشاركة.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MyDayPage,
});

type DayEvent = {
  /** معرف الحدث في مستودع المعرفة الحالي. */
  eventId: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
};

const OPTIONS: DayEvent[] = [
  { eventId: "CLO-011", title: "سنفرز الملابس قبل الغسيل", icon: Shirt },
  { eventId: "CLO-016", title: "سنطوي الملابس النظيفة", icon: Shirt },
  { eventId: "FOOD-009", title: "سنعدّ وجبة سريعة", icon: UtensilsCrossed },
  { eventId: "HEALTH-013", title: "لدينا دواء اليوم", icon: Pill },
  { eventId: "HOME-052", title: "سنرتب خزانة المؤن", icon: Archive },
  { eventId: "FOOD-006", title: "سنستقبل ضيوفاً", icon: Users },
];

const STORAGE_KEY = "dalili-my-day";

function firstOpportunityId(eventId: string): string | null {
  for (const domain of knowledgeDomains) {
    for (const activity of domain.activities) {
      for (const event of activity.events) {
        if (event.id === eventId) return event.opportunities[0]?.id ?? null;
      }
    }
  }
  return null;
}

function MyDayPage() {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // لا يُعرض إلا الحدث القابل للفتح فعليًا داخل المستودع الحالي.
  const options = useMemo(
    () =>
      OPTIONS.map((op) => ({ ...op, openId: firstOpportunityId(op.eventId) })).filter(
        (op): op is DayEvent & { openId: string } => op.openId !== null,
      ),
    [],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = (id: string) => setSelected((p) => ({ ...p, [id]: !p[id] }));

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      toast("تم حفظ خطة اليوم على هذا الجهاز");
    } catch {
      toast("تعذر الحفظ");
    }
  };

  const count = Object.values(selected).filter(Boolean).length;

  return (
    <PageShell
      title="أحداث يومي"
      subtitle="اختر ما يحدث في يومكم، ثم افتح فرصة المشاركة المناسبة مباشرة."
      breadcrumbs={[
        { label: "الأنشطة", to: "/activities" },
        { label: "أحداث يومي" },
      ]}
    >
      <ul className="space-y-2.5">
        {options.map((op) => {
          const Icon = op.icon;
          const isOn = !!selected[op.eventId];
          return (
            <li key={op.eventId}>
              <div
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 transition-all ${
                  isOn ? "border-gold bg-gold/10" : "border-border bg-card"
                }`}
              >
                <Checkbox
                  checked={isOn}
                  onCheckedChange={() => toggle(op.eventId)}
                  aria-label={`اختيار ${op.title}`}
                />
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1 text-right text-sm font-bold text-foreground">
                  {op.title}
                </span>
                <Link
                  to="/activities/$category"
                  params={{ category: "home" }}
                  search={{ open: op.openId, view: "domains" as const }}
                  className="group inline-flex shrink-0 items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-gold"
                >
                  ابدأ
                  <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-6">
        <Button onClick={save} className="w-full" size="lg" disabled={count === 0}>
          حفظ خطة اليوم ({count})
        </Button>
      </div>
    </PageShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Home as HomeIcon,
  Users,
  Landmark,
  ChevronLeft,
  Shirt,
  ShoppingCart,
  Stethoscope,
  LifeBuoy,
  Sparkles,
  MapPin,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "دليلي — مسار همم" },
      {
        name: "description",
        content:
          "منصة تساعد أسر الشباب والبالغين من ذوي الهمم على تحويل أحداث الحياة اليومية إلى فرص مشاركة واقعية ومتدرجة.",
      },
    ],
  }),
  component: LandingPage,
});

type QuickCard = {
  title: string;
  to: "/activities/home" | "/activities/community" | "/resources";
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const quickCards: QuickCard[] = [
  { title: "اليوم يوم غسل الملابس", to: "/activities/home", icon: Shirt },
  { title: "سنذهب للتسوق", to: "/activities/community", icon: ShoppingCart },
  { title: "لدينا موعد طبي", to: "/activities/community", icon: Stethoscope },
  { title: "نحتاج إلى خدمة أو دعم", to: "/resources", icon: LifeBuoy },
  { title: "أريد نشاطاً منزلياً", to: "/activities/home", icon: Sparkles },
  { title: "أريد نشاطاً مجتمعياً", to: "/activities/community", icon: MapPin },
];

const mainPortals = [
  {
    to: "/activities/home" as const,
    title: "الأنشطة المنزلية",
    subtitle: "أحداث الحياة داخل المنزل بفرص مشاركة متدرجة",
    icon: HomeIcon,
  },
  {
    to: "/activities/community" as const,
    title: "الأنشطة المجتمعية",
    subtitle: "أحداث الحياة خارج المنزل بفرص مشاركة متدرجة",
    icon: Users,
  },
  {
    to: "/resources" as const,
    title: "بوابة الدعم والخدمات",
    subtitle: "جهات وخدمات معتمدة لأصحاب الهمم وأسرهم",
    icon: Landmark,
  },
];

function LandingPage() {
  return (
    <PageShell
      title="دليلي"
      subtitle="خطوات بسيطة مستمرة تحقق مشاركة مستدامة"
    >
      {/* Hero / وصف */}
      <section className="mt-1 rounded-3xl bg-gradient-primary p-5 text-primary-foreground shadow-elegant">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gold">
          دليل الأسر — مسار همم
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold leading-tight">
          خطوات بسيطة مستمرة تحقق مشاركة مستدامة
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-primary-foreground/90">
          منصة تساعد أسر الشباب والبالغين من ذوي الهمم على تحويل أحداث الحياة
          اليومية داخل المنزل والمجتمع إلى فرص مشاركة واقعية ومتدرجة تدعم
          الاستقلالية وجودة الحياة بعد التخرج.
        </p>
      </section>

      {/* ما الذي يحدث اليوم؟ */}
      <section className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-display text-lg font-bold text-foreground">
            ما الذي يحدث اليوم؟
          </h3>
          <span className="text-[11px] font-semibold text-muted-foreground">
            اختر بطاقة للبدء
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {quickCards.map(({ title, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="group flex h-full flex-col justify-between gap-3 rounded-2xl border border-border/60 bg-card p-4 text-right shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elegant"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-gold text-primary shadow-card-soft">
                <Icon className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <p className="text-sm font-semibold leading-snug text-foreground">
                {title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* القوائم الرئيسية الثلاث */}
      <section className="mt-7">
        <h3 className="mb-3 font-display text-lg font-bold text-foreground">
          القوائم الرئيسية
        </h3>
        <div className="space-y-3">
          {mainPortals.map(({ to, title, subtitle, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-elegant"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                <Icon className="h-6 w-6" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-base font-bold text-foreground">{title}</h4>
                <p className="mt-0.5 text-xs font-medium leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              </div>
              <ChevronLeft className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

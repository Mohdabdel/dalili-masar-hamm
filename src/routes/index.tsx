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
];

const mainPortals = [
  {
    to: "/activities/home" as const,
    title: "الأنشطة المنزلية",
    subtitle: "فرص مشاركة داخل المنزل",
    icon: HomeIcon,
  },
  {
    to: "/activities/community" as const,
    title: "الأنشطة المجتمعية",
    subtitle: "فرص مشاركة خارج المنزل",
    icon: Users,
  },
  {
    to: "/resources" as const,
    title: "بوابة الدعم والخدمات",
    subtitle: "خدمات معتمدة لأصحاب الهمم",
    icon: Landmark,
  },
];

function LandingPage() {
  return (
    <PageShell title="دليلي" subtitle="خطوات بسيطة تحقق مشاركة مستدامة">
      {/* هيرو موجز */}
      <section className="mt-1 rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-elegant">
        <h2 className="font-display text-2xl font-bold leading-snug sm:text-3xl">
          مرافق للأسرة في الحياة اليومية
        </h2>
        <p className="mt-3 text-base leading-relaxed text-primary-foreground/90">
          حوّل ما يحدث فعلاً في يومكم إلى فرصة مشاركة حقيقية للشاب أو البالغ من
          ذوي الهمم.
        </p>
        <Link
          to="/how-to-use"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-base font-bold text-gold-foreground shadow-card-soft transition-transform hover:-translate-y-0.5"
        >
          ابدأ من هنا
          <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
        </Link>
      </section>

      {/* القوائم الرئيسية الثلاث - أكبر وأوضح */}
      <section className="mt-8">
        <h3 className="mb-4 font-display text-xl font-bold text-foreground">
          القوائم الرئيسية
        </h3>
        <div className="space-y-3">
          {mainPortals.map(({ to, title, subtitle, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="group flex items-center gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-elegant"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                <Icon className="h-7 w-7" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-lg font-bold text-foreground">{title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              </div>
              <ChevronLeft className="h-6 w-6 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* اختصارات اليوم - أربعة فقط */}
      <section className="mt-8">
        <h3 className="mb-4 font-display text-xl font-bold text-foreground">
          ابدأ من حدث اليوم
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {quickCards.map(({ title, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="group flex h-full flex-col justify-between gap-3 rounded-2xl border-2 border-border bg-card p-4 text-right shadow-card-soft transition-all hover:-translate-y-0.5 hover:border-gold"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon className="h-6 w-6" strokeWidth={2} />
              </div>
              <p className="text-base font-semibold leading-snug text-foreground">
                {title}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}


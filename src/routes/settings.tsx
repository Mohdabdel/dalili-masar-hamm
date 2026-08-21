import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Users, UserCircle, CalendarClock, ListChecks } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — دليلي" },
      { name: "description", content: "إعدادات التطبيق والتحكم في المحتوى." },
    ],
  }),
  component: SettingsPage,
});

const items = [
  {
    to: "/my-routine" as const,
    title: "روتين يومنا",
    subtitle: "ابنِ محطات يومكم من أحداث الحياة اليومية",
    icon: CalendarClock,
  },
  {
    to: "/active-participations" as const,
    title: "المشاركات النشطة",
    subtitle: "تابعوا ما تشاركون فيه حالياً وسجّلوا إنجاز اليوم",
    icon: ListChecks,
  },
  {
    to: "/settings/add-event" as const,
    title: "إضافة حدث جديد",
    subtitle: "ابدأ بإنشاء حدث أو فرصة مشاركة جديدة",
    icon: PlusCircle,
  },
  {
    to: "/settings/family" as const,
    title: "ملف الأسرة",
    subtitle: "بيانات الأسرة والشاب أو الشابة",
    icon: Users,
  },
  {
    to: "/account" as const,
    title: "حساب الأسرة",
    subtitle: "الدخول والخروج وحفظ بيانات أسرتكم",
    icon: UserCircle,
  },
];

function SettingsPage() {
  return (
    <PageShell title="الإعدادات" subtitle="إدارة المحتوى والتفضيلات">
      <div className="space-y-4">
        {items.map(({ to, title, subtitle, icon: Icon }) => (
          <Link key={to} to={to}>
            <Card className="transition-all hover:shadow-card-soft active:scale-[0.99]">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground">{title}</h2>
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}

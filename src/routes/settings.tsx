import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Settings } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "الإعدادات — دليلي" },
      { name: "description", content: "إعدادات التطبيق والتحكم في المحتوى." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <PageShell
      title="الإعدادات"
      subtitle="إدارة المحتوى والتفضيلات"
    >
      <div className="space-y-4">
        <Link to="/settings/add-event">
          <Card className="transition-all hover:shadow-card-soft active:scale-[0.99]">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
                <PlusCircle className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-foreground">
                  إضافة حدث جديد
                </h2>
                <p className="text-sm text-muted-foreground">
                  ابدأ بإنشاء حدث أو فرصة مشاركة جديدة
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </PageShell>
  );
}

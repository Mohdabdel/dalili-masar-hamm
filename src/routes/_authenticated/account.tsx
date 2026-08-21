import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "حساب الأسرة — دليلي" },
      {
        name: "description",
        content: "معلومات حساب الأسرة في دليلي والخروج من الحساب على هذا الجهاز.",
      },
      { property: "og:title", content: "حساب الأسرة — دليلي" },
      {
        property: "og:description",
        content: "معلومات حساب الأسرة في دليلي والخروج من الحساب على هذا الجهاز.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <PageShell title="حساب الأسرة" subtitle="بيانات الدخول الخاصة بأسرتكم">
      <Card>
        <CardContent className="space-y-4 p-5">
          <div>
            <p className="text-xs text-muted-foreground">البريد المسجّل</p>
            <p dir="ltr" className="mt-1 text-start text-base font-semibold text-foreground">
              {email ?? "..."}
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            روتين يومكم ومشاركاتكم محفوظة لهذا الحساب وحده، ولا تظهر لأي أسرة أخرى.
          </p>
          <Button variant="outline" onClick={signOut} className="h-12 w-full text-base">
            الخروج من الحساب
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  );
}

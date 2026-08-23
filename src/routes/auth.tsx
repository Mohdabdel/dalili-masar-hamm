import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "الدخول لحساب الأسرة — دليلي" },
      {
        name: "description",
        content: "سجّل دخول أسرتك لحفظ الروتين اليومي والمشاركات الخاصة بكم في دليلي.",
      },
      { property: "og:title", content: "الدخول لحساب الأسرة — دليلي" },
      {
        property: "og:description",
        content: "سجّل دخول أسرتك لحفظ الروتين اليومي والمشاركات الخاصة بكم في دليلي.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/", replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("تم إنشاء حساب الأسرة");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) navigate({ to: "/", replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "تعذّر إتمام الطلب";
      toast.error(
        message.includes("Invalid login") ? "البريد أو كلمة المرور غير صحيحة" : message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md">
        <div className="mb-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => router.history.back()}
            className="inline-flex min-h-11 items-center gap-1 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            aria-label="رجوع"
          >
            <ChevronRight className="h-4 w-4" />
            رجوع
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 py-2 text-sm font-semibold text-primary hover:underline"
          >
            <Home className="h-4 w-4" />
            الرئيسية
          </Link>
        </div>
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold text-primary shadow-card-soft">
            <span className="text-2xl font-bold">د</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">حساب الأسرة في دليلي</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            الدخول يحفظ روتين يومكم ومشاركاتكم في مكان خاص بأسرتكم وحدها.
          </p>
        </div>

        <Card>
          <CardContent className="p-5">
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-base"
                />
              </div>
              <Button type="submit" disabled={loading} className="h-12 w-full text-base">
                {loading
                  ? "جارٍ التنفيذ..."
                  : mode === "signin"
                    ? "تسجيل الدخول"
                    : "إنشاء حساب الأسرة"}
              </Button>
            </form>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-4 w-full text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {mode === "signin"
                ? "ليس لديكم حساب؟ إنشاء حساب أسرة جديد"
                : "لديكم حساب بالفعل؟ تسجيل الدخول"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

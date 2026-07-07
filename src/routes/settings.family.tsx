import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/family")({
  head: () => ({
    meta: [
      { title: "ملف الأسرة — دليلي" },
      { name: "description", content: "بيانات الأسرة والشاب أو الشابة." },
    ],
  }),
  component: FamilyProfilePage,
});

const STORAGE_KEY = "dalili-family-profile";

type Profile = {
  familyName: string;
  learnerName: string;
  age: string;
  supportLevel: string;
  communication: string;
  notes: string;
};

const EMPTY: Profile = {
  familyName: "",
  learnerName: "",
  age: "",
  supportLevel: "",
  communication: "",
  notes: "",
};

function FamilyProfilePage() {
  const [profile, setProfile] = useState<Profile>(EMPTY);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  const update = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      toast("تم حفظ ملف الأسرة محلياً");
    } catch {
      toast("تعذر الحفظ");
    }
  };

  return (
    <PageShell
      title="ملف الأسرة"
      subtitle="بيانات محلية على هذا الجهاز"
      breadcrumbs={[
        { label: "الإعدادات", to: "/settings" },
        { label: "ملف الأسرة" },
      ]}
    >
      <div className="mb-4 flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">نموذج أولي</Badge>
      </div>

      <Card>
        <CardContent className="space-y-5 p-5">
          <Field label="اسم الأسرة" id="family-name">
            <Input
              id="family-name"
              value={profile.familyName}
              onChange={(e) => update("familyName", e.target.value)}
              className="text-right"
            />
          </Field>

          <Field label="اسم الشاب/الشابة" id="learner-name">
            <Input
              id="learner-name"
              value={profile.learnerName}
              onChange={(e) => update("learnerName", e.target.value)}
              className="text-right"
            />
          </Field>

          <Field label="العمر" id="age">
            <Input
              id="age"
              type="number"
              value={profile.age}
              onChange={(e) => update("age", e.target.value)}
              className="text-right"
            />
          </Field>

          <Field label="مستوى الدعم العام" id="support">
            <Select
              value={profile.supportLevel}
              onValueChange={(v) => update("supportLevel", v)}
            >
              <SelectTrigger id="support" className="text-right">
                <SelectValue placeholder="اختر مستوى الدعم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">عالٍ</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">بسيط</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="طريقة التواصل المفضلة" id="comm">
            <Select
              value={profile.communication}
              onValueChange={(v) => update("communication", v)}
            >
              <SelectTrigger id="comm" className="text-right">
                <SelectValue placeholder="اختر طريقة التواصل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verbal">لفظي</SelectItem>
                <SelectItem value="visual">بصري</SelectItem>
                <SelectItem value="tablet">جهاز لوحي</SelectItem>
                <SelectItem value="sign">إشارة</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field label="ملاحظات" id="notes">
            <textarea
              id="notes"
              rows={3}
              value={profile.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-right text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </Field>
        </CardContent>
      </Card>

      <Button onClick={save} className="mt-6 w-full gap-2 text-lg font-bold" size="lg">
        <Save className="h-5 w-5" />
        حفظ
      </Button>

      <p className="mt-4 text-center text-sm leading-relaxed text-muted-foreground">
        سيتم دعم الحفظ السحابي وتسجيل الدخول في إصدار لاحق.
      </p>
    </PageShell>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-base font-bold">
        {label}
      </Label>
      {children}
    </div>
  );
}

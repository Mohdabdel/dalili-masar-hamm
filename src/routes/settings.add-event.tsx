import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings/add-event")({
  head: () => ({
    meta: [
      { title: "إضافة حدث جديد — دليلي" },
      { name: "description", content: "أضف حدثاً أسرياً مخصصاً واحفظه على هذا الجهاز." },
      { property: "og:title", content: "إضافة حدث جديد — دليلي" },
      {
        property: "og:description",
        content: "أضف حدثاً أسرياً مخصصاً واحفظه على هذا الجهاز.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AddEventPage,
});

const STORAGE_KEY = "dalili-custom-events";

function AddEventPage() {
  const [name, setName] = useState("");
  const [type, setType] = useState("home");
  const [domain, setDomain] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState("");
  const [notes, setNotes] = useState("");

  const canSave = name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const next = Array.isArray(list) ? list : [];
      next.push({
        name: name.trim(),
        type,
        domain,
        location: location.trim(),
        level,
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setName("");
      setLocation("");
      setNotes("");
      toast("تم حفظ الحدث على هذا الجهاز");
    } catch {
      toast("تعذر الحفظ");
    }
  };

  return (
    <PageShell
      title="إضافة حدث جديد"
      subtitle="أضف حدثاً أسرياً مخصصاً يُحفظ على هذا الجهاز."
      breadcrumbs={[
        { label: "الإعدادات", to: "/settings" },
        { label: "إضافة حدث جديد" },
      ]}
    >
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-6 p-5">

            {/* اسم الحدث */}
            <div className="space-y-2">
              <Label htmlFor="event-name" className="text-base font-bold">
                اسم الحدث
              </Label>
              <Input
                id="event-name"
                placeholder="مثال: اليوم يوم غسل الملابس"
                className="text-right"
              />
            </div>

            {/* نوع الحدث */}
            <div className="space-y-2">
              <Label className="text-base font-bold">نوع الحدث</Label>
              <RadioGroup
                defaultValue="home"
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="home" id="type-home" />
                  <Label htmlFor="type-home" className="cursor-pointer font-medium">
                    منزلي
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="community" id="type-community" />
                  <Label htmlFor="type-community" className="cursor-pointer font-medium">
                    مجتمعي
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* المجال */}
            <div className="space-y-2">
              <Label htmlFor="domain" className="text-base font-bold">
                المجال
              </Label>
              <Select>
                <SelectTrigger id="domain" className="text-right">
                  <SelectValue placeholder="اختر المجال" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home-mgmt">إدارة المنزل</SelectItem>
                  <SelectItem value="food-mgmt">إدارة الغذاء</SelectItem>
                  <SelectItem value="health-mgmt">إدارة الصحة المنزلية</SelectItem>
                  <SelectItem value="safety">السلامة المنزلية</SelectItem>
                  <SelectItem value="time-routine">إدارة الوقت والروتين</SelectItem>
                  <SelectItem value="family">المشاركة الأسرية</SelectItem>
                  <SelectItem value="garden">الحديقة والزراعة</SelectItem>
                  <SelectItem value="pets">رعاية الحيوانات الأليفة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* المكان */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-bold">
                المكان
              </Label>
              <Input
                id="location"
                placeholder="مثال: غرفة الغسيل"
                className="text-right"
              />
            </div>

            {/* مستوى المشاركة الابتدائي */}
            <div className="space-y-2">
              <Label htmlFor="participation-level" className="text-base font-bold">
                مستوى المشاركة الابتدائي
              </Label>
              <Select>
                <SelectTrigger id="participation-level" className="text-right">
                  <SelectValue placeholder="اختر المستوى" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="guided">موجه (مع تلميح مباشر)</SelectItem>
                  <SelectItem value="shared">مشترك (مع مساندة بسيطة)</SelectItem>
                  <SelectItem value="independent">مستقل (أداء ذاتي)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ملاحظات الأسرة */}
            <div className="space-y-2">
              <Label htmlFor="family-notes" className="text-base font-bold">
                ملاحظات الأسرة
              </Label>
              <textarea
                id="family-notes"
                rows={3}
                placeholder="أضف أي ملاحظة تساعد على تنفيذ الحدث..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-right text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        {/* زر الحفظ */}
        <Button
          disabled
          className="w-full gap-2 text-lg font-bold"
          size="lg"
        >
          <Save className="h-5 w-5" />
          حفظ
        </Button>

        {/* رسالة أسفل الصفحة */}
        <p className="text-center text-sm leading-relaxed text-muted-foreground">
          سيتم دعم إنشاء أحداث مخصصة وربطها ببطاقات المشاركة فى إصدار لاحق.
        </p>
      </div>
    </PageShell>
  );
}

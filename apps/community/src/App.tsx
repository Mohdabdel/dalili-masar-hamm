import { useMemo } from "react";
import { ServiceDirectory } from "@/components/ServiceDirectory";
import { getCommunityServices } from "@/lib/service-directories";

export default function App() {
  const services = useMemo(() => getCommunityServices(), []);

  return (
    <div dir="rtl" className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto w-full max-w-3xl px-4 py-6">
          <h1 className="text-2xl font-bold">مصادر الدعم المجتمعي</h1>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            دليل وصول للخدمات والمرافق والمبادرات المجتمعية
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-6">
        <ServiceDirectory
          intro="هذا الدليل يساعد الأسرة على الوصول إلى الخدمات المجتمعية المتاحة. يعرض معلومات وصول فقط، دون تقييم أو ترتيب أو تفضيل لأي جهة، وتُوضَّح حالة التحقق من كل خدمة بشفافية."
          services={services}
          emptyTitle="لا توجد نتائج مطابقة"
          emptyBody="جرّب تعديل كلمة البحث أو إعادة ضبط المرشحات لعرض الخدمات المتاحة."
        />
      </main>
    </div>
  );
}

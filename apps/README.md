# مشاريع مسار همم المستقلة

هذا المجلد يحتوي على الخدمات التي فُصلت عن دليلي لتصبح تطبيقات مستقلة قابلة
للبناء والنشر على نطاقات فرعية منفصلة.

```
/                     → دليلي (TanStack Start)         app.masarhemmam.com
/apps/education       → مصادر الدعم التعليمي (Vite SPA) education.masarhemmam.com
/apps/community       → مصادر الدعم المجتمعي (Vite SPA) community.masarhemmam.com
```

كل تطبيق داخل `apps/` مستقل تمامًا:

- له `package.json` و`tsconfig.json` و`vite.config.ts` و`index.html` خاصة به.
- لا يستورد أي ملف من `../../src` (لا يحتاج دليلي للتشغيل).
- يحمل نسخته الخاصة من ملفات CSV والمكوّنات وأنماط Tailwind.

## البناء والتشغيل

```bash
cd apps/education   # أو apps/community
bun install
bun run dev         # تطوير محلي على المنفذ 8080
bun run build       # مخرجات ثابتة في dist/
bun run preview
```

- **Entry point:** `index.html` → `src/main.tsx` → `src/App.tsx`
- **مخرجات النشر:** مجلد `dist/` (ملفات ثابتة، بدون خادم)
- **متغيرات البيئة:** لا يوجد أي متغير مطلوب (لا Supabase، لا مفاتيح، لا شبكة).
- **المسارات:** كل تطبيق صفحة واحدة `/` (بدون موجّه)، لذا لا يحتاج قواعد
  إعادة توجيه SPA. أي استضافة ملفات ثابتة تكفي.

## ربط النطاق الفرعي لاحقًا

1. انشر مجلد `dist/` لكل تطبيق على مزود استضافة ثابتة.
2. أضف سجل CNAME للنطاق الفرعي المطلوب (`education` / `community`) نحو
   المضيف الذي يوفره المزود.
3. لم تُنشأ أي سجلات DNS ضمن هذه المهمة.

## المحتوى

- مصدر البيانات لكل تطبيق: `src/data/support-directories/*.csv`
  (نسخة كاملة مطابقة للبيانات الأصلية — لم يُحذف أي سجل أثناء الفصل).
- المكوّنات: `ServiceDirectory` (الاثنان) و`ResourceDirectory` (التعليمي فقط).

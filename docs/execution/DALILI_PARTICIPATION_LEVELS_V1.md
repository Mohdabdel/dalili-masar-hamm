# DALILI-PARTICIPATION-LEVELS-01 — مستويات المشاركة v1.0

## 1. التعريف
مستوى المشاركة يصف **فرصة المشاركة نفسها**، لا قدرة الشخص:

| المفتاح | التسمية | الوصف |
|---|---|---|
| simple | مستوى مشاركة بسيط | دور واحد محدود وواضح، خطوات قليلة مباشرة، بداية ونهاية واضحتان. |
| moderate | مستوى مشاركة متوسط | جزء وظيفي متكامل من الحدث، عدة إجراءات مترابطة أو بعض الاختيارات. |
| advanced | مستوى مشاركة متقدم | دور ممتد أو مسؤولية عن مرحلة كبيرة، تنظيم أو قرارات ومتابعة أو تنسيق عناصر متعددة. |

## 2. أبعاد التصنيف
1. **حجم الدور** (`role_scope`) — من فعل واحد إلى مرحلة كاملة.
2. **الترابط والتنظيم** (`organization_demand`) — عدد الخطوات المترابطة وتسلسلها.
3. **الاختيار والتكيف** (`variation_demand`) — وجود قرارات أو بدائل أو تعديل حسب الموقف.

القاعدة: يُعتمد المستوى الذي تتفق عليه أغلبية الأبعاد (2 من 3). عند اختلاف الأبعاد الثلاثة يُعتمد المستوى المتوسط ويُعلَّم السجل `review_required=true`.

## 3. مصدر الحقيقة
`src/data/knowledge/03_participation_opportunities.csv` — أعمدة مضافة:
`participation_level, role_scope, organization_demand, variation_demand, classification_reason, review_required`.

جميع الفرص (1413) مصنَّفة، بلا قيم فارغة.

### التوزيع
- بسيط: 352
- متوسط: 915
- متقدم: 146
- حالات حدودية للمراجعة اليدوية: 178

## 4. طبقة البيانات
`src/lib/knowledge-base.ts`:
- `PARTICIPATION_LEVEL_KEYS`, `participationLevelLabel`, `participationLevelDescription`
- `isParticipationLevel`, `filterDomainsByLevel`, `getAllOpportunities`, `countOpportunitiesByLevel`

الفلترة تحافظ على العلاقة domain → event → opportunity → card ولا تكسر أي بطاقة.

## 5. مسار المستخدم
`/activities` → «ابدأ الآن» → `/activities/level` (اختيار المستوى) → `/activities/options` (ثلاث طرق) → `/activities/browse?level=&view=domains|today|all`.

المستوى يُمرَّر في الـ URL؛ أي قيمة غير صالحة تعود إلى «جميع المستويات» دون كسر الصفحة.

## 6. ملاحظات حوكمة
- المستوى تصنيف للفرصة، ولا يُستخدم كتشخيص أو تقييم للشخص.
- درجات الدعم داخل البطاقة (موجهة / مستقلة جزئياً / مستقلة) تبقى مستقلة عن مستوى الفرصة.
- الحالات الحدودية (178) قابلة للمراجعة عبر العمود `review_required` دون تعديل الكود.

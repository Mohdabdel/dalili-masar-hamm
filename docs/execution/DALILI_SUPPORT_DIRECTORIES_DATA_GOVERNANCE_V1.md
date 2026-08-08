# DALILI — Support Directories Data Governance V1

**المهمة:** DALILI-SUPPORT-DIRECTORIES-PRODUCTION-INJECTION-01
**الإصدار:** Baseline v1.0 — 2026-08-09

## 1. القاعدة الحاكمة: Structure Frozen — Content Mutable

- الهيكل (التبويبات الثلاثة، المسارات، المكوّنات) **مجمّد**: أي تحديث للمحتوى يجب ألا يتطلب تعديل مكوّن واجهة.
- المحتوى **قابل للتغيير**: يتم عبر ملفات CSV فقط، أو عبر واجهات الطبقة البرمجية (`upsertRecord` / `deactivateRecord` / `importDirectoryCsv`).
- ممنوع وضع أي بيانات جهات أو خدمات أو مصادر داخل ملفات المكوّنات.

## 2. مصدر الحقيقة

`src/data/support-directories/`

| الملف | الكيان | العدد في v1.0 |
| --- | --- | --- |
| `01_providers.csv` | مقدمو الخدمة | 36 |
| `02_services.csv` | الخدمات | 36 |
| `03_resources.csv` | المصادر التعليمية | 43 |
| `04_collections.csv` | التجميعات | 0 (رأس أعمدة فقط — لا تُختلق تجميعات) |

طبقة القراءة والعلاقات: `src/lib/service-directories.ts`
العلاقة: `Provider (1) → Services (N)`. المصادر (`Resources`) كيان مستقل ولا يرتبط بمقدم خدمة.

## 3. الحقول

**حقول الإدارة التشغيلية (في كل الكيانات):**
`is_active`, `featured`, `display_order`, `last_verified`, `verification_status`, `updated_at`.

**حقول الخدمات الخاصة:**
`service_completeness`, `user_priority`, `confidence_level`, `access_method`, `service_scope`, `target_age_if_stated`.

**حقول المصادر الخاصة:**
`resource_type`, `publisher`, `target_audience`, `quality_notes`, `confidence_level`, `service_completeness`, `official_url`.

## 4. قواعد التحديث

1. **لا حذف نهائيًا.** إيقاف أي سجل يتم عبر `is_active=false` فقط؛ يبقى السجل في الملف للتأريخ.
2. **المعرفات ثابتة.** `P_xxx` / `S_xxx` / `R_xxx` لا يُعاد استخدامها ولا تتغير.
3. **لا اختلاق بيانات.** أي قيمة غير موثقة تبقى فارغة أو `NOT_FOUND`.
4. **`display_order`** ترتيب عرض ثابت قابل للتعديل داخل المجال: HIGH ثم MEDIUM ثم LOW. ليس ترتيب جودة ولا تفضيل.
5. **`featured`** تعني «أولوية عرض» فقط، وتُمنح حين `user_priority=HIGH` و`service_completeness=COMPLETE`. لا تُستخدم أبدًا بلغة «موصى به» أو «الأفضل».
6. **لا لغة ترتيب أو تقييم** في الواجهة: لا نجوم، لا «الأفضل»، لا توصية ضمنية.

## 5. سياسة last_verified / verification_status

- `last_verified` تاريخ آخر تحقق فعلي من الرابط/المعلومة. دفعة v1.0 = `2026-08-09`.
- `verification_status` **مشتق** من `confidence_level` ولا يُنشأ يدويًا:
  - `PRIMARY VERIFIED` → `VERIFIED`
  - `PRIMARY + SECONDARY` → `VERIFIED`
  - `SECONDARY ONLY` → `UNVERIFIED`
- `updated_at` تاريخ آخر تعديل على السجل نفسه. دفعة v1.0 = `2026-08-09`.

## 6. سياسة الشفافية أمام المستخدم

- `service_completeness = COMPLETE` → تُعرض كخدمة ببيانات مكتملة.
- `NEARLY_COMPLETE` أو `PARTIAL` → تُعرض بشارة **«قيد استكمال التحقق»** ولا تُقدَّم كخدمة مكتملة.
- الروابط الخارجية تُفتح دائمًا في نافذة جديدة مع `rel="noopener noreferrer"`.

## 7. حدود الفصل

- قسما «مصادر الدعم المجتمعي» و«مصادر الدعم التعليمي» **غير مرتبطين** ببطاقات المشاركة الحياتية أو فرص المشاركة أو ملفات المعرفة 01–04.
- المصادر التعليمية لا تُخلط مع مقدمي الخدمات: تبويب مستقل داخل `/education-support`.

## 8. فحص السلامة

`checkDirectoryIntegrity()` في `src/lib/service-directories.ts` يعيد: عدد السجلات، معرفات الخدمات اليتيمة (بلا مزوّد)، والمعرفات المكررة. يجب أن يكون Orphans = 0 و Duplicates = 0 قبل أي دفعة.

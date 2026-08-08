# DALILI — Support Directories Pre-Injection Snapshot

**التاريخ:** 2026-08-09
**المهمة:** DALILI-SUPPORT-DIRECTORIES-PRODUCTION-INJECTION-01
**الغرض:** توثيق الحالة قبل حقن البيانات الفعلية (Baseline v1.0).

## الحالة قبل التنفيذ

| العنصر | الحالة |
| --- | --- |
| `src/lib/service-directories.ts` | طبقة ثابتة تحتوي على مصفوفتين فارغتين `COMMUNITY_PROVIDERS` و`EDUCATION_PROVIDERS` وتصنيفات hard-coded |
| `src/components/ServiceDirectory.tsx` | واجهة عامة تستقبل `categories` و`providers` كخصائص، تعرض Empty State |
| `/community-support` | يعرض Empty State — لا توجد جهات |
| `/education-support` | يعرض Empty State — لا توجد جهات، ولا فصل بين المزودين والمصادر |
| ملفات بيانات الأدلة | غير موجودة (`src/data/support-directories/` لم يكن منشأً) |
| عدد Providers | 0 |
| عدد Services | 0 |
| عدد Resources | 0 |

## ما لم يُمَس في هذه المهمة

- ملفات المعرفة `src/data/knowledge/01_domains.csv` … `04_participation_cards.csv`.
- رحلة «دليلي للمشاركة الحياتية» بكامل مكوناتها (`ParticipationCard`, `TodayEvents`, `HomeHierarchy`, البحث الحالي).
- طبقة التنفيذ والأصول البصرية (`src/data/execution/*`, `visual-asset-catalog`).
- التبويبات الرئيسية الثلاثة وهيكل التنقل.

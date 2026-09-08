# DALILI — CODEX HANDOFF CURRENT

## الهدف
هذه الوثيقة هي نقطة التسليم الحالية إلى Codex. لا تستبدل وثائق الإطار المجمدة داخل المستودع، لكنها تثبت الحالة الحالية، القرارات المقبولة، آخر فشل موثق، وخطوة التنفيذ التالية.

## North Star
DALILI يساعد الأسرة على إنشاء وتهيئة فرص مشاركة حقيقية في الحياة اليومية للأشخاص ذوي الإعاقة.
المشاركة ليست تدريبًا أو علاجًا أو قياس جاهزية/إتقان/استقلالية. التعقيد يصف بنية الدور/الفرصة لا الشخص.

## النموذج المجمد
1. Event / life context
2. Functional Participation / functional role
3. Execution Blocks / how the role is carried out

الحدث الطبيعي ليس FP تلقائيًا، وExecution Block ليس FP لمجرد أنه قابل للملاحظة.

## القرارات D01–D08
- D01: Preferred Context حسب provenance؛ حالة الأسرة منفصلة عن المرجع غير القابل للتعديل.
- D02: عدم retrofit تلقائي لـ1413 Legacy Master؛ المرجع المتوافق مع الإطار نموذج مستقل.
- D03: Support taxonomy قابلة للتوسع: Category → Instance/Tool/Asset.
- D04: Family Participation identity مستقل عن Master ID؛ الأصل reference/easy_beginning/family_free.
- D05: Routine Station عدسة اكتشاف فقط، بلا completion/compliance/streak/performance semantics.
- D06: Learner القانوني مشتق من approved frozen Snapshot.
- D07: اختيار Snapshot صريح، وليس implicit latest.
- D08: provenance correctness blocker تم إصلاحه قبل الترحيل.

## ما تم إنجازه
- Foundations 01–08: PASS.
- PRE-MIGRATION SAFETY: PASS.
- Legacy Master بقي 1413/1413 دون تعديل.
- Golden Batch 01: 5/5 FP-valid.
- Batch 02: منهج الترحيل ثبت، مع 5 Green materialized بعد Discovery Gate.
- Framework Reference Discovery Gate 01: PASS.
- Contract frozen: 82 requirements في:
  `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
  SHA-256 المعروف عند الاستيراد:
  `693a0e688ebedee5ccdb945f06329f58777aff13bad925cee937415226e039fc`

## حالة المحتوى
Legacy corpus = 1413 عبر 6 مجالات.
تم بناء مكتبة Offline من 30 مرشحًا:
- الطعام 8
- التسوق 6
- المنزل 5
- المجتمع 5
- الصحة 2
- الملابس 4
- shared 23
- individual 7
- simple 8
- moderate 21
- advanced 1 provisional

## التصحيح المهم
أي نتيجة سابقة بعنوان “Content Candidate Gate = PASS” يجب تفسيرها الآن كالتالي:
**OFFLINE SEMANTIC PRE-GATE PASS — NOT PRODUCTION-CONTRACT COMPLETE**

## آخر نتيجة حاكمة
Production Canonical Content Validation Gate 01:
**CANONICAL VALIDATION FAIL**

الدليل:
- المدقق: `src/lib/framework/fp-validity.ts`
- الدوال: `evaluateFunctionalParticipation` / `isUsableFunctionalParticipation`
- العينة: 10 مرشحين ممثلين
- النتيجة: 10/10 FAIL
- السبب الرئيسي: `standalone_role_meaning` مفقود في 30/30
- FP-CAND-002 فشل أيضًا بسبب لفظ أداء/جاهزية
- C1–C4 في Offline كانت رقمية، بينما Production يطلب تمثيلًا نصيًا مؤلفًا
- `complexity_rationale` مفقود 30/30
- negative safety checks: PASS
- الاختبارات القائمة: 44/44 PASS
- Zero-write proof:
  - Legacy 1413→1413
  - framework_reference 15→15
  - active_participations 19→19
  - snapshots 32→32
  - runs 46→46
  - feedback 15→15

الاستنتاج:
لا دليل حاليًا على drift في Production framework نفسه. المشكلة في تمثيل Candidate Library خارج Production. لا يجوز تعديل validator كي تمر المرشحات.

## الموقع الحالي
**Expansion PAUSED**
نحن الآن في:
**Production Contract Alignment**

## آلية التنفيذ
**Build → Test → Audit → Continue**

## الخطوات التالية بالترتيب
1. Production Content Contract Extraction 01 — READ ONLY
   - استخراج الشكل الحقيقي لـ FunctionalParticipation
   - `standalone_role_meaning`
   - FP-06/FP-11
   - FP-07/FP-12
   - `complexity_dimensions`
   - `complexity_rationale`
   - Execution Blocks
2. بناء 3 مرشحين فقط: Simple + Moderate + Advanced.
3. Canonical validation.
4. لا متابعة إلا إذا 3/3 PASS.
5. عينة ممثلة للمجالات الستة.
6. تصحيح/اختبار الـ30 كاملة.
7. لا Controlled Expansion إلا بعد 30/30 contract-complete + canonical PASS.

## التوسع لاحقًا
التوسع ليس هدفه المحافظة على 1413 ولا بلوغ رقم اعتباطي. الهدف مكتبة مرجعية كافية ومتنوعة للاستخدام الأسري الحقيقي.

## بوابة كفاية المكتبة
تحتاج:
- تغطية المجالات الستة أو استثناء مبرر
- سياقات أسرية يومية ومتكررة متعددة
- individual + shared
- Simple + Moderate طبيعيان
- Advanced فقط عند تبرير C1–C4
- مخزون Easy Beginning جيد
- لا training/mastery/readiness/independence semantics
- لا تضخيم بالتكرار
- provenance وهوية FP مكتملان لكل مرجع منشور

## خارطة الطريق النهائية
Project Handoff / Governance Sync
→ Production Contract Alignment
→ 3/3 Canonical PASS
→ Representative Set PASS
→ 30/30 Content Pipeline PASS
→ Controlled Expansion
→ Reference Library Sufficiency PASS
→ Full Family Journey Acceptance
→ Final Governance & Data Audit
→ MVP Readiness Gate

MVP Ready يتطلب 4/4:
- Architecture Ready
- Content Ready
- Family Journey Ready
- Governance/Data Integrity Ready

## Guardrails لـCodex
- افحص المستودع قبل التعديل.
- فرّق بين Production الحالي وclean-room التاريخي.
- لا تفترض وجود artifact مفقود.
- STOP عند غموض المصدر/provenance.
- لا تجعل ability/readiness/independence/mastery/help/step count محددات للتعقيد.
- لا تجعل Event أو Execution Block FP لمجرد أنه طبيعي/observable.
- reference immutable، family state منفصل.
- snapshot immutable واختيار النسخة explicit.
- حافظ على Legacy Master والبيانات التاريخية.
- استخدم read-only audit قبل materialization.
- أي مهمة تمس البيانات يجب أن تعرض before/after counts.
- لا تعلن PASS دون evidence يطابق gate.

## أول تعليمات Codex
قبل أي تنفيذ:
1. اقرأ هذه الوثيقة.
2. اقرأ:
   `docs/audit/DALILI_FRAMEWORK_IMPLEMENTATION_CONTRACT_01.md`
3. اقرأ:
   `docs/audit/DALILI_PRODUCTION_CANONICAL_CONTENT_VALIDATION_GATE_01.md`
4. افحص:
   `src/lib/framework/fp-validity.ts`
5. قارن الواقع الحالي للمستودع بهذه الوثيقة.
6. صنّف artifacts المطلوبة إلى:
   PRESENT / MISSING / STALE-SUPERSEDED / CONFLICTING
7. إذا وُجد تعارض، STOP وأبلغ عنه قبل أي تعديل.

المهمة التالية المقصودة:
**Production Content Contract Extraction 01 — READ ONLY**

## ملاحظة نزاهة التسليم
هذه الوثيقة تلخص الحالة الحالية من تاريخ العمل، لكنها لا تثبت أن كل artifact المشار إليه موجود فعلًا ومرفوع إلى GitHub. التحقق الأول الذي يقوم به Codex يجب أن يثبت ذلك من المستودع نفسه.

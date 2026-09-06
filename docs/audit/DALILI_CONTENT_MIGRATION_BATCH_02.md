# DALILI CONTENT MIGRATION — BATCH 02
## LEGACY DECISION METHOD + MIGRATION PROTOCOL PILOT

Status: **PASS** — decision pilot completed. This is not a mass migration.
Mode: controlled / cost-aware / non-destructive. Legacy Master unchanged (1413 rows).

---

## 1. SOURCE GATE

PILOT SOURCE FOUND IN CURRENT PROJECT: **NO**
SOURCE FILE(S): none. A repository-wide search for the prior Repository Migration Pilot 01
artifacts (`rg -il "RECLASSIFY|QUARANTINE|NEEDS_CLARIFICATION|NEEDS CLARIFICATION"` across the
whole project) returned only `docs/audit/DALILI_PRODUCTION_CONTRACT_MATRIX_02.md`, which mentions
none of the 30 reviewed opportunities and contains no prior classifications.
EXACT PRIOR PILOT RECORDS RECOVERED: **0/30**

Per the Batch 02 instruction this absence is **not** a stop condition: the previous pilot is an
external historical artifact and is not required to pre-exist in this Production repository. The
old 30 were **not** reconstructed from memory. A new controlled sample was drawn instead, directly
from the current immutable Legacy Master.

## 2. SAMPLING METHOD

Deterministic and reproducible, no hand-picking:

1. Join `03_participation_opportunities.csv` to `02_events.csv` to obtain each opportunity's domain.
2. Order the six domains alphabetically by `domain_id`.
3. Within each domain, sort opportunities ascending by FNV-1a 32-bit hash of `opportunity_id`
   (tie-break: `opportunity_id` alphabetically).
4. Take the first three of each domain → 6 × 3 = **18**.

Selected: CLO-009-OP001, CLO-045-OP001, CLO-005-OP001, COMM-005-OP001, COMM-002-OP001,
COMM-005-OP003, FOOD-029-OP004, FOOD-089-OP003, FOOD-089-OP002, HEALTH-105-OP001,
HEALTH-050-OP001, HEALTH-014-OP001, HOME-025-OP002, HOME-025-OP003, HOME-065-OP002,
SHOP-041-OP001, SHOP-066-OP001, SHOP-019-OP002.

DOMAINS COVERED: **6** (DOM-CLO, DOM-COMM, DOM-FOOD, DOM-HEALTH, DOM-HOME, DOM-SHOP).
All 18 began as `legacy_master`. No Golden ID, no `framework_reference` record, no special casing.

### Pattern coverage (honest)

| Pattern | Present | Example |
|---|---|---|
| A strong apparent FP | YES | COMM-002-OP001 |
| B Event-like row | YES | CLO-005-OP001, CLO-009-OP001, CLO-045-OP001 |
| C Execution-Block-like row | YES | FOOD-089-OP003, SHOP-041-OP001 |
| D contextual condition/state | NO | not produced by the sample |
| E training/learning objective wording | YES | CLO-009-OP001, FOOD-089-OP002 |
| F title duplicating parent Event | YES | three CLO rows (exact string match) |
| G shared participation candidate | YES | COMM-005-OP001 |
| H structurally Simple candidate | YES | COMM-002-OP001, HEALTH-014-OP001 |
| I structurally Moderate candidate | YES | SHOP-066-OP001, SHOP-019-OP002 |
| J possible Advanced candidate | NO | **not manufactured** |
| K ambiguous/incomplete context | YES | three HOME rows (no card at all) |
| L candidate requiring split | NO | no row contained two separable semantic objects |

## 3. DECISION TABLE (18 rows)

| Legacy ID | العنوان | المجال | FP Valid (خام) | Disposition | Target Type | Mode | C1–C4 | Complexity | Leakage | Event Dup. | Confidence | Routing | Materialized | Framework Ref ID | السبب |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CLO-009-OP001 | تغيير الملابس بعد اتساخها أو تبللها | DOM-CLO | NO | RECLASSIFY | EVENT | unknown | — | UNKNOWN | YES — هوية | SEMANTIC_DUPLICATION | HIGH | AMBER | NO | — | اسم الفرصة مطابق حرفياً لاسم الحدث CLO-009، وهي الفرصة الوحيدة فيه؛ فالصف يمثّل الحدث نفسه لا دوراً داخله (FP-10). |
| CLO-045-OP001 | تخزين وترتيب الإكسسوارات (أحزمة، أوشحة، ربطات) | DOM-CLO | NO | RECLASSIFY | EVENT | unknown | — | UNKNOWN | YES — هوية | SEMANTIC_DUPLICATION | HIGH | AMBER | NO | — | اسم الفرصة مطابق حرفياً لاسم الحدث CLO-045. |
| CLO-005-OP001 | اختيار ملابس النوم | DOM-CLO | NO | RECLASSIFY | EVENT | unknown | — | UNKNOWN | YES — هوية | SEMANTIC_DUPLICATION | HIGH | AMBER | NO | — | اسم الفرصة مطابق حرفياً لاسم الحدث CLO-005. |
| COMM-005-OP001 | تحديد موعد ومكان اللقاء الأسري | DOM-COMM | NO | EDIT | — | shared | C1 عنصران؛ C2 مواءمة آراء؛ C3 خيارات متغيرة؛ C4 بدائل غير محسومة | moderate | YES — عرض فقط | NONE | HIGH | GREEN | YES | FR-B02-COMM-005-OP001 | الغرض والخطوات والمؤشرات تصف قراراً أسرياً مشتركاً بموعد ومكان، متميّزاً عن الحدث «لقاء أسري خارج المنزل». |
| COMM-002-OP001 | تجهيز أغراض النزهة | DOM-COMM | NO | EDIT | — | individual | C1 عدة أغراض؛ C2 لا تزامن؛ C3 قائمة معتادة؛ C4 لا بدائل | simple | YES — عرض فقط | NONE | HIGH | GREEN | YES | FR-B02-COMM-002-OP001 | أثر ملحوظ صريح (الحقيبة مجهّزة) ونهاية طبيعية (لم يبقَ غرض)، ومتميّز عن الحدث «زيارة الحديقة». |
| COMM-005-OP003 | اختيار مقعد للجلوس مع المجموعة | DOM-COMM | NO | EDIT | — | individual | — | UNKNOWN | YES — عرض فقط | NONE | MEDIUM | AMBER | NO | — | دور رفيع الحدود: قد يقرأ كخطوة تنفيذ داخل اللقاء لا كدور مستقل. |
| FOOD-029-OP004 | ترتيب القطع في صينية الخبز | DOM-FOOD | NO | RECLASSIFY | EXECUTION_BLOCK | unknown | — | UNKNOWN | YES — عرض فقط | NONE | MEDIUM | AMBER | NO | — | الخطوة جزء متسلسل داخل «إعداد مخبوزات منزلية» وتنتهي بدخول الصينية للفرن ضمن الدور الأكبر. |
| FOOD-089-OP003 | وضع المريول في سلة الغسيل | DOM-FOOD | NO | RECLASSIFY | EXECUTION_BLOCK | unknown | — | UNKNOWN | YES — عرض فقط | NONE | HIGH | AMBER | NO | — | فعل واحد («حمل المريول، وضعه في السلة») يمثّل الخطوة الأخيرة من الحدث FOOD-089. |
| FOOD-089-OP002 | معالجة البقع الظاهرة بصابون مركز | DOM-FOOD | NO | RECLASSIFY | EXECUTION_BLOCK | unknown | — | UNKNOWN | YES — عرض فقط | NONE | MEDIUM | AMBER | NO | — | خطوة داخل الحدث نفسه، وغرضها مصوغ تعلّمياً («ليتعلّم خطوة بسيطة»). |
| HEALTH-105-OP001 | ارتداء الضمادة الضاغطة أو الحمالة حسب التعليمات | DOM-HEALTH | NO | QUARANTINE | — | unknown | — | UNKNOWN | YES — هوية | NONE | HIGH | RED | NO | — | «ارتداء وفق التوجيه المباشر»، و«الطبيب أو الممرض هو من يحدد الطريقة»، والمشاركة مشروطة بإشراف طبي دائم. |
| HEALTH-050-OP001 | التوجه لمركز العلاج | DOM-HEALTH | NO | NEEDS_CLARIFICATION | — | unknown | — | UNKNOWN | YES — عرض فقط | NONE | LOW | AMBER | NO | — | «التوجه للمركز، الدخول» بلا أثر ملحوظ ولا نهاية طبيعية يمكن اشتقاقها دون تخمين. |
| HEALTH-014-OP001 | ضبط منبه لموعد الدواء | DOM-HEALTH | NO | EDIT | — | individual | C1 وقت واحد؛ C2 لا تنسيق؛ C3 ثابت؛ C4 لا بدائل | simple | YES — عرض فقط | NONE | HIGH | GREEN | YES | FR-B02-HEALTH-014-OP001 | نتيجة مرئية مباشرة (منبّه مضبوط على وقت الجرعة) ونهاية طبيعية (حُفظ المنبّه). |
| HOME-025-OP002 | تمرير المكنسة الكهربائية | DOM-HOME | NO | NEEDS_CLARIFICATION | — | unknown | — | UNKNOWN | NO | NONE | LOW | AMBER | NO | — | لا توجد بطاقة مرافقة؛ العنوان وحده هو كل الدليل، ولا يحلّه قارئ الإنتاج أصلاً (فرصة معلّقة). |
| HOME-025-OP003 | معالجة البقع السطحية بالمنظف والإسفنجة | DOM-HOME | NO | NEEDS_CLARIFICATION | — | unknown | — | UNKNOWN | NO | NONE | LOW | AMBER | NO | — | لا توجد بطاقة مرافقة؛ العنوان وحده هو كل الدليل. |
| HOME-065-OP002 | تداخل الحقائب الصغيرة داخل الكبيرة | DOM-HOME | NO | NEEDS_CLARIFICATION | — | unknown | — | UNKNOWN | NO | NONE | LOW | AMBER | NO | — | لا توجد بطاقة مرافقة؛ الصياغة تحتمل خطوة تنفيذ لكن بلا دليل كافٍ للحسم. |
| SHOP-041-OP001 | سحب العربة من منطقة التجمع | DOM-SHOP | NO | RECLASSIFY | EXECUTION_BLOCK | unknown | — | UNKNOWN | YES — عرض فقط | NONE | MEDIUM | AMBER | NO | — | «الإمساك بالمقبض، سحبها» بداية متسلسلة داخل الحدث «استخدام عربة التسوق»، والتالي لها «قيادة العربة». |
| SHOP-066-OP001 | توزيع عبوات الشامبو والصابون في الحمامات | DOM-SHOP | NO | EDIT | — | individual | C1 عبوات ووجهات؛ C2 مطابقة؛ C3 مشتريات متغيرة؛ C4 حسم بسيط | moderate | YES — عرض فقط | NONE | HIGH | GREEN | YES | FR-B02-SHOP-066-OP001 | أثر ملحوظ (العبوات في الحمامات) ونهاية طبيعية، ومتميّز عن الحدث «تخزين العناية الشخصية». |
| SHOP-019-OP002 | طلب تجربة الجهاز من البائع | DOM-SHOP | NO | EDIT | — | individual | C1 طرف خارجي؛ C2 مجاراة الاستجابة؛ C3 ردّ متغيّر؛ C4 حوار غير محدّد | moderate | YES — عرض فقط | NONE | HIGH | GREEN | YES | FR-B02-SHOP-019-OP002 | دور تواصلي مع طرف خارج الأسرة، أثره ملحوظ في المتجر ونهايته طبيعية. |

`FP Valid (خام)` is the seven-gate result on the **raw** legacy row with no field invention.
It is 0/18 because Legacy Master carries no life_context / functional_intent / observable_effect /
natural_completion fields at all — a schema fact, not a content verdict.

## 4. COUNTS

DISPOSITIONS: KEEP 0 · EDIT 6 · RECLASSIFY 7 · SPLIT 0 · NEEDS_CLARIFICATION 4 · QUARANTINE 1
ROUTING: GREEN 5 · AMBER 12 · RED 1
CONFIDENCE: HIGH 10 · MEDIUM 4 · LOW 4
LEGACY LEAKAGE: 15/18 (identity-level 4, presentation-only 11)
EVENT DUPLICATION: 3/18 SEMANTIC_DUPLICATION · 0 TITLE_ONLY · 15 NONE
DELETE used: NO (not an allowed disposition)

KEEP = 0 is a structural finding, not laziness: with the current Master schema no raw row can
satisfy the seven gates without authoring the identity fields, so bounded EDIT is the cheapest
compliant path and KEEP should be expected to stay near zero corpus-wide.

## 5. EDIT EVIDENCE (source → transformation → why meaning is preserved)

- **COMM-005-OP001 → FR-B02-COMM-005-OP001.** Source: purpose "تمنحه رأياً في تخطيط مناسبة
  اجتماعية"، steps "النظر إلى الخيارات، والإشارة إلى المكان أو الموعد المفضل"، indicator "أشار إلى
  تفضيله بين خيارين". Transformation: those sentences were restated as life_context / intent /
  observable effect / natural completion; nothing was added. Preservation: the role is still
  "المساهمة في تحديد موعد ومكان اللقاء" with the same effect; mode `shared` comes from the source's
  own framing of a family decision, not from an assumption.
- **COMM-002-OP001 → FR-B02-COMM-002-OP001.** Source: "إحضار كل غرض ووضعه في الحقيبة"، "ساهم في
  تجهيز الحقيبة كاملة". Transformation: effect = "أغراض النزهة مجموعة في الحقيبة"، completion =
  "لم يبقَ غرض خارج الحقيبة". Preservation: identical scope, no new object introduced.
- **HEALTH-014-OP001 → FR-B02-HEALTH-014-OP001.** Source: "فتح تطبيق المنبه، ضبط الوقت"، next step
  is a separate opportunity. Transformation: effect = "منبّه مضبوط على وقت الجرعة". Preservation:
  the boundary of the role is unchanged; the logging step was **not** absorbed.
- **SHOP-066-OP001 → FR-B02-SHOP-066-OP001.** Source: "حمل كل عبوة، توزيعها في الحمام المناسب"،
  "حدد الحمامات التي تحتاج تجهيزاً". Transformation: effect and completion phrased around the
  bottles reaching their bathrooms. Preservation: same objects, same destination logic.
- **SHOP-019-OP002 → FR-B02-SHOP-019-OP002.** Source: "التوجه للبائع، طلب تجربة الجهاز"، purpose
  "تواصلاً مباشراً خلال قرار شراء". Transformation: effect = "أحضر البائع الجهاز وشغّله".
  Preservation: the role remains the request itself, not the purchase decision.

In all five, the legacy assistance ladder (`participation_levels`) and the `indicators` field were
**excluded** from the materialized identity; they are presentation-layer legacy leakage.

## 6. RECLASSIFY / SPLIT / QUARANTINE NOTES

- RECLASSIFY → EVENT (3): the three CLO rows whose title is byte-identical to their parent event
  title and which are the only opportunity of that event. The row is the Event; it is not promoted
  to an FP merely to preserve it. No relocation was performed — this is classification evidence.
- RECLASSIFY → EXECUTION_BLOCK (4): FOOD-029-OP004, FOOD-089-OP003, FOOD-089-OP002, SHOP-041-OP001.
  Each is a sequenced fragment whose neighbouring fragments exist as sibling rows of the same event.
- SPLIT: 0. No sampled row contained two separable semantic objects. COMM-005-OP001 was examined
  for a موعد/مكان split and rejected: its own step text uses "المكان **أو** الموعد", i.e. a single
  choice act. No split was manufactured.
- QUARANTINE (1): HEALTH-105-OP001 — participation is defined as executing clinical instruction
  under continuous medical supervision. Publishing it as an independent Functional Participation
  would assert something the framework cannot support. It is retained, not deleted.

## 7. MATERIALIZATION RESULTS

FRAMEWORK REFERENCES MATERIALIZED: **5** (cap 5). AMBER materialized 0. RED materialized 0.

| Legacy source | Framework reference | Mode | Complexity |
|---|---|---|---|
| COMM-005-OP001 | FR-B02-COMM-005-OP001 | shared | moderate |
| COMM-002-OP001 | FR-B02-COMM-002-OP001 | individual | simple |
| HEALTH-014-OP001 | FR-B02-HEALTH-014-OP001 | individual | simple |
| SHOP-066-OP001 | FR-B02-SHOP-066-OP001 | individual | moderate |
| SHOP-019-OP002 | FR-B02-SHOP-019-OP002 | individual | moderate |

Implementation: `src/lib/framework/batch02-corpus.ts`. Each record is registered through
`registerFrameworkParticipation`, so it only exists after passing the seven gates (FP-09), and is
deep-frozen afterwards (IM-01). Lineage is machine-readable via `getMigrationLineage(id)` and
carries legacy_id, legacy_title, legacy_event_id, domain, batch, disposition, confidence, routing,
reference_source. The framework ID always differs from the legacy ID — no in-place conversion.
`classifyReferenceSource` now resolves these five as `framework_reference / frameworkValidated:true`
while their legacy sources stay `legacy_master / false`. No Advanced level was assigned.

## 8. IMMUTABILITY & NEGATIVE TESTS

| Check | Result |
|---|---|
| legacy rows mutated | NO (CSV untouched; 1413 before / 1413 after) |
| DELETE disposition used | NO |
| more than 18 legacy rows decision-reviewed | NO |
| more than 5 framework references written | NO (exactly 5) |
| AMBER materialized | NO |
| RED materialized | NO |
| missing identity guessed | NO |
| Advanced forced | NO |
| assistance used for complexity | NO |
| independence used for complexity | NO |
| step count used for complexity | NO |
| support count used for complexity | NO |
| Event silently promoted to FP | NO |
| Execution Block silently promoted to FP | NO |
| old snapshot rewritten | NO |
| mass migration started | NO |
| framework reference immutable | YES (write attempt throws, value unchanged) |
| family customization separate | YES (no family table touched) |
| database schema migration | NO |
| ROWS LOST | 0 |

## 9. DOWNSTREAM SMOKE

**NOT APPLICABLE — with a recorded finding.** Discovery reads Legacy Master (CSV) only;
`framework_reference` registry records — the Golden five from Batch 01 as well as these five — are
not surfaced in the family-facing Discovery lens. There is therefore no Discovery → Family
Participation → Workspace → Preview → Approval → Snapshot → Learner → Run path to exercise for a
Batch 02 record without first building a surfacing gate, which is explicitly out of this task's
scope and would be an architecture change, not content work. Recorded as **Protocol finding P-1**
below. No content was manufactured to force a smoke run, and no existing run/snapshot was touched.

## 10. REGRESSION RESULTS

Only the framework content registry, the source-boundary wiring, tests and audit artifacts changed;
no shared UI or product architecture was modified. Therefore targeted regression only:

`bunx vitest run src/lib/framework` → **40/40 passed** (fp-validity 14, golden-corpus 10,
pre-migration-safety 8, batch02-corpus 8). Typecheck clean. A full UI regression run was
deliberately skipped as unrelated and cost-inefficient, per §27.

## 11. AUTOMATION ASSESSMENT (cost scaling — no corpus dry run performed)

**DETERMINISTIC_AUTOMATABLE**
- source provenance classification (`classifyReferenceSource`)
- missing-field detection (no card / empty purpose / empty steps)
- exact Event-title duplication (`opportunity_name_ar == event_name`)
- legacy leakage token detection (fixed token list, with location = purpose vs display field)
- duplicate IDs and reference-ID collision
- seven-gate validator execution wherever a structured identity already exists
- reader-resolvability check (rows the production reader returns `null` for — 3/18 here)

**HEURISTIC_CANDIDATE_ONLY**
- Execution-Block-like detection from sibling sequencing and `whats_next` chaining
- shared-vs-individual mode suggestion from purpose wording
- split-candidate flagging from conjunctions in the title
- provisional complexity band from element/coordination cues

**HUMAN_SEMANTIC_REVIEW_REQUIRED**
- the KEEP / EDIT / RECLASSIFY / SPLIT / QUARANTINE decision itself
- authoring life_context, functional_intent, observable_effect, natural_completion
- final complexity level and the C1–C4 rationale
- any AMBER → GREEN promotion
- every QUARANTINE judgement

Projection from this sample: deterministic pre-screening alone can pre-sort roughly the 3 exact
event-duplications plus the 3 unresolvable rows (6/18 ≈ 33%) with zero semantic judgement, and can
attach leakage and gate evidence to all 18. Semantic FP decisions are **not** claimed automatable.

## 12. PROTOCOL FINDINGS

- **P-1 (publication gate missing).** Registry membership does not surface a record to families.
  A surfacing/publication gate must be designed before any batch can claim family-facing effect.
- **P-2 (schema forces EDIT).** Legacy Master has no framework identity fields, so KEEP ≈ 0
  corpus-wide. Batch budgeting should assume EDIT is the normal compliant path.
- **P-3 (leakage is mostly presentational).** 11/15 leakage hits sit in `participation_levels` /
  `indicators`. Excluding those two fields from identity authoring removes most FP-07/FP-12 risk
  cheaply, without a global fix to those requirements.
- **P-4 (event duplication is cheap to detect).** Exact title equality caught all three Event-like
  rows with no judgement.
- **P-5 (unresolvable rows are real).** Three sampled rows are not resolvable by the production
  reader at all; they must be counted as content debt, not as migration failures.

## 13. ACCEPTANCE QUESTIONS

| # | Question | Answer |
|---|---|---|
| 1 | Classify heterogeneous legacy rows without changing Master? | YES |
| 2 | FP vs Event vs Execution distinctions audible from evidence? | YES |
| 3 | Can the system refuse to invent missing meaning? | YES (4 NEEDS_CLARIFICATION, 0 guessed) |
| 4 | Does Green/Amber/Red prevent unsafe automatic publication? | YES (12 AMBER + 1 RED written 0 times) |
| 5 | Can valid GREEN become framework_reference without in-place mutation? | YES (5 new IDs, legacy untouched) |
| 6 | Does every published record retain lineage to its legacy source? | YES (5/5) |
| 7 | Reusable machine-readable manifest? | YES (`DALILI_CONTENT_MIGRATION_BATCH_02.json`) |
| 8 | Automatable checks identified without over-claiming? | YES |

## 14. BLOCKERS

None for the decision method. Open items before any corpus-wide publication: P-1 (publication
gate) and human semantic review of the 12 AMBER + 1 RED items.

## 15. NEXT RECOMMENDATION

**PROTOCOL VALIDATED — READY FOR CORPUS DRY RUN.** The corpus-wide dry run was NOT started, and
Batch 03 was NOT started.

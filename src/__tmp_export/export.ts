// أداة تصدير مؤقتة (قراءة فقط) — تُحذف بعد التشغيل.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { classifyReferenceSource } from "@/lib/framework/source-boundary";
import { discoverableFrameworkParticipations } from "@/lib/framework/discovery";
import { getMigrationLineage } from "@/lib/framework/batch02-corpus";

const DIR = "src/data/knowledge/";
const FILES = {
  domains: "01_domains.csv",
  events: "02_events.csv",
  opportunities: "03_participation_opportunities.csv",
  cards: "04_participation_cards.csv",
};

function parseCsv(text: string): Record<string, string>[] {
  const src = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { cur.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      cur.push(field); field = "";
      if (!(cur.length === 1 && cur[0] === "")) rows.push(cur);
      cur = [];
    } else field += ch;
  }
  if (field !== "" || cur.length > 0) {
    cur.push(field);
    if (!(cur.length === 1 && cur[0] === "")) rows.push(cur);
  }
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const o: Record<string, string> = {};
    headers.forEach((h, i) => (o[h] = (r[i] ?? "").trim()));
    return o;
  });
}

const raw = Object.fromEntries(
  Object.entries(FILES).map(([k, f]) => [k, readFileSync(DIR + f, "utf8")]),
) as Record<keyof typeof FILES, string>;
const domains = parseCsv(raw.domains);
const events = parseCsv(raw.events);
const opps = parseCsv(raw.opportunities);
const cards = parseCsv(raw.cards);

const domainById = new Map(domains.map((d) => [d.domain_id, d]));
const eventById = new Map(events.map((e) => [e.event_id, e]));
const cardsByOpp = new Map<string, Record<string, string>[]>();
for (const c of cards) {
  const list = cardsByOpp.get(c.opportunity_id) ?? [];
  list.push(c);
  cardsByOpp.set(c.opportunity_id, list);
}

const nz = (v: string | undefined) => (v && v.trim() !== "" ? v : null);
const norm = (s: string | null) =>
  s ? s.replace(/[\u064B-\u0652\u0640]/g, "").replace(/[إأآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/[^\p{L}\p{N} ]/gu, " ").replace(/\s+/g, " ").trim() : null;

const TOKENS = ["موجهة", "موجّهة", "مستقلة", "تعلم", "لتعلم", "لتعلّم", "تعلّم", "إتقان", "اتقان", "تدريب", "تقييم", "مؤشرات", "بمساعدة", "بمفرده", "مراقبة"];

const fwList = discoverableFrameworkParticipations();
const fwIds = new Set(fwList.map((p) => p.id));

interface Rec { [k: string]: unknown }
const records: Rec[] = [];
const skipped: string[] = [];

opps.forEach((o, idx) => {
  const cls = classifyReferenceSource(o.opportunity_id);
  if (cls && cls.source !== "legacy_master") { skipped.push(o.opportunity_id); return; }
  if (fwIds.has(o.opportunity_id)) { skipped.push(o.opportunity_id); return; }
  const resolvable = Boolean(cls);
  const ev = eventById.get(o.event_id);
  const dom = ev ? domainById.get(ev.domain_id) : undefined;
  const card = (cardsByOpp.get(o.opportunity_id) ?? [])[0];
  const title = nz(o.opportunity_name_ar);
  const eventTitle = ev ? nz(ev.event_name) : null;

  const rec: Rec = {
    legacy_id: o.opportunity_id,
    opportunity_id: o.opportunity_id,
    opportunity_title_ar: title,
    parent_event_id: nz(o.event_id),
    parent_event_title_ar: eventTitle,
    domain_id: ev ? nz(ev.domain_id) : null,
    domain_title_ar: dom ? nz(dom.domain_name_ar) : null,
    domain_category: dom ? nz(dom.category) : null,
    event_description: ev ? nz(ev.description) : null,
    event_environment: ev ? nz(ev.environment) : null,
    event_frequency: ev ? nz(ev.frequency) : null,
    event_related_domains: ev ? nz(ev.related_domains) : null,
    daily_event_id: nz(o.event_id),
    routine_station_link: null,
    legacy_purpose_text: card ? nz(card.why) : null,
    legacy_participation_level: nz(o.participation_level),
    legacy_future_participation_level: nz(o.future_participation_level),
    legacy_role_scope: nz(o.role_scope),
    legacy_organization_demand: nz(o.organization_demand),
    legacy_variation_demand: nz(o.variation_demand),
    legacy_classification_reason: nz(o.classification_reason),
    legacy_safety_mode: nz(o.safety_mode),
    legacy_assistance_levels: card ? nz(card.participation_levels) : null,
    legacy_performance_indicators: card ? nz(card.indicators) : null,
    legacy_independence_mastery: card ? nz(card.whats_next) : null,
    legacy_instructions_before_start: card ? nz(card.before_start) : null,
    legacy_execution_steps: card ? nz(card.participation_steps) : null,
    legacy_make_it_easier: card ? nz(card.make_it_easier) : null,
    legacy_support_notes: card ? nz(card.support_notes) : null,
    legacy_card_id: card ? nz(card.card_id) : null,
    legacy_card_count: (cardsByOpp.get(o.opportunity_id) ?? []).length,
    display_order: nz(o.display_order),
    status: nz(o.status),
    review_required: nz(o.review_required),
    source_file_field: nz(o.source_file),
    source_file: DIR + FILES.opportunities,
    source_row_index: idx + 2,
    reference_source: "legacy_master",
    framework_validated: false,
    resolvable_in_production_boundary: resolvable,
    card_pending: !resolvable,
    superseded_by_framework_reference:
      fwList.find((p) => getMigrationLineage(p.id)?.legacy_id === o.opportunity_id)?.id ?? null,
    normalized_title: norm(title),
    has_parent_event: Boolean(ev),
    has_title: Boolean(title),
    has_purpose: Boolean(card && nz(card.why)),
    has_execution_content: Boolean(card && nz(card.participation_steps)),
    has_assistance_fields: Boolean(card && nz(card.participation_levels)),
    has_performance_fields: Boolean(card && nz(card.indicators)),
    exact_title_equals_parent_event: Boolean(title && eventTitle && title === eventTitle),
  };

  const matchedTokens: string[] = [];
  const matchedFields: string[] = [];
  for (const [k, v] of Object.entries(rec)) {
    if (typeof v !== "string" || k === "normalized_title") continue;
    for (const t of TOKENS) {
      if (v.includes(t)) {
        if (!matchedTokens.includes(t)) matchedTokens.push(t);
        if (!matchedFields.includes(k)) matchedFields.push(k);
      }
    }
  }
  rec.matched_tokens = matchedTokens;
  rec.matched_fields = matchedFields;
  records.push(rec);
});

// duplicates
const byId = new Map<string, number>();
for (const r of records) byId.set(r.legacy_id as string, (byId.get(r.legacy_id as string) ?? 0) + 1);
const dupIds = [...byId].filter(([, n]) => n > 1).map(([id]) => id);
const byTitle = new Map<string, string[]>();
for (const r of records) {
  const t = r.normalized_title as string | null;
  if (!t) continue;
  byTitle.set(t, [...(byTitle.get(t) ?? []), r.legacy_id as string]);
}
const dupTitles = [...byTitle].filter(([, l]) => l.length > 1);

const outDir = "docs/audit/data";
mkdirSync(outDir, { recursive: true });

const json = {
  export_version: "01",
  generated_at: new Date().toISOString(),
  source_model: "legacy_master (CSV knowledge base) via classifyReferenceSource",
  source_files: Object.values(FILES).map((f) => DIR + f),
  legacy_count: records.length,
  records,
};
const jsonPath = `${outDir}/DALILI_LEGACY_CORPUS_EXPORT_01.json`;
writeFileSync(jsonPath, JSON.stringify(json, null, 1), "utf8");

const headers = Object.keys(records[0]);
const esc = (v: unknown) => {
  if (v === null || v === undefined) return "";
  const s = Array.isArray(v) ? v.join("|") : String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};
const csv = [headers.join(","), ...records.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n") + "\n";
const csvPath = `${outDir}/DALILI_LEGACY_CORPUS_EXPORT_01.csv`;
writeFileSync(csvPath, "\uFEFF" + csv, "utf8");

const control = {
  export_version: "01",
  generated_at: json.generated_at,
  framework_reference_count: fwList.length,
  records: fwList.map((p) => ({
    framework_reference_id: p.id,
    title: p.title,
    provenance: p.provenance,
    golden_id: p.id.startsWith("GJ-") ? p.id : null,
    legacy_source_id: getMigrationLineage(p.id)?.legacy_id ?? null,
    event_id: p.event_id ?? null,
  })),
};
writeFileSync(`${outDir}/DALILI_FRAMEWORK_REFERENCE_CONTROL_01.json`, JSON.stringify(control, null, 1), "utf8");

const sha = (p: string) => createHash("sha256").update(readFileSync(p)).digest("hex");
const stats = {
  legacy_count: records.length,
  csv_rows: csv.trim().split("\n").length - 1,
  skipped: skipped.length,
  resolvable: records.filter((r) => r.resolvable_in_production_boundary).length,
  card_pending: records.filter((r) => r.card_pending).length,
  total_csv_rows: opps.length,
  fw_count: fwList.length,
  fw_in_legacy: records.filter((r) => fwIds.has(r.legacy_id as string)).length,
  domains: new Set(records.map((r) => r.domain_id)).size,
  missing_title: records.filter((r) => !r.has_title).length,
  missing_parent_event: records.filter((r) => !r.has_parent_event).length,
  title_equals_event: records.filter((r) => r.exact_title_equals_parent_event).length,
  dup_ids: dupIds,
  dup_titles_groups: dupTitles.length,
  dup_titles_rows: dupTitles.reduce((a, [, l]) => a + l.length, 0),
  with_assistance: records.filter((r) => r.has_assistance_fields).length,
  with_performance: records.filter((r) => r.has_performance_fields).length,
  with_purpose: records.filter((r) => r.has_purpose).length,
  with_execution: records.filter((r) => r.has_execution_content).length,
  with_leakage: records.filter((r) => (r.matched_tokens as string[]).length > 0).length,
  token_counts: Object.fromEntries(TOKENS.map((t) => [t, records.filter((r) => (r.matched_tokens as string[]).includes(t)).length])),
  json_sha256: sha(jsonPath),
  csv_sha256: sha(csvPath),
  source_hashes: Object.fromEntries(Object.values(FILES).map((f) => [f, sha(DIR + f)])),
  fields: headers,
};
writeFileSync("/tmp/lex/stats.json", JSON.stringify(stats, null, 1), "utf8");
console.log(JSON.stringify({ ...stats, fields: headers.length, dup_ids: dupIds.length, top_dup_titles: dupTitles.slice(0, 5).map(([t, l]) => [t, l.length]) }, null, 1));

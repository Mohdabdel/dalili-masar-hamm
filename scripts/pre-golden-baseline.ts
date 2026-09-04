/**
 * PRE-GOLDEN-01 — مولّد خط الأساس لمحتوى المكتبة المرجعية (Master/Legacy).
 * قراءة فقط: يقرأ ملفات CSV في src/data/knowledge ويكتب أثراً قابلاً للمقارنة.
 * لا يعدّل أي محتوى مرجعي ولا يمس قاعدة البيانات ولا سلوك التطبيق.
 *
 * التشغيل: bun scripts/pre-golden-baseline.ts
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const OUT = resolve(ROOT, "docs/audit/DALILI_PRE_GOLDEN_CONTENT_BASELINE_01.json");

const FILES = {
  domains: "src/data/knowledge/01_domains.csv",
  events: "src/data/knowledge/02_events.csv",
  opportunities: "src/data/knowledge/03_participation_opportunities.csv",
  cards: "src/data/knowledge/04_participation_cards.csv",
} as const;

/** محلّل CSV بسيط يدعم علامات الاقتباس والفواصل داخل الحقول. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += c;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

interface Table {
  path: string;
  header: string[];
  rows: Record<string, string>[];
  sha256: string;
  bytes: number;
}

function load(path: string): Table {
  const abs = resolve(ROOT, path);
  const raw = readFileSync(abs);
  const [header, ...body] = parseCsv(raw.toString("utf8"));
  return {
    path,
    header,
    bytes: raw.byteLength,
    sha256: createHash("sha256").update(raw).digest("hex"),
    rows: body.map((cells) =>
      Object.fromEntries(header.map((h, i) => [h.trim(), (cells[i] ?? "").trim()])),
    ),
  };
}

const dup = (values: string[]) => {
  const seen = new Set<string>();
  const out = new Set<string>();
  for (const v of values) (seen.has(v) ? out : seen).add(v);
  return [...out];
};

const prefixes = (ids: string[]) =>
  [...new Set(ids.map((id) => id.split("-")[0]).filter(Boolean))].sort();

const tally = (values: string[]) =>
  values.reduce<Record<string, number>>((acc, v) => {
    const key = v || "(فارغ)";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

/** بصمة محتوى مستقرة لا تتأثر بترتيب الأسطر: ترتيب المعرّفات ثم تجزئة. */
function contentDigest(rows: Record<string, string>[], idKey: string): string {
  const h = createHash("sha256");
  for (const line of rows
    .map((r) => Object.keys(r).sort().map((k) => `${k}=${r[k]}`).join("\u001f"))
    .sort())
    h.update(line + "\u001e");
  void idKey;
  return h.digest("hex");
}

const domains = load(FILES.domains);
const events = load(FILES.events);
const opportunities = load(FILES.opportunities);
const cards = load(FILES.cards);

const domainIds = domains.rows.map((r) => r.domain_id);
const eventIds = events.rows.map((r) => r.event_id);
const oppIds = opportunities.rows.map((r) => r.opportunity_id);
const cardIds = cards.rows.map((r) => r.card_id);

const eventSet = new Set(eventIds);
const domainSet = new Set(domainIds);
const oppSet = new Set(oppIds);

const cardsByOpp = new Map<string, number>();
for (const c of cards.rows)
  cardsByOpp.set(c.opportunity_id, (cardsByOpp.get(c.opportunity_id) ?? 0) + 1);

const oppsWithoutCards = oppIds.filter((id) => !cardsByOpp.has(id));
const orphanEvents = events.rows.filter((r) => !domainSet.has(r.domain_id)).map((r) => r.event_id);
const orphanOpps = opportunities.rows
  .filter((r) => !eventSet.has(r.event_id))
  .map((r) => r.opportunity_id);
const orphanCards = cards.rows
  .filter((r) => !oppSet.has(r.opportunity_id))
  .map((r) => r.card_id);
const multiCardOpps = [...cardsByOpp.entries()].filter(([, n]) => n > 1).map(([id, n]) => ({ id, n }));

const baseline = {
  baseline_id: "PRE-GOLDEN-01",
  generated_at: new Date().toISOString(),
  generator: "scripts/pre-golden-baseline.ts",
  scope: "Master/Legacy knowledge corpus (CSV) — read-only inventory",
  sources: [domains, events, opportunities, cards].map((t) => ({
    path: t.path,
    bytes: t.bytes,
    file_sha256: t.sha256,
    header: t.header,
    row_count: t.rows.length,
  })),
  schema: {
    version: "HIMAM Repository v2.0 (unified CSV)",
    encoding: "UTF-8 with BOM",
    delimiter: ",",
  },
  counts: {
    domains: domains.rows.length,
    events: events.rows.length,
    participation_opportunities: opportunities.rows.length,
    participation_cards: cards.rows.length,
    opportunities_with_cards: cardsByOpp.size,
    opportunities_without_cards: oppsWithoutCards.length,
  },
  relationships: {
    events_per_domain: tally(events.rows.map((r) => r.domain_id)),
    opportunities_per_domain: tally(
      opportunities.rows.map(
        (r) => events.rows.find((e) => e.event_id === r.event_id)?.domain_id ?? "(بلا حدث)",
      ),
    ),
    participation_level_distribution: tally(opportunities.rows.map((r) => r.participation_level)),
    opportunity_status_distribution: tally(opportunities.rows.map((r) => r.status)),
    card_status_distribution: tally(cards.rows.map((r) => r.status)),
  },
  id_namespaces: {
    domain_prefixes: prefixes(domainIds),
    event_prefixes: prefixes(eventIds),
    opportunity_pattern: "<EVENT_ID>-OP<NNN>",
    card_pattern: "<EVENT_ID>-CARD<NNN>",
    sample_ids: {
      domains: domainIds.slice(0, 3),
      events: eventIds.slice(0, 3),
      opportunities: oppIds.slice(0, 3),
      cards: cardIds.slice(0, 3),
    },
  },
  anomalies: {
    duplicate_domain_ids: dup(domainIds),
    duplicate_event_ids: dup(eventIds),
    duplicate_opportunity_ids: dup(oppIds),
    duplicate_card_ids: dup(cardIds),
    orphan_events_missing_domain: orphanEvents,
    orphan_opportunities_missing_event: orphanOpps,
    orphan_cards_missing_opportunity: orphanCards,
    opportunities_with_multiple_cards: multiCardOpps,
    opportunities_without_cards_sample: oppsWithoutCards.slice(0, 20),
  },
  integrity: {
    method: "sha256 over raw file bytes + order-independent sha256 over normalized rows",
    file_sha256: {
      domains: domains.sha256,
      events: events.sha256,
      opportunities: opportunities.sha256,
      cards: cards.sha256,
    },
    content_digest: {
      domains: contentDigest(domains.rows, "domain_id"),
      events: contentDigest(events.rows, "event_id"),
      opportunities: contentDigest(opportunities.rows, "opportunity_id"),
      cards: contentDigest(cards.rows, "card_id"),
    },
  },
} as const;

mkdirSync(resolve(ROOT, "docs/audit"), { recursive: true });
writeFileSync(OUT, JSON.stringify(baseline, null, 2) + "\n", "utf8");
console.log(JSON.stringify({ counts: baseline.counts, integrity: baseline.integrity }, null, 2));
console.log("anomalies:", JSON.stringify(baseline.anomalies, null, 2).slice(0, 2000));

// نسخة مستقلة من محلل CSV (مفصولة عن دليلي)
export function parseCsv(text: string): Record<string, string>[] {
  const src = text.replace(/^\uFEFF/, "").trim();
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      cur.push(field);
      field = "";
    } else if (ch === "\n") {
      cur.push(field);
      rows.push(cur);
      cur = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }
  cur.push(field);
  if (cur.length > 1 || cur[0] !== "") rows.push(cur);

  const header = (rows.shift() ?? []).map((h) => h.trim());
  return rows.map((r) => {
    const o: Record<string, string> = {};
    header.forEach((h, i) => {
      o[h] = (r[i] ?? "").trim();
    });
    return o;
  });
}

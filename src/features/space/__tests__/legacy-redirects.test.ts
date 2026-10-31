import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// خريطة إعادة التوجيه المعتمدة للمسارات القديمة: الرابط المباشر لا يعرض واجهة قديمة.
const ROUTES = resolve(__dirname, "../../../routes");
const REDIRECTS: Record<string, string> = {
  "_authenticated/active-participations.tsx": "/space/participations",
  "_authenticated/space.index.tsx": "/space/participations",
  "_authenticated/my-routine.tsx": "/space/participations",
  "participation-guide.tsx": "/space/explore",
  "search.tsx": "/space/explore",
  "activities.index.tsx": "/space/explore",
  "activities.$category.tsx": "/space/explore",
  "activities.browse.tsx": "/space/explore",
  "activities.level.tsx": "/space/explore",
  "activities.my-day.tsx": "/space/explore",
  "activities.options.tsx": "/space/explore",
  "resources.tsx": "/",
  "education-support.tsx": "/",
  "community-support.tsx": "/",
  "calendar.tsx": "/",
  "messages.tsx": "/",
  "reminder.tsx": "/",
  "settings.family.tsx": "/",
  "settings.add-event.tsx": "/",
  "lab.tsx": "/",
};

describe("إعادة توجيه المسارات القديمة", () => {
  for (const [file, target] of Object.entries(REDIRECTS)) {
    it(`${file} → ${target}`, () => {
      const src = readFileSync(resolve(ROUTES, file), "utf8");
      const extra = target === "/space/explore" ? ', search: { lens: "event" }' : "";
      expect(src).toContain(`throw legacyRedirect({ to: "${target}"${extra}, replace: true })`);
    });
  }

  it("help-me-choose → /space/easy", () => {
    const src = readFileSync(resolve(ROUTES, "help-me-choose.tsx"), "utf8");
    expect(src).toContain('redirect({ to: "/space/easy" })');
  });

  it("شاشة المستويات تُتجاوز إلى مشاركات الحدث", () => {
    const src = readFileSync(resolve(ROUTES, "_authenticated/space.$eventId.level.tsx"), "utf8");
    expect(src).toContain('to: "/space/$eventId/participations"');
  });

  it("التنقل الثابت: الرئيسية | مشاركاتنا | أدوات دليلي | الحساب", () => {
    const src = readFileSync(resolve(__dirname, "../../../components/BottomNav.tsx"), "utf8");
    const order = ["\"/\"", "\"/space/participations\"", "\"/tools\"", "\"/account\""].map((t) => src.indexOf(`to: ${t}`));
    expect(order.every((i) => i >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    expect(src).toContain('label: "الحساب"');
  });
});

import { describe, expect, it } from "vitest";
import { safeAuthReturnPath } from "../auth-return";

describe("safeAuthReturnPath", () => {
  it("يحفظ وجهة الرحلة الداخلية", () => {
    expect(safeAuthReturnPath("/space/easy?from=home#start")).toBe("/space/easy?from=home#start");
  });

  it("يرفض الوجهات الخارجية أو غير الصالحة", () => {
    expect(safeAuthReturnPath("https://example.com")).toBe("/");
    expect(safeAuthReturnPath("//example.com/path")).toBe("/");
    expect(safeAuthReturnPath(undefined)).toBe("/");
  });
});

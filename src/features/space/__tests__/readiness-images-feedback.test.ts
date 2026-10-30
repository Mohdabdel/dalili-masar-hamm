import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/visual-asset-catalog", () => {
  const assets = [
    { assetCode: "action", titleAr: "نضع الأكواب على المائدة", assetPath: "/action.png", source: "single", missingBinary: false },
    { assetCode: "generic", titleAr: "المائدة", assetPath: "/breakfast.png", source: "single", missingBinary: false },
    { assetCode: "SHEET", titleAr: "لوحة", assetPath: "/sheet.png", source: "DALILI_VISUAL_BATCH_03", missingBinary: false },
    { assetCode: "derived", titleAr: "مشهد محدد", assetPath: "/derived.png", source: "single", missingBinary: false },
  ];
  return { getRenderableVisualAssets: () => assets, getCanonicalVisualAsset: (code: string) => assets.find((a) => a.assetCode === code) ?? null };
});
vi.mock("@/features/space/derived-assets", () => ({ isDerivedAsset: (code: string) => code === "derived" }));
vi.mock("@/features/space/family-uploads", () => ({ peekUploadedUrl: (path: string) => path === "family/photo" ? "/signed-family.png" : null }));
import { suggestStepImage, resolveStepImage, resolvedAssetCode } from "../step-image";
import { persistFeedbackActions, routineFeedbackActions } from "../feedback-plan";

describe("safe step images", () => {
  it("rejects a generic breakfast picture matched on one word", () => {
    expect(suggestStepImage("نضع الأطباق والأكواب على المائدة")).toBeNull();
    expect(suggestStepImage("المائدة مختلفة تماماً")).toBeNull();
  });
  it("retains exact action suggestions", () => {
    expect(suggestStepImage("نضع الأكواب على المائدة")).toEqual({ sourceAssetCode: "action" });
  });
  it("never substitutes the first scene of an unspecified composite", () => {
    expect(resolveStepImage({ sourceAssetCode: "SHEET" })).toMatchObject({ src: null, compositePending: true });
    expect(resolvedAssetCode({ sourceAssetCode: "SHEET" })).toBeNull();
  });
  it("preserves explicit derived selection and prioritizes the family's photo", () => {
    expect(resolveStepImage({ sourceAssetCode: "SHEET", derivedAssetCode: "derived" }).src).toBe("/derived.png");
    expect(resolveStepImage({ uploadedPath: "family/photo", sourceAssetCode: "generic" }).src).toBe("/signed-family.png");
    expect(resolveStepImage({ uploadedPath: "unresolved", sourceAssetCode: "generic" }).src).toBeNull();
  });
});
describe("honest routine feedback", () => {
  it("does not create fake stations or lifecycle success for custom participation without event", () => {
    expect(routineFeedbackActions("FAM-example")).toBeNull();
  });
  it("saves station, then link, then lifecycle", () => {
    expect(routineFeedbackActions("FAM-example", "FOOD-001")?.map((a) => a.type)).toEqual(["station.add", "station.link", "lifecycle"]);
  });
  it("stops on failure and retries only unfinished actions", async () => {
    const actions = routineFeedbackActions("FAM-example", "FOOD-001")!;
    const completed = new Set<string>();
    const calls: string[] = [];
    let fail = true;
    const persist = async (action: typeof actions[number]) => {
      calls.push(action.type);
      if (action.type === "station.link" && fail) throw new Error("offline");
    };
    await expect(persistFeedbackActions(actions, persist, completed)).rejects.toThrow("offline");
    expect(calls).toEqual(["station.add", "station.link"]);
    fail = false;
    await persistFeedbackActions(actions, persist, completed);
    expect(calls).toEqual(["station.add", "station.link", "station.link", "lifecycle"]);
  });
});

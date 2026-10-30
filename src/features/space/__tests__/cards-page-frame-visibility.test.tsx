import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { SnapshotFrameTile } from "../components/SnapshotFrameTile";
import type { LabFrozenFrame } from "@/lab/slice/types";

const base: LabFrozenFrame = {
  sourceStepId: "S1",
  order: 1,
  text_short_ar: "نضع الكوب على المائدة",
  assetRef: "/assets/test/cup.webp",
} as LabFrozenFrame;

const render = (f: Partial<LabFrozenFrame>) =>
  renderToStaticMarkup(<SnapshotFrameTile frame={{ ...base, ...f }} />);

describe("CardsPage frame tile respects approved snapshot flags", () => {
  it("text only: no image, no placeholder", () => {
    const html = render({ imageVisible: false, textVisible: true, assetRef: null });
    expect(html).toContain("نضع الكوب على المائدة");
    expect(html).not.toContain("<img");
    expect(html).not.toContain("بانتظار");
  });

  it("image only: no caption text", () => {
    const html = render({ imageVisible: true, textVisible: false });
    expect(html).toContain("<img");
    expect(html).not.toContain('data-testid="frame-text"');
  });

  it("both, honouring blockOrder", () => {
    const vt = render({ imageVisible: true, textVisible: true });
    const tv = render({ imageVisible: true, textVisible: true, blockOrder: "text-visual" });
    expect(vt.indexOf("<img")).toBeLessThan(vt.indexOf("frame-text"));
    expect(tv.indexOf("frame-text")).toBeLessThan(tv.indexOf("<img"));
  });

  it("legacy frames without flags fall back safely", () => {
    const withAsset = render({});
    expect(withAsset).toContain("<img");
    expect(withAsset).toContain("frame-text");
    const textPresentation = render({ presentation: "text" });
    expect(textPresentation).not.toContain("<img");
    const noAsset = render({ assetRef: null });
    expect(noAsset).not.toContain("بانتظار");
    expect(noAsset).toContain("نضع الكوب");
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCanonicalVisualAsset } from "@/lib/visual-asset-catalog";
import { resolveStepImage, suggestStepImage } from "@/features/space/step-image";

interface CorrectedPacket {
  candidates: Array<{
    proposed_framework_reference_id: string;
    execution_blocks: Array<{ id: string; text: string }>;
  }>;
}

function readCorrectedPacket(): CorrectedPacket {
  return JSON.parse(
    readFileSync(
      join(
        process.cwd(),
        "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_CORRECTED_01.json",
      ),
      "utf8",
    ),
  ) as CorrectedPacket;
}

describe("Expansion sample 12-02 visual readiness", () => {
  it("resolves every corrected execution block to a provisional EXP12-02 image", () => {
    const packet = readCorrectedPacket();
    for (const candidate of packet.candidates) {
      for (const block of candidate.execution_blocks) {
        const ref = suggestStepImage(block.text);
        const resolved = resolveStepImage(ref);
        expect(ref?.sourceAssetCode, `${candidate.proposed_framework_reference_id}: ${block.text}`).toMatch(
          /^VRS-EXP12-02-/,
        );
        expect(resolved.src, `${candidate.proposed_framework_reference_id}: ${block.text}`).toContain(
          "/assets/execution/expansion12-02/",
        );
        expect(resolved.compositePending).toBe(false);
      }
    }
  });

  it("keeps inserted image bindings as review assets, not final pilot approvals", () => {
    const packet = readCorrectedPacket();
    for (const candidate of packet.candidates) {
      for (const block of candidate.execution_blocks) {
        const ref = suggestStepImage(block.text);
        const asset = ref?.sourceAssetCode
          ? getCanonicalVisualAsset(ref.sourceAssetCode)
          : null;
        expect(asset?.source).toBe("DALILI_VISUAL_EXPANSION_12_02");
        expect(asset?.qaStatus).toBe("APPROVED_FOR_REVIEW");
      }
    }
  });
});

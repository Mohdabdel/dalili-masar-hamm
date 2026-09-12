import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { composeDraft } from "@/features/space/compose";
import { getCanonicalVisualAsset } from "@/lib/visual-asset-catalog";
import { getSpaceSpec } from "@/lab/data/space/catalog";
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

  it("prefers exact EXP12-02 step-title matches over older broad visual matches", () => {
    const ref = suggestStepImage("إحضار أدوات التقديم إلى المائدة");
    expect(ref?.sourceAssetCode).toBe("VRS-EXP12-02-FOOD-SERVE-S01");
  });

  it("upgrades stale legacy visual URLs when composing Batch05 workspace rows", () => {
    const spec = getSpaceSpec("FR-EXP12-02-FOOD002-OP001");
    expect(spec).toBeTruthy();
    if (!spec) return;
    const stepId = spec.majorSteps[0].id;
    const rows = composeDraft(spec, {
      specId: spec.id,
      selected: [{ stepId, order: 1 }],
      chosenExecutionOptionByStepId: {},
      supportTools: [],
      visualByStepId: {
        [stepId]: "/assets/execution/batch03/B03-SHOP-BAGS.png",
      },
    });
    expect(rows[0].image.src).toContain("/assets/execution/expansion12-02/");
    expect(rows[0].assetCode).toBe("VRS-EXP12-02-FOOD-SERVE-S01");
  });

  it("upgrades stale stored image refs when composing Batch05 workspace rows", () => {
    const spec = getSpaceSpec("FR-EXP12-02-SHOP005-OP003");
    expect(spec).toBeTruthy();
    if (!spec) return;
    const stepId = spec.majorSteps[1].id;
    const rows = composeDraft(spec, {
      specId: spec.id,
      selected: [{ stepId, order: 1 }],
      chosenExecutionOptionByStepId: {},
      supportTools: [],
      imageRefByStepId: {
        [stepId]: { sourceAssetCode: "VRS-B03-SHOP-BAGS" },
      },
    });
    expect(rows[0].image.src).toContain("/assets/execution/expansion12-02/");
    expect(rows[0].assetCode).toBe("VRS-EXP12-02-SHOP-PRODUCE-S02");
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

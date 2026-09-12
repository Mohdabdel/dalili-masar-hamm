import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseCsv } from "@/lib/execution-frames";

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

function readManifestRows(): Array<Record<string, string>> {
  return parseCsv(
    readFileSync(
      join(
        process.cwd(),
        "docs/audit/data/DALILI_EXPANSION_SAMPLE_12_02_IMAGE_INTAKE_MANIFEST.csv",
      ),
      "utf8",
    ),
  );
}

describe("Expansion sample 12-02 image intake manifest", () => {
  it("prepares one provisional image row for every corrected execution block", () => {
    const packet = readCorrectedPacket();
    const expectedBlocks = packet.candidates.flatMap((candidate) =>
      candidate.execution_blocks.map((block) => ({
        frameworkId: candidate.proposed_framework_reference_id,
        blockId: block.id,
        text: block.text,
      })),
    );
    const rows = readManifestRows();

    expect(rows).toHaveLength(expectedBlocks.length);
    for (const block of expectedBlocks) {
      const row = rows.find((candidate) => candidate["block_id"] === block.blockId);
      expect(row, block.blockId).toBeTruthy();
      expect(row?.["framework_reference_id"]).toBe(block.frameworkId);
      expect(row?.["step_text"]).toBe(block.text);
      expect(row?.["image_review_status"]).toBe("IMAGE_REPLACE_LATER");
    }
  });

  it("uses replaceable EXP12-02 asset codes and file names", () => {
    for (const row of readManifestRows()) {
      expect(row["expected_asset_code"]).toMatch(/^VRS-EXP12-02-/);
      expect(row["preferred_file_name"]).toMatch(/^EXP12-02-.*\.(png|webp|jpg)$/);
      expect(row["accept_if"]).toContain("يعبر عن الفعل العام");
      expect(row["reject_if"]).toContain("يخالف خطوة المشاركة");
    }
  });
});

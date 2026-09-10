import { describe, expect, it } from "vitest";
import { listBatch03Participations } from "@/lib/framework/batch03-corpus";
import { resolveStepImage, suggestStepImage } from "../step-image";

describe("Batch 03 visual coverage", () => {
  it("كل كتلة تنفيذ في Batch 03 تملك صورة خطوة قابلة للعرض", () => {
    for (const participation of listBatch03Participations()) {
      for (const block of participation.execution_blocks) {
        const ref = suggestStepImage(block.text);
        const resolved = resolveStepImage(ref);
        expect(ref, `${participation.id} / ${block.text}`).not.toBeNull();
        expect(resolved.src, `${participation.id} / ${block.text}`).toBeTruthy();
        expect(resolved.compositePending).toBe(false);
      }
    }
  });
});

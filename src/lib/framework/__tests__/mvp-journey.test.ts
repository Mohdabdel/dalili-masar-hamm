import { describe, expect, it } from "vitest";
import { buildFrozenSnapshot, composeDraft } from "@/features/space/compose";
import { buildDraftSelection, getSpaceSpec } from "@/lab/data/space/catalog";
import {
  MVP_JOURNEY_PROBES,
  MVP_SCOPE_PARTICIPATION_IDS,
} from "../mvp-scope";

describe("DALILI MVP journey probes", () => {
  it("كل مسار MVP يستطيع إنتاج بطاقة معتمدة من البداية للنهاية", () => {
    for (const journey of MVP_JOURNEY_PROBES) {
      for (const specId of journey.participation_ids) {
        const spec = getSpaceSpec(specId);
        expect(spec, `${journey.id}: ${specId}`).toBeTruthy();
        if (!spec) continue;

        const selection = buildDraftSelection(spec);
        const draftRows = composeDraft(spec, selection);
        expect(draftRows.length, `${journey.id}: ${specId}`).toBeGreaterThan(0);
        expect(draftRows.every((row) => row.familyText.trim().length > 0)).toBe(true);
        expect(draftRows.every((row) => row.sourceText.trim().length > 0)).toBe(true);

        const firstStepId = draftRows[0].stepId;
        const familySelection = {
          ...selection,
          familyTextByStepId: {
            ...selection.familyTextByStepId,
            [firstStepId]: `${draftRows[0].familyText} معًا`,
          },
        };
        const familyRows = composeDraft(spec, familySelection);
        expect(familyRows[0].familyText.endsWith("معًا")).toBe(true);
        expect(familyRows[0].sourceText).toBe(draftRows[0].sourceText);

        const visibleRows = familyRows.filter(
          (row) =>
            (row.imageVisible && Boolean(row.image.src)) ||
            (row.textVisible && row.familyText.trim().length > 0),
        );
        expect(visibleRows.length, `${journey.id}: ${specId}`).toBeGreaterThan(0);

        const snapshot = buildFrozenSnapshot({
          spec,
          selection: familySelection,
          rows: visibleRows.map((row, index) => ({ ...row, order: index + 1 })),
          version: 1,
          label_ar: `${journey.title} - ${spec.title_ar}`,
          date: "2026-09-13",
          supportAssets: [],
        });

        expect(snapshot.participationSpecId).toBe(specId);
        expect(snapshot.frames.length).toBe(visibleRows.length + 1);
        expect(snapshot.frames.at(-1)?.sourceStepId).toBe("__done__");
        expect(snapshot.frames[0].familyText_ar).toBe(familyRows[0].familyText);
      }
    }
  });

  it("مسارات MVP probes جزء من النطاق المثبت وليست توسعًا جديدًا", () => {
    const scope: ReadonlySet<string> = new Set(MVP_SCOPE_PARTICIPATION_IDS);
    const probed = MVP_JOURNEY_PROBES.flatMap((journey) => journey.participation_ids);
    expect(new Set(probed).size).toBe(probed.length);
    for (const specId of probed) {
      expect(scope.has(specId), specId).toBe(true);
    }
  });
});

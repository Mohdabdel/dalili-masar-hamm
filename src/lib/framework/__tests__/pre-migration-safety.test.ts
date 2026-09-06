import { describe, expect, it } from "vitest";
import { buildFamilyParticipationRow } from "@/lib/family-participation";
import {
  identityCompleteness,
  identityFromFrameworkParticipation,
  identityFromValidatedCandidate,
} from "../participation-identity";
import { classifyReferenceSource } from "../source-boundary";
import { getEasyBeginningCandidate, ensureEasyBeginningCorpus } from "../easy-beginning-corpus";
import { getAllOpportunities } from "@/lib/knowledge-base";

const validCandidate = {
  id: "FAMILY-DRAFT",
  title: "إحضار الخبز إلى مائدة الفطور",
  life_context: "صباح تجتمع فيه الأسرة حول مائدة الفطور",
  functional_intent: "المائدة تحتاج من يضع الخبز عليها قبل الجلوس",
  observable_effect: "يظهر الخبز على المائدة فيبدأ الجالسون بتناوله",
  natural_completion: "يستقر الخبز في وسط المائدة",
  standalone_role_meaning: "إيصال الخبز إلى مائدة يجتمع عليها أفراد الأسرة",
  participation_mode: "shared" as const,
  execution_blocks: [
    { kind: "execution_block" as const, id: "B1", order: 1, text: "يضع الخبز في السلة" },
    { kind: "execution_block" as const, id: "B2", order: 2, text: "يحمل السلة إلى المائدة" },
  ],
};

describe("FA-04 identity persistence", () => {
  it("builds an identity block only from a validated definition", () => {
    const block = identityFromValidatedCandidate(validCandidate);
    expect(block?.functional_intent).toBe(validCandidate.functional_intent);
    expect(block?.participation_mode).toBe("shared");
    expect(block?.validated).toBe(true);
  });

  it("never fabricates C1–C4 when dimensions are unknown", () => {
    const block = identityFromValidatedCandidate(validCandidate);
    expect(block?.complexity_dimensions).toBeUndefined();
    expect(identityCompleteness(block)).toBe("partial");
  });

  it("A/B — an event or a bare execution block is not promoted to an FP", () => {
    expect(
      identityFromValidatedCandidate({ id: "EV-1", title: "الفطور" }),
    ).toBeNull();
    expect(
      identityFromValidatedCandidate({
        ...validCandidate,
        standalone_role_meaning: validCandidate.execution_blocks[0].text,
      }),
    ).toBeNull();
  });

  it("C/E — family_free persists identity with no reference of any kind", () => {
    const row = buildFamilyParticipationRow({
      origin: "family_free",
      identity: identityFromValidatedCandidate(validCandidate),
    });
    expect(row.origin).toBe("family_free");
    expect(row.reference_spec_id).toBeNull();
    expect(row.reference_source).toBeNull();
    expect(row.opportunity_id).toBeNull();
    expect(row.functional_identity?.functional_intent).toBeTruthy();
  });

  it("a framework reference carries its authored complexity", () => {
    const fp = getEasyBeginningCandidate("FR-POPCORN-BRING-001");
    const block = fp ? identityFromFrameworkParticipation(fp) : null;
    expect(block?.complexity_level).toBe("moderate");
    expect(block?.complexity_dimensions?.c1_elements).toBeTruthy();
    expect(identityCompleteness(block)).toBe("complete");
  });
});

describe("FP-01 reference read boundary", () => {
  it("D — a legacy master row is not auto-promoted", () => {
    const legacyId = getAllOpportunities()[0].opportunity.id;
    expect(classifyReferenceSource(legacyId)).toEqual({
      source: "legacy_master",
      frameworkValidated: false,
    });
    expect(classifyReferenceSource(`KB-${legacyId}`)?.source).toBe("legacy_master");
  });

  it("framework references classify separately and coexist with legacy", () => {
    ensureEasyBeginningCorpus();
    expect(classifyReferenceSource("FR-POPCORN-BRING-001")).toEqual({
      source: "framework_reference",
      frameworkValidated: true,
    });
    const legacyCount = getAllOpportunities().length;
    expect(legacyCount).toBeGreaterThan(100);
    expect(
      getAllOpportunities().every((o) => o.opportunity.provenance === "legacy_master"),
    ).toBe(true);
  });

  it("an unknown id is not classified at all", () => {
    expect(classifyReferenceSource("NOT-A-REAL-ID")).toBeNull();
  });
});

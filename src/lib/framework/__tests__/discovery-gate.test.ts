import { describe, it, expect } from "vitest";
import { allSpaceEvents, getSpaceSpec, participationsForEvent } from "@/lab/data/space/catalog";
import { discoverableFrameworkParticipations, legacyIdsSupersededByFramework } from "@/lib/framework/discovery";
import { classifyReferenceSource } from "@/lib/framework/source-boundary";
import { findOpportunityById } from "@/lib/knowledge-base";
import { GOLDEN_PARTICIPATION_IDS } from "@/lib/framework/golden-corpus";
import { BATCH02_PARTICIPATION_IDS, getMigrationLineage } from "@/lib/framework/batch02-corpus";
import { BATCH03_PARTICIPATION_IDS, getBatch03Lineage } from "@/lib/framework/batch03-corpus";

describe("discovery gate", () => {
  it("counts", () => {
    const all = discoverableFrameworkParticipations();
    console.log("FRAMEWORK_TOTAL", all.length, all.map((p) => p.id).join(","));
  });
  it("golden 5 reachable", () => {
    for (const id of GOLDEN_PARTICIPATION_IDS) {
      const spec = getSpaceSpec(id);
      expect(spec, id).toBeTruthy();
      expect(classifyReferenceSource(id)?.source).toBe("framework_reference");
      const inEvent = participationsForEvent(spec!.eventId).some((s) => s.id === id);
      expect(inEvent, `event lens ${id}`).toBe(true);
      expect(allSpaceEvents().some((e) => e.id === spec!.eventId), `event listed ${id}`).toBe(true);
    }
  });
  it("batch02 5 reachable + legacy dedup + legacy intact", () => {
    for (const id of BATCH02_PARTICIPATION_IDS) {
      const spec = getSpaceSpec(id)!;
      expect(spec, id).toBeTruthy();
      expect(classifyReferenceSource(id)?.source).toBe("framework_reference");
      expect(participationsForEvent(spec.eventId).some((s) => s.id === id)).toBe(true);
      const lineage = getMigrationLineage(id)!;
      // legacy row still exists in master
      expect(findOpportunityById(lineage.legacy_id)).toBeTruthy();
      // but not shown as a duplicate candidate
      expect(participationsForEvent(spec.eventId).some((s) => s.id === `KB-${lineage.legacy_id}`)).toBe(false);
      // still resolvable for compatibility, still legacy_master
      expect(getSpaceSpec(`KB-${lineage.legacy_id}`)).toBeTruthy();
      expect(classifyReferenceSource(lineage.legacy_id)?.source).toBe("legacy_master");
    }
    console.log("SUPERSEDED", [...legacyIdsSupersededByFramework()].join(","));
  });
  it("batch03 6 reachable + source evidence dedup when visible", () => {
    for (const id of BATCH03_PARTICIPATION_IDS) {
      const spec = getSpaceSpec(id)!;
      expect(spec, id).toBeTruthy();
      expect(classifyReferenceSource(id)?.source).toBe("framework_reference");
      expect(participationsForEvent(spec.eventId).some((s) => s.id === id)).toBe(true);
      const lineage = getBatch03Lineage(id)!;
      for (const legacyId of lineage.source_evidence_ids) {
        expect(participationsForEvent(spec.eventId).some((s) => s.id === `KB-${legacyId}`)).toBe(false);
        if (findOpportunityById(legacyId)) {
          expect(getSpaceSpec(`KB-${legacyId}`)).toBeTruthy();
          expect(classifyReferenceSource(legacyId)?.source).toBe("legacy_master");
        }
      }
    }
  });
  it("unmigrated legacy still discoverable as legacy_master", () => {
    const ev = allSpaceEvents().find((event) => {
      const specs = participationsForEvent(event.id);
      return specs.length > 0 && specs.every((s) => s.provenance !== "framework_reference");
    })!;
    const specs = participationsForEvent(ev.id);
    expect(specs.length).toBeGreaterThan(0);
    expect(specs.every((s) => s.provenance !== "framework_reference")).toBe(true);
    const one = specs[0].id.replace(/^KB-/, "");
    expect(classifyReferenceSource(one)?.source).toBe("legacy_master");
  });
});

import { describe, expect, it } from "vitest";
import {
  buildFamilyParticipationRow,
  toFamilyParticipation,
} from "../family-participation";

describe("family participation identity", () => {
  it("CASE B — reference origin stores provenance, not identity", () => {
    const row = buildFamilyParticipationRow({
      origin: "reference",
      reference: { specId: "KB-CLO-001-OP001", source: "legacy_master" },
    });
    expect(row.origin).toBe("reference");
    expect(row.reference_spec_id).toBe("KB-CLO-001-OP001");
    expect(row.reference_source).toBe("legacy_master");
    // لا حقل هوية في الصف — المعرّف تولّده قاعدة البيانات للأسرة.
    expect("id" in row).toBe(false);
  });

  it("reference origin also accepts framework_reference source", () => {
    const row = buildFamilyParticipationRow({
      origin: "reference",
      reference: { specId: "FX-FP-SIMPLE", source: "framework_reference" },
    });
    expect(row.reference_source).toBe("framework_reference");
  });

  it("CASE C — family_free needs no KB id and fabricates none", () => {
    const row = buildFamilyParticipationRow({ origin: "family_free" });
    expect(row.origin).toBe("family_free");
    expect(row.reference_spec_id).toBeNull();
    expect(row.reference_source).toBeNull();
    expect(row.opportunity_id).toBeNull();
  });

  it("CASE D — easy_beginning needs no legacy master id", () => {
    const row = buildFamilyParticipationRow({ origin: "easy_beginning" });
    expect(row.origin).toBe("easy_beginning");
    expect(row.reference_spec_id).toBeNull();
    expect(row.opportunity_id).toBeNull();
  });

  it("rejects contradictory provenance", () => {
    expect(() => buildFamilyParticipationRow({ origin: "reference" })).toThrow();
    expect(() =>
      buildFamilyParticipationRow({
        origin: "family_free",
        reference: { specId: "KB-X", source: "legacy_master" },
      }),
    ).toThrow();
  });

  it("all origins produce the same downstream shape", () => {
    const keys = (o: object) => Object.keys(o).sort().join(",");
    const ref = buildFamilyParticipationRow({
      origin: "reference",
      reference: { specId: "KB-X", source: "legacy_master" },
    });
    expect(keys(buildFamilyParticipationRow({ origin: "family_free" }))).toBe(
      keys(ref),
    );
    expect(keys(buildFamilyParticipationRow({ origin: "easy_beginning" }))).toBe(
      keys(ref),
    );
  });

  it("origin never carries lifecycle state", () => {
    const row = buildFamilyParticipationRow({ origin: "family_free" });
    expect(row.status).toBe("active");
    expect(["reference", "easy_beginning", "family_free"]).toContain(row.origin);
  });

  it("maps a stored row to canonical identity + optional provenance", () => {
    const fp = toFamilyParticipation({
      id: "11111111-1111-1111-1111-111111111111",
      origin: "reference",
      reference_spec_id: "KB-CLO-001-OP001",
      reference_source: "legacy_master",
      status: "active",
      daily_event_id: null,
      routine_station_id: null,
    });
    expect(fp.id).not.toBe(fp.reference?.specId);
    const free = toFamilyParticipation({
      id: "22222222-2222-2222-2222-222222222222",
      origin: "family_free",
      reference_spec_id: null,
      reference_source: null,
      status: "active",
      daily_event_id: null,
      routine_station_id: null,
    });
    expect(free.reference).toBeNull();
  });
});

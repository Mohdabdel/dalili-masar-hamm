import { it } from "vitest";
import { participationsForEvent, getSpaceSpec } from "@/lab/data/space/catalog";
import { SLICE_SPECS } from "@/lab/data/slice";
for (const id of ["FOOD-001","CLO-011","SHOP-004","FOOD-002"]) {
  const s = participationsForEvent(id);
  console.log(id, "count", s.length, "first", s[0]?.id, "anyFixture", s.some(x=>SLICE_SPECS.some(f=>f.id===x.id)));
}
console.log("labOnlyFixtureIds", SLICE_SPECS.map(s=>s.id));
console.log("fixture via getSpaceSpec:", SLICE_SPECS.map(s=>[s.id, getSpaceSpec(s.id)?.id]));
const kb = participationsForEvent("FOOD-001")[0];
console.log("KB resolve", kb.id, getSpaceSpec(kb.id)?.majorSteps.length, kb.majorSteps[0]?.instruction_family_ar);
import { test } from "vitest";
test("lin02", () => {});

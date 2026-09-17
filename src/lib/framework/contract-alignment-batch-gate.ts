import { evaluateComplexity } from "./complexity-validity";
import { evaluateContractAlignmentDraftQuality } from "./contract-alignment-quality";
import { evaluateFunctionalParticipation } from "./fp-validity";
import type { CandidateFunctionalParticipation } from "./reference-model";

export type AlignmentDisposition =
  | "ACCEPTED"
  | "REWRITE_REQUIRED"
  | "SPLIT_REQUIRED"
  | "MERGED_BY_PROVENANCE";
export type AlignmentRoute = "GREEN" | "AMBER" | "RED";

export interface AlignmentSourceIdentity {
  sourceId: string;
  sourceHash: string;
  parentEventId: string;
  domainId: string;
}

export interface AlignmentCandidate extends CandidateFunctionalParticipation {
  lineage?: {
    legacy_source_ids?: string[];
    source_record_sha256?: string;
    source_disposition?: AlignmentDisposition;
    parent_event_id?: string;
    domain_id?: string;
    split_ordinal?: number;
    split_count?: number;
  };
}

export interface AlignmentSourceOutcome extends AlignmentSourceIdentity {
  disposition: AlignmentDisposition;
  candidateIds: string[];
  mergeTargetId?: string;
  declaredRoute?: AlignmentRoute;
  materializationPerformed?: boolean;
}

export interface SafetyResult {
  safe: boolean;
  hazards: string[];
}

export interface BatchGateResult {
  valid: boolean;
  route: AlignmentRoute;
  codes: string[];
  hazards: string[];
}

/** قائمة محافظة ومحكومة؛ المطابقة وجودية ولا تستنتج أن شروط السلامة متوافرة. */
const CONTROLLED_HAZARDS: ReadonlyArray<[string, RegExp]> = [
  ["SHARP", /(?:^|[\s،؛:])(?:ب|ال|بال)?(إبرة|سكين|شفرة|مقص|أداة حادة)(?:$|[\s،؛:.])/u],
  ["HEAT", /(?:^|[\s،؛:])(?:ال|ب)?(ساخن|ساخنة|حرارة|موقد|فرن|غلي|غليان)(?:$|[\s،؛:.])/u],
  ["ELECTRICITY", /(?:كهرباء|كهربائي|قابس|مقبس)/u],
  ["CHEMICAL", /(?:منظف|مطهر|مبيد|مادة كيميائية|كلور)/u],
  ["BIOLOGICAL", /(?:^|[\s،؛:])(دم|إفرازات|نفايات طبية|طعام نيئ)(?:$|[\s،؛:.])/u],
  ["TRAFFIC", /(?:عبور الشارع|حركة المرور|حركة المركبات|مرور المركبات|مركبات الطريق|طريق عام)/u],
  ["HEIGHT", /(?:سلم مرتفع|مكان مرتفع|سطح مرتفع|سطح المبنى|سطح المنزل|شرفة)/u],
  ["FIRE", /(?:دخان|حريق|لهب|إنذار الحريق)/u],
  ["MEDICATION", /(?:دواء|جرعة|أدوية)/u],
  ["PRIVACY_FINANCIAL", /(?:رقم سري|بطاقة مصرفية|بيانات شخصية|حساب بنكي)/u],
];

export function evaluateSafety(candidate: AlignmentCandidate): SafetyResult {
  const text = [
    candidate.title,
    candidate.life_context,
    candidate.functional_intent,
    candidate.observable_effect,
    candidate.natural_completion,
    ...(candidate.execution_blocks ?? []).map((block) => block.text),
  ].filter((value): value is string => typeof value === "string").join(" | ");
  const hazards = CONTROLLED_HAZARDS.filter(([, pattern]) => pattern.test(text)).map(
    ([code]) => code,
  );
  return { safe: hazards.length === 0, hazards };
}

function duplicated(values: readonly string[]): boolean {
  return new Set(values).size !== values.length;
}

export function evaluateAlignmentSourceOutcome(
  outcome: AlignmentSourceOutcome,
  candidates: readonly AlignmentCandidate[],
  identities: readonly AlignmentSourceIdentity[],
  validMergeTargets: ReadonlySet<string> = new Set(),
): BatchGateResult {
  const codes: string[] = [];
  const expected = identities.filter((identity) => identity.sourceId === outcome.sourceId);
  if (expected.length !== 1) codes.push(expected.length ? "DUPLICATE_SOURCE_IDENTITY" : "UNKNOWN_SOURCE");
  const identity = expected[0];
  if (identity && identity.sourceHash !== outcome.sourceHash) codes.push("SOURCE_HASH_MISMATCH");
  if (identity && (identity.parentEventId !== outcome.parentEventId || identity.domainId !== outcome.domainId)) {
    codes.push("SOURCE_IDENTITY_MISMATCH");
  }
  if (duplicated(outcome.candidateIds)) codes.push("DUPLICATE_CANDIDATE_LINK");

  const linked = candidates.filter((candidate) => outcome.candidateIds.includes(candidate.id));
  if (linked.length !== outcome.candidateIds.length) codes.push("MISSING_CANDIDATE");
  const reverseLinked = candidates.filter((candidate) =>
    candidate.lineage?.legacy_source_ids?.includes(outcome.sourceId),
  );
  if (reverseLinked.some((candidate) => !outcome.candidateIds.includes(candidate.id))) codes.push("ORPHAN_CANDIDATE");

  if (outcome.disposition === "MERGED_BY_PROVENANCE") {
    if (outcome.candidateIds.length || reverseLinked.length) codes.push("MERGE_MUST_NOT_CREATE_CANDIDATE");
    if (!outcome.mergeTargetId || !validMergeTargets.has(outcome.mergeTargetId)) codes.push("INVALID_MERGE_TARGET");
  } else if (!outcome.candidateIds.length) {
    codes.push("SOURCE_WITHOUT_CANDIDATE");
  }
  if (outcome.disposition === "SPLIT_REQUIRED" && outcome.candidateIds.length < 2) codes.push("INVALID_SPLIT_COUNT");
  if (outcome.disposition !== "SPLIT_REQUIRED" && outcome.disposition !== "MERGED_BY_PROVENANCE" && outcome.candidateIds.length !== 1) {
    codes.push("INVALID_ONE_TO_ONE_COUNT");
  }

  for (const candidate of linked) {
    const lineage = candidate.lineage;
    if (
      !lineage ||
      lineage.legacy_source_ids?.length !== 1 ||
      lineage.legacy_source_ids[0] !== outcome.sourceId ||
      lineage.source_record_sha256 !== outcome.sourceHash ||
      lineage.source_disposition !== outcome.disposition ||
      lineage.parent_event_id !== outcome.parentEventId ||
      lineage.domain_id !== outcome.domainId
    ) codes.push("LINEAGE_MISMATCH");
  }
  if (outcome.disposition === "SPLIT_REQUIRED" && linked.length >= 2) {
    const ordinals = linked.map((candidate) => candidate.lineage?.split_ordinal);
    const counts = linked.map((candidate) => candidate.lineage?.split_count);
    const expectedOrdinals = linked.map((_, index) => index + 1);
    if ([...ordinals].sort((a, b) => Number(a) - Number(b)).some((value, index) => value !== expectedOrdinals[index]) || counts.some((count) => count !== linked.length)) {
      codes.push("INVALID_SPLIT_LINEAGE");
    }
  }
  if (outcome.materializationPerformed) codes.push("MATERIALIZATION_FORBIDDEN");

  const contentInvalid = linked.some(
    (candidate) =>
      !evaluateFunctionalParticipation(candidate).valid ||
      !evaluateComplexity(candidate).valid ||
      !evaluateContractAlignmentDraftQuality(candidate).valid,
  );
  if (contentInvalid) codes.push("CANDIDATE_GATE_FAILURE");
  const hazards = [...new Set(linked.flatMap((candidate) => evaluateSafety(candidate).hazards))];
  const route: AlignmentRoute = codes.length ? "RED" : hazards.length ? "AMBER" : "GREEN";
  if (outcome.declaredRoute && outcome.declaredRoute !== route) codes.push("FORGED_ROUTE");
  const finalRoute: AlignmentRoute = codes.length ? "RED" : route;
  return { valid: finalRoute !== "RED", route: finalRoute, codes: [...new Set(codes)], hazards };
}

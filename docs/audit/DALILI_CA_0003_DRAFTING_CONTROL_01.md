# DALILI — CA-0003 DRAFTING CONTROL 01

## Scope

CA-0003 is the first scaled Contract Alignment wave. It contains 300 new Legacy sources, excludes
all 150 sources already processed in CA-0001 and CA-0002, and is partitioned into three frozen lanes
of 100 sources each. Drafting remains non-materializing.

## Frozen distribution

| Disposition | Sources |
|---|---:|
| REWRITE_REQUIRED | 231 |
| ACCEPTED | 50 |
| SPLIT_REQUIRED | 15 |
| MERGED_BY_PROVENANCE | 4 |
| Total | 300 |

The remaining non-FP dispositions have a zero quota because all five such corpus records were
already accounted for in CA-0001. Reusing them would violate cumulative conservation.

## Pre-drafting controls

- Every selection row embeds the authoritative source hash, identity, classification artifact,
  disposition, domain, and corpus position.
- Each lane uses the same source-outcome schema; CA-0002 lane-specific schema differences are not
  carried forward.
- Stored validation and route claims are never treated as proof. Acceptance reruns canonical,
  complexity, semantic-quality, safety, provenance, and conservation gates.
- Source hash, identity, lineage, and output mappings must reconcile bidirectionally.
- Safety routing is fail-closed and uses controlled hazard classes.
- MERGED sources create verified links only; SPLIT sources require at least two distinct standalone
  children.
- No CA-0003 identifier may enter a production registry before a later materialization decision.

## Drafting cadence

Each lane is reviewed in micro-batches of 25. A micro-batch must pass structural and semantic gates
before the next 25 records proceed. This limits propagation of a systematic drafting defect.

## Authorization boundary

This control authorizes draft production only. It does not authorize materialization, modification
of the Legacy Master, modification of the canonical validator, or registration of any Framework
Reference.

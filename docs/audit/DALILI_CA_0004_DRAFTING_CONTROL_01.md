# DALILI — CA-0004 DRAFTING CONTROL 01

## Scope

CA-0004 contains 300 new Legacy sources and excludes all 450 sources already processed in
CA-0001, CA-0002, and CA-0003. It is partitioned into three frozen lanes of 100 sources each.
This preflight creates no candidates and performs no materialization.

## Frozen distribution

| Disposition | Remaining before CA-0004 | Selected |
|---|---:|---:|
| REWRITE_REQUIRED | 740 | 231 |
| ACCEPTED | 160 | 50 |
| SPLIT_REQUIRED | 48 | 15 |
| MERGED_BY_PROVENANCE | 15 | 4 |
| **Total** | **963** | **300** |

The selected quotas are the largest-remainder allocation over the 963 eligible sources.

## Domain boundary

No `DOM-CLO` source remains after the prior batches. CA-0004 therefore covers exactly the five
available domains: `DOM-COMM`, `DOM-FOOD`, `DOM-HEALTH`, `DOM-HOME`, and `DOM-SHOP`. It does not
invent or reuse a clothing source to simulate six-domain coverage. Every lane covers all five
available domains.

## Pre-drafting controls

- Every row preserves the authoritative source hash, identity, classification artifact,
  disposition, domain, and corpus position.
- The three lane inputs use the unified CA-0003 source-outcome schema without alteration.
- Stored validation and route claims are not accepted as proof; later acceptance must rerun all
  canonical, complexity, semantic-quality, safety, provenance, and conservation gates.
- Source identity and output mappings must reconcile bidirectionally.
- Safety routing remains fail-closed and uses controlled hazard classes.
- MERGED sources may create verified provenance links only; SPLIT sources require at least two
  distinct standalone children.

## Drafting cadence

Each 100-source lane is reviewed in four micro-batches of 25. No later micro-batch proceeds until
the preceding micro-batch passes structural and semantic gates.

## Authorization boundary

This control authorizes drafting preparation only. It does not authorize candidate creation,
materialization, production registration, modification of the Legacy Master, modification of the
canonical validator, or registration of any Framework Reference.

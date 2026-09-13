# DALILI MVP MANUAL UI SMOKE 01

Date: 2026-09-13

## Purpose

This smoke test verifies the nearest MVP family journey path in the running local UI.

It does not validate the full 1413 Legacy Master opportunities and does not approve new expansion. It validates only the fixed MVP scope behavior already represented in `DALILI_MVP_SCOPE_01`.

## Tested Routes

Local host:

`http://127.0.0.1:5173`

Routes:

1. `/lab/slice/workspace/GJ-EASY-001`
2. `/lab/slice/workspace/FR-B03-HEALTH-001-OP001`
3. `/lab/slice/workspace/FR-EXP12-02-SHOP005-OP003`

These represent:

- Home / Family journey
- Community / Health journey
- Usable Card journey

## Checks

For each route, the UI was checked for:

- workspace page opens;
- editor shows one active step at a time;
- next/previous navigation changes the active step;
- full step list is not displayed inside the editor;
- workspace language does not contain therapy/training/skill/independence framing;
- preview opens from `صمّم بطاقة المشاركة`;
- preview contains `خطوة بخطوة`, `رأسي`, and `أفقي`;
- approval entry `اعتماد بطاقة المشاركة` is visible;
- `اسم البطاقة` appears once after renaming the section title to `تفاصيل البطاقة`.

## Result

| Probe | Result |
| --- | --- |
| `GJ-EASY-001` | PASS |
| `FR-B03-HEALTH-001-OP001` | PASS |
| `FR-EXP12-02-SHOP005-OP003` | PASS |

## UI Adjustment Made

The workspace step editor now presents one active step at a time with previous/next controls.

The card preview section title was changed from `اسم البطاقة` to `تفاصيل البطاقة` to avoid duplicate visible wording.

## Verdict

`Family Journey Ready = PASS`

Remaining MVP blocker:

`Governance / Data Integrity Ready = PENDING`

The pending item is remote repository sync for local MVP commits when GitHub network execution is available.

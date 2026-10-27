# T-010: Unit tests for the backpack and crafting

- **Assigned to:** ChatGPT (Codex)
- **Status:** review
- **Priority:** P1
- **Deliver to:** pull request from branch `chatgpt/T-010-inventory-tests`
- **Depends on:** nothing

## Goal
The backpack (`src/systems/inventory.ts`) and crafting recipes (`src/data/items.ts`) have no tests yet. Add them so later changes cannot quietly break them.

## Read first
- `AGENTS.md`
- `src/systems/inventory.ts`, `src/data/items.ts`
- An existing test for style, for example `tests/base.test.ts`

## Files you may change
- `tests/inventory.test.ts` (new). Nothing else. If you find a real bug, **do not fix it**: describe it in the pull request.

## What to test
1. Adding items stacks up to each item's `stack` size, then fills new slots; `add` returns what did not fit when all 8 slots are full.
2. `remove` takes from the right stacks and returns false (taking nothing) when there is not enough.
3. `count` adds across stacks.
4. `canCraft` is true exactly when every ingredient of a recipe is present.
5. Every recipe in `RECIPES` refers only to item ids that exist in `ITEMS`, and every `placeable` item points to a machine that exists in `MACHINES`.
6. Every item has a non-empty `name` and `note`, and `stack` ≥ 1.

## Done when
- [ ] `npm test` passes with the new tests (and they fail if you deliberately break `inventory.ts`; say in the PR that you checked this)
- [ ] `npm run build` passes
- [ ] Only `tests/inventory.test.ts` added; task Status set to `review`

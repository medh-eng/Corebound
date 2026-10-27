# T-013: Tests that check the game data fits together

- **Assigned to:** ChatGPT (Codex)
- **Status:** done (merged 2026-10-27)
- **Priority:** P1
- **Deliver to:** pull request from branch `chatgpt/T-013-data-checks`
- **Depends on:** nothing (can be done together with T-010)

## Goal
M2 added a research tree and many machines as data (`src/data/items.ts`, `src/data/research.ts`). A typo there breaks the game silently. Add tests that catch it.

## Read first
- `AGENTS.md`; `src/data/items.ts`, `src/data/research.ts`, `src/data/story.ts`, `src/data/names.ts`

## Files you may change
- `tests/data.test.ts` (new). Nothing else. Report real problems in the pull request; do not fix data yourself.

## What to test
1. Every `Recipe.research` names a node that exists in `RESEARCH`.
2. Every node's `requires` names existing nodes, and the tree has no loops.
3. Every item in a node's `needs`, a recipe's `needs`, a machine's `accepts`, or a process's `needs`/`makes` exists in `ITEMS`.
4. Every item with `placeable` points to a machine in `MACHINES`, and every machine (except the solar lotus, which the base starts with) can be crafted by some recipe.
5. Every machine has `radius > 0` and `height > 0`; processes have `seconds > 0`.
6. Goal ids in `CHAPTER1_GOALS` are unique; the last one is `done`.
7. Every entry in `names.ts` has a non-empty `name`, `deva` and `say`.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Only `tests/data.test.ts` added; this file's Status set to `review`

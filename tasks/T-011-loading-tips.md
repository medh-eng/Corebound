# T-011: Tips on the loading screen

- **Assigned to:** ChatGPT (Codex)
- **Status:** review
- **Priority:** P2
- **Deliver to:** pull request from branch `chatgpt/T-011-loading-tips`
- **Depends on:** nothing

## Goal
While the game loads, show one helpful tip under the loading bar, changing every 5 seconds.

## Read first
- `AGENTS.md` (writing style), `docs/GDD.md` §6 Survival and §14 The first hour
- `src/ui/ui.ts` (`#loading`, `loading()`, `hideLoading()`), `src/ui/style.css` (`#loading`)

## Files you may change
- `src/data/tips.ts` (new), `src/ui/ui.ts`, `src/ui/style.css`

## What to build
1. `src/data/tips.ts` exports `TIPS: string[]`: write **15 tips**, each under 90 characters, true for the current game (controls, oxygen, the shelter, power at night, the smelter, digging deeper, dancing with G). Plain, friendly, British spelling; no story spoilers.
2. Under the loading bar, a line `#loading .tip` shows a random tip; every 5 s it fades to the next one (no repeats until all are shown). The timer stops in `hideLoading()`.
3. Style: small, soft colour (`var(--ink-dim)`), centred, max width 520 px.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Tips come from `src/data/tips.ts`; the interval is cleared when loading ends
- [ ] Only the three files changed (plus this task's Status line)

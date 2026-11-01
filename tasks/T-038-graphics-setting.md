# T-038: A Graphics setting (Phone / Low / High)

- **Assigned to:** ChatGPT (Codex)
- **Status:** review
- **Priority:** P2 (phone track P2)
- **Deliver to:** pull request from branch `chatgpt/T-038-graphics-setting`

## Goal
The game picks its graphics preset from the device: touch screens get **Phone**, others **High**, and `?q=low|phone|high` overrides it for testing. Players cannot change it. Some phones are fast enough for more, and some laptops need less. Add a **Graphics** choice to the pause menu.

## Read first
`AGENTS.md`; `src/main.ts` (how `quality` is chosen); `src/ui/ui.ts` (the pause menu settings: `#shadows`, `#text-size`); `src/game.ts` only to read what each preset changes (search for `phone` and `low`). Do not change `src/game.ts`.

## Files you may change
`src/main.ts`, `src/ui/ui.ts`, `src/ui/style.css`, a new test file in `tests/`, this task's Status line.

## What to build
1. A **Graphics** row after "Text size": a select with **Phone**, **Low** and **High**, showing the preset in use now.
2. Changing it saves `corebound.quality` in `localStorage` (try/catch, as for text size), shows the note "Applies after restart" next to it, and offers a **Restart now** button that saves the game first (`ui.menu.save()`) and reloads.
3. In `src/main.ts` the order is: the `?q=` URL value, then the saved value, then the device default. A broken saved value is ignored.
4. A unit test for the choice order (put the choice in a small pure function you export and test).

## Done when
- [ ] `npm test` and `npm run build` pass; only the allowed files changed
- [ ] On `/?touch=1`, choosing High and restarting gives shadows and full grass; choosing Phone again goes back
- [ ] Screenshot of the pause menu at 800 × 360 with `?touch=1` in the pull request

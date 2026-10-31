# T-026: A text size setting

- **Assigned to:** ChatGPT (Codex)
- **Status:** changes requested (PR #22)
- **Priority:** P2 (M4: settings and accessibility, GDD §16)
- **Deliver to:** pull request from branch `chatgpt/T-026-text-size`
- **Start after:** T-021 is merged (both change `src/ui/ui.ts`) — merged 2026-10-29, so start now; work from the latest `main`

## Goal
Some players need bigger text. Add a **Text size** choice to the settings in the pause menu that makes every panel of the interface bigger or smaller together, and remember it.

## Read first
- `AGENTS.md`; `src/ui/ui.ts` (the pause menu markup with `#sens` and `#shadows`, and `showPause`); `src/ui/style.css`.

## Files you may change
- `src/ui/ui.ts`, `src/ui/style.css` only (plus this task's Status line).

## What to build
1. A **Text size** row after "Shadows" in the pause menu: a `<select id="text-size">` with **Normal** (1), **Large** (1.15) and **Larger** (1.3).
2. The choice is applied at once by setting a CSS variable `--ui-scale` on `document.documentElement`, and saved in `localStorage` under `corebound.textSize` (wrap reads and writes in try/catch; a missing or broken value means Normal). It is applied when the interface is created, so it holds after a reload.
3. **Phones already scale the panels** (added by the Director on 2026-10-29): look for `body.touch` in `style.css`, where the HUD panels and the panel cards use `zoom: var(--ui-scale)`. Build on that instead of adding a second zoom: name your variable `--text-scale`, make every panel listed here use `zoom: calc(var(--ui-scale, 1) * var(--text-scale, 1))` on desktop and on phones, and keep the phone `--ui-scale` values as they are. The panels: the HUD panels (vitals, goals, resources, gear, SARATHI's line, prompts, toasts, pickups, planet), and the cards of the pause menu, the backpack, the build menu, the research panel, the Codex, the memory-log viewer and the credits. Do **not** scale the game canvas or the touch buttons.
4. At 1280 × 720 with **Larger**, panels may sit closer together but must not cover each other's text; at 360 px wide the menus still fit (scrolling inside a panel is fine).
5. Keyboard: the select is reachable with Tab like the other settings; it has a visible label.

## Done when
- [ ] `npm test` and `npm run build` pass; only the two files changed (plus this Status line)
- [ ] Changing the setting resizes the panels at once and survives a reload
- [ ] Screenshots in the pull request: the HUD at Normal and Larger, and the pause menu at Larger; and one phone-sized screenshot (`?touch=1` at 800 × 360) at Larger

## Changes requested by the Director (30 Oct)
1. Rebase `chatgpt/T-026-codex-text-size` onto the current `main` and resolve conflicts in `src/ui/ui.ts`.
2. Run the dev server (`COREBOUND_BASE=/ npx vite --port 5173`) and take four screenshots with `scripts/screenshots.mjs`: HUD at Normal; HUD at Larger; pause menu at Larger; `/?touch=1` at 800×360 at Larger. Commit them under `team-inbox/screens/T-026/` and show them in the PR.
3. Confirm nothing overlaps or runs off screen at Larger, panels scroll, and the setting survives a reload.

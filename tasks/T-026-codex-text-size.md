# T-026: A text size setting

- **Assigned to:** ChatGPT (Codex)
- **Status:** todo
- **Priority:** P2 (M4: settings and accessibility, GDD §16)
- **Deliver to:** pull request from branch `chatgpt/T-026-text-size`
- **Start after:** T-021 is merged (both change `src/ui/ui.ts`)

## Goal
Some players need bigger text. Add a **Text size** choice to the settings in the pause menu that makes every panel of the interface bigger or smaller together, and remember it.

## Read first
- `AGENTS.md`; `src/ui/ui.ts` (the pause menu markup with `#sens` and `#shadows`, and `showPause`); `src/ui/style.css`.

## Files you may change
- `src/ui/ui.ts`, `src/ui/style.css` only (plus this task's Status line).

## What to build
1. A **Text size** row after "Shadows" in the pause menu: a `<select id="text-size">` with **Normal** (1), **Large** (1.15) and **Larger** (1.3).
2. The choice is applied at once by setting a CSS variable `--ui-scale` on `document.documentElement`, and saved in `localStorage` under `corebound.textSize` (wrap reads and writes in try/catch; a missing or broken value means Normal). It is applied when the interface is created, so it holds after a reload.
3. In `style.css`, scale the interface panels with `zoom: var(--ui-scale, 1)`: the HUD panels (vitals, goals, resources, SARATHI's line, prompts, toasts), the pause menu, the backpack, the build menu, the research panel, the Codex and the memory-log viewer. Do **not** scale the game canvas.
4. At 1280 × 720 with **Larger**, panels may sit closer together but must not cover each other's text; at 360 px wide the menus still fit (scrolling inside a panel is fine).
5. Keyboard: the select is reachable with Tab like the other settings; it has a visible label.

## Done when
- [ ] `npm test` and `npm run build` pass; only the two files changed (plus this Status line)
- [ ] Changing the setting resizes the panels at once and survives a reload
- [ ] Screenshots in the pull request: the HUD at Normal and Larger, and the pause menu at Larger

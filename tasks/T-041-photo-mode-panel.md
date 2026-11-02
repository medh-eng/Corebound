# T-041: Photo mode panel

- **Assigned to:** ChatGPT (Codex)
- **Status:** todo
- **Priority:** P2 (M4 slice 6; can be built now)
- **Deliver to:** pull request from branch `chatgpt/T-041-photo-mode`

## Goal
Players should be able to take clean pictures of Jivagraha for the store pages and to share. You build the panel and the picture-saving; the Director wires it to the camera and the P key in `src/game.ts`.

## Read first
`AGENTS.md`; `src/ui/ui.ts` (how panels open and close: the Codex and the pause menu); `src/ui/style.css`; `src/ui/touch.ts` (button names on phones). Do not change `src/game.ts`.

## Files you may change
A new file `src/ui/photo.ts`, `src/ui/style.css`, a new test file in `tests/`, this task's Status line.

## What to build
Export a class `PhotoMode` with:
1. `open()` / `close()` and a read-only `isOpen`. Opening adds the class `photo-mode` to `document.body`; your CSS hides the HUD (vitals, goals, SARATHI's line, prompts, touch buttons) while it is set, and shows a small bar at the bottom: **Exposure** slider (−1 to +1, step 0.1), **Hide the Custodian** toggle, **Take picture** button, **Close** button.
2. Callbacks the Director will connect: `onExposure(value: number)`, `onHidePlayer(hidden: boolean)`, `onClose()`.
3. `capture(canvas: HTMLCanvasElement, filename?: string): Promise<string>`: saves the canvas as a PNG download named `corebound-YYYY-MM-DD-HHMM.png` (local time) unless a name is given, and returns the name. Put the file-name maker in a small pure exported function and test it.
4. While the bar is open, a short flash (white, 120 ms, fading) after each picture. The bar itself is never in the picture: hide it for the frame you capture (`requestAnimationFrame`, then show it again).
5. Works with mouse and touch; buttons at least 44 px tall on phones.

## Rules
No new libraries. British spelling in labels. The bar uses the existing panel colours in `style.css`.

## Done when
- [ ] `npm test` and `npm run build` pass; only the allowed files changed
- [ ] Test for the file-name function (two dates, including a single-digit month and minute)
- [ ] A screenshot of a test page showing the bar at 800 × 360 in the pull request (you can open it from the browser console with `new PhotoMode().open()` after importing it in a scratch page; do not commit the scratch page)

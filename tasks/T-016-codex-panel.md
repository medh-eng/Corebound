# T-016: The Codex panel

- **Assigned to:** ChatGPT (Codex)
- **Status:** done (merged 2026-10-27)
- **Priority:** P1 (M3)
- **Deliver to:** pull request from branch `chatgpt/T-016-codex-panel`
- **Depends on:** nothing

## Goal
In M3 the player scans plants, creatures, rocks and machines to unlock **Codex** entries. Build the panel that shows them. The Director wires the key and the scanning.

## Read first
- `AGENTS.md`
- `src/data/codex.ts` (the `CodexEntry` shape and three sample entries)
- `src/ui/ui.ts`: how `#research` is built (`renderResearch`, `setResearch`, `researchOpen`), and `src/ui/style.css` (`#build, #research` rules)

## Files you may change
- `src/ui/ui.ts`, `src/ui/style.css`. Nothing else (do not change `src/data/codex.ts` or `src/game.ts`).

## What to build
1. A hidden overlay `#codex` built in the UI constructor like `#research`: title "Codex", a row of filter tabs (All · Flora · Fauna · Minerals · Machines · Worlds), a list on the left, the selected entry on the right (one column on narrow screens).
2. Public methods on `UI`:
   - `renderCodex(unlocked: string[], newIds: string[] = [])`: lists only entries whose `id` is in `unlocked`; entries in `newIds` get a small "new" badge; locked entries are counted at the bottom as "N still to discover" (count from `CODEX.length`).
   - `setCodex(open: boolean)` and a getter `codexOpen`.
3. The entry view shows `title`; if present, `name` and `deva` on one line (Devanagari in a font that supports it: add `"Noto Sans Devanagari"` to the font stack for that element only); `text`; and `science` in a small boxed "Science" line.
4. Clicking a tab filters; clicking an entry shows it; the first unlocked entry is shown by default.
5. Style like the research panel; must work at 360 px wide without sideways scrolling.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Only `src/ui/ui.ts` and `src/ui/style.css` changed (plus this file's Status)
- [ ] Describe in the PR how you checked the layout (you may build a temporary page locally; do not commit it)

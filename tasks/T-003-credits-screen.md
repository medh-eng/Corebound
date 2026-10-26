# T-003: Credits screen

- **Assigned to:** ChatGPT (Codex)
- **Status:** todo
- **Priority:** P1 (small first task to test the pull request workflow)
- **Deliver to:** pull request from branch `chatgpt/T-003-credits`
- **Depends on:** nothing

## Goal
Add a Credits screen reachable from the title screen and from the pause menu.

## Read first
- `AGENTS.md`
- `src/ui/ui.ts` (how the title screen `#title` and pause menu `#pause` are built and shown)
- `src/ui/style.css` (`.card`, `.btn`, `#pause` styles to reuse)

## Files you may change
- `src/data/credits.ts` (new)
- `src/ui/ui.ts`
- `src/ui/style.css`

Do **not** change `src/game.ts` or anything else.

## What to build
1. `src/data/credits.ts` exports the credits as data, for example:
   ```ts
   export const CREDITS = {
     title: 'A game by',
     author: 'Medhanshu Shahane',
     lines: ['Thank you for playing Corebound.'],
   };
   ```
2. In `ui.ts`, a hidden overlay `#credits` built in the constructor like `#pause`, using a `.card`, showing the logo image (same `assetUrl('ui/logo.webp')` as the title), the credits text, and a **Close** button.
3. A **Credits** button: on the title screen (in `.btns`, after New game) and in the pause menu (in `.menu-btns`, after Main menu).
4. Opening credits hides nothing else; closing returns to whatever was open (title or pause). Esc should also close it: add a `keydown` listener in the UI class that closes `#credits` when it is open (and stops the event from doing anything else only when it was open).
5. Styling: match the existing cards and buttons; text centred; the author's name larger than the rest.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Credits button on the title screen and in the pause menu; Close and Esc both close it
- [ ] Text comes from `src/data/credits.ts`
- [ ] Only the three listed files changed
- [ ] Pull request uses the template in AGENTS.md; this file's Status set to `review`

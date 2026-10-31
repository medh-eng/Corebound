# T-028: Phone help card and HUD wording fixes (issues #23 and #25)

- **Assigned to:** ChatGPT (Codex)
- **Status:** todo
- **Priority:** P1
- **Branch:** `chatgpt/T-028-phone-help-hud-wording`

## Goal
On phones the game still shows keyboard instructions in a big help panel that covers the middle of the screen (#23), and some HUD prompts repeat words: "3 3 iron plate ready", "Pick up pick up", "Use load ice" (#25).

## Note (31 Oct)
T-029 is merged and changed `src/ui/touch.ts`; start your branch from the current `main`.

## Read first
`AGENTS.md`; issues #23 and #25 on GitHub; `src/ui/ui.ts` (the `#help` panel, around line 146, and the prompt texts); `src/ui/touch.ts` (how touch mode rewrites prompts); `src/data/controls.ts`; the "Playing on a phone" section of `team-inbox/writing/T-027-privacy-and-phone-help.md` (approved text).

## Do
1. Move the 11 approved phone-help lines into `src/data/controls.ts` as `export const PHONE_HELP: string[]`.
2. In touch mode, the help panel shows `PHONE_HELP` instead of the keyboard list. It must sit at the **top-left, at most 40% of the screen width**, never over the centre, and fade after 20 seconds (as desktop does). Desktop keeps the keyboard list.
3. Fix #25 at the source: build each prompt from one template so a count or verb appears once. Use "1 iron plate ready" / "3 iron plates ready" (plural with an "s"), "Pick up", and "Load ice". On touch, replace whole phrases (for example "Press E to load ice" → "Tap Use to load ice"), never single words.
4. Add unit tests for the prompt builder: counts 1 and 3, pickup, loading; desktop and touch wording.

## Allowed files
`src/ui/ui.ts`, `src/ui/touch.ts`, `src/ui/style.css`, `src/data/controls.ts`, `tests/` (new test file), this task's Status line.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Phone help shows touch lines, top-left, centre clear; checked with `?touch=1` at 800×360
- [ ] None of the three bad phrases can appear; tests prove it
- [ ] PR opened with the AGENTS.md template; Status set to "review"

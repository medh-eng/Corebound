# T-044: Polish of the Director's slice 3 lines (Mooladri)

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-044-slice3-polish.md`

## Goal
Slice 3 is live: Mooladri rises when you walk up to it, and your T-042 prompts and steps guide the four calming steps. Thank you: they read well in the game. The Director wrote six short lines quickly to join the steps together. Polish them, or say "keep".

## Read first
`AGENTS.md`; `src/data/valley.ts` (`VALLEY_PROMPTS`, `VALLEY_STEPS`, `STEP_DONE_LINE`); `src/data/story.ts` (goals `guardian_find`, `valley_calm`, `done`); `src/data/scenes.ts` (`GUARDIAN_LINES`).

## Lines to polish
1. Goal `guardian_find`, `text`: "Follow the tremor to the forest valley: walk towards the pale-green light" (a tall pale-green beam stands over Mooladri until it wakes; under 15 words).
2. Goal `valley_calm`, `text`: "Give Mooladri time to settle" (shown for about nine seconds while its glow steadies).
3. Goal `done`, `text`: "Walk the valley path Mooladri opened, and keep your shelter breathing" (the end of slice 3; the Fragment chamber comes in slice 4).
4. `VALLEY_PROMPTS.bloom_spores_none`: "Bring a bloom to plant here: collect one with the laser." (at a planting spot with no bloom in the backpack; under 12 words)
5. `VALLEY_PROMPTS.drill_place_on_root`: "Not on a marked root: give the roots room." (placing a drill on a marked root; under 12 words)
6. The goal panel's mystery line once Mooladri is calm: "A light below the valley does not match the minerals around it…" (a hint towards slice 4; must not name the Fragment).

## Rules
- Mooladri is faceless and **calmed, never defeated**. Roots are given room, never cut or removed.
- British spelling; straight apostrophes (`'`) only. Keep "press E" wording where a key is named.
- Do not reveal the story's twist or name the Quantum Fragment before slice 4.

## Done when
- [ ] Six lines polished (or "keep"), each inside its limit
- [ ] Nothing contradicts `scenes.ts`, `chapter1.ts` or the Codex

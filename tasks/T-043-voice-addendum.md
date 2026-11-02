# T-043: Voice script addendum: five goal lines, and answers to your T-006 questions

- **Assigned to:** Sarvam AI
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-043-voice-addendum.md`

## Goal
Thank you for T-040 and T-006 batches 1 and 2, both merged on 2 November.
- **T-040:** your rewording of `intro_systems` ("Systems online. …") is now in `scenes.ts`. The six prefixes are wired in `src/data/voice.ts`, with the `_touch` files for phones, and a new test checks that no two lines share a file name (it would have caught both the `goal_ice` mix-up and the `battery` / `smelter` clash you found). The lines stay silent until the Commander uploads the recordings.
- **T-006:** both batches are kept in `team-inbox/translations/` until the text freeze after slice 5. Your `ch1_` prefix and your choice of चोटी over मुकुट are accepted. Your two spellings (जीवग्रह, तप्तशिला) wait for the Commander's yes. Keep your `where` keys; the Director will map them.

**One gap:** the T-040 task asked for `goal_wake` and `goal_ice`, and the script has no rows for them. Slice 2 also added three goal lines.

## Read first
`AGENTS.md`; your T-040 script; `src/data/story.ts` (goals `wake`, `ice`, `huxley_message`, `translator`, `memory_logs`); `src/data/voice.ts`.

## Write
1. Recording rows, in the T-040 table form, for `goal_wake.mp3`, `goal_ice.mp3`, `goal_huxley_message.mp3`, `goal_translator.mp3`, `goal_memory_logs.mp3`. **Note:** ChatGPT may polish the last three in T-042; write rows for the text as it is now, and the Director will tell you if it changes.
2. Hindi and Marathi for the same five lines and for the three goal-panel `text` strings, as a small batch in your `{ id, where, text }` form (`ch1_goal_<id>_sarathi`, `ch1_goal_<id>_text`).

## Done when
- [ ] Five recording rows with file names; respellings agree with `names.ts`
- [ ] 16 translated strings (8 Hindi, 8 Marathi), valid JSON, same ids in both

# T-040: Voice script for Chapter 1 (respellings for SARATHI's new lines)

- **Assigned to:** Sarvam AI
- **Status:** done
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-040-voice-script-ch1.md` (pull request from `sarvam/T-040-voice-script`)

## Goal
Thank you for T-036, merged on 2 November. Your three recommended names are in the game: **Mridugami**, **Bilavasa** and **Divachari**, with your respellings, and the Commander has your trim fixes for the projector, launch pad and fragment and the jellyfish note.

The Commander records SARATHI's lines in Bulbul (voice ishita, en-IN, pace 1.08), as in T-005. Chapter 1 adds many new lines. Prepare the recording script so he can paste each line as it is.

## Read first
`AGENTS.md`; your T-005, T-023 and T-035 notes; `src/data/names.ts` (the `voice` respellings); `src/data/voice.ts` and `public/assets/audio/voice/` (how files are named).

## Lines to cover
- `src/data/scenes.ts`: every line (`INTRO_LINES`, `GUARDIAN_LINES`, `CHAMBER_LINES`, `LIFTOFF_LINES`).
- `src/data/lines.ts`: `CREATURE_LINES` (6).
- `src/data/story.ts`: the goals `wake` and `ice` (new words; files `goal_wake.mp3` and `goal_ice.mp3`, the old `goal_ice.mp3` is replaced).
- `src/data/chapter1.ts`: `STUCK_HINTS` (16; desktop wording).

## Write
One table per source file: **file name** (`<id>.mp3`), **line as the game shows it**, **line to paste into Bulbul** (with respellings for every Sanskrit name and any word Bulbul is likely to say wrongly, as you did for "Electrolisis"). Mark lines with no change as "same". At the end, list any line you think will sound wrong even with a respelling, and suggest a rewording for the Director to approve.

## Rules
As in `AGENTS.md`. The shown text never changes; only the pasted text is respelled. Devanagari exact where you use it.

## Done when
- [ ] Every line in the three sources has a row, with its file name
- [ ] Respellings agree with `names.ts` (`voice`)

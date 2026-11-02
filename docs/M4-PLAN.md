# M4 build plan: the Chapter 1 demo

*Written by the Director on 2 November 2026. The Commander said **go** the same morning.*

**Progress:** slice 1 ✓ (2 Nov) · slice 2 next

M4 turns the sandbox into a story you can finish in about an hour: wake in a crashed pod, survive, build a factory, calm Mooladri, find the Fragment and lift off. It is built in **six slices**. Each slice ends playable and live on GitHub Pages, so the Commander can play after each one and stop us early if something feels wrong.

## What is already ready

| Piece | Where | Status |
| --- | --- | --- |
| Scene lines (wake-up, Mooladri, chamber, lift-off) | `src/data/scenes.ts` (T-022) | ✓ |
| Goals and stuck hints, desktop and phone | `src/data/chapter1.ts` (T-031) | ✓ |
| Codex entries for 10 Chapter 1 objects | `CHAPTER1_CODEX` in `src/data/codex.ts` (T-030) | ✓ |
| Huxley's message and 9 memory logs; log viewer; Logs tab | `src/data/logs.ts`, T-019, T-021 | ✓ |
| Huxley hologram, SARATHI drone, Custodian | in the game | ✓ |
| Models: escape module, cryo pod, vehicle bay, rover, launch pad, memory log, translator, projector, quantum fragment, Sabatier reactor | `public/assets/` | ✓ processed (trim fixes wanted on four, see the checklist) |
| Store page text and AI disclosure draft | `team-inbox/writing/T-025-store-text.md` | ✓, needs the Commander's yes |
| **Missing:** starter ship model; Mooladri's final trunk concept; machine loops and ambience; `memory_log` and `spaceflight` music | Commander | ⏳ |

## The six slices

**Slice 1: Waking up** (first 5 minutes) ✓ built 2 Nov
- New game starts inside the crashed escape module: the cryo pod opens, SARATHI's intro lines play, oxygen is low, the hatch opens on sunrise.
- Escape module and cryo-pod placed behind where you start; the module's last air refills the suit until it runs out.
- Goal panel switches to the Chapter 1 list (`chapter1.ts`); the existing M1–M2 goals become the sub-steps under it.
- Stuck hints: after 3 minutes with no progress on the active goal, SARATHI says the hint (phone wording on touch screens).
- *Check:* a playtest that runs the opening without touching anything and confirms each hint appears.

**Slice 2: Huxley, the translator and the logs**
- Huxley's projector inside the module plays his first message; the translator is picked up from the module.
- Memory logs (the Commander's model) placed in the wreckage and around the planet; each opens in the log viewer and stays in the Logs tab.

**Slice 3: Mooladri** (the heart of the demo)
- Mooladri's body built in code from roots (the approved trunk, faceless, crown of glowing root tips), with calm and restless states driven by Harmony and drill pressure on its roots.
- The closed valley: living roots block the way until Mooladri is calm.
- The three-step calming puzzle, in the order of `scenes.ts`: seismic scan shows the roots and you move drills off them; bio-filters clear the haze; replant bloom spores in clean soil. Mooladri settles, the valley opens, and plants clean pollution twice as fast afterwards.
- Never fought: no health bar, no damage, nothing hits the player.
- Waits for: the Commander's final trunk concept (for proportions). The body itself is code.

**Slice 4: The rover and the Fragment chamber**
- Vehicle bay (build menu), rover assembly, driving on the round planet (keyboard and phone joystick), getting in and out.
- The Fragment chamber below the valley: glimpse early, reachable after Mooladri calms; scanning the Fragment.

**Slice 5: Launch pad and lift-off**
- Launch pad and starter ship parts; hydrogen and oxygen fuel from the electrolyzer; launch checks.
- The lift-off cutscene: the ship rises, Jivagraha falls away as a small round world, cut to the credits and a "to be continued" card.
- Waits for: the starter ship model.

**Slice 6: Finish and publish**
- Difficulty (Calm / Standard / Engineer, as in GDD §16), photo mode, the Graphics setting (T-038), first-hour pacing pass.
- Credits, store pages on itch.io (and the Steam page text) once the Commander approves the text.
- **Hook test (the M4 gate):** five first-time players play the first 30 minutes while the Commander watches; every bored or lost moment is fixed before publishing.

## How the workers help during M4

- **ChatGPT (chat):** T-039 (SARATHI's lines for the new machines and vehicles), then pacing rewrites after each slice.
- **Sarvam AI:** T-040 (the voice script, so the Commander can record Chapter 1 in Bulbul), then the Hindi and Marathi translation (T-006) once the text is frozen after slice 5.
- **ChatGPT (Codex):** T-038 (Graphics setting) now; small isolated pieces (photo mode panel, difficulty setting) as task files during slice 6.
- **The Director** builds slices 1 to 5 itself: they are engine and integration work.

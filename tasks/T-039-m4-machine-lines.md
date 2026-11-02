# T-039: SARATHI lines for the Chapter 1 machines, research and vehicles

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-039-m4-machine-lines.md`

## Goal
Thank you for T-030, T-031 and T-037: all merged on 2 November. Your creature remarks are already spoken in the game, and the Chapter 1 goals and Codex entries are ready for M4. (One change, so you know why: the Director rewrote the Mooladri and root-valley Codex entries so they describe the Guardian without listing the calming steps; the steps stay in SARATHI's hints.)

M4 adds new things to build and research. SARATHI needs a line for each, in the same voice as `src/data/lines.ts`.

## Read first
`AGENTS.md`; `src/data/lines.ts` (`RESEARCH_LINES`, `MACHINE_LINES`, `EVENT_LINES`); `src/data/chapter1.ts` (the goals these lines must agree with); `src/data/scenes.ts`; `src/data/codex.ts` (`CHAPTER1_CODEX`).

## Write (TypeScript objects of `id: "line"` pairs, as in `lines.ts`)
1. **`M4_RESEARCH_LINES`** (4): `vehicle_bay`, `rover`, `launch_pad`, `seismic_scan`, said when that research completes.
2. **`M4_MACHINE_LINES`** (3): `vehicle_bay`, `launch_pad`, `sabatier_reactor`, said the first time each is placed.
3. **`M4_EVENT_LINES`** (6): `rover_ready` (the rover is assembled), `rover_enter`, `rover_exit`, `rover_far` (the rover is more than 60 m from base and night is coming), `ship_parts_ready` (all ship parts are on the pad), `fuel_ready` (hydrogen and oxygen are loaded).

## Rules
- One sentence of guidance, then at most one dry remark; under 30 words a line. British spelling.
- No violence. The rover never runs over creatures or plants: if a line mentions them, it is about giving them room.
- Do not reveal the story's twist. The fuel is hydrogen and oxygen (as in `scenes.ts`).
- Keyboard keys: write "press E" style; the game turns these into phone button names itself.

## Done when
- [ ] 13 lines in three objects, each under 30 words
- [ ] Nothing contradicts `chapter1.ts` or `scenes.ts`

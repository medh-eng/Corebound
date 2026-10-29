# T-022: Chapter 1 scenes: waking up, the Root Guardian and the lift-off

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P1 (M4)
- **Deliver to:** `team-inbox/writing/T-022-chapter1-scenes.md`

## Goal
M4 turns Jivagraha into a finished demo. Your memory logs (T-001) are in; these are the spoken lines around them.

## Read first
- `AGENTS.md`; `docs/GDD.md` §14 (the first hour), §15 (story), the Guardians section (Mooladri row) and §11 (Harmony).
- `src/data/logs.ts` (your logs, for voice and facts); `src/data/lines.ts` (SARATHI's voice); `src/data/names.ts` (Mooladri, Deepajana, the plant names).

## Write (one TypeScript object per section, `id: "line"` pairs, like `EVENT_LINES` in `src/data/lines.ts`)
1. **`INTRO_LINES`** (6–8 lines): the cryo-pod hisses open in the crashed escape module; SARATHI wakes the Custodian, gives one dry joke, the oxygen problem, and points outside. The last line is said as the hatch opens on the curved horizon at sunrise.
2. **`GUARDIAN_LINES`** (12–16 lines) for **Mooladri**, the Root Guardian:
   - the first tremor and the "shadow under the forest" (minute 5);
   - waking (`restless`, `awake`): what the player sees, never a threat to the player;
   - the three-step calming puzzle, one hint line each and one "done" line each: (a) a seismic scan shows its roots: move drills off them; (b) bio-filters clear the smog; (c) replant bloom spores where the soil is clean;
   - the calm moment (the Guardian settles; the closed-off valley opens) and the ally bonus ("flora absorbs twice the pollution").
3. **`CHAMBER_LINES`** (3–4 lines): the Quantum Fragment chamber glimpsed below the crust.
4. **`LIFTOFF_LINES`** (4–6 lines): the starter ship's first lift-off; the last line is the demo's cliffhanger and points to Taptashila. Do not reveal the twist.

## Rules
- **No violence.** Mooladri is calmed, never defeated, hurt, stunned or "beaten". No weapon words (no "fire", "target", "shoot"; the laser is a mining tool).
- SARATHI: one sentence of guidance, then at most one dry remark. Lines under 30 words, said aloud in under 8 seconds.
- British spelling. Keep "the bloom" in English in these lines (its Codex name is Sakshi).
- **Mooladri has no face** (decided 2026-10-29): a giant of roots and mossy bark with a crown of glowing root tips. Never write eyes, a face, a gaze or a voice for it; show its mood through its roots, the ground, the light in its crown and the forest around it. Look at `art-inbox/concept/guardian_root.png` and `guardian_root_restless.png`.

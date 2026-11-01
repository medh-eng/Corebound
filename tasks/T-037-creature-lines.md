# T-037: SARATHI lines and a Codex entry for Jivagraha's creatures

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-037-creature-lines.md`

## Goal
Three creatures now live on Jivagraha (1 November):
- the **gentle grazer** wanders, stops to graze, and steps away if you come within a few metres; it rests at night;
- the **small burrower** pops out of the ground near you, looks around, and ducks back in, at once if you come close;
- a **small bird** circles over the forest by day and roosts at night.

All three are shy and harmless, and there are more of them when Harmony is high. The grazer and burrower already have Codex entries (`src/data/codex.ts`, ids `gentle_grazer` and `small_burrower`). The bird has none.

## Read first
`AGENTS.md`; `src/data/codex.ts` (the two entries above and the glow-moth entry, for the voice); `src/data/lines.ts` (SARATHI's voice); `docs/GDD.md` §10–11.

## Write (TypeScript objects of `id: "line"` pairs, as in `src/data/lines.ts`)
1. **`CREATURE_LINES`** (6 lines): SARATHI's first remark on seeing each creature (`first_grazer`, `first_burrower`, `first_bird`), and one line each when a creature steps or ducks away because you came close (`grazer_shy`, `burrower_shy`, `bird_roost` for dusk).
2. **One Codex entry** for the bird, `id: "small_bird"`, `kind: "fauna"`, `title: "Small bird"`, in the same shape as the other entries: `text` of 40–100 words in SARATHI's field-note voice, and one-sentence `science`. Leave `name` and `deva` out (Sarvam is choosing the names in T-036).

## Rules
- **No violence**, no hunting, catching or taming words. The creatures are observed, given space, never chased.
- SARATHI: one sentence of guidance, then at most one dry remark; under 30 words a line. British spelling.
- Accurate science: birds, flight and roosting are real biology; say "on Earth" where a fact is about Earth animals.

## Done when
- [ ] Six lines and one Codex entry, within the limits above

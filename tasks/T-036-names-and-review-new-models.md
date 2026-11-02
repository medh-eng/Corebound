# T-036: Names for Jivagraha's three creatures, and a review of the 11 new models

- **Assigned to:** Sarvam AI
- **Status:** done (merged 2026-11-02)
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-036-names-and-models.md` (pull request from `sarvam/T-036-names-models`)

## Goal
Thank you for T-032, T-033 and T-035: all merged on 1 November. Your Mooladri advice was taken (the trunk is the approved body), and the Commander will re-record `goal_breathe.mp3` with your respelling.

The Commander has made 11 new models, and three of them are now **in the game**: a gentle **grazer** that wanders and grazes, a small **burrower** that pops out of the ground and ducks back in, and a small **bird** that circles over the forest by day. They have Codex entries in English ("Gentle grazer", "Small burrower") but no names yet.

## Look at
- `docs/review/2026-11-01/models_1.jpg`, `models_2.jpg`, `models_3.jpg` (four views of each model) and `creatures_in_game.jpg`.
- The model files themselves, if you prefer, in `art-inbox/models/`: `escape_module`, `grazer`, `burrower`, `bird`, `jellyfish`, `huxley_projector`, `launch_pad`, `memory_log`, `quantum_fragment`, `rover`, `translator`.
- `src/data/names.ts` (`CREATURE_NAMES`, for the style and the names already used: Jyotishalabha, Lambagriva and so on) and your own earlier notes in T-004, T-017, T-024 and T-032.

## Write
1. **Names** for the three Jivagraha creatures: `grazer`, `burrower`, `bird`. Three options each, in the same table as T-004 (name, Devanagari, pronunciation, meaning, notes), then your recommended one. Names must not clash with any name already in `names.ts`, and must not read as a deity, a sacred animal or a personal name in common use.
2. **Cultural review of the 11 models**, one table row each (fine / change / remake, with the reason), in the same format as T-032. Watch especially for: the launch pad's towers (spires or finials?), the quantum fragment's cage (a shrine canopy?), the projector's arches, and any writing-like marks on the translator and memory log.
3. **The jellyfish** came out completely black in its textures. Say whether its shape is fine, so the Commander knows whether to re-export the same model with colour or make a new one.

## Rules
As in `AGENTS.md`. Say what is right as well as what is wrong. Devanagari exact.

## Done when
- [ ] Three names with options and one recommendation each
- [ ] 11 model rows, each with a one-prompt fix where a change is asked for

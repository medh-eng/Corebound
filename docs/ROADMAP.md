# Corebound — Roadmap (3D)

Chapter 1 (Jivagraha) is built all the way to a polished free demo before worlds 2–5 begin. Every milestone ends with a playable build at the same link. No calendar dates: progress depends on session frequency, tuning, and how quickly art arrives.

## How each milestone runs

1. The Director (Claude) splits the milestone into tasks in `tasks/` for ChatGPT, Sarvam AI and the Commander (see [TEAM.md](TEAM.md)), and builds the hard systems itself.
2. Workers deliver through pull requests or `team-inbox/`; the Director reviews, plays, screenshots and merges, then updates the playable link and [STATUS.md](STATUS.md).
3. The Commander (owner) plays it, generates art, models, music and sound from [PROMPTS.md](PROMPTS.md) into `art-inbox/`, and has the final say. Commander feedback outranks this plan.

## Chapter 1: Jivagraha

### M0 Look test — built 2026-10-25, waiting for owner playtest
- **Build:** Vite + TypeScript + Three.js + Rapier project; GitHub Pages deploy. A small sphere planet with atmosphere glow, sun, day–night cycle, stylised sky, bloom and tone mapping. Third-person character (placeholder) walking, jumping and jetpack-hopping with gravity to the centre; camera aligned to the surface; planet view (M). Procedural trees and grass. Title screen.
- **Art (owner):** style tests, key art, Jivagraha concept art (orbit, surface day/night, healthy vs polluted, underground). ✓ Received, plus all five worlds, Guardians, logo, Custodian, shelter dome and solar lotus.
- **Delivered:** title screen with the owner's logo over the turning planet; flight down to the surface; walking, running, jumping and jetpack on a 150 m planet; day–night with aurora; glowing mushroom and banyan forests, rocks, crystals, ferns, grass, lotus flowers; the painted shelter dome with chimney smoke and the solar lotus; planet view; goals panel; pause screen; gamepad basics.
- **Not yet:** Rapier physics (comes with digging in M1), a skeleton for the Custodian, sound.

### M1 Dig and survive — first version built 2026-10-25
- **Delivered:** laser digging anywhere (pits and tunnels, with sandstone, iron, ice and carbon underground), surface deposits near the base, 8-slot backpack with crafting (electrolyzer, battery, solar lotus, O₂ canister), placing and picking up machines, oxygen and suit power, shelter air from the electrolyzer, solar + battery power through the night, blackout, helmet lamp, guided goals with SARATHI lines, autosave and Continue.
- **Added 2026-10-26:** the owner's rigged Custodian with 8 animations; owner models for battery, electrolyzer and smelter; the smelter makes iron plates (2 ore + 1 carbon, 3 kW, smoke).
- **Added after the first playtest (2026-10-26):** mouse mining fixed, visible laser tool, resource counter, settings menu (save, load, volumes, sensitivity), code-made music and sound.
- **Still to do in M1:** texture and sky images from the owner; owner audio to replace the code-made sound.
- **Build:** smooth diggable terrain (density field + marching cubes in workers); mining laser with VFX; ore pickup; backpack (8 stacks) and crafting; oxygen and suit power; blackout and wake; shelter dome, solar lotus, battery, electrolyzer; day/night consequences; autosave and save slots.
- **Art (owner):** Custodian concept + turnaround + rigged GLB; Chapter 1 textures; Jivagraha sky.

### M2 Build and automate
- **Build:** build camera; foundation pads; placement/rotate/remove; auto-drill, smelter, silicon furnace, coal burner, storage silo, power pylons; conveyors with visible items; lifts; power network with under-supply; research terminal and tier 1–2 tech tree; scanner and Codex basics.
- **Art (owner):** first 10 machine GLBs; item icons.

### M3 Harmony and life
- **Build:** Air/Water/Soil stocks; sky/fog/water/vegetation shader response; smoke plumes; acid rain and repair state; fauna with Harmony-driven spawning; bio-filter, settling pond, Sabatier reactor; bloom materials; layered music driven by factory size, time of day and Harmony.
- **Art (owner):** creature sheet, plant concepts; Jivagraha music and SFX.

### M4 Chapter 1 demo
- **Build:** Root Guardian (procedural body and animation, wake rules, dormant zone, closed-off region, three-step puzzle, ally bonus); vehicle bay and rover; SARATHI drone and dialogue; cryo-pod wake-up intro in the crashed escape module; Prof. Huxley's first hologram and the translator; 8–10 memory logs; Fragment chamber; launch pad and the starter ship's first lift-off as the demo's cliffhanger; credits ("A game by Medhanshu Shahane"); first-hour hook pass (goals, pacing); settings, difficulty, photo mode; Electron build; itch.io and Steam page materials.
- **Art (owner):** Root Guardian concept (calm + agitated), rover GLB, SARATHI concept, teaser clips, logo ideas, store art.

**Gate — hook test:** five first-time players play the first 30 minutes while the owner watches; fix every bored or lost moment. Then publish the free demo on itch.io and open a Steam page for wishlists.

## After the demo

### M5 Spaceflight and Taptashila
Flyable starter ship, star-system scene, assisted landing, fuel and fuel depot; the asteroid with Alion Voss's quest, the translator and the resonance emitter; Taptashila (metals, refinery tiers, heat shield, rock crabs, Magma Serpent); research station tier 3; truck.

### M6 Marubhumi
Sand, savannah, oil, liquid drill, fuel processor and biofuel power, haulers, buggy, Szynthar packs, the Dune Leviathan; Scavenger ship; first alien community with trade and quests at full depth.

### M7 Himasagara and Vayumandala
The ice moon and its hidden ocean (submarine, under-ice base, Ice Leviathan) and the gas giant's cloud reefs (helicopter, gas harvesting, Storm Bird); space station and space elevator; Mk2 Voyager.

### M8 Vishamegha
Toxic air and acid rain, toxin filters, air chemistry, Haze Weaver; Freighter and automated freighter routes between worlds; the ship's manual and full memory.

### M9 Shunyapath and the endings
The biggest wreck, drill pod, the seeds and the terraforming engine, SARATHI's directive, the Harvest and Covenant endings, per-world epilogues.

Each world brings its own concept art, sky, textures, models, music and sound from the Commander, writing from ChatGPT, names and translations from Sarvam AI.

**Gate — content complete:** the whole story plays from start to finish.

### M10 Launch
Hindi and Marathi translations (Sarvam AI); balancing across worlds; settings and accessibility; sandbox mode; Steam achievements and cloud saves; Steam Deck pass; gameplay trailer (owner records, Claude edits); launch screenshots; store pages; AI-content disclosure text.

### M11 Beyond (optional)
Co-op, translations, more worlds — chosen from player feedback. Human artist polish pass if sales justify it.

## Publishing

| Where | When | Cost | Notes |
| --- | --- | --- | --- |
| GitHub Pages | From M0 | Free | Playable web build while the repo is public |
| itch.io | Demo at M4; full game at M9 | Free to list; revenue share set by the owner (default 10%) + payment fees | Web or download |
| Steam | Page + demo after M4; full game at M9 | $100 per game, returned after $1,000 sales | Owner's Steamworks account and tax details; AI-content disclosure |

## Parking lot (not scheduled)

- Human-made art polish pass
- Recorded orchestral soundtrack
- Console ports

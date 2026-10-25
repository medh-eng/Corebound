# Corebound — Roadmap (3D)

Chapter 1 (Jivagraha) is built all the way to a polished free demo before worlds 2–5 begin. Every milestone ends with a playable build at the same link. No calendar dates: progress depends on session frequency, tuning, and how quickly art arrives.

## How each milestone runs

1. Claude builds it, tests it, screenshots it, and updates the playable link. Placeholder shapes stand in for art not yet delivered.
2. The owner plays it and generates the art for the next milestone from the Prompt Pack (shared Claude doc, "Prompt Pack" tab), uploading files to `art-inbox/`.
3. Claude fixes, tunes and swaps in the art before the next milestone. Owner feedback outranks this plan.

## Chapter 1: Jivagraha

### M0 Look test — built 2026-10-25, waiting for owner playtest
- **Build:** Vite + TypeScript + Three.js + Rapier project; GitHub Pages deploy. A small sphere planet with atmosphere glow, sun, day–night cycle, stylised sky, bloom and tone mapping. Third-person character (placeholder) walking, jumping and jetpack-hopping with gravity to the centre; camera aligned to the surface; planet view (M). Procedural trees and grass. Title screen.
- **Art (owner):** style tests, key art, Jivagraha concept art (orbit, surface day/night, healthy vs polluted, underground). ✓ Received, plus all five worlds, Guardians, logo, Custodian, shelter dome and solar lotus.
- **Delivered:** title screen with the owner's logo over the turning planet; flight down to the surface; walking, running, jumping and jetpack on a 150 m planet; day–night with aurora; glowing mushroom and banyan forests, rocks, crystals, ferns, grass, lotus flowers; the painted shelter dome with chimney smoke and the solar lotus; planet view; goals panel; pause screen; gamepad basics.
- **Not yet:** Rapier physics (comes with digging in M1), a skeleton for the Custodian, sound.

### M1 Dig and survive — first version built 2026-10-25
- **Delivered:** laser digging anywhere (pits and tunnels, with sandstone, iron, ice and carbon underground), surface deposits near the base, 8-slot backpack with crafting (electrolyzer, battery, solar lotus, O₂ canister), placing and picking up machines, oxygen and suit power, shelter air from the electrolyzer, solar + battery power through the night, blackout, helmet lamp, guided goals with SARATHI lines, autosave and Continue.
- **Still to do in M1:** a skeleton and real walk for the Custodian (file prepared for Mixamo), texture and sky images from the owner, sound.
- **Build:** smooth diggable terrain (density field + marching cubes in workers); mining laser with VFX; ore pickup; backpack (8 stacks) and crafting; oxygen and suit power; blackout and wake; shelter dome, solar lotus, battery, electrolyzer; day/night consequences; autosave and save slots.
- **Art (owner):** Custodian concept + turnaround + rigged GLB; Chapter 1 textures; Jivagraha sky.

### M2 Build and automate
- **Build:** build camera; foundation pads; placement/rotate/remove; auto-drill, smelter, silicon furnace, coal burner, storage silo, power pylons; conveyors with visible items; lifts; power network with under-supply; research terminal and tier 1–2 tech tree; scanner and Codex basics.
- **Art (owner):** first 10 machine GLBs; item icons.

### M3 Harmony and life
- **Build:** Air/Water/Soil stocks; sky/fog/water/vegetation shader response; smoke plumes; acid rain and repair state; fauna with Harmony-driven spawning; bio-filter, settling pond, Sabatier reactor; bloom materials; layered music driven by factory size, time of day and Harmony.
- **Art (owner):** creature sheet, plant concepts; Jivagraha music and SFX.

### M4 Chapter 1 demo
- **Build:** Root Guardian (procedural body and animation, wake rules, dormant zone, three-step puzzle, ally bonus); vehicle bay and rover; SARATHI drone and dialogue; 8–10 memory logs; in-engine orbital-fall intro; Fragment chamber; launch sequence; first-hour hook pass (goals, pacing); settings, difficulty, photo mode; Electron build; itch.io and Steam page materials.
- **Art (owner):** Root Guardian concept (calm + agitated), rover GLB, SARATHI concept, teaser clips, logo ideas, store art.

**Gate — hook test:** five first-time players play the first 30 minutes while the owner watches; fix every bored or lost moment. Then publish the free demo on itch.io and open a Steam page for wishlists.

## After the demo

### M5–M8 Worlds 2 to 5
One world per milestone: Himasagara (fluids, cold, submarine, Ice Leviathan), Taptashila (heat, lava, geothermal, drones, heat crawler, Magma Serpent), Vayudweep (floating islands, wind, jetpack/glider, cargo rockets, Storm Bird), Shunyapath (the wreck, drill pod, SARATHI's directive, both endings, epilogues). Owner supplies per-world concept art, sky, textures, models and music.

**Gate — content complete:** the whole story plays from start to finish.

### M9 Launch
Balancing across worlds; settings and accessibility; sandbox mode; Steam achievements and cloud saves; Steam Deck pass; gameplay trailer (owner records, Claude edits); launch screenshots; store pages; AI-content disclosure text.

### M10 Beyond (optional)
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
- Hindi, Marathi and other translations
- Console ports

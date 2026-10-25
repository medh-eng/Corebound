# Corebound — Game Design Document (v0.3, 3D)

*Status: pre-production. Numbers marked* (tune) *are starting values for playtesting. Items marked* **owner** *need the owner's decision. The owner-facing version of this plan, with drawings and the art Prompt Pack, lives in the shared Claude doc "Corebound 3D — Game Design & Build Plan".*

---

## 1. Pitch

Corebound is a 3D survival-factory game on small, living spherical planets. You walk all the way around each world, dig toward its core, and build machines that keep you alive and carry you onward. Every machine changes the world: skies haze over, forests wilt, creatures flee, and colossal Guardians wake. You win them over with engineering, never weapons.

The twist arrives slowly: these worlds were born from your own crashed ship, and to save the last seeds of humanity you may have to take their life back.

| | |
| --- | --- |
| Genre | 3D survival + automation + exploration, with a story |
| Feels like | Astroneer's tiny planets, Satisfactory's factories, Terra Nil's healing, Outer Wilds' mystery |
| Camera | Third-person; top-down build camera; orbital planet view |
| Length | ~12–15 h story; sandbox after |
| Players | Single-player (co-op possible later) |
| Platforms | Windows/Mac (Electron) for Steam and itch.io; web demo; Steam Deck target |
| Look | Stylised "Indo-futurist solarpunk" |
| Violence | None |

## 2. Pillars

1. **Your factory is your answer.** The moral question is answered by how you build.
2. **Science, not weapons.** Every problem, including the Guardians, is solved with engineering and simplified real chemistry.
3. **The whole world at a glance.** Worlds are small enough to see whole from orbit; their health is always visible.
4. **Satisfying automation.** Watching a line you designed run on its own must feel good.
5. **Wow every few minutes.** Never more than ~8 minutes in the first hour without something new to see, build or wonder about.

## 3. Camera and screen

- **Explore:** third-person over-the-shoulder; the camera's up vector follows the local surface normal so the horizon is always level.
- **Build (B):** smooth lift to a top-down orbit camera over the nearest foundation pads; grid overlay.
- **Planet view (M):** pull out to orbit; whole sphere, factory lights, weather, Guardian lair, Harmony overlay.
- **HUD:** oxygen and suit power (top-left), three goals now/next/mystery (top-centre), Harmony indicators for Air/Water/Soil with shape + colour (top-right), hotbar and backpack count (bottom), compass ring (bottom-right).
- **Underground:** dark; helmet lamp, ore glow, machine lights.

## 4. Controls (rebindable; gamepad and Steam Deck supported)

| Action | Keyboard and mouse | Gamepad |
| --- | --- | --- |
| Move / look | WASD / mouse | Left / right stick |
| Jump; jetpack (hold) | Space | A |
| Mine, dig, use tool | Left mouse (hold) | Right trigger |
| Scan | Right mouse (hold) | Left trigger |
| Build mode | B (click place, R rotate, X remove) | Y |
| Interact, enter vehicle | E | X |
| Backpack and crafting | Tab | View |
| Planet view | M | L3 |
| Research tree | T | D-pad up |
| Photo mode | P | D-pad down |
| Pause | Esc | Start |

Game speed 1× / 2× / 3×.

## 5. Worlds as spheres

- Each world is a sphere (radius 150 m on Jivagraha (tune); walking around takes ~3 minutes, rover ~1).
- Layers: surface, crust (diggable, ~60 m deep (tune)), mantle (hard; geothermal heat from world 3), core chamber (Quantum Fragment, sealed until the Guardian is calm).
- **Terrain:** signed-distance density field on a sphere, chunked, meshed with marching cubes / surface nets in Web Workers; digging subtracts density. Materials per voxel (soil, rock, ore types, ice).
- **Gravity:** toward planet centre for player, vehicles, items and loose physics objects.
- **Day/night:** planet rotation relative to the sun; one day on Jivagraha = 6 minutes (tune).
- **Foundation pads:** flat hex or square pads placed on the ground (they conform to terrain with legs/fill); machines snap to the pad grid. Conveyors connect pads.

## 6. Survival

| Stat | Drains | Refills |
| --- | --- | --- |
| Oxygen | Outside the shelter; faster when sprinting | Shelter dome (fed by electrolyzer), O2 canisters |
| Suit power | Mining, sprinting, jetpack, cold/heat | Charging points, batteries |

- Zero → **blackout**: wake in the shelter; carried items drop where you fell (beacon marker).
- No health, no damage, no death. Hazards drain the suit faster or put machines into *repair*, never destroy them.

## 7. Building and logistics

- **Conveyors** between pads and machines, items visibly riding them (instanced meshes); **lifts** for shafts; **pipes** for water, O2, H2, CO2, methane; **drones** (world 3+); **cargo rockets** between worlds (world 4+).
- Backpack: 8 stacks (tune) to push automation.

## 8. Power

| Source | Works | Pollution |
| --- | --- | --- |
| Solar (lotus collector) | Sun side only | None |
| Battery | Stores | None |
| Coal burner | Always | Air ++ |
| Hydrogen fuel cell | If fed H2 | None |
| Wind turbine | Storm worlds | None |
| Geothermal | Near the mantle | None |

Under-supply: machines slow proportionally; oxygen system flickers first (warning).

## 9. Elements, machines, research

Elements by world: Jivagraha — iron, silicon, carbon, ice. Himasagara — copper, salt. Taptashila — sulfur, aluminium, gold. Vayudweep — lithium, nitrogen. Shunyapath — salvage.

| Machine (Chapter 1) | Input | Output | Harmony |
| --- | --- | --- | --- |
| Shelter dome | — | Safe zone, O2 refill | — |
| Solar lotus | Daylight | Power | — |
| Battery | Power | Stored power | — |
| Electrolyzer | Ice, power | O2, H2 | — |
| Auto-drill | Power | Ore | Soil + |
| Smelter | Iron ore, carbon, power | Iron plates | Air + |
| Silicon furnace | Silica, carbon, power | Silicon | Air + |
| Coal burner | Carbon | Power | Air ++ |
| Conveyor / lift | Items | Moved items | — |
| Storage silo | Items | Items | — |
| Power pylon | — | Extends the grid | — |
| Bio-filter | Water, power | — | Air − |
| Settling pond | Tailings | — | Soil −, Water − |
| Sabatier reactor | CO2, H2 | Methane fuel, water | Air − |
| Research terminal | Sample packs, scan data | Tech unlocks | — |
| Vehicle bay | Parts | Rover | — |
| Launch pad | Methane, parts, Fragment | Launch | — |

- **Research:** sample packs + scan data. Tier 3+ needs **bloom** materials (only at high Harmony).
- **Science cards:** one short card per machine.
- **Design rule:** clean routes must also be efficient routes.

## 10. Harmony

Per world, three stocks 0–100: Air (A), Water (W), Soil (S).

```
each tick: stock = clamp(stock + emissions − flora_absorption − filter_removal, 0, 100)
Harmony = 100 − (0.4·A + 0.3·W + 0.3·S)      (weights: tune)
flora_absorption scales with flora health; recovery is always possible
```

| Harmony | Band | Effects |
| --- | --- | --- |
| 80–100 | Thriving | Clear sky, glowing flora, creatures abundant, extra music layer, **bloom** spawns |
| 50–79 | Stable | Normal |
| 25–49 | Stressed | Haze, smoke plumes, wilting (shader), murky water, creatures scarce, acid rain → machines need repair |
| 0–24 | Collapse | Storms, dead flora, silence, Guardian wakes early and agitated |

Rendered through sky/fog colour, vegetation shader parameters, water tint, particle density, fauna spawn rates and music layers. Numbers only in planet view. Colour-blind safe (shape + sound).

## 11. Living world

- **Fauna** (never harmed): grazers, sky-jellies, burrowers, flutterers per world; spawn density follows Harmony.
- **Scanner + Codex:** scan flora, fauna, rocks, ruins → Codex entry, research data, SARATHI line.
- **Collectibles:** memory logs, Quantum shards (suit upgrades), decoration sets (jaali screens, lantern strings, rangoli floor lights).
- **Base customisation:** paint, decorate, name outposts.
- **Photo mode.**

## 12. Guardians

- One per world 1–4; wakes when Harmony < 50 or when the player digs into its lair.
- Awake: machines in an area go dormant; paths blocked; restlessness rises as Harmony falls. Never attacks.
- Calmed by a three-step eco-puzzle using known systems; becomes an ally with a world bonus; opens the Fragment chamber.
- **Bodies built and animated procedurally** (root growth, spline-driven serpent/leviathan bodies, cloth/particle wings) from owner-supplied concept art.

| World | Guardian (English placeholder; Sanskrit name: **owner**) | Puzzle | Ally bonus |
| --- | --- | --- | --- |
| Jivagraha | Root Guardian | Seismic scan → move drills off its roots; bio-filters clear smog; replant bloom spores | Flora absorbs 2× |
| Himasagara | Ice Leviathan | Sonar beacons to guide it; restore vent heat; feed an algae cycle | Free heat near vents |
| Taptashila | Magma Serpent | Ease vent pressure; re-route lava channels; plant heat lichen | Geothermal +50% |
| Vayudweep | Storm Bird | Rebuild wind channels; ground lightning; seed clouds | Storms charge batteries |
| Shunyapath | SARATHI's directive | Prove a closed-loop power network can run the terraformer | Unlocks the Covenant ending |

## 13. Worlds

| # | World | Look | Hazard | Big new idea | Vehicle | Est. hours |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Jivagraha | Lush living forest | Night | Survival, factory, Harmony | Rover | 2 |
| 2 | Himasagara | Frozen ocean | Cold, blizzards | Pipes, heaters, fuel cells | Submarine | 2.5 |
| 3 | Taptashila | Volcanic desert | Heat, lava | Geothermal, drones | Heat crawler | 2.5 |
| 4 | Vayudweep | Storm sky islands | Lightning, falls | Wind, jetpack/glider, cargo rockets | Glider | 3 |
| 5 | Shunyapath | Dead wreck world | No air, radiation | Quantum Core assembly | Drill pod | 2 |

## 14. The first hour (hook plan)

| Min | Beat | Type |
| --- | --- | --- |
| 0 | Pod falls from orbit; tiny planet fills the screen | Wow |
| 1 | Step out: horizon curves away at sunrise | Wow |
| 2 | Laser the first ice; craft the oxygen maker | Build |
| 5 | A giant shadow moves under the glowing forest | Mystery |
| 8 | Solar + battery before the first night | Build |
| 12 | First auto-drill runs on its own | Build |
| 16 | Night: factory lights beside the glowing forest | Wow |
| 20 | Corrupted SARATHI log: the crash was no accident | Mystery |
| 25 | Conveyors + smelter; research tree opens | Build |
| 30 | Jetpack: see the whole planet below | Wow |
| 38 | Clean choice: filters, rocket fuel from smoke | Build |
| 45 | The Root Guardian rises | Wow |
| 52 | Fragment chamber glimpsed below the crust | Mystery |
| 60 | Rover unlocked; three goals waiting | Build |

Rules: wow in minute one; hands busy by minute 3; three goals always visible; something new at least every ~8 minutes; the world visibly answers; a cliffhanger at each stopping point; no punishment. Validate with 5 first-time players before the demo ships.

## 15. Story

- **The Custodian:** scientist, memory lost, bulky non-military suit.
- **SARATHI:** damaged ship AI (lotus-shaped drone); guide with dry humour; bound by one directive: save the Seeds of Humanity.
- **Reveal path:** W1 mission *Ark*, a "Quantum Core" → W2 fossils too young, clocks disagree → W3 ship alloy fused in million-year-old rock → W4 full memory: Earth gone; the Core shattered, bent time, seeded four dead worlds → W5 the wreck; re-assembling the Core kills the living worlds.
- Delivered through memory logs, SARATHI lines, scans and environment. Intro is an in-engine orbital fall.

### Endings

| Ending | Condition | Outcome |
| --- | --- | --- |
| The Harvest | Always available | Seeds bloom on Shunyapath; living worlds fade to grey |
| The Covenant (true) | Leave the fragments; requires clean power + closed-loop production across worlds sufficient to run the terraformer (threshold: tune) | Humans settle alongside the living worlds |
| Epilogue variations | Each world's Harmony when left | Per-world final scene |

## 16. Modes and options

Calm / Standard / Engineer difficulty; Sandbox after world 1. Autosave + 3 manual slots. Graphics presets (Low for Steam Deck/integrated GPUs). Rebindable keys, text size, subtitles, colour-blind support. English first; text externalised for translation.

## 17. Art and audio

- **Style:** stylised "Indo-futurist solarpunk" — soft chunky shapes, painterly PBR materials, golden light, atmosphere rim, bloom, bioluminescent nature; machines with jaali lattice, stepwell geometry, arched domes, lotus forms; copper/brass/off-white ceramic with amber lights.
- **Owner-generated (AI tools, Prompt Pack):** concept/key art, GLB models (character auto-rigged, machines, vehicles, props), textures, sky panoramas, icons, teaser clips, music (Suno paid plan), SFX, optional SARATHI voice. Delivered to `art-inbox/`.
- **Claude-built:** terrain, flora, water, sky/atmosphere, weather, particles, Harmony effects, procedural Guardian bodies, UI, logo vector, trailer edit, store image exports.
- **Budgets:** character ≤ 40k tris; vehicle ≤ 30k; machine ≤ 15k; prop ≤ 5k; textures 2048².
- **Music:** Jivagraha layers share 80 BPM, D minor for stem-style layering.

## 18. Technical

- TypeScript + Three.js (WebGPU renderer where available, WebGL fallback), Vite. Rapier physics with per-body gravity toward planet centre.
- Simulation (`src/core`, `src/systems`) is plain TypeScript, independent of rendering, unit-tested. Fixed tick 5 Hz (tune).
- Terrain meshing in Web Workers; LOD by distance; instanced rendering for conveyor items, flora, fauna.
- Post-processing: tone mapping, bloom, SMAA, fog/atmosphere, colour grading per world and Harmony band.
- Saves: JSON (terrain edits as sparse deltas, entities, inventories, stocks, flags, version for migrations).
- Performance targets: 60 fps 1080p mid-range gaming laptop; 30+ fps Steam Deck on Low.
- Builds: Electron desktop (Steam via Steamworks bindings: achievements, cloud saves), web demo (GitHub Pages / itch.io).

## 19. Decisions log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-10-18 | No longer a KRAFTON Better Ground entry; built by Claude for release | Owner's decision |
| 2026-10-18 | 3D instead of 2D; Three.js + TypeScript | Owner wants great visuals; Three.js is the strongest 3D stack Claude can build, run and test itself |
| 2026-10-18 | Spherical worlds with diggable smooth-voxel terrain; foundation pads for building | 3D equivalent of round worlds + polar grid |
| 2026-10-18 | Owner produces art with AI tools from the Prompt Pack; Claude builds world, effects, procedural creatures | Division of labour for a big 3D game |
| 2026-10-18 | Chapter 1 (Jivagraha) completed as a free demo before worlds 2–5; hook test with 5 new players | Learn what is fun before building more |
| 2026-10-18 | Mobile dropped for the 3D version; Steam Deck is the handheld target | Factory building in 3D needs mouse/gamepad |
| 2026-10-25 | Jivagraha radius 150 m (was ~250) | Strong, visible curvature from the ground in the look test |
| 2026-10-25 | M0 uses Three.js WebGLRenderer + Neutral tone mapping and a light saturation grade; WebGPU later | Widest browser support; colours closest to the concept art |
| 2026-10-25 | Collision is an analytic height field + circle colliders until diggable terrain; Rapier arrives with M1 | Simplest robust walking on a sphere for the look test |
| 2026-10-25 | Plain white models are painted by per-pixel shader programs (`src/art/paint.ts`) from their shape; characters, creatures and vehicles must arrive textured | Crisp, consistent game materials without AI-baked shading |
| 2026-10-25 | Custodian has no skeleton yet: procedural waddle walk; rig via Mixamo or the 3D tool's auto-rig before M1 animation work | Model arrived unrigged |
| 2026-10-25 | Owner said "continue": M1 started before the M0 playtest | Owner's call |
| 2026-10-25 | Digging: the planet stays analytic; only dug areas become 18 m voxel chunks (0.75 m cells, surface nets); the planet surface hides inside them | Fast everywhere, detailed where you dig; no worker threads needed yet |
| 2026-10-25 | Rapier deferred again: walking uses the density field (floor search, wall and ceiling probes) | Simple and tested; revisit for vehicles in M4 |
| 2026-10-25 | Underground materials: soil, sandstone (silica), iron veins, ice pockets (>1.4 m deep), carbon seams (>2.5 m), deep rock; plus surface deposits of ice, iron and carbon | Readable first hour; every material reachable near the base |
| 2026-10-25 | Shelter is entered at its airlock (stand at the door) rather than a walk-in interior | Interior is later work |
| 2026-10-25 | Blackout returns you to the shelter with 35% oxygen and drops nothing | "No punishment" pillar; revisit for Engineer difficulty |
| 2026-10-25 | Starting base already has one solar lotus; the player crafts the electrolyzer and battery | Shorter path to the first "it works" moment |
| Open | Guardian names; price; repo visibility at launch; name subtitle; final art direction sign-off | **owner** |

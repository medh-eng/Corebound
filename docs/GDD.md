# Corebound — Game Design Document (v0.4, 3D)

*Status: Chapter 1 in production. Numbers marked* (tune) *are starting values for playtesting. Items marked* **owner** *need the Commander's decision. Art, model, music, sound and voice prompts live in [PROMPTS.md](PROMPTS.md); how the AI team works is in [TEAM.md](TEAM.md).*

*v0.4 (2026-10-26) folds in Medhanshu's original blueprint ("Fragmented Horizons"): seven locations, flyable spaceships, characters and quests, a larger resource tree, and creatures that cause trouble without violence.*

**A game by Medhanshu Shahane.**

---

## 1. Pitch

Corebound is a 3D survival-factory game in a small star system of living, spherical worlds. You wake from a failing cryo-pod on Jivagraha, build a shelter, mine and automate, then build spaceships and fly between six worlds and a gas giant's sky. Every machine changes the world: skies haze over, forests wilt, creatures grow restless, and colossal Guardians wake. You win them over with science, never weapons. Alien people on each world trade with you, give you quests and help you piece together what happened.

The twist arrives slowly: these worlds were born from your own crashed ship's Quantum Core, and to save the last Seeds of Humanity (Project Amarnath) you may have to take their life back.

| | |
| --- | --- |
| Genre | 3D survival + automation + exploration, with a story |
| Feels like | Astroneer's tiny planets, Satisfactory's factories, Terra Nil's healing, Outer Wilds' mystery, a Metroidvania's unlocking map |
| Camera | Third-person; top-down build camera; orbital planet view |
| Length | ~20–25 h story; sandbox after |
| Players | Single-player (co-op possible later) |
| Platforms | Windows/Mac (Electron) for Steam and itch.io; web demo; Steam Deck target |
| Look | Stylised "Indo-futurist solarpunk" |
| Violence | None: creatures cause trouble, never harm; Guardians are calmed, never fought |

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
| Pause / menu | Esc or ⚙ | Start |

Game speed 1× / 2× / 3×.

**Spaceship (in flight):** W / S thrust forward / back, A / D thrust left / right, mouse to aim, Q / E roll, Shift boost, Space ship cargo, F leave the pilot seat. Landing and docking are assisted: line up inside the glowing approach ring and the ship lands itself. (From Medhanshu's blueprint, adapted for 3D.)

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
- No health, no damage, no death. Hazards drain the suit faster or put machines into *needs attention*, never destroy them.
- **Suit modules** for harsher worlds: heat shielding (Taptashila day side, Marubhumi noon), insulation (Himasagara), toxin filter (Vishamegha), pressure seals (Vayumandala skies). Each is researched and crafted.

## 7. Building and logistics

- **Conveyors** between pads and machines, items visibly riding them (instanced meshes); **lifts** for shafts; **pipes** for water, oil, O2, H2, CO2, methane; **automated haulers** (self-driving carts and cargo drones) on routes the player sets; **freighter routes** between worlds late in the game.
- Backpack: 8 stacks (tune) to push automation.
- **Tend and maintain** (non-violent version of "defend"): far-away mines and pipelines get visits from local creatures that nest in them, chew insulation or clog intakes. The machine slows or stops with a *needs attention* tag; nothing is destroyed. Fix with E. Prevent with scent posts, resonance beacons, fences that guide animals around, or simply higher Harmony (happier ecosystems bother you less).

### Vehicles (built at the vehicle bay after research)

| Vehicle | Good at | Weak at | Where it shines |
| --- | --- | --- | --- |
| Small rover | Any terrain, good speed | Little cargo | Jivagraha, early Taptashila (heat-shield upgrade) |
| Truck | Any terrain, lots of cargo | Moderate speed | Hauling ore to the launch pad |
| Buggy | Very fast, soft suspension | No cargo | Marubhumi sand; outrunning Szynthar packs |
| Helicopter | Fast, good cargo, flies | Needs an atmosphere | Jivagraha, Marubhumi, Vishamegha, Vayumandala cloud reefs |
| Submarine | The only way under the ice | Water only | Himasagara's hidden ocean |
| Drill pod | Bores through the crust | Slow | Shunyapath's wreck |
| Haulers (auto) | Carry items on set routes | Need roads or flat ground | Any world, once researched |

## 8. Power

| Source | Works | Pollution |
| --- | --- | --- |
| Solar (lotus collector) | Sun side only | None |
| Battery | Stores | None |
| Coal burner | Always | Air ++ |
| Hydrogen fuel cell | If fed H2 | None |
| Windmill | Windy places, storms | None |
| Biofuel power station | If fed biofuel | Air + (less than coal) |
| Geothermal | Near the mantle | None |

Under-supply: machines slow proportionally; oxygen system flickers first (warning).

## 9. Elements, machines, research

### Resources (from Medhanshu's blueprint)

| Tier | Resources | How you get them |
| --- | --- | --- |
| First tier | Stone, wood, biomatter, silica, ice, carbon | By hand with the laser |
| Second tier | Iron, copper, aluminium, titanium (as ores) | Mines (auto-drills) and vehicles; refined at the refinery |
| Rare | Gold, diamonds | Rich regions only; deep mines |
| Liquids | Water, oil | Liquid drill (pump) |
| Gases | Hydrogen, oxygen, methane, CO2 | Electrolyzer, Sabatier reactor, vents, Vishamegha's air |

- **Regions:** each world is split into regions with different richness (one rich in iron, gold and silica; one rich in diamonds and oil; one that is only stone). The scanner shows richness, so it pays to explore before placing a mine.
- **Worlds differ:** rocky worlds are rich in metals; green worlds in oil, biomatter and soil, with fewer minerals. You return to earlier worlds for what you lack, which brings you back to their people and quests.

| World | Rich in |
| --- | --- |
| Jivagraha | Wood, biomatter, ice, iron, silica, carbon, some oil |
| Taptashila | Iron, titanium, copper, gold; little water |
| Marubhumi | Silica, aluminium, oil, diamonds in old riverbeds |
| Himasagara | Water, ice, salt, copper on the sea floor |
| Vayumandala (sky) | Hydrogen, methane, helium-3 (late game fuel) |
| Vishamegha | CO2, sulfur, acid (turned into useful chemicals) |
| Shunyapath | Salvage from the wreck, Quantum Core shards |

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
| Mine (auto-drill) | Power | Ore by region | Soil + |
| Liquid drill | Power | Water or oil | Soil +, Water + |
| Refinery | Ores, power | Metal plates (iron, copper, aluminium, titanium) | Air + |
| Fuel processor | Biomatter, wood or oil | Biofuel (oil > wood > biomatter) | Air + |
| Biofuel power station | Biofuel | Power | Air + |
| Windmill | Wind | Power | — |
| Geothermal plant | Heat near the mantle or vents | Power | — |
| Launch pad | Fuel, parts | Builds and launches spaceships | — |
| Fuel depot | Fuel | Refuels ships on other worlds | — |
| Space station + space elevator | Late-game parts | Orbit dock; cheap launches; advanced ships | — |

The Chapter 1 smelter is the first refinery (iron only); later tiers handle more ores.

- **Research station:** sample packs + scan data unlock equipment, vehicles and spaceships. Tier 3+ needs **bloom** materials (only at high Harmony).
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

- **Fauna** (never harmed, never harmful): grazers, sky-jellies, burrowers, flutterers per world; spawn density follows Harmony.
- **Trouble-makers, not enemies** (non-violent versions of the blueprint's creatures):
  - *Rock crab* (Taptashila): looks exactly like a rock until it moves. Get too close and it scuttles off, knocking loose stones that block a path or bury a drill intake. It also likes to carry shiny ore away from mines.
  - *Szynthar packs* (Marubhumi): wolf-like pack animals that chase you out of their territory. If they catch you, they bowl you over and you drop part of what you carry (you can pick it up again). Outrun them in the buggy, go around, or turn them back with the resonance emitter.
  - Each world has one or two more (owner and Medhanshu to name; see PROMPTS.md).
- **Resonance emitter:** Alion Voss's high-frequency radio device. It never hurts anything: creatures dislike the sound and turn away, and it is one of the tools used to calm Guardians.
- **Alien peoples** (names from Sarvam AI, chosen 2026-10-27; full list with Devanagari and pronunciation in `src/data/names.ts`): **Deepajana** (lamp-folk, Jivagraha), **Khanaka** (miners, Taptashila), **Maruyatri** (desert travellers, Marubhumi), **Jalabandhu** (water-friends, Himasagara), **Patangajana** (kite-folk, Vayumandala), **Shvasajana** (breath-folk, Vishamegha). Creatures include the Golakarka (rock crab), Szynthar, Lambagriva (long-necked grazer), Marumina (sand-fish), Tarakajala (light jellyfish) and Jyotipatang (glow-moth). The Szynthars call their grassland belt on Marubhumi **Padakanan** (पादकानन, Medhanshu's word).
- **Alien people (detail):** each world has a small community with its own look, culture and needs. They trade, give quests and share clues about the "luminous object" that appeared centuries ago. You talk to them with the translator.
- **Scanner + Codex:** scan flora, fauna, rocks, ruins → Codex entry, research data, SARATHI line.
- **Collectibles:** memory logs, Quantum shards (suit upgrades), decoration sets (jaali screens, lantern strings, rangoli floor lights).
- **Base customisation:** paint, decorate, name outposts.
- **Photo mode.**

## 12. Guardians

- The blueprint's **Apex Predators**, made non-violent: each living world has one. They are the planet's immune system, born from the Quantum Core's energy, and they see your factories as an infection.
- **Part of each world is closed off** until its Guardian is calmed (from the blueprint): it blocks passes, flooded caves or storm walls. Calming it opens the whole world and the Fragment chamber.
- Wakes when Harmony < 50, when you build too close to its land, or when the story calls for it. Awake: machines in an area go dormant; paths blocked; restlessness rises as Harmony falls. It never attacks or hurts anyone.
- Calmed ("stunned" in the blueprint) by a three-step science puzzle using systems you know, often with the resonance emitter; it becomes an ally with a world bonus.
- **Bodies built and animated procedurally** (root growth, spline-driven serpent/leviathan bodies, cloth/particle wings) from owner-supplied concept art.

| World | Guardian (name, meaning) | Puzzle | Ally bonus |
| --- | --- | --- | --- |
| Jivagraha | Root Guardian: **Mooladri** (root-mountain) | Seismic scan → move drills off its roots; bio-filters clear smog; replant bloom spores | Flora absorbs 2× |
| Taptashila | Magma Serpent: **Shailasarpa** (rock-serpent) | Ease vent pressure; re-route lava channels; plant heat lichen | Geothermal +50% |
| Marubhumi | Dune Leviathan: **Balukavela** (sand-tide; silica-shelled, swims through sand) | Resonance emitter to steer it; restore an old oasis; stop drills shaking its dunes | Sandstorms reveal buried ore |
| Himasagara | Ice Leviathan: **Himavela** (ice-tide; deep, bioluminescent) | Sonar beacons to guide it; restore vent heat; feed an algae cycle | Free heat near vents |
| Vayumandala | Storm Bird: **Meghapakshi** (cloud-bird) | Rebuild wind channels; ground lightning; seed clouds | Storms charge batteries |
| Vishamegha | Haze Weaver: **Tantukari** (thread-maker; lives in the acid clouds) | Scrub the acid layer; balance CO2; grow cloud algae | Clean air pockets; cheaper toxin filters |
| Shunyapath | SARATHI's directive | Prove a closed-loop power network can run the terraformer | Unlocks the Covenant ending |

## 13. Worlds

Seven locations (Medhanshu's five worlds, plus Vayumandala as Himasagara's parent and Shunyapath as the wreck world). The order below is the suggested path; the system is open, and ship range, fuel, vehicles and Guardians decide what you can reach.

| # | World | Look (from the blueprint) | Hazard | Big new idea | Vehicle | Est. hours |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Jivagraha | Earth-like: forests and oceans | Night | Survival, factory, Harmony, first launch | Rover | 3 |
| 2 | Taptashila | Rocky, mineral mountains, close to the sun (like Mercury), lava vents | Scorching day, freezing night | Metals, refinery tiers, geothermal | Rover + heat shield, truck | 3 |
| 3 | Marubhumi | Desert with savannahs (Sahara + Mars) | Sandstorms, noon heat, Szynthar packs | Oil, liquid drill, biofuel, haulers | Buggy, truck | 3.5 |
| 4 | Himasagara | Frozen moon with a deep hidden ocean (like Europa); orbits Vayumandala | Cold, blizzards, darkness below | Pipes, heaters, under-ice base | Submarine | 3 |
| 5 | Vayumandala | Gas giant; you visit floating "cloud reefs" (sky islands) in its upper air | Lightning, falls, pressure | Gas harvesting, wind, space station | Helicopter, jetpack | 3 |
| 6 | Vishamegha | Cloudy, poisonous air (like Venus) | Toxic air, acid rain, heat | Toxin filters, air chemistry | Helicopter | 3 |
| 7 | Shunyapath | Dead world with the biggest wreck | No air, radiation | Quantum Core, terraforming engine, endings | Drill pod | 2.5 |

### 13a. Spaceships and the star system (from Medhanshu's blueprint)

- The **launch pad** is one of the first big goals on Jivagraha. It builds ships; the research station unlocks better ones.
- You **fly the ship yourself** between worlds (controls in §4). Trips are short (1–3 minutes); the system is compressed so worlds look close and grand. Asteroids, comets and wrecks sit along the way, some with quests (Alion Voss is found on one).
- **Fuel and range** matter: the starter ship cannot get home without refuelling, so you build a fuel depot when you land. This, plus each world having different resources, brings you back and forth between worlds.

| Ship | Fuel | Strengths | Weaknesses |
| --- | --- | --- | --- |
| Starter ship | Hydrogen + oxygen | Available first | Burns fuel fast; no return trip without refuelling |
| Mk2 Voyager | Hydrogen + oxygen | More cargo and fuel storage | Slower to build |
| Scavenger | Biofuel | Faster | Less cargo |
| Freighter | Methane | Most cargo; can run automated routes | Uses a lot of fuel |

- **Space station + space elevator** (late game, any world with the right parts): a dock in orbit, cheap launches, and the advanced ships.

## 14. The first hour (hook plan)

| Min | Beat | Type |
| --- | --- | --- |
| 0 | A failing cryo-pod hisses open; the escape module has crashed on a tiny planet | Wow |
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

- **The Custodian:** scientist, memory lost, lean white modular science suit (non-military). Carries the last Seeds of Humanity after Earth's destruction.
- **Project Amarnath:** the secret Earth mission to carry humanity's seeds and a terraforming engine to a new star. Its true nature is revealed slowly.
- **SARATHI:** damaged ship AI (lotus-shaped drone); guide with dry humour; bound by one directive: save the Seeds of Humanity.
- **Prof. Orion Huxley:** chief scientist of Project Amarnath, seen only as holograms in the wreckage. His first message (in the crashed ship's main deck) tells you about Project Amarnath, sends you to the front deck for the **translator**, and says the ship's manual in the damaged **control room** holds the truth.
- **Alion Voss:** an alien traveller. After you get the translator you pick up his distress signal from an asteroid; he is trapped under his wrecked ship and speaks an unknown language. He asks you to drive off a **Szynthar** with his **resonance emitter** (a high-frequency radio device; it scares, never hurts). Once free he tells you the Szynthars' homeworld, their dislike of high-frequency sound, and that a "luminous object" appeared there centuries ago and life has flourished since. He gives you the emitter and becomes a recurring ally and quest-giver.
- **Alien communities** on each world: quests, trade deals and pieces of the truth (see §11).
- **Reveal path:** Jivagraha: Project Amarnath, Huxley's first message → Taptashila: ship alloy fused into rock that should be ancient → Marubhumi: Voss's "luminous object"; the aliens' oldest stories are only a few centuries old → Himasagara: fossils far too young; clocks disagree → Vayumandala: from the space station, the pattern of all the fragments is visible → Vishamegha: the ship's manual; full memory: Earth gone, the Core exploded, bent time and seeded barren worlds → Shunyapath: the biggest wreck holds the seeds and the terraforming engine; powering it with the rebuilt Core will doom the living worlds.
- Delivered through quests, memory logs, Huxley holograms, SARATHI lines, scans and environment. Intro: waking in a failing cryo-pod inside the crashed escape module on Jivagraha.

### Endings

| Ending | Condition | Outcome |
| --- | --- | --- |
| The Harvest | Always available | Seeds bloom on Shunyapath; living worlds fade to grey |
| The Covenant (true) | Leave the fragments; requires clean power + closed-loop production across worlds sufficient to run the terraformer (threshold: tune) | Humans settle alongside the living worlds |
| Epilogue variations | Each world's Harmony when left | Per-world final scene |

## 16. Modes and options

Calm / Standard / Engineer difficulty; Sandbox after world 1. Autosave + 3 manual slots. Graphics presets (Low for Steam Deck/integrated GPUs). Rebindable keys, text size, subtitles, colour-blind support. English first; text externalised for translation (Hindi and Marathi next, with Sarvam AI).

**Credits:** "A game by Medhanshu Shahane." No team list. Tools and AI use are listed in the store's AI-content disclosure, not in the credits.

## 17. Art and audio

- **Style:** stylised "Indo-futurist solarpunk" — soft chunky shapes, painterly PBR materials, golden light, atmosphere rim, bloom, bioluminescent nature; machines with jaali lattice, stepwell geometry, arched domes, lotus forms; copper/brass/off-white ceramic with amber lights.
- **Made by the Commander with AI tools from [PROMPTS.md](PROMPTS.md):** concept/key art and textures (Gemini, ChatGPT), GLB models (image-to-3D tools; characters rigged in Mixamo), sky panoramas, icons, teaser clips, music (Suno), sound effects, voices (Sarvam AI). Delivered to `art-inbox/`.
- **Music direction (from the blueprint):** ambient synth-wave mixed with organic, natural sounds for the alien flora, plus Indian instruments for warmth; industrial, rhythmic layers for factories that contrast with nature and grow with the factory's size.
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
| 2026-10-26 | Custodian uses the owner's Mixamo rig: idle, stance idle, walk, run, walk back, turns, jump (root motion removed; the game moves the character) | Real animation replaces the procedural waddle |
| 2026-10-26 | Owner's battery, electrolyzer and smelter models replace the code-built ones | Owner art |
| 2026-10-26 | Smelter and iron plates brought forward from M2; the solar lotus now needs iron plates | Owner supplied the smelter; gives the first hour a step toward factories |
| 2026-10-26 | The Custodian holds a visible mining laser and raises it toward the crosshair; the camera sits over the right shoulder | Owner playtest: no laser gun was visible and the head hid the target |
| 2026-10-26 | Resource counts shown at the top right; gear button and Esc open a menu with save, load, music, sound effects, master volume and mouse sensitivity | Owner request |
| 2026-10-26 | Music and effects are made in code (D-minor pads, bells, wind, laser hum) until the owner's audio arrives | Sound was missing from M1 |
| 2026-10-26 | Finished machine output (iron plates) goes into the backpack automatically when you walk up; floating tags show "plates ready", "needs ice", "needs ore + carbon" | Owner could not find how to collect plates |
| 2026-10-26 | Menu gains Main menu and a Shadows setting (High / Low / Off); sun shadows are snapped to the shadow-map grid with tighter depth range and more bias | Owner saw flickering stripes on the ground |
| 2026-10-26 | Medhanshu's blueprint adopted: Marubhumi, Vishamegha and Vayumandala added; Vayudweep's sky islands become Vayumandala's cloud reefs; Shunyapath stays as the wreck world (7 locations) | Commander's decision |
| 2026-10-26 | Creatures from the blueprint kept but made non-violent: they block, chase off, scatter items and disturb machines; nothing is hurt or destroyed; the radio-wave gun becomes the resonance emitter | Commander chose the non-violent version |
| 2026-10-26 | Flyable spaceships with four ship types, fuel limits, fuel depots, space station and elevator | Commander's decision |
| 2026-10-26 | Characters added: Prof. Orion Huxley, Alion Voss, Szynthars, alien communities with quests and trade; Project Amarnath replaces "mission Ark"; cryo-pod wake-up intro | Commander's decision |
| 2026-10-26 | Resource tree, regions, buildings and vehicles from the blueprint | Commander's decision |
| 2026-10-26 | Credits: "A game by Medhanshu Shahane" only; name stays Corebound | Commander's decision |
| 2026-10-26 | AI team: Commander (owner, final say), Director (Claude), ChatGPT and Sarvam AI as workers via tasks in `tasks/`, Gemini for art; see TEAM.md | Commander's decision |
| 2026-10-27 | Owner sound effects are cut, levelled and looped by `scripts/process-audio.py` (recipes in `scripts/audio.config.json`); missing effects are derived from uploads, then code-made sounds as a last fallback; footsteps follow the surface | Owner asked to reuse uploaded effects for missing ones |
| 2026-10-27 | Painted ground textures applied as triplanar detail over the terrain's vertex colours (pattern kept, colours softened); off on low quality | Owner textures arrived; keeps the terrain palette readable |
| 2026-10-27 | The painted night-sky panorama replaces the code-made ringed planet after dusk; the code planet stays by day | Owner panorama has its own gas giant; avoids two planets |
| 2026-10-27 | Emotes: G dances (two dances), the Custodian salutes when a goal is completed | Owner supplied the animations |
| 2026-10-27 | Music must come from a source that allows selling the game (free Suno does not); credit lines required by a licence go on the Credits screen under "Music" | Licence check |
| 2026-10-27 | M2 factory: machines are placed freely on the ground (no foundation pads yet); building stays in third person with a ghost (no top-down build camera yet) | Placement already works well on a small sphere; revisit if playtests need precision |
| 2026-10-27 | Conveyors run point to point from one machine to another along the ground (2 m per conveyor item, up to 30 m, one belt out and up to three in per machine); slopes need no lifts | Simple to lay on a sphere; reads clearly |
| 2026-10-27 | Auto-drills mine whatever lies beneath them (sampled 1–8 m down); ore beats plain rock; richness sets the speed; they never run out | Gives ground "regions" a purpose before the scanner exists |
| 2026-10-27 | Power networks: the shelter powers 30 m around it; pylons carry power 14 m further and link up to 26 m apart; each network balances its own solar, coal and batteries | GDD §8 under-supply rule, extended to pylons |
| 2026-10-27 | Research tiers 1–2: parts are loaded into the research station by hand or by belt, then it works while powered | Matches "research station" in Medhanshu's blueprint |
| 2026-10-27 | Scanner and Codex moved from M2 to M3 (they need the science cards, T-002) | Content not delivered yet |
| 2026-10-27 | M3 Harmony: pollution stocks per minute of play (`src/data/harmony.ts`); smelters, furnaces, coal and drills dirty; plants clean by themselves (scaled by their health, never below a quarter); bio-filter, settling pond and Sabatier reactor clean | GDD §10, tuned so a mid-size factory turns Stressed in about 10–15 minutes without filters |
| 2026-10-27 | "Repair" made non-violent: when Stressed or worse, machines randomly need attention (acid rain, grit, clogged petals) and stop until you press E | GDD §6: hazards never destroy anything |
| 2026-10-27 | The electrolyzer now also makes hydrogen (vented when nobody collects it); the Sabatier reactor turns it into methane and cleans the air | Real chemistry; methane is the rocket fuel for M5 |
| 2026-10-27 | Bloom flowers open near you while Thriving and fade when it is not; collected with the laser; tier 3 research (clean smelting, bloom filters) needs them | GDD §9 bloom materials |
| 2026-10-27 | Fauna in M3 is glow-moths (Jyotipatang), code-made, numbers following Harmony; grazers and burrowers wait for the owner's creature models (T-015) | No creature models yet |
| 2026-10-27 | Music: a code-made factory rhythm grows with the number of working machines; chords darken and bells thin out as Harmony falls | GDD §17 layered music, until owner tracks arrive |
| 2026-10-27 | Names chosen by the Director on the Commander's instruction from Sarvam's options (`src/data/names.ts`); पादकानन (Padakanan) is the Szynthars' name for Marubhumi's grassland belt | Commander: "choose your names" |
| Open | price; repo visibility at launch; final art direction sign-off | **owner** |

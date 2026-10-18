# Corebound — Game Design Document (v0.2)

*Status: pre-production. Numbers marked* (tune) *are starting values for playtesting. Items marked* **owner** *need the owner's decision.*

---

## 1. Pitch

Corebound is a 2D survival-factory game on small, living round planets. You walk all the way around each world, dig down toward its core, and build machines that keep you alive and carry you to the next planet. Every machine also changes the world: skies haze over, forests wilt, and giant Guardians wake. You win them over with engineering, never weapons.

The twist arrives slowly: these worlds were born from your own crashed ship, and to save the last seeds of humanity you may have to take their life back.

| | |
| --- | --- |
| Genre | Survival + automation + exploration, with a story |
| Feels like | Factorio's machines, Terraria's digging, Terra Nil's healing, Outer Wilds' tiny planets |
| Length | ~12–15 h story; sandbox after |
| Players | Single-player |
| Platforms | Web first; Windows/Mac (Electron) for itch.io and Steam; mobile optional |
| Violence | None |

## 2. Pillars

1. **Your factory is your answer.** The moral question is answered by how you build, not by one button at the end.
2. **Science, not weapons.** Every problem, including the Guardians, is solved with engineering and simplified real chemistry.
3. **The whole world at a glance.** Worlds are small and round enough to see whole, so their health is always readable.
4. **Satisfying automation.** Watching a line you designed run on its own must feel good.

## 3. Screen and camera

- **Play view:** camera close to the player on the curved surface; the camera rotates so the player's feet always point to the core. Next world visible in the sky.
- **Planet view (M):** zooms out until the whole disc fits; shows the factory ring, Harmony, Guardian state. Used for planning.
- **HUD:** oxygen and suit power (top-left), objective (top-centre), Harmony dots for Air/Water/Soil (top-right), hotbar + backpack count (bottom), mini planet map (bottom-right).
- **Underground:** dark; lit by helmet lamp, ore glow and machine lights.

## 4. Controls (PC, rebindable)

| Action | Key |
| --- | --- |
| Walk | A / D |
| Jump / jetpack | W or Space |
| Mine, dig, use tool | Hold left mouse |
| Build menu | B, click to place |
| Rotate / remove building | R / X |
| Interact, enter vehicle | F |
| Backpack and crafting | Tab |
| Planet view | M |
| Research tree | T |
| Pause | Esc |

Game speed 1× / 2× / 3×.

## 5. World structure (polar grid)

Each world is a disc. Positions are `(ring, sector)`.

| Layer (outside → in) | Rings (tune) | Contents |
| --- | --- | --- |
| Sky | 3 | Weather, smog, rocket path, floating islands (world 4) |
| Surface | 1 | Flora, shelter, most machines, conveyors |
| Crust | 10 | Diggable tiles: rock, ore seams, ice, buried water, Guardian lairs |
| Mantle | 3 | Heat for geothermal (worlds 3+), hard rock |
| Core | 1 | Quantum Fragment chamber, sealed until the Guardian is calm |

- Jivagraha: 96 sectors (tune). Deeper rings have fewer sectors so tiles keep a similar size.
- Player stored as `(angle, altitude)`; gravity reduces altitude toward the surface/floor; convert to x/y only for drawing.
- Buildings occupy one ring and 1–4 sectors; placement is integer comparison.
- The planet rotates: day length 4 min on Jivagraha (tune). Solar works only on the lit side.

## 6. Survival

| Stat | Drains | Refills |
| --- | --- | --- |
| Oxygen | Outside the shelter; faster when running | Shelter dome (fed by electrolyzer), O2 canisters |
| Suit power | Mining, running, jetpack, cold | Charging points, batteries |

- Zero on either → **blackout**: wake in the shelter; carried items drop where you fell (a marker shows them).
- No health, no damage, no death.
- Hazards (night, cold, heat, storms, acid rain) drain the suit faster or put machines into *repair*, never destroy them.

## 7. Building and logistics

- Build menu → ghost preview snaps to the polar grid → place if affordable.
- **Conveyors** around a ring; **lifts** between rings; **pipes** for water, O2, H2, CO2, methane; **drones** (world 3+) for long distance; **cargo rockets** (world 4+) between worlds.
- Backpack: 8 stacks (tune) to push automation.

## 8. Power

| Source | Works | Pollution |
| --- | --- | --- |
| Solar | Lit side only | None |
| Battery | Stores | None |
| Coal burner | Always | Air + |
| Hydrogen fuel cell | If fed H2 | None |
| Wind turbine | Storm worlds | None |
| Geothermal | Near the mantle | None |

Under-supply: machines slow proportionally; the oxygen system is the first to flicker (warning).

## 9. Elements, machines, research

Elements by world: Jivagraha — iron, silicon, carbon, ice. Himasagara — copper, salt. Taptashila — sulfur, aluminium, gold. Vayudweep — lithium, nitrogen. Shunyapath — salvage.

| Machine (Jivagraha) | Input | Output | Harmony |
| --- | --- | --- | --- |
| Shelter dome | — | Safe zone, O2 refill | — |
| Solar panel | Daylight | Power | — |
| Battery | Power | Stored power | — |
| Electrolyzer | Ice, power | O2, H2 | — |
| Auto-drill | Power | Ore | Soil + |
| Smelter | Iron ore, carbon, power | Iron plates | Air + |
| Silicon furnace | Silica, carbon, power | Silicon | Air + |
| Coal burner | Carbon | Power | Air ++ |
| Conveyor / lift | Items | Moved items | — |
| Storage | Items | Items | — |
| Bio-filter | Water, power | — | Air − |
| Settling pond | Tailings | — | Soil −, Water − |
| Sabatier reactor | CO2, H2 | Methane fuel, water | Air − |
| Research terminal | Sample packs | Tech unlocks | — |
| Vehicle bay | Parts | Rover | — |
| Launch pad | Methane, parts, Fragment | Launch | — |

- **Research:** craft sample packs, feed the terminal. Tier 3+ research needs **bloom** materials (only at high Harmony).
- **Science cards:** one 20-second card per machine explaining the real science.
- **Design rule:** clean routes must also be efficient routes (Sabatier turns smelter CO2 into rocket fuel; recyclers cut drill needs; bloom unlocks the best tech).

## 10. Harmony

Per world, three stocks 0–100: Air (A), Water (W), Soil (S).

```
each tick: stock = clamp(stock + emissions − flora_absorption − filter_removal, 0, 100)
Harmony = 100 − (0.4·A + 0.3·W + 0.3·S)      (weights: tune)
flora_absorption scales with flora health, so neglect compounds; recovery is always possible
```

| Harmony | Band | Effects |
| --- | --- | --- |
| 80–100 | Thriving | Bright sky, glowing flora, extra music layer, **bloom** spawns |
| 50–79 | Stable | Normal |
| 25–49 | Stressed | Haze, wilting, acid rain puts exposed machines into repair |
| 0–24 | Collapse | Storms, dead flora, Guardian wakes early and agitated |

Shown through sky tint, flora animation, water colour, particles and music; numbers only in planet view. Colour-blind safe: bands also differ by shape and sound.

## 11. Guardians

- One per world (1–4). Wakes when Harmony < 50 or when the player digs into its lair.
- Awake: shuts down machines in an area (machines go dormant, not destroyed), blocks paths; restlessness rises as Harmony falls.
- Calmed by a three-step eco-puzzle using known systems. Calm Guardian = ally with a world bonus, opens the path to the Fragment.

| World | Guardian (English placeholder; Sanskrit name: **owner**) | Puzzle | Ally bonus |
| --- | --- | --- | --- |
| Jivagraha | Root Guardian | Move drills off its roots (seismic scan); clear smog with bio-filters; replant bloom spores | Flora absorbs 2× |
| Himasagara | Ice Leviathan | Sonar beacons to guide it; restore ocean-vent heat; feed an algae cycle | Free heat near vents |
| Taptashila | Magma Serpent | Ease vent pressure; re-route lava channels; plant heat lichen | Geothermal +50% |
| Vayudweep | Storm Bird | Rebuild wind channels; ground lightning; seed clouds | Storms charge batteries |
| Shunyapath | SARATHI's directive | Prove a closed-loop power network can run the terraformer | Unlocks the Covenant ending |

## 12. Worlds

| # | World | Look | Hazard | Big new idea | Vehicle | Est. hours |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Jivagraha | Lush living forest | Night | Survival, factory, Harmony | Rover | 2 |
| 2 | Himasagara | Frozen ocean | Cold, blizzards | Pipes, heaters, fuel cells | Submarine | 2.5 |
| 3 | Taptashila | Volcanic desert | Heat, lava | Geothermal, drones | Heat crawler | 2.5 |
| 4 | Vayudweep | Storm sky islands | Lightning, falls | Wind, jetpack/glider, cargo rockets | Glider | 3 |
| 5 | Shunyapath | Dead wreck world | No air, radiation | Quantum Core assembly | Drill pod | 2 |

New vehicles reopen sealed areas on earlier worlds.

## 13. Story

- **The Custodian:** scientist, memory lost, bulky non-military suit.
- **SARATHI:** damaged ship AI; guide and light humour; repairs itself as memory logs are found; bound by one directive: save the Seeds of Humanity.
- **Reveal path:** W1 mission *Ark*, a "Quantum Core" → W2 fossils too young, clocks disagree → W3 ship alloy fused in million-year-old rock → W4 full memory: Earth gone; the Core shattered, bent time, seeded four dead worlds → W5 the wreck; re-assembling the Core kills the living worlds.
- **Delivery:** memory logs, SARATHI lines, environmental details. No long cutscenes.

### Endings

| Ending | Condition | Outcome |
| --- | --- | --- |
| The Harvest | Always available: take the fragments | Seeds bloom on Shunyapath; living worlds fade to grey |
| The Covenant (true) | Leave the fragments; requires clean power + closed-loop production across worlds sufficient to run the terraformer (threshold: tune) | Humans settle alongside the living worlds |
| Epilogue variations | Each world's Harmony when left | Per-world final scene |

## 14. Modes and options

| Mode | Changes |
| --- | --- |
| Calm | Oxygen/power never run out; Guardians wake only from the story |
| Standard | As designed |
| Engineer | Faster pollution, costlier clean tech, tighter oxygen |
| Sandbox | Unlocked after W1; free resources, no story |

Autosave + 3 manual slots (browser storage on web, files on desktop). Rebindable keys, text size, subtitles, colour-blind palettes. English first; text externalised for translation (Hindi, Marathi later).

## 15. Art and audio

- **Art:** code-drawn "luminous flat" style — clean shapes, soft gradients, glow, particles, animated skies and flora; one palette per world. Factories glow warm against cool nature. All art in `src/art/` so it can be replaced by a human artist or asset pack.
- **Audio:** synthesised (Web Audio): ambient pads for nature; rhythmic layers that grow with factory size; a nature layer returns when Thriving. Recorded packs can be added if the owner supplies files.

## 16. Technical

- TypeScript + Phaser + Vite. Simulation (`src/core`, `src/systems`) is plain TypeScript, independent of Phaser, and unit-tested.
- Fixed simulation tick 5 Hz (tune), separate from rendering at 60 fps.
- Saves: one JSON document (grid, inventories, stocks, flags, version number for migrations).
- Performance target: 60 fps with 300 machines on a mid-range laptop.
- Builds: web (GitHub Pages), desktop (Electron), mobile (Capacitor, optional).

## 17. Decisions log

| Date | Decision | Why |
| --- | --- | --- |
| 2026-10-18 | No longer a KRAFTON Better Ground entry; built by Claude for release | Owner's decision |
| 2026-10-18 | Web stack (TypeScript + Phaser) instead of Unity | Claude can build, run and test it in its own workspace |
| 2026-10-18 | Round worlds + polar grid; Harmony as the core system; no violence; earned ending | Merged from the original blueprint, pitch notes and "Project: Odyssey" |
| 2026-10-18 | Chapter 1 (Jivagraha) is completed as a free demo before worlds 2–5 | Learn what is fun before building more |
| Open | Art direction beyond code-drawn style; Guardian names; price; repo visibility at launch; subtitle for the name | **owner** |

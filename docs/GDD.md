# Corebound — Game Design Document (v0.1)

*Status: draft for the Phase 0 concept lock. Numbers marked* (tune) *are starting values to be changed in playtests. Sections marked* **TBD** *have a named owner.*

This version merges the three earlier documents (the BETTER GROUND blueprint, the pitch-deck notes and the "PROJECT: ODYSSEY" GDevelop prompt) into one game. Where they disagreed, the decision is recorded in §11.

---

## 1. Pillars

Every feature must serve at least one pillar. If it serves none, it waits until after the final.

1. **Your factory is your answer.** The game's moral question is answered by how you build, not by a single button at the end.
2. **Science, not weapons.** Problems — including the giant Guardians — are solved with real engineering and real chemistry. No combat, no damage, no killing.
3. **The whole world, at a glance.** Each world is small and round enough to see at once, so its health is always readable.
4. **Satisfying automation.** Watching a line of machines you designed run on its own must feel good.

## 2. Player fantasy and audience

- **Fantasy:** a lone, resourceful custodian who turns a hostile situation into a working, *responsible* industry.
- **Audience:** ages 10–25 who enjoy building, optimising and uncovering mysteries (Factorio, Terraria, Stardew Valley, Subnautica, Terra Nil players).
- **Session:** the Jivagraha vertical slice is 20–30 minutes; a booth visitor must be hooked within 5.

## 3. Core loop

```
Harvest elements → Automate the base → Craft vehicles → Explore the world
        ↑                 │ emissions lower Harmony            │
        │                 ▼                                     ▼
 Fly to next world ← Quantum Fragment ← Calm the Guardian ←─────┘
                          ▲
           Harmony: high = bloom resources, low = Guardian wakes early
```

- **Minute to minute:** mine, carry, place machines, keep oxygen and power up.
- **Hour to hour:** grow production chains, balance Harmony, unlock a vehicle, calm a Guardian.
- **Whole game:** five worlds, five fragments, one ending decided by how you built.

## 4. The world: round planets and the polar grid

Each world is a disc seen from the side, with gravity pulling toward its centre.

| Layer (outside → in) | Rings | What lives there |
| --- | --- | --- |
| Sky | 2 | Weather, smog, solar collectors, rocket path |
| Surface | 1 | Flora, the shelter, most machines, conveyors |
| Crust | 3 | Ore seams, ice pockets, buried water, Guardian roots |
| Mantle | 2 | Heat for geothermal power (later worlds) |
| Core | 1 | The Quantum Fragment chamber |

- **Polar build grid.** Positions are `(ring, sector)`. Jivagraha has 64 sectors (tune). A building occupies one ring and a width of 1–4 sectors. Placement checks are simple integer comparisons.
- **Movement.** The player is stored in polar coordinates `(angle, altitude)`. Left/right changes `angle`; jumping adds outward velocity; gravity pulls `altitude` back to the surface. Convert to x/y only when drawing. This avoids the rotation bugs of force-based radial gravity.
- **Camera.** Follows the player and rotates so "up" always points away from the core. Press **M** to zoom out to the whole-planet view, which also shows Harmony.
- **Day and night.** The planet rotates; one day on Jivagraha lasts 4 minutes (tune). Solar works only on the lit side.

## 5. Survival (gentle by design)

| Stat | Drains when | Refills at |
| --- | --- | --- |
| Oxygen | Always outside the shelter; faster when running | Inside the shelter dome, fed by the electrolyzer |
| Suit power | Mining, running, using tools | Battery charging points |

- Hitting zero on either causes a **blackout**: the player wakes in the shelter and drops what they were carrying at the blackout spot.
- There is **no health and no damage** anywhere in the game.

## 6. Elements, machines and recipes

Real chemistry, simplified. Every machine has a one-card **science log** written by the narrative lead.

| Raw element | Source |
| --- | --- |
| Iron ore (Fe₂O₃) | Crust seams |
| Silica sand (SiO₂) | Surface dunes |
| Carbon | Coal-like crust seams, or harvested alien wood (lowers Harmony) |
| Ice (H₂O) | Crust pockets, polar caps |

| Machine | Input | Output | Harmony effect |
| --- | --- | --- | --- |
| Shelter dome | — | Safe zone, oxygen refill | None |
| Solar panel | Daylight | Power | None |
| Battery | Power | Stored power | None |
| Electrolyzer | Ice, power | Oxygen (to shelter), hydrogen | None |
| Auto-drill | Power | Ore | Soil + (tailings); seismic noise |
| Smelter | Iron ore, carbon, power | Iron plates | Air + (CO₂) |
| Silicon furnace | Silica, carbon, power | Silicon | Air + |
| Conveyor | Items | Items moved one sector per tick | None |
| Storage | Items | Items | None |
| Bio-filter | Water, power | — | Air − |
| Settling pond | Drill tailings | — | Soil − , Water − |
| Recycler | Scrap | Plates (fewer drills needed) | Indirect − |
| Sabatier reactor | Captured CO₂, hydrogen | Methane rocket fuel, water | Air − |
| Launch pad | Methane, parts | Launch to next world | None |

Design rule: **the clean route must also be the efficient route.** The Sabatier reactor turns captured smelter exhaust into rocket fuel, so a player who cleans up gets to leave sooner.

## 7. Harmony (the signature system)

Each world tracks three pollution stocks, each 0–100: **Air (A)**, **Water (W)** and **Soil (S)**.

Every simulation tick:

```
stock = clamp(stock + emissions − flora_absorption − filter_removal, 0, 100)
Harmony = 100 − (0.4·A + 0.3·W + 0.3·S)        (weights: tune)
```

| Harmony | Band | What the player sees and feels |
| --- | --- | --- |
| 80–100 | Thriving | Bright sky, flora glows, extra music layer; **bloom resources** appear (needed for advanced recipes) |
| 50–79 | Stable | Normal world |
| 25–49 | Stressed | Haze, wilting flora, acid rain slowly corrodes exposed machines (they need repair, they are never destroyed) |
| 0–24 | Collapse | Storms, dead flora, the Guardian wakes early and agitated |

- Harmony is **never shown as a bare number** in normal play: the sky, the flora and the music carry it. A meter appears in planet view (**M**).
- Flora absorbs pollution only while healthy, so neglect compounds — but recovery is always possible.

## 8. Apex Guardians

Guardians are living protectors of each world. They wake when Harmony drops below 50 or when the player disturbs their habitat, and they block a region until calmed. Calming them reuses systems the player already knows.

**Jivagraha — the Root Guardian** (name **TBD**, narrative lead; "Mahavata", from the banyan, is a candidate)

1. A seismic scan reveals its root network; move drills off the root sectors.
2. Route smelter exhaust through a bio-filter until the Air stock drops below 30.
3. Replant spore pods from a bloom; the Guardian settles and opens the path to the first Quantum Fragment.

**Himasagara — the Cryo-Leviathan:** build a sonar beacon network, restore the heat balance of the ocean vents, deliver an algae nutrient cycle.

Other worlds: **TBD** (narrative lead), same rule.

## 9. Worlds and vehicles

| # | World | Look | Vehicle it introduces | In vertical slice? |
| --- | --- | --- | --- | --- |
| 1 | Jivagraha | Lush green | Rover | Yes, fully playable |
| 2 | Himasagara | Frozen ocean | Submarine | Launch teaser only |
| 3 | Taptashila | Volcanic desert | Heat-shielded rover | No |
| 4 | Vayudweep | Floating storm islands | Glider | No |
| 5 | Shunyapath | Dead cosmic ruins | — (final choice) | No |

Backtracking: new vehicles open sealed areas on earlier worlds (for example, the submarine reaches Jivagraha's buried sea).

## 10. Story

- **Frame:** the Custodian wakes from cryo with lost memory. Each Quantum Fragment restores one memory log.
- **Twist:** the system was barren. When the Custodian's ship exploded, its experimental Quantum Core scattered and **warped time**, so millions of years of evolution passed while the Custodian slept.
- **Stakes:** the ship carries the last Seeds of Humanity. Re-forming the Quantum Core powers the terraforming engines — and kills the five ecosystems.
- **Ending (earned):**
  - *Take the cores* — always possible. Humanity's seeds thrive; the five worlds go grey.
  - *Leave the cores* — possible only if the player has built enough clean power and closed-loop production to terraform without them. A new human settlement coexists with the living worlds. This is the true ending.
- **Lore logs:** 8–10 in the slice. Titles and text **TBD** (narrative lead).

## 11. Decisions log

| Topic | Decision | Why |
| --- | --- | --- |
| Name | Corebound (not "Project: Odyssey") | Matches the blueprint and describes gravity toward the core |
| Guardians | Never hostile, never fought; no turrets or fences | Program's no-violence guideline; Pillar 2 |
| World shape | Round worlds, polar grid | Whole world visible; simpler placement on curves; strong visual hook (pending team confirmation) |
| Economy | Real elements | STEM value; enables the Sabatier "clean is efficient" loop |
| Survival | Oxygen and suit power only | Tension without damage; suits ages 10+ |
| Ending | Earned through play | A pre-picked "true ending" is not a real dilemma |
| Engine | **Open** — Unity 6 LTS or Godot 4 | Depends on laptop RAM and who writes the code |

## 12. Art and audio direction

- **Visual style:** HD pixel art with 2D lighting; each world has its own palette. Quantum objects glow. Factories glow warm (orange) against cool natural tones, so industry is always visible.
- **Character:** the Custodian wears a bulky, non-military, modular science suit.
- **Harmony in visuals:** sky tint, flora animation state and particle haze are driven directly by the Harmony band.
- **Audio:** ambient synth-wave plus organic alien nature sounds; factory rhythm layers grow with factory size. In the Thriving band, a nature layer returns over the industry.
- Designs avoid any element that demeans or stereotypes a culture.

## 13. Controls (PC)

| Action | Key |
| --- | --- |
| Move | A / D (or arrows) |
| Jump | W / Space |
| Mine / use | Left mouse |
| Build mode | B |
| Interact | F |
| Inventory | Tab |
| Planet view and Harmony meter | M |

## 14. Technical shape (engine-agnostic)

- **Simulation tick:** factory and Harmony update 5 times per second (tune), separately from rendering.
- **Data-driven content:** items, recipes, machines and Harmony coefficients live in data assets (ScriptableObjects in Unity, Resources in Godot) that the director edits without code.
- **Saves:** one JSON file holding the polar grid, inventories, stocks and story flags.
- **Performance target:** 60 fps on the team's weakest laptop with 150 machines placed.
- **Builds:** a web build for the application link and a Windows build for the booth laptop.

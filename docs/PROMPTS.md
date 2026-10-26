# Corebound — Prompt Pack (art, 3D models, music, sound, voice)

This file replaces the old "Prompt Pack" tab. It lists **everything the game needs from outside tools**, with a ready-to-paste prompt for each item, the tool to use, the file name, and the folder to upload it to.

- **Who uses it:** the Commander (Pon), with Gemini, ChatGPT, image-to-3D websites, Suno, a sound-effects tool and Sarvam AI.
- **Who checks it:** the Director (Claude) checks every upload in `art-inbox/`, puts it into the game, and reports problems in [STATUS.md](STATUS.md).
- **Priority:** **P1** = needed now (Chapter 1, milestones M1–M2). **P2** = needed for the Chapter 1 demo (M3–M4). **P3** = later worlds (M5+). ✓ = already received. Do P1 first.
- **Code-made (no file needed):** things marked *code* are built by Claude in code. Do not spend credits on them.

---

## Contents

1. [How to work](#1-how-to-work)
2. [Style bible: paste this first](#2-style-bible-paste-this-first)
3. [Concept art: worlds](#3-concept-art-worlds)
4. [Characters and people](#4-characters-and-people)
5. [Creatures and Guardians](#5-creatures-and-guardians)
6. [Machines and buildings](#6-machines-and-buildings)
7. [Vehicles and spaceships](#7-vehicles-and-spaceships)
8. [Story props and items](#8-story-props-and-items)
9. [Textures, skies, icons](#9-textures-skies-icons)
10. [Key art, store images, video](#10-key-art-store-images-video)
11. [Turning images into 3D models (GLB)](#11-turning-images-into-3d-models-glb)
12. [Music (Suno)](#12-music-suno)
13. [Sound effects](#13-sound-effects)
14. [Voices (Sarvam AI)](#14-voices-sarvam-ai)
15. [Upload checklist](#15-upload-checklist)

---

## 1. How to work

**For every image:**
1. Open Gemini (or ChatGPT image generation).
2. Paste the **style bible** (section 2), then the item's prompt.
3. If the item has a **reference** listed, attach that image from `art-inbox/` (for example `art-inbox/concept/custodian.png`) and say "match the style and character of the attached image".
4. Make 2–4 versions and keep the best one. If it has text, letters or a logo in it, make it again.
5. Save it as PNG with the exact **file name** given and upload it to the given folder on GitHub (open the folder → **Add file → Upload files** → **Commit changes**).

**Aspect ratios:** worlds and scenes 16:9; single objects and characters 1:1; tall store images as stated.

**Objects for 3D (machines, vehicles, ships, props, characters):** make the **turnaround image** first (one object, plain background, three-quarter view). Only when it looks right, spend 3D credits on it (section 11). The 3D model goes in `art-inbox/models/`, the image in `art-inbox/turnaround/`.

**Gemini's little star watermark** in the corner is fine; Claude crops it.

**Do not:** name real games, studios or artists in prompts; copy a real logo or character; ask for weapons, blood, fighting or anything hurt. Corebound is non-violent.

---

## 2. Style bible: paste this first

Paste this block at the start of **every** image prompt:

```
Stylised Indo-futurist solarpunk game art for a cosy 3D sci-fi survival and factory game.
Soft, chunky, rounded shapes with clear silhouettes; painterly hand-painted textures;
warm golden light with soft atmospheric glow; bioluminescent nature.
Technology is made of off-white ceramic, polished copper and brass, with warm amber lights,
jaali lattice screens, stepwell geometry, arched domes and lotus-petal forms.
Rich, harmonious colours, not neon. Friendly and wondrous, never scary or violent.
No text, no letters, no logos, no watermark, no signature, no border.
```

### World palettes (add the matching line to world prompts)

| World | Add this line |
| --- | --- |
| Jivagraha | `Palette: emerald and teal forest, peach-gold sky by day, violet and cyan bioluminescence at night.` |
| Taptashila | `Palette: charcoal and rust-red rock, glowing orange lava veins, yellow sulfur and metallic crystal glints, harsh white sunlight.` |
| Marubhumi | `Palette: ochre, terracotta and red-orange sand, dry golden savannah grass, dusty pink sky, deep blue shadows.` |
| Himasagara | `Palette: pale ice blue and white, deep navy ocean below, aqua bioluminescence, a huge banded gas giant filling the sky.` |
| Vayumandala | `Palette: lavender and violet cloud seas, pearl-white floating rock, cyan lightning, warm sunset rims.` |
| Vishamegha | `Palette: sickly yellow-green and mustard clouds, olive haze, copper-orange acid glow, dim filtered sun.` |
| Shunyapath | `Palette: grey dust, black sky full of stars, cold white light, gold-cracked glowing wreck metal.` |

### The star system in one picture (for reference in every world prompt)

A warm yellow-white sun. Close to it, rocky **Taptashila**. Then green-blue **Jivagraha** (home). Then red-ochre **Marubhumi**. Then the cloudy yellow **Vishamegha**. Far out, the giant violet-banded **Vayumandala** with its ice moon **Himasagara**. At the edge, dead grey **Shunyapath**. Every world is small and round; you can walk around one in a few minutes.

---

## 3. Concept art: worlds

Concept art shows Claude the look, colour and mood. Save to `art-inbox/concept/`. All 16:9.

### Already received ✓
`jiva_orbit`, `jiva_surface_day`, `jiva_surface_night`, `jiva_healthy`, `jiva_polluted`, `jiva_underground`, `jiva_creatures`, `hima_orbit`, `hima_surface`, `hima_underwater`, `tapta_orbit`, `tapta_surface`, `vayu_orbit`, `vayu_surface`, `shunya_orbit`, `shunya_surface`, `quantum_core`, `sarathi`, `custodian`, Guardians root/ice/magma/storm.

The old `vayu_*` images (sky islands) now belong to **Vayumandala's cloud reefs**: keep them.

### 3.1 Star system overview: P2

| File | Prompt (after the style bible) |
| --- | --- |
| `system_overview.png` | `A wide view of a small, beautiful star system seen from space: a warm sun on the left; seven small round worlds spread across the frame — a rocky charcoal world with lava veins near the sun, a green-and-blue forest world with oceans, a red ochre desert world with savannah, a yellow cloud-wrapped world, a giant violet banded gas giant with a small white ice moon, and a dead grey world far away with a glowing golden wreck on it. A thin trail of glowing golden fragments arcs through the system, as if something exploded long ago. Painterly space, soft nebula.` |
| `jiva_crash_site.png` | `Jivagraha forest clearing at dawn: a crashed escape module made of off-white ceramic and copper lies half buried in moss and roots, its door open, a cryo-pod inside glowing faintly amber; steam rising; a small astronaut in a white suit stepping out, seen from behind; giant mushroom trees and banyan roots around; a tiny round planet horizon curving away.` (reference: `custodian.png`, `jiva_surface_day.png`) |

### 3.2 Taptashila (rocky, minerals, like Mercury): P3

The old `tapta_*` images are close (volcanic). Add these to show **mountains, metals and the scorching-day / freezing-night split**.

| File | Prompt |
| --- | --- |
| `tapta_mountains.png` | `Taptashila, a small rocky world close to its sun: jagged charcoal mountains with stripes of rust-red iron, green copper and silver titanium ore in the cliffs; glowing gold veins; thin lava rivers in deep canyons; a huge white-hot sun low on the horizon; heat shimmer; a small astronaut and a heat-shielded six-wheeled rover on a ridge for scale.` |
| `tapta_night.png` | `The same rocky world at night: frost on dark rocks, lava veins glowing orange in the cold, stars and a distant green-blue planet in the black sky, a small base of ceramic domes with amber lights tucked against a cliff.` |
| `tapta_regions.png` | `A top-down map-like painting of a small round rocky planet showing three regions: a metal-rich mountain belt with coloured ore veins, a cracked lava plain, and a pale plain of plain grey stone. Soft labels-free illustration, like a game world map.` |

### 3.3 Marubhumi (desert and savannah, Sahara + Mars): P3 (new world)

| File | Prompt |
| --- | --- |
| `maru_orbit.png` | `A small round desert planet seen from orbit: red-orange and ochre dunes, a belt of golden savannah around the middle with dark winding dry riverbeds, a few blue oasis lakes, thin dusty pink atmosphere glowing at the rim, a small rover-shaped dust trail visible.` |
| `maru_surface.png` | `Marubhumi surface at golden hour: tall curved red dunes, flat-topped stone mesas, a savannah of dry golden grass and umbrella-shaped alien trees with copper leaves, a shimmering oasis with turquoise water; a small astronaut beside a sleek buggy with big soft tyres; huge sky with two pale moons.` |
| `maru_savannah.png` | `The savannah belt of a desert planet: tall golden grass, termite-like spires built by alien creatures, herds of gentle long-legged grazers, an alien nomad caravan of tall slender people with cloth sails on their backs walking in a line, distant dunes.` |
| `maru_sandstorm.png` | `A giant red sandstorm wall rolling across a desert planet, the sun turned into an orange disc, a small ceramic base with amber lights bracing for it, an astronaut hurrying toward the airlock.` |
| `maru_oil_region.png` | `A dark cracked plain on a desert planet where black oil seeps from the ground in glossy pools, glittering diamond crystals in an old riverbed, a liquid-drill pump of copper and ceramic working nearby.` |

### 3.4 Himasagara (ice moon of Vayumandala): P3

Received ✓ `hima_orbit`, `hima_surface`, `hima_underwater`. Add:

| File | Prompt |
| --- | --- |
| `hima_moon_view.png` | `Standing on a frozen white moon covered in blue cracks and ice spires; filling half the sky above is a gigantic violet-banded gas giant with storms; aurora ribbons; a small astronaut looking up; a submarine hatch drilled into the ice.` |
| `hima_ocean_base.png` | `A cosy underwater base under a thick ice ceiling: ceramic domes with round amber windows anchored to the sea floor near warm hydrothermal vents, glowing jellyfish-like creatures drifting, a small round submarine with copper fins approaching.` |

### 3.5 Vayumandala (gas giant cloud reefs): P3

Received ✓ `vayu_orbit`, `vayu_surface` (sky islands). Add:

| File | Prompt |
| --- | --- |
| `vayu_giant.png` | `A huge gas giant seen up close from orbit: violet, lavender and cream storm bands, a great swirling storm eye, a small icy white moon in front, a slender space station with a ring and a long cable descending toward the clouds.` |
| `vayu_cloud_reef.png` | `Floating islands of pearl-white porous rock drifting in an endless lavender cloud sea on a gas giant; gas-filled balloon plants tethered to them; a small helicopter with copper rotors flying between islands; cyan lightning far below; warm sunset rim light.` |
| `vayu_station.png` | `A space station in orbit made of ceramic rings, copper trusses and lotus-shaped solar petals; a spaceship docking; the top of a space elevator cable glowing as a cargo pod climbs it from the planet below.` |

### 3.6 Vishamegha (toxic clouds, like Venus): P3 (new world)

| File | Prompt |
| --- | --- |
| `visha_orbit.png` | `A small planet completely wrapped in thick swirling yellow-green and mustard clouds, a faint orange glow under the clouds, a pale sun nearby; seen from orbit with a small spaceship passing.` |
| `visha_surface.png` | `On the surface of a cloud-covered toxic world: thick olive haze, dim filtered light, a landscape of smooth yellow rock and strange tall chimney plants that breathe out pale clouds, small orange acid pools that glow, an astronaut in a white suit with an extra filter backpack, a small base with glass air domes.` |
| `visha_towers.png` | `Tall slender towers of an alien people built above the toxic clouds, made of curved stone and woven filters, glowing windows, gliders moving between them, the yellow cloud sea below.` |
| `visha_clean.png` | `The same toxic world after its air has been cleaned: the haze has thinned to soft gold, patches of blue sky, green algae growing on rocks, the chimney plants blooming with pink flowers.` |

### 3.7 Shunyapath (the wreck world): P3

Received ✓ `shunya_orbit`, `shunya_surface`. Add:

| File | Prompt |
| --- | --- |
| `shunya_wreck_inside.png` | `Inside a gigantic crashed starship: a cathedral-like hall of off-white ceramic and copper ribs, rows of sealed seed vaults glowing soft green, cracked gold light leaking through the walls, a huge dormant machine at the far end shaped like a stepwell turned upside down (the terraforming engine), a small astronaut and a lotus-shaped floating drone.` |
| `shunya_core.png` | `The rebuilt Quantum Core floating in the centre of a ring machine, made of seven glowing fragments fitted together, light bending around it, the astronaut's hand reaching toward it, a moment of choice.` |

---

## 4. Characters and people

Characters need: **1. concept art** (to agree the look), **2. turnaround** (for 3D), **3. a rigged GLB** (section 11). Concept to `art-inbox/concept/`, turnaround to `art-inbox/turnaround/`, model to `art-inbox/models/`.

**Turnaround prompt ending** (add to every character turnaround):
```
Character turnaround sheet: the same character shown front, side and back, standing straight in an A-pose
(arms slightly away from the body, legs slightly apart), full body visible head to feet, plain light grey
background, even soft studio lighting, no shadows, no props in hands.
```

| Item | Priority | Files | Prompt (after the style bible) |
| --- | --- | --- | --- |
| Custodian | ✓ | `custodian.png`, `custodian_rigged.glb` | Received. |
| Custodian suit modules | P3 | `custodian_suits.png` | `Four versions of the same astronaut suit side by side: heat-shielded with gold reflective plates; cold-insulated with quilted padding and fur-like trim; toxin-filter with a big round filter backpack and mask; pressure-sealed with extra rings and a glass collar.` (reference `custodian.png`). Suit modules may be added as attachments, so no new 3D model unless Claude asks. |
| SARATHI | P2 | `sarathi_turnaround.png`, `sarathi.glb` | `A small floating drone shaped like a lotus bud: off-white ceramic petals that can open and close, a copper ring around the middle, one large warm amber eye-lens, small thruster glow underneath, a cracked petal showing it is damaged.` (reference `sarathi.png`). Single object, not rigged; Claude animates petals in code if the petals are separate parts. |
| Prof. Orion Huxley | P2 | `huxley.png`, `huxley_turnaround.png`, `huxley_rigged.glb` | `An older scientist, around sixty, kind and tired face, short grey beard, round glasses, long lab coat over a simple high-collared mission uniform with a small lotus emblem, hands that like to gesture when he talks.` In the game he appears as a blue-gold hologram: Claude adds the hologram look in code, so make him in normal colours. Mixamo clips: Talking, Thinking, Pointing, Idle. |
| Alion Voss | P3 | `voss.png`, `voss_turnaround.png`, `voss_rigged.glb` | `A friendly alien traveller: tall and slender, smooth blue-grey skin with soft bioluminescent freckles, large dark eyes, two small head-fins, wearing a patched space jacket with many pockets and a homemade radio device on the belt; curious, brave, a little tired.` Humanoid so Mixamo works. Clips: Idle, Talking, Waving, Walking, Sitting (trapped pose: Lying idle). |
| Jivagraha people | P3 | `people_jiva.png` | `A small community of gentle forest people about one metre tall, moth-like with soft fuzzy antennae, woven leaf cloaks, carrying lanterns of glowing fungus; they tend giant mushroom gardens.` |
| Taptashila people | P3 | `people_tapta.png` | `Sturdy miner people with stone-like shell plates on their backs, small bright eyes, heavy gloves, living in carved cliff homes lit by lava light; traders of metals.` |
| Marubhumi people | P3 | `people_maru.png` | `Tall slender nomads with long legs and cloth sails on their backs that catch the wind, faces wrapped in bright woven scarves, travelling with caravans of gentle grazers.` |
| Himasagara people | P3 | `people_hima.png` | `Soft glowing people of the deep ocean, half jellyfish, with translucent bodies and trailing ribbons of light, living in coral-like towers by warm vents.` |
| Vayumandala people | P3 | `people_vayu.png` | `Light hollow-boned people with wide membrane wings like kites, living on floating islands, wearing ribbons and wind chimes.` |
| Vishamegha people | P3 | `people_visha.png` | `People who live in towers above toxic clouds, wearing beautiful sculpted breathing masks and long layered filter robes, thoughtful and private.` |

Names for the peoples come from Sarvam AI (task T-004); the Commander chooses.

Only humanoid characters can use Mixamo. For non-humanoid peoples Claude will say how to rig them when their milestone comes.

---

## 5. Creatures and Guardians

Creatures never hurt anyone (see GDD §11). They are shy, curious or territorial. Guardians are huge and awe-inspiring, never monstrous.

### 5.1 Creatures: concept sheets: P2 (Jivagraha), P3 (others)

Save to `art-inbox/concept/`. One sheet per world showing 3–4 creatures.

| File | Prompt |
| --- | --- |
| `creatures_jiva.png` ✓ | Received (`jiva_creatures.png`). |
| `creatures_tapta.png` | `Creature sheet for a rocky mineral world: a rock crab that looks exactly like a lumpy grey boulder until it stands up on six legs (show both), with tiny curious eyes and shiny ore crystals stuck to its shell; small lizard-like basking creatures with heat-glowing back plates; a slow mountain grazer that licks minerals from rocks.` |
| `creatures_maru.png` | `Creature sheet for a desert savannah world: a Szynthar — a sleek wolf-like pack animal with sandy fur, long ears, striped markings and glowing amber eyes, shown running and standing alert (proud and wild, not snarling); gentle long-necked grazers; small burrowing hoppers; a sand-swimming fish with a fin above the sand.` |
| `creatures_hima.png` | `Creature sheet for an ice moon ocean: drifting jellyfish of light, a curious whiskered seal-like swimmer, glowing shrimp swarms, a crab that clings under the ice.` |
| `creatures_vayu.png` | `Creature sheet for floating sky islands: gas-bag balloon creatures with long dangling tendrils, ribbon-tailed gliders, tiny puffball birds.` |
| `creatures_visha.png` | `Creature sheet for a toxic cloud world: slow armoured beetles that eat acid crust, cloud rays that glide in the haze, small fluffy filter-feeders with frilly gills.` |

**3D for creatures (P3):** turnaround each creature separately (`creature_<name>_turnaround.png`, 1:1, plain grey background, side view and three-quarter view) and make a GLB. Claude decides per creature whether it needs a rig.

### 5.2 Guardians: concept art (calm + restless): Claude builds the bodies in code

Save to `art-inbox/concept/`. Show each one **calm** (friendly, glowing) and **restless** (agitated, storming, but not attacking or hurting anything). No 3D model needed.

| File | Status | Prompt |
| --- | --- | --- |
| `guardian_root.png` | ✓ | Add `guardian_root_restless.png`: `The same giant root guardian rising from the forest, its glowing roots tense and lifting the ground, mushrooms dimming, birds flying away; majestic and sad, not attacking.` |
| `guardian_magma.png` | ✓ | Add `guardian_magma_calm.png`: `The same lava serpent resting peacefully in a cooled lava lake, its glow soft and gentle, heat lichen blooming around it.` |
| `guardian_dune.png` | P3 | `The Dune Leviathan: an enormous creature that swims through desert sand like a whale through water, its back covered in overlapping plates of translucent silica glass that glow when the sun hits them, a huge gentle eye, sand pouring off it as it surfaces; a tiny astronaut on a dune for scale. Calm and majestic.` + `guardian_dune_restless.png` (`...the same creature restless, raising sandstorms with its fins, dunes trembling, not attacking.`) |
| `guardian_ice.png` | ✓ | Add `guardian_ice_restless.png`: `The same ice leviathan deep under the ice, releasing clouds of glowing ink that dim every light around it, restless, not attacking.` |
| `guardian_storm.png` | ✓ | Add `guardian_storm_calm.png`. |
| `guardian_haze.png` | P3 | `The Haze Weaver: a vast, graceful, many-winged creature made of soft layered membranes that drifts inside yellow toxic clouds, weaving the haze into spirals with its long trailing fins, small lights along its body like a lantern festival.` + `guardian_haze_restless.png` |

---

## 6. Machines and buildings

Machines can arrive **plain white** (Claude paints them in the game's ceramic, copper and amber), but clear shapes help: bands, rings, doors, lattice panels, pipes.

**Turnaround prompt ending** (add to every machine):
```
Single game asset, centred, three-quarter front view from slightly above, the whole object visible,
standing on a plain flat base, plain light grey background, soft even studio lighting, no shadows on the
background, no people, no text. Chunky, readable shapes that will look good small on screen.
```

Turnaround to `art-inbox/turnaround/<name>.png`, model to `art-inbox/models/<name>.glb`. Height is the real in-game height; Claude scales the model.

### 6.1 Received ✓
`shelter_dome`, `solar_lotus`, `battery`, `electrolyzer`, `smelter`.

### 6.2 P1: needed for M2 (Build and automate)

| Name | Height | Prompt |
| --- | --- | --- |
| `auto_drill` | 2.5 m | `A mining machine (auto-drill) that stands over the ground on three sturdy legs, a large copper drill bit pointing down into the ground through a ring, an ore hopper on the side with a small chute, an amber status light, ceramic panels with jaali lattice vents.` |
| `storage_silo` | 3 m | `A storage silo: a tall rounded ceramic cylinder with copper bands, a domed lotus-petal lid, a small hatch and loading chute at the base, a vertical glass strip showing how full it is.` |
| `research_station` | 2.4 m | `A research station: a curved ceramic desk with a large round holographic display ring above it, a sample slot with a glowing tray, small copper antennae, a stool, rows of tiny amber lights.` |
| `coal_burner` | 2.2 m | `A small coal-burning power generator: squat brick-and-ceramic furnace with a round copper door showing a fire glow, a tall chimney, a spinning copper flywheel on the side, cables leading out.` |
| `silicon_furnace` | 2.4 m | `A silicon furnace: a tall narrow ceramic kiln shaped like a stepwell turned upside down, a glowing white-hot window, copper crucible on top, an output tray holding shiny grey silicon wafers.` |
| `bio_filter` | 2 m | `An air-cleaning bio-filter: a glass tank full of green algae with bubbles, wrapped in a ceramic frame with jaali screens, small fans on top, leafy plants growing from it.` |
| `power_pylon` | *code* | Claude makes this. |
| `conveyor`, `lift`, `foundation_pad`, `pipe` | *code* | Claude makes these. |

### 6.3 P2: needed for the Chapter 1 demo (M3–M4)

| Name | Height | Prompt |
| --- | --- | --- |
| `sabatier_reactor` | 2.5 m | `A chemical reactor that turns CO2 and hydrogen into methane fuel and water: two round copper tanks joined by coiled pipes, a central ceramic chamber with a warm glow, dripping water spout, a small blue flame indicator.` |
| `settling_pond` | *code* | Claude makes this (it is mostly water). |
| `vehicle_bay` | 4 m | `A vehicle bay: an open-fronted garage with an arched ceramic roof, a copper crane arm, a turntable platform, tool racks, amber lights; big enough for a small rover.` |
| `launch_pad` | 3 m (pad 12 m wide) | `A round rocket launch pad: a wide stepped ceramic platform with lotus-petal blast shields around the edge, four copper gantry towers with fuel hoses, glowing landing ring lights.` |
| `escape_module` | 3 m | `A crashed escape capsule: rounded off-white ceramic and copper pod, half tilted, scorch marks, a cracked round window, a door hanging open, one cryo-pod visible inside with faint amber light.` |
| `cryo_pod` | 2.2 m | `A cryo-sleep pod: a reclined capsule with a curved frosted glass lid, ceramic body, copper pipes, small amber warning lights, mist spilling out.` |

### 6.4 P3: later worlds

| Name | Height | Prompt |
| --- | --- | --- |
| `refinery` | 3.5 m | `A large ore refinery: several stepped ceramic furnaces in a row connected by copper chutes, rolling mills that press glowing metal into plates, a tall chimney with a filter cap.` |
| `liquid_drill` | 3 m | `A liquid drill pump for water and oil: a tall nodding pumpjack made of copper and ceramic with a lotus-shaped counterweight, a round storage tank beside it, a pipe outlet.` |
| `fuel_processor` | 3 m | `A biofuel processor: a round fermentation tank of glass and copper filled with green-brown bubbling liquid, a hopper for wood and plant matter, a small distillation column, an output tap.` |
| `biofuel_power_station` | 4 m | `A biofuel power station: a ceramic turbine hall with three short exhaust stacks, a large spinning copper turbine visible through a round window, fuel pipes, glowing power coils.` |
| `windmill` | 8 m | `A tall elegant windmill with three wide sail-like ceramic blades, a lotus-shaped hub, a slim lattice tower in copper.` |
| `geothermal_plant` | 4 m | `A geothermal power plant built over a steaming vent: a squat dome with heat-exchange fins, pipes going into the ground, steam rising, glowing orange core window.` |
| `fuel_depot` | 3 m | `A fuel depot: three capsule-shaped tanks lying on a stepped platform, colour bands for hydrogen, oxygen and methane, a refuelling arm.` |
| `space_station` | — (large) | `A modular space station: a central ceramic hub, a slowly turning ring with windows, lotus-petal solar arrays, docking arms, a cable dropping toward the planet.` |
| `space_elevator_base` | 10 m | `The ground anchor of a space elevator: a massive stepped ceramic tower, a glowing cable rising straight up into the sky, a cargo pod climbing it.` |
| `scent_post` | 1.5 m | `A small post that gently keeps animals away with scent: a carved ceramic pillar with herb pots and a tiny copper diffuser puffing mist.` |
| `resonance_beacon` | 2 m | `A resonance beacon that emits calming high-frequency sound: a tall thin copper tuning fork shape on a ceramic base, glowing rings vibrating around it.` |
| `hauler` | 1.5 m | `A small self-driving cargo cart with six wheels, an open ceramic tray, a little amber sensor eye, copper bumpers.` |
| `cargo_drone` | 1 m | `A cargo drone with four ducted copper fans and a hanging ceramic crate.` |
| `seed_vault` | 2.5 m | `A sealed seed vault capsule: tall ceramic cylinder with a glowing green window showing rows of seed tubes, copper locks.` |
| `terraforming_engine` | — (huge) | Concept art only (`shunya_wreck_inside.png`); Claude builds it. |

---

## 7. Vehicles and spaceships

Same turnaround ending as machines (section 6). Vehicles need **separate wheels** (or rotors) if possible: in the 3D tool, simple is fine; Claude may ask for wheels separately.

| Name | Priority | Size | Prompt |
| --- | --- | --- | --- |
| `rover` | P2 | 3.5 m long | `A small two-seat exploration rover: rounded ceramic body like a beetle shell, big soft six wheels, a glass bubble cockpit, a copper roof rack, amber headlights, a small lotus antenna.` |
| `truck` | P3 | 6 m long | `A six-wheeled cargo truck: a short cab with a round window, a long open ceramic cargo bed with copper rails, sturdy tall wheels, amber lights.` |
| `buggy` | P3 | 3 m long | `A light desert buggy: open frame of copper tubes, a single seat, huge balloon tyres, a small sail-like sunshade, fast-looking and fun.` |
| `helicopter` | P3 | 7 m long | `A helicopter with two stacked lotus-petal rotors, a rounded glass cockpit, ceramic body, a cargo hook underneath, copper skids.` |
| `submarine` | P3 | 6 m long | `A small round submarine like a fish: ceramic hull with copper fins, a large round front window, bright searchlights, a sonar dish on top.` |
| `drill_pod` | P3 | 4 m long | `A drill pod that bores through rock: a capsule with a huge copper cone drill on the front, caterpillar tracks, a small cockpit window, ceramic armour plates.` |
| `ship_starter` | P2 (demo cliffhanger) | 12 m tall | `A small first spaceship standing upright on four landing legs: a rounded ceramic body with copper bands, a round cockpit window near the top, lotus-petal fins at the base around the engine, white and amber lights. Simple and a bit homemade.` |
| `ship_voyager` | P3 | 18 m long | `The Mk2 Voyager spaceship: longer and sturdier, a cargo section with round hatches, bigger fuel tanks on the sides, a wide cockpit, ceramic and copper, flying horizontally.` |
| `ship_scavenger` | P3 | 12 m long | `The Scavenger spaceship: slim and fast, built from mismatched salvaged panels, a single large engine glowing green from biofuel, small cargo pods, patched but proud.` |
| `ship_freighter` | P3 | 30 m long | `The Freighter spaceship: a long heavy hauler with a small cockpit at the front and many cargo containers clamped along its spine, four big engines, slow and strong.` |

---

## 8. Story props and items

Small things. 1:1 turnaround images to `art-inbox/turnaround/`; GLB to `art-inbox/models/`.

| Name | Priority | Prompt |
| --- | --- | --- |
| `laser_tool` | P2 (optional) | `A handheld mining laser tool: ceramic body, copper barrel with coils, a warm amber emitter tip, a comfortable grip.` (Claude has a code-made one; a model would replace it.) |
| `translator` | P2 | `A handheld translator device: a round ceramic disc with a glowing amber ring of symbols around a small speaker grille, worn on a wrist strap.` |
| `memory_log` | P2 | `A small data tablet left in a wreck: a slim ceramic slate with a cracked glowing screen, a copper edge, a lotus emblem.` |
| `huxley_projector` | P2 | `A hologram projector: a round copper base with a glass lens in the middle and three curved ceramic arms.` |
| `quantum_fragment` | P2 | `A Quantum Core fragment: a jagged shard of glowing gold-white crystal floating inside a small copper cage, light bending around it.` |
| `resonance_emitter` | P3 | `Alion Voss's resonance emitter: a homemade handheld radio device with a tuning-fork shaped copper antenna, dials and taped wires, glowing rings of sound around the antenna. It looks like a scientific instrument, not a weapon.` |
| `o2_canister` | P2 | `A small oxygen canister: a rounded ceramic bottle with a copper valve and a blue band.` |
| `ore_rocks` | *code* | Claude makes the ore rocks and crystals. |

---

## 9. Textures, skies, icons

### 9.1 Seamless textures: P1 for Jivagraha, P3 others

1:1, at least 1024 × 1024. Save to `art-inbox/textures/<name>.png`. Add this ending:
```
Seamless tileable texture, viewed straight from above, flat even lighting, no shadows, no perspective,
no objects, edges wrap perfectly. Stylised painterly game texture.
```

| World | Files and prompts |
| --- | --- |
| Jivagraha (P1) | `jiva_grass.png` `short soft alien grass, emerald with teal tips, tiny yellow flowers` · `jiva_soil.png` `rich dark brown forest soil with small pebbles and roots` · `jiva_rock.png` `smooth grey-blue rock with moss patches` · `jiva_sandstone.png` `pale peach layered sandstone` |
| Taptashila | `tapta_rock.png` `dark charcoal rock with rust-red streaks` · `tapta_ore.png` `rock with veins of green copper and silver metal` · `tapta_lava_crust.png` `cracked black crust with glowing orange lava in the cracks` |
| Marubhumi | `maru_sand.png` `red-orange rippled sand` · `maru_grass.png` `dry golden savannah grass` · `maru_cracked.png` `cracked dry clay` |
| Himasagara | `hima_ice.png` `blue-white ice with cracks and bubbles` · `hima_snow.png` `soft wind-blown snow` · `hima_seafloor.png` `dark sea floor with glowing specks` |
| Vayumandala | `vayu_islandrock.png` `pearl-white porous floating rock` |
| Vishamegha | `visha_rock.png` `smooth mustard-yellow rock with sulfur crust` · `visha_acid.png` `orange glowing acid puddle surface` |
| Shunyapath | `shunya_dust.png` `fine grey dust with small craters` · `shunya_hull.png` `off-white starship hull panels with copper seams and gold cracks` |

### 9.2 Sky panoramas: P1 for Jivagraha

Wide 2:1 images (for example 4096 × 2048). Save to `art-inbox/sky/<name>.png`. Ending:
```
Equirectangular 360-degree panorama of space for a game skybox, 2:1, seamless left-to-right,
no ground, no horizon, stars evenly spread, no text.
```

| File | Prompt |
| --- | --- |
| `jiva_night_sky.png` (P1) | `Deep violet-blue night sky full of stars, a soft pink and teal nebula band, a large ringed violet gas giant small in one area, two tiny distant planets.` |
| `system_space.png` (P2) | `Open space between planets: dense stars, a golden glowing trail of fragments in one band, a soft orange and blue nebula, the warm sun as a bright point.` |
| `tapta_sky.png`, `maru_sky.png`, `hima_sky.png`, `visha_sky.png`, `shunya_sky.png` (P3) | Same idea; for Himasagara put the huge banded gas giant in the panorama; for Shunyapath, very dark with sharp stars and the golden fragment trail. |

### 9.3 Item and interface icons: P2

1:1, 512 × 512, one icon per image. Save to `art-inbox/icons/<name>.png`. Ending:
```
Game inventory icon: one object centred on a plain dark-violet rounded square, soft rim light,
bold simple shape readable at 64 pixels, no text.
```

Icons needed (file name = item id): `ice`, `iron_ore`, `silica`, `carbon`, `iron_plate`, `o2_canister`, `stone`, `wood`, `biomatter`, `copper_ore`, `aluminium_ore`, `titanium_ore`, `gold`, `diamond`, `water`, `oil`, `hydrogen`, `oxygen`, `methane`, `co2`, `biofuel`, `silicon`, `copper_plate`, `aluminium_plate`, `titanium_plate`, plus one icon per machine in section 6 and per vehicle in section 7.

---

## 10. Key art, store images, video

| File | Priority | Size | Prompt |
| --- | --- | --- | --- |
| `key_art.png` | ✓ | — | Received. |
| `logo.png` | ✓ | — | Received. |
| `store_main_capsule.png` | P2 | 1232 × 706 | `Key art: the astronaut Custodian standing on a tiny curved green planet at sunrise, a giant gentle Root Guardian rising from the glowing forest behind, a lotus-shaped drone beside them, a small spaceship on a launch pad, other planets of the star system in the sky. Leave the top third calm for the game title.` (reference `key_art.png`, `custodian.png`) |
| `store_vertical.png` | P2 | 748 × 896 | Same scene, vertical. |
| `store_header.png` | P2 | 920 × 430 | Same scene, wide, title area on the left. |
| `library_hero.png` | P3 | 3840 × 1240 | Very wide panorama of the star system with the Custodian small in the foreground; no title. |

Claude adds the logo and makes the exact sizes; generate at the closest ratio.

### Video clips (Gemini Veo or similar): P2, for the teaser

Save to `art-inbox/video/<name>.mp4`. 5–8 seconds each, 16:9, no text.

| File | Prompt |
| --- | --- |
| `teaser_pod.mp4` | `Slow push-in on a crashed ceramic escape pod in a glowing alien forest at dawn; the door hisses open with mist; warm light spills out.` |
| `teaser_planet.mp4` | `Camera rises from an astronaut standing on a tiny planet until the whole round green world is visible, with a small base glowing on it, then other planets in the sky.` |
| `teaser_guardian.mp4` | `A gigantic gentle creature made of roots and moss slowly rises from a forest at night, glowing, while tiny lights of a factory twinkle below; awe, not fear.` |
| `teaser_launch.mp4` | `A small ceramic and copper spaceship lifts off from a lotus-shaped launch pad on a tiny green planet, curving up toward a sky full of planets.` |

---

## 11. Turning images into 3D models (GLB)

**Rule: make the turnaround image first (free in Gemini), check it, and only then spend 3D credits.** One good image gives one good model.

### Tools (checked October 2026)

| Tool | Free use | Notes |
| --- | --- | --- |
| **Hunyuan3D (Tencent)**, 3d.hunyuanglobal.com | 20 free generations per day | Best first choice: strong image-to-3D, exports GLB. Start here. |
| **TRELLIS** (Microsoft) on Hugging Face (search "TRELLIS" in Spaces) | Free; uses a daily free GPU quota and you may wait in a queue | Good textured GLB. Try when Hunyuan's daily limit is used up. |
| **Hunyuan3D-2** on Hugging Face Spaces | Free with the same quota limits | Backup. |
| **Tripo** (tripo3d.ai) | Monthly free credits | Clean meshes; has auto-rigging, including some animal skeletons. Free models may need attribution or be non-commercial: check before using in the released game. |
| **Meshy** (meshy.ai) | Monthly free credits | Good for props; same licence check. |

For the released game we need models we are allowed to sell. Hunyuan3D and TRELLIS outputs are generally usable, but **always read the tool's terms** for free accounts, and tell Claude which tool made each model (write it in the upload's commit message, for example "rover.glb made with Hunyuan3D").

### Settings
- Choose **textured** output and **GLB** format. Plain white is fine for machines (Claude paints them); characters, creatures, vehicles and ships need colour.
- If there is a polygon/face option, pick **medium**. Claude reduces the size anyway.
- Limits after Claude's processing: character 40,000 triangles; vehicle 30,000; machine 15,000; small prop 5,000. Bigger files are fine to upload (up to 25 MB); Claude shrinks them.

### Characters: rigging and animation with Mixamo (free, mixamo.com)
1. Upload the character GLB/FBX to Mixamo; place the markers (chin, wrists, elbows, knees, groin).
2. Download each animation as **FBX, With Skin, 30 fps**, one file per clip, and name it after the clip (for example `Talking.fbx`).
3. Put the FBX files in `art-inbox/models/<character>/` (a folder per character, for example `art-inbox/models/huxley/`). Claude merges them with `npm run rig`.

Clips wanted: **Custodian** ✓ plus `Dance` (celebration emote), `Pick Up`, `Typing` (research station), `Climbing` (later). **Huxley:** `Talking`, `Thinking`, `Pointing`, `Idle`. **Alion Voss:** `Idle`, `Talking`, `Waving`, `Walking`, `Lying` (trapped), `Standing Up`. **Humanoid alien people:** `Idle`, `Talking`, `Walking`, `Waving`, `Bowing`.

---

## 12. Music (Suno)

**Direction (from Medhanshu's blueprint):** ambient synth-wave mixed with organic, natural sounds for the alien flora; warm Indian instruments (bansuri flute, santoor, tanpura drone, sitar, tabla) for heart; **industrial, rhythmic layers** for factories that contrast with nature.

**How to make them:**
- In Suno, choose **Instrumental**. Paste the style line into the style box and the description into the prompt.
- Keep **BPM and key exactly as written**: tracks of one world share tempo and key so Claude can layer them (the factory layers play on top of the world music as your factory grows).
- 2–4 minutes each. Download **WAV** if your plan allows, else MP3 (320 kbps). If Suno offers **stems**, download them too.
- Save to `art-inbox/audio/music/<file>.wav`.

| File | Priority | BPM / key | Style line | Description |
| --- | --- | --- | --- | --- |
| `title_theme` | P1 | 80 / D minor | `ambient synthwave, bansuri flute, santoor, warm pads, cinematic, hopeful, instrumental` | `Title music for a game about a lone scientist on tiny living planets: starts quiet with a tanpura drone and soft synth pads, a bansuri melody of wonder, builds gently with santoor arpeggios, ends hanging, mysterious.` |
| `jiva_day` | P1 | 80 / D minor | `ambient, organic synth, santoor, birdsong-like synth chirps, soft hand percussion, calm, instrumental` | `Exploring a lush glowing alien forest in daylight: light, curious, peaceful, loopable, no big climax.` |
| `jiva_night` | P1 | 80 / D minor | `dark ambient synthwave, tanpura drone, glassy bells, soft bansuri, mysterious, instrumental` | `Night on the forest world under an aurora; bioluminescent and a little lonely, loopable.` |
| `jiva_underground` | P1 | 80 / D minor | `dark ambient, deep drones, dripping water textures, distant metallic resonances, instrumental` | `Digging tunnels deep underground, quiet and tense but not scary, loopable.` |
| `factory_layer_1` | P1 | 80 / D minor | `minimal industrial percussion, mechanical clicks, soft analog bass pulse, instrumental` | `A light rhythmic loop of a small factory starting up: ticking, gentle pistons, a soft bass pulse. Must loop perfectly. Sparse so it can play on top of other music.` |
| `factory_layer_2` | P2 | 80 / D minor | `industrial synthwave, tabla mixed with machine hits, pulsing arpeggio, instrumental` | `A busier factory layer: tabla patterns blended with metal hits and a pulsing synth arpeggio; loopable; sits on top of jiva_day.` |
| `factory_layer_3` | P2 | 80 / D minor | `driving industrial synthwave, big drums, sitar riffs, instrumental` | `A large busy factory at full power; energetic and proud; loopable.` |
| `guardian_awake` | P2 | 80 / D minor | `epic ambient, low brass swells, choir pads, deep drums, tanpura, instrumental` | `A colossal ancient creature wakes, restless and sad; awe and tension, never battle music; loopable middle section.` |
| `guardian_calm` | P2 | 80 / D major | `uplifting ambient, choir, bansuri, santoor, warm strings, instrumental` | `The giant creature is calmed and the world heals; a release of tension into warmth, 90 seconds, ends resolved.` |
| `memory_log` | P2 | free / D minor | `sparse piano and pads, tape texture, melancholic, instrumental` | `A soft bed for listening to old recorded messages from a lost scientist; 60 seconds, loopable.` |
| `spaceflight` | P2 | 100 / A minor | `retro synthwave, wide pads, arpeggiated bass, sense of flight, instrumental` | `Flying a small spaceship between tiny planets: freedom, speed and wonder; loopable.` |
| `tapta_day` | P3 | 90 / E minor | `desert rock ambient, deep didgeridoo-like drone, metallic plucks, heat shimmer pads, instrumental` | `A scorching rocky mineral world near the sun; harsh, bright and grand; loopable.` |
| `tapta_night` | P3 | 90 / E minor | `cold ambient, crystalline bells, low drones, instrumental` | `The same world at freezing night; lava glows in the dark; loopable.` |
| `maru_day` | P3 | 95 / C minor | `desert synthwave, sitar, rubab, frame drums, wind textures, instrumental` | `Crossing red dunes and golden savannah with nomad caravans; adventurous and warm; loopable.` |
| `maru_storm` | P3 | 95 / C minor | `tense ambient, swirling noise, deep drums, instrumental` | `A giant sandstorm approaching; urgent but not violent; loopable.` |
| `hima_ice` | P3 | 70 / F# minor | `glacial ambient, glass harmonica, soft choir, instrumental` | `A frozen white moon under a giant gas planet; vast, cold, beautiful; loopable.` |
| `hima_ocean` | P3 | 70 / F# minor | `underwater ambient, whale-like synth calls, sonar pings, warm pads, instrumental` | `The dark hidden ocean beneath the ice with glowing creatures; loopable.` |
| `vayu_reefs` | P3 | 85 / G major | `airy ambient synthwave, wind chimes, flute, soaring pads, instrumental` | `Floating islands in a lavender cloud sea on a gas giant; light and joyful; loopable.` |
| `visha_haze` | P3 | 75 / B minor | `murky ambient, detuned synths, slow tabla, breathy textures, instrumental` | `A toxic yellow cloud world; heavy air, mysterious towers; loopable.` |
| `visha_clean` | P3 | 75 / B major | `hopeful ambient, warm pads, santoor, instrumental` | `The same world after its air is cleaned; hope returns; loopable.` |
| `shunya_wreck` | P3 | 60 / D minor | `sparse dark ambient, distant choir, metallic groans, instrumental` | `Inside the giant crashed starship holding humanity's seeds; silence and weight; loopable.` |
| `ending_harvest` | P3 | 70 / D minor | `bittersweet orchestral ambient, piano, strings, instrumental` | `Humanity's seeds bloom but the living worlds fade to grey; beautiful and sad; 3 minutes.` |
| `ending_covenant` | P3 | 80 / D major | `uplifting orchestral synthwave, bansuri, choir, tabla, instrumental` | `Humans and alien worlds live together in harmony; triumphant warmth; 3 minutes.` |
| `credits` | P3 | 80 / D major | `warm synthwave, santoor, bansuri, instrumental` | `Credits music; a gentle reprise of the title theme; 3 minutes.` |

---

## 13. Sound effects

**Tools:** **ElevenLabs Sound Effects** (elevenlabs.io; free monthly credits; type the prompt, choose the length) or any similar text-to-sound tool. Freesound.org also works, but use only **CC0** sounds and note the link in the commit message.

**Format:** WAV (or high-quality OGG/MP3), short and clean, no music, no voices unless asked. **Loops** must start and end smoothly (say "seamless loop" in the prompt). Save to `art-inbox/audio/sfx/<file>.wav`.

Claude already plays code-made stand-ins for the P1 sounds marked ★; recorded ones will replace them.

### 13.1 Player and suit: P1

| File | Length | Prompt |
| --- | --- | --- |
| `step_grass` ★ | 0.3 s ×4 variations | `soft footstep on short grass, astronaut boot, light` |
| `step_rock` | 0.3 s ×4 | `footstep on hard rock, heavy boot, slight crunch` |
| `step_sand`, `step_snow`, `step_metal` | 0.3 s ×4 each | `footstep on loose sand` / `footstep on crunchy snow` / `footstep on a metal floor panel` |
| `jump` | 0.4 s | `small suit servo whoosh as an astronaut jumps` |
| `land` | 0.4 s | `soft thud landing on ground with suit rattle` |
| `jetpack_start` ★ | 0.5 s | `small jetpack ignition puff` |
| `jetpack_loop` ★ | 3 s loop | `steady soft jetpack thrust hiss, seamless loop` |
| `jetpack_stop` | 0.5 s | `jetpack cutting out with a sputter` |
| `o2_low` ★ | 1 s | `gentle two-tone suit warning beep, calm` |
| `breath_low` | 4 s loop | `astronaut breathing heavier inside a helmet, seamless loop` |
| `blackout` | 2 s | `suit powering down, soft electronic fade` |
| `helmet_lamp` | 0.2 s | `small click of a helmet lamp switching on` |
| `canister_breathe` | 1 s | `oxygen canister hiss into a helmet` |

### 13.2 Laser and mining: P1

| File | Length | Prompt |
| --- | --- | --- |
| `laser_start` | 0.4 s | `sci-fi mining laser powering up, warm hum rising` |
| `laser_loop` ★ | 3 s loop | `steady sci-fi mining laser beam hum with crackle, seamless loop` |
| `laser_stop` | 0.4 s | `mining laser powering down` |
| `laser_hit_rock` | 3 s loop | `laser burning into rock, sizzling and crumbling, seamless loop` |
| `laser_hit_crystal` | 3 s loop | `laser on ice crystal, glassy singing and cracking, seamless loop` |
| `dig_chunk` ★ | 0.5 s ×3 | `a chunk of soil and stone breaking away` |
| `ore_pop` | 0.4 s | `mineral chunk popping free with a sparkle` |

### 13.3 Pickups, crafting, building, UI: P1

| File | Length | Prompt |
| --- | --- | --- |
| `pickup` ★ | 0.3 s | `soft pleasant item pickup chime` |
| `pickup_rare` | 0.6 s | `sparkly rare item pickup chime` |
| `backpack_full` | 0.5 s | `soft low denied buzz` |
| `craft_done` | 0.7 s | `satisfying crafting complete sound, small mechanical clunk then chime` |
| `place_machine` ★ | 0.8 s | `heavy machine set down on ground, thud with metal settle` |
| `pickup_machine` | 0.6 s | `machine folding up with servo whirr` |
| `place_invalid` | 0.3 s | `short soft error blip` |
| `rotate` | 0.2 s | `small ratchet click` |
| `ui_click` ★ | 0.1 s | `soft UI click` |
| `ui_hover` | 0.1 s | `very soft UI tick` |
| `ui_open`, `ui_close` | 0.3 s | `soft whoosh of a menu panel opening` / `closing` |
| `goal_complete` ★ | 1.2 s | `rewarding goal complete jingle, bells and soft synth, short` |
| `goal_new` | 0.8 s | `gentle notification for a new objective` |
| `save` | 0.5 s | `soft confirmation tone` |

### 13.4 Machines (loops): P1 for Chapter 1 machines, P2–P3 others

All 4–6 s, `seamless loop`.

| File | Prompt |
| --- | --- |
| `electrolyzer_loop` | `water electrolysis machine bubbling with a soft electric hum` |
| `smelter_loop` | `small furnace roaring with crackling heat and occasional metal clink` |
| `solar_lotus_open` | `mechanical petals unfolding smoothly, 2 seconds, not a loop` |
| `battery_hum` | `low steady electrical hum of a battery charging` |
| `auto_drill_loop` | `mining drill grinding into rock with rhythmic thumps` |
| `conveyor_loop` | `light conveyor belt rattling and rolling` |
| `research_loop` | `computer terminal soft beeps and data chirps` |
| `coal_burner_loop` | `coal fire generator chugging and puffing` |
| `refinery_loop` | `industrial refinery rolling mills and hissing steam` |
| `liquid_drill_loop` | `nodding pump jack creaking and gurgling oil` |
| `fuel_processor_loop` | `fermentation tank bubbling thickly with a pump` |
| `power_station_loop` | `turbine spinning with deep hum` |
| `windmill_loop` | `wind turbine blades whooshing slowly` |
| `geothermal_loop` | `steam vent rumble and hiss with heat exchanger hum` |
| `power_out` | `power failure, machines winding down, 2 seconds, not a loop` |
| `power_on` | `power restored, machines spinning up, 2 seconds, not a loop` |
| `needs_attention` | `soft mechanical sputter and a small alert chirp, 1 second, not a loop` |

### 13.5 Creatures and Guardians: P2 (Jivagraha), P3

None of these should sound violent: curious, shy, proud, sad.

| File | Prompt |
| --- | --- |
| `creature_jiva_chirps` | `small alien forest creatures chirping and cooing, gentle, 5 s` |
| `creature_jiva_night` | `alien night insects and soft hoots, seamless loop, 6 s` |
| `rock_crab_scuttle` | `rocks clattering as a hidden crab scuttles away, 1.5 s` |
| `szynthar_howl` | `distant proud howl of a pack animal, echoing over a desert, not aggressive, 3 s` |
| `szynthar_run` | `pack of animals running on sand with panting, 3 s` |
| `grazer_call` | `deep gentle mooing call of a large alien grazer, 2 s` |
| `guardian_stir` | `huge deep rumbling creature call like a whale under the ground, sad and immense, 5 s` |
| `guardian_calm` | `huge creature sighs peacefully, deep warm hum fading into chimes, 5 s` |
| `resonance_tone` | `high-frequency humming tone with shimmering rings, calming, 2 s` |

### 13.6 Vehicles and ships: P2 (rover, starter ship), P3

| File | Prompt |
| --- | --- |
| `rover_loop` | `small electric rover driving over rough ground, whine and bumps, seamless loop 5 s` |
| `rover_start` | `electric vehicle powering on, 1 s` |
| `truck_loop` | `heavy electric truck rumbling, seamless loop 5 s` |
| `buggy_loop` | `fast light buggy whizzing over sand, seamless loop 5 s` |
| `heli_loop` | `helicopter rotor thump with soft engine, seamless loop 5 s` |
| `sub_loop` | `submarine engine hum underwater with bubbles, seamless loop 5 s` |
| `sonar_ping` | `underwater sonar ping with echo, 2 s` |
| `ship_ignite` | `small rocket engine igniting with a roar building up, 3 s` |
| `ship_thrust_loop` | `spaceship main engine thrust rumble, seamless loop 5 s` |
| `ship_rcs` | `short puff of a spaceship manoeuvring thruster, 0.3 s` |
| `ship_land` | `landing thrusters then heavy touchdown and hydraulic settle, 3 s` |
| `ship_dock` | `docking clamps locking with metal clunks and air hiss, 2 s` |
| `fuel_low` | `cockpit low fuel warning chime, calm, 1 s` |

### 13.7 Ambience (loops, 20–30 s): P1 for Jivagraha, P3 others

| File | Prompt |
| --- | --- |
| `amb_jiva_day` | `alien forest daytime ambience: gentle breeze in leaves, distant soft bird-like calls, seamless loop` |
| `amb_jiva_night` | `alien forest at night: insects, soft glowing hum, faint wind, seamless loop` |
| `amb_cave` | `underground cave: water drips, faint echoes, low rumble, seamless loop` |
| `amb_tapta` | `hot rocky world: dry wind, distant lava bubbling and rock cracks, seamless loop` |
| `amb_maru` | `desert savannah: warm wind, grass rustle, distant animal calls, seamless loop` |
| `amb_maru_storm` | `sandstorm: roaring wind full of sand, seamless loop` |
| `amb_hima_ice` | `frozen world: icy wind, ice creaking and cracking, seamless loop` |
| `amb_hima_ocean` | `deep underwater: low hum, distant whale-like calls, bubbles, seamless loop` |
| `amb_vayu` | `high cloud sea: strong airy wind, distant thunder, wind chimes, seamless loop` |
| `amb_visha` | `toxic cloud world: heavy hissing rain, fizzing acid, muffled wind, seamless loop` |
| `amb_shunya` | `airless dead world heard through a suit: near silence, faint radio crackle, own breathing, seamless loop` |
| `amb_space` | `inside a small spaceship cockpit in space: soft hum, beeps, seamless loop` |

### 13.8 Story: P2

| File | Prompt |
| --- | --- |
| `cryo_open` | `cryo-sleep pod hissing open with mist and warning beeps, 3 s` |
| `hologram_on` | `hologram flickering on with a digital shimmer, 1.5 s` |
| `hologram_off` | `hologram collapsing off, 1 s` |
| `translator_on` | `small device activating with a rising musical chirp, 1 s` |
| `memory_log_open` | `old data recording starting with tape-like crackle, 1 s` |
| `fragment_hum` | `glowing crystal humming with deep, warped resonance, seamless loop 5 s` |
| `distress_signal` | `distant radio distress signal, broken beeps in static, 4 s` |

---

## 14. Voices (Sarvam AI)

Sarvam AI has text-to-speech voices for Indian English and Indian languages (its **Bulbul** voices). We use it for **SARATHI** first. Other characters come later when their scripts are final.

**Process:**
1. **Now (task T-005):** test voices. Generate the 5 test lines below in 3–4 different voices in **Indian English**, and 2 of them in **Hindi** and **Marathi**. Upload to `art-inbox/audio/voice/tests/` named `sarathi_test_<voice>_<n>.wav`. The Commander and Claude pick one voice.
2. **Later:** when the Director marks a script as final in `src/data/`, generate every line with the chosen voice. File names come from the line's id, for example `sarathi_goal_ice.wav`.

**SARATHI's voice:** calm, warm, precise, a little dry humour; sounds like a helpful ship AI, not a robot. Medium pace.

Test lines:
1. `Oxygen at sixty percent. The forest is beautiful, but it will not breathe for you.`
2. `Ice detected in the blue crystals. Hold the laser on them. Gently. They have been waiting a long time.`
3. `Shelter air restored. You may now take off your worried expression.`
4. `Something very large just moved beneath us. I would like it noted that I am not worried. I am merely recalculating.`
5. `Custodian, the seeds are still safe. So are you. That is two good things.`

**Later voices:** Prof. Orion Huxley (older man, warm, tired, thoughtful); Alion Voss (spoken in an invented alien language; Claude will write the sounds, and the translator's English subtitles appear on screen); alien people (short greetings in invented languages).

---

## 15. Upload checklist

Before you click **Commit changes**, check:
- [ ] The file name is exactly as written here (lowercase, underscores, no spaces).
- [ ] It is in the right folder.
- [ ] Images: no text, no letters, no strange extra fingers or melted shapes.
- [ ] 3D: the commit message says which tool made it.
- [ ] Sound and music: the commit message says which tool made it.
- [ ] Nothing violent: no weapons, blood, injuries or fighting.

After you upload, tell Claude in the chat (for example "uploaded rover and 5 textures"). Claude checks them, puts them in the game and reports back in [STATUS.md](STATUS.md).

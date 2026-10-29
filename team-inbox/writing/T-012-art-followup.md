# T-012 follow-up: cultural review of the art that has arrived

**Delivery note**

- **Not a new task.** T-012 reviewed the *prompts*. This reviews what the prompts actually produced: the concept art in `art-inbox/concept/` that the game is now being built from. Nobody had looked at the output, and the output is where a prompt can fail.
- **What I looked at (14 images):** `jiva_surface_day`, `jiva_healthy`, `jiva_creatures`, `guardian_root`, `guardian_magma`, `guardian_ice`, `guardian_storm`, `custodian`, `huxley`, `sarathi`, `quantum_core`, `shunya_surface`, `vayu_surface`, `tapta_surface`. I have not seen `jiva_orbit`, `jiva_polluted`, `jiva_underground`, the `hima_*`, `tapta_orbit`, `vayu_orbit`, `shunya_orbit` images or the textures and sky, so this is not a complete pass. Send me the rest and I will finish it.
- **What I can judge:** whether an image contains a religious form, a stereotype, a wrong motif, a fake script or a cliché. **What I cannot judge:** how it looks in the engine, at what size, or how it animates. Those stay with the Director.
- **The verdict is mostly good news.** This art is better than most game art that claims to be Indian: the Custodian's armour, Huxley's room and the Quantum Core are genuinely Indo-futurist rather than Indian-flavoured. Two things should be fixed before more art is made in the same direction, because they are already spreading; everything else is a small edit.

---

## 1. The two things I would fix first

### a) The Root Guardian has a human face

`guardian_root.png` shows a giant root creature with a **bearded old man's face** carved into the top of its trunk: eyes, brow, nose, a moustache of moss, looking down at the player.

This is the one finding in this review that I would call a real problem, for three reasons that all point the same way:

1. **It makes a god out of a natural phenomenon.** A tree with a human face is, to an Indian eye, a *vanadevata* or a tree spirit: something to be revered, not a system of a planet. The GDD is careful that Guardians are "born from the Quantum Core's energy", "the planet's immune system", and are calmed rather than worshipped. A face moves the Guardian into the category the rules say to stay out of.
2. **It cannot be built.** GDD §12 says Guardian bodies are built procedurally from root growth and splines, in code. A specific human face is not procedural geometry; it is a sculpt. When the Director builds Mooladri, the face will have to go anyway.
3. **It dates the design.** A bearded tree-man reads as the Ents, or as Groot, before it reads as Corebound.

**Suggested fix:** no face. The "head" becomes a crown of root tips, with the glow concentrated there, and the creature's attention shown by the direction it leans and where the glow travels. If a focal point is needed for the camera, a hollow or a knot of roots works. This also makes the model far easier to build and animate.

### b) Kalash-style finials on the domes

Two images have a **pointed pot-finial on top of a dome**: `shunya_surface.png` (on the wreck's small dome) and `guardian_storm.png` (on the domed pavilion at the right edge). That finial is a *kalash*, the pot-and-spike that crowns a temple or a shrine.

This is exactly what T-012 §1.1a predicted would happen when a prompt says "arched domes" without a negative line: the generator reaches for temple vocabulary. It is a small shape and an easy fix, and it matters because it appears on the game's *first* impression of a crashed human ship, where no ritual form belongs at all.

**Suggested fix:** a plain rounded cap, a ring, a bolt-head or nothing. Add to the style bible's negative line: `no kalash pot finials, no temple finials, no spire ornaments`.

---

## 2. Every finding, in one table

Priority: **P1** = fix before more art is made in that direction, **P2** = fix when that asset is next touched, **P3** = note only.

| Image | What I see | Risk | Suggested fix | Priority |
| --- | --- | --- | --- | --- |
| `guardian_root` | Humanoid bearded face in the trunk | Reads as a tree deity; unbuildable in code; reads as an Ent | Faceless; crown of root tips; glow carries the attention | **P1** |
| `shunya_surface` | Kalash-style finial on the wreck's dome; a blind arch doorway | Temple vocabulary on a human starship | Plain cap; keep the arch but make it a shallow segmental arch | **P1** |
| `guardian_magma` | A bright golden **feather crest / crown** on the serpent's head, and a cobra-like hood | A crowned serpent reads as a **naga** — Shesha or Vasuki, figures of worship — and the crown reads as a *mukut* | Replace the crest with **cooled-lava spines or plated ridges** in the same silhouette; keep the eyes and the glowing seams | **P1** |
| `guardian_storm` | An eagle-like bird with a crest and a flame-like tail; Gothic pointed arches with tracery on the floating islands; a domed pavilion with a finial | The bird reads as **Garuda** (the eagle of Vishnu) or a phoenix before it reads as a storm bird; the pointed arches read **European/Islamic**, not Indo-futurist | Bird: blunt the beak, drop the crest, make the tail a swept cloud rather than flame. Arches: shallow **cusped** or **post-and-lintel with brackets**, as in a chhatri | **P1** for the arches, **P2** for the bird |
| `vayu_surface` | An arcade of **pointed ogee arches**; jaali panels inside them; crystal-leaved trees; the Custodian with glass wings | The arcade reads Moorish/Andalusian. The jaali panels are right; the arch shape around them is not | Same as above: shallow cusped arch, or a trabeated arcade. Keep the jaali | **P2** |
| `jiva_surface_day`, `jiva_healthy` | Glowing lotus blooms sitting on **carved stone pedestals**, petals fanned like an offering | A lotus on a plinth reads as an **offering at a shrine**, which is the one reading to avoid for a flower | Grow the blooms **from moss, soil or a rock crevice**, not from a carved base; no pedestal under a flower | **P2** |
| `quantum_core` | A golden orb with jaali lattice bands — genuinely beautiful — inside a dark hall, with tiered lotus-petal forms at the top and the astronaut centred below looking up | The composition is a **sanctum**: glowing golden object, dark shrine-hall, small figure at the bottom. The petal tiers at the top read as a **crown/mukut** | Keep the orb and the jaali. Open the top into a **ring** rather than a closed petal crown; move the astronaut **off-centre**, side-on, working rather than gazing. Awe by engineering, not veneration | **P2** |
| `sarathi` | Three variants: brass/gold body with ceramic petals, jaali lattice panels, copper pipes. Variant 1 has a **floating cartoon face**; variants 2 and 3 have glowing rings | The face makes a ship AI into a character with an age and an ethnicity, and reads a little like an emoji. Also the body is **brass/gold**, while the style bible says off-white ceramic and copper | Rings over the face (variants 2 and 3) — they read as a ship, not a mascot. Bring the body back to off-white ceramic so SARATHI matches the shelter and the Custodian | **P3** |
| `custodian` | Cream ceramic armour with copper trim, a jaali chest panel, floral engravings on the shoulders, a lotus emblem, a **pistol-shaped handheld laser** | The armour is exactly right and needs no change. The laser tool reads as a **handgun**, which is a brand problem for a game whose first rule is no weapons | Reshape the tool: a **torch, lamp or short drill** silhouette — a barrel with a lamp ring, no pistol grip, no trigger guard | **P2** |
| `huxley` | A kind older man, grey beard, round glasses, cream coat, lotus emblem, in a rounded ceramic room with a jaali window | Nothing religious; the room is the best Indo-futurist interior in the set. Note only: he reads as possibly Indian and possibly Mediterranean, which is fine, but the hologram treatment should not make him look like a **sage or a guru** | Keep. When the hologram shader is added, keep him lit like a **recording of a colleague**, not like an apparition | **P3** |
| `guardian_ice` | A whale-like leviathan of blue ice, one glowing eye, baleen tendrils, a submarine for scale | Nothing. Faceless, gentle, vast, and the scale reads correctly | None | — |
| `jiva_creatures` | A moss-backed grazer, a jellyfish, a burrowing armadillo-like creature, a small green bird | Nothing. All four read as animals, not as mascots or caricatures | None | — |
| `tapta_surface` | Lava canyon, basalt columns, yellow sulfur crystals, a tracked rover with jaali panels, a large ringed planet in the sky | Nothing cultural. See section 5 for the astronomy note | None | — |

---

## 3. What is right, so it is not "fixed"

It is worth saying plainly which choices are good, because a review that only lists faults invites a pass that breaks the good parts.

- **The Custodian's armour is the best asset in the set.** Off-white ceramic, copper bands, a jaali panel in the chest, a woven lattice on the backpack vents, a small lotus emblem as a *badge* rather than an ornament. It is Indian by engineering detail, not by costume. Do not add a turban, a shawl, a bindi or a sacred thread to it.
- **Huxley's room is the second best.** A round ceramic interior with a carved jaali window, a stone shelf of glassware, glowing plants in pots, a desk lamp. It reads as a place where a scientist works, in a culture that carves screens. This is what the whole game should look like.
- **The Quantum Core's jaali bands** are the single most elegant use of the motif in the set: a lattice doing structural work on a glowing object. The only problem is the composition around it (section 2), not the object.
- **SARATHI's lattice panels** are jaali done right: the lattice is a vent, because a drone needs to breathe.
- **`jiva_surface_day`** is a strong hero image: mushroom trees, a banyan with hanging glowing roots, banded sandstone, cream grazers, a domed shelter. It sells the game in one look.
- **No fake script anywhere.** Not one image in the set contains invented writing, which was my biggest single worry in T-012. When the `translator` prop is made, keep it that way.
- **No deity, no shrine, no ritual object, no stereotype** in any of the fourteen images. The two problems above are a face and a finial, not an intention.

---

## 4. Housekeeping: the generator's corner star is still there

Seven of the fourteen images carry a small white four-pointed **sparkle in the bottom-right corner**: `guardian_magma`, `guardian_ice`, `guardian_storm`, `vayu_surface`, `huxley`, `quantum_core`, `shunya_surface`.

That is the image tool's own watermark. The Director already strips it from textures automatically. It needs the same treatment on any concept art used **in the game or in the store**: `quantum_core` and `shunya_surface` are obvious Codex and loading-screen candidates, and the store capsules are the images most people will ever see. A watermark in the corner of a store page is a review problem on its own.

Two suggestions: strip it on the way in, as with textures; and crop or reframe `quantum_core` and `shunya_surface` for use, which also solves the composition notes in section 2 at the same time.

---

## 5. Two notes that are not cultural, but that I noticed and would rather say

1. **The ringed gas giant is in the wrong skies.** It appears large in `tapta_surface` and in the Jivagraha images. Vayumandala is the *outermost* giant and Taptashila is the *innermost* world, so from Taptashila it should be a small disc at most, not a dominant planet. The GDD does say the system is compressed so worlds look close, so this may be a deliberate choice; if it is, ignore me. If it is not, `tapta_surface` is the one to repaint, since it is the least plausible.
2. **The storm bird's silhouette is doing double duty.** The same crest-and-flame-tail shape is the standard phoenix, and phoenixes are on a great many game covers. Beyond the Garuda point in section 2, a storm bird that is *made of cloud and lightning* rather than *a bird with lightning on it* would be more Corebound and less familiar. That is a design opinion, and it goes to the Director.

---

## 6. If the Director wants this to continue

- Send the nine images I have not seen (the orbits, `jiva_polluted`, `jiva_underground`, the `hima_*` set) and I will add them to this file rather than write a second one.
- The same pass should be run on `art-inbox/turnaround/` before the Custodian and Huxley models are rigged, because a face or an ornament is much cheaper to change in a concept than in a mesh.
- When Vishamegha's art arrives, watch for the two things this world invites: **breathing masks that look like ritual masks**, and **thewa or meenakari ornament tipping into jewellery**. Masks should read as equipment, worn for air.

---

## 7. T-024: the rest of the concepts, the two new characters, and the Custodian turnaround (29 October)

**Delivery note**

- **Task:** T-024. One table row per image or model asked for: the four new concepts of 29 October, the two new 3D characters, the ten world concepts I had not seen, and the Custodian turnaround. Nineteen rows.
- **What I saw:** all nineteen, at full size. I also re-read the style bible in `docs/PROMPTS.md` §2, which now carries the lines the Director added after §1 and §2 of this file.
- **The headline is mixed.** The two fixes I asked for in §1 were made: **the Root Guardian has no face**, and the style bible now forbids kalash finials, flowers on plinths, pointed arches and gun-shaped tools. That is real progress and the Guardian's crown of root tips is better than anything I proposed. **But three of those four new rules are already broken in the newest art**, in the two characters and in four of the fourteen images. The rules are right; they are not yet reaching the prompt.
- **Two new findings, both on the characters:** Huxley's hologram is posed like a *darshan*, and SARATHI's brass lotus bud reads as a lamp kept at a shrine. Those are §7.2 and rows 16 and 17 in the table.
- **Nothing edited by me.** Every fix below is a wording the Commander can paste into one new prompt.

---

### 7.1 What to fix first

**a) The Root Guardian has lost his face but kept his body.** This is the one thing I would change before the model is built, because it is the one thing that is expensive later.

The head is now a smooth crown of glowing root tips, and it works: it reads as attention without a face, and the glow does the work a face was doing. Keep it exactly. The problem is below the neck. The creature is a **muscular humanoid**: deltoids, pectorals, a narrow waist, two arms ending in five-fingered hands, two legs. It reads as Groot, or as an Ent, before it reads as a planet's immune system.

Two reasons this matters more than taste:

1. **GDD §12 says Guardian bodies are "built and animated procedurally (root growth, spline-driven serpent/leviathan bodies)".** Shoulders, pectorals and fingers are not procedural root growth; they are a sculpt. When Mooladri is built, the body will have to be simplified anyway, and it is cheaper to decide now what it simplifies *to* than to discover it at rigging time.
2. **A human body implies a human mind.** The GDD is careful that Guardians are the planet answering, not characters with intentions. A chest and a pair of hands make the player expect a personality, and then the calm-down sequence has to deliver one.

**Suggested fix:** a **buttressed trunk** rather than a torso. A wide flaring base of root buttresses, a tapering mass above it, branch-limbs that split into root-clusters instead of hands, and no shoulders and no chest. The crown of glowing tips stays. Where the camera needs a focus, the glow in the crown and the direction of the lean are enough.

**b) The palms.** In `guardian_root_restless` the glow runs along the limb seams, which is right, and then pools in **both open palms**, which are raised towards the player. Raised, glowing, open hands read as an attack being charged, in a game whose first rule is that nothing is ever attacked. **Fix:** keep the glow in the seams and the roots, and let the palms stay closed or turned down. The restlessness is already carried by the drifting rocks and the scattering animals, which are excellent.

**c) The shrine vocabulary is back on Shunyapath.** `shunya_orbit` shows three or four small **white domes with pointed caps**, and two or three **arched gateway ruins**, on the surface of the dead wreck world. A dome with a pointed cap and a ball on top is a *kalash*, and an arch standing on two piers is a *torana*: between them, the surface of Shunyapath reads as a small town of shrines and tombs. The style bible forbids both, in the lines added this week.

This is also a story problem: Shunyapath is "a dead world with the biggest wreck" (GDD §13). What should be on it is **the wreck**: hull plates, ribs, a broken spine of a ship, airlocks, a drill pod. Not buildings.

**d) Flowers are back on plinths.** Three times, in the newest batch: `jiva_surface_night` has lotus pads sitting in **carved stone basins** and a bright bloom on a stepped stone base; `hima_surface` has the **Solar lotus** machine raised on a stepped plinth, its petals fanned upward like an offering; `jiva_crash_site` has two blooms glowing on flat rock slabs with a halo, which is borderline but reads as an altar.

The Solar lotus is the difficult one, because it is a *machine* and a machine needs a base. My suggestion: **make it a low array, not a flower on a stand.** Petal-shaped panels lying almost flat, in two or three rings, mounted directly on the ground or on a rock face, with the glow coming from the gaps between panels. A solar panel that is *made of petal-shaped panels* is engineering; a lotus on a plinth is an offering.

**e) Pointed arches are back** in `hima_surface` (the shelter's doorway is a tall ogee arch), in `vayu_orbit` (the island gateways), and in `shunya_orbit`. The rule is in the style bible and it is not holding. The fix is the same each time: **a shallow segmental arch, a cusped arch, or a flat lintel on two brackets**. In the ice world the doorway is the strongest silhouette on the building, so it is worth one repaint.

---

### 7.2 The two new characters

**Huxley.** The model is good. An older man, cream coat, round glasses, boots, 0.95 m tall, 40,000 triangles, five clips: exactly what the GDD asked for, and nothing on him is religious. Two notes:

- **The idle pose.** In the front and side views his hand is raised, palm up, fingers slightly curled, at chest height. That is very close to the hand position of a *blessing*: an Indian player will read it as one, especially once he is a glowing figure in a dark room. Give the idle clip something to do with the hands: a tablet, a pen, hands at his sides, hands behind his back. Palms-up is the one gesture to avoid for this character.
- **The lotus emblem** on the chest reads correctly: small, flat, a badge rather than an ornament. Keep it small. If it ever grows, it becomes a sect mark, and Huxley is a scientist, not a teacher.

**The hologram.** This is the finding of the batch. `huxley_hologram.jpg` shows him **standing upright, both arms spread wide, palms open and up, inside a column of light**. Everything about that composition is a *darshan*: a figure appearing in a niche of light, arms open, to be beheld by a smaller figure below. It is the single most recognisable religious composition in Indian visual culture, and it has arrived by accident, because "hologram" in most image models means exactly this.

For a game whose story is "a guilty scientist left recordings", it is also the wrong story: a man in a shaft of light is a sage or a spirit, and Huxley is a colleague who is not there any more.

**Suggested fix, one prompt:**
> "Hologram of an older scientist recorded at a desk, seated or standing half-turned, mid-sentence, one hand resting on the desk, looking slightly off-axis to camera; blue-gold scan lines and a soft flicker at the edges; he is projected from a small round emitter on the desk, not from a column of light; no halo, no glow behind the head, no symmetrical pose."

That also solves a technical problem: a seated, off-axis figure needs no special "apparition" shader, just a scan-line material.

**SARATHI.** The concept's smiling face is gone, replaced by rings of light, and that was the right call. The jaali panels are still right. Three problems remain, and one of them is new:

1. **The body is brass, all of it.** The style bible says technology is "off-white ceramic, polished copper and brass". The Custodian and the shelter are ceramic with copper trim; SARATHI is solid gold-coloured metal. At 0.48 m, next to a ceramic shelter, it reads as a **brass object**, and brass objects in an Indian house are kept for one purpose.
2. **The bud on three stub feet reads as a lamp.** A rounded brass vessel with a flared opening, petals around the mouth, and three little feet is a *diya* or a *samai*, the oil lamp on a stand. The cracked petal is a lovely detail, but it does not undo the silhouette.
3. **The petal tips are pointed and rise past the rim**, which in silhouette is a **crown** (*mukut*): a flared base, a jewelled band and points above it. Two of the three variants have this.

**Suggested fix, one prompt:**
> "SARATHI, a small floating drone the size of a football, off-white ceramic shell with copper trim and jaali lattice vents; a lotus-bud silhouette with blunt, rounded petal panels that stop level with the rim, one panel cracked and slightly displaced; glowing cyan light from inside the vents and a ring of light above the opening; no feet, it hovers on a soft glow; no pointed tips, no crown, no gold body."

Keep the crack, keep the jaali, keep the rings of light. Those three are the character.

**In the game** (`sarathi_in_game.jpg`), the drone is dark and small against a bright meadow and reads as a brown lump. The off-white ceramic fix solves this too: it will separate from the green.

---

### 7.3 Every image, in one table

Priority: **P1** = fix before more art or models are made in that direction, **P2** = fix when that asset is next touched, **P3** = note only.

| # | Image or model | What I see | Risk | Suggested fix | Priority |
| --- | --- | --- | --- | --- | --- |
| 1 | `concept/guardian_root.png` | Faceless ✓. Crown of glowing root tips ✓. But a muscular humanoid body: deltoids, pectorals, five-fingered hands, two legs. Mushrooms and ferns growing on the shoulders. | Reads as Groot or an Ent; a human body implies a human mind; not buildable as procedural root growth (GDD §12) | Buttressed trunk, branch-limbs ending in root-clusters, no shoulders, no chest, no fingers. Keep the crown exactly | **P1** |
| 2 | `concept/guardian_root_restless.png` | The same body, glow running along the limb seams, rocks drifting, birds and small animals scattering, embers rising | The glow pools in **both raised open palms**: reads as a charge-up attack in a game with no attacks | Glow in the seams and roots; palms closed or turned down. Keep the scattering animals, they are the best part | **P2** |
| 3 | `concept/jiva_crash_site.png` | The escape module on its side: ceramic belly, copper bands, a jaali hexagon panel, an open hatch, a flared copper pipe, smoke. Glowing mushrooms and two blooms on rock slabs | The rounded belly and narrow neck read as a **matka**, a water pot, and a pot on its side with a mouth is close to an urn; the flared copper pipe reads as a small conch or a bell mouth; the two blooms sit on flat slabs with halos, close to an altar | Flatten one side, add landing legs and a hatch frame, square off the pipe end into a duct. Move the blooms to grow out of moss, not from under a halo | **P2** |
| 4 | `concept/system_overview.png` | Sun, then lava world, living world, red rocky world, yellow cloud world, purple ringed giant with a small blue-white moon beside it, a grey cratered world, and a bright golden asteroid belt | Nothing cultural. The layout is **correct**: Himasagara as a moon of Vayumandala, Shunyapath as the grey world. The belt reads as golden glitter or confetti rather than rock | Belt: grey-brown angular chunks, less sparkle. Strip the corner watermark (§7.5) | **P3** |
| 5 | `concept/jiva_orbit.png` | A small living world: green forest, banded sandstone, teal rivers, scattered cyan glows, a white polar cap, a thin bright ring, Vayumandala large at the upper right | Nothing. It is the best of the orbits: it reads as small, alive and 150 metres thick | None | — |
| 6 | `concept/jiva_surface_night.png` | Aurora, glowing mushroom trees, a banyan with hanging glowing roots, glowing grazers, blue crystals, a stone path to a small shelter, lotus pads in **carved stone basins** | The pads in carved basins and the bloom on a stepped base are **flowers on plinths**, which the style bible now forbids | Let the pads sit in still water or moss at ground level; no basin, no stepped base | **P2** |
| 7 | `concept/jiva_polluted.png` | Dead trees with claw branches, brown water, haze, two smoking machine domes with red-lit grilles and chimneys, a conveyor of ore, a broken valve | Nothing cultural. Note only: a dome with a glowing red mouth reads faintly as an oven, which is arguably right for a shelter gone bad | None | — |
| 8 | `concept/jiva_underground.png` | Root-lined cavern, glowing roots, red iron veins, blue crystals, pale fan-shaped growths, magma glow below, the astronaut on a ledge with a headlamp | One smooth semicircular arch on the left reads as a **built doorway** in a natural cave | Make that opening irregular rock, not a true arch | **P3** |
| 9 | `concept/hima_orbit.png` | A cracked ice world, dark blue channels, dark rock outcrops with orange ore, a green aurora plume at the pole | The aurora rises like a **flame plume** off an ice world | Make it a curtain, flat and wide, rather than a rising plume | **P3** |
| 10 | `concept/hima_surface.png` | Frozen waves, ice spires, a vent with warm smoke, aurora, a ceramic dome with a **tall pointed doorway**, a jaali light band, a chimney, and the **Solar lotus on a stepped plinth** | The doorway is a pointed ogee arch (forbidden); the Solar lotus on a plinth is a **flower on a stand**, and reads as a temple lamp | Doorway: shallow segmental or cusped arch. Solar lotus: a low array of petal-shaped panels lying nearly flat on the ground | **P2** |
| 11 | `concept/hima_underwater.png` | Under-ice ocean, light shafts, green and blue jellyfish, coral-like growths, glowing vents, a small submarine with a domed canopy and two lamps, the pilot visible | Nothing. The jellyfish are Tarakajala, "star-water", and they read as gentle animals | None. Optional, not cultural: they are very close to Earth jellyfish; a ring of lights instead of tentacles would make them Corebound's own | — |
| 12 | `concept/tapta_orbit.png` | Black basalt plates, orange lava seams, smoke plumes, a red atmospheric glow, clusters of **yellow crystals**, a tiered jaali structure on the lower limb | The sulfur crystals are shaped like **leaves or petals in a rosette**, so they read as yellow foliage on a lava world | Make the clusters angular prisms and needles, not fanned leaves | **P3** |
| 13 | `concept/vayu_orbit.png` | A storm giant with lightning, ringed by floating cloud-reef islands carrying white domes, cyan plants and **arched gateways**, with small knobs on the dome tops | The gateways read as **torana** (temple gates); the knobs on the domes read as finials | Gateways: flat lintel on two brackets. Domes: plain rounded cap, no knob | **P2** |
| 14 | `concept/shunya_orbit.png` | A grey cracked world with golden seams and craters, and on the surface **three or four white domes with pointed caps and balls**, plus two arched ruin-gateways | Dome + pointed cap + ball is a **kalash**; an arch on two piers is a **torana**. Together they make a town of shrines and tombs. Also wrong for the story: this world should be the wreck | Replace the domes and gateways with **wreck**: hull plates, ribs, a broken ship's spine, an airlock, a drill pod | **P1** |
| 15 | `docs/review/2026-10-29/huxley_model.jpg` | Rigged model, four views, cream coat, glasses, grey beard, boots, 0.95 m, 40k triangles, five clips. The lotus badge on the chest is small and flat ✓ | Nothing religious. One note: the idle hand is raised palm-up at chest height, close to a **blessing** gesture | Give the idle clip something to hold or do: hands at his sides, behind his back, or on a tablet | **P2** |
| 16 | `docs/review/2026-10-29/huxley_hologram.jpg` | A blue-gold hologram standing **upright, both arms spread, palms open and up**, inside a column of light, with a disc at his feet | This is a **darshan**: a figure in a niche of light to be beheld. Reads as a sage or an apparition, not a recording | Project him from a desk emitter, seated or half-turned, mid-sentence, hands at rest, off-axis; scan lines and edge flicker; no column of light, no halo | **P1** |
| 17 | `docs/review/2026-10-29/sarathi_model.jpg` | The lotus-bud drone in four views: **solid brass**, jaali panels, a cracked petal ✓, a lens ring, three stub feet, petal tips pointed and rising past the rim | All-brass bud on three feet reads as a **diya** or a brass lamp; the pointed tips read as a **crown**; brass is the metal of household ritual | Off-white ceramic body, copper trim only, blunt petals level with the rim, hover on a glow instead of feet. Keep the crack, the jaali and the lens | **P2** |
| 18 | `docs/review/2026-10-29/sarathi_in_game.jpg` | The drone in-engine at the left, the shelter dome on the right, HUD, a dark blue flower on the grass, the Custodian's backpack in the foreground | Nothing cultural. The drone is dark against the bright meadow and reads as a lump; the dark blue flower does not glow, though the bloom is meant to | The ceramic fix solves the contrast. Check the bloom's colour and glow against the Codex, which says it glows | **P3** |
| 19 | `turnaround/custodian_front.png`, `_side.png`, `_back.png` | Cream ceramic armour, copper trim, jaali chest panel and backpack vents, a belt with a **wrench and a screwdriver** ✓, knee and shoulder plates. On the **back of the helmet** and on the **lower back** an **arch outline containing a lotus rosette**; a **lotus rosette engraved on both pauldrons**; two **flared copper exhaust bells** under the pack | Arch + lotus inside it is a **niche** (*jharokha*, or a *mihrab*): twice on the armour. The flared exhausts read as **temple bells** (*ghanta*). Otherwise this is still the best asset in the set, and the gun-shaped tool is gone ✓ | Drop the arch outline and keep the flower, or turn the flower into a mechanical rosette of bolts and vents. Exhausts: slotted grilles or squared ducts | **P2** |

---

### 7.4 What is right, so that it is not "fixed"

- **The Root Guardian's crown.** A faceless head of glowing root tips, with the light gathering where the face was, is better than the face ever was. It also animates: the glow can travel. Do not put a knot or a hollow there now; the crown is enough.
- **The scattering animals in `guardian_root_restless`.** Birds and small creatures fleeing in all directions is the cleanest possible way to show a Guardian's power without a single act of harm. It follows rule 1 without being told to.
- **`jiva_orbit` and `hima_underwater`.** Both are the kind of image a store page needs: one shows a small living world you could walk around, the other shows that this game has an ocean under the ice. Neither has anything to fix.
- **The Custodian's belt.** A wrench and a screwdriver, hanging where a hand can reach them. That is the whole design argument of the game in one prop: an engineer, not a soldier. T-012's note about the gun-shaped tool has been acted on and it shows.
- **The jaali work is now consistently doing structural jobs**: chest panel, backpack vents, shelter window, SARATHI's panels, the ice-world light band. A lattice that vents or lightens is Indian by engineering, not by costume. This is the thing the game does better than its references.
- **`system_overview` is accurate.** Himasagara as a moon beside Vayumandala, Shunyapath grey and cratered, Taptashila innermost: it matches GDD §13 and it will save the Director an argument with a player later. Only the belt's glitter needs work.
- **No faces on drones, no fake script, no deity, no stereotype, no costume markers** in any of the nineteen. The one face in the set, SARATHI's, is gone.

---

### 7.5 Notes that are not cultural, but I would rather say

1. **The generator's watermark is still there**, on two of the fourteen images: `system_overview` and `shunya_orbit`, the same small white four-pointed sparkle in the bottom-right corner. `system_overview` is a strong candidate for the loading screen and the store, so it needs the same strip the textures get.
2. **Vayumandala is drawn too large from Taptashila.** In `tapta_orbit` the ringed giant is a small disc, which is right for the innermost world; in `tapta_surface` (already in §5) it fills the sky. One of the two is wrong. I would keep the orbit image and repaint the surface one, since the surface image is the one a player stands in.
3. **The Solar lotus is a machine that has not decided what it is.** In `hima_surface` it is a flower on a stand; the Codex entry says "the lotus shape is a design choice; the useful work happens in its cells". The art should agree with that sentence: cells first, lotus second.
4. **`shunya_orbit` disagrees with the GDD about what is on Shunyapath.** "Dead world with the biggest wreck" (§13) versus a settlement of domes. The wreck is the more interesting image and the one the ending needs.

---

### 7.6 Three lines for the style bible, if the Director wants them

The existing negative list caught most of this. These three are the gaps the new art found; each is a paste-ready sentence for `docs/PROMPTS.md` §2:

```
No arch outline containing a lotus or any motif (no niche, no jharokha, no mihrab, no shrine niche).
No bells and no flared bell mouths on machinery; vents are slotted grilles or squared ducts.
Holograms are recordings: figures stand or sit with hands at rest, never arms spread with palms up.
```

And one line for the Guardians, if §7.1a is agreed:

```
Guardians are masses of root, trunk and branch: no shoulders, no chest, no hands with fingers.
```

---

### 7.7 What I would do next

1. Repaint `shunya_orbit` as the wreck, and repaint Huxley's hologram. Those two are the only P1s left in the batch.
2. Repaint the Root Guardian's body before it is modelled, not after.
3. Fix the four P2s that keep recurring, because they recur: plinths under flowers, pointed arches, dome finials, and the arch-and-lotus niche. All four are already in the style bible; they need to be in the *prompt*, and the fastest way is to paste the whole §2 block every time rather than the world's line alone.
4. Send the Custodian's and Huxley's rigs a note that the palms-up poses are out. That is a two-minute fix in the animation clips and a much longer one after the cutscenes are cut.

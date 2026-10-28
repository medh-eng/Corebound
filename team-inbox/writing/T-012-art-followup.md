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

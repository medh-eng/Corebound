# T-036: Names for the three Jivagraha creatures, and a review of the 11 new models

**Delivery note**

- **Task:** T-036 (Sarvam AI). Thank you for the note about T-032, T-033 and T-035 — good to hear the Mooladri trunk is approved and the `goal_breathe` re-record is going ahead.
- **What I looked at:** the four pictures in `docs/review/2026-11-01/` — `models_1.jpg`, `models_2.jpg`, `models_3.jpg` and `creatures_in_game.jpg` — cropped and enlarged on the parts the task names: the launch pad's towers, the projector's arches, the fragment's cage, and the translator and memory log for writing-like marks. I also read `src/data/names.ts` for the names already in use, and my own notes in T-004, T-017, T-024 and T-032.
- **The short version:** three names with options below, and of the eleven models **eight are fine, three need a change** — the projector, the launch pad and the quantum fragment. The jellyfish's shape is fine; it needs colour only.
- **One thing you should see before anything else:** the **Sabatier reactor's four shape fixes are still not in** (section 4). The re-export fixed its colour, which is what it was for, but the pointed windows, the petal rings, the ball finial and the bell skirt are all still there, and the new colour makes them easier to see, not harder.

---

## 1. Names for the three creatures

The style is the one already in `names.ts`: a two-part Sanskrit compound that names what the creature *does* or what it *is* — Jyotishalabha (light-moth), Lambagriva (long-neck), Meghapota (cloud-belly) — rather than a borrowed word or a made-up sound. Each option below is checked against every name in `names.ts`, and none is a deity, a sacred animal, or a personal name in common use.

### The grazer

A small deer-like creature with moss growing along its back, faint teal lights on its flanks, that wanders, grazes with a nodding head, steps away when you come close, and rests at night. The Codex calls it "Gentle grazer".

| Name | Devanagari | Say | Meaning | Notes |
| --- | --- | --- | --- | --- |
| **Mridugami** | मृदुगामी | MRID-oo-GAA-mee | gentle-goer (mridu, gentle + gami, going) | Says "gentle" and says "moves", which is the whole creature. Closest to the English name the Codex already uses |
| Trinachara | तृणचर | TRIN-uh-CHUH-ruh | grass-walker (trina, grass + chara, moving) | The most concrete of the three: it names the grazing. Slightly drier in the mouth |
| Mridupada | मृदुपद | MRID-oo-PUD | soft-foot (mridu + pada, foot) | For the way it steps away instead of bolting. Prettiest, least informative |

**Recommended: Mridugami.** It is the one a player will connect to the behaviour in front of them, it reads as an animal rather than a mood, and it is short enough for a Codex line and for a voice.

### The burrower

A small armadillo-like creature in a segmented shell, with a pale rounded head and small clawed feet, that pops out of the ground nearby, looks around, and ducks back in.

| Name | Devanagari | Say | Meaning | Notes |
| --- | --- | --- | --- | --- |
| **Bilavasa** | बिलवास | BIL-uh-VAAS | burrow-dweller (bila, burrow + vasa, dwelling) | Tells the player where to look. Calm, easy to say, no sharp sounds |
| Bilachara | बिलचर | BIL-uh-CHUH-ruh | burrow-mover (bila + chara) | The same idea with movement in it; pairs neatly with Trinachara if you take that for the grazer |
| Udgami | उद्गामी | UD-GAA-mee | the rising one (ud, up + gami) | Names the pop-up rather than the burrow. Good, but a player will not know what it refers to until they have seen one |

**Recommended: Bilavasa.** A creature you meet by surprise benefits from a name that explains it after the fact, and "burrow-dweller" does exactly that.

### The bird

A small round green bird with **leaf-shaped wings** — a midrib and all — a pale peach face, a short beak, leaf-blade tail feathers, that circles over the forest by day and roosts at night.

| Name | Devanagari | Say | Meaning | Notes |
| --- | --- | --- | --- | --- |
| **Divachari** | दिवाचरी | DIV-aa-CHUH-ree | day-wanderer (diva, day + chari, moving) | Names the behaviour the player actually sees: it is there by day and gone at night |
| Kisalaya | किसलय | KI-suh-luh-yuh | tender leaf, new shoot | For the leaf wings. A classical poetry word, soft and pretty, and it says nothing about a bird |
| Vanachari | वनचरी | VUH-nuh-CHUH-ree | forest-wanderer (vana, forest + chari) | Accurate and calm; less specific than Divachari |

**Recommended: Divachari.** The leaf wings are lovely but they are also the reason the bird needs no help being memorable; the name is more useful telling the player why it disappears at dusk.

**Two names I considered and dropped, so you know they were weighed.**

- **Patranga** ("leaf-limbed") was my first choice for the bird, and I dropped it: it collides by ear with **पतंगा**, a moth, and with **Patangajana**, the kite-folk of Vayumandala. Three near-identical sounds for three different things is a Codex problem.
- **Pallava** ("tender leaf") is beautiful and is also the name of a South Indian dynasty. Not a deity, but not worth the association on a creature.
- I also avoided any name ending in **-pakshi**: **Meghapakshi**, the Storm Bird Guardian, owns that ending, and a small green bird must not sound like a Guardian.

**Voice respellings** for the recommended three, in the T-023 style, if T-037's Codex lines get recorded:

```
Mridugami   →  Mri du gaa mi
Bilavasa    →  Bi la vaa saa
Divachari   →  Di vaa cha ri
```

**Clash check:** Mridugami, Bilavasa and Divachari appear nowhere in `names.ts`, share no opening syllable with an existing creature, and none is a deity, a sacred animal or a common personal name. They are ready to paste into `CREATURE_NAMES` with the keys `grazer`, `burrower` and `bird`.

---

## 2. The eleven models

One row each. **Verdicts: fine (8), change (3).**

| # | Model | Verdict | What I see, and the reason | The one-prompt fix |
| --- | --- | --- | --- | --- |
| 1 | `escape_module` | **Fine** | A capsule that has clearly crashed: a heavy ringed porthole, riveted panel seams, a small dish antenna on a stalk, a domed glass top, weathered copper over cream. No arch, no finial, no pedestal, no script I can resolve. It reads as engineering that failed, which is what the story needs | — |
| 2 | `grazer` | **Fine** (one small note) | A wild grazer: moss along the back, teal lights on the flanks, slender legs, back-curved horns. Nothing religious, nothing sacred, and the moss is the best idea in the set — it says "living world" without a caption | P3, optional: in the **front** view the broad pale muzzle and short face read a little calf-like. A slimmer muzzle and longer leaf-shaped ears would keep it unambiguously wild |
| 3 | `burrower` | **Fine** | A segmented shell, a pale rounded head, small clawed feet. Reads as an armadillo-like animal and not as a mascot. Nothing cultural in it at all | — |
| 4 | `bird` | **Fine** (one small note) | The **leaf wings are excellent** — midrib, veins and all — and they do the work of making this Corebound's bird rather than a garden sparrow. Short pointed beak, no hooked parrot beak, no standing crest | P3, optional: the eyes are large enough that at close range it reads a little mascot-like next to the grazer and burrower. A slightly smaller eye would settle it. Not worth a re-export |
| 5 | `jellyfish` | **Shape fine** — colour only | See section 3 | Re-export the same model with colour. No remake |
| 6 | `huxley_projector` | **Change** | Two white arms rise from a copper base and **arc inward until their tips almost meet above the emitter**, with the green dome between them. Two curved arms meeting over a figure is a **prabhavali / torana** — the ornamental arch a deity image is framed by — and the paired arms also read as **folded hands**. The object is a frame around a hologram of a person, which is the one thing it must not be | `projector: two straight posts with flat cut tops, no inward curve, unequal heights, tips capped flat, keep the green dome and copper base` |
| 7 | `launch_pad` | **Change** | Three things. **(a)** The launch circle is ringed by a band of **scalloped petals**, so the whole pad reads as a lotus with a rocket standing on it. **(b)** All four corner towers end in **thin needle finials** — yes, they are finials, not spires with a purpose. **(c)** One tower has a **lintel across two posts**, which is a torana doorway | `launch pad: plain chamfered rim or segmented plate edge instead of the petal ring; tower tops flat capped with a constant-thickness lightning rod; towers as open cross-braced gantries with no lintel forming a doorway` |
| 8 | `memory_log` | **Small change** | A framed screen on a small easel, with a **rosette boss at the bottom centre**. Rounded frame, an image inside, a boss below it and a stand behind: that is the grammar of a **photo frame**, and a framed picture is close to a shrine picture. No lettering anywhere, which is right — the screen shows a scene, and the marks along the top edge are a grille, not text | `memory log: rosette boss becomes a small status light or a latch; stand becomes a clip or a recessed foot; squarer corners` |
| 9 | `quantum_fragment` | **Change** | A crystal hangs inside a **cage of curved ribs that cross at the apex**, standing on a **wavy, layered copper base** with gold in the crevices. Ribbed canopy over a relic, on a decorative pedestal, is a **reliquary** — the object reads as something enshrined and to be venerated, and the Fragment is the last thing in the game that should be | `quantum fragment: replace the crossing ribs with three straight struts meeting a flat top plate, or a two-ring gimbal; flat machined base plate with bolts; remove the apex finial` |
| 10 | `rover` | **Fine** | Six wheels, a rounded cab, a boxy cargo back, two round lamps, a small roof stub. The lamps read as lamps rather than a face, and the roof stub is a stub, not a finial. It looks like a vehicle that works | — |
| 11 | `translator` | **Fine** (one forward-looking note) | A wrist device: ceramic bezel, copper ring, a gold centre with a **spiral filigree**, a strap and lugs. It reads as a watch or a compass, which is right for a tool a person wears. **No writing-like marks at all** — the pattern is ornamental, not script | P3, for later: keep that centre pattern mechanical. If it ever becomes concentric squares or triangles it becomes a **yantra**, and that is a different object entirely |

### What is right across the set, so it is not "fixed"

Worth saying plainly, because a review that lists only faults invites a pass that breaks the good parts.

- **The moss on the grazer is the single best idea in the eleven.** A creature that carries the planet's health on its back is exactly the "world answers you" pillar, in one texture.
- **The leaf wings on the bird** are the second. They make a small background animal into something that belongs to this game and no other.
- **The escape module and the rover are honest engineering.** Panels, seams, bolts, skids, no ornament. That is the register the machines should be in, and the Sabatier is the one that drifted out of it.
- **Nothing in the set contains invented writing.** Not one model. That was my biggest worry in T-012 and it is still holding, model after model.
- **The colours are consistent**: cream ceramic, copper, weathered brass, with green and teal reserved for living things. The set looks like one world.

---

## 3. The jellyfish

**The shape is fine. Re-export the same model with colour — do not make a new one.**

Its silhouette is right: a rounded bell, a short inner ring, and a long trailing fringe of fine tentacles that reads correctly as a jellyfish from any angle, including the one you will actually see in game — from below, in dark water. The proportions are good for a small drifting creature and the fringe is fine enough to move well when it is animated.

The only problem is that it has no colour at all. It came out as a black silhouette in all four views, which means the texture did not export rather than the model being wrong.

Two things worth getting right in the re-export, since it is being opened anyway:

1. **It is Tarakajala — "star-water"** — so it should **glow**, not just be tinted. Pale blue-white with a lit bell edge and the fringe fading to transparent is the reading the name and the Codex both promise.
2. **Translucency matters more than colour for this creature.** A solid jellyfish reads as a plastic bag; the bell should let light through. If the engine can do it cheaply, an alpha-blended bell with an opaque inner ring is what will sell it.

If the re-export comes back black again, the problem is in the export settings, not the model — send it to me and I will look at the file itself, which is what I did for the cryo pod and the Sabatier.

---

## 4. The two re-exports in the same pictures

These are not among the eleven, but they are in `models_1.jpg` and I reviewed them in T-032, so the record should be straight.

**`cryo_pod` — colour is right, shape is unchanged.** The ceramic and copper now read properly and the teal canopy is lovely; the lattice band at the base works as a vent. Two small things remain from T-032:

- The **hatch frame is still the cusped, pointed arch** I flagged in T-032 §8. These four views do not show the hatch face, so I cannot see it directly, but the geometry is the same mesh and the re-export did not touch shape, so it is almost certainly still there. One fix: plain semicircular frame, no peak, no cusps.
- Now that it is in colour, the **stepped plinth** reads more clearly as a display base — the pod sits on a moulded pedestal like a museum model. In the game it sits on the floor of the escape module, so a flat base with two skids would be better than a plinth.

**`sabatier_reactor` — the four fixes are still open, and the colour makes the problem clearer.** In the new render I can see all four of the items from T-032: the **pointed-arch windows with dark lattice** on every face, the **copper dome caps with petal rings** on both side vessels, the **ball finial** on the top pipework, and the **bell-shaped vessel on a wavy skirt**. The colour has added two more readings on top of that:

- A **large gold disc on the front of the central vessel**, like a shrine medallion or a bindi. If that is a gauge, give it a bezel with markings and a needle so it reads as an instrument; if it is ornament, it should go.
- The **base is now a wavy, organic skirt** with gold in the crevices, which reads as poured metal or a rock plinth. A machine sits on a flat pad, not on a melted base.

Five changes now instead of four, all trim, none needing the whole model re-exported: `sabatier: rectangular louvred windows; flat bolted lids instead of dome caps with petal rings; tee or gauge instead of the ball finial; straight base skirt on a flat pad; the front gold disc becomes a bezelled gauge`.

I want to be fair about this: the model is better than it was, and the colour work is real. It is the *shape* pass that has not happened yet, and it is the shape that carries the shrine reading.

---

## 5. For the Director

- **The names are ready to paste.** Mridugami, Bilavasa, Divachari, with `grazer`, `burrower`, `bird` as keys, plus voice respellings. If the Commander prefers a different one from each table, nothing else changes.
- **T-037's creature lines can be written against these names now**, which matters because a Codex line that says "the Mridugami grazes on moss" will not need rewriting if the name is fixed first. That is worth passing on before ChatGPT starts.
- **Three fixes and one re-export** is the whole job on the models: projector, launch pad, fragment, and the jellyfish in colour. The other seven are done.
- **The pattern in all three model findings is the same one as T-032.** Every time a prompt says "Indo-futurist", the generator adds a canopy, a finial, a petal ring or an arch — on a projector, on a launch pad, on a relic case. The engineering underneath is consistently right. Subtractive fixes keep working; the two style-bible lines I suggested in T-032 would have prevented the launch pad's finials and would help here too: `no crest or finial at an apex` and `no dome caps with petal rings`.
- **One thing I could not check.** The escape module's side panels have small pale rectangles that might be labels. At the resolution of the picture I cannot tell whether there are letters on them. If there are, keep them Latin serial numbers rather than invented script — and if you want, I can open the `.glb` itself and read the texture, as I did with the cryo pod.

# T-032: Cultural review of three new models, and advice on Mooladri's body

**Delivery note**

- **Task:** T-032 (Sarvam AI). Deliverable as asked: `team-inbox/writing/T-032-review-models-mooladri.md`.
- **What I looked at:** the three model files as they are in the repository — `art-inbox/models/cryo_pod.glb`, `vehicle_bay.glb`, `sabatier_reactor.glb`. No screenshots were attached, so I opened the files themselves and rendered each one from the front, the right side, three-quarter and top, plus close-ups of the parts the task names (the Sabatier tank tops and windows, the vehicle bay's arch crown and side parapet, the cryo pod's hatch and plinth). I also re-read the two Mooladri concepts (`guardian_root`, `guardian_root_restless`), the style bible guards in `docs/GDD.md`, and my own earlier notes in T-012 and T-024.
- **One limit you should know about:** the cryo pod and Sabatier reactor still carry the all-black colour texture the Director described on 30 October, so I judged **shape only** — every form, every edge, every ornament. Colour and material are the Director's tint in code, and are not part of this review.
- **What I can judge:** whether a shape carries a religious, ritual or temple reading, a stereotype, a wrong motif, or a cliché. **What I cannot judge:** how it reads in the engine, at what distance, in what light, and how it animates. Those stay with the Director.

**The verdict in one line:** the cryo pod is right as it stands. The vehicle bay and the Sabatier reactor are good industrial models wearing four or five pieces of temple trim each, and each piece is a small, exact change.

---

## 1. Verdicts

| Model | Verdict | The one reason |
| --- | --- | --- |
| `cryo_pod` | **Keep** | Nothing in it reads as ritual. One optional nit below. |
| `vehicle_bay` | **Small fix** | The front is a cusped, pointed arch with a crest at its apex and a row of pointed petals along the parapet. That is a gateway, not a bay door. |
| `sabatier_reactor` | **Small fix** (four listed changes; the most shrine-like of the three) | Pointed-arch windows, dome caps ringed with petals, a ball finial between the coils, and a bell-shaped skirt. The pipework is excellent; the casing is a small pavilion. |

---

## 2. `cryo_pod` — keep

**What works.** It reads immediately as a capsule: a rounded pressure shell, a big plinth-less base, a **round-arched hatch** (exactly the right arch — semicircular, no cusp, no keystone flourish), heavy pipe runs down the side, a junction box with dials and a port, a vent grille on the shoulder, and a tie-down ring. The plumbing and the panel lines carry the "engineering, not ornament" reading the style bible asks for. There is **no lettering and no invented script** anywhere on it — the small marks on the shoulder are a grille, not writing. That is worth saying plainly, because a fake-script plaque is the single easiest thing for a generator to add to a machine, and this model does not have one.

**Nothing religious, ritual or stereotyped.** No arch vocabulary beyond the plain round hatch, no finial, no pedestal, no lotus, no jaali used as decoration for its own sake.

**One optional nit (P3, not a fix I would ask for).** The base is a wide stepped platform, and a stepped platform under a large object is the one thing in the model that could be read as a *chowki*, a low pedestal. In the engine it will sit in a floor or in regolith, so the reading will not survive contact with the game. If it is ever re-exported for another reason, a chamfer instead of a step would remove even that. Do not re-export just for this.

**Verdict: keep, unchanged.**

---

## 3. `vehicle_bay` — small fix

**What works.** The massing is right: a deep shed you drive a rover into, with a solid side wall, a proper roof, jaali-style vent panels low on the flanks, and a wide apron plate at the front. At a distance it reads as a hangar. The interior is genuinely empty and usable, which matters more than any ornament.

**What to change.** Four exact changes, all of them small edits to existing parts rather than a new model:

1. **The arch at the front is cusped and pointed at its apex.** This is the clearest break of the style bible's guard against pointed and Moorish arches, and it is the first thing a player sees, because the arch frames the door. **Fix:** make the profile a plain **semicircular arch** — one radius from the springing line, apex flat in profile, no cusp, no ogee shoulder. If a flatter opening is wanted for a rover, use a **segmental arch** (a shallow circular arc). Keep the door opening exactly the size it is; only the outline changes.
2. **There is a small pointed crest sitting on the arch apex**, like a guldasta or a finial base. A pointed element at the crown of an arch is the classic placement of a temple or tomb ornament, and it is what makes the whole front read as a gateway. **Fix:** delete it, and let the parapet run flat and unbroken over the arch.
3. **The parapet carries a row of pointed petal shapes** along its top edge (clearest in the side view). A row of upward petals on a roofline is a temple parapet motif. **Fix:** replace the row with **plain rectangular louvre vents**, flush with the wall, or with a flat capped parapet with a single drip edge. If some rhythm is wanted along that edge, use **recessed rectangular panels** at even spacing.
4. **The carved panels flanking the arch are floral relief** — a leaf-and-scroll carving in the spandrels. Carved floral relief on a building edge is shrine vocabulary in a way that a lattice is not. **Fix:** make them **geometric jaali** — a plain diamond or square lattice cut through the panel, like the vents already on the lower flanks. This keeps the Indo-futurist reading, because the jaali is a screen and a screen is structural.

**One optional change (P3).** The wide apron plate in front reads a little as a threshold or a plinth you step onto. A **grated deck** (a grid of slots) instead of a solid plate removes that reading and is more useful in play, since it reads as a ramp.

**What not to change.** Do not remove the jaali vents, do not add a dome, do not add a canopy or a chhatri over the door. The plain box with a big opening is the correct answer; it is the trim that needs to go.

**Prompt wording, ready to paste:** `vehicle bay entrance: plain semicircular arch, flat parapet, no crest or finial at the apex, no pointed petal row on the roof, geometric diamond jaali panels, plain industrial trim`.

**Verdict: small fix — four changes, no re-export of the whole model needed.**

---

## 4. `sabatier_reactor` — small fix (four changes)

**What works, and this is a lot.** The **pipework is the best engineering detail of the three models**: two pressure vessels, a coiled manifold looping over both, a valve handwheel on a side stub, bolted flanges, a drain stub at the base, and a bolted inspection hatch. That is what a chemical plant looks like, and it is the part that sells "science, not magic" at a glance. The two-vessel massing also reads correctly as a Sabatier reactor: CO₂ and H₂ going in, methane and water coming out.

**What to change.** The casing around those vessels has picked up four pieces of temple vocabulary. Each is small; together they tip the model from "plant" to "pavilion".

1. **The windows are pointed-arch windows with a lattice inside.** They are the single strongest shrine signal on the model — a narrow window with a pointed top and a pierced screen is a mehrab-and-jaali, and it appears on every visible face. **Fix:** **rectangular louvred windows** (three horizontal slats), or **round portholes with a flat grille**. Keep the lattice idea if you like it, but as a **square grid inside a rectangle**, not inside a pointed arch.
2. **Each tank top has a dome cap ringed with a ring of pointed petals.** A dome with a petal ring beneath it is a *kalash* and its *amalaka* — the crown of a temple, in miniature. **Fix:** a **flat lid with a raised lip**, a **bolted blind flange**, or a **shallow dished head** with no petal ring. The tank reads as a tank once the petal ring is gone.
3. **There is a ball on a short stem between the two coils**, sitting at the top centre. A sphere on a stem at the highest point of a symmetrical object is the exact position and shape of a finial. **Fix:** replace it with something with a job — a **tee junction**, a **pressure gauge**, a **small valve body**, or a bolted cap on the manifold. Any of those keeps the silhouette busy without the finial reading.
4. **The base is a bell-shaped flared skirt** on stepped rings. This is the "bell mouth" the style bible already guards against, and it is what makes the model read as sitting on a pedestal. **Fix:** a **straight cylindrical skirt**, a **flat base plate with bolt pads**, or **three short legs**. Anything with a straight edge instead of a bell curve.

**If a re-export is cheaper than four edits:** redo the **casing only** and keep the vessels, the manifold, the handwheel and the flanges exactly as they are. The engineering is not the problem; the skin around it is.

**Prompt wording, ready to paste:** `sabatier reactor casing: rectangular louvred windows, flat bolted lids, plain tee or gauge on top, straight base skirt, no pointed-arch windows, no dome caps with petal rings, no ball finial, no bell-shaped base`.

**Verdict: small fix — four changes; redo the casing only if that is easier.**

---

## 5. Mooladri's body: humanoid giant or buttressed trunk

### What the concepts currently show

`guardian_root` and `guardian_root_restless` both show a giant built on a **human body**: a trunk that widens into **shoulders**, a **chest with pectoral planes**, upper arms, forearms and **five-fingered hands**, hips, two legs with a gap between them, and feet that splay into roots. The head is a smooth blank shape, faceless, with a **crown of glowing root tips** rising out of it. Moss, ferns and mushrooms grow on the shoulders. In the restless version the hands are **raised with glowing palms turned forward**, and the crown burns brighter.

The faceless decision was right and it is already in the game. The body is the open question, and it is the part that carries the risk.

### The finding, in one paragraph

A human torso, upright and symmetrical, with a **crown of light** above it, glowing **palms turned out**, and a **small figure standing below looking up**, is not a neutral shape. It is the composition of a *murti* seen frontally: crown, radiant head, open hands, devotee below. Nothing in the file intends this, and no player will name it — but they will feel it, and the feeling is veneration. That is the one category the GDD keeps Guardians out of: they are "the planet's immune system", calmed by engineering, never worshipped. The humanoid body also reads as an Ent, or as Groot, before it reads as Corebound.

### Option A — humanoid root giant

- **Cultural risk: high.** Three separate signals, any one of which is enough. (1) The **human torso** is the standard grammar for depicting a deity; a giant with a body like ours is a *being*, and beings with power are what get worshipped. (2) The **palms-out raised hands** in the restless concept are, precisely, *abhaya mudra* — the gesture of reassurance given by an icon. That is the single most recognisable religious gesture in Indian art, and it is on the pose that plays when the world is in trouble. (3) The **glowing crown** over a faceless head is a *mukut* silhouette; in the restless version the tips read as **flame tongues**, which adds the *agni-shikhara* reading — a burning crown on a being that is supposed to be calm.
- **Calm: poor.** Hands are the problem. Two five-fingered hands at player scale read as something that can **pick you up or close on you**, whatever the animation does. A raised glowing palm is reassurance from a superior being, which is exactly the relationship the game does not want. The wide stance and the gap between the legs also makes it a *creature standing over you*, rather than a landform you are inside.
- **Buildability: the weakest of the two.** GDD §12 says Guardian bodies are built procedurally from root growth and splines. A torso with shoulders, a chest and a waist needs anatomy — that is sculpting, not growth. Five fingers are the hardest thing in the whole model to grow from roots, and they will be the first thing to look wrong in motion.
- **What would have to change if you choose it anyway:** hands become **forks of three root tips** with no palm; the pose never raises them palm-forward (lower them, or turn them so only the edge is visible); the crown loses the flame tongues and becomes **uneven cut root ends**; and the chest loses the pectoral planes and becomes a **fissured trunk** with the "shoulders" read as two thick buttress roots.

### Option B — buttressed trunk (my recommendation)

A great column of fused roots: a **narrow trunk** that flares at the base into **buttress fins** — the flat, blade-like flanges at the foot of a banyan or a rainforest emergent — with the fins splitting into **root runs** that go out across the ground. No shoulders, no chest, no waist, no fingers, no head. At the top the trunk splits into a **crown of uneven root tips**, and the glow lives there and travels down the fissures.

- **Cultural risk: low, with three rules.** The risk is not the body, it is the *setting*: a big ficus with roots hanging down is the tree a shrine is built under, and a platform under it would complete the picture. So: (1) **no platform, kerb, step or paved ring** at its feet — it stands in soil, moss and leaf litter; (2) **no canopy of hanging prop roots** forming a curtain, and **no cloth, thread, garland or offering** anywhere; (3) the crown is **many uneven tips**, never one point, and **never a pot-and-spike**. Keep those three and the shape stays a landform. It helps that the name already means this: **मूलाद्रि**, root-mountain — a mountain is the calmest thing in a landscape.
- **Calm: excellent.** A trunk is a thing you **walk between**, not a thing that looks at you. The buttress fins give it a readable silhouette at any distance, the player can stand inside the gap between two fins, and there is no limb that could plausibly reach for them. It also reads **bigger** than the humanoid at the same height, because the eye measures it against a building rather than against a person.
- **Buildability: the better of the two.** Buttress fins and root runs are spline and noise work: a trunk profile, a handful of fins grown by a simple rule, root runs along the ground, tips split at the top. There is no anatomy to get wrong, no fingers to animate, and the restless state can be a **change in glow travel, lean and speed** rather than a change of pose.
- **One concession I would make:** give it **two root-limbs** — thick fins that lift off the ground and split into **three or four root tips each** — so it has a gesture available. Lowering one limb, or turning the trunk's lean, is how it shows attention without a mudra. No palms, and never five tips.

### Recommendation

**Build the buttressed trunk.** It is calmer, larger, easier to grow in code, and it keeps the Guardian in the category the GDD put it in — a system of the planet, not a being to be revered. Keep the faceless decision, keep the crown of glowing root tips, keep the moss, ferns and mushrooms on the surface (they are good, and they say "living world" rather than "statue").

**Shape notes, if you take it:**

- Height about **18–25 m** (roughly ten times the Custodian), with a base spread about **three times the trunk width**, so the player can walk between the fins.
- Fins: **six to eight**, flat blades, each with a **straight leading edge** and no ornament. They should read as cut by growth, not carved.
- Crown: **uneven root ends**, some long and some short, all of them blunt. **No single centre point**, no spike, no flame tongue.
- Glow: **pale sap-white with a green cast when calm**; **amber when restless** — not orange-red, which reads as fire. The glow travels along the fissures, and it is how the Guardian "looks" at you.
- Movement: lean, settle, slow lift of one root-limb, glow travel. Nothing that resembles a hand.

**Devanagari, exact, as it already stands in `src/data/names.ts`:** **मूलाद्रि** — said **MOO-lah-dree**, meaning root-mountain (मूल, root + अद्रि, mountain). If the trunk is chosen, the name gets *better*, not worse: what the player meets is a mountain of roots.

---

## 6. For the Director

- **Colour was not reviewed.** The cryo pod and Sabatier reactor still have the all-black texture; I judged shape only, and the pipeline tint is doing the rest.
- **Two style-bible lines would have prevented all six findings**, if you want them for the next art round: `no pointed, cusped or Moorish arches; no crest or finial at an arch apex` and `no dome caps with petal rings, no ball finials, no bell-shaped bases on machines`. The three findings on the Sabatier and the bay are all the same generator habit: when a prompt says "Indo-futurist", it reaches for temple trim rather than industrial trim.
- **The good news is that the engineering is right in all three models.** The plumbing, the flanges, the hatches, the vents and the jaali-as-vent are the correct Indo-futurist language, and they came from the same prompts. The fixes are subtractive: take the trim off, and what is underneath is the game's look.
- **Mooladri's body is the Commander's call.** My recommendation is the buttressed trunk, with the two root-limbs as the concession. If the humanoid is chosen, the four changes in Option A are the minimum.

---

## 7. Addendum: the Commander's two new concepts, reviewed

Two concepts arrived the same day, both drawn on the buttressed-trunk direction: a front elevation on a plain ground, and a lit scene with the Custodian for scale. **The body is approved** — this is the shape to model. Five changes to the upper half should be made before modelling, because in a 3D build they are the parts that are hard to take out later.

**What is right, and should not be changed when it is modelled.**

- The base is exactly the recommendation: buttress fins flaring into root runs, wide enough to walk between, and a hollow at the foot. Moss, ferns and mushrooms grow on the surface, which is what makes it a living thing rather than a statue.
- There is **no platform, kerb, step, cloth or offering** at its feet, and **no face** — no head at all. The two rules that mattered most are both kept.
- The trunk stays broad for most of its height and the pale wood with green moss and a copper seam is the right palette. The Custodian for scale reads correctly: this is a landform, not a person.

**The five changes.**

1. **The hanging strands read as matted hair.** Two dense curtains of long thin strands falling from the upper arms is the silhouette of *jata* — the matted locks of a sadhu or an ascetic — before it reads as aerial roots, and it is also the sacred banyan's hanging curtain, which was the one tree reading I asked to avoid. **Fix:** either remove the strands, or make them **few (three or four per arm), thick, stiff and tapering, and let them reach the ground** so they read as roots that have landed. Never a dense, even, hanging curtain.
2. **The pair of long arms with the fan between them reads as antlers, or as raised arms.** A symmetrical Y with upward-curling tips is a candelabra and a crown at once. **Fix:** make the two arms **unequal** — one longer and lower than the other — and **blunt every tip**. Fewer branches in the central fan, uneven lengths, cut flat.
3. **The two short stubs at mid-height read as shoulders or elbows**, and they are what makes the upper half a torso. **Fix:** remove them, or turn them downward as root stubs. Keep the trunk broad past that point instead of narrowing above the fins — a waist is what turns a trunk into a body.
4. **The single bright glow at the crown centre reads as an eye, or a flame.** **Fix:** no single bright focal point at the top. The glow lives in the seams and in several uneven tips, so there is no "face" position.
5. **The glow is amber-orange.** Orange-red on bark reads as fire. **Fix:** calm state is **pale sap-white with a green cast**; **amber only when restless**, and even then not red.

**Three notes for the modelling itself.**

- **Build it asymmetric from the start.** A mirrored trunk reads as a figure; a slightly lopsided one reads as growth. This is the single cheapest way to keep the body clear of the deity reading.
- **The strands are the expensive part.** If they are kept, model three or four per arm as simple tapered tubes, not as a groomed curtain of hundreds — they cost frames, they read as hair, and they will tangle with the player's camera.
- **Keep the fins' gaps walkable** at roughly Custodian width or wider. Being able to stand inside the base is what makes the size land.

**One note on framing, not on the model.** The lit scene puts the Custodian small and centred at the foot of a symmetrical, backlit, crowned giant — the *darshan* composition again. In the game the camera sits over the shoulder, so this framing will not occur in play. For the store art and the loading screen, shoot the Guardian **from three-quarter, off-centre, with the player's shoulder in frame**, so the picture is "a person working beside something vast", not "a person before something holy".

**Verdict: approved to model, with changes 1 to 5 above.**

---

## 8. The re-export, checked: colour is fixed, shape is not

Two new files arrived: `cryo_pod.glb` and `sabatier_reactor.glb`, 1.2 MB and 1.3 MB, replacing the all-black-texture exports. I compared them against the files they replace, mesh against mesh, and rendered them again in colour.

**What the re-export fixed, and it is the thing that mattered most.**

- **The colour is real now.** The cryo pod reads as off-white ceramic with copper trim and a teal canopy; the Sabatier reads as copper and pale ceramic with brass fittings. Both textures are proper 2048² images with real variation, not a flat black. **The Director's `tint` stopgap in `scripts/assets.config.json` can come out** — these two no longer need to be painted in code.
- The palette is right for the game: warm metals, pale ceramic, and nothing that fights the Custodian's off-white and copper.

**What the re-export did not change: the geometry.** The cryo pod's vertices are bit-identical to the old file. The Sabatier has the same face count and the same bounds, with only the UV seams differing. So the new files are a **texture pass, not a shape pass**, and every finding in sections 3 and 4 is still open.

**A correction I owe you on the cryo pod.** In section 2 I wrote "round-arched hatch — exactly the right arch" and gave the model a clean *keep*. That was wrong, and I can see it now that the copper trim is visible: the hatch frame is a **cusped, pointed arch** with a sharp peak at the apex and a small cusp on each shoulder. In the grey render at that size I read the inner opening, which is round, and missed the trim around it, which is not. The inner opening can stay exactly as it is; it is the frame that has to change. My apologies — the model is one small fix, not a keep.

**So the outstanding list is now five items, not six.**

| Model | Still to change | Where it is |
| --- | --- | --- |
| `cryo_pod` | The hatch frame: plain semicircular copper trim, no peak at the apex, no cusps on the shoulders. The inner opening stays as it is. | The front hatch |
| `sabatier_reactor` | (1) pointed-arch windows → rectangular louvres or round portholes | Every visible face |
| | (2) dome caps with petal rings → flat bolted lids or shallow dished heads | Tank tops |
| | (3) ball finial between the coils → tee junction, gauge or valve body | Top centre |
| | (4) bell-shaped skirt on stepped rings → straight skirt, flat base plate or three legs | Base |

**What I did with the files.** I have replaced `art-inbox/models/cryo_pod.glb` and `art-inbox/models/sabatier_reactor.glb` with these two, so the old black-texture exports are gone. The replacement is worth taking on its own: real colour beats a flat code tint, and nothing is lost by it. **It is not a sign-off on the shape** — the five items above stay open until they are re-exported.

**Two things for the Director, not for the Commander.** The processed copies in `public/assets/models/` are stale until `npm run assets` (or whatever the pipeline entry is) is run again — I did not touch `public/assets/`, since `AGENTS.md` keeps it out of worker hands. And the `tint` entry for these two models in `scripts/assets.config.json` should go, or the new textures will be painted over with flat copper and ceramic.

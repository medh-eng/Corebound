# T-042 concept review: Mooladri's trunk and the valley scene

**Delivery note**

- **Reviewer:** Sarvam AI. This is the review the Commander asked for of the two images in PR #39: `art-inbox/concept/guardian_root_trunk.png` (1199 × 1312) and `art-inbox/concept/guardian_root_trunk_scene.png` (1671 × 941).
- **What I looked at:** both images at full size, then crops of the crown, the mid-trunk and the foot of the trunk, because those are where the five corrections from T-032 §7 either hold or slip. I checked them against `docs/GDD.md`'s style guards, my own T-012, T-024 and T-032 notes, and the Mooladri and root-valley Codex entries.
- **What I can judge:** whether a shape carries a religious, ritual, temple or stereotype reading; whether the five corrections are actually visible; whether the creature reads as something to be calmed rather than fought.
- **What I cannot judge:** how it reads in the engine, at what distance, in what light, on a phone, and how it animates. Those stay with the Director.

**Verdict: both images accepted.** All five corrections are visible, nothing carries a religious, ritual or stereotype reading, and it reads as a living landform to be given room, not a monster. Four modelling notes follow. None of them needs a redraw.

---

## 1. The five corrections, one by one

| # | T-032 §7 asked for | What the images show | Verdict |
| --- | --- | --- | --- |
| 1 | Three thick, stiff, tapered aerial roots per bough, each visibly reaching the ground; no thin curtains, no hair or beard | Front: three thick strands from the left bough, three long plus one shorter from the right; every strand joins the ground in a visible flare. Stiff and tapered, no curtain, no hair | **Met** |
| 2 | Two unequal blunt boughs, irregular heights; sparse central cluster of blunt flat-ended tips, never antlers | Left bough is longer and sits lower; right bough shorter and higher. Both end blunt. Five uneven flat-ended tips in the crown, no upward curl | **Met** |
| 3 | No shoulder or elbow stubs at mid-height; trunk stays broad | No paired stubs anywhere. The trunk is continuous and broad from foot to crown; the boughs spring out of the wood as timber, not as joints | **Met** |
| 4 | No single bright centre, orb, eye, flame or halo; glow distributed over separated tips and thin seams | Five tips, each with a soft glowing cut face of similar strength, plus thin seams running down the bark. No orb, no halo, no focal point | **Met** |
| 5 | Pale sap-white glow with a soft green cast; no orange-red, no fire | White-green glow throughout both images. The only warm colour is the copper-brown seam in the bark and the low daylight | **Met** |

The crown crop is the one I checked hardest, because a bright apex is the easy way for this shape to turn into a shrine lamp or an eye. It does not: the tips are five, they are uneven, they glow at the same low strength, and the brightest thing in the front image is still the pale wood.

## 2. Culture and story

- **No face, and no face suggested.** The foot hollow is a burrow a path can pass through, not a mouth; no knot or seam sits where eyes would be.
- **No plinth, kerb, step, platform or shrine framing.** The trunk stands in soil with moss, stones and ferns. This was the main risk with a banyan-like shape and it is clean.
- **The banyan reading is welcome, not risky.** Jivagraha's own banyan is already Jyotivata in `names.ts`. Aerial roots with no cloth, no platform, no offerings and no ritual object are simply a tree.
- **No motif that carries a religious reading:** no arch containing a lotus, no niche or jharokha, no bells, no kalash, no finial, no spire.
- **Mushrooms and ferns grow from bark and soil,** never on pedestals.
- **The scene's background has no architecture at all.** The correction prompt worked: I can find no dome, tower, finial, bridge or lotus structure anywhere in it, only forest, sandstone cliffs and a waterfall. That is the version to keep.
- **The Custodian is right:** off-white modular science suit, copper trim, back to camera, hands down, no turban, no bindi, no moustache, no ceremonial staging, no symmetrical tableau. The shoulder in the left foreground is exactly the scale cue the scene needed.
- **It is not a monster.** Nothing on it is pointed, spiked or fanged; the boughs are blunt and open. A player will read "give this thing room", which is what slice 3 asks them to do.

## 3. Four modelling notes for slice 3 (none is a blocker)

1. **Gaps between the strands.** The brief wants walkable gaps about a Custodian's width or wider. In the scene the left group is about one width, but the far-right pair is tighter than a person. Build the procedural trunk with a minimum gap of about 1.5 m between fins, and do not copy the far-right pair as drawn.
2. **Fix the count at three per bough.** The front image shows three on the left and four on the right. Three is the better silhouette and the cheaper one; keep the taper from bough to ground so no strand reads as a column holding up a roof.
3. **Do not read the framing as proportion.** The front elevation's left bough runs to within about 2% of the canvas edge, so the margins are tighter than the brief asked. Use the trunk's own proportions instead: width to height is about 1:1.4, and the crown tips sit at roughly 82–88% of total height. In the scene the figure puts Mooladri at about 9–11 m; take 12 m as the prompt says and hold it.
4. **Glow is a material, not five lights.** Five emissive tips plus seams is the right look, but on phones the light budget is tight (79 of 224 slots at the last count). Use an emissive texture and keep the glow equal across the tips, so the eye has no focal point. Keep the copper seam as colour in the bark texture, not as a raised tube — it reads correctly and costs nothing.

**One thing to watch in the engine.** A broad trunk with two lateral boughs at upper-third height is the shape most likely to drift back into a torso. The asymmetry is what saves it now. Keep the left bough attached as low as it is drawn, and never let the build add a matching pair of anything.

## 4. A note on the text in the same pull request

I read `team-inbox/writing/T-042-mooladri-ui-text.md` while I was here. Seven prompts, four steps and three polished goals, all inside their word limits, and nothing names a later step before its time — `roots_blocked`, `root_marked` and `bloom_spores_wrong` are the three that usually give the puzzle away and all three are clean. The `valley_open` line only appears after Mooladri is calm, which is right.

One thing to fix before it goes into `src/data/`: three of the pasted strings use a curly apostrophe (`’`) — `Mooladri’s`, `Huxley’s` twice — while every string in `src/data/` uses the straight one (`'`). `voice.ts` matches a line by its exact text, so a curly apostrophe would leave that line silently unvoiced and could fail the data tests. Swap them to `'` when the text is pasted in.

## 5. What I need from the Director

- Accept both PNGs into `art-inbox/concept/` as the body reference for slice 3. Nothing in either needs re-drawing.
- Carry notes 1–4 above into the procedural build rather than into a new image.
- I cannot push to the repository (GitHub is not connected for me), so this review is delivered to the Commander for upload to `team-inbox/writing/`, and the summary in section 1–3 can be pasted as a comment on PR #39.

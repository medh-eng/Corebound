# T-023: Voice respellings for the plant and rock names

**Delivery note**

- **Task:** T-023. Two things: (1) the Indian-English respelling for each of the ten chosen names, in the format of `T-004-names-review.md` §4; (2) a read of the ten Codex entries to see whether any English text now clashes with its Sanskrit name.
- **What I read:** `src/data/names.ts` (`FLORA_NAMES`) and the ten entries in `src/data/codex.ts`. I did not run the game; the text I checked is the text in the repository.
- **Verdict:** the ten names are good and the Devanagari is correct in all ten. **Four entries have a small clash** and each needs one line of English, not a new name. Nothing here asks the Director to change a name or a Devanagari letter.
- **Nothing edited by me.** The one-line fixes below are for the Director to apply to `src/data/codex.ts`.

---

## 1. Respellings for the voice

Same convention as `T-004-names-review.md` §4: **spaces, not hyphens** (several engines read a hyphen as a pause or a word break), doubled letters where a sound is held.

The Devanagari column is the one to give the **Hindi and Marathi** voices: that is what those voices are built for, and they will say the name correctly with no help. The respelling column is for the **Indian-English** voice only.

| Name | Devanagari (Hindi and Marathi voices) | Respelling for the Indian-English voice |
| --- | --- | --- |
| Jyotivata | ज्योतिवट | Jyoh tee vaa taa |
| Deepashirsha | दीपशीर्ष | Dee pa sheer shaa |
| Jyotiguccha | ज्योतिगुच्छ | Jyoh tee gooch chhaa |
| Deepalata | दीपलता | Dee pa la taa |
| Shantakamala | शान्तकमल | Shaan ta ka ma la |
| Sheetashikhara | शीतशिखर | Shee ta shi kha ra |
| Lohashila | लोहशिला | Lo ha shi laa |
| Kajjala | कज्जल | Kuj ja la |
| Dhavala | धवल | Dha va la |
| Sakshi | साक्षी | Saak shee |

**Four of these need care, and here is why:**

- **Jyotiguccha.** The trap is the double **cch**. Written plainly, an engine says "goo-cha" or "guk-ka". The respelling "gooch chhaa" holds the first *ch* and breathes the second, which is what गुच्छ sounds like. This is the one name I would check by ear first.
- **Sheetashikhara.** The **kh** in शिखर is aspirated, as in *khaki*; a hard *k* is still acceptable and nobody will mishear the plant. It is also the longest of the ten, so it will stretch a line. If it ever has to fit a short prompt, the fallback is to say "Sheetashikhara" alone in the sentence and cut the surrounding words.
- **Kajjala.** The **jj** is held, not doubled as two separate sounds: *kuj-ja-la*, with the *j* sitting a moment. This matters more than it looks, because of the name's other problem in §2.
- **Dhavala.** **Dh** is the aspirated *d* of *dharma*, not a *d* followed by an *h*. Written "Dha va la" most engines get it right; if one does not, "Da va la" is the safe fallback, since a flat *d* is a smaller error than "duh-ha-va-la".

Everything else reads as written, and none of the ten needs the manual fallback.

---

## 2. Four entries where the English now fights the name

Read as a player: you scan a plant, the Codex shows a title in English, a name in Sanskrit, and a paragraph. The paragraph is what teaches you what the name means. In four of the ten, it does not.

| Entry (`id`) | Name and meaning | What the entry says now | One-line fix | Why |
| --- | --- | --- | --- | --- |
| `fern` | **Deepalata**, lamp-creeper | "Fine fronds fill the shaded gaps between larger trunks. Their repeated patterns make a useful contrast with the broad leaves overhead…" — no light, and nothing that creeps | After "shaded gaps between larger trunks", add: *"At night each frond keeps a faint light of its own, and where the fronds meet the ground they root as they go: a lamp-creeper, not a fern."* | The name promises two things, light and a creeping habit, and the entry mentions neither. It is the only one of the ten where the name and the description could belong to different plants. |
| `mushroom_tree` | **Deepashirsha**, lamp-headed | "Pale structures beneath the cap **catch** the light… the name is only a field label." | Change to: *"Pale structures beneath the cap give off a low light of their own, which is where the name comes from."* Drop "the name is only a field label". | "Catch the light" is the opposite of "lamp-headed": one reflects, the other gives. And that sentence now denies the very name the Codex prints above it. |
| `carbon` | **Kajjala**, lamp-black, soot | "Dark seams become easier to find below the lighter surface layers…" — the word *soot* never appears | Add to the first sentence: *"The name is the old word for lamp-black, which is what a handful of it looks like."* | See §3 below. Without the line, the name is the only clue a player has, and in modern Hindi and Marathi it points somewhere else entirely. |
| `bloom` | **Sakshi**, witness | "This growth appears where Harmony is high… The bloom makes that relationship visible…" — strong writing, but it never says *witness* | Add at the end: *"Sakshi means witness: it grows only where the world is well, so it stands as evidence of what was done here."* | "Witness" is the best idea in the set and the entry never uses it. One line turns a label into the point of the flower, and it fits the Harmony system exactly. |

Each fix is a sentence inside an existing paragraph, so no entry grows past the 40–100 word rule.

---

## 3. One name worth a decision, not a fix

**Kajjala** / कज्जल / "lamp-black, soot", for the carbon seams.

The Sanskrit is right, and the spelling is on our side: the old word is written **कज्जल** with a doubled ज, while the everyday word for kohl, and the common personal name, is **काजल** with a long आ. So the Codex spelling is already the correct one and nobody reading carefully will confuse them.

The risk is only in the Latin letters and in the ear. A player who reads "Kajjala" will think of *kajal*, the kohl that half the country has in a drawer, before thinking of soot. That is a soft collision, not an error: soot and kohl are genuinely the same substance, which is exactly why the word was chosen. My recommendation is to **keep Kajjala** and add the one line from §2, which makes the link explicit and turns the collision into the explanation.

If the Commander would rather have no collision at all, the clean swap is **Angara** / अंगार / "ember" — say it *UNG-uh-ruh*, respelling for the English voice "Un ga ra". It keeps the fire, it is an ordinary Hindi word that every player already knows, and it cannot be read as a cosmetic. His call; I would not spend a change on it.

---

## 4. The other six: keep exactly as they are

Checked, correct, and the English supports the name:

- **Jyotivata** (light-banyan) — the entry's "faint light gathers along the branches" is exactly the name. The best-matched pair in the ten.
- **Jyotiguccha** (light-cluster) — "Low clusters shine beside the path when the canopy darkens": cluster and light, both present.
- **Shantakamala** (calm lotus) — "Broad pads spread across sheltered water". *Sheltered* is doing the work of *calm*, and it is the better word for a game about still water. One optional tweak, not needed: if the Director ever wants the gloss tighter, "lotus of still water" says it more plainly than "calm lotus".
- **Sheetashikhara** (cold spire) — "Blue crystals stand out against the darker rock". Spires, cold, blue: all three.
- **Lohashila** (iron-rock) — "Rust-red material forms conspicuous patches and narrow veins". The entry is careful to say the rock *contains* iron rather than being iron, which is right, and *shila* means rock, not metal. Keep that distinction.
- **Dhavala** (white, pale) — "Pale grains crumble from the sandstone beneath the grass". *Pale* is the name, first word of the description. Note only: the title is "Sandstone and silica" while the name means only "white", so a player may take Dhavala to be the silica. One word fixes it if it ever bothers the Director ("Pale sandstone" as the title); it does not bother me.

**The Devanagari is correct in all ten.** I checked each against its Latin form and its meaning, and there is nothing to change: ज्योतिवट, दीपशीर्ष, ज्योतिगुच्छ, दीपलता, शान्तकमल, शीतशिखर, लोहशिला, कज्जल, धवल, साक्षी. शान्तकमल is also correctly written शांतकमल in modern practice; the Codex form is the older and finer one, so keep it.

One small note, the same kind as Tarangini in `T-004-names-review.md`: **Sakshi** is a common Indian personal name, and it is also a word witnesses say in court. Harmless, and rather good for a flower that turns up where the world is healthy.

---

## 5. What I would do next, if the Director agrees

1. Apply the four one-line fixes in §2. They are the whole task; nothing else needs changing.
2. Show the Devanagari and the meaning in the Codex panel next to the Latin name. The `CodexEntry` type already carries `name` and `deva`, and the ten entries above are the proof that the meaning is worth a line: a player who reads "Deepalata, lamp-creeper" and then a paragraph about light and rooting has learned a word of Sanskrit without being taught one.
3. When T-006 lands, these ten Devanagari strings are already settled and do not need translating again. Only the paragraphs do.

# T-004 follow-up: check of the chosen names

**Delivery note**

- **Not a new task.** This is my own follow-up to T-004, which is closed. The Commander chose the names on 2026-10-27 and they are now in `src/data/names.ts`, so nobody has checked the *chosen* set the way the options were checked. This does that.
- **What I checked:** every entry in `src/data/names.ts` (6 Guardians, 6 peoples, 12 creatures, plus `SZYNTHAR_HOMELAND`), against the Devanagari, pronunciation and meaning, and against how each name will read to a player who speaks Hindi or Marathi rather than Sanskrit.
- **Verdict:** the set is good and it is coherent. **Three names need a small change, and one is worth a decision.** Everything else I would leave exactly as it is.
- **Why this matters:** the options in T-004 were checked as Sanskrit. Players do not read Sanskrit. They read modern Hindi and Marathi, where three of these words now mean something other than what the Codex will say they mean.
- **How to apply:** each fix below is one line of `names.ts`. I have not edited any file in the game; that is the Director's to merge.

---

## 1. Three names I would change

| Entry | Now | What a player reads | Change to | Why |
| --- | --- | --- | --- | --- |
| `PEOPLE_NAMES.taptashila` | `Khanaka` / `खनक` / "miners" | **खनक (khanak) means "a tinkling sound"** in modern Hindi, from खनकना, to jingle. The everyday word for a miner is खनिक (khanik). Sanskrit *khanaka* does mean "digger", so the entry is defensible as Sanskrit, but the Devanagari is what makes it read as "jingle-folk" to an Indian player. | `name: 'Khanik'`, `deva: 'खनिक'`, `say: 'KHAA-nik'`, `meaning: 'miner'` | One letter, and the name stops being a joke the writer did not intend. The stone-plated miners of a metal world should not be called the Jinglers. |
| `CREATURE_NAMES.acid_beetle` | `Kathinakita` / `कठिनकीट` / "hard-shelled beetle" | **कठिन (kathin) means "difficult"**, not "hard" as a material. So the beetle reads as "the difficult insect". The word for physically hard is कठोर (kathor). | `name: 'Kathorakita'`, `deva: 'कठोरकीट'`, `say: 'kuh-THOH-ruh-KEET'`, `meaning: 'hard-shelled beetle'` | Keeps the meaning the Codex promises. It is also easier to say: कठोर has no cluster. |
| `CREATURE_NAMES.glow_moth` | `Jyotipatang` / `ज्योतिपतंग` / "light-moth" | **पतंग (patang) means "kite"** in modern Hindi and Marathi. Sanskrit *patanga* means moth, but the modern reading wins. Worse, the Vayumandala people are already `Patangajana` ("kite-folk"), so a player meets "light-kite" on Jivagraha and "kite-folk" on Vayumandala, in two different worlds, meaning two different things. | `name: 'Jyotishalabha'`, `deva: 'ज्योतिशलभ'`, `say: 'jyoh-ti-SHUH-luh-bhuh'`, `meaning: 'light-moth'` | शलभ (shalabha) means moth and nothing else. It frees पतंग for the kite-people, where it belongs. This is the fix I would make first of the three. |

## 2. One name that needs a decision, not a fix

`CREATURE_NAMES.light_jellyfish`: **Tarakajala** / तारकाजल / "star-water".

The star reading is correct: तारका (tārakā) is an ordinary Sanskrit word for a star. But तारक and तारका are also the names of figures in Indian myth (Tāraka, an asura; Tārakā, a demoness in some tellings). They are not gods, and a jellyfish is not a ritual object, so this does not break the GDD's rule. It is a soft risk, not an error.

If the Commander would rather not have the collision at all, the clean swap is **Nakshatrajala** / नक्षत्रजल / "star-water" (नक्षत्र, constellation, has no other reading). Say it *nuk-SHUT-ruh-juh-luh*. Same meaning, no shadow on it. If he likes Tarakajala, keep it: it is the prettier word, and the risk is small.

## 3. Everything else: keep as it is

Checked and correct, with no change recommended:

- **Mooladri, Shailasarpa, Meghapakshi, Tantukari** — Devanagari, pronunciation and meanings all match. **Balukavela and Himavela** are the best decision in the set: the two leviathans share a suffix and a meaning, so a player learns the pattern once.
- **Deepajana, Maruyatri, Jalabandhu, Patangajana, Shvasajana** — all correct. **Shvasajana** is the hardest to say (the श्वा cluster); a voice actor will manage it, a child reading the Codex may not. Do not respell it; the difficulty is part of its character.
- **Golakarka, Lavana, Lambagriva, Marumina, Himakarka, Meghapota, Tarangini, Neelachhaya** — all correct. Two notes for the Codex, not changes:
  - **Lavana** means "salt" in formal Hindi and Marathi; the everyday word is नमक / मीठ. The entry already says "salt, mineral", which is exactly right. Keep the gloss.
  - **Tarangini** is also a common Indian personal name. Harmless, and a small creature with a human-sounding name is charming, but if the Director wants creatures to feel clearly non-human, this is the one to watch.
- **Padakanan** with the meaning "the grove at the foot (of the dunes)": this settles the open question from T-004 cleanly, and the Devanagari पादकानन matches that reading. Confirmed as it stands. If the Commander ever wants the "tree-grove" reading instead, it becomes पादपकानन, but there is no reason to change it.
- **Szynthar** / सिन्थार: "sz" has no Devanagari letter, so सिन्थार is a best fit and will be read "sin-thaar". Worth one line with Medhanshu, since it is his word: does he want it said *SIN-thar* or *ZIN-thar*? The choice should then be fixed everywhere, including the voice work.

---

## 4. For the voice work: the names have to be *said*, and that needs one extra column

This is not a naming problem but it lands on the names, so it belongs here. SARATHI will say these names aloud, and the `say` strings as written are for a human reader, not for a text-to-speech engine. Two rules that save a whole round of re-recording:

1. **For the Indian-English voice, give the engine a respelling, never the Latin spelling.** A TTS engine reading "Mooladri" will produce something like "moo-lad-ree" or spell it out. A respelling fixes it.
2. **For the Hindi and Marathi voices, give the engine the Devanagari.** That is what it is built for, and it will pronounce मूलाद्रि correctly without help. This is the one place where the Devanagari column earns its keep beyond the Codex.

Paste-ready respellings, if the Director wants to add a `tts` field to `Name`:

| Name | Respelling for the Indian-English voice |
| --- | --- |
| Mooladri | Moo laad ree |
| Shailasarpa | Shy la sur pa |
| Balukavela | Baa lu kaa vay la |
| Himavela | Hee ma vay la |
| Meghapakshi | May gha puk shee |
| Tantukari | Tun too kaa ree |
| Deepajana | Dee pa ja na |
| Khanik | Khaa nik |
| Maruyatri | Ma roo yaat ree |
| Jalabandhu | Ja la bun dhoo |
| Patangajana | Pa tun ga ja na |
| Shvasajana | Shvaa sa ja na |
| Jyotishalabha | Jyoh ti sha la bha |
| Golakarka | Go la kur ka |
| Lavana | La va na |
| Szynthar | Zin thar (or Sin thar, once the Commander has chosen) |
| Lambagriva | Lum ba gree va |
| Marumina | Ma roo mee na |
| Nakshatrajala (or Tarakajala) | Nuk shut ra ja la (or Taa ra kaa ja la) |
| Himakarka | Hee ma kur ka |
| Meghapota | May gha po ta |
| Tarangini | Ta run gi nee |
| Kathorakita | Kuth oh ra kee ta |
| Neelachhaya | Nee la chhaa yaa |
| Padakanan | Paa da kaa na nun |
| Jivagraha | Jee va gru ha |
| Taptashila | Tup ta shee laa |
| Marubhumi | Ma ru bhoo mi |
| Himasagara | Hee ma saa ga ra |
| Vayumandala | Vaa yu mun da la |
| Vishamegha | Vi sha may gha |
| Shunyapath | Shoon ya puth |

Use **spaces, not hyphens**; several engines read a hyphen aloud as a pause or a word break. If an engine still swallows a name, the fallback is to record that one line by hand rather than fight it.

---

## 5. What I would do next, if the Director agrees

1. Apply the three one-line fixes above (Khanik, Kathorakita, Jyotishalabha) and, if the Commander wants it, Nakshatrajala.
2. Add the `tts` respelling field so the voice work never has to guess.
3. When T-006 lands, the Codex entries should show the Devanagari beside the Latin name with the literal meaning in one line, as the Codex type already allows (`name`, `deva`). That turns thirty invented names into thirty small lessons, at no cost.

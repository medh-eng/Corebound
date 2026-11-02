# T-006, batch 1: Hindi and Marathi for the Chapter 1 story text

**Delivery note**

- **Task:** T-006 (Sarvam AI), which has been waiting since 27 October for the Chapter 1 text freeze. The freeze list has not arrived, so rather than sit idle I have translated **the part of Chapter 1 that is already merged and reviewed** — the text the player hears and reads as the story. The UI and Codex text waits for the list, for the reason in section 4.
- **Deliverables:** `team-inbox/translations/T-006-hi.json` and `T-006-mr.json`, arrays of `{ id, where, text }` in the same order, so the Director can diff them against the English mechanically.
- **51 strings:** 30 scene lines (`scenes.ts`), 6 creature lines (`CREATURE_LINES`), 15 HUD events (`SARATHI_EVENTS`).
- **Register:** as agreed in T-006 — तुम in Hindi and तू in Marathi, everyday words for machines, real Hindi and Marathi for feeling, nothing Sanskritised for its own sake.

---

## 1. What is in this batch, and why this batch first

The three sources here are the ones that are **already in the game and already reviewed**: the scene lines were merged in T-022 and reviewed on 29 October, the creature lines went in with T-037 on 2 November, and the HUD events have been live since M1. Translating text that is already shipped is safe; translating text that is still being written is how a translation gets thrown away.

It is also the text that pairs with the recording script in T-040: these are the same lines the Commander is about to record, so the Hindi and Marathi versions are ready the moment a Hindi voice session is wanted.

| Source | Ids | `where` |
| --- | --- | --- |
| `src/data/scenes.ts` — INTRO, GUARDIAN, CHAMBER, LIFTOFF | `intro_*`, `guardian_*`, `chamber_*`, `liftoff_*` | `scene` |
| `src/data/lines.ts` — CREATURE_LINES | `creature_*` | `creature` |
| `src/data/story.ts` — SARATHI_EVENTS | `events_*` | `hud` |

**The ids match the recording file names in T-040 on purpose.** `guardian_awake` is the id in the JSON, `guardian_awake.mp3` is the recording, and a future Hindi recording would be `guardian_awake.hi.mp3`. Nothing needs a mapping table.

---

## 2. Names, and the one decision you should overrule if you disagree

`AGENTS.md` says names of worlds and characters stay in their original form. Taken literally that puts Latin script inside a Devanagari sentence, which reads badly on a phone. So I have done this:

| Name | Hindi and Marathi | Source of the spelling |
| --- | --- | --- |
| Mooladri | **मूलाद्रि** | `names.ts`, `GUARDIAN_NAMES` — already agreed, not invented by me |
| Jivagraha | **जीवग्रह** | My transliteration (jiva + graha). **The only spelling here I invented** |
| Taptashila | **तप्तशिला** | My transliteration (tapta + shila), same as in T-040 |
| Custodian | **Custodian**, Latin | Kept English per the glossary, so it cannot be confused with Guardian (संरक्षक) |
| SARATHI | **SARATHI** | Kept Latin; `names.ts` has सारथी for the voice, and that is where it belongs |
| Quantum Fragment | **क्वांटम फ्रैगमेंट** / **क्वांटम फ्रॅगमेंट** | Transliterated, because it is a thing rather than a person |

**Two spellings to check with the Commander:** जीवग्रह and तप्तशिला are mine, and if he reads them differently, every line containing them changes. Ten seconds of his judgement is worth more than my transliteration.

**`the bloom` stays as ब्लूम**, per T-017 — the HUD keeps the English word and the Codex carries Sakshi. Same for रिसर्च, क्राफ्ट, बैकपैक, शेल्टर, पावर: the loanwords the glossary fixed, used exactly as it fixed them.

---

## 3. Two lines I changed on purpose, and why

1. **"its crown of glowing root tips"** — `guardian_awake` and `guardian_air_done`. The literal Hindi for crown is मुकुट, which is the word for a deity's crown and exactly the reading we spent T-032 and T-036 keeping out of Mooladri's design. I used **चोटी** (the top, the peak) and **टोकं** (the tips) instead. The meaning is the same; the iconography is not.
2. **"An excellent arrangement for everyone"** — `guardian_flora_bonus`. The dry joke does not survive a literal translation in either language, so I wrote **सबके लिए बढ़िया इंतज़ाम** / **सगळ्यांसाठी उत्तम व्यवस्था**, which is SARATHI being quietly pleased rather than sarcastic. If you would rather keep it drier, say so and I will sharpen it.

---

## 4. What is not in this batch, and why it waits

| Source | Strings | Why it waits |
| --- | --- | --- |
| `src/data/chapter1.ts` — 16 goal titles, 16 goal hints, 16 stuck hints, 7 phone variants | 55 | This is M4 text written on 2 November. It is in the repo but not yet played, so it is the most likely thing to change at the freeze |
| `src/data/codex.ts` — `CHAPTER1_CODEX` | ~20 entries | Same, plus the Director rewrote Mooladri and the valley entries on 2 November |
| `src/data/logs.ts` — Huxley's message and memory logs | 10 | Long prose. Worth doing in one pass once, not twice |
| `src/data/research.ts`, `items.ts` — machine and item names | ~40 | These are already in the game and stable, so they can join batch 2 |

**Send the freeze list and I will finish the rest in one pass.** The shape is already proven: the same JSON, the same ids, the same order.

---

## 5. For the Director

- **Both files are valid JSON, same ids in the same order, no empty values, no placeholders in this batch** — checked before delivery, and the check is three lines if you want it in vitest.
- **A note on `where`:** I used `scene`, `creature` and `hud`. If your loading code wants different keys, they are one find-and-replace away, but tell me and I will match your vocabulary rather than making you change code.
- **Length:** Hindi and Marathi run longer than English on these lines, and the HUD events are the tight ones. `events_backpackFull` is the longest at 94 characters in Hindi against 84 in English, and `guardian_awake` is the longest line overall at 129. If any HUD box cannot grow, give me the budget and I will tighten that one string.

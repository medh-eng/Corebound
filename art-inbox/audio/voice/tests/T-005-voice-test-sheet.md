# T-005: SARATHI voice test — recording sheet

**Delivery note**

- **Task:** T-005, assigned to Sarvam AI (Bulbul text-to-speech).
- **What this is:** everything needed to produce the voice test in one sitting: the exact lines, four voice types to try, the settings to use, the exact file names, and the Hindi and Marathi versions of lines 1 and 3, already translated and checked.
- **What this is not:** the audio files themselves. This worker could not reach a text-to-speech engine from this session, so it has done every part of T-005 except the button press. The Commander generates the files in Sarvam's Bulbul playground or dashboard using this sheet, then uploads them to this folder.
- **Nothing was guessed about voice names.** Bulbul's voice list changes; the sheet asks you to try four *kinds* of voice and to write down which one you actually used, rather than naming voices that may no longer exist.

---

## 1. The five test lines (Indian English)

Read exactly as written. Punctuation is deliberate: the full stops are where SARATHI pauses.

| # | Line | What it is testing |
| --- | --- | --- |
| 1 | `Oxygen at sixty percent. The forest is beautiful, but it will not breathe for you.` | The everyday warning voice. A number, then a warm aside, then a dry truth. If a voice can do the second sentence kindly and not smugly, it can play SARATHI. |
| 2 | `Ice detected in the blue crystals. Hold the laser on them. Gently. They have been waiting a long time.` | Short commands, then one word alone for emphasis, then something almost poetic. Tests whether the voice can slow down without sounding sad. |
| 3 | `Shelter air restored. You may now take off your worried expression.` | The joke. It must land as dry, not sarcastic. This line will decide more voices than any other. |
| 4 | `Something very large just moved beneath us. I would like it noted that I am not worried. I am merely recalculating.` | The long one. Tests breath, pace and whether the voice can sound slightly pompous and still likeable. |
| 5 | `Custodian, the seeds are still safe. So are you. That is two good things.` | The kind one. Said to the player, quietly, at the end of a hard day. Tests warmth without syrup. |

---

## 2. Voices to try

Try **four** voices, chosen to be genuinely different from each other, so the choice is real. In Sarvam's Bulbul voice list, pick one of each kind and note its name in the table in section 6:

| Slot | The kind of voice | Why this kind |
| --- | --- | --- |
| A | A warm mid-register female voice | The safest read of "helpful ship AI". Most players will accept this immediately. |
| B | A calm male voice, low and unhurried | Gives SARATHI authority without volume. Good for the dry lines. |
| C | A brighter, quicker voice | The risk-taking option. If it works, SARATHI feels like a companion rather than a system. |
| D | The lowest-register voice available, either sex | Tests the opposite extreme: a ship that sounds old and certain. |

**Settings for all four:** pace **medium** (not slow, not brisk); pitch **default or one step down**; no emphasis tags on the first pass; export **WAV, 44.1 kHz, mono**.

If a voice has a "news" or "formal" preset, avoid it. SARATHI is calm, not official.

---

## 3. File names

Save exactly as below, all in `art-inbox/audio/voice/tests/`. Lowercase, underscores, no spaces.

**Indian English, all four voices, all five lines (20 files):**

```
sarathi_test_A_1.wav   sarathi_test_A_2.wav   sarathi_test_A_3.wav   sarathi_test_A_4.wav   sarathi_test_A_5.wav
sarathi_test_B_1.wav   sarathi_test_B_2.wav   sarathi_test_B_3.wav   sarathi_test_B_4.wav   sarathi_test_B_5.wav
sarathi_test_C_1.wav   sarathi_test_C_2.wav   sarathi_test_C_3.wav   sarathi_test_C_4.wav   sarathi_test_C_5.wav
sarathi_test_D_1.wav   sarathi_test_D_2.wav   sarathi_test_D_3.wav   sarathi_test_D_4.wav   sarathi_test_D_5.wav
```

If a slot ends up unused, skip its files; do not rename the others. Keep the letter, so the Director can map a file back to a voice.

**Hindi and Marathi, lines 1 and 3 only, best two voices (8 files):**

```
sarathi_test_A_hi_1.wav   sarathi_test_A_hi_3.wav
sarathi_test_B_hi_1.wav   sarathi_test_B_hi_3.wav
sarathi_test_A_mr_1.wav   sarathi_test_A_mr_3.wav
sarathi_test_B_mr_1.wav   sarathi_test_B_mr_3.wav
```

Record the English files first, choose the two voices that sound most like SARATHI, then record the Hindi and Marathi with those two only. This saves half the work.

---

## 4. Hindi versions (lines 1 and 3)

| # | Hindi | Transliteration | Notes |
| --- | --- | --- | --- |
| 1 | ऑक्सीजन साठ प्रतिशत है। जंगल बहुत सुंदर है, लेकिन यह तुम्हारे लिए सांस नहीं लेगा। | Oxygen saath pratishat hai. Jangal bahut sundar hai, lekin yeh tumhare liye saans nahin lega. | Everyday Hindi, no heavy words. SARATHI addresses the player as *tum*, which is how a ship that has known you for a while would speak; if the Director prefers distance, change *tumhare* to *aapke*. |
| 3 | शेल्टर की हवा वापस आ गई है। अब तुम अपनी चिंता वाली शक्ल हटा सकते हो। | Shelter ki hawa wapas aa gayi hai. Ab tum apni chinta wali shakl hata sakte ho. | *Shelter* is kept in English because it is the name of the in-game shelter; translating it to *आश्रय* would break the link with the HUD. The joke survives: *chinta wali shakl*, "your worried face", is the kind of dry thing a Hindi-speaking player will smile at. |

**Caution for the voice:** the Devanagari is written for a TTS engine that reads Hindi natively. If a voice mangles *ऑक्सीजन*, the fallback spelling is **ओक्सीजन**; if it mangles *प्रतिशत*, **फ़ीसदी** is the spoken alternative and sounds more natural on a HUD line anyway.

---

## 5. Marathi versions (lines 1 and 3)

| # | Marathi | Transliteration | Notes |
| --- | --- | --- | --- |
| 1 | ऑक्सिजन साठ टक्क्यांवर आहे. जंगल खूप सुंदर आहे, पण ते तुमच्यासाठी श्वास घेणार नाही. | Oxygen saath takkyanvar aahe. Jangal khup sundar aahe, pan te tumchya sathi shwaas ghenaar nahi. | Natural spoken Marathi. SARATHI uses *tumhi*, the respectful-but-warm form, which is right for a ship speaking to the Custodian. |
| 3 | शेलटरची हवा पूर्ववत झाली आहे. आता तुम्ही काळजीचे भाव चेहऱ्यावरून हटवू शकता. | Shelterchi hawa purvavat jhali aahe. Aata tumhi kaaljiche bhaav chehryavarun hatvu shakta. | Same reasoning on *Shelter*. *काळजीचे भाव* is "the look of worry"; it is slightly more formal than the Hindi, which suits Marathi's tone. If it sounds stiff when spoken, **आता तुम्ही काळजी सोडून द्या** ("now let the worry go") is a warmer, shorter alternative. |

Both translations keep the same beat as the English: statement, pause, then the dry line. Neither adds or drops information.

---

## 6. Which voice was which (fill this in and keep it with the files)

| Slot | Voice name in Sarvam | Language(s) used | Anything that sounded wrong |
| --- | --- | --- | --- |
| A | | | |
| B | | | |
| C | | | |
| D | | | |

---

## 7. Listening scorecard (for the Commander and the Director)

Play each voice on lines 3 and 4 and mark it out of 5. The Director will do the same from the files, and the two scores together pick the voice.

| Voice | Calm (not robotic) | Warm (not sweet) | Dry humour lands | Clear at 60% volume | Overall |
| --- | --- | --- | --- | --- | --- |
| A | | | | | |
| B | | | | | |
| C | | | | | |
| D | | | | | |

**What to listen for, in one line each:** a voice that says "Gently." without turning it into a warning; a voice that says "I am not worried" without a wink; a voice you would not mind hearing four hundred times.

---

## 8. After the Commander has chosen

The chosen voice and its settings get written into `docs/PROMPTS.md` §14 by the Director, and every later SARATHI line is generated with it, named from the line's id in `src/data/` (for example `sarathi_goal_ice.wav`). When the Chapter 1 script is frozen at M4 (task T-006), this worker can produce the full line set and the Hindi and Marathi voice sets together, so all three languages share one voice and one pace.

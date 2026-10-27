# T-006 preparation: glossary and pilot translation

**Delivery note**

- **Not the T-006 deliverable.** T-006 is still waiting on the M4 text freeze, and its own rules say the Director will attach the English source as JSON with ids. This is the work that can be done *before* the freeze, so that the freeze takes an afternoon instead of a week: a glossary that fixes every recurring term, and a pilot of twelve real strings from `src/data/story.ts` so the Commander and the Director can hear the tone and correct the terminology while it is still cheap.
- **What I did:** read `src/data/story.ts`, `items.ts`, `research.ts`, `codex.ts` and `names.ts` to take the terms from the game as it actually is, not from the GDD. Built a glossary of 45 terms with Hindi and Marathi, each marked with a register decision. Then translated the 9 SARATHI event lines and 3 goal texts into both languages, reviewed them line by line, and listed every change I made to the machine output and why.
- **Register, decided and argued in section 1:** everyday Hinglish for systems and machines, real Hindi and Marathi for feelings and for SARATHI, and no textbook Sanskritised vocabulary. A 12-year-old who says "backpack" and "craft" in English should read "बैकपैक" and "क्राफ्ट", not a word they have never spoken aloud.
- **Uncertain, please check:** eight technical nouns (ore, silica, conveyor, pylon, silo and three others) where the standard Hindi or Marathi word exists but is textbook vocabulary rather than speech. For those I recommend keeping the English word and I say so in the table. If the Commander's family speaks Marathi at home, five minutes of "would a 12-year-old say this?" over those rows is worth more than my judgement.
- **Nothing here touches the game.** No files changed; this is a note for the Director.

---

## 1. The register decision, which everything else follows from

There are two ways to translate a game like this and one of them is wrong.

**Wrong:** pure, formal, Sanskritised Hindi and Marathi. शुद्ध हिंदी for "power" is विद्युत्, for "research" is अनुसंधान, for "backpack" is पीठपेटी. Every one of those words is correct and none of them is a word a twelve-year-old uses while playing a game. The result reads like a government notice, and the player switches the language back to English.

**Right:** how Indian players actually talk. Hindi and Marathi sentences with English nouns for the things that are English nouns in the player's own head: बैकपैक, क्राफ्ट, रिसर्च, पावर, स्लॉट, सेव, लोड. This is not laziness, it is accuracy: it is what a bilingual player in Pune or Lucknow says out loud.

So the rule, in one line:

> **Systems and machines speak the player's Hinglish. Feelings, warnings and SARATHI speak real Hindi and Marathi. Nothing speaks textbook Sanskrit.**

Applied per language:

- **Hindi:** तुम register for SARATHI, because a ship that has known you for a while would not use आप. Feminine/masculine agreement follows the noun the player already sees (ड्रिल is feminine, मशीन is feminine, बैकपैक is masculine).
- **Marathi:** तू register, which is what a close companion uses and what Marathi games and dubs actually use. Do not mix तू and तुम्ही inside one screen; the machine output did exactly that in the pilot, and I fixed it.
- **Both:** keep the loanword when the loanword is the word. Keep key names (Q, E, Tab, B, C, G), units (m, kW, %), and Western digits 0–9 in Latin numerals, because the HUD around them uses them and Devanagari numerals beside Latin ones look like a bug.
- **Never translate:** world names (Jivagraha, Taptashila…), character names (SARATHI, Huxley, Voss), creature and people names (Mooladri, Szynthar, Deepajana…), and the player's title **Custodian**. On that last one: translating it to रक्षक would collide with Guardian, which I do translate (संरक्षक), so Custodian stays English and stays a title.

---

## 2. Glossary: 45 terms

**Register key:** **T** = translate. **K** = keep the English word. **T+** = translate, with the English in brackets the first time it appears on a screen. **?**

| Term (as in the game) | Hindi | Marathi | Reg. | Note |
| --- | --- | --- | --- | --- |
| Harmony (the world's health) | संतुलन | समतोल | T | The central concept. Both words mean balance, which is the actual mechanic. Do not use सामंजस्य: it means "coordination", not "balance" |
| Power (kW) | पावर | पॉवर | K | Every Indian player says पावर. विद्युत would be understood and never spoken |
| Research | रिसर्च | रिसर्च | K | Also the verb: रिसर्च करो / रिसर्च कर |
| Craft | क्राफ्ट | क्राफ्ट | K | क्राफ्ट करो / क्राफ्ट कर. Not बनाना alone, because बनाना also means "to build a base" and the two must stay distinct |
| Backpack | बैकपैक | बॅकपॅक | K | The Tab key's whole identity |
| Slot / Stack | स्लॉट / स्टैक | स्लॉट / स्टॅक | K | |
| Recipe | रेसिपी | रेसिपी | K | Not विधि, which means method |
| Goal (the objective list) | लक्ष्य | ध्येय | T | Both are ordinary school words, understood by every player |
| Save / Load | सेव / लोड | सेव / लोड | K | |
| Settings | सेटिंग्स | सेटिंग्ज | K | |
| Pause / Resume / Quit | रोको / जारी / बाहर | थांबवा / सुरू / बाहेर | T | Menu words, so short beats formal |
| Volume / Mouse sensitivity / Shadows | आवाज़ / माउस सेंसिटिविटी / शैडो | आवाज / माउस संवेदनशीलता / शॅडो | K/T | आवाज़ and आवाज translate; the other two are better kept English |
| Shelter | शेल्टर | शेल्टर | K | It is a place name as much as a noun. Do not use आश्रय |
| Oxygen / O₂ | ऑक्सीजन / O₂ | ऑक्सिजन / O₂ | K | Keep the subscript form exactly as the HUD shows it |
| Air (breathable) | हवा | हवा | T | |
| Ice | बर्फ | बर्फ | T | |
| Iron ore | लोह-अयस्क | लोखंड धातुक | ? | **Uncertain.** Both are textbook-correct and neither is speech. If in doubt, keep "Iron ore" in Latin. Ask a 12-year-old |
| Silica | सिलिका | सिलिका | K | सिलिका is what the school chemistry book says, so it is understood |
| Carbon | कार्बन | कार्बन | K | |
| Iron plate | लोहे की प्लेट | लोखंडी प्लेट | T | Natural in both languages |
| Silicon | सिलिकॉन | सिलिकॉन | K | |
| Electrolyzer | इलेक्ट्रोलाइज़र | इलेक्ट्रोलायझर | K | Long word; the Hindi/Marathi UI must not wrap it mid-word |
| Battery | बैटरी | बॅटरी | K | |
| Solar lotus | सोलर कमल | सोलर कमळ | T | कमल / कमळ is the everyday word for lotus, not a religious term |
| Smelter | स्मेल्टर | स्मेल्टर | K | |
| Auto-drill | ऑटो-ड्रिल | ऑटो-ड्रिल | K | ड्रिल is feminine in Hindi, neuter/feminine in Marathi: agreement matters (see the pilot's E9) |
| Conveyor | कन्वेयर | कन्व्हेयर | K | **Uncertain** whether to translate as पट्टी (belt); कन्वेयर is safer and matches the C key |
| Storage silo | स्टोरेज साइलो | स्टोरेज सायलो | K | **Uncertain.** साइलो is borrowed in both languages and understood |
| Power pylon | पावर पाइलन | पॉवर पायलन | K | **Uncertain.** No everyday word exists |
| Coal burner | कोल बर्नर | कोल बर्नर | K | |
| Silicon furnace | सिलिकॉन भट्टी | सिलिकॉन भट्टी | T | भट्टी / भट्टी is the everyday word for a furnace or kiln |
| Research station | रिसर्च स्टेशन | रिसर्च स्टेशन | K | |
| Scanner | स्कैनर | स्कॅनर | K | |
| Codex | कोडेक्स | कोडेक्स | K | |
| Translator | ट्रांसलेटर | ट्रान्सलेटर | K | It is also a physical object in the game |
| Resonance emitter | रेज़ोनेंस एमिटर | रेझोनन्स एमिटर | K | **Uncertain.** Long, and it must never sound like a weapon in either language |
| Guardian (the six) | संरक्षक | संरक्षक | T | Same word in both, and it is the ordinary word for a protector. Their individual names are never translated |
| Custodian (the player) | Custodian | Custodian | K | Kept English so it cannot be confused with Guardian. If the Commander prefers Hindi, the safe option is मुख्य रक्षक, but I would keep the English |
| SARATHI | सारथी | सारथी | — | Name, so no translation; but the Devanagari is useful for the Hindi/Marathi voice |
| The peoples (Deepajana etc.) | दीपजन… | दीपजन… | — | Names only, in Devanagari, never translated |
| Seeds / seed vault | बीज / बीज वॉल्ट | बिया / बिया व्हॉल्ट | T/K | बीज / बिया translate; "vault" stays English |
| Launch pad | लॉन्च पैड | लॉन्च पॅड | K | |
| Spaceship | स्पेसशिप | स्पेसशिप | K | यान is correct and cold; स्पेसशिप is what a player says |
| Memory log | मेमोरी लॉग | मेमरी लॉग | K | |
| Wake / waking (a Guardian) | जागना | जागणे | T | The story's key verb. In Hindi "संरक्षक जाग रहा है", in Marathi "संरक्षक जागत आहे" |

---

## 3. Pilot: twelve real strings, reviewed

Source: `src/data/story.ts` (`SARATHI_EVENTS` and three `CHAPTER1_GOALS`). These are live in the game today, so this is the real text, not a sample written for the occasion.

**How to read the table:** the *Hindi* and *Marathi* columns are my reviewed versions, not raw machine output. The *What I changed* column lists every correction I made, because those corrections are the useful part: they are the same mistakes a machine will make at the freeze, and knowing them now saves a review cycle then.

| id | English | Hindi | Marathi | What I changed |
| --- | --- | --- | --- | --- |
| `lowOxygen` | Oxygen below twenty-five percent. Get to the shelter, or breathe a canister with Q. | ऑक्सीजन 25% से नीचे है। शेल्टर में जाओ, या Q दबाकर कैनिस्टर से सांस लो। | ऑक्सिजन 25% च्या खाली आहे. शेल्टरमध्ये जा, किंवा Q दाबून कॅनिस्टरमधून श्वास घे. | Machine output had "कैनिस्टर **में** सांस लो" (breathe *in* the canister) and "कॅनिस्टर**मध्ये** श्वास घ्या". Both are wrong: you breathe *from* it. Also added "Q दबाकर / Q दाबून", since the English says the key does something, and made Marathi तू-consistent |
| `blackout` | You blacked out. I carried you back to the shelter. Please do not make me do that again. | तुम बेहोश हो गए थे। मैं तुम्हें उठाकर वापस शेल्टर ले आया। प्लीज़, मुझसे दोबारा ऐसा मत करवाओ। | तू बेशुद्ध झालास. मी तुला उचलून परत शेल्टरमध्ये आणलं. प्लीज, मला पुन्हा असं करायला लावू नकोस. | The Marathi "करू नकोस" means "don't do that"; the English is "don't make *me* do that", which is the joke. Changed to करायला लावू नकोस |
| `nightFalls` | The sun is setting. Solar output dropping. | सूरज ढल रहा है। सोलर आउटपुट कम हो रहा है। | सूर्य मावळत आहे. सोलर आउटपुट कमी होत आहे. | Nothing. This one came back right in both |
| `sunrise` | Sunrise. Solar power returning. | सूरज निकल आया। सोलर पावर वापस आ रही है। | सूर्य उगवला. सोलर पॉवर परत येत आहे. | "सूरज उगा" is stiff Hindi; सूरज निकल आया is what people say |
| `backpackFull` | Your backpack is full. Craft something, or we will need machines to carry more. | तुम्हारा बैकपैक भर गया है। कुछ क्राफ्ट करो, वरना और सामान ढोने के लिए हमें मशीनें चाहिए होंगी। | तुझं बॅकपॅक भरलं आहे. काहीतरी क्राफ्ट कर, नाहीतर आणखी सामान वाहून नेण्यासाठी आपल्याला मशीन्स लागतील. | "बैकपैक फुल है" is English word order with Hindi words; भर गया है is the natural phrase |
| `tooClose` | Not here — I will not let you dig under the shelter. | यहाँ नहीं — मैं तुम्हें शेल्टर के नीचे खुदाई नहीं करने दूँगा। | इथे नाही — मी तुला शेल्टरच्या खाली खोदकाम करू देणार नाही. | Nothing. Both are right, and both keep SARATHI's "I will not let you" firmness |
| `researched` | Research complete: | रिसर्च पूरी हुई: | रिसर्च पूर्ण झाली: | Hindi agreement: रिसर्च is feminine, so "पूरी हो गई" not "पूरा हुआ". This string is followed by the research name, so the colon must survive |
| `noPower` | That machine has no power. Build it within 30 m of the shelter, or carry power out with pylons. | उस मशीन में पावर नहीं है। इसे शेल्टर से 30 मीटर के अंदर बनाओ, या पाइलन से पावर बाहर ले जाओ। | त्या मशीनमध्ये पॉवर नाही. ती शेल्टरच्या 30 मीटरच्या आत उभी कर, किंवा पायलोनने पॉवर बाहेर घेऊन जा. | Marathi had **३०** in Devanagari numerals next to Latin elsewhere; normalised to 30. "बांध" is for buildings, so a machine is "उभी कर" (stand it up) |
| `drillFull` | A drill is full and has stopped. Empty it, or give it a belt. | एक ड्रिल भर गई है और रुक गई है। इसे खाली करो, या इससे बेल्ट जोड़ो। | एक ड्रिल भरली आहे आणि थांबली आहे. ती रिकामी कर, किंवा तिला बेल्ट जोड. | Machine output had "ड्रिल मशीन भरलं आहे" (neuter) — ड्रिल is feminine in both languages, so भरली / थांबली / रिकामी. Also "बेल्ट पहनाओ" (put a belt *on it*, like clothing) became जोड़ो / जोड, connect |
| `ice` (goal) | Mine 3 ice — hold the left mouse button on the blue crystals | 3 बर्फ निकालो — नीले क्रिस्टल पर बायाँ माउस बटन दबाए रखो | 3 बर्फ काढ — निळ्या क्रिस्टल्सवर डावं माऊस बटण दाबून धर | Machine output used **formal** निकालें / दबाए रखें while every other line used तुम. Fixed the register. Also "माईन कर" in Marathi is a clumsy transliteration of a verb; काढ (take out) is what people say |
| `breathe` (goal) | Step into your shelter and breathe | अपने शेल्टर में जाओ और सांस लो | तुझ्या शेल्टरमध्ये जा आणि श्वास घे | Nothing |
| `done` (goal) | Explore, research, automate — and keep your shelter breathing | खोजो, रिसर्च करो, ऑटोमेट करो — और अपने शेल्टर की हवा चलती रखो। | एक्सप्लोर कर, रिसर्च कर, ऑटोमेट कर — आणि तुझ्या शेल्टरची हवा चालू ठेव. | **The machine got the meaning wrong** in both: it read "keep your shelter breathing" as "keep breathing inside your shelter". The English means keep the shelter's air running. This is the kind of error that only a human read catches, and it is exactly why the pilot exists |

**What the pilot shows:** the machine is good at sentences and unreliable at three things — prepositions ("breathe *from* a canister"), grammatical gender of loanwords (ड्रिल), and English idioms that look literal ("keep the shelter breathing"). All three are fixable in review, but only if the review happens. Budget one pass per language for it, and expect about one correction per eight strings.

---

## 4. What the freeze should look like (a request to the Director, not a rule)

If T-006 is to go quickly when M4 comes, the English source is best delivered as a JSON array of objects with three fields, and nothing else:

```json
[
  { "id": "lowOxygen", "where": "hud", "text": "Oxygen below twenty-five percent. Get to the shelter, or breathe a canister with Q." },
  { "id": "goal_ice", "where": "goal", "text": "Mine 3 ice — hold the left mouse button on the blue crystals" }
]
```

- **`id`** — must match the key in the code, so the Director can wire it back with no mapping table. If it differs, say so and give both.
- **`where`** — `hud`, `goal`, `codex`, `story`, `menu`. It matters because a HUD string must stay short (about 60 characters in Hindi, which is 15–20% longer than English) and a Codex entry can breathe. Without it I will guess, and the guess will be wrong for the one screen that matters.
- **`text`** — the English, exactly as the player sees it, placeholders included. Keep `{n}`, `<b>E</b>` and `\n` exactly as they are; I will keep them too.

Then I deliver `T-006-hi.json` and `T-006-mr.json` with the same ids in the same order, and the Director can diff them against the English mechanically.

Two things that would help me and cost the Director nothing:

1. **Freeze the SARATHI lines first and separately.** They are the ones that go to a voice, and a voice recording is expensive to redo. Goals and Codex text can change at the last minute; a recorded line cannot.
2. **Say which strings are allowed to grow.** Hindi runs 15–20% longer than English and Marathi about the same. If a HUD element has no room for that, tell me the character budget and I will write tighter, rather than delivering something correct that overflows the box.

---

## 5. If the Commander wants to hear it before M4

The pilot above is twelve strings. If it would help to hear the *tone* rather than read it, the same twelve can be produced as audio in the two best voices from T-005 once those are chosen, so the Commander can judge Hindi and Marathi SARATHI by ear before the whole chapter is translated. That is one recording session and it would settle the register question for good.

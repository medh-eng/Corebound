# T-033: Hindi and Marathi for controls, tips, phone help and the privacy notice

**Delivery note**

- **Task:** T-033 (Sarvam AI). Every string in `src/data/controls.ts` and `src/data/tips.ts`, the phone-help lines and the privacy notice from T-027, in Hindi and Marathi, keyed so the Director can wire them with no mapping table.
- **Register:** the one decided in T-006 and already agreed — everyday Hinglish for systems and machines, real Hindi and Marathi for everything a person says. Tips and phone help address the player as **तुम** in Hindi and **तू** in Marathi, the same as the pilot goals. **The privacy notice is the one exception:** it uses **आप / तुमचे** formal, because it is a legal notice and not a character talking.
- **Nothing in the game was changed.** This is text for the Director to wire; the code changes are the Director's, and section 7 says exactly what they are.
- **One structural finding you need before the text:** the touch-word table in `controls.ts` is an **English** find-and-replace table. It cannot work on Hindi or Marathi text, for a reason that is grammar, not vocabulary. Section 2 explains it and gives two ways out.

---

## 1. What was translated

| Source | Strings | Status |
| --- | --- | --- |
| `src/data/controls.ts` — the touch words (the replacement side of `TOUCH_WORDS`) | 20 | done |
| `src/data/tips.ts` | 15 | done |
| Phone help, T-027 (heading plus 11 lines) | 12 | done |
| Privacy notice, T-027 (7 headings, 7 paragraphs) | 14 | done |

Every key is either the English source string (`controls.ts`, which has no ids) or the section id I have given it (`tip_01`, `phone_04`, `privacy_collect_2`), and the English is carried alongside in the tips, phone and privacy blocks so the mapping is checkable at a glance rather than by counting.

---

## 2. Read this first: the touch-word table cannot work in Hindi or Marathi

`controls.ts` does not hold sentences. It holds a list of **regexes over English** and the English touch replacement for each: `/\bpress E\b/gi → 'tap Use'`. It is applied to already-written English text at display time.

Two things break when the text is Hindi or Marathi:

1. **The patterns match English words.** `press E`, `click`, `hold the left mouse button` — none of these appear in Hindi or Marathi text, so every rule silently does nothing. A Hindi player would see the keyboard wording, not the button wording.
2. **Even translated, a word-for-word substitution cannot produce a Hindi sentence.** English puts the verb after the button name and Hindi puts it before: "tap Use" → "Use टैप करो", which is fine as a whole string but impossible as a substitution, because the rule replaces only the verb and would leave "टैप करो the drill". The same is true of the bare `click → tap` rule, which in Hindi has no place to land.

**Two ways out, and I recommend the first.**

- **Preferred: give each touch string both versions at source.** Instead of rewriting English at runtime, keep a `hi` and `mr` variant of each goal, tip and prompt next to the English one, written for touch directly. That is a data change, it removes a regex table from the hot path, and it is the only version that will read naturally in either language.
- **Fallback: keep the table, but per language.** Add `TOUCH_WORDS_HI` and `TOUCH_WORDS_MR` with the patterns written against the Hindi and Marathi sentences, and the whole-phrase replacements below. It works, it stays fragile, and every new line of text needs a new pattern in three languages.

The block below is written so it can be used either way: the key is the English touch string, so it doubles as a lookup for the data approach.

---

## 3. `controls.ts` — the touch words

```ts
// Keyed by the English touch string in TOUCH_WORDS.
export const TOUCH_WORDS_I18N: Record<string, { hi: string; mr: string }> = {
  "hold Mine": { hi: "Mine दबाए रखो", mr: "Mine दाबून धर" },
  "hold Scan": { hi: "Scan दबाए रखो", mr: "Scan दाबून धर" },
  "Mine (hold)": { hi: "Mine (दबाए रखो)", mr: "Mine (दाबून धर)" },
  "Scan (hold)": { hi: "Scan (दबाए रखो)", mr: "Scan (दाबून धर)" },
  "tap Belt, then Pick on the drill, then Pick on the smelter": { hi: "Belt टैप करो, फिर drill पर Pick, फिर smelter पर Pick", mr: "Belt टॅप कर, नंतर drill वर Pick, नंतर smelter वर Pick" },
  "aim at the machine that sends and tap Pick, then the one that receives": { hi: "जो मशीन भेजती है उस पर निशाना लगाओ और Pick टैप करो, फिर जो मशीन लेती है उस पर", mr: "जी मशीन पाठवते तिच्यावर निशाना लाव आणि Pick टॅप कर, नंतर जी मशीन घेते तिच्यावर" },
  "<b>Use</b>": { hi: "<b>Use</b>", mr: "<b>Use</b>" },
  "<b>Pick up</b>": { hi: "<b>Pick up</b>", mr: "<b>Pick up</b>" },
  "(Use)": { hi: "(Use)", mr: "(Use)" },
  "(Bag)": { hi: "(Bag)", mr: "(Bag)" },
  "tap Use": { hi: "Use टैप करो", mr: "Use टॅप कर" },
  "tap Bag": { hi: "Bag टैप करो", mr: "Bag टॅप कर" },
  "tap Build": { hi: "Build टैप करो", mr: "Build टॅप कर" },
  "tap Belt": { hi: "Belt टैप करो", mr: "Belt टॅप कर" },
  "tap Planet": { hi: "Planet टैप करो", mr: "Planet टॅप कर" },
  "tap Codex": { hi: "Codex टैप करो", mr: "Codex टॅप कर" },
  "tap O₂": { hi: "O₂ टैप करो", mr: "O₂ टॅप कर" },
  "tap Dance": { hi: "Dance टैप करो", mr: "Dance टॅप कर" },
  "Tap it again": { hi: "इसे फिर टैप करो", mr: "हे पुन्हा टॅप कर" },
  "tap": { hi: "टैप", mr: "टॅप" },
};
```

**Notes.** Button names stay English, as the task asks and as the glossary fixes. `Mine`, `Scan`, `Pick`, `Pick up`, `Use`, `Bag`, `Build`, `Belt`, `Codex`, `Planet`, `O₂`, `Dance`, `Jump`, `Place`, `Turn`, `Cancel` are all untranslated. The two `<b>…</b>` and two `(…)` entries are identical to the English on purpose: they are button labels, not sentences. The bare `tap` entry is the verb stem — **टैप** / **टॅप** — because that is the only form that can be dropped into a Hinglish sentence; it is not a drop-in replacement for English `click` in a Hindi sentence, for the reason in section 2.

---

## 4. `tips.ts`

```ts
// Keyed tip_01..tip_15, in the order of TIPS in src/data/tips.ts.
export const TIPS_I18N: Record<string, { en: string; hi: string; mr: string }> = {
  tip_01: {
    en: "Blue crystals hold ice. Mine some to keep your electrolyzer supplied.",
    hi: "नीले क्रिस्टल में बर्फ होती है। इलेक्ट्रोलाइज़र भरा रहे, इसके लिए कुछ बर्फ निकालो।",
    mr: "निळ्या क्रिस्टल्समध्ये बर्फ असते. इलेक्ट्रोलायझर भरलेला राहावा म्हणून थोडं बर्फ काढ.",
  },
  tip_02: {
    en: "Keep the electrolyzer powered and fed with ice to refill shelter oxygen.",
    hi: "शेल्टर की ऑक्सीजन भरने के लिए इलेक्ट्रोलाइज़र को पावर और बर्फ देते रहो।",
    mr: "शेल्टरची ऑक्सिजन भरण्यासाठी इलेक्ट्रोलायझरला पॉवर आणि बर्फ देत राहा.",
  },
  tip_03: {
    en: "Return to the shelter airlock before your oxygen runs low.",
    hi: "ऑक्सीजन कम होने से पहले शेल्टर के एयरलॉक में वापस आ जाओ।",
    mr: "ऑक्सिजन कमी होण्याआधी शेल्टरच्या एअरलॉकमध्ये परत ये.",
  },
  tip_04: {
    en: "Press Q to use an oxygen canister from your backpack.",
    hi: "बैकपैक से ऑक्सीजन कैनिस्टर लेने के लिए Q दबाओ।",
    mr: "बॅकपॅकमधून ऑक्सिजन कॅनिस्टर घेण्यासाठी Q दाब.",
  },
  tip_05: {
    en: "Solar lotuses need daylight. Charge a battery before night falls.",
    hi: "सोलर कमल को दिन की रोशनी चाहिए। रात होने से पहले बैटरी चार्ज कर लो।",
    mr: "सोलर कमळांना दिवसाचा प्रकाश लागतो. रात्र होण्याआधी बॅटरी चार्ज कर.",
  },
  tip_06: {
    en: "A battery stores power; it cannot make power on its own.",
    hi: "बैटरी पावर स्टोर करती है; वह खुद पावर नहीं बना सकती।",
    mr: "बॅटरी पॉवर साठवते; ती स्वतः पॉवर बनवू शकत नाही.",
  },
  tip_07: {
    en: "Feed the smelter iron ore and carbon to make iron plates.",
    hi: "लोहे की प्लेट बनाने के लिए स्मेल्टर में लोह-अयस्क और कार्बन डालो।",
    mr: "लोखंडी प्लेट बनवण्यासाठी स्मेल्टरमध्ये लोखंड धातुक आणि कार्बन टाक.",
  },
  tip_08: {
    en: "Walk up to a machine and press E to load it or collect its output.",
    hi: "किसी मशीन के पास जाओ और उसे भरने या उसका माल लेने के लिए E दबाओ।",
    mr: "मशीनजवळ जा आणि ती भरण्यासाठी किंवा तिचा माल घेण्यासाठी E दाब.",
  },
  tip_09: {
    en: "Dig below the grass for sandstone, ice pockets and deeper carbon seams.",
    hi: "घास के नीचे खोदो — वहाँ सैंडस्टोन, बर्फ की जेबें और गहरे कार्बन की परतें मिलेंगी।",
    mr: "गवताखाली खोद — तिथे सँडस्टोन, बर्फाचे साठे आणि खोलवर कार्बनचे थर मिळतील.",
  },
  tip_10: {
    en: "Press Tab to open your backpack and craft useful equipment.",
    hi: "बैकपैक खोलने और काम का सामान क्राफ्ट करने के लिए Tab दबाओ।",
    mr: "बॅकपॅक उघडण्यासाठी आणि उपयोगी सामान क्राफ्ट करण्यासाठी Tab दाब.",
  },
  tip_11: {
    en: "Press B to open the build menu and choose a machine to place.",
    hi: "B दबाकर बिल्ड मेन्यू खोलो और लगाने के लिए मशीन चुनो।",
    mr: "B दाबून बिल्ड मेनू उघड आणि लावण्यासाठी मशीन निवड.",
  },
  tip_12: {
    en: "Press C to lay a conveyor belt between two machines.",
    hi: "दो मशीनों के बीच कन्वेयर बेल्ट बिछाने के लिए C दबाओ।",
    mr: "दोन मशीन्समध्ये कन्व्हेयर बेल्ट घालण्यासाठी C दाब.",
  },
  tip_13: {
    en: "Research needs parts and power. Press E at the research station to begin.",
    hi: "रिसर्च के लिए पार्ट्स और पावर चाहिए। शुरू करने के लिए रिसर्च स्टेशन पर E दबाओ।",
    mr: "रिसर्चसाठी पार्ट्स आणि पॉवर लागते. सुरू करण्यासाठी रिसर्च स्टेशनवर E दाब.",
  },
  tip_14: {
    en: "An auto-drill needs room for its output. Give it a belt or empty it.",
    hi: "ऑटो-ड्रिल को अपना माल रखने की जगह चाहिए। उससे बेल्ट जोड़ो या उसे खाली करो।",
    mr: "ऑटो-ड्रिलला तिचा माल ठेवायला जागा लागते. तिला बेल्ट जोड किंवा ती रिकामी कर.",
  },
  tip_15: {
    en: "Press G to dance. Press it again to try another dance.",
    hi: "डांस करने के लिए G दबाओ। दूसरा डांस आज़माने के लिए फिर दबाओ।",
    mr: "डान्स करण्यासाठी G दाब. दुसरा डान्स करून बघण्यासाठी पुन्हा दाब.",
  },
};
```

---

## 5. Phone help

```ts
// Keys in the order of the T-027 phone-help list; phone_01 is the heading.
export const PHONE_HELP_I18N: Record<string, { en: string; hi: string; mr: string }> = {
  phone_01: {
    en: "Playing on a phone",
    hi: "फोन पर खेलना",
    mr: "फोनवर खेळणे",
  },
  phone_02: {
    en: "Turn your phone sideways; use your left thumb's joystick to walk.",
    hi: "फोन को आड़ा घुमाओ; चलने के लिए बाएँ अंगूठे वाला जॉयस्टिक इस्तेमाल करो।",
    mr: "फोन आडवा धर; चालण्यासाठी डाव्या अंगठ्याचा जॉयस्टिक वापर.",
  },
  phone_03: {
    en: "Push the joystick to the edge to run.",
    hi: "दौड़ने के लिए जॉयस्टिक को किनारे तक धकेलो।",
    mr: "पळण्यासाठी जॉयस्टिक कडेला ढकल.",
  },
  phone_04: {
    en: "Drag elsewhere to look; hold Scan to scan.",
    hi: "देखने के लिए बाकी जगह उँगली घसीटो; स्कैन करने के लिए Scan दबाए रखो।",
    mr: "बघण्यासाठी बाकी जागी बोट ओढ; स्कॅन करण्यासाठी Scan दाबून धर.",
  },
  phone_05: {
    en: "Hold Mine and slide to mine and aim.",
    hi: "Mine दबाए रखो और खिसकाकर खुदाई करो और निशाना लगाओ।",
    mr: "Mine दाबून धर आणि सरकवून खोदकाम कर आणि निशाना लाव.",
  },
  phone_06: {
    en: "Tap Jump to jump; hold Jump for the jetpack.",
    hi: "कूदने के लिए Jump टैप करो; जेटपैक के लिए Jump दबाए रखो।",
    mr: "उडी मारण्यासाठी Jump टॅप कर; जेटपॅकसाठी Jump दाबून धर.",
  },
  phone_07: {
    en: "Aim at a machine; tap Use.",
    hi: "किसी मशीन पर निशाना लगाओ; Use टैप करो।",
    mr: "मशीनवर निशाना लाव; Use टॅप कर.",
  },
  phone_08: {
    en: "Tap Bag for your backpack; Build and Belt open building tools.",
    hi: "बैकपैक के लिए Bag टैप करो; Build और Belt से बनाने के औज़ार खुलते हैं।",
    mr: "बॅकपॅकसाठी Bag टॅप कर; Build आणि Belt ने बांधणीची अवजारे उघडतात.",
  },
  phone_09: {
    en: "Tap Codex, Planet, O₂, Pick up or Dance for other actions.",
    hi: "बाकी कामों के लिए Codex, Planet, O₂, Pick up या Dance टैप करो।",
    mr: "इतर कामांसाठी Codex, Planet, O₂, Pick up किंवा Dance टॅप कर.",
  },
  phone_10: {
    en: "While building, tap Place, Turn or Cancel.",
    hi: "बनाते समय Place, Turn या Cancel टैप करो।",
    mr: "बांधताना Place, Turn किंवा Cancel टॅप कर.",
  },
  phone_11: {
    en: "Tap ✕ to close panels; tap the gear to pause.",
    hi: "पैनल बंद करने के लिए ✕ टैप करो; रोकने के लिए गियर टैप करो।",
    mr: "पॅनल बंद करण्यासाठी ✕ टॅप कर; थांबवण्यासाठी गिअर टॅप कर.",
  },
  phone_12: {
    en: "In Chrome, open ⋮ → Add to Home screen (or Install app).",
    hi: "Chrome में ⋮ → Add to Home screen (या Install app) खोलो।",
    mr: "Chrome मध्ये ⋮ → Add to Home screen (किंवा Install app) उघड.",
  },
};
```

---

## 6. Privacy notice

```ts
// Keys in reading order; the *_heading keys are the section headings.
export const PRIVACY_I18N: Record<string, { en: string; hi: string; mr: string }> = {
  privacy_title: {
    en: "Privacy notice",
    hi: "गोपनीयता सूचना",
    mr: "गोपनीयता सूचना",
  },
  privacy_collect_heading: {
    en: "What we collect",
    hi: "हम क्या जमा करते हैं",
    mr: "आम्ही काय गोळा करतो",
  },
  privacy_collect_1: {
    en: "Corebound itself collects nothing about you. The game has no accounts, ads, analytics or online features. You do not need to create an account to play.",
    hi: "Corebound खुद आपके बारे में कुछ नहीं जमा करता। गेम में कोई अकाउंट, विज्ञापन, एनालिटिक्स या ऑनलाइन सुविधा नहीं है। खेलने के लिए अकाउंट बनाने की ज़रूरत नहीं है।",
    mr: "Corebound स्वतः तुमच्याबद्दल काहीही गोळा करत नाही. गेममध्ये कोणतेही खाते, जाहिराती, ॲनालिटिक्स किंवा ऑनलाइन सुविधा नाहीत. खेळण्यासाठी खाते तयार करण्याची गरज नाही.",
  },
  privacy_collect_2: {
    en: "The game asks for no permissions. It does not request access to your camera, microphone, location or contacts.",
    hi: "गेम कोई परमिशन नहीं मांगता। यह आपके कैमरा, माइक्रोफ़ोन, लोकेशन या कॉन्टैक्ट्स तक पहुँच नहीं मांगता।",
    mr: "गेम कोणतीही परवानगी मागत नाही. तो तुमचा कॅमेरा, माइक्रोफोन, लोकेशन किंवा कॉन्टॅक्ट्स वापरण्याची परवानगी मागत नाही.",
  },
  privacy_collect_3: {
    en: "The web version is hosted on GitHub Pages. GitHub may keep ordinary server logs when your browser loads the game. This is separate from Corebound collecting information about you. See [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) for information about its hosting service.",
    hi: "वेब वर्ज़न GitHub Pages पर होस्ट है। जब आपका ब्राउज़र गेम लोड करता है, तब GitHub सामान्य सर्वर लॉग रख सकता है। यह Corebound द्वारा जानकारी जमा करने से अलग बात है। इसकी होस्टिंग सेवा के बारे में जानकारी के लिए [GitHub का प्राइवेसी स्टेटमेंट](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) देखें।",
    mr: "वेब आवृत्ती GitHub Pages वर आहे. तुमचा ब्राउझर गेम लोड करतो तेव्हा GitHub सामान्य सर्व्हर लॉग ठेवू शकते. हे Corebound ने माहिती गोळा करण्यापेक्षा वेगळे आहे. त्यांच्या होस्टिंग सेवेबद्दल माहितीसाठी [GitHub चे प्रायव्हसी स्टेटमेंट](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) पहा.",
  },
  privacy_device_heading: {
    en: "What stays on your device",
    hi: "आपके डिवाइस पर क्या रहता है",
    mr: "तुमच्या डिव्हाइसवर काय राहते",
  },
  privacy_device_1: {
    en: "Your saves and settings stay on your own device, in browser storage. They are not sent to the developer. This includes your saved game and the settings you choose while playing.",
    hi: "आपके सेव और सेटिंग्स आपके ही डिवाइस पर, ब्राउज़र स्टोरेज में रहते हैं। वे डेवलपर को नहीं भेजे जाते। इसमें आपका सेव किया हुआ गेम और खेलते समय चुनी गई सेटिंग्स शामिल हैं।",
    mr: "तुमचे सेव्ह आणि सेटिंग्ज तुमच्याच डिव्हाइसवर, ब्राउझर स्टोरेजमध्ये राहतात. ते डेव्हलपरला पाठवले जात नाहीत. यात तुमचा सेव्ह केलेला गेम आणि खेळताना निवडलेल्या सेटिंग्ज यांचा समावेश आहे.",
  },
  privacy_children_heading: {
    en: "Children",
    hi: "बच्चे",
    mr: "मुले",
  },
  privacy_children_1: {
    en: "The same privacy approach applies to children: Corebound collects nothing from them. There are no accounts, ads, analytics or online features for children or other players.",
    hi: "बच्चों पर भी यही गोपनीयता नियम लागू है: Corebound उनसे कुछ नहीं जमा करता। बच्चों या किसी भी खिलाड़ी के लिए कोई अकाउंट, विज्ञापन, एनालिटिक्स या ऑनलाइन सुविधा नहीं है।",
    mr: "मुलांसाठीही हाच गोपनीयतेचा नियम लागू आहे: Corebound त्यांच्याकडून काहीही गोळा करत नाही. मुलांसाठी किंवा कोणत्याही खेळाडूसाठी खाते, जाहिराती, ॲनालिटिक्स किंवा ऑनलाइन सुविधा नाहीत.",
  },
  privacy_changes_heading: {
    en: "Changes",
    hi: "बदल",
    mr: "बदल",
  },
  privacy_changes_1: {
    en: "This notice describes the current game. If its privacy features change, this notice will need updating.",
    hi: "यह सूचना अभी के गेम के बारे में है। अगर गेम की गोपनीयता सुविधाओं में बदलाव होगा, तो यह सूचना अपडेट करनी होगी।",
    mr: "ही सूचना सध्याच्या गेमबद्दल आहे. गेमच्या गोपनीयता सुविधा बदलल्या तर ही सूचना अपडेट करावी लागेल.",
  },
  privacy_contact_heading: {
    en: "Contact",
    hi: "संपर्क",
    mr: "संपर्क",
  },
  privacy_contact_1: {
    en: "Contact the developer, Medhanshu Shahane, through the game's store page.",
    hi: "गेम के स्टोर पेज के ज़रिए डेवलपर Medhanshu Shahane से संपर्क करें।",
    mr: "गेमच्या स्टोअर पेजद्वारे डेव्हलपर Medhanshu Shahane यांना संपर्क करा.",
  },
};
```

---

## 7. Lines that did not translate cleanly, and what I did

Every one of these is a decision the Director should know about, not a silent choice.

1. **The bare `tap` rule** (section 2). Hindi and Marathi put the verb last, so a single-word replacement for `click` has nowhere to go. I have given the stem form and recommend moving to per-string touch text.
2. **`Add to Home screen (or Install app)`** stays in English in both languages. Those are Chrome's own menu labels, and translating them would send the player looking for a menu item that does not exist on their phone. **If you would rather it be localised**, the Hindi Chrome string is `होम स्क्रीन पर जोड़ें` and the Marathi `होम स्क्रीनवर जोडा` — but only use it if the game can detect the browser language, otherwise it is wrong for most players.
3. **`iron ore`** is the one term where the glossary itself was unsure. I used **लोह-अयस्क** and **लोखंड धातुक** because a tip has room for the correct word and reads oddly with a Latin one dropped in the middle of a Devanagari sentence. If a 12-year-old would not say either, keep `iron ore` in English in both and the sentence still works.
4. **`sandstone`** is written as **सैंडस्टोन** / **सँडस्टोन**, not as the Codex name **Dhavala** (धवल). If the tip should match what the Codex calls it, change it to धवल in both — say which and I will align the rest.
5. **`building tools`** — Marathi has a trap here: **हत्यार** means weapon as well as tool, and a non-violent game must not print it. I used **अवजारे** (implements). Hindi **औज़ार** is safe.
6. **`✕` and `⋮`** are kept as glyphs in both languages, since they are on-screen shapes rather than words.
7. **`O₂`** keeps the subscript exactly, per the glossary, and so does the HUD.
8. **Long strings.** `phone_05`, `tip_09` and `privacy_collect_3` are the three that grow most; see section 8 before they are placed in a fixed box.
9. **The developer's name** stays in Latin script in both languages: **Medhanshu Shahane**. Transliterating a person's name into a script they have not chosen is the kind of detail that annoys the one person it belongs to.

---

## 8. Length, for layout

Hindi and Marathi run longer than English, and a HUD line that overflows is a bug. Measured over the tips and the phone-help lines: **Hindi averages +10% longer than English, Marathi +5%**, and the longest single string is `tip_01` at 82 characters in Hindi against 69 in English.

| id | English | Hindi | growth | Marathi | growth |
| --- | --- | --- | --- | --- | --- |
| `tip_01` | 69 | 82 | +19% | 84 | +22% |
| `tip_02` | 72 | 71 | -1% | 68 | -6% |
| `tip_03` | 58 | 56 | -3% | 52 | -10% |
| `tip_04` | 53 | 46 | -13% | 45 | -15% |
| `tip_05` | 65 | 67 | +3% | 66 | +2% |
| `tip_06` | 56 | 52 | -7% | 47 | -16% |
| `tip_07` | 57 | 65 | +14% | 66 | +16% |
| `tip_08` | 66 | 64 | -3% | 61 | -8% |
| `tip_09` | 71 | 81 | +14% | 72 | +1% |
| `tip_10` | 59 | 58 | -2% | 63 | +7% |
| `tip_11` | 61 | 52 | -15% | 49 | -20% |
| `tip_12` | 52 | 52 | +0% | 50 | -4% |
| `tip_13` | 73 | 78 | +7% | 73 | +0% |
| `tip_14` | 68 | 74 | +9% | 75 | +10% |
| `tip_15` | 54 | 60 | +11% | 63 | +17% |
| `phone_02` | 65 | 70 | +8% | 56 | -14% |
| `phone_03` | 37 | 42 | +14% | 30 | -19% |
| `phone_04` | 42 | 67 | +60% | 60 | +43% |
| `phone_05` | 36 | 50 | +39% | 50 | +39% |
| `phone_06` | 44 | 55 | +25% | 54 | +23% |
| `phone_07` | 26 | 38 | +46% | 30 | +15% |
| `phone_08` | 62 | 69 | +11% | 64 | +3% |
| `phone_09` | 58 | 62 | +7% | 60 | +3% |
| `phone_10` | 42 | 40 | -5% | 41 | -2% |
| `phone_11` | 45 | 58 | +29% | 56 | +24% |
| `phone_12` | 56 | 56 | +0% | 60 | +7% |

Nothing here needs cutting if the boxes can grow. If a box cannot, tell me the character budget and I will write tighter — that is cheaper than a layout fix later.

One caution on reading that table: **character count is a poor measure of how wide the text draws.** Devanagari sets the vowel signs and conjuncts into clusters, so a Hindi line at the same character count as an English one often occupies more width on screen, and a Marathi line often more than that. The counts above are a floor, not a fit. The three strings to look at on a real phone are `tip_01`, `tip_09` and `phone_05`, not because they are the longest but because they are the ones that land in a narrow box.

---

## 9. What the Director needs to do to wire it

1. Decide section 2: per-string touch text (recommended) or a per-language regex table.
2. Add the three blocks above to `src/data/` as new files — for example `controls.i18n.ts`, `tips.i18n.ts` and `help.i18n.ts` — and leave the English in place as the fallback, so a missing key shows English rather than a blank.
3. Keep the key order stable. `tip_01..tip_15` follows the current order of `TIPS`; if a tip is inserted, the numbers after it shift, so either renumber in the same commit or key them by a slug instead.
4. A test that every key in each `hi` and `mr` object exists in the English source, and that no value is empty, would catch the whole class of mistake here in one line of vitest. That is the same guard you already have for the voice files.

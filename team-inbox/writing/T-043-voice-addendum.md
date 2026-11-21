# T-043: Voice script addendum: five goal lines, and answers to the T-006 questions

**Delivery note**

- **Task:** T-043 (Sarvam AI). Deliverable as asked: `team-inbox/writing/T-043-voice-addendum.md`.
- **What I did:** the five recording rows that were missing (`goal_wake`, `goal_ice`, `goal_huxley_message`, `goal_translator`, `goal_memory_logs`), and Hindi and Marathi for those five lines plus the three slice-2 goal-panel strings — 16 strings, 8 per language, same ids in the same order.
- **Text basis:** I read the lines out of `src/data/story.ts` and `src/data/voice.ts` rather than retyping them, so the "line as the game shows it" column is the source text verbatim. Only `goal_translator` needs a respelling: "Prof." and "Huxley". The other four are pasted as they are.
- **Also in here, marked optional:** ChatGPT's T-042 polish of the same three lines (`huxley_message`, `translator`, `memory_logs`) is in PR #39 and may be accepted. Recording a line twice is the expensive mistake, so section 4 gives the rows and the translations for that version too. Use one or the other, not both.
- **One thing found while checking:** `goal_wake` and `intro_hatch_ready` are word for word the same sentence. Record it once and copy the file. Section 2 explains it.
- **I cannot push to the repository** (GitHub is not connected for me), so this file goes to the Commander for upload to `team-inbox/writing/`.

---

## 1. Five recording rows

Same settings as T-005 and T-040: voice `ishita`, `en-IN`, pace 1.08. Paste the third column exactly as it appears; where it says *same*, the line needs no change. The shown text never changes — only the pasted text is respelled, so what the player reads and what SARATHI says stay the same sentence.

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `goal_wake.mp3` | The hatch is responding. Take one breath, then follow the daylight. | *same* |
| `goal_ice.mp3` | The shelter is sound, but its tank is empty. There is ice in the rocks nearby. Use your laser. | *same* |
| `goal_huxley_message.mp3` | The factory can mind itself for a while. The module's projector is still holding a recording addressed to you. | *same* |
| `goal_translator.mp3` | Prof. Huxley mentioned a translator. It should be near the module, if the landing was kind to it. | Professor Hux lee mentioned a translator. It should be near the module, if the landing was kind to it. |
| `goal_memory_logs.mp3` | Some of your memories were stored on logs, and the crash scattered them. Each one shows a blue beam. | *same* |

**The only respellings, and why they agree with what is already recorded:**

| Word | Pasted as | Where it comes from |
| --- | --- | --- |
| **Prof.** | Professor | T-040: an abbreviation with a full stop makes this voice say "prof" and stop, or spell it out |
| **Huxley** | Hux lee | T-040: `-ley` is read three different ways by three engines |

No other respelling is needed. There is no "Mooladri" in these five lines; if a later line has one, it is `Moo laa dri`, as in T-040, with Devanagari मूलाद्रि for a Hindi or Marathi voice. `names.ts` still has no `voice` field for Mooladri — worth adding one line so the next worker does not have to guess:

```ts
jivagraha: { name: 'Mooladri', deva: 'मूलाद्रि', say: 'MOO-lah-dree', meaning: 'root-mountain', voice: 'Moo laa dri' },
```

## 2. `goal_wake` and `intro_hatch_ready` are the same sentence — record once

`story.ts` line 6 and `scenes.ts` line 11 both say:

> The hatch is responding. Take one breath, then follow the daylight.

`voice.ts` maps a line to a file by its text, and it keeps the **first** match it meets. Goals are added before intro lines, so once both groups are live, `goal_wake.mp3` will be the file SARATHI plays for both the intro moment and the first goal. Two consequences:

1. **Record it once** and put the same file in the folder under both names (`goal_wake.mp3` and `intro_hatch_ready.mp3`). One take, no drift between the two moments.
2. If the Commander ever wants the two moments to sound different, the text has to differ first — a different recording under the same text will simply never be reached.

## 3. Hindi and Marathi — 16 strings

Same `{ id, where, text }` form as T-006. `where` is `goal` throughout. Ids are new: `_sarathi` is the spoken line, `_text` is the goal-panel step. They do not collide with T-006's `_title` and `_hint` ids.

Register, unchanged from T-006: तुम for SARATHI in Hindi, तू in Marathi, English loanwords where the player's own head uses them (शेल्टर, फैक्ट्री, लेज़र / लेझर, मेमोरी लॉग, ट्रांसलेटर, एस्केप मॉड्यूल), Western digits, and "Prof. Huxley" left in Latin letters as T-006 batch 2 already does.

### Hindi — `T-043-hi.json`

```json
[
  { "id": "ch1_goal_wake_sarathi", "where": "goal", "text": "हैच जवाब दे रहा है। एक सांस लो, फिर रोशनी की तरफ बढ़ो।" },
  { "id": "ch1_goal_ice_sarathi", "where": "goal", "text": "शेल्टर ठीक है, पर उसका टैंक खाली है। पास की चट्टानों में बर्फ है। अपना लेज़र चलाओ।" },
  { "id": "ch1_goal_huxley_message_sarathi", "where": "goal", "text": "फैक्ट्री थोड़ी देर खुद संभल लेगी। मॉड्यूल का प्रोजेक्टर अब भी तुम्हारे नाम की एक रिकॉर्डिंग रखे हुए है।" },
  { "id": "ch1_goal_translator_sarathi", "where": "goal", "text": "Prof. Huxley ने ट्रांसलेटर का ज़िक्र किया था। अगर उतरते वक्त वह सही-सलामत रहा, तो वह मॉड्यूल के पास ही होगा।" },
  { "id": "ch1_goal_memory_logs_sarathi", "where": "goal", "text": "तुम्हारी कुछ यादें लॉग में रखी थीं, और क्रैश में वे बिखर गईं। हर लॉग से एक नीली किरण निकलती है।" },
  { "id": "ch1_goal_huxley_message_text", "where": "goal", "text": "एस्केप मॉड्यूल पर वापस जाओ और हैच के पास Prof. Huxley के प्रोजेक्टर पर E दबाओ" },
  { "id": "ch1_goal_translator_text", "where": "goal", "text": "एस्केप मॉड्यूल के पास से ट्रांसलेटर उठाओ (E)" },
  { "id": "ch1_goal_memory_logs_text", "where": "goal", "text": "3 मेमोरी लॉग ढूँढो: नीली किरणों के पीछे जाओ, फिर E दबाओ" }
]
```

### Marathi — `T-043-mr.json`

```json
[
  { "id": "ch1_goal_wake_sarathi", "where": "goal", "text": "हॅच प्रतिसाद देत आहे. एक श्वास घे, मग उजेडाच्या दिशेने जा." },
  { "id": "ch1_goal_ice_sarathi", "where": "goal", "text": "शेल्टर ठीक आहे, पण त्याची टाकी रिकामी आहे. जवळच्या खडकांत बर्फ आहे. तुझा लेझर वापर." },
  { "id": "ch1_goal_huxley_message_sarathi", "where": "goal", "text": "फॅक्टरी थोडा वेळ स्वतः सांभाळून घेईल. मॉड्यूलचा प्रोजेक्टर अजूनही तुझ्या नावाची रेकॉर्डिंग ठेवून आहे." },
  { "id": "ch1_goal_translator_sarathi", "where": "goal", "text": "Prof. Huxley ने ट्रान्सलेटरचा उल्लेख केला होता. उतरताना तो सुखरूप राहिला असेल, तर तो मॉड्यूलजवळच असेल." },
  { "id": "ch1_goal_memory_logs_sarathi", "where": "goal", "text": "तुझ्या काही आठवणी लॉगमध्ये साठवल्या होत्या, आणि क्रॅशमध्ये त्या विखुरल्या. प्रत्येक लॉगमधून एक निळी किरण दिसते." },
  { "id": "ch1_goal_huxley_message_text", "where": "goal", "text": "एस्केप मॉड्यूलकडे परत जा आणि हॅचजवळ Prof. Huxley च्या प्रोजेक्टरवर E दाब" },
  { "id": "ch1_goal_translator_text", "where": "goal", "text": "एस्केप मॉड्यूलजवळून ट्रान्सलेटर घे (E)" },
  { "id": "ch1_goal_memory_logs_text", "where": "goal", "text": "3 मेमरी लॉग शोध: निळ्या किरणांच्या मागे जा, मग E दाब" }
]
```

### The four decisions a reviewer should check

1. **"if the landing was kind to it" is not translated as injury.** The English is SARATHI being dry. "चोट लगी" or "दुखापत झाली" would read as damage, and nothing in Corebound is damaged. Both languages say "if it came through whole" — सही-सलामत रहा / सुखरूप राहिला. That keeps the joke and keeps the rule.
2. **"मॉड्यूल का प्रोजेक्टर" / "मॉड्यूलचा प्रोजेक्टर"** keeps the loanword: the Codex already calls it the projector, and there is no everyday Hindi word for one that a 12-year-old would say.
3. **रिकॉर्डिंग is feminine in Hindi**, so "एक रिकॉर्डिंग रखे हुए है" and "तुम्हारे नाम की एक रिकॉर्डिंग", not "रखा हुआ". Same class of error the T-006 pilot caught with ड्रिल.
4. **"नीली किरण" / "निळी किरण"** — किरण is feminine in both languages, and it is the word the goal text uses too, so the beam the player follows and the beam SARATHI names are the same word.

## 4. Optional: the same three lines, if T-042's polish is accepted

PR #39 polishes `huxley_message`, `translator` and `memory_logs`. If the Director takes it, the recording rows and the six translations above change. Here they are, so a second recording session is never needed. **Same ids — this block replaces, it does not add.**

### Recording rows for the polished text

| File | Line as the game would show it | Line to paste into Bulbul |
| --- | --- | --- |
| `goal_huxley_message.mp3` | Return to the module and listen to Prof. Huxley's recording by the hatch. The factory can manage a short absence. | Return to the module and listen to Professor Hux lee's recording by the hatch. The factory can manage a short absence. |
| `goal_translator.mp3` | Collect the translator beside the escape module, as Prof. Huxley suggested. | Collect the translator beside the escape module, as Professor Hux lee suggested. |
| `goal_memory_logs.mp3` | Follow the blue beams to find three memory logs scattered by the crash and read each one. | *same* |

`goal_wake` and `goal_ice` are untouched by T-042, so section 1 stands for them either way.

### Hindi — polished variants

```json
[
  { "id": "ch1_goal_huxley_message_sarathi", "where": "goal", "text": "मॉड्यूल पर वापस जाओ और हैच के पास Prof. Huxley की रिकॉर्डिंग सुनो। फैक्ट्री थोड़ी देर खुद संभल लेगी।" },
  { "id": "ch1_goal_translator_sarathi", "where": "goal", "text": "जैसा Prof. Huxley ने कहा था, एस्केप मॉड्यूल के पास से ट्रांसलेटर उठाओ।" },
  { "id": "ch1_goal_memory_logs_sarathi", "where": "goal", "text": "नीली किरणों के पीछे जाओ और क्रैश में बिखरे तीन मेमोरी लॉग पढ़ो।" },
  { "id": "ch1_goal_huxley_message_text", "where": "goal", "text": "एस्केप मॉड्यूल पर वापस जाओ; हैच के पास Prof. Huxley के प्रोजेक्टर पर E दबाओ" },
  { "id": "ch1_goal_translator_text", "where": "goal", "text": "एस्केप मॉड्यूल के पास ट्रांसलेटर उठाने के लिए E दबाओ" },
  { "id": "ch1_goal_memory_logs_text", "where": "goal", "text": "नीली किरणों के पीछे जाकर 3 मेमोरी लॉग ढूँढो; हर एक पढ़ने के लिए E दबाओ" }
]
```

### Marathi — polished variants

```json
[
  { "id": "ch1_goal_huxley_message_sarathi", "where": "goal", "text": "मॉड्यूलकडे परत जा आणि हॅचजवळ Prof. Huxley ची रेकॉर्डिंग ऐक. फॅक्टरी थोडा वेळ स्वतः सांभाळून घेईल." },
  { "id": "ch1_goal_translator_sarathi", "where": "goal", "text": "Prof. Huxley ने सांगितल्याप्रमाणे एस्केप मॉड्यूलजवळून ट्रान्सलेटर घे." },
  { "id": "ch1_goal_memory_logs_sarathi", "where": "goal", "text": "निळ्या किरणांच्या मागे जा आणि क्रॅशमध्ये विखुरलेले तीन मेमरी लॉग वाच." },
  { "id": "ch1_goal_huxley_message_text", "where": "goal", "text": "एस्केप मॉड्यूलकडे परत जा; हॅचजवळ Prof. Huxley च्या प्रोजेक्टरवर E दाब" },
  { "id": "ch1_goal_translator_text", "where": "goal", "text": "एस्केप मॉड्यूलजवळचा ट्रान्सलेटर घेण्यासाठी E दाब" },
  { "id": "ch1_goal_memory_logs_text", "where": "goal", "text": "निळ्या किरणांच्या मागे जाऊन 3 मेमरी लॉग शोध; प्रत्येक वाचण्यासाठी E दाब" }
]
```

## 5. Questions and notes for the Director

1. **T-006 spellings still waiting on the Commander:** जीवग्रह and तप्तशिला. Neither appears in these 16 strings, so this batch is not blocked by them.
2. **`ch1_goal_wake_text` and `ch1_goal_ice_text` are not in this batch**, because the task asked for the three slice-2 panel strings. Both already have reviewed versions in the T-006 pilot (§3, the `ice` and `breathe` rows) — reuse them rather than asking for them again. The remaining goal `text` strings for the other 21 goals have no translation yet and belong to the freeze.
3. **A small `names.ts` change is suggested in section 1** — the `voice` field for Mooladri. It is a one-line edit; your call whether it is worth a task of its own.
4. **The curly apostrophe in T-042's text** (see my review, `T-042-concept-review-mooladri.md`) matters here too: `voice.ts` matches by exact text, so a curly `Huxley’s` in the polished line would never find its recording. Paste it into `story.ts` with the straight `'`.
5. **When the recordings arrive**, `goal_wake` and `goal_ice` come off `AWAITING_VOICE` in `voice.ts` by deleting them from the set — the other three only if T-042's text goes in unchanged.

---

### Checklist against "Done when"

- [x] Five recording rows with file names; respellings agree with `names.ts` and with T-040 (Professor, Hux lee, Moo laa dri)
- [x] 16 translated strings (8 Hindi, 8 Marathi), valid JSON, same ids in the same order in both
- [x] Optional polished variants for the three T-042 lines, same ids, marked as replacements

# T-035: The 57 SARATHI recordings, checked

**Delivery note**

- **Task:** T-035 (Sarvam AI, with the Commander listening). The ear pass was the Commander's, on 1 November. The technical pass was mine: I pulled all 57 files from `public/assets/audio/voice/` and measured them, so that nothing that can be checked without hearing was left to guesswork.
- **Result: one recording needs redoing.** `goal_breathe.mp3` — the word **Electrolysis**. Everything else is fine, and the Commander confirmed the two names by ear.
- **That is a good outcome, not a short report.** 47 of the 57 contain no name and no technical term, so there was nothing in them to get wrong. The listening job was ten clips, not fifty-seven, and one of the ten failed.

---

## 1. The one recording to redo

| File | Line | Problem | Exact fix |
| --- | --- | --- | --- |
| `goal_breathe.mp3` | "**Electrolysis** complete. You are breathing. I consider that a good start." | The first word is mangled. The Commander heard "electracie is complete" — the model split the word at `-lysis` and made two words of it. | Re-record this file only, with the first word respelled. See below. |

**Why only this word failed, and what that tells us.** `electrolyzer` came out correctly in both `machine_electrolyzer.mp3` and `goal_craft_elec.mp3`, so the `electro-` half is fine. The failure is specific to the `-lysis` ending, which the model read as "cie is". **Keep `electro-` exactly as it is and change only the tail.** That is a much smaller change than respelling the whole word, and it is why the respellings below are all of the same shape.

**Respellings for Bulbul, in the order I would try them** (voice `ishita`, `en-IN`, pace 1.08, the settings the rest of the set was made with):

1. **`Electrolisis`** — plain phonetic, and the form most likely to read "ee-LEK-tro-ly-sis" straight through. Try this first.
2. **`electro-ly-sis`** — hyphens force the syllable breaks the model missed. Use if (1) still splits the word.
3. **`ee-lek-tro-ly-sis`** — fully phonetic, last resort. It will read correctly but may sound slightly slower than the rest of the line.

The full line to feed in, ready to paste:

```
Electrolisis complete. You are breathing. I consider that a good start.
```

**If all three still fail, rephrase instead of respelling.** Two options that remove the word and keep the meaning and SARATHI's dry tone:

- "The ice is split. You are breathing. I consider that a good start."
- "Splitting the ice is done. You are breathing. I consider that a good start."

That is a change to `src/data/story.ts`, which is not mine to make — the Director would have to approve it, and it changes a line ChatGPT wrote. Try the respellings first.

**When the new file is made:** same filename, `public/assets/audio/voice/goal_breathe.mp3`, so nothing in the code changes. The current file peaks at −1.8 dBFS and the set runs between −1.5 and −2.9, so match that rather than normalising to full scale; if the new export is a WAV, send it through the same audio step as the others so the format and level match. **Send it to me and I will re-measure it** — the checks below take a minute and would catch a clipped start or a level jump before it reaches the game.

---

## 2. What the Commander confirmed by ear

| Word | File | Verdict |
| --- | --- | --- |
| **Jivagraha** | `events_bandCollapse.mp3` | correct |
| **Custodian** | `goal_ice.mp3` | correct |
| **silica** | `goal_silica.mp3`, `machine_silicon_furnace.mp3`, `research_silicon_furnace.mp3` | correct |
| **electrolyzer** | `machine_electrolyzer.mp3`, `goal_craft_elec.mp3` | correct |
| **hydrogen** | `goal_craft_elec.mp3` | correct |
| **carbon** | `machine_coal_burner.mp3`, `machine_smelter.mp3`, `machine_silicon_furnace.mp3`, `research_silicon_furnace.mp3` | correct |

Jivagraha and Custodian were the two that mattered most, and both are right. The name work from T-023 is holding.

---

## 3. Every file, and its verdict

**Redo (1):** `goal_breathe.mp3` — the word Electrolysis, fix in section 1.

**Fine (56).** These were listened to and passed, or contain nothing that can be mispronounced:

- **Goals (20):** `goal_auto_plates`, `goal_battery`, `goal_belt`, `goal_bio_filter`, `goal_bloom`, `goal_craft_elec`, `goal_done`, `goal_harmony_look`, `goal_ice`, `goal_iron`, `goal_load_ice`, `goal_night`, `goal_place_drill`, `goal_place_elec`, `goal_research_belt`, `goal_research_drill`, `goal_research_station`, `goal_silica`, `goal_smelter`
- **Factory events (18):** `event_drill_full`, `event_first_belt`, `event_no_power`, `events_backpackFull`, `events_bandCollapse`, `events_bandStable`, `events_bandStressed`, `events_bandThriving`, `events_blackout`, `events_bloomFirst`, `events_drillFull`, `events_fault`, `events_lowOxygen`, `events_nightFalls`, `events_noPower`, `events_researched`, `events_sunrise`, `events_tooClose`
- **Machines (10):** `machine_auto_drill`, `machine_battery`, `machine_coal_burner`, `machine_electrolyzer`, `machine_power_pylon`, `machine_research_station`, `machine_silicon_furnace`, `machine_smelter`, `machine_solar_lotus`, `machine_storage_silo`
- **Research (9):** `research_auto_drill`, `research_backpack_plus`, `research_coal_burner`, `research_conveyor`, `research_drill_plus`, `research_power_pylon`, `research_silicon_furnace`, `research_solar_plus`, `research_storage_silo`

---

## 4. The technical pass, all 57 files

Measured from the files themselves, not from a listening session.

| Check | Result |
| --- | --- |
| Files found and matched to a line of text | **57 of 57**, none missing, none orphaned |
| Clipping | **none** — not one sample at full scale in the whole set |
| Lead silence | median **12 ms** (10th–90th percentile 5–34 ms), so every file starts tight and evenly |
| Cut onsets | **none** — no file begins at high amplitude, which is what a chopped first consonant looks like |
| Tail silence | median **123 ms**, longest 325 ms (`events_drillFull`) — comfortable, nothing abrupt |
| Peak level | **−1.5 to −2.9 dBFS**, a spread of 1.4 dB. The set is already loudness-matched |
| Longest internal pause | **0.54 s** (`research_conveyor`), which is a sentence break, not a stall |
| Total speech | 4.9 minutes across 57 files, 1.03 s (`events_researched`) to 8.05 s (`research_storage_silo`) |

**One correction to my own earlier reading.** My first pass flagged eight files as "too fast" or "too slow". That was my metric, not the recordings: short lines like "Not here — I will not let you dig under the shelter" score high on words-per-second because the fixed attack and release dominate a 2.8-second file. Compared like with like, the pace is consistent, and the Commander's ear agrees. I would rather say that plainly than leave eight false alarms in the record.

---

## 5. For the record, and for the next set of recordings

- **Ten of the 57 were worth listening to** and 47 were not, because they contain no name and no technical term. For the Chapter 1 and Chapter 2 sets, that ratio will be worth keeping: the same one-listen list can be generated from the text before anyone plays a file.
- **The one class of error the measurements cannot catch is exactly the one that happened.** "Electrolysis" is technically perfect audio: no clipping, correct trim, right level, and it says the wrong thing. Pronunciation needs an ear, and the Commander's ear found it in ten clips.
- **Worth watching for in future sets:** long technical words built from Greek roots — `electrolysis`, `electrolyzer`, `photosynthesis`, `terraforming`, `Sabatier`, `resonance`. The generator handles `electro-` and loses `-lysis`, so the compound tails are where to listen, not the stems.

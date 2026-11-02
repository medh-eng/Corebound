# T-040: The Chapter 1 recording script

**Delivery note**

- **Task:** T-040 (Sarvam AI). Every line the Commander has to record for Chapter 1, one row each, with the paste-ready version beside it. Built by parsing `src/data/scenes.ts`, `src/data/lines.ts` and `src/data/chapter1.ts` directly, so the "line as the game shows it" column is the source text verbatim and not a retyping.
- **52 lines in all:** 7 intro, 14 Guardian, 4 chamber, 5 lift-off, 6 creature, 16 stuck hints.
- **37 of the 52 need no change at all** — paste them as they are. **15 need a respelling**, and every one of those is a proper noun or the abbreviation "Prof.".
- **Settings, as in T-005:** voice `ishita`, `en-IN`, pace 1.08. Same everything, or the new lines will not sit with the 57 already in the game.
- **The shown text never changes.** Only the pasted text is respelled, so what a player reads and what SARATHI says stay the same sentence.

---

## 1. Read this before recording: the file names are new, and one pair would collide

The existing 57 recordings are named `<group>_<key>.mp3` — `goal_ice`, `machine_smelter`, `events_lowfall` — and `src/data/voice.ts` builds that name from the line's own text. **None of these 52 lines is in `voice.ts` yet**, because the file only knows the five older groups. So the names below are a proposal that the Director needs to wire, in one small change:

| Source | Prefix proposed | Example |
| --- | --- | --- |
| `INTRO_LINES` | `intro_` | `intro_pod_open.mp3` |
| `GUARDIAN_LINES` | `guardian_` | `guardian_awake.mp3` |
| `CHAMBER_LINES` | `chamber_` | `chamber_glimpse.mp3` |
| `LIFTOFF_LINES` | `liftoff_` | `liftoff_rise.mp3` |
| `CREATURE_LINES` | `creature_` | `creature_first_grazer.mp3` |
| `STUCK_HINTS` | `stuck_` | `stuck_wake.mp3` |

**The one thing to be careful about: `stuck_`, not `goal_`.** Two of the stuck hints have the same key as a goal that already has a recording — `battery` and `smelter`. `goal_battery.mp3` and `goal_smelter.mp3` already exist and say different things. If the stuck hints were named `goal_*` they would silently overwrite two lines already in the game, and SARATHI would start saying the wrong sentence at the wrong moment. The `stuck_` prefix prevents it, and it is worth a test in `voice.ts` that no two lines ever map to the same file name.

**A second thing worth deciding now.** The 16 stuck hints are the **desktop** wording, so several of them say "press E", "press Tab", "press C". On a phone the game shows the touch wording instead (`PHONE_STUCK_HINTS`) — but the recording is the same file, so a phone player would hear "press Tab" while the screen says "tap Bag". Either record the four phone variants that exist (`oxygen_supply`, `automation`, `huxley_message`, `memory_logs`), or accept the mismatch for now. It is a smaller job than it looks, and it is the same complaint the Commander raised in issues #23 and #25.

---

## 2. What was respelled, and why

| Word | Pasted as | Lines | Where |
| --- | --- | --- | --- |
| **Prof.** | Professor | 2 | stuck_huxley_message.mp3, stuck_translator.mp3 |
| **Mooladri** | Moo laa dri | 10 | guardian_air_done.mp3, guardian_awake.mp3, guardian_bloom_hint.mp3, guardian_calm.mp3 … |
| **Taptashila** | Tup ta shee laa | 2 | liftoff_cliffhanger.mp3, liftoff_next_world.mp3 |
| **SARATHI** | Saa ra thee | 1 | intro_systems.mp3 |
| **Huxley** | Hux lee | 2 | stuck_huxley_message.mp3, stuck_translator.mp3 |

**The judgement behind it, so you can predict the rest.** T-035 taught us where this voice actually fails: it handles ordinary English and technical loanwords well — `silica`, `carbon`, `hydrogen`, `electrolyzer`, `conveyors`, `Custodian` and `Jivagraha` all came out right by ear — and it fails on words it tries to read as English but that are not. So I respelled **only**:

- **Sanskrit names it has not met before** — `Mooladri`, `Taptashila`, and `SARATHI` saying her own name. These follow the syllable style of `names.ts` (`voice` field, from T-023): spaces between syllables, `aa` for a long आ, `ee` for a long ई.
- **`Prof.` → `Professor`.** An abbreviation followed by a full stop is the classic way to get a voice to say "prof" and stop, or spell out "P-R-O-F". The shown text keeps "Prof. Huxley"; only the pasted line says "Professor Hux lee".
- **`Huxley` → `Hux lee`**, because `-ley` at the end of an English surname is read three different ways by three different engines.

**What I deliberately did not touch.** `Jivagraha` and `Custodian` were confirmed correct by the Commander's ear in T-035, so they stay exactly as they are — respelling a word that already works is how you introduce a fault. Same for `silica`, `carbon`, `hydrogen` and `electrolyzer`. Em dashes, colons and hyphens are left alone too: "twenty-five percent" recorded correctly, so the punctuation is not a problem for this voice.

**Devanagari, exact, for the three names I respelled:** Mooladri **मूलाद्रि**, Taptashila **तप्तशिला**, SARATHI **सारथी**. If the Hindi or Marathi voice records these lines later, feed it the Devanagari rather than the respelling, as `names.ts` already does for the plants.

---

## 3. The script

Paste the third column exactly as it appears. Where it says *same*, the second and third columns are identical and the line needs no change.

### `INTRO_LINES` — 7 lines, prefix `intro_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `intro_pod_open.mp3` | Cryo-pod seals hiss open. Custodian, you are inside the crashed escape module. Welcome back. | *same* |
| `intro_systems.mp3` | SARATHI online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either. | Saa ra thee online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either. |
| `intro_oxygen.mp3` | Your suit oxygen is low. Please check the gauge before leaving the pod. | *same* |
| `intro_module.mp3` | The module has limited reserves. We need a steady oxygen supply before they run out. | *same* |
| `intro_shelter.mp3` | I can see a shelter dome outside, beside a solar lotus. Both may still be useful. | *same* |
| `intro_hatch_ready.mp3` | The hatch is responding. Take one breath, then follow the daylight. | *same* |
| `intro_hatch_sunrise.mp3` | The hatch is open. Sunrise is rolling over a curved horizon. This is a very small world. | *same* |

### `GUARDIAN_LINES` — 14 lines, prefix `guardian_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `guardian_first_tremor.mp3` | Seismic tremor beneath the forest. The ground shifted, but the trees have not fallen. | *same* |
| `guardian_forest_shadow.mp3` | A vast shadow is moving beneath those roots. The whole canopy is rising and settling with it. | *same* |
| `guardian_restless.mp3` | Mooladri's roots are tightening around the valley. The forest is dimming as our machines strain its home. | Moo laa dri's roots are tightening around the valley. The forest is dimming as our machines strain its home. |
| `guardian_awake.mp3` | Mooladri has risen. Mossy bark towers above us, its crown of glowing root tips brightening. Living roots have closed the valley. | Moo laa dri has risen. Mossy bark towers above us, its crown of glowing root tips brightening. Living roots have closed the valley. |
| `guardian_calming_start.mp3` | We can help the valley recover. First, we need to learn where Mooladri's roots run. | We can help the valley recover. First, we need to learn where Moo laa dri's roots run. |
| `guardian_roots_hint.mp3` | Use a seismic scan beside the valley. It will trace the living roots beneath our drills. | *same* |
| `guardian_roots_scan_done.mp3` | The root map is clear. Move the drills away from every marked root before we continue. | *same* |
| `guardian_roots_done.mp3` | The drills are clear. Mooladri's roots have loosened, but the haze remains. | The drills are clear. Moo laa dri's roots have loosened, but the haze remains. |
| `guardian_air_hint.mp3` | Place working bio-filters near the smog and give the air time to clear. | *same* |
| `guardian_air_done.mp3` | The haze is thinning. Light is returning to the forest, and Mooladri's crown is steadier. | The haze is thinning. Light is returning to the forest, and Moo laa dri's crown is steadier. |
| `guardian_bloom_hint.mp3` | The soil is clean now. Replant the bloom spores around Mooladri's exposed roots. | The soil is clean now. Replant the bloom spores around Moo laa dri's exposed roots. |
| `guardian_bloom_done.mp3` | The bloom has taken root. The ground is settling, and new growth is spreading between the old roots. | *same* |
| `guardian_calm.mp3` | Mooladri has settled into the forest. The roots have opened a path into the valley. | Moo laa dri has settled into the forest. The roots have opened a path into the valley. |
| `guardian_flora_bonus.mp3` | With Mooladri calm, Jivagraha's flora now absorbs pollution twice as quickly. An excellent arrangement for everyone. | With Moo laa dri calm, Jivagraha's flora now absorbs pollution twice as quickly. An excellent arrangement for everyone. |

### `CHAMBER_LINES` — 4 lines, prefix `chamber_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `chamber_chamber_glimpse.mp3` | There is a chamber below this seam. Its light does not match the minerals around it. | *same* |
| `chamber_fragment_reading.mp3` | I am detecting a signal consistent with a Quantum Fragment. We need a closer reading before I can confirm it. | *same* |
| `chamber_root_threads.mp3` | Roots thread along the chamber wall. The forest appears to have grown around whatever lies below. | *same* |
| `chamber_chamber_return.mp3` | We cannot reach the chamber safely yet. Let us finish our work above ground and return. | *same* |

### `LIFTOFF_LINES` — 5 lines, prefix `liftoff_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `liftoff_ship_ready.mp3` | Starter ship ready. Hydrogen and oxygen are flowing to the engines, and the cargo is secure. | *same* |
| `liftoff_launch_check.mp3` | The launch pad is clear. Our first voyage will be short, provided the navigation system remembers its job. | *same* |
| `liftoff_rise.mp3` | We are rising above Jivagraha. From here, the shelter is a speck and the forest is a ring of light. | *same* |
| `liftoff_next_world.mp3` | Our next destination is Taptashila, a mineral-rich world closer to the sun. We will need better shielding there. | Our next destination is Tup ta shee laa, a mineral-rich world closer to the sun. We will need better shielding there. |
| `liftoff_cliffhanger.mp3` | Taptashila is coming into view. I am reading something unusual beneath its oldest rock. We have another question to answer. | Tup ta shee laa is coming into view. I am reading something unusual beneath its oldest rock. We have another question to answer. |

### `CREATURE_LINES` — 6 lines, prefix `creature_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `creature_first_grazer.mp3` | Give that grazer space to feed and watch it from here. We can be interesting from a distance. | *same* |
| `creature_first_burrower.mp3` | Stand back from that small opening and watch the burrower look around. Our welcome appears to be provisional. | *same* |
| `creature_first_bird.mp3` | Look above the forest for a small bird circling in daylight. A useful reminder to look up occasionally. | *same* |
| `creature_grazer_shy.mp3` | Pause and leave the grazer room to wander; it steps away when we come too close. | *same* |
| `creature_burrower_shy.mp3` | Step back from the burrower's opening and wait quietly. It has concluded this meeting. | *same* |
| `creature_bird_roost.mp3` | Give the bird's roost some space as dusk falls. Its working day appears to be over. | *same* |

### `STUCK_HINTS` — 16 lines, prefix `stuck_`

| File | Line as the game shows it | Line to paste into Bulbul |
| --- | --- | --- |
| `stuck_wake.mp3` | Follow the daylight through the open hatch to the shelter beside the solar lotus. | *same* |
| `stuck_oxygen_supply.mp3` | Gather blue ice, rust-red iron and silica beneath the grass, then press Tab to craft an electrolyzer. | *same* |
| `stuck_battery.mp3` | Place a battery on the shelter's power network before sunset and let spare solar power charge it. Darkness accepts no promises. | *same* |
| `stuck_smelter.mp3` | Load the powered smelter with iron ore and carbon, then walk close to collect its finished plates. | *same* |
| `stuck_automation.mp3` | Research drills and conveyors at a powered station, then press C, click the drill, then click the smelter. | *same* |
| `stuck_huxley_message.mp3` | Look for Prof. Huxley's recording on the main deck and press E to listen. | Look for Professor Hux lee's recording on the main deck and press E to listen. |
| `stuck_translator.mp3` | Search the front deck for the translator Prof. Huxley mentioned. | Search the front deck for the translator Professor Hux lee mentioned. |
| `stuck_memory_logs.mp3` | Read any memory log you find with E, then press J to revisit it in the Codex. | *same* |
| `stuck_rover.mp3` | Check the vehicle bay's parts list and supply what is missing to finish the rover. Your boots have earned some assistance. | *same* |
| `stuck_roots.mp3` | Use a seismic scan beside the valley, then move every drill away from the marked living roots. | *same* |
| `stuck_clear_smog.mp3` | Keep bio-filters near the smog supplied with water and power until the haze clears. | *same* |
| `stuck_replant_bloom.mp3` | Replant bloom spores around Mooladri's exposed roots once the soil is clean, then give the new growth time to settle. | Replant bloom spores around Moo laa dri's exposed roots once the soil is clean, then give the new growth time to settle. |
| `stuck_fragment_chamber.mp3` | Follow the path Mooladri has opened and scan the unfamiliar light below the seam when the chamber is safely reachable. | Follow the path Moo laa dri has opened and scan the unfamiliar light below the seam when the chamber is safely reachable. |
| `stuck_launch_pad.mp3` | Check the launch pad's parts list, gather what is missing, and choose a clear site for assembly. | *same* |
| `stuck_starter_ship.mp3` | Finish the ship's listed parts, supply hydrogen and oxygen, and check its cargo before launch. | *same* |
| `stuck_lift_off.mp3` | Complete the launch checks and begin lift-off once the pad is clear. My navigation system is preparing its best effort. | *same* |

---

## 4. Lines I expect to sound wrong even with a respelling

These are the ones to listen to first when the files come back. I would rather name them now than have them discovered in the demo.

1. **`intro_systems` — "SARATHI online."** A ship announcing her own name is the hardest thing here, because सारथी is an ordinary Sanskrit word as well as a name, and a voice reading "Saa ra thee online" may put the stress on the wrong syllable or say it as two words. **Suggested rewording for the Director to approve:** *"Systems online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either."* This is not a compromise — a ship that reports "systems online" is more SARATHI than one that introduces herself, and the player learns her name from the subtitle anyway.
2. **`guardian_awake` — "Mooladri has risen. Mossy bark towers above us…"** The most important line in the chapter and the longest single name, in the first three words. If "Moo laa dri" still comes out wrong, try the hyphenated form **"Moo-laa-dri"**, which forces three clean syllables. This is the one line I would re-record until it is right, because it is the moment the Guardian arrives.
3. **`liftoff_next_world` and `liftoff_cliffhanger` — "Taptashila".** Four syllables with an awkward `pt-sh` cluster in the middle, and it is the name of the next world, so it will be said hundreds of times in the game. If "Tup ta shee laa" fails, **"Tup-taa-shee-laa"**. Worth settling now rather than after Chapter 2 is written around it.
4. **`stuck_huxley_message` and `stuck_translator` — "Professor Hux lee".** The name will be fine; the risk is that "Professor" now makes the line noticeably longer than the others in the set, which is fine for a hint but noticeable if it is played back to back with the rest.
5. **`guardian_flora_bonus` — "twice as quickly"** is the one phrase I would listen to for rhythm rather than pronunciation. It is a dry joke that only lands if the voice does not rush the second half.

**Nothing else worries me.** The creature lines contain no Sanskrit at all — they say "grazer", "burrower" and "bird", which is deliberate and correct, since the Codex names are for reading and these are for hearing in the moment.

---

## 5. For the Director

- **52 files, and 37 of them are paste-and-go.** The recording session is mostly reading, not respelling.
- **Wire the six prefixes in `voice.ts` first**, or the files will sit in the folder unplayed — which is exactly what happened with the `sarathi_goal_ice` / `goal_ice` mismatch on 31 October. A test that no two lines map to one file name would catch both that class of bug and the `battery` / `smelter` collision above.
- **Record `intro_systems`, `guardian_awake`, `liftoff_next_world` and `liftoff_cliffhanger` first**, and send them to me. If the four names survive, the other 48 will; if they do not, we have saved 48 recordings and found out on line four.
- **When the set lands, I will run the same technical pass as T-035** — clipping, trim, levels, pace against the existing 57 — and give you the short listen list rather than asking for all 52 by ear.

---

## 6. Approved since: the rewording, and the four phone variants

Two decisions were open in section 1 and section 4. Both are now taken, so this section is the final word on them.

### 6a. `intro_systems` — reworded, with the exact edit

"SARATHI online" is the one line I would not record as written: सारथी is an ordinary Sanskrit word as well as her name, and a voice given "Saa ra thee online" may stress it as a word rather than a name. The rewording is approved, so **two things change and they must change together**:

| | |
| --- | --- |
| **In `src/data/scenes.ts`,** the line becomes | `systems: "Systems online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either.",` |
| **The file name stays** | `intro_systems.mp3` |
| **Paste into Bulbul** | Systems online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either. |

The Director needs to make the one-line change in `scenes.ts`; the recording is made from the new text. If the old text were kept in the file and the new text recorded, the subtitle and the voice would disagree — which is the one failure this whole script exists to prevent. **If you would rather keep "SARATHI online", say so and I will put the respelling back; the risk is stress, not comprehension.**

### 6b. The four phone variants

Rather than accept a phone player hearing "press Tab" while the screen says "tap Bag", record the four hints that have touch wording. Four extra files, and they close the mismatch for the whole set — the other twelve stuck hints contain no key names at all, so their desktop and touch wording is identical and one recording serves both.

Naming: keep the `stuck_` group and add `_touch` to the key, so nothing collides with the desktop file of the same hint.

| File | Line as the game shows it on a phone | Line to paste into Bulbul |
| --- | --- | --- |
| `stuck_oxygen_supply_touch.mp3` | Gather blue ice, rust-red iron and silica beneath the grass, then tap Bag to craft an electrolyzer. | *same* |
| `stuck_automation_touch.mp3` | Research drills and conveyors at a powered station, then tap Belt, then Pick on the drill, then Pick on the smelter. | *same* |
| `stuck_huxley_message_touch.mp3` | Look for Prof. Huxley's recording on the main deck and tap Use to listen. | Look for Professor Hux lee's recording on the main deck and tap Use to listen. |
| `stuck_memory_logs_touch.mp3` | Read any memory log you find with Use, then tap Codex to revisit it. | *same* |

That brings the session to **56 files: 52 desktop lines and 4 touch variants.**

### 6c. Fallback respellings, if a name still fails

Try these in order and stop at the first that sounds right. Each keeps the syllables the same and only changes how they are glued together.

| Name | First try | Second try | Third try |
| --- | --- | --- | --- |
| Mooladri | `Moo laa dri` | `Moo-laa-dri` | `Moolaa dri` |
| Taptashila | `Tup ta shee laa` | `Tup-taa-shee-laa` | `Tupta sheelaa` |
| Huxley | `Hux lee` | `Hux-lee` | — |

**The rule behind the third column:** a hyphen joins syllables tightly and stops a voice treating the pieces as separate words, while a space does the opposite. If a name sounds like two words, remove the space. If it sounds rushed, add one.

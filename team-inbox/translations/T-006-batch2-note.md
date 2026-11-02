# T-006, batch 2: the Chapter 1 goal and hint text

**Delivery note**

- **What this is:** the second batch of T-006 — `src/data/chapter1.ts` in Hindi and Marathi, **55 strings**: 16 goal titles, 16 goal hints, 16 stuck hints, 3 phone goal hints and 4 phone stuck hints. Files: `T-006-hi-batch2.json`, `T-006-mr-batch2.json`, same `{ id, where, text }` shape as batch 1.
- **Coverage checked mechanically:** every key in `CHAPTER1_GOALS`, `STUCK_HINTS`, `PHONE_GOAL_HINTS` and `PHONE_STUCK_HINTS` has a row. 55 expected, 55 delivered, no missing ids.
- **Why the ids are prefixed `ch1_`:** `chapter1.ts` and `story.ts` both have goals called `battery` and `smelter`. Without a prefix they would collide in one JSON object, and one would silently overwrite the other — the same trap I flagged for the voice file names in T-040. `ch1_goal_battery_title` cannot collide with anything.

**Register and names:** तुम in Hindi, तू in Marathi, as in batch 1. Sanskrit names in Devanagari (मूलाद्रि, जीवग्रह, तप्तशिला); English names and abbreviations left in Latin (`Prof. Huxley`, `Codex`); button names untouched (`E`, `Tab`, `J`, `C`, `Use`, `Bag`, `Belt`, `Pick`).

**Two lines to look at before these ship:**

1. `ch1_stuck_battery` is the longest string in either batch at 125 characters in Hindi. It ends with "Darkness accepts no promises", and the joke is carried by **अंधेरा वादे नहीं मानता** / **अंधार वचनं मानत नाही** — which is drier in Marathi than in Hindi. If the hint box has a fixed height, this is the one to trim.
2. `ch1_goal_fragment_chamber_hint` says "Fragment chamber", which I transliterated as फ्रैगमेंट चैंबर / फ्रॅगमेंट चेंबर to match क्वांटम फ्रैगमेंट in batch 1. If the Codex ends up calling it something else in English, tell me and I will align all four strings that mention it.

**Still outstanding for T-006:** the Codex entries (~20), Huxley's message and the memory logs (10), and the machine and item names (~40). Those are batch 3, and they are the long-prose ones — I would rather do them in one careful pass than in fragments.

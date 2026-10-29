# Corebound handoff (28 October 2026, updated 29 October)

> **29 October:** Huxley (rigged, five clips) and SARATHI models are in the game: SARATHI floats beside the Custodian; Huxley appears as a hologram in his recordings. Mooladri is faceless (the Commander's new concepts). New tasks T-025 and T-026. Details in `docs/STATUS.md`.

This file covers four things:

1. what was built in the Director's first long working chat (18 to 28 October 2026);
2. where everything stands;
3. a handout for the Commander and each AI worker;
4. the prompt to start the next chat with Claude.

- **Game:** Corebound, "A game by Medhanshu Shahane"
- **Repository:** github.com/medh-eng/Corebound (public)
- **Play it:** https://medh-eng.github.io/Corebound/ (press Ctrl+F5 after an update)

---

## 1. Work done in this chat

### The game, milestone by milestone

| Milestone | Built | What it added |
| --- | --- | --- |
| **Plan** | 18 Oct | Design document (GDD), roadmap, art inbox; moved the game to 3D. |
| **M0 Look test** | 25 Oct | Title screen with the owner's logo; flight down to a 150 m round planet; walking, running, jumping, jetpack; day and night with aurora; glowing forests; shelter dome and solar lotus; planet view (M); goals panel; pause screen. |
| **M1 Dig and survive** | 25–26 Oct | Laser digging (pits and tunnels; sandstone, iron, ice and carbon underground); 8-slot backpack and crafting; oxygen and suit power; shelter air from the electrolyzer; solar and battery through the night; blackout; helmet lamp; autosave. The owner's rigged Custodian (11 animations, two dances on G, a salute on goals); the smelter makes iron plates. |
| **After the first playtest** | 26 Oct | Mouse mining fixed; visible laser tool; resource counter; settings menu (save, load, volumes, mouse sensitivity, shadows); plates go into the backpack at the smelter; status tags over machines. |
| **M2 Build and automate** | 27 Oct | Build menu (B). Research station with tiers 1–2. Auto-drills that mine whatever lies under them. Conveyors (C) with items riding on them. Storage silo. Coal burner. Silicon furnace. Power pylons with cables. Six goals ending in a fully automatic iron-plate line. |
| **M3 Harmony and life** | 27 Oct | Air, Water and Soil pollution. Plants wilt and lose their glow; the sky hazes; water turns murky; music darkens. Machines need attention (E) when the world suffers. Bio-filter, settling pond, Sabatier reactor (hydrogen to methane). Glow-moths. Blooms and tier 3 research. Harmony in the HUD and in planet view. |
| **Scanner and Codex** | 27–28 Oct | Hold right mouse to scan; press J for the Codex. **38 entries** covering plants, creatures, rocks, machines, items and the planet's health, with Sanskrit names and Devanagari. Items open their entry the first time you hold one. |
| **Story pieces ready for M4** | 28 Oct | Huxley's first message, 9 memory logs and 5 SARATHI reactions (in `src/data/logs.ts`). The memory-log viewer (Huxley glows blue-gold; SARATHI's damaged records glitch; E or Esc closes). |

**Checks on every milestone:**
- **159 unit tests** pass, plus an automated factory playtest and a mouse playtest.
- Screenshots were taken in a headless browser.
- `npm run build` passes and the GitHub Pages site is updated.

### The Commander's art, music and sound, now in the game

- **Images:**
  - style tests and key art;
  - logo and four store images;
  - 24 world and Guardian concepts;
  - Custodian and Huxley concepts and turnarounds (Huxley also cropped square for the 3D tool);
  - grass, soil, rock and sandstone textures (Gemini's corner star removed automatically);
  - a night-sky panorama that wraps 360°.
- **3D models:** the Custodian (rigged), shelter dome, solar lotus, battery, electrolyzer, smelter, auto-drill, storage silo (reduced from 1 million triangles to 12,000), research station, coal burner, silicon furnace, bio-filter and conveyor.
- **Music (Pixabay):**
  - title theme;
  - Jivagraha day, night and underground, chosen automatically;
  - Guardian awake (plays if Harmony collapses);
  - Guardian calm (kept for M4);
  - three factory layers that join as the factory grows.
- **Sound effects (Pixabay):**
  - 37 uploads turned into 54 game sounds by `scripts/process-audio.py`;
  - footsteps by surface;
  - laser, jetpack, breathing, alarms, menus, machines, power and the ship engine.

### The team

- **Roles:**
  - Pon is the **Commander** (final authority).
  - Claude is the **Director**: plans, builds the hard parts, reviews and merges.
  - **ChatGPT** (Codex for code, chat for writing) and **Sarvam AI** (names, translation, voices, cultural review) are the workers.
- **Files that run the team:**
  - `AGENTS.md`: worker rules;
  - `docs/TEAM.md`: how tasks flow;
  - `tasks/BOARD.md`: every task;
  - `team-inbox/`: text deliveries;
  - `docs/PROMPTS.md`: every art, music and sound prompt, with **the Commander's checklist at the top**;
  - `docs/LICENCES.md`: where every file came from.
- **Pull-request checks:** every pull request is tested and built automatically.
- **Tasks done:**
  - ChatGPT: T-001, T-002, T-003, T-010, T-011, T-013, T-014, T-016, T-018, T-019, T-020.
  - Sarvam: T-004 (plus a follow-up review), T-005 sheet, T-006 glossary and pilot, T-012 (plus an art follow-up), T-017.

### Decisions made (all in the GDD's decisions log)

- **Design:**
  - **No violence:** creatures are never fought; Guardians are calmed, never defeated.
  - **Seven locations:** Jivagraha, Taptashila, Marubhumi, Himasagara, Vayumandala, Vishamegha and Shunyapath. Spaceships are flyable.
  - **Characters:** Prof. Orion Huxley (holograms), Alion Voss, the Szynthars (said **SIN-thar**) and alien peoples on each world. Project Amarnath. Waking in a cryo-pod.
- **Names:**
  - Guardians: Mooladri, Shailasarpa, Balukavela, Himavela, Meghapakshi, Tantukari.
  - Peoples: Deepajana, Khanik, Maruyatri, Jalabandhu, Patangajana, Shvasajana.
  - Creatures, such as Jyotishalabha the glow-moth.
  - Plants and rocks: Jyotivata, Deepashirsha, Jyotiguccha, Deepalata, Shantakamala, Sheetashikhara, Lohashila, Kajjala, Dhavala.
  - The bloom is **Sakshi** ("witness"). The HUD and goals keep "the bloom" in English, and the bloom is never a "0 of N" collectible.
- **Credits:**
  - "A game by Medhanshu Shahane";
  - a thank-you to the Warli, Manganiyar and Langa, dhokra and bidri craft traditions;
  - "Music and sound effects: artists on Pixabay".
- **Style bible guards** (from Sarvam's reviews):
  - no religious symbols, temples, idols or kalash finials;
  - no faces on Guardians or drones;
  - no flowers on pedestals;
  - no pointed Gothic or Moorish arches;
  - no gun-shaped tools.

---

## 2. Where things stand

- **M0 to M3** have first versions built and are live.
- **M3 still needs:**
  - grazer and burrower models;
  - machine sound loops and ambience;
  - voice respellings (T-023).
- **Next milestone: M4, the Chapter 1 demo:**
  - Root Guardian Mooladri (a body built from roots in code, a three-step calming puzzle, a closed valley that opens);
  - the cryo-pod wake-up in the crashed escape module;
  - Huxley's hologram and the translator;
  - memory logs placed in the wreckage;
  - SARATHI drone;
  - rover and vehicle bay;
  - the Fragment chamber;
  - launch pad and the starter ship's first lift-off as the cliffhanger;
  - settings, difficulty and photo mode;
  - itch.io and Steam pages.
- **The rule:** M4 starts when the Commander has played M2 and M3 and says go.

**Open tasks:**

| Task | Who | What |
| --- | --- | --- |
| T-021 | ChatGPT (Codex) | A "Logs" tab in the Codex |
| T-022 | ChatGPT (chat) | Chapter 1 scenes: waking up, calming Mooladri, the lift-off |
| T-023 | Sarvam AI | Voice respellings for the ten plant and rock names |
| T-024 | Sarvam AI | Cultural review of the other ten concepts and the Huxley/Custodian turnarounds |
| T-005 | Commander | Record SARATHI's five test lines in Sarvam Bulbul |
| T-006 | Sarvam AI | Hindi and Marathi for Chapter 1 (waits until the text is frozen in M4) |

**Decided 29 October:** Mooladri is faceless, with a crown of glowing root tips (the Commander remade the concept).

**Also open since 29 October:** T-025 store page text (ChatGPT chat), T-026 text size setting (ChatGPT Codex, after T-021). Waiting for the Commander: which 3D tool made Huxley and SARATHI.

---

## 3. Handouts

### 3a. For the Commander (Pon)

1. **Your to-do list is the top of `docs/PROMPTS.md`** ("Your checklist"). ✓ means received. "⏳ Needed from you next" is in order:
   1. Huxley 3D model and Mixamo clips;
   2. Root Guardian concept again without a face, then a restless version;
   3. grazer and burrower 3D models;
   4. story props;
   5. rover, starter ship, launch pad, vehicle bay;
   6. SARATHI 3D model;
   7. Sabatier reactor model;
   8. machine sound loops;
   9. ambience;
   10. the memory-log and spaceflight music;
   11. the voice test;
   12. teaser clips.
2. **Uploading:** on GitHub, open the right folder under `art-inbox/` → Add file → Upload files → Commit. Use the exact file name from PROMPTS.md. Write where it came from (for example "Pixabay") in the commit message.
3. **Giving work to the agents:**
   - **ChatGPT Codex:** say `Do tasks/T-021-codex-logs-tab.md in medh-eng/Corebound. Follow AGENTS.md.`
   - **ChatGPT chat or Sarvam:** paste the whole text of the task file, plus the files it says to read, and ask for the delivery file it names. If they cannot push to GitHub, upload their answer to `team-inbox/writing/` with the task number in the file name.
4. **Playing:** open the link, press Ctrl+F5.
   - **Moving and building:** WASD to move, Space to jump or jetpack; left mouse mines; E to use; Tab for the backpack.
   - **Panels:** B to build; C for belts; hold right mouse to scan; J for the Codex; M for planet view; G to dance; Esc to pause.
   - **Feedback:** tell the Director anything that is boring, confusing or broken.
5. **Before release:** list which 3D tool made each model and check its commercial terms (PROMPTS.md §11). Never put the blueprint PDF in the repository (it has students' contact details).

### 3b. For ChatGPT (Codex): paste this

> You are a worker on Corebound (github.com/medh-eng/Corebound), a non-violent 3D game. Read `AGENTS.md` first and follow it exactly. Your task is `tasks/T-021-codex-logs-tab.md`. Build it on the branch `chatgpt/T-021-codex-logs-tab` and change only the files the task allows. Make sure `npm test` and `npm run build` pass. Then open a pull request using the template in `AGENTS.md`, set the task's Status line to "review", and list any doubts for the Director. Do not start other tasks.

### 3c. For ChatGPT (chat): paste this, then paste `tasks/T-022-chapter1-scenes.md`

> You are the writer for Corebound, a cosy, non-violent 3D survival-factory game ("A game by Medhanshu Shahane"). Nothing is fought, hurt or killed. Guardians are calmed, never defeated, and the mining laser is a tool, never a weapon. SARATHI is a damaged, lotus-shaped ship AI: one sentence of guidance, then at most one dry remark. Prof. Huxley is a kind, careful scientist. Use British spelling and keep each line under 30 words. Do not reveal the story's twist. Write the task below and give it back as one Markdown file named in the task. Each section should be a TypeScript object of `id: "line"` pairs.

### 3d. For Sarvam AI: paste this, then paste `tasks/T-023-flora-respellings.md` or `tasks/T-024-art-review-rest.md`

> You are the language and culture adviser for Corebound, a non-violent 3D game with an Indo-futurist look ("A game by Medhanshu Shahane"). Your earlier work (names, glossary, cultural reviews) is merged and in the game; thank you. Keep the same standards: Devanagari is exact, and say plainly when something reads as religious, ritual or a stereotype. Say what is right as well as what is wrong. Deliver one Markdown file named in the task.

---

## 4. Prompt for the next chat with Claude

Copy everything in the box into a new Claude Code chat on the Corebound repository.

```
You are the Director of Corebound (repo medh-eng/Corebound, public; play at
https://medh-eng.github.io/Corebound/). I am Pon, the Commander (final authority, non-technical).
I make art, music and sound with AI tools and Pixabay, upload them to art-inbox/, and play the game.

Start by reading, in order: CLAUDE.md, docs/HANDOFF.md, docs/GDD.md, docs/ROADMAP.md,
docs/STATUS.md, tasks/BOARD.md, docs/TEAM.md, AGENTS.md, and the top of docs/PROMPTS.md ("Your checklist").
Then do your Director duties:
1. Check art-inbox/ for my new uploads (see `git log` for "Add files via upload"). Validate and process them:
   scripts/process-assets.mjs (models and images; config scripts/assets.config.json) and
   scripts/process-audio.py (sounds and music; recipes scripts/audio.config.json). Check GLB size,
   scale, orientation and triangle budgets (GDD §17). Report problems in plain words.
2. Check team-inbox/ and open pull requests from ChatGPT and Sarvam AI (use the REST API through gh;
   GraphQL is blocked). Review each against AGENTS.md and the task's "Done when" list: run tests,
   play the build, take screenshots. Merge locally with `git merge --no-ff origin/<branch>`, or request
   changes with exact instructions. Move approved text into src/data/.
3. Update tasks/BOARD.md, docs/STATUS.md, and the checklist at the top of docs/PROMPTS.md
   (✓ for everything received; "⏳ Needed from you next" in order). I only read PROMPTS.md for my own work.
4. Give the workers new tasks as task files when useful. Keep engine, systems, integration and
   quality checks yourself.
5. Tell me what changed and what needs my decision.

Where we are: M0–M3 have first versions built (159 tests pass); Huxley and SARATHI models are in.
Open tasks: T-021 and T-026 (ChatGPT Codex), T-022 and T-025 (ChatGPT chat), T-023 and T-024 (Sarvam),
T-005 (my voice test). Mooladri is faceless (decided). Next milestone is M4, the Chapter 1 demo.
Start it only after I say go.

Rules: no violence; the GDD is the source of truth (log every design decision there); never merge
design changes without my yes; data in src/data/; plain-English commit messages; every milestone
ends playable (npm run build, tests, GitHub Pages updated); never add the blueprint PDF to the repo.

Practical notes from the last chat:
- Dev server: `COREBOUND_BASE=/ npx vite --port 5173` in the background.
- Screenshots: `node scripts/screenshots.mjs "/?shot=1" out.png 1280 720 0 "<js>"`. Test hooks are on
  window.__game (setTime, teleport, give, place, simulate, openCodex, showLog, pollute, planetView, and more).
  The headless browser is slow: keep commands under 10 minutes and use few frames.
- Playtests: scripts/playtest-m2.mjs and scripts/playtest-mouse.mjs.
- Rigged characters: Mixamo FBX clips go in art-inbox/models/<character>/, then `npm run rig -- <character>`
  with the dev server running (clip lists in src/tools/rig.ts). Preview a log: /?log=huxley_01.
- After pushing, run `git fetch origin '+refs/heads/main:refs/remotes/origin/main'`.
- Check the deploy with `gh run list -R medh-eng/Corebound -L 1 --workflow pages.yml`.
```

# Status

*Updated by the Director (Claude) at the end of every session. Newest first. The Commander reads this to know where everything stands.*

## 2026-10-29 (afternoon)

**Android:** yes. The game now plays on Android phones and tablets in Chrome, and installs to the home screen like an app (full screen, landscape). First version:
- **On-screen controls:** a joystick wherever your left thumb lands (push to the edge to run); drag anywhere else to look; **Mine**, **Jump**, **Use**, **Scan** on the right (hold Mine and slide to aim); a bottom row with Bag, Build, Belt, Codex, Planet, O₂, Pick up and Dance; **Place / Turn / Cancel** while building; ✕ closes panels.
- **Goals, tips and prompts** name the buttons instead of keys on a phone ("hold Mine", "tap Use").
- **Phone graphics preset:** screen resolution, no shadows (can be turned on), lighter glow, 40% of the grass and ferns. Trees, rocks and ore are unchanged.
- **Checked** on an emulated Android screen (800 × 360): the HUD fits, walking with the joystick, holding Mine collects ice, Bag opens the backpack and ✕ closes it. A real phone test by the Commander is next (frame rate: add `?fps=1`). Play Store later (roadmap: phone track).

**Worker deliveries, all reviewed and merged (5 pull requests):**
- **T-021 (ChatGPT Codex):** a Logs tab in the Codex. Wired up: logs you have opened are kept and can be played again.
- **T-022 (ChatGPT chat):** Chapter 1 scene lines (waking up, Mooladri's three calming steps, the Fragment chamber, the lift-off) are in `src/data/scenes.ts`, ready for M4. New tests check every line is short, free of violent words, and never gives Mooladri a face.
- **T-025 (ChatGPT chat):** store page text and an AI-disclosure draft, kept for M4; one fix ("crowned with glowing root tips"). Needs your approval before publishing.
- **T-023 (Sarvam):** voice respellings for the ten plant and rock names (stored with the names), and four Codex lines fixed so the English explains the Sanskrit (Deepalata gives light and creeps; Deepashirsha glows rather than reflects; Kajjala is lamp-black; Sakshi means witness). Kajjala kept.
- **T-024 (Sarvam):** a careful review of the new art. Acted on at once in code: **Huxley's hologram** no longer stands in a column of light with arms spread (Sarvam: that reads as a darshan); he now stands half-turned on a small emitter with his gestures softened. **SARATHI** is repainted from brass to off-white ceramic with copper trim (Sarvam: an all-brass bud on feet reads as a shrine lamp). Three lines added to the style bible (no arch-and-lotus niches, no bell mouths on machines, holograms with hands at rest).

**Your three models did not arrive:** nothing new reached GitHub after 10:58. GitHub's web upload refuses files over 25 MB, which is the likely reason. Please upload `cryo_pod.glb`, `vehicle_bay.glb` and `sabatier_reactor.glb` again (smaller export if needed).

**Licences:** Huxley and SARATHI were made with Triple 3D. Its terms allow commercial use without attribution; keep generations private there (public ones may be shown by Triple 3D). Recorded in `docs/LICENCES.md`.

**Waiting for the Commander:**
- Upload the three models again.
- Play on your phone and tell the Director the frame rate and what feels awkward.
- Decide Mooladri's body: your humanoid giant of roots, or Sarvam's buttressed trunk (no shoulders, chest or fingers). The crown stays.
- Were the earlier models (the Custodian and the machines) also made with Triple 3D?
- Approve the store text (T-025) when M4 comes; say "go" for M4.

**New worker tasks:** T-027 privacy notice and phone help (ChatGPT chat). T-026 text size (ChatGPT Codex) can start now; it was updated to build on the phone scaling.

## 2026-10-29

**Your uploads, now in the game** (press Ctrl+F5 first):
- **SARATHI** floats beside you, off your left shoulder (lower in tunnels), bobbing and leaning as it follows. When it speaks, two rings of light and a soft beam open above its petals. The 3D tool had turned the hologram face in the concept into a dark ball above the petals; the Director cut it off, which also keeps the "no faces on drones" rule. Its paintwork glows a little at night. https://medh-eng.github.io/Corebound/
- **Prof. Huxley** is rigged with your five Mixamo clips (Breathing Idle, Talking, Talking 2, Thinking, Pointing). He appears as a full-body blue-gold hologram on a projector beside the text of his recordings, changing gestures as he talks. Logs are placed in the world in M4; to see him now: https://medh-eng.github.io/Corebound/?log=huxley_01 (press Start; his message opens after about 6 seconds).
- **Root Guardian, calm and restless, faceless:** exactly right. Taken as your answer to the open question: Mooladri is faceless, with a crown of glowing root tips (logged in the GDD).
- **Crash site** and **star-system overview**: the loading screen now shows one of three pictures at random (key art, crash site, star system). The crash site is the reference for the escape module.
- **Tidied:** `guardian_root-.png` became `guardian_root.png` (the bearded one is kept in the history); `sarthi.glb` became `sarathi.glb`; Huxley's clips moved into `art-inbox/models/huxley/`; the four store images uploaded again into `concept/` were exact copies of the ones in `style/`, so the copies were removed.

**Problems found and fixed in the tools (no work for you):**
- Huxley's model was uploaded to Mixamo centred on his middle, while Mixamo's animations stand on the ground, so every clip lifted him about half a metre into the air. The rig tool now moves the clips back onto his body.
- The asset tool measured rigged characters by their mesh instead of their skeleton; it now measures the skeleton.
- The rig tool now takes any character (`npm run rig -- huxley`), with clips in `art-inbox/models/<character>/` (Director task D-003 done).

**Checked:** 159 unit tests, the M2 factory playtest (station → research → drill → belt → smelter → silo with 5 plates), the mouse playtest, screenshots by day and night with SARATHI speaking, Huxley's hologram in two recordings, `npm run build`.

**No worker deliveries** since the handoff: nothing new in `team-inbox/` and no open pull requests. T-021, T-022, T-023 and T-024 are still waiting to be passed to the workers.

**New worker tasks:** T-025 store page text and an AI-disclosure draft (ChatGPT chat), T-026 a text size setting (ChatGPT Codex, after T-021). T-024 (Sarvam) now also covers the new concepts and the Huxley and SARATHI models (pictures in `docs/review/2026-10-29/`).

**Waiting for the Commander:**
- Which 3D tool made `huxley.glb` and `sarathi.glb` (for the licences list).
- Play M2 and M3 and say "go" for M4.
- Pass T-021 and T-026 to ChatGPT Codex, T-022 and T-025 to ChatGPT chat, T-023 and T-024 to Sarvam.
- Next art: the escape module and cryo-pod (the demo opens inside them), then the creatures and props (checklist at the top of PROMPTS.md).

## 2026-10-28

- **Sound effects** are from Pixabay (Commander). Recorded in `docs/LICENCES.md`; the Credits now say "Music and sound effects: artists on Pixabay".
- **T-019 merged (ChatGPT):** the memory-log viewer. Huxley's messages glow blue-gold, SARATHI's corrupted records glitch, text plays like a recording; E or Esc closes it. Logs get placed in the world in M4.
- **T-017 merged (Sarvam):** plant and rock names. The Director took Sarvam's suggested set: Jyotivata (banyan), Deepashirsha (mushroom tree), Jyotiguccha (glow-mushrooms), Deepalata (ferns), Shantakamala (lotus pads), Sheetashikhara (ice), Lohashila (iron ore), Kajjala (carbon), Dhavala (sandstone), **Sakshi** ("witness") for the bloom. The HUD keeps "the bloom" in English; the Codex shows the names.
- **T-020 merged (ChatGPT):** Codex entries for the research station, silo, pylon, conveyor, silicon, iron plate, oxygen and the O₂ canister. Items have nothing to scan, so their entries open the first time you hold one (oxygen and hydrogen when an electrolyzer first runs).
- **T-012 art follow-up merged (Sarvam):** Sarvam reviewed 14 concept images. Applied: the style bible now says no faces on Guardians or drones, no flowers on pedestals, no pointed Gothic/Moorish arches, no gun-shaped tools. **For the Commander:** the Root Guardian concept has a bearded human face; the checklist asks for it again without one (Mooladri is built in code from roots).
- **New tasks:** T-021 Logs tab in the Codex (ChatGPT Codex), T-022 Chapter 1 scenes: waking up, Mooladri, the lift-off (ChatGPT chat), T-023 voice respellings (Sarvam), T-024 review of the remaining concepts and the Huxley/Custodian turnarounds (Sarvam).
- 159 tests pass.

## 2026-10-27 (night)

- **Credits** now thank the Warli painters, the Manganiyar and Langa musicians, the dhokra metal-casters and the bidri artisans, and credit the Pixabay music artists (Commander said yes).
- **Szynthar** is said SIN-thar (final).
- **Licences:** new `docs/LICENCES.md`; music recorded as Pixabay. Still to confirm: the source of the sound effects.

## 2026-10-27 (evening)

**Your to-do list now lives at the top of [PROMPTS.md](PROMPTS.md) ("Your checklist").** Everything received is marked ✓; what is wanted next is numbered in order.

**Reviewed and merged (6 pull requests):**
- ChatGPT: **Codex panel** (T-016), **loading-screen tips** (T-011), **data-check tests** (T-013), and the writing: **Huxley's message and 9 memory logs** (T-001), **33 science cards** (T-002), **SARATHI's research and machine lines** (T-014), **16 Codex entries** (T-018). All careful and accurate; ChatGPT tested its code branches together before sending.
- Sarvam: **check of the chosen names** (three fixed: Khanaka → Khanik, Kathinakita → Kathorakita, Jyotipatang → Jyotishalabha) and a **translation glossary with a Hindi/Marathi pilot** for when the Chapter 1 text is frozen.

**Your uploads, now in the game:**
- **Music:** title theme (on the title screen), Jivagraha day, night and underground (chosen automatically), Guardian awake (plays if Harmony collapses), Guardian calm (kept for M4), three factory layers that join as your factory grows. All loudness-matched and crossfaded.
- **Prof. Huxley:** concept and turnarounds received and consistent. Square, tightly framed copies made for the 3D tool: `art-inbox/turnaround/huxley_front_square.png` (and side, back).
- **Machine models:** all seven M2 models were already in the game (auto-drill, storage silo, research station, coal burner, silicon furnace, bio-filter, conveyor).

**New in the game:** the **scanner** (hold right mouse) and the **Codex** (J): 30 entries for plants, creatures, rocks, machines and the planet's health; SARATHI now speaks ChatGPT's lines when research finishes, a machine is placed for the first time, or the first belt is laid.

**Questions for the Commander:** (1) the Credits thank-you line to Indian craft traditions, yes or no; (2) Szynthar: said SIN-thar or ZIN-thar (Medhanshu's choice); (3) where each music track and sound came from (licences).

**New worker tasks:** T-019 memory-log viewer (ChatGPT Codex), T-020 Codex entries for the remaining machines (ChatGPT chat). Sarvam still has T-017 (plant names).

## 2026-10-27 (M3)

**Playable:** https://medh-eng.github.io/Corebound/ (Pages is on again)

**Reviewed and merged:** T-010 backpack tests (ChatGPT, 47 tests), T-012 cultural review (Sarvam; applied to PROMPTS.md: religious-imagery guard in the style bible, fixed props, 24 corrected music style lines, materials per world).

**M3 Harmony and life: first version built** (the Commander said to carry on with the next work)
- **Harmony:** Air, Water and Soil get dirty from smelters, furnaces, coal burners and drills, and clean themselves through healthy plants. Bands: Thriving, Stable, Stressed, Collapse.
- **The world answers:** plants wilt to straw and lose their glow, the sky and fog haze over, water turns murky, the music darkens; when it thrives, plants get lusher and bloom flowers open.
- **When Stressed:** machines randomly need attention (acid rain, grit); walk up and press E to fix. Nothing is ever destroyed.
- **New machines:** bio-filter (your model), settling pond, Sabatier reactor (code-made until a model arrives). The electrolyzer now also makes hydrogen for the Sabatier reactor, which makes methane (future rocket fuel).
- **Life:** glow-moths (Jyotipatang) fly around you, more when the world is healthy. **Blooms:** rare flowers while Thriving; laser them; they unlock tier 3 research (clean smelting, bloom filters).
- **HUD:** Air/Water/Soil shapes change colour; press M for planet view with exact numbers.
- **Goals:** look at the planet (M) → build a bio-filter → collect a bloom.
- **Checked:** 148 unit tests (8 new for Harmony), the M2 playtest, the mouse playtest, the new goal chain, screenshots of a clean and a polluted world, planet view and the new machines.

**Still to come in M3:** scanner and Codex (T-016 panel, T-017 names, T-018 text, T-002 science cards); grazers and burrowers (your creature models, T-015); your music and machine sounds.

**Waiting for the Commander:** play M2 and M3; answer the Credits question (a thank-you line to Indian craft traditions, suggested by Sarvam); pass on T-011, T-013, T-016 (ChatGPT Codex), T-001, T-002, T-014, T-018 (ChatGPT chat), T-017 (Sarvam); art T-015 and sound T-008.

## 2026-10-27 (M2)

**Playable:** waits for GitHub Pages to be turned on again (Settings → Pages → Source: GitHub Actions). The repository is public again.

**M2 Build and automate: first version built**
- **Build menu (B):** every machine you can place, with its cost; click to craft and place in one go.
- **Research station:** load the parts (by hand with E, or by belt); with power it researches. Tier 1: auto-drill, conveyors, power pylons, storage silo, coal burner. Tier 2: silicon furnace, bigger backpack (+4 slots), faster drills, silicon lotus cells (+25% solar).
- **Auto-drill:** place it anywhere; it samples the ground 1–8 m down and mines the best ore there forever (iron veins, ice, carbon, or plain rock for silica). The placement ghost tells you what it will mine and how rich.
- **Conveyors (C):** click the sending machine, then the receiving one; the belt follows the ground (your conveyor model) and items ride along it. 2 m of belt per conveyor item; up to 30 m.
- **Storage silo** (300 items, E takes all), **coal burner** (5 kW from carbon, day and night), **silicon furnace** (silica + carbon → silicon), **power pylons** (carry power 14 m, link 26 m, copper cables).
- **Status tags** over machines: no power, needs carbon, plates ready, research progress, drill full.
- **New goals** after the smelter: research station → research the auto-drill → place a drill → research conveyors → lay a belt → 5 plates from belt-fed ore.
- **Names** chosen (Mooladri, Shailasarpa, Balukavela, Himavela, Meghapakshi, Tantukari; Deepajana, Khanaka, Maruyatri, Jalabandhu, Patangajana, Shvasajana; creatures) and stored in `src/data/names.ts` and the GDD.
- **Checked:** 31 unit tests (11 new for the factory), an automated M2 playtest (station → research → drill finds iron 60% rich → belt → smelter makes plates → belt → silo), the M1 mouse playtest, screenshots of the build menu, research panel, belts and pylons.

**Moved to M3:** scanner and Codex (need the science cards, T-002); foundation pads and a top-down build camera are not needed yet.

**Waiting for the Commander:** turn Pages on; play M2; machine sound loops and music (T-008); M3 art (T-015); give T-010, T-011, T-013 to ChatGPT Codex, T-001, T-002, T-014 to ChatGPT chat, T-012 to Sarvam; record the voice test (T-005).

## 2026-10-27

**Playable: NOT updating.** The repository was made **private** on 2026-10-26, and free GitHub accounts can only publish GitHub Pages from a public repository, so Pages was switched off. Every build since then passes, but publishing fails. The Commander chooses: make the repo public again (free), pay for GitHub Pro (private repo, public game page), or publish elsewhere (for example an itch.io draft page). Until then the link shows the last version before the repo went private, or nothing.

**Reviewed and merged**
- **T-003 Credits screen (ChatGPT Codex), PR #1:** clean code, only the allowed files, tests and build passed; checked in the running game. ✓
- **T-004 Names (Sarvam AI), PR #2:** three options for every Guardian, people and creature, Devanagari, pronunciation, meanings; careful about religious names; good notes on पादकानन and Vishamegha. ✓ The Commander now chooses.
- **T-005 Voice test (Sarvam AI), PR #3:** a recording sheet with the five lines, Hindi and Marathi versions, settings and a scorecard. Sarvam could not make the audio itself, so the Commander records it in Bulbul.
- **Not received:** T-001 (story logs) and T-002 (science cards) from ChatGPT chat. Nothing is in `team-inbox/writing/` for them.

**Owner art and sound now in the game**
- **37 sound effects** turned into 54 game sounds by a new tool (`scripts/process-audio.py`, recipes in `scripts/audio.config.json`): single footsteps cut out of long recordings (grass, rock, metal, sand, snow), seamless loops for the laser, laser on rock and on crystal, jetpack, heavy breathing, smelter roar, ship engine; levels balanced.
- **Made from your uploads** for sounds not yet supplied: laser stop, machine place and pick-up, menu click/open/close, power out/on, smelter roar, ship thrust.
- **Wired up:** footsteps by surface (grass outside, rock in tunnels, metal at the shelter), jump, landing, jetpack start/loop/stop, laser start/loop/stop with a different sound on rock and crystal, digging, low-oxygen alarm plus heavy breathing, O₂ canister, blackout, helmet lamp click, backpack open/close, smelter roar near a working smelter.
- **Textures:** grass, soil, rock and sandstone painted onto the ground and tunnel walls (Gemini's corner star removed automatically). Off on `?q=low`.
- **Night sky:** your panorama now fills the night sky, made to wrap 360°; its ringed planet takes over from the code-made one after dusk.
- **Animations:** Hip Hop Dancing, Silly Dancing and Salute added. **G** dances (press again for the other dance); the Custodian salutes when a goal is completed.
- **Machine models:** auto-drill, storage silo, research station, coal burner, silicon furnace, bio-filter and conveyor checked and processed (the silo had 1 million triangles: reduced to 12,000). They become buildable in M2.
- **Store art** (main capsule, header, vertical, library hero) received and checked; used at M4 for the store pages.

**Sound effects still wanted** (`docs/PROMPTS.md` §13), the code-made stand-ins work meanwhile: pickup chimes, goal jingle, craft done, invalid placement, rotate, electrolyzer bubbling, battery hum, solar lotus opening, ambience loops (forest day, forest night, cave).

**Please tell the Director:** which site or tool each sound came from (one, "dragon-studio-simple-whoosh", looks like Pixabay), so the licences can be listed before release.

**Waiting for the Commander**
- Play the new build; say "go" for M2.
- Choose names from `team-inbox/writing/T-004-names.md` (Director's shortlist in chat).
- Record T-005 voice tests in Sarvam Bulbul.
- Give T-001/T-002 to ChatGPT chat again, T-010/T-011 to ChatGPT Codex, T-012 to Sarvam AI.
- Music: see the free options in `docs/PROMPTS.md` §12 (free Suno is not allowed in a game that is sold).

## 2026-10-26 (evening)

**Playable:** https://medh-eng.github.io/Corebound/ (press Ctrl+F5 after an update)

**Done today**
- Mining fixed (the mouse button was not registered while held); visible laser tool; resource counts top right; settings menu with save, load, main menu, volumes, mouse sensitivity, shadows; code-made music and sound.
- Iron plates now go into the backpack automatically at the smelter; tags over machines show "plates ready", "needs ice", "needs ore + carbon".
- Ground-stripe glitch: shadows steadied (could not reproduce without a real graphics card; if it still happens, try Shadows: Low or Off and report).
- Medhanshu's blueprint compared with the game; the Commander's decisions written into the GDD (v0.4): non-violent creatures, 7 locations (Marubhumi, Vishamegha, Vayumandala added; Shunyapath kept), flyable spaceships, characters (Huxley, Voss, Szynthars, alien peoples), the blueprint's resources, buildings and vehicles, credits "A game by Medhanshu Shahane".
- Roadmap rebuilt: M5 Spaceflight + Taptashila, M6 Marubhumi, M7 Himasagara + Vayumandala, M8 Vishamegha, M9 Shunyapath and endings, M10 Launch.
- Team set up: `AGENTS.md` (rules for ChatGPT and Sarvam AI), `docs/TEAM.md` (who does what, how tasks flow), `tasks/` (board and first 9 tasks), `team-inbox/`, `docs/PROMPTS.md` (all prompts for images, 3D, music, sound, voices). Pull requests are now checked automatically (tests + build).

**Waiting for the Commander**
- Play the latest build; say whether the ground stripes are gone; say "go" for M2.
- Give T-001, T-002 (ChatGPT chat), T-003 (ChatGPT Codex), T-004, T-005 (Sarvam AI) to the workers (how: `docs/TEAM.md`).
- Art: T-007 textures and sky, T-008 music and sound, T-009 machine models.
- Decision later: names (after T-004), which world is पादकानन.

**Problems / risks**
- Free 3D credits are limited: use Hunyuan3D's 20 free daily generations first; only make turnaround images you have approved; skip anything marked *code* in PROMPTS.md.
- The scope is now much bigger (7 locations, spaceflight). Chapter 1 still comes first as a free demo.

# Status

*Updated by the Director (Claude) at the end of every session. Newest first. The Commander reads this to know where everything stands.*

## 2026-10-27

**Playable:** https://medh-eng.github.io/Corebound/ (press Ctrl+F5 after an update)

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

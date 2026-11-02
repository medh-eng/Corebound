# Task board

Updated by the Director. Status: **todo** → **doing** → **review** → **done** (or **waiting** when blocked). The Commander can reassign or cancel anything.

## Workers

| Task | Title | Assigned to | Priority | Status |
| --- | --- | --- | --- | --- |
| [T-001](T-001-chapter1-story-logs.md) | Chapter 1 story: Huxley's first message and memory logs | ChatGPT (chat) | P2 | done ✓ (PR #11; in `src/data/logs.ts`, placed in M4) |
| [T-002](T-002-science-cards.md) | Science cards for machines and resources | ChatGPT (chat) | P2 | done ✓ (PR #11; 11 machine cards are now Codex entries) |
| [T-003](T-003-credits-screen.md) | Credits screen | ChatGPT (Codex) | P1 | done ✓ |
| [T-004](T-004-names.md) | Names | Sarvam AI | P2 | done ✓; Sarvam's follow-up review (PR #6) fixed three names |
| [T-005](T-005-sarathi-voice-test.md) | SARATHI voice test | Sarvam AI + Commander | P2 | done ✓ (PR #21, 31 Oct; 57 lines speak in the game; Director fixed the file names) |
| [T-006](T-006-translations-ch1.md) | Hindi and Marathi, Chapter 1 | Sarvam AI | P3 | waiting for the freeze after slice 5; batches 1–2 (106 strings) merged ✓ (PR #38, 2 Nov); glossary and pilot done ✓ (PR #7) |
| [T-010](T-010-inventory-tests.md) | Unit tests for the backpack and crafting | ChatGPT (Codex) | P1 | done ✓ (PR #5, 47 tests) |
| [T-011](T-011-loading-tips.md) | Tips on the loading screen | ChatGPT (Codex) | P2 | done ✓ (PR #9) |
| [T-012](T-012-cultural-review.md) | Cultural review of art and music prompts | Sarvam AI | P2 | done ✓ (PR #4, applied to PROMPTS.md); art follow-up PR #15 applied too |
| [T-013](T-013-data-checks.md) | Tests that check the game data fits together | ChatGPT (Codex) | P1 | done ✓ (PR #10) |
| [T-014](T-014-research-lines.md) | SARATHI lines for research and new machines | ChatGPT (chat) | P2 | done ✓ (PR #11; in the game) |
| [T-016](T-016-codex-panel.md) | The Codex panel (M3) | ChatGPT (Codex) | P1 | done ✓ (PR #8; opens with J) |
| [T-017](T-017-flora-names.md) | Names for Jivagraha's plants, rocks and the bloom | Sarvam AI | P2 | done ✓ (PR #12; Sarvam's suggested set is in the Codex) |
| [T-019](T-019-log-viewer.md) | The memory-log viewer (M4) | ChatGPT (Codex) | P1 | done ✓ (PR #13; wired to E/Esc; logs placed in M4) |
| [T-020](T-020-codex-machines.md) | Codex entries for the remaining machines and items | ChatGPT (chat) | P2 | done ✓ (PR #14; 8 entries in the Codex) |
| [T-021](T-021-codex-logs-tab.md) | A "Logs" tab in the Codex (M4) | ChatGPT (Codex) | P1 | done ✓ (PR #16; wired: logs you open are kept and replay from the Codex) |
| [T-022](T-022-chapter1-scenes.md) | Chapter 1 scenes: waking up, the Root Guardian, the lift-off | ChatGPT (chat) | P1 | done ✓ (PR #17; in `src/data/scenes.ts`, used in M4) |
| [T-023](T-023-flora-respellings.md) | Voice respellings for the plant and rock names | Sarvam AI | P3 | done ✓ (PR #19; respellings in `names.ts`, four Codex lines fixed) |
| [T-024](T-024-art-review-rest.md) | Cultural review of the remaining concepts, the new art and the Huxley and SARATHI models | Sarvam AI | P2 | done ✓ (PR #20; hologram restaged, SARATHI repainted, three style-bible lines added) |
| [T-025](T-025-store-page-text.md) | Store page text for the demo (itch.io and Steam), AI disclosure draft | ChatGPT (chat) | P2 | done ✓ (PR #18; used for the store pages in M4, after the Commander approves) |
| [T-026](T-026-codex-text-size.md) | A text size setting | ChatGPT (Codex) | P2 | done ✓ (PR #22, 1 Nov; Director kept SARATHI's line and prompts where they were) |
| [T-027](T-027-privacy-and-phone-help.md) | Privacy notice and "playing on a phone" help | ChatGPT (chat) | P2 | done ✓ (PR #26; phone help goes into the game in T-028) |
| [T-028](T-028-phone-help-hud-wording.md) | Phone help card and HUD wording fixes (#23, #25) | ChatGPT (Codex) | P1 | done ✓ (PR #28, 1 Nov; Director moved the card below the vitals and enlarged its text) |
| [T-029](T-029-android-movement-lock.md) | Android movement sometimes stops (#24) | ChatGPT (Codex) | P1 | done ✓ (PR #27, 31 Oct; Director kept walking through page resizes) |
| [T-030](T-030-codex-m4-entries.md) | Codex entries for Chapter 1 objects | ChatGPT (chat) | P2 | done ✓ (PR #33, 2 Nov; `CHAPTER1_CODEX` in `codex.ts`, joins the Codex in M4; Director rewrote Mooladri and the valley so they don't give away the puzzle) |
| [T-031](T-031-chapter1-goals-hints.md) | Chapter 1 goals and SARATHI stuck hints | ChatGPT (chat) | P2 | done ✓ (PR #34, 2 Nov; 16 goals and stuck hints in `src/data/chapter1.ts`, used in M4) |
| [T-032](T-032-review-new-models-mooladri.md) | Review of three new models; advice on Mooladri's body | Sarvam AI | P2 | done ✓ (PR #29; trunk body approved; colour re-export of cryo pod and Sabatier taken) |
| [T-033](T-033-hindi-marathi-ui.md) | Hindi and Marathi for controls, tips, phone help, privacy | Sarvam AI | P3 | done ✓ (PR #31; kept for the language setting at M10) |
| [T-034](T-034-voice-ducking-subtitles.md) | Music dips while SARATHI speaks; her text stays as long as the voice | ChatGPT (Codex) | P2 | done ✓ (PR #30) |
| [T-035](T-035-voice-listening-review.md) | Listen to the 57 recordings; list any to redo | Sarvam AI + Commander | P2 | done ✓ (PR #32; redo `goal_breathe.mp3` as "Electrolisis") |
| [T-036](T-036-names-and-review-new-models.md) | Names for the grazer, burrower and bird; review of the 11 new models | Sarvam AI | P2 | done ✓ (PR #36, 2 Nov; Mridugami, Bilavasa, Divachari in the Codex; projector, launch pad and fragment need trim fixes) |
| [T-037](T-037-creature-lines.md) | SARATHI lines and a bird Codex entry for the creatures | ChatGPT (chat) | P2 | done ✓ (PR #35, 2 Nov; SARATHI's six creature remarks in the game; bird Codex entry, birds now scannable) |
| [T-038](T-038-graphics-setting.md) | A Graphics setting (Phone / Low / High) | ChatGPT (Codex) | P2 | todo (new) |
| [T-039](T-039-m4-machine-lines.md) | SARATHI lines for the M4 machines, research and vehicles | ChatGPT (chat) | P2 | todo (new) |
| [T-040](T-040-voice-script-ch1.md) | Voice script for Chapter 1: respellings for SARATHI's new lines | Sarvam AI | P2 | done ✓ (PR #37, 2 Nov; 56 files; prefixes wired in `voice.ts`, silent until recorded) |
| [T-041](T-041-photo-mode-panel.md) | Photo mode panel | ChatGPT (Codex) | P2 | todo (new) |
| [T-042](T-042-mooladri-ui-text.md) | Text for Mooladri's valley; polish of three slice-2 goal lines | ChatGPT (chat) | P1 | todo (new) |
| [T-043](T-043-voice-addendum.md) | Voice addendum: five goal lines, with Hindi and Marathi | Sarvam AI | P2 | todo (new) |
| [T-018](T-018-codex-text.md) | Codex entries for Jivagraha and Harmony | ChatGPT (chat) | P2 | done ✓ (PR #11; in the game) |

## Commander

| Task | Title | Priority | Status |
| --- | --- | --- | --- |
| [T-007](T-007-commander-art-p1.md) | Jivagraha textures and night sky | P1 | done ✓ |
| [T-008](T-008-commander-audio-p1.md) | Music and sound effects | P1 | music mostly done ✓; machine loops and ambience still wanted (see PROMPTS.md checklist) |
| [T-009](T-009-commander-models-m2.md) | Machine models for M2 | P1 | done ✓ (all in the game) |
| [T-015](T-015-commander-art-m3.md) | Art for M3: creatures, restless Guardian, plants, Sabatier reactor | P2 | restless Guardian done ✓ (2026-10-29); creatures and Sabatier reactor still to do |
| — | Huxley 3D model and Mixamo clips | P1 | done ✓ (2026-10-29) |
| — | SARATHI 3D model | P2 | done ✓ (2026-10-29) |
| — | Root Guardian without a face | P1 | done ✓ (2026-10-29) |
| — | Say which 3D tool made Huxley and SARATHI (licences) | P1 | done ✓ (Triple 3D) |
| — | Upload again: cryo pod, vehicle bay, Sabatier reactor | P1 | done ✓ (30 Oct); **re-export Sabatier and cryo pod with colours** |
| — | Play on an Android phone | P1 | done ✓ (issues #23–#25); **retest now** (movement fix is live), help/wording after T-028 |
| — | Decide Mooladri's body: humanoid or buttressed trunk (Sarvam) | P1 | **next** |
| — | Escape module and cryo-pod models (reference: `concept/jiva_crash_site.png`) | P1 | **next** |
| — | Turn on GitHub Pages | — | done ✓ |
| — | Play M2 and M3, then say "go" for M4 | — | done ✓ (2026-11-02) |

## Director (Claude)

| Task | Title | Status |
| --- | --- | --- |
| D-002 | M2 Build and automate | done ✓ (first version) |
| D-003 | Rig tool: per-character animation folders | done ✓ (2026-10-29: `npm run rig -- huxley`; clips in `art-inbox/models/<character>/`) |
| D-007 | Huxley hologram and SARATHI drone in the game | done ✓ (2026-10-29) |
| D-008 | Android: touch controls, Phone preset, installable app (phone track P1) | done ✓ first version (2026-10-29); tuning after the Commander's phone test |
| D-009 | Creature remarks wired; birds scannable (T-037) | done ✓ (2026-11-02) |
| D-010 | M4 build plan (`docs/M4-PLAN.md`) | written ✓; **go given 2026-11-02** |
| D-011 | M4 slice 1: wake-up in the escape module, Chapter 1 goal panel, stuck hints | done ✓ (2026-11-02) |
| D-012 | M4 slice 2: Huxley's message, translator, memory logs in the wreckage | done ✓ (2026-11-02) |
| D-013 | M4 slice 3: Mooladri, the closed valley, the calming puzzle | next (needs the trunk concept) |
| D-005 | Store art for the store pages and loading screen | M4 |
| D-006 | M3 Harmony and life | first version done ✓; scanner/Codex waits for T-016/T-017/T-018 |

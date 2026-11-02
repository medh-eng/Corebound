# T-042: Text for Mooladri's valley (M4 slice 3), and a polish of three new goal lines

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P1
- **Deliver to:** `team-inbox/writing/T-042-mooladri-ui-text.md`

## Goal
Slice 2 is live: Prof. Huxley's projector and the translator wait by the escape module, and seven memory logs lie around the crash site under soft blue beams. Your T-001 logs, T-019 viewer and T-021 Logs tab are all doing their jobs together now. Thank you.

Slice 3 is Mooladri. The scene lines are ready (`GUARDIAN_LINES` in `scenes.ts`). It also needs the short text the player reads on screen.

## Read first
`AGENTS.md`; `src/data/scenes.ts` (`GUARDIAN_LINES`, the order of the calming steps); `src/data/chapter1.ts` (milestones `roots`, `clear_smog`, `replant_bloom`); `src/data/story.ts` (the three new steps `huxley_message`, `translator`, `memory_logs`); `src/data/codex.ts` (`mooladri`, `root_valley`); `docs/M4-PLAN.md` slice 3.

## Write (TypeScript objects of `id: "text"` pairs)
1. **`VALLEY_PROMPTS`** (on-screen prompts, under 12 words each, "press E" style):
   `roots_blocked` (walking into the closed valley), `seismic_scan_hold` (while holding Scan near the valley), `root_marked` (a root shown on the ground), `drill_on_root` (looking at a drill that stands on a root), `bloom_spores_plant` (where spores can be planted), `bloom_spores_wrong` (soil not clean yet), `valley_open` (after Mooladri is calm).
2. **`VALLEY_STEPS`**: four goal-panel steps for slice 3, in the style of `story.ts` (`text` under 15 words; `sarathi` under 30 words, said when the step begins): `seismic_scan`, `move_drills`, `bio_filters_valley`, `replant_bloom`. Four steps, not three: scanning and moving the drills are separate.
3. **A polish of the three slice-2 steps** in `story.ts` (`huxley_message`, `translator`, `memory_logs`): keep the meaning and the "press E" wording; the Director wrote them quickly. Give the improved `text` and `sarathi` for each, or say "keep".

## Rules
- Mooladri is faceless and is **calmed, never defeated**. Nothing is fought, hit, cut or burned. Roots are given room; they are never removed.
- SARATHI: one sentence of guidance, then at most one dry remark. British spelling. Under the word limits above.
- Do not reveal the story's twist. Do not name the calming steps in the prompts before their step begins.

## Done when
- [ ] 7 prompts, 4 steps, 3 polished (or kept) steps, all within the limits
- [ ] Nothing contradicts `scenes.ts`, `chapter1.ts` or the Codex

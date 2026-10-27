# T-014: SARATHI lines for research and new machines

- **Assigned to:** ChatGPT (chat)
- **Status:** review
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-014-research-lines.md`
- **Depends on:** nothing

## Goal
When a research finishes, or the player places a new kind of machine for the first time, SARATHI says one line. Write them.

## Read first
- `AGENTS.md` (SARATHI's voice), `src/data/story.ts` (existing lines), `src/data/research.ts` (the 9 research nodes), `src/data/items.ts` (machines)

## What to write
1. For each research node id: one line, under 25 words, said when it completes. Hint at what to do next; one in three may have dry humour.
2. For each machine id (`electrolyzer`, `battery`, `solar_lotus`, `smelter`, `research_station`, `auto_drill`, `storage_silo`, `power_pylon`, `coal_burner`, `silicon_furnace`): one line when the first one is placed.
3. Three short lines for when a belt is laid for the first time, when a drill fills up, and when a machine is built out of power range.

Science must be right; no violence; British spelling; no story twist.

## Format
```
research.auto_drill: ...
machine.coal_burner: ...
event.first_belt: ...
```

## Done when
- [ ] 9 + 10 + 3 lines; delivery note at the top

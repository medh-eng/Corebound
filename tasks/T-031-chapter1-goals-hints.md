# T-031: Chapter 1 goals and SARATHI hints (first 30 minutes)

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-031-chapter1-goals-hints.md`

## Goal
The demo's first 30 minutes must never leave a player lost. Write the goal list and the "stuck" hints.

## Read first
`AGENTS.md`; `docs/GDD.md` (Chapter 1 and M4 in `docs/ROADMAP.md`); `src/data/scenes.ts`, `src/data/lines.ts`, `src/data/story.ts` (existing goals format).

## Write
1. **Goals** (12–16), in play order from waking in the cryo-pod to the first lift-off: `{ id, title (≤ 6 words), hint (≤ 20 words) }`. Include finding memory logs, the translator, the rover, calming Mooladri (three steps, matching `scenes.ts`), the Fragment chamber and the launch pad.
2. **Stuck hints:** for each goal, one SARATHI line said if the player has made no progress for 3 minutes (one sentence of guidance, then at most one dry remark; under 30 words).
3. **Phone versions:** where a hint names a key (E, B, J…), give the phone wording too (button names from `src/data/controls.ts`).

## Rules
Same voice as `lines.ts`. No violence; Guardians are calmed. Do not reveal the twist. British spelling. TypeScript objects in code blocks.

## Done when
- [ ] 12–16 goals in order, each with a stuck hint and, where needed, a phone version
- [ ] Nothing contradicts `scenes.ts`

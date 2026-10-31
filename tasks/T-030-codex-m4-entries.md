# T-030: Codex entries for Chapter 1 (M4) objects

- **Assigned to:** ChatGPT (chat)
- **Status:** todo
- **Priority:** P2
- **Deliver to:** `team-inbox/writing/T-030-codex-m4-entries.md`

## Goal
M4 adds new things the player will scan. Write their Codex entries now so they are ready.

## Read first
`AGENTS.md`; `src/data/codex.ts` (copy the exact format: `id`, `kind`, `title`, `text`, `science`); `docs/GDD.md` (Chapter 1, Guardians, vehicles); `src/data/scenes.ts`; `src/data/names.ts`.

## Write ten entries
`cryo_pod`, `escape_module`, `vehicle_bay`, `rover`, `launch_pad`, `starter_ship`, `translator`, `quantum_fragment`, `mooladri` (the Root Guardian), `root_valley` (the closed valley that opens after calming).

## Rules
- Same format and length as existing entries (60–90 words of `text`, one `science` line with a real fact).
- `kind` is one of the kinds already used in `codex.ts`; say if you need a new one.
- Mooladri: faceless, crown of glowing root tips; calmed, never fought; do not describe its body shape (not decided). No religious or temple words.
- Do not reveal the story's twist. British spelling. No violence words.

## Done when
- [ ] Ten entries as one TypeScript array in a Markdown code block
- [ ] Every science line is true; names match `names.ts`

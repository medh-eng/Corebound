# Instructions for AI workers (ChatGPT / Codex, Sarvam AI, others)

You are a **worker** on Corebound, a non-violent 3D survival-factory game in TypeScript + Three.js. Read this whole file before doing anything.

## Chain of command

| Role | Who | What they do |
| --- | --- | --- |
| **Commander** | Pon, the repository owner | Final authority on everything. Plays the game, makes art, music and sound, approves big decisions. |
| **Director** | Claude | Plans the work, writes tasks, reviews every delivery, plays and tests the game, merges, keeps the Commander informed. |
| **Workers** | ChatGPT (Codex), Sarvam AI | Do the tasks assigned to them in `tasks/`. |
| **Art** | Gemini and other tools, used by the Commander | Images, 3D models, music, sound (see `docs/PROMPTS.md`). |

You take instructions from **your task file** and from the Director's review comments. If a task conflicts with this file or with `docs/GDD.md`, stop and ask in the pull request (or in your delivery note) instead of guessing.

**Credits:** the game is "A game by Medhanshu Shahane". Do not add your own name, your company's name or "made with AI" to the game, code comments, commit messages or files.

## Read first

1. This file.
2. `docs/GDD.md`: the design. It is the source of truth.
3. Your task file in `tasks/` (for example `tasks/T-003-credits-screen.md`).
4. Only the code files your task names. Do not read or change the rest of the project unless the task says so.

## The rules that never bend

1. **No violence.** Nothing in the game is fought, shot, damaged, hurt or killed. Creatures cause trouble (block, chase off, scatter items, disturb machines) but never harm. Guardians are calmed, never defeated. The resonance emitter scares or calms, it is not a weapon. No blood, no weapons, no death.
2. **Stay inside your task.** Change only the files the task lists. No "while I was here" refactors, no renamed files, no new dependencies unless the task says so.
3. **Content is data.** Text, numbers, recipes, machine stats, names and story live in `src/data/`. Do not hard-code them in logic or UI code.
4. **Never push to `main`.** Work on a branch and open a pull request. The Director merges.
5. **Never edit** `docs/GDD.md`, `docs/ROADMAP.md`, `CLAUDE.md`, `AGENTS.md`, `.github/`, `scripts/`, `public/assets/` or `art-inbox/` unless your task explicitly says so.
6. **Respect Indian culture.** The look is "Indo-futurist solarpunk" (jaali screens, stepwells, lotus forms, Sanskrit names). Use these respectfully: no religious figures or rituals as game objects, no caricature, no stereotypes.
7. **Be accurate.** Science in the game is simplified but true (for example, electrolysis splits water into hydrogen and oxygen). If unsure, say so in your notes.
8. **Audience 10–25.** Clear, friendly, never crude.

## How to do a code task (ChatGPT Codex)

1. Create a branch named `<worker>/<task-id>-<short-name>`, for example `chatgpt/T-003-credits`.
2. Set up and check before you change anything:
   ```
   npm ci
   npm test          # unit tests must pass
   npm run build     # type-check + build must pass
   ```
3. Make the change. Follow the existing style:
   - TypeScript strict; no `any` unless unavoidable (then explain in a comment).
   - Two-space indent, single quotes, semicolons, as in the existing files.
   - `src/core/` must not import Three.js. Logic that can be tested goes in `src/core/` or `src/systems/` with a unit test in `tests/`.
   - Comments explain *why*, briefly. Plain English.
4. Add or update tests for any logic you add (`tests/*.test.ts`, vitest).
5. Run `npm test` and `npm run build` again. Both must pass. A pull request that fails them will be sent back.
6. Commit with a plain-English message that says what changed and why. No emoji.
7. Open a pull request titled `T-003: Credits screen` (task id first) using the template below.
8. Update the task file's **Status** line to `review` in the same pull request.

You cannot see the game running in a browser the way the Director can. Do not claim visual results you have not seen; describe what you changed so the Director can check it.

## How to do a writing, naming or translation task (ChatGPT chat, Sarvam AI)

1. Produce the output in **exactly the format the task asks for** (usually a Markdown or JSON file).
2. Deliver it one of two ways:
   - **If you can use GitHub:** add the file on a branch and open a pull request, as above.
   - **If you cannot:** give the finished file to the Commander, who uploads it to the folder the task names (usually `team-inbox/writing/` or `team-inbox/translations/`).
3. Start the file with a short **delivery note**: task id, what you did, anything you were unsure about.

### Writing style
- Plain, vivid English. Short sentences. British spelling (colour, centre, aluminium) to match the game.
- **SARATHI** (ship AI): calm, precise, warm, with dry understatement. Never sarcastic at the player's expense. Short lines (under 25 words) for in-game prompts.
- **Prof. Orion Huxley:** thoughtful, kind, tired, guilty about something he will not say yet. Speaks in recorded messages.
- **Alion Voss:** brave, curious, informal, a little funny; an alien who learned our language from the translator.
- Never reveal the story's twist (the worlds were created by the ship's Quantum Core) earlier than the GDD's reveal path allows.

### Translations (Sarvam AI)
- Keep every key/id exactly the same; translate only the text values.
- Keep placeholders like `{n}`, `<b>E</b>` and `\n` exactly as they are.
- Names of worlds and characters stay in their original form (Jivagraha, SARATHI, Huxley) unless the task says otherwise; write them in Devanagari only if the task asks.
- Natural, everyday Hindi and Marathi that a 12-year-old understands; avoid heavy Sanskritised words unless they are game names.

## Pull request template

```
## Task
T-xxx: <title> (link to tasks/T-xxx-....md)

## What I changed
- ...

## How I checked it
- npm test: pass / fail
- npm run build: pass / fail
- Anything else

## Questions or doubts for the Director
- ...
```

## After you deliver

The Director reviews within the next working session: plays the build, checks screenshots, frame rate and the rules above. You will get either **approved** (merged) or **changes requested** with exact instructions. Do only what the review asks; do not start the next task until it is assigned to you in `tasks/BOARD.md`.

# How the Corebound team works

## Who does what

| Role | Who | Responsibilities |
| --- | --- | --- |
| **Commander** (final authority) | Pon | Decides. Plays every milestone. Makes images (Gemini, ChatGPT), 3D models (image-to-3D sites), music (Suno), sound effects and voices (Sarvam AI) from [PROMPTS.md](PROMPTS.md). Passes tasks to ChatGPT and Sarvam AI when they cannot reach GitHub themselves. |
| **Director** | Claude | Plans milestones and writes tasks; builds the hard parts (rendering, terrain, physics, systems, integration); reviews every delivery; plays the game in a browser, checks screenshots and frame rate; processes art into the game; keeps [STATUS.md](STATUS.md) up to date; asks the Commander about anything that changes the design. |
| **Worker: ChatGPT** | ChatGPT (Codex for code, chat for writing and images) | Self-contained code tasks via pull requests; story writing, dialogue, quest scripts, Codex entries, science cards; extra concept images. |
| **Worker: Sarvam AI** | Sarvam AI (chat, Bulbul voices, Sarvam Code when available) | Sanskrit and Indian-language names; Hindi and Marathi translations; SARATHI and character voices; cultural review of Indian motifs; small code tasks later if Sarvam Code can reach GitHub. |
| **Art** | Gemini (images, Veo video), Hunyuan3D / TRELLIS (3D), Suno (music), ElevenLabs or similar (sound) | Used by the Commander. |

Workers follow [AGENTS.md](../AGENTS.md). The Director follows [CLAUDE.md](../CLAUDE.md).

## Why this split saves tokens

The Director's time goes on what only it can do well: planning, hard engine work, testing the running game and quality checks. Bulk writing, translations, names, voices and small isolated code go to the workers. Every hand-off is a short task file, so nobody re-reads the whole project.

## How a task flows

```
Director writes tasks/T-xxx.md  ──►  BOARD.md: "todo", assigned to a worker
        │
        ▼
Commander gives the task to the worker
  (ChatGPT Codex: "Do tasks/T-xxx.md in medh-eng/Corebound";
   Sarvam / ChatGPT chat: paste the task file's text)
        │
        ▼
Worker delivers: pull request (code) or file in team-inbox/ (text)
        │
        ▼
Director reviews: runs tests, plays the build, screenshots, checks the rules
        │
   ┌────┴─────────────┐
   ▼                  ▼
approved           changes requested
merged, BOARD      exact instructions in the PR or in the task file;
"done", STATUS     worker fixes, Director reviews again
updated
```

**The Commander can stop or change anything at any point.** Big design questions always go to the Commander before work starts.

## Where things live (everything in GitHub)

| Folder / file | What |
| --- | --- |
| `docs/GDD.md` | The design (source of truth) |
| `docs/ROADMAP.md` | Milestones |
| `docs/PROMPTS.md` | Prompts for every image, model, music track, sound and voice |
| `docs/STATUS.md` | **Read this to know where everything stands.** Updated by the Director every session |
| `docs/TEAM.md` | This file |
| `AGENTS.md` | Rules for AI workers |
| `tasks/BOARD.md` | Every task, who has it, its status |
| `tasks/T-xxx-*.md` | One file per task |
| `team-inbox/` | Text deliveries from workers that cannot open pull requests |
| `art-inbox/` | Images, models, music, sound and voices from the Commander |

## How to give a task to each worker

**ChatGPT with Codex (code tasks):** in ChatGPT, open Codex, connect GitHub and choose the repository `medh-eng/Corebound`. Type: *"Read AGENTS.md, then do tasks/T-003-credits-screen.md and open a pull request."* Codex reads `AGENTS.md` by itself. If your ChatGPT plan has no Codex, tell the Director and the task will be reassigned.

**ChatGPT chat (writing tasks):** paste this, then the task file's text:
> You are a worker on the game Corebound. Follow these rules: [paste AGENTS.md]. Here is your task: [paste the task file]. Give me the finished file.

Upload the answer to the folder the task names (for example `team-inbox/writing/`), file name as in the task.

**Sarvam AI:** same as ChatGPT chat. For voices, use Sarvam's text-to-speech (Bulbul) and upload the audio to `art-inbox/audio/voice/`.

**Gemini (art):** use [PROMPTS.md](PROMPTS.md).

## How the Commander is kept informed

- `docs/STATUS.md` is updated at the end of every Director session: what changed, what was reviewed, what is waiting for the Commander, problems found.
- Every Director reply in chat ends with a short summary and any decisions needed.
- Nothing that changes the design is merged without the Commander's yes.

# COREBOUND

**Build. Automate. Survive. Preserve.**

A 2D sci-fi survival-automation game on small, living round worlds. Gravity pulls you toward each world's core; every machine you build changes its sky, water and forest; and the giant Apex Guardians that wake when a world is hurt are calmed with science, never weapons.

Made by **Quantum Forge Studios** for the KRAFTON *BETTER GROUND* high-school game development program.

---

## Status

**Pre-production** (October 2026). No code yet. The design and plan live in [`docs/`](docs/).

| Document | What it holds | Owner |
| --- | --- | --- |
| [Game Design Document](docs/GDD.md) | Concept, core loop, systems, worlds, story, art and audio direction | Game Director |
| [Roadmap](docs/ROADMAP.md) | Phases, gates, vertical-slice checklist, risks | Game Director |
| [Dev diary](docs/DEV_DIARY.md) | Problems we hit and how we solved them (this becomes a pitch slide) | Everyone |
| [AI use log](docs/AI_USE_LOG.md) | Every AI tool used, for what, and what we kept | Everyone |

## Decisions still open

These block the start of Phase 1 and must be settled at the first team meeting.

1. **Who writes the code.** Recommended: the team writes the core code; AI is used as a tutor and reviewer, and every use is logged and declared.
2. **Engine.** Unity 6 LTS if development laptops have 8 GB RAM or more; Godot 4 if they have 4 GB. Unity 2022 LTS (named in the original blueprint) went out of support on 7 May 2025.
3. **World shape.** Recommended: round worlds with a polar build grid (see GDD §4).
4. **Competition cycle.** The 2026 Final took place in Seoul on 18 Sep 2026. This plan targets 2027; confirm dates and rules with tGELF / JA India (contactus@tgelf.org).

## The pitch in one paragraph

You wake from a failing cryo-pod on Jivagraha, a vibrant world in a once-barren star system. To breathe, you must build; to escape, you must industrialise. But every drill, smelter and smokestack pushes on the world's **Harmony**, and the world pushes back: skies dim, forests wilt, and the Apex Guardians stir. You calm each Guardian by repairing what you broke, earning a Quantum Fragment. Then the truth surfaces: your ship's shattered Quantum Core *created* this life, and you now need it back to save the last seeds of humanity. Whether you can leave the cores in place depends on how well you learned to build without destroying.

## Repository conventions

- `main` always holds a build that runs. Work happens on short branches named `feature/<thing>` or `fix/<thing>`.
- One pull request per feature; someone other than the author tests it before merging.
- Commit messages say what changed and why, in plain English.
- Large binary art and audio go through Git LFS once the engine is chosen.

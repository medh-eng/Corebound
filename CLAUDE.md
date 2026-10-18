# Working on Corebound

Corebound is a 3D game built by Claude for the repo owner, who directs, playtests and produces art with AI tools. Read this file, then `docs/GDD.md` and `docs/ROADMAP.md`, before changing anything.

## Rules

- **The GDD is the source of truth.** If a build decision changes the design, update `docs/GDD.md` in the same commit and add a line to its decisions log.
- **Work one milestone at a time** (see `docs/ROADMAP.md`). Do not start the next milestone until the owner has played the current one and their feedback is handled.
- **Every milestone ends playable:** `npm run build` passes, tests pass, and the GitHub Pages build is updated.
- **Check your own work:** run the game in a headless browser, look at screenshots, and check the frame rate before reporting a milestone done.
- **No violence.** Nothing in the game is fought, damaged or killed. Guardians are calmed, never defeated.
- **Data, not code, for content.** Machines, recipes, elements, worlds, Harmony values and story text live in `src/data/`.
- **Art and audio stay swappable.** Code-made visuals live under `src/art/`, sound under `src/audio/`; owner-supplied files are processed from `art-inbox/` into `public/assets/` with the same names.
- **Owner art arrives in `art-inbox/`.** Check it at the start of each session; validate GLB size, scale, orientation and triangle budgets (GDD §17) before use; report problems in plain words.
- **Plain-English commit messages** that say what changed and why.

## Layout (planned)

```
src/
  core/      simulation tick, terrain density field, save/load (no Three.js imports; unit-tested)
  systems/   survival, power, logistics, research, Harmony, fauna, Guardians
  render/    Three.js scenes, cameras, post-processing, terrain meshing workers
  art/       procedural flora, sky, water, particles, shaders, palettes
  audio/     music layering and effects
  ui/        HUD, menus, build interface
  data/      machines, recipes, elements, worlds, story text
public/assets/  processed models, textures, audio from art-inbox
art-inbox/      owner uploads (see art-inbox/README.md)
tests/          unit tests for core and systems
```

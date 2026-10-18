# Working on Corebound

Corebound is built by Claude for the repo owner, who directs and playtests. Read this file, then `docs/GDD.md` and `docs/ROADMAP.md`, before changing anything.

## Rules

- **The GDD is the source of truth.** If a build decision changes the design, update `docs/GDD.md` in the same commit and add a line to its decisions log.
- **Work one milestone at a time** (see `docs/ROADMAP.md`). Do not start the next milestone until the owner has played the current one and their feedback is handled.
- **Every milestone ends playable:** `npm run build` passes, tests pass, and the GitHub Pages build is updated.
- **Check your own work:** run the game in a headless browser and look at screenshots before reporting a milestone done.
- **No violence.** Nothing in the game is fought, damaged or killed. Guardians are calmed, never defeated.
- **Data, not code, for content.** Machines, recipes, elements, worlds, Harmony values and story text live in `src/data/` files.
- **Art and audio stay swappable.** All drawing lives under `src/art/`, all sound under `src/audio/`, so a human artist or asset pack can replace them later.
- **Plain-English commit messages** that say what changed and why.

## Layout (planned)

```
src/
  core/      simulation tick, polar grid, save/load (no Phaser imports; unit-tested)
  systems/   survival, power, logistics, research, Harmony, Guardians
  scenes/    Phaser scenes: Boot, Menu, World, PlanetView, UI
  art/       code-drawn sprites, palettes, particles, lighting
  audio/     synthesised music layers and effects
  data/      machines, recipes, elements, worlds, story text
tests/       unit tests for core and systems
```

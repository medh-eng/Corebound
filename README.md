# COREBOUND

**Build. Automate. Survive. Preserve.**

A 3D survival-factory game on small, living planets. Walk all the way around each world, dig toward its core, and build the machines that keep you alive and carry you onward. Every machine changes the world: skies haze, forests wilt, creatures flee, and colossal Guardians wake. You win them over with engineering, never weapons.

**A game by Medhanshu Shahane**, for release on the web, itch.io and Steam.

---

## Status

**M2 Build and automate is playable** (October 2026): research new machines, place auto-drills on rich ground, lay conveyors, store, smelt and bake silicon, and carry power out with pylons — on top of M1's digging and survival. Next: owner playtest, then **M3 Harmony and life**.

| Document | What it holds |
| --- | --- |
| [Game Design Document](docs/GDD.md) | How the game looks and plays: systems, worlds, story, endings |
| [Roadmap](docs/ROADMAP.md) | Milestones M0–M10, what each delivers, publishing plan |
| [Status](docs/STATUS.md) | Where everything stands, updated every session |
| [Prompt Pack](docs/PROMPTS.md) | Prompts for every image, 3D model, music track, sound and voice |
| [Team](docs/TEAM.md) | Commander, Director and AI workers: who does what |
| [Task board](tasks/BOARD.md) | Every task and who has it |
| [AGENTS.md](AGENTS.md) | Rules for AI workers (ChatGPT, Sarvam AI) |
| [CLAUDE.md](CLAUDE.md) | Working rules for the Director |
| [art-inbox](art-inbox/README.md) | Where to upload art, models, video and audio |

## Play it

**https://medh-eng.github.io/Corebound/** (needs a computer browser with WebGL 2; Chrome or Edge recommended).

| Key | Action |
| --- | --- |
| W A S D | Walk |
| Mouse | Look around |
| Shift | Run |
| Space | Jump; hold in the air for the jetpack |
| Left mouse (hold) | Mining laser |
| Tab | Backpack and crafting |
| B / R | Build menu / turn the machine |
| C | Lay a conveyor: click the sending machine, then the receiving one |
| E / X | Use a machine (load it, research, take from a silo) / pick it up |
| Q | Breathe an O₂ canister |
| M | Planet view |
| G | Dance (press again for another dance) |
| N (hold) | Speed up time to see night and the aurora |
| Mouse wheel | Camera distance |
| F3 | Performance info |
| Esc or ⚙ | Menu: save, load, main menu, music, sound, mouse sensitivity, shadows |

Slow computer? Add `?q=low` to the address.

## For developers

```
npm install
npm run dev        # play locally at http://localhost:5173/Corebound/
npm test           # unit tests for terrain, movement and day-night
npm run assets     # turn art-inbox/ uploads into game-ready files in public/assets/
npm run build      # release build in dist/
```

Every push to `main` runs the tests and publishes the build to GitHub Pages.

## Technology

TypeScript + Three.js (WebGL), built with Vite; voxel digging with surface nets. Desktop builds via Electron for Steam and itch.io; web demo on GitHub Pages; Steam Deck as the handheld target.

## Copyright

All rights reserved. Corebound's code, art, sound and story may not be reused without permission.

# COREBOUND

**Build. Automate. Survive. Preserve.**

A 3D survival-factory game on small, living planets. Walk all the way around each world, dig toward its core, and build the machines that keep you alive and carry you onward. Every machine changes the world: skies haze, forests wilt, creatures flee, and colossal Guardians wake. You win them over with engineering, never weapons.

Built by Claude from an original idea, for release on the web, itch.io and Steam.

---

## Status

**M1 Dig and survive is playable** (October 2026): dig and mine with the laser, craft and place machines, keep your shelter breathing through the night, smelt iron plates. The Custodian is fully animated. Next: owner playtest, then **M2 Build and automate**.

| Document | What it holds |
| --- | --- |
| [Game Design Document](docs/GDD.md) | How the game looks and plays: systems, worlds, story, endings |
| [Roadmap](docs/ROADMAP.md) | Milestones M0–M10, what each delivers, publishing plan |
| [CLAUDE.md](CLAUDE.md) | Working rules for every build session |
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
| B / R | Build mode / turn the machine |
| E / X | Use / pick up a machine |
| Q | Breathe an O₂ canister |
| M | Planet view |
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

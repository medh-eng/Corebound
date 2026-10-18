# Corebound — Roadmap

*Goal: a polished, bug-free Jivagraha vertical slice (20–30 minutes) by 25 April 2027, ready for a 2027 BETTER GROUND application. Dates after April follow the 2026 cycle pattern and will move once 2027 dates are announced.*

## Phases and gates

| # | Phase | Dates | What gets built | Gate to pass before moving on |
| --- | --- | --- | --- | --- |
| 0 | Pre-production | 19 Oct – 15 Nov 2026 | Lock concept, engine and who codes; GDD v1; paper-prototype Harmony; art style test; task board | **Concept lock:** a one-page pitch all four agree on |
| 1 | Core prototype | 16 Nov – 27 Dec 2026 | Walk around a round planet; mine iron, silicon, ice; polar build grid; solar, battery, electrolyzer; oxygen; save/load | **Greybox playable:** a new player survives the first night |
| 2 | Systems | 28 Dec 2026 – 7 Feb 2027 | Drill → smelter → storage chain; day–night; rover; Harmony v1 changes sky, water, flora | **Harmony test:** playtesters notice the world reacting without being told |
| 3 | Exam season (light) | 8 Feb – 21 Mar 2027 | Feature freeze: art, music, lore logs only; finish with a bug-bash | — |
| 4 | Vertical slice | 22 Mar – 25 Apr 2027 | Root Guardian puzzle; polished first five minutes; launch teaser; trailer; blueprint v2 | **Application:** playable web link + 60-second trailer |
| 5 | Program polish | May – Aug 2027 | Mentor feedback; three playtest rounds; judge's-cut save; Himasagara teaser; performance | **Build freeze** two weeks before the final |
| 6 | Final | Sep 2027 (to confirm) | Pitch rehearsal; booth kit; "problems we solved" story; backup build | — |

## Vertical slice checklist (Jivagraha)

### World and survival
- [ ] Walk, jump and drill around a round planet with gravity toward the core
- [ ] Oxygen and suit power; blackout returns you to the shelter
- [ ] Day–night cycle as the planet turns
- [ ] Planet view (M) showing the whole world and the Harmony meter

### Factory
- [ ] Polar build grid with ghost preview, snapping and cost check
- [ ] Machines: shelter dome, solar panel, battery, electrolyzer, auto-drill, smelter, conveyor, storage, bio-filter, launch pad
- [ ] One complete chain: ore → smelter → plates → rover parts

### Harmony
- [ ] Air, Water and Soil stocks driving sky tint, flora state and music layers
- [ ] Bloom resource that appears only at high Harmony and is needed for one recipe

### Guardian, vehicle, story
- [ ] Root Guardian three-step puzzle and the first Quantum Fragment
- [ ] Rover that reaches the far crater
- [ ] 8–10 lore logs
- [ ] Rocket launch teaser for Himasagara

### Showcase
- [ ] Scripted first five minutes (see below)
- [ ] Judge's-cut save loaded from the main menu
- [ ] 60-second trailer and attract-mode loop
- [ ] One-page how-to-play
- [ ] Save and load

## The first five minutes (script)

1. **0:00** Cryo-pod alarm; oxygen at 30%.
2. **0:30** Mine ice beside the pod.
3. **1:30** Build an electrolyzer and breathe.
4. **2:30** Place the first solar panel as the world turns toward night.
5. **4:00** Night falls, the battery drains, the alarm returns.
6. **5:00** The first auto-drill runs on its own: the "it works" moment.
7. **6:00** The first puff of smog, and a nearby flower wilts: the hook.

## Who owns what

| Role | Owns | First two weeks |
| --- | --- | --- |
| Game Director (team lead) | GDD, Harmony numbers, playtests, pitch, dev diary | Rewrite the blueprint; paper-prototype Harmony with tokens |
| Lead Programmer | Player and gravity, polar grid, simulation tick, save/load | Set up the engine and repo; walk around a round planet |
| Lead 2D Artist & UI | Style guide, world tiles, buildings, HUD, Harmony visuals | One mock screenshot of Jivagraha (planet, factory ring, smog) |
| Narrative & Audio | Lore logs, Guardian design, layered soundscape, trailer | Write the Root Guardian puzzle; list 10 log titles; sound moodboard |

## Team rhythm

- **Daily:** one-line update on WhatsApp (done / doing / blocked).
- **Weekly:** Google Meet sprint planning; pick tasks from the board; demo what changed.
- **At each gate:** an in-person review; play the build; decide pass or fix.
- **Every week:** one entry in the dev diary; every AI use in the AI log.

## Risks

| Risk | Fix |
| --- | --- |
| Scope creep | Anything not on the slice checklist goes on an "after the final" list |
| One programmer for a systems game | Data-driven content; a second member learns to edit data and simple scripts |
| School exams in Feb–Mar | Feature freeze during Phase 3 |
| Slow on weak laptops | Separate simulation tick; test monthly on the weakest laptop |
| Harmony feels preachy or punishing | Reward clean play with bloom resources; tune in playtests |
| AI rules unclear | Ask tGELF in writing; keep the AI use log |
| Public repo reveals the twist | Acceptable for now; make the repo private if the team prefers |
| A member ages out before 2027 | Check every member's eligibility now |

## After the final (parking lot)

Ideas that are good but not in the slice go here, not into the build.

- Worlds 2–5 in full
- Submarine, glider and heat-shield rover
- Geothermal power from the mantle
- Korean subtitles for the Seoul showcase

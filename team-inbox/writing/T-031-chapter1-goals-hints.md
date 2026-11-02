# T-031: Chapter 1 goals and SARATHI hints

## Delivery note

```ts
export const DELIVERY_NOTE = {
  task: 'T-031: Sixteen ordered goals, sixteen stuck hints, and phone variants for every hint that names keyboard controls.',
  scope: 'Writing delivery for Director review; these proposed milestones do not change the running game.',
  basis: 'Checked against AGENTS.md, the GDD, the M4 roadmap, scenes.ts, lines.ts, story.ts and controls.ts.',
  doubt: 'The task mentions thirty minutes, while the GDD opening takes longer; timings and milestone grouping need a playtest.',
};
```

## Goals

```ts
export const CHAPTER1_GOALS = [
  {
    id: 'wake',
    title: 'Follow the daylight',
    hint: 'Check your oxygen gauge, leave the cryo-pod through the open hatch, and find the shelter beside the solar lotus.',
  },
  {
    id: 'oxygen_supply',
    title: 'Give the shelter air',
    hint: 'Gather ice, iron and silica; craft an electrolyzer, place it near the shelter, and load ice.',
  },
  {
    id: 'battery',
    title: 'Store daylight for the night',
    hint: 'Gather carbon from black rocks, then craft and place a battery so daylight power lasts after sunset.',
  },
  {
    id: 'smelter',
    title: 'Make your first iron plates',
    hint: 'Craft and place a smelter, load iron ore and carbon with E, then collect four iron plates.',
  },
  {
    id: 'automation',
    title: 'Let the factory carry things',
    hint: 'Build a research station, unlock drills and conveyors, then connect a drill to a smelter with a belt.',
  },
  {
    id: 'huxley_message',
    title: 'Listen to Prof. Huxley',
    hint: 'Find the main-deck recording and press E to hear Prof. Huxley explain your next step.',
  },
  {
    id: 'translator',
    title: 'Find the translator',
    hint: 'Follow Prof. Huxley’s directions to the front deck and collect the translator.',
  },
  {
    id: 'memory_logs',
    title: 'Gather the missing memories',
    hint: 'Find memory logs as you explore; press E to read them and press J to replay them.',
  },
  {
    id: 'rover',
    title: 'Build a rover',
    hint: 'Unlock the rover, build a vehicle bay, and supply the parts it needs to assemble your vehicle.',
  },
  {
    id: 'roots',
    title: 'Give the roots room',
    hint: 'Use a seismic scan beside the valley, then move every drill clear of the marked roots.',
  },
  {
    id: 'clear_smog',
    title: 'Let the forest breathe',
    hint: 'Research bio-filters, place them near the smog, and keep them supplied with water and power until the haze clears.',
  },
  {
    id: 'replant_bloom',
    title: 'Help the bloom take root',
    hint: 'When the soil is clean, replant bloom spores around Mooladri’s exposed roots and let the valley settle.',
  },
  {
    id: 'fragment_chamber',
    title: 'Follow the unfamiliar light',
    hint: 'After Mooladri settles, follow the opened valley path towards the Fragment chamber and scan the unfamiliar signal.',
  },
  {
    id: 'launch_pad',
    title: 'Build the launch pad',
    hint: 'Gather the launch pad’s listed parts and place it in a clear area for the starter ship.',
  },
  {
    id: 'starter_ship',
    title: 'Prepare the starter ship',
    hint: 'Supply the launch pad with the listed ship parts, hydrogen and oxygen, then check the cargo.',
  },
  {
    id: 'lift_off',
    title: 'See Jivagraha from above',
    hint: 'Complete the launch checks, clear the pad, and begin the first lift-off towards Taptashila.',
  },
];
```

## SARATHI stuck hints

```ts
export const STUCK_HINTS = {
  wake: 'Follow the daylight through the open hatch to the shelter beside the solar lotus.',
  oxygen_supply: 'Gather blue ice, rust-red iron and silica beneath the grass, then press Tab to craft an electrolyzer.',
  battery: 'Place a battery on the shelter’s power network before sunset and let spare solar power charge it. Darkness accepts no promises.',
  smelter: 'Load the powered smelter with iron ore and carbon, then walk close to collect its finished plates.',
  automation: 'Research drills and conveyors at a powered station, then press C, click the drill, then click the smelter.',
  huxley_message: 'Look for Prof. Huxley’s recording on the main deck and press E to listen.',
  translator: 'Search the front deck for the translator Prof. Huxley mentioned.',
  memory_logs: 'Read any memory log you find with E, then press J to revisit it in the Codex.',
  rover: 'Check the vehicle bay’s parts list and supply what is missing to finish the rover. Your boots have earned some assistance.',
  roots: 'Use a seismic scan beside the valley, then move every drill away from the marked living roots.',
  clear_smog: 'Keep bio-filters near the smog supplied with water and power until the haze clears.',
  replant_bloom: 'Replant bloom spores around Mooladri’s exposed roots once the soil is clean, then give the new growth time to settle.',
  fragment_chamber: 'Follow the path Mooladri has opened and scan the unfamiliar light below the seam when the chamber is safely reachable.',
  launch_pad: 'Check the launch pad’s parts list, gather what is missing, and choose a clear site for assembly.',
  starter_ship: 'Finish the ship’s listed parts, supply hydrogen and oxygen, and check its cargo before launch.',
  lift_off: 'Complete the launch checks and begin lift-off once the pad is clear. My navigation system is preparing its best effort.',
};
```

## Phone goal hints

```ts
export const PHONE_GOAL_HINTS = {
  smelter: 'Craft and place a smelter, load iron ore and carbon with Use, then collect four iron plates.',
  huxley_message: 'Find the main-deck recording and tap Use to hear Prof. Huxley explain your next step.',
  memory_logs: 'Find memory logs as you explore; tap Use to read them and tap Codex to replay them.',
};
```

## Phone stuck hints

```ts
export const PHONE_STUCK_HINTS = {
  oxygen_supply: 'Gather blue ice, rust-red iron and silica beneath the grass, then tap Bag to craft an electrolyzer.',
  automation: 'Research drills and conveyors at a powered station, then tap Belt, then Pick on the drill, then Pick on the smelter.',
  huxley_message: 'Look for Prof. Huxley’s recording on the main deck and tap Use to listen.',
  memory_logs: 'Read any memory log you find with Use, then tap Codex to revisit it.',
};
```

## Director handoff

```ts
export const DIRECTOR_HANDOFF = {
  timing: 'Offer the matching stuck hint after three minutes without progress on the active goal; reset that timer whenever progress occurs.',
  grouping: 'These are proposed chapter milestones; retain the existing resource and crafting subgoals so each build step remains explicit.',
  ids: 'Several milestone IDs group existing goals; map completion checks deliberately rather than replacing story.ts by position.',
  sequence: 'Keep Mooladri’s order: seismic scan and drill relocation, working bio-filters, then bloom spores after clean soil.',
  chamber: 'A glimpse may occur earlier; allow the chamber goal after Mooladri calms, and retain chamber_return until access is safe.',
  exploration: 'Do not require every memory log before continuing; logs should remain discoverable throughout the chapter.',
  hints: 'Choose the desktop or phone variant before display and speech; entries without phone variants use the shared text.',
  controls: 'Phone names follow controls.ts: Bag, Use, Belt, Pick and Codex; Pick selects conveyor endpoints, rather than Pick up.',
  pacing: 'Please test Huxley, translator and rover placement against the final level; these sources do not fix their exact walking routes.',
  fuel: 'Starter fuel follows scenes.ts and the GDD ship table: hydrogen and oxygen; no methane dependency is added.',
  scope: 'This delivery adds no timer, goal completion logic, scene trigger, new recipe, scan input or launch button.',
  review: 'Please check early oxygen guidance, milestone granularity and the three-minute delay with first-time players on desktop and phone.',
  sarvam: 'These English strings await Director review; use approved IDs and phone button names when preparing future translations or voice recordings.',
};
```

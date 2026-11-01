# T-037: Jivagraha creature lines and bird Codex entry

## Delivery note

```ts
export const DELIVERY_NOTE = {
  task: 'T-037: Six SARATHI creature lines and one Small bird Codex entry, ready for Director review.',
  basis: 'Behaviour follows the task; voice follows lines.ts and the existing grazer, burrower and glow-moth field notes.',
  naming: 'The creature labels remain generic; Sarvam is choosing names in T-036.',
  doubt: 'Please check remark timing against the shy reactions and dusk transition; this delivery adds no triggers or recordings.',
};
```

## Creature lines

```ts
export const CREATURE_LINES = {
  first_grazer: 'Give that grazer space to feed and watch it from here. We can be interesting from a distance.',
  first_burrower: 'Stand back from that small opening and watch the burrower look around. Our welcome appears to be provisional.',
  first_bird: 'Look above the forest for a small bird circling in daylight. A useful reminder to look up occasionally.',
  grazer_shy: 'Pause and leave the grazer room to wander; it steps away when we come too close.',
  burrower_shy: 'Step back from the burrower’s opening and wait quietly. It has concluded this meeting.',
  bird_roost: 'Give the bird’s roost some space as dusk falls. Its working day appears to be over.',
};
```

## Bird Codex entry

```ts
export const BIRD_CODEX_ENTRY = {
  id: 'small_bird',
  kind: 'fauna',
  title: 'Small bird',
  text:
    'A small bird circles over Jivagraha’s forest in daylight, tracing a route above the canopy. ' +
    'At dusk it settles to roost, and I leave its resting place undisturbed. ' +
    'More appear when Harmony is high, giving me another reason to watch the sky as well as the machines below. ' +
    'For this observation, a little distance is more useful than a closer inspection.',
  science: 'On Earth, down feathers trap air close to a bird’s body, reducing heat loss.',
};
```

## Director handoff

```ts
export const DIRECTOR_HANDOFF = {
  first_sightings: 'Use each first remark when its creature is first seen, rather than whenever another individual appears.',
  shy_reactions: 'grazer_shy follows the grazer stepping away; burrower_shy follows the burrower ducking back because the player approached.',
  dusk: 'bird_roost belongs to the dusk transition, not a proximity reaction; the task describes birds roosting at night.',
  pacing: 'Please space repeat remarks so ordinary movement near creatures does not produce constant speech.',
  names: 'Keep the required IDs and Small bird title; name and deva are intentionally omitted for T-036.',
  science: 'The Earth comparison explains feather insulation without claiming a measured physiology for Jivagraha’s bird.',
  source: 'Cornell Lab of Ornithology, Bird Academy: Everything You Need To Know About Feathers; sections on feather structure and down.',
  source_url: 'https://academy.allaboutbirds.org/feathers-article/',
  integration: 'Creature triggers, Codex registration and any new voice recordings remain for review and integration.',
};
```

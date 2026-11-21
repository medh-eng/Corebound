# T-042: Mooladri valley text and slice-2 goal polish

## Delivery note

```ts
export const DELIVERY_NOTE = {
  task: 'T-042: Seven valley prompts, four ordered calming steps, and three polished slice-2 goals.',
  basis: 'Checked against scenes.ts, chapter1.ts, story.ts, the Mooladri and valley Codex entries, and M4 slice 3.',
  voice: 'British spelling; each spoken line gives guidance, followed by at most one dry remark.',
  doubt: 'Scan names the action; confirm its final desktop label during integration, while retaining Scan on phones.',
};
```

## Valley prompts

```ts
export const VALLEY_PROMPTS = {
  roots_blocked: 'Living roots close the valley. Give them room.',
  seismic_scan_hold: 'Keep holding Scan to trace the roots.',
  root_marked: 'Living root marked.',
  drill_on_root: 'Move this drill clear of the marked roots.',
  bloom_spores_plant: 'Press E to plant bloom spores here.',
  bloom_spores_wrong: 'The soil is not clean enough for planting yet.',
  valley_open: 'Mooladri is calm. The valley path is open.',
};
```

## Valley steps

```ts
export const VALLEY_STEPS = {
  seismic_scan: {
    text: 'Hold Scan beside the valley to trace the living roots.',
    sarathi: 'Hold Scan beside the valley to trace the roots beneath our drills.',
  },
  move_drills: {
    text: 'Move every drill clear of the marked roots.',
    sarathi: 'Move every drill away from the marked roots so they have room to settle.',
  },
  bio_filters_valley: {
    text: 'Keep working bio-filters near the smog until the haze clears.',
    sarathi: 'Supply bio-filters near the smog with water and power until the haze clears.',
  },
  replant_bloom: {
    text: 'Replant bloom spores around Mooladri’s exposed roots once the soil is clean.',
    sarathi: 'Replant bloom spores around the exposed roots once the soil is clean, then give the new growth time to settle.',
  },
};
```

## Slice-2 goal polish

```ts
export const SLICE2_GOALS = {
  huxley_message: {
    text: 'Return to the escape module; press E at Prof. Huxley’s projector by the hatch.',
    sarathi: 'Return to the module and listen to Prof. Huxley’s recording by the hatch. The factory can manage a short absence.',
  },
  translator: {
    text: 'Press E to collect the translator beside the escape module.',
    sarathi: 'Collect the translator beside the escape module, as Prof. Huxley suggested.',
  },
  memory_logs: {
    text: 'Follow the blue beams to find 3 memory logs; press E to read each one.',
    sarathi: 'Follow the blue beams to find three memory logs scattered by the crash and read each one.',
  },
};
```

## Director handoff

```ts
export const DIRECTOR_HANDOFF = {
  order: 'Keep seismic_scan, move_drills, bio_filters_valley and replant_bloom in that order; scanning and relocation are separate goal-panel steps.',
  milestones: 'The first two steps belong to roots; the remaining steps belong to clear_smog and replant_bloom respectively.',
  blocked: 'Use roots_blocked before scanning begins; it names no later action or puzzle solution.',
  scan: 'Show seismic_scan_hold only during the active scanning step; reveal root_marked only after a root is mapped.',
  drills: 'Show drill_on_root during move_drills, when looking at a drill on mapped roots; leave later actions undisclosed.',
  bloom: 'Show bloom_spores_plant and bloom_spores_wrong only during replant_bloom; the latter explains an unsuitable planting patch without naming another step.',
  opened: 'Use valley_open only after Mooladri has settled and the roots have opened the path.',
  controls: 'Keep press E in desktop instructions; use the existing phone wording conversion so touch players see Use.',
  relocation: 'The drill prompt names the required movement; use the existing pickup and placement controls without adding an interaction key.',
  soil: 'Clean soil remains a prerequisite for replanting; clearing the haze must not bypass the soil check.',
  slice2: 'The polished goals preserve the hatch-side projector, nearby translator, three readable logs, blue beams and E interaction.',
  names: 'All required IDs are unchanged; retain Mooladri’s name and the existing Codex wording.',
  integration: 'This writing delivery adds no gameplay trigger, completion check, timer, controller binding or voice recording.',
  review: 'Please check stage gating, root visibility, planting eligibility and phone wording when building slice 3.',
};
```

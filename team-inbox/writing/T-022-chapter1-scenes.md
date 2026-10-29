# T-022 — Chapter 1 scene lines

**Delivery note:** T-022 · Four TypeScript dialogue objects for M4's opening, Mooladri, Quantum Fragment chamber and first lift-off. All lines are SARATHI dialogue, with game event IDs proposed for the Director to connect. The visuals follow the faceless Guardian references. No story twist is disclosed.

## INTRO_LINES

```ts
export const INTRO_LINES: Record<string, string> = {
  pod_open: "Cryo-pod seals hiss open. Custodian, you are inside the crashed escape module. Welcome back.",
  systems: "SARATHI online. Your memory may take a moment to settle. My filing system has not enjoyed the landing either.",
  oxygen: "Your suit oxygen is low. Please check the gauge before leaving the pod.",
  module: "The module has limited reserves. We need a steady oxygen supply before they run out.",
  shelter: "I can see a shelter dome outside, beside a solar lotus. Both may still be useful.",
  hatch_ready: "The hatch is responding. Take one breath, then follow the daylight.",
  hatch_sunrise: "The hatch is open. Sunrise is rolling over a curved horizon. This is a very small world.",
};
```

## GUARDIAN_LINES

```ts
export const GUARDIAN_LINES: Record<string, string> = {
  first_tremor: "Seismic tremor beneath the forest. The ground shifted, but the trees have not fallen.",
  forest_shadow: "A vast shadow is moving beneath those roots. The whole canopy is rising and settling with it.",
  restless: "Mooladri's roots are tightening around the valley. The forest is dimming as our machines strain its home.",
  awake: "Mooladri has risen. Mossy bark towers above us, its crown of glowing root tips brightening. Living roots have closed the valley.",
  calming_start: "We can help the valley recover. First, we need to learn where Mooladri's roots run.",
  roots_hint: "Use a seismic scan beside the valley. It will trace the living roots beneath our drills.",
  roots_scan_done: "The root map is clear. Move the drills away from every marked root before we continue.",
  roots_done: "The drills are clear. Mooladri's roots have loosened, but the haze remains.",
  air_hint: "Place working bio-filters near the smog and give the air time to clear.",
  air_done: "The haze is thinning. Light is returning to the forest, and Mooladri's crown is steadier.",
  bloom_hint: "The soil is clean now. Replant the bloom spores around Mooladri's exposed roots.",
  bloom_done: "The bloom has taken root. The ground is settling, and new growth is spreading between the old roots.",
  calm: "Mooladri has settled into the forest. The roots have opened a path into the valley.",
  flora_bonus: "With Mooladri calm, Jivagraha's flora now absorbs pollution twice as quickly. An excellent arrangement for everyone.",
};
```

## CHAMBER_LINES

```ts
export const CHAMBER_LINES: Record<string, string> = {
  chamber_glimpse: "There is a chamber below this seam. Its light does not match the minerals around it.",
  fragment_reading: "I am detecting a signal consistent with a Quantum Fragment. We need a closer reading before I can confirm it.",
  root_threads: "Roots thread along the chamber wall. The forest appears to have grown around whatever lies below.",
  chamber_return: "We cannot reach the chamber safely yet. Let us finish our work above ground and return.",
};
```

## LIFTOFF_LINES

```ts
export const LIFTOFF_LINES: Record<string, string> = {
  ship_ready: "Starter ship ready. Hydrogen and oxygen are flowing to the engines, and the cargo is secure.",
  launch_check: "The launch pad is clear. Our first voyage will be short, provided the navigation system remembers its job.",
  rise: "We are rising above Jivagraha. From here, the shelter is a speck and the forest is a ring of light.",
  next_world: "Our next destination is Taptashila, a mineral-rich world closer to the sun. We will need better shielding there.",
  cliffhanger: "Taptashila is coming into view. I am reading something unusual beneath its oldest rock. We have another question to answer.",
};
```

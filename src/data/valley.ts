// Mooladri and the root valley (M4 slice 3). Text by ChatGPT (T-042, reviewed by the Director
// 2026-11-22; Sarvam checked it gives nothing away early). Numbers are the Director's (tune here).
// The body follows the Commander's trunk concept (art-inbox/concept/guardian_root_trunk.png) with
// Sarvam's four modelling notes: gaps of at least 1.5 m, three aerial roots per bough, about 12 m
// tall with the crown tips at 82-88 % of the height, and glow as a material with no lights.

/** Short prompts at the bottom of the screen. Keyboard words; phones get "Use" and "Scan". */
export const VALLEY_PROMPTS = {
  roots_blocked: 'Living roots close the valley. Give them room.',
  seismic_scan_hold: 'Keep holding Scan to trace the roots.',
  root_marked: 'Living root marked.',
  drill_on_root: 'Move this drill clear of the marked roots.',
  bloom_spores_plant: 'Press E to plant bloom spores here.',
  bloom_spores_wrong: 'The soil is not clean enough for planting yet.',
  valley_open: 'Mooladri is calm. The valley path is open.',
  // Director's additions (short, for the worker polish pass):
  bloom_spores_none: 'Bring a bloom to plant here: collect one with the laser.',
  drill_place_on_root: 'Not on a marked root: give the roots room.',
};

/** The four calming steps, in order (goal panel text and SARATHI's line as the step begins). */
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
    text: "Replant bloom spores around Mooladri's exposed roots once the soil is clean.",
    sarathi: 'Replant bloom spores around the exposed roots once the soil is clean, then give the new growth time to settle.',
  },
};

/** Where Mooladri stands, in metres from where you first stand (forward, right), like START_BASE.
 *  yawDeg turns the body; 0 faces the base. The root gate closes the valley behind it. */
export const MOOLADRI = {
  place: { forward: 8, right: -60 },
  height: 12,
  /** Before it wakes it rests this far down in the ground, like an old stump. */
  restSink: 5.5,
  /** Seconds to rise when it wakes, and to settle when calm. */
  riseSeconds: 7,
  settleSeconds: 9,
  /** Ground kept clear of plants and rocks around it (metres). */
  clearRadius: 17,
  /** Walk this close (metres) and it wakes; SARATHI notices its shadow a little further out. */
  wakeAt: 26,
  shadowAt: 42,
  /** The root gate across the valley path, this far behind the trunk. */
  gate: { back: 13, width: 9, arches: 4 },
  /** Hold Scan within this distance of the trunk for this long to map the roots. */
  scan: { range: 32, seconds: 3 },
  /** A drill this close to a mapped root (metres) is "on" it. */
  rootClear: 2.6,
  /** Roots reach out to at most this many drills (the nearest), plus a few that wander. */
  maxRootsToDrills: 6,
  wanderRoots: 3,
  /** When it wakes, the haze thickens to at least this much air pollution (0..100); the
   *  smog step ends once air pollution is at or below `airClear` with a bio-filter working. */
  airOnWake: 30,
  airClear: 15,
  /** Soil pollution at or below this counts as clean enough to plant. */
  soilClean: 20,
  /** Planting spots around the foot (metres from the trunk) and how close to stand. */
  plantSpots: 3,
  plantRadius: 7.5,
  plantReach: 2.2,
  /** While planting, blooms open near the roots every so often even if Harmony is only stable. */
  bloomEverySec: 25,
  /** Logs 08 and 09 lie by its roots (metres along the ground from the trunk, toward the base = forward). */
  logs: [
    { id: 'log_08', forward: -3, right: 11, buried: true },
    { id: 'log_09', forward: 6.5, right: -4, buried: false },
  ],
};

/** SARATHI's line once each step is done (GUARDIAN_LINES in scenes.ts). If the line already says
 *  what to do next, the next step's own line is not repeated. */
export const STEP_DONE_LINE: Record<string, { line: string; nextLine: boolean }> = {
  seismic_scan: { line: 'roots_scan_done', nextLine: false },
  move_drills: { line: 'roots_done', nextLine: true },
  bio_filters_valley: { line: 'air_done', nextLine: true },
  replant_bloom: { line: 'bloom_done', nextLine: false },
  valley_calm: { line: 'calm', nextLine: true },
};

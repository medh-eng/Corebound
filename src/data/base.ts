// Where the starting base sits, relative to where you first stand.
// forward = the way you face at the start; right = to your right (metres along the ground).
export const START_BASE = {
  shelterDome: { forward: 12, right: 7.5, yawDeg: 0 },   // door turned to face you
  solarLotus: { forward: 15.5, right: 0.5, yawDeg: 25 },
  chimney: { angleDeg: 140, up: 3.0, out: 1.55 },          // on the dome, seen from its door
  path: { stones: 9, spacing: 1.5 },
};

/** The crash site behind you at the start (M4): the escape module lies tilted in a scorched
 *  hollow, and the cryo-pod has slid half out of its hatch. yawDeg turns the model; 0 points its
 *  front (+Z) at where you stand. tiltDeg leans it over, as if it rolled on landing. */
export const CRASH_SITE = {
  escapeModule: { forward: -5.6, right: -1.6, yawDeg: 0, tiltDeg: 9, scale: 1.35, sink: 0.35, radius: 2.4 },
  cryoPod: { forward: -1.7, right: -2.3, yawDeg: 90, tiltDeg: 4, scale: 1, sink: 0.12, radius: 1.1 },
  /** The module still holds a little air: standing beside it refills the suit until it runs out. */
  airRadius: 3.2,
};

/** The wake-up (M4 slice 1): seconds after a new game starts. SARATHI's lines are in scenes.ts
 *  (INTRO_LINES); "control" is when you can walk, "camera" when the view swings to the sunrise. */
export const OPENING = {
  beats: [
    { t: 1.2, line: 'pod_open' },
    { t: 6.5, line: 'systems' },
    { t: 12, line: 'hatch_ready' },
    { t: 17, line: 'hatch_sunrise' },
    { t: 23, line: 'oxygen' },
    { t: 29, line: 'module' },
    { t: 35, line: 'shelter' },
  ],
  fadeSeconds: 2.5,
  camera: 12.5,
  control: 13.5,
  lineSeconds: 5.4,
  /** Reaching this close to the shelter completes the first goal. */
  shelterReach: 6,
};

/** Story props (M4 slice 2), in metres from where you first stand (forward, right). Huxley's projector
 *  and the translator wait by the escape module's hatch; the Custodian's memory logs lie scattered
 *  by the crash, some half-buried. Each shows a soft beam of light until it is used. Logs 08 and 09
 *  lie by Mooladri's roots and are placed with the Guardian in slice 3. `buried` sinks the log so
 *  only its top shows, for the logs the text calls underground. If a spot is under water, the game
 *  moves it to the nearest dry ground. */
export const STORY_PROPS = {
  projector: { forward: -3.3, right: 0.4, yawDeg: 200, scale: 1.6 },
  translator: { forward: -6.8, right: 3.2, yawDeg: 140, scale: 1.6 },
  logScale: 1.8,
  logs: [
    { id: 'log_01', forward: -9.5, right: -4.5, buried: false },
    { id: 'log_02', forward: 6, right: -5.5, buried: false },
    { id: 'log_03', forward: 16, right: 12.5, buried: false },
    { id: 'log_04', forward: -22, right: 14, buried: true },
    { id: 'log_05', forward: 34, right: -26, buried: true },
    { id: 'log_06', forward: -40, right: -30, buried: true },
    { id: 'log_07', forward: 48, right: 30, buried: true },
  ],
  /** How close you must stand to use one (metres). */
  reach: 2.4,
  /** How many logs complete the "Gather the missing memories" goal. */
  logsForGoal: 3,
};

export const SCATTER = {
  banyan: { count: 26, minSpacing: 24, minDegFromBase: 15 },
  mushroomTree: { count: 85, minSpacing: 9, minDegFromBase: 6.5 },
  smallMushroom: { count: 420 },
  bigRock: { count: 120 },
  smallRock: { count: 170 },
  crystal: { count: 120 },
  fern: { count: 2400 },
  grass: { count: 16000 },
  lotus: { count: 260 },
};

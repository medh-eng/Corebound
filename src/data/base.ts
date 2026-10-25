// Where the starting base sits, relative to where you first stand.
// forward = the way you face at the start; right = to your right (metres along the ground).
export const START_BASE = {
  shelterDome: { forward: 12, right: 7.5, yawDeg: 0 },   // door turned to face you
  solarLotus: { forward: 15.5, right: 0.5, yawDeg: 25 },
  chimney: { angleDeg: 140, up: 3.0, out: 1.55 },          // on the dome, seen from its door
  path: { stones: 9, spacing: 1.5 },
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

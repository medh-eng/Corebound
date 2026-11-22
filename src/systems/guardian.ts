// Mooladri, the Root Guardian (M4 slice 3): its roots and the checks for the calming steps.
// No Three.js here, so it is unit-tested. Calmed, never fought: nothing here hurts anyone.
import { type V3, add, cross, dot, len, norm, rotateAround, scale, sub } from '../core/vec';

/** A root under the ground: a wandering line from Mooladri's foot out to an end point. */
export interface Root { from: V3; to: V3; seed: number }

/** What the save keeps about Mooladri. Roots are kept as end points; their wiggle comes from `seed`. */
export interface GuardianSave {
  roots: Root[];
  planted: number[];   // which planting spots have bloom spores
}

/** The great-circle distance (metres along the ground, on a sphere of radius R) between two points. */
export function groundDistance(a: V3, b: V3, R: number): number {
  const c = Math.min(1, Math.max(-1, dot(norm(a), norm(b))));
  return Math.acos(c) * R;
}

/** Points along a root, on the unit sphere (multiply by the ground radius to draw it). The root
 *  bends gently from side to side (never more than about 1.6 m), and runs `overshoot` metres
 *  past its end so a drill standing on the end point is truly on the root. */
export function rootPoints(r: Root, R: number, stepM = 1.5, overshoot = 2.5): V3[] {
  const a = norm(r.from), b = norm(r.to);
  const axis0 = cross(a, b);
  const span = groundDistance(a, b, R);
  if (len(axis0) < 1e-6 || span < 0.5) return [a, b];
  const axis = norm(axis0);
  const total = span + overshoot;
  const n = Math.max(2, Math.ceil(total / stepM));
  const pts: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const d = rotateAround(a, axis, (t * total) / R);
    // Sideways wiggle, zero at the foot so every root starts at the trunk.
    const side = norm(cross(d, axis));
    const w = Math.sin(t * Math.PI * (1.3 + (r.seed % 7) * 0.17) + r.seed) * 1.6 * Math.min(1, t * 4) * (1 - 0.6 * t);
    pts.push(norm(add(d, scale(side, -w / R))));
  }
  return pts;
}

/** Distance (metres) from point p to a polyline of unit-sphere points scaled by R (measured in 3D,
 *  which on a 150 m planet differs from distance along the ground by well under 1 %). */
export function distToLine(p: V3, pts: V3[], R: number): number {
  const q = scale(norm(p), R);
  let best = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = scale(pts[i], R), b = scale(pts[i + 1], R);
    const ab = sub(b, a), aq = sub(q, a);
    const t = Math.max(0, Math.min(1, dot(aq, ab) / Math.max(1e-9, dot(ab, ab))));
    best = Math.min(best, len(sub(aq, scale(ab, t))));
  }
  return best;
}

/** Roots reach out from Mooladri towards the drills that strain it (the nearest `maxToDrills`),
 *  plus a few that wander off into the forest, away from the base. Deterministic for a given seed. */
export function growRoots(center: V3, drills: V3[], R: number, opts: { maxToDrills: number; wander: number; seed: number; away?: V3 }): Root[] {
  const c = norm(center);
  const roots: Root[] = [];
  const near = drills.map((p) => ({ p, d: groundDistance(c, p, R) })).sort((x, y) => x.d - y.d).slice(0, opts.maxToDrills);
  near.forEach(({ p }, i) => roots.push({ from: c, to: norm(p), seed: opts.seed + i * 13 }));
  // Wandering roots: spread round the trunk, 18-30 m long, favouring the side away from the base.
  const t1 = norm(opts.away ? sub(opts.away, scale(c, dot(opts.away, c))) : cross(c, { x: 0, y: 1, z: 0 }));
  for (let k = 0; k < opts.wander; k++) {
    const ang = (k - (opts.wander - 1) / 2) * 1.1 + Math.sin(opts.seed + k) * 0.3;
    const dir = rotateAround(t1, c, ang);
    const length = 18 + ((opts.seed * 7 + k * 5) % 12);
    roots.push({ from: c, to: norm(add(c, scale(dir, length / R))), seed: opts.seed + 101 + k * 17 });
  }
  return roots;
}

/** True if a drill at `p` stands on (within `clear` metres of) any root. */
export function onRoot(p: V3, roots: Root[], R: number, clear: number): boolean {
  return roots.some((r) => distToLine(p, rootPoints(r, R), R) < clear);
}

/** The calming steps' checks, given what the world looks like now. */
export interface CalmView {
  rootsMapped: boolean;
  drillsOnRoots: number;
  air: number;
  soil: number;
  filterWorking: boolean;
  planted: number;
}
export interface CalmRules { airClear: number; soilClean: number; plantSpots: number }

export function stepDone(step: string, v: CalmView, rules: CalmRules): boolean {
  switch (step) {
    case 'seismic_scan': return v.rootsMapped;
    case 'move_drills': return v.rootsMapped && v.drillsOnRoots === 0;
    case 'bio_filters_valley': return v.filterWorking && v.air <= rules.airClear;
    case 'replant_bloom': return v.planted >= rules.plantSpots;
    default: return false;
  }
}

/** May bloom spores go into the ground now? */
export const soilReady = (soil: number, rules: CalmRules) => soil <= rules.soilClean;

/** How bright Mooladri's crown and seams glow (0..1): low and flickering while restless, rising as
 *  each calming step is done, steady once calm. `steps` counts the steps done (0..4). */
export function crownGlow(state: 'resting' | 'restless' | 'calm', steps: number, t: number): number {
  if (state === 'resting') return 0.18;
  if (state === 'calm') return 1;
  const base = 0.28 + 0.14 * Math.min(4, steps);
  return base * (0.8 + 0.2 * Math.sin(t * 5.3) * Math.sin(t * 1.7));
}

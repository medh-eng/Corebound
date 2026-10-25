// Day and night: the sun circles the planet (equivalent to the planet spinning).
import { dot, norm, type V3 } from './vec';

const TILT = 0.32; // keeps the poles in a long golden hour

/** Unit direction from the planet centre toward the sun at time t (in days). */
export function sunDir(t: number): V3 {
  const a = t * Math.PI * 2;
  return norm({ x: Math.cos(a), y: TILT, z: Math.sin(a) });
}

/** Sun elevation (sine of angle above the horizon) seen from a point with local up `up`. */
export function sunElevation(t: number, up: V3): number {
  return dot(sunDir(t), up);
}

/**
 * Finds the time (days, 0..1) when the sun stands at `elevationDeg` above the horizon
 * and is rising, for a place with local up `up`.
 */
export function timeForSunrise(up: V3, elevationDeg: number): number {
  const target = Math.sin((elevationDeg * Math.PI) / 180);
  let best = 0, bestErr = Infinity;
  const N = 3600;
  for (let i = 0; i < N; i++) {
    const t = i / N;
    const e = sunElevation(t, up);
    const rising = sunElevation(t + 1 / N, up) > e;
    const err = Math.abs(e - target);
    if (rising && err < bestErr) { bestErr = err; best = t; }
  }
  return best;
}

/** 0 = full night, 1 = full day, for a sun elevation (sine). */
export function daylight(elev: number): number {
  const t = Math.min(1, Math.max(0, (elev + 0.08) / 0.38));
  return t * t * (3 - 2 * t);
}

/** Clock text for a local sun elevation, mapping the rotation to a 24-hour dial. */
export function localClock(t: number, up: V3): string {
  // Solar time: find the angle of the sun around the planet relative to this place.
  const s = sunDir(t);
  const a1 = Math.atan2(s.z, s.x);
  const a2 = Math.atan2(up.z, up.x);
  let d = (a1 - a2) / (Math.PI * 2); // 0 = noon overhead
  d = ((d % 1) + 1) % 1;
  const hours = (12 + d * 24) % 24;
  const h = Math.floor(hours), m = Math.floor((hours - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

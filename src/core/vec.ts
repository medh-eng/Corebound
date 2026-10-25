// Small allocation-light 3D vector helpers for simulation code (no Three.js here).
export interface V3 { x: number; y: number; z: number }

export const v3 = (x = 0, y = 0, z = 0): V3 => ({ x, y, z });
export const copy = (a: V3): V3 => ({ x: a.x, y: a.y, z: a.z });
export const add = (a: V3, b: V3): V3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });
export const sub = (a: V3, b: V3): V3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });
export const scale = (a: V3, s: number): V3 => ({ x: a.x * s, y: a.y * s, z: a.z * s });
export const dot = (a: V3, b: V3) => a.x * b.x + a.y * b.y + a.z * b.z;
export const cross = (a: V3, b: V3): V3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
export const len = (a: V3) => Math.hypot(a.x, a.y, a.z);
export const norm = (a: V3): V3 => {
  const l = len(a) || 1;
  return { x: a.x / l, y: a.y / l, z: a.z / l };
};
export const lerp = (a: V3, b: V3, t: number): V3 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  z: a.z + (b.z - a.z) * t,
});
/** Removes the component of `a` along unit vector `n` (projects onto the tangent plane). */
export const reject = (a: V3, n: V3): V3 => sub(a, scale(n, dot(a, n)));
/** Rotates `a` around unit axis `k` by angle (Rodrigues). */
export const rotateAround = (a: V3, k: V3, ang: number): V3 => {
  const c = Math.cos(ang), s = Math.sin(ang);
  const kxa = cross(k, a);
  const kda = dot(k, a) * (1 - c);
  return { x: a.x * c + kxa.x * s + k.x * kda, y: a.y * c + kxa.y * s + k.y * kda, z: a.z * c + kxa.z * s + k.z * kda };
};
/** Any unit vector perpendicular to unit vector n. */
export const anyTangent = (n: V3): V3 =>
  norm(Math.abs(n.y) < 0.95 ? cross(n, v3(0, 1, 0)) : cross(n, v3(1, 0, 0)));

export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
export const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

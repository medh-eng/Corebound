import { describe, it, expect } from 'vitest';
import { Terrain } from '../src/core/terrain';
import { VoxelWorld } from '../src/core/voxels';
import { JIVAGRAHA } from '../src/data/worlds';

describe('diggable ground', () => {
  const terrain = new Terrain(JIVAGRAHA);
  const s = terrain.spawnDir;
  const R = terrain.groundRadius(s);
  const surf = { x: s.x * R, y: s.y * R, z: s.z * R };

  it('removes ground and reports what was dug', () => {
    const w = new VoxelWorld(terrain, 1);
    expect(w.solid({ x: s.x * (R - 1), y: s.y * (R - 1), z: s.z * (R - 1) })).toBe(true);
    const res = w.dig(surf, 1.5);
    expect(res.chunks.length).toBeGreaterThan(0);
    let vol = 0; for (const v of res.removed.values()) vol += v;
    expect(vol).toBeGreaterThan(2); // about half a sphere of ground
    expect(w.solid({ x: s.x * (R - 1), y: s.y * (R - 1), z: s.z * (R - 1) })).toBe(false);
  });

  it('builds a closed, outward-facing mesh around the hole', () => {
    const w = new VoxelWorld(terrain, 1);
    const res = w.dig(surf, 2);
    let tris = 0, agree = 0;
    for (const k of new Set(res.chunks)) {
      const m = w.mesh(w.chunks.get(k)!);
      const P = m.positions, N = m.normals, I = m.indices;
      for (let t = 0; t < I.length; t += 3) {
        const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3;
        const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
        const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
        const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
        tris++;
        if (nx * N[a] + ny * N[a + 1] + nz * N[a + 2] > 0) agree++;
      }
    }
    expect(tris).toBeGreaterThan(500);
    expect(agree / tris).toBeGreaterThan(0.97);
  });

  it('lets you stand at the bottom of a pit', () => {
    const w = new VoxelWorld(terrain, 1);
    w.dig(surf, 2);
    const floor = w.floorRadius(s, R);
    expect(floor).toBeLessThan(R - 1.2);
    expect(floor).toBeGreaterThan(R - 2.3);
  });

  it('finds different materials underground', () => {
    const w = new VoxelWorld(terrain, 1);
    const seen = new Set<number>();
    for (let i = 0; i < 3000; i++) {
      const d = { x: Math.sin(i * 1.3), y: Math.cos(i * 0.7), z: Math.sin(i * 0.31 + 1) };
      const l = Math.hypot(d.x, d.y, d.z);
      const r = terrain.groundRadius(d) - (i % 20);
      seen.add(w.material({ x: (d.x / l) * r, y: (d.y / l) * r, z: (d.z / l) * r }));
    }
    for (const m of [1, 2, 3, 4, 5]) expect(seen.has(m)).toBe(true);
  });
});

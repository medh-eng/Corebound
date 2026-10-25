// Diggable ground. The planet's shape stays analytic everywhere; where you dig, the area is
// turned into voxel chunks (a density grid) that are meshed with "surface nets".
// Density convention: positive = solid ground, negative = air.
import type { Terrain } from './terrain';
import { Geology, Mat } from './geology';
import type { V3 } from './vec';

export const CELL = 0.75;              // metres per voxel
export const CHUNK = 24;               // cells per chunk side
export const CHUNK_M = CELL * CHUNK;   // 18 m
const S = CHUNK + 3;                   // samples per side (one-cell border each side, + corner)

export interface Dig { x: number; y: number; z: number; r: number }

export interface ChunkMesh {
  key: string;
  min: [number, number, number];
  max: [number, number, number];
  positions: Float32Array;
  normals: Float32Array;
  materials: Uint8Array;   // per vertex
  depths: Float32Array;    // per vertex: metres below the original surface
  indices: Uint32Array;
  keepWater: boolean;
}

export interface Chunk {
  key: string;
  cx: number; cy: number; cz: number;
  ox: number; oy: number; oz: number;  // world position of sample index 1 (cell corner 0)
  density: Float32Array;               // S³, includes digs
  depth: Float32Array;                 // S³, depth below the original surface (for materials)
  keepWater: boolean;
  dirty: boolean;
}

const idx = (i: number, j: number, k: number) => i + S * (j + S * k);

export class VoxelWorld {
  readonly chunks = new Map<string, Chunk>();
  readonly digs: Dig[] = [];
  readonly geology: Geology;
  private digIndex = new Map<string, Dig[]>();

  constructor(private terrain: Terrain, seed: number) {
    this.geology = new Geology(seed);
  }

  static key(cx: number, cy: number, cz: number) { return `${cx},${cy},${cz}`; }

  /** Original (undug) density at a point. */
  baseDensity(x: number, y: number, z: number): number {
    const r = Math.hypot(x, y, z) || 1e-6;
    return this.terrain.groundRadius({ x, y, z }) - r;
  }

  /** Current density including digs. */
  density(x: number, y: number, z: number): number {
    let d = this.baseDensity(x, y, z);
    const list = this.digIndex.get(VoxelWorld.key(Math.floor(x / CHUNK_M), Math.floor(y / CHUNK_M), Math.floor(z / CHUNK_M)));
    if (list) for (const g of list) d = Math.min(d, Math.hypot(x - g.x, y - g.y, z - g.z) - g.r);
    return d;
  }

  solid(p: V3): boolean { return this.density(p.x, p.y, p.z) > 0; }

  /** True if any digging has happened near this point (so the analytic ground is no longer exact). */
  edited(p: V3): boolean {
    return this.digIndex.has(VoxelWorld.key(Math.floor(p.x / CHUNK_M), Math.floor(p.y / CHUNK_M), Math.floor(p.z / CHUNK_M)));
  }

  /** Material at a point (for mining yields and colours). */
  material(p: V3): Mat {
    const r = Math.hypot(p.x, p.y, p.z);
    const depth = this.terrain.groundRadius(p) - r;
    return this.geology.at(p, depth);
  }

  /**
   * Floor under a point: distance from the centre to the first solid ground found going down,
   * starting a little above `fromR` (so you can step up small ledges). Falls back to analytic ground.
   */
  floorRadius(dir: V3, fromR: number): number {
    const l = Math.hypot(dir.x, dir.y, dir.z);
    const ux = dir.x / l, uy = dir.y / l, uz = dir.z / l;
    if (!this.edited({ x: ux * fromR, y: uy * fromR, z: uz * fromR })) return this.terrain.groundRadius({ x: ux, y: uy, z: uz });
    // Step up small ledges, but never climb a wall: if blocked above, only look downward.
    let top = fromR + 0.55;
    if (this.density(ux * top, uy * top, uz * top) > 0) {
      top = fromR + 0.1;
      if (this.density(ux * top, uy * top, uz * top) > 0) return fromR;
    }
    for (let r = top; r > fromR - 6; r -= 0.08) {
      if (this.density(ux * r, uy * r, uz * r) > 0) {
        // Refine between r and r + step.
        let a = r, b = r + 0.08;
        for (let i = 0; i < 5; i++) { const m = (a + b) / 2; if (this.density(ux * m, uy * m, uz * m) > 0) a = m; else b = m; }
        return a;
      }
    }
    return fromR - 6;
  }

  /** Removes a sphere of ground. Returns the keys of chunks that need re-meshing and the volume of each material removed (m³). */
  dig(c: V3, radius: number): { chunks: string[]; removed: Map<Mat, number> } {
    const removed = new Map<Mat, number>();
    // Estimate what was removed by sampling the sphere before carving.
    const step = CELL * 0.75;
    const cellVol = step * step * step;
    for (let x = -radius; x <= radius; x += step)
      for (let y = -radius; y <= radius; y += step)
        for (let z = -radius; z <= radius; z += step) {
          if (x * x + y * y + z * z > radius * radius) continue;
          const p = { x: c.x + x, y: c.y + y, z: c.z + z };
          if (this.density(p.x, p.y, p.z) <= 0) continue;
          const m = this.material(p);
          removed.set(m, (removed.get(m) ?? 0) + cellVol);
        }
    const g: Dig = { x: c.x, y: c.y, z: c.z, r: radius };
    this.digs.push(g);
    const keys: string[] = [];
    const pad = radius + CELL * 2;
    const lo = (v: number) => Math.floor((v - pad) / CHUNK_M), hi = (v: number) => Math.floor((v + pad) / CHUNK_M);
    for (let cx = lo(c.x); cx <= hi(c.x); cx++)
      for (let cy = lo(c.y); cy <= hi(c.y); cy++)
        for (let cz = lo(c.z); cz <= hi(c.z); cz++) {
          const k = VoxelWorld.key(cx, cy, cz);
          if (!this.digIndex.has(k)) this.digIndex.set(k, []);
          this.digIndex.get(k)!.push(g);
          let ch = this.chunks.get(k);
          if (!ch) { ch = this.makeChunk(cx, cy, cz); this.chunks.set(k, ch); }
          this.carve(ch, g);
          keys.push(k);
        }
    return { chunks: keys, removed };
  }

  /** Re-applies saved digs (for loading a game). */
  replay(digs: Dig[]) { for (const d of digs) this.dig(d, d.r); }

  private makeChunk(cx: number, cy: number, cz: number): Chunk {
    const ox = cx * CHUNK_M, oy = cy * CHUNK_M, oz = cz * CHUNK_M;
    const density = new Float32Array(S * S * S);
    const depth = new Float32Array(S * S * S);
    let minBase = Infinity;
    for (let k = 0; k < S; k++)
      for (let j = 0; j < S; j++)
        for (let i = 0; i < S; i++) {
          const x = ox + (i - 1) * CELL, y = oy + (j - 1) * CELL, z = oz + (k - 1) * CELL;
          const d = this.baseDensity(x, y, z);
          density[idx(i, j, k)] = d;
          depth[idx(i, j, k)] = d;
          if (d > -1 && d < 1) {
            const h = this.terrain.groundRadius({ x, y, z }) - this.terrain.radius;
            minBase = Math.min(minBase, h);
          }
        }
    return { key: VoxelWorld.key(cx, cy, cz), cx, cy, cz, ox, oy, oz, density, depth, keepWater: minBase < this.terrain.seaLevel, dirty: true };
  }

  private carve(ch: Chunk, g: Dig) {
    const i0 = Math.max(0, Math.floor((g.x - g.r - ch.ox) / CELL) + 1 - 1), i1 = Math.min(S - 1, Math.ceil((g.x + g.r - ch.ox) / CELL) + 1 + 1);
    const j0 = Math.max(0, Math.floor((g.y - g.r - ch.oy) / CELL) + 1 - 1), j1 = Math.min(S - 1, Math.ceil((g.y + g.r - ch.oy) / CELL) + 1 + 1);
    const k0 = Math.max(0, Math.floor((g.z - g.r - ch.oz) / CELL) + 1 - 1), k1 = Math.min(S - 1, Math.ceil((g.z + g.r - ch.oz) / CELL) + 1 + 1);
    for (let k = k0; k <= k1; k++)
      for (let j = j0; j <= j1; j++)
        for (let i = i0; i <= i1; i++) {
          const x = ch.ox + (i - 1) * CELL, y = ch.oy + (j - 1) * CELL, z = ch.oz + (k - 1) * CELL;
          const d = Math.hypot(x - g.x, y - g.y, z - g.z) - g.r;
          const n = idx(i, j, k);
          if (d < ch.density[n]) ch.density[n] = d;
        }
    ch.dirty = true;
  }

  /** Builds the mesh for a chunk with naive surface nets. */
  mesh(ch: Chunk): ChunkMesh {
    const D = ch.density;
    const N = CHUNK + 2; // cells per side, from sample index 0..N
    const vIndex = new Int32Array(N * N * N).fill(-1);
    const pos: number[] = [], nor: number[] = [], mats: number[] = [], depths: number[] = [];
    const corner = new Float32Array(8);
    const ci = (i: number, j: number, k: number) => i + N * (j + N * k);
    const EDGES = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
    const OFF = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];

    for (let k = 0; k < N; k++)
      for (let j = 0; j < N; j++)
        for (let i = 0; i < N; i++) {
          let mask = 0;
          for (let c = 0; c < 8; c++) {
            const v = D[idx(i + OFF[c][0], j + OFF[c][1], k + OFF[c][2])];
            corner[c] = v;
            if (v > 0) mask |= 1 << c;
          }
          if (mask === 0 || mask === 255) continue;
          let sx = 0, sy = 0, sz = 0, n = 0;
          for (const [a, b] of EDGES) {
            const va = corner[a], vb = corner[b];
            if ((va > 0) === (vb > 0)) continue;
            const t = va / (va - vb);
            sx += OFF[a][0] + (OFF[b][0] - OFF[a][0]) * t;
            sy += OFF[a][1] + (OFF[b][1] - OFF[a][1]) * t;
            sz += OFF[a][2] + (OFF[b][2] - OFF[a][2]) * t;
            n++;
          }
          const lx = i + sx / n, ly = j + sy / n, lz = k + sz / n; // in sample-index space
          const wx = ch.ox + (lx - 1) * CELL, wy = ch.oy + (ly - 1) * CELL, wz = ch.oz + (lz - 1) * CELL;
          // Gradient from the cell corners (positive inside → outward normal is -gradient).
          const gx = (corner[1] - corner[0]) + (corner[3] - corner[2]) + (corner[5] - corner[4]) + (corner[7] - corner[6]);
          const gy = (corner[2] - corner[0]) + (corner[3] - corner[1]) + (corner[6] - corner[4]) + (corner[7] - corner[5]);
          const gz = (corner[4] - corner[0]) + (corner[5] - corner[1]) + (corner[6] - corner[2]) + (corner[7] - corner[3]);
          const gl = Math.hypot(gx, gy, gz) || 1;
          vIndex[ci(i, j, k)] = pos.length / 3;
          pos.push(wx, wy, wz);
          nor.push(-gx / gl, -gy / gl, -gz / gl);
          const depth = this.terrain.groundRadius({ x: wx, y: wy, z: wz }) - Math.hypot(wx, wy, wz);
          mats.push(this.geology.at({ x: wx, y: wy, z: wz }, Math.max(depth, 0.01) + 0.2));
          depths.push(depth);
        }

    // Quads: one per sign-changing edge whose start point lies inside this chunk (indices 1..CHUNK).
    const ind: number[] = [];
    const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
      if (a < 0 || b < 0 || c < 0 || d < 0) return;
      if (flip) ind.push(a, c, b, b, c, d); else ind.push(a, b, c, b, d, c);
    };
    for (let k = 1; k <= CHUNK; k++)
      for (let j = 1; j <= CHUNK; j++)
        for (let i = 1; i <= CHUNK; i++) {
          const s0 = D[idx(i, j, k)] > 0;
          // x edge
          if ((D[idx(i + 1, j, k)] > 0) !== s0)
            quad(vIndex[ci(i, j - 1, k - 1)], vIndex[ci(i, j, k - 1)], vIndex[ci(i, j - 1, k)], vIndex[ci(i, j, k)], !s0);
          // y edge
          if ((D[idx(i, j + 1, k)] > 0) !== s0)
            quad(vIndex[ci(i - 1, j, k - 1)], vIndex[ci(i - 1, j, k)], vIndex[ci(i, j, k - 1)], vIndex[ci(i, j, k)], !s0);
          // z edge
          if ((D[idx(i, j, k + 1)] > 0) !== s0)
            quad(vIndex[ci(i - 1, j - 1, k)], vIndex[ci(i, j - 1, k)], vIndex[ci(i - 1, j, k)], vIndex[ci(i, j, k)], !s0);
        }
    ch.dirty = false;
    return {
      key: ch.key,
      min: [ch.ox, ch.oy, ch.oz], max: [ch.ox + CHUNK_M, ch.oy + CHUNK_M, ch.oz + CHUNK_M],
      positions: new Float32Array(pos), normals: new Float32Array(nor), materials: new Uint8Array(mats), depths: new Float32Array(depths), indices: new Uint32Array(ind),
      keepWater: ch.keepWater,
    };
  }
}

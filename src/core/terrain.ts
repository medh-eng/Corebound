// Planet surface shape: a sphere pushed in and out by layered noise.
// Pure maths so it can be unit-tested and later moved into a worker.
import { createNoise3D } from 'simplex-noise';
import { rng } from './random';
import { smoothstep, mix, norm, dot, type V3 } from './vec';
import type { WorldDef } from '../data/worlds';

export interface SurfaceSample {
  h: number;        // height above the base radius (m)
  rock: number;     // 0..1 bare sandstone
  river: number;    // 0..1 river channel
  forest: number;   // 0..1 forest density
  snow: number;     // 0..1 polar snow
  flat: number;     // 0..1 inside the starting clearing
}

export class Terrain {
  readonly radius: number;
  readonly seaLevel: number;
  private n1: (x: number, y: number, z: number) => number;
  private n2: (x: number, y: number, z: number) => number;
  private n3: (x: number, y: number, z: number) => number;
  private n4: (x: number, y: number, z: number) => number;
  private spawn: V3;
  private flatCos0: number;
  private flatCos1: number;

  constructor(private world: WorldDef) {
    const r = rng(world.seed);
    this.n1 = createNoise3D(r);
    this.n2 = createNoise3D(r);
    this.n3 = createNoise3D(r);
    this.n4 = createNoise3D(r);
    this.radius = world.radius;
    this.seaLevel = world.seaLevel;
    const [x, y, z] = world.spawn.dir;
    this.spawn = norm({ x, y, z });
    const fr = (world.spawn.flatRadiusDeg * Math.PI) / 180;
    this.flatCos0 = Math.cos(fr);
    this.flatCos1 = Math.cos(fr * 2.4);
  }

  get spawnDir(): V3 { return this.spawn; }

  private fbm(x: number, y: number, z: number, oct: number): number {
    let a = 0.5, f = 1, s = 0, t = 0;
    for (let i = 0; i < oct; i++) {
      s += a * this.n1(x * f, y * f, z * f);
      t += a; a *= 0.5; f *= 2.03;
    }
    return s / t;
  }

  /** Full sample for colouring and placement. (x, y, z) must be a unit direction. */
  sample(x: number, y: number, z: number): SurfaceSample {
    const T = this.world.terrain;
    // Rolling hills.
    let h = this.fbm(x * T.hillFreq, y * T.hillFreq, z * T.hillFreq, 4) * T.hillAmp;
    // Sandstone ridges and outcrops in some regions only.
    const mask = smoothstep(0.1, 0.55, this.n2(x * T.ridgeMaskFreq + 11, y * T.ridgeMaskFreq, z * T.ridgeMaskFreq));
    const rr = 1 - Math.abs(this.n3(x * T.ridgeFreq, y * T.ridgeFreq, z * T.ridgeFreq));
    const ridge = mask * rr * rr * rr;
    h += ridge * T.ridgeAmp;
    // Starting clearing: flat ground for the base.
    const c = x * this.spawn.x + y * this.spawn.y + z * this.spawn.z;
    const flat = smoothstep(this.flatCos1, this.flatCos0, c);
    // Winding rivers carved below sea level.
    const rv = Math.abs(this.n4(x * T.riverFreq + 3, y * T.riverFreq - 7, z * T.riverFreq + 5));
    const river = (1 - smoothstep(T.riverWidth * 0.35, T.riverWidth, rv)) * (1 - flat) * (1 - mask * 0.8);
    h = mix(h, this.seaLevel - T.riverDepth, river);
    h = mix(h, this.world.spawn.height, flat);
    const forest = smoothstep(-0.15, 0.45, this.n2(x * T.forestFreq - 9, y * T.forestFreq + 4, z * T.forestFreq));
    const snow = smoothstep(T.polarCap, T.polarCap + 0.04, Math.abs(y) + 0.03 * this.n3(x * 9, y * 9, z * 9));
    const rock = Math.min(1, smoothstep(0.18, 0.4, ridge) * (1 - flat));
    return { h, rock, river, forest, snow, flat };
  }

  /** Height above the base radius for a unit direction. */
  height(x: number, y: number, z: number): number {
    return this.sample(x, y, z).h;
  }

  /** Distance from the planet centre to the ground along direction d (any length). */
  groundRadius(d: V3): number {
    const n = norm(d);
    return this.radius + this.height(n.x, n.y, n.z);
  }

  /** Angle (radians) between a direction and the spawn clearing. */
  angleFromSpawn(d: V3): number {
    return Math.acos(Math.min(1, Math.max(-1, dot(norm(d), this.spawn))));
  }
}

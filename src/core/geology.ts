// What the planet is made of below the surface: soil, sandstone, iron veins, ice pockets, carbon seams.
import { createNoise3D } from 'simplex-noise';
import { rng } from './random';
import type { V3 } from './vec';

export enum Mat { Air = 0, Soil = 1, Rock = 2, Iron = 3, Ice = 4, Carbon = 5, DeepRock = 6 }

export class Geology {
  private nIron: (x: number, y: number, z: number) => number;
  private nIce: (x: number, y: number, z: number) => number;
  private nCarbon: (x: number, y: number, z: number) => number;
  constructor(seed: number) {
    const r = rng(seed + 404);
    this.nIron = createNoise3D(r);
    this.nIce = createNoise3D(r);
    this.nCarbon = createNoise3D(r);
  }

  /** Material at a point `depth` metres below the original surface. */
  at(p: V3, depth: number): Mat {
    if (depth < 0) return Mat.Air;
    if (depth < 0.7) return Mat.Soil;
    if (depth > 1.4 && this.nIce(p.x * 0.11, p.y * 0.11, p.z * 0.11) > 0.52) return Mat.Ice;
    if (Math.abs(this.nIron(p.x * 0.09, p.y * 0.16, p.z * 0.09)) < 0.075) return Mat.Iron;
    if (depth > 2.5 && Math.abs(this.nCarbon(p.x * 0.12, p.y * 0.12, p.z * 0.12)) < 0.05) return Mat.Carbon;
    return depth > 14 ? Mat.DeepRock : Mat.Rock;
  }
}

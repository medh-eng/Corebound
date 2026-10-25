// Draws dug-out regions as voxel chunk meshes, and tells the planet surface to hide there.
import * as THREE from 'three';
import { VoxelWorld } from '../core/voxels';
import { Mat } from '../core/geology';
import type { Terrain } from '../core/terrain';
import type { WorldDef } from '../data/worlds';
import { shared, stylised, MAX_BOXES } from '../art/materials';
import { surfaceColor, surfacePalette } from './planet';

const MAT_COLORS: Record<number, [string, string?]> = {
  [Mat.Soil]: ['#6e4c32'],
  [Mat.Rock]: ['#e3c59d'],
  [Mat.DeepRock]: ['#b78d69'],
  [Mat.Iron]: ['#b04d2c'],
  [Mat.Ice]: ['#a9e6ff', '#2a7fa8'],
  [Mat.Carbon]: ['#2c2731'],
};

export class DigRenderer {
  readonly group = new THREE.Group();
  private meshes = new Map<string, THREE.Mesh>();
  private order: string[] = [];
  private material = stylised({ vertexColors: true, glow: true, roughness: 0.9, mottle: 0.1, glowDay: 0.3, glowNight: 1.2 });
  private pal: ReturnType<typeof surfacePalette>;

  constructor(private world: VoxelWorld, private terrain: Terrain, private def: WorldDef) {
    this.group.name = 'dug-ground';
    this.material.polygonOffset = true;
    this.material.polygonOffsetFactor = -1;
    this.material.polygonOffsetUnits = -2;
    this.pal = surfacePalette(def);
  }

  /** Rebuilds the meshes of the given chunks. */
  rebuild(keys: Iterable<string>) {
    const c = new THREE.Color(), g = new THREE.Color();
    for (const key of new Set(keys)) {
      const ch = this.world.chunks.get(key);
      if (!ch) continue;
      const m = this.world.mesh(ch);
      const n = m.positions.length / 3;
      const cols = new Float32Array(n * 3), glow = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        const x = m.positions[i * 3], y = m.positions[i * 3 + 1], z = m.positions[i * 3 + 2];
        const depth = m.depths[i];
        const mat = m.materials[i];
        const spec = MAT_COLORS[mat] ?? ['#d9b48f'];
        c.set(spec[0]);
        g.setRGB(0, 0, 0);
        if (spec[1]) g.set(spec[1]).multiplyScalar(0.6);
        if (depth < 0.25) {
          // Untouched surface inside the chunk: match the planet's own colouring.
          const l = Math.hypot(x, y, z);
          const dx = x / l, dy = y / l, dz = z / l;
          const nx = m.normals[i * 3], ny = m.normals[i * 3 + 1], nz = m.normals[i * 3 + 2];
          const slope = 1 - (nx * dx + ny * dy + nz * dz);
          surfaceColor(this.def, this.pal, this.terrain.sample(dx, dy, dz), dx, dy, dz, slope, c);
          g.setRGB(0, 0, 0);
        } else if (depth < 0.9 && mat === Mat.Soil) {
          c.lerp(new THREE.Color('#3f7f2a'), THREE.MathUtils.clamp(1 - depth / 0.9, 0, 1) * 0.6);
        }
        cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
        glow[i * 3] = g.r; glow[i * 3 + 1] = g.g; glow[i * 3 + 2] = g.b;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(m.positions, 3));
      geo.setAttribute('normal', new THREE.BufferAttribute(m.normals, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      geo.setAttribute('glow', new THREE.BufferAttribute(glow, 3));
      geo.setIndex(new THREE.BufferAttribute(m.indices, 1));
      geo.computeBoundingSphere();
      let mesh = this.meshes.get(key);
      if (mesh) { mesh.geometry.dispose(); mesh.geometry = geo; }
      else {
        mesh = new THREE.Mesh(geo, this.material);
        mesh.castShadow = true; mesh.receiveShadow = true;
        mesh.name = `chunk ${key}`;
        this.meshes.set(key, mesh);
        this.group.add(mesh);
        this.order.push(key);
        this.updateBoxes();
      }
    }
  }

  private updateBoxes() {
    const keys = this.order.slice(-MAX_BOXES);
    keys.forEach((k, i) => {
      const ch = this.world.chunks.get(k)!;
      const s = 18; // CHUNK_M
      // Inset so the planet surface and the dug mesh overlap slightly: no cracks at the seams.
      const inset = 0.5;
      shared.uBoxMin.value[i].set(ch.ox + inset, ch.oy + inset, ch.oz + inset, ch.keepWater ? 1 : 0);
      shared.uBoxMax.value[i].set(ch.ox + s - inset, ch.oy + s - inset, ch.oz + s - inset);
    });
    shared.uBoxCount.value = keys.length;
  }

  get triangles() {
    let t = 0;
    for (const m of this.meshes.values()) t += (m.geometry.index?.count ?? 0) / 3;
    return t;
  }
}

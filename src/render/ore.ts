// Surface deposits you can mine with the laser: ice crystals, rust-red iron boulders, black carbon rocks.
import * as THREE from 'three';
import type { Terrain } from '../core/terrain';
import { rng, randomDir } from '../core/random';
import { stylised } from '../art/materials';
import { crystalCluster, sandstone } from '../art/flora';
import { surfaceMatrix, surfaceNormal } from './scatter';
import type { ItemId } from '../data/items';

export type OreKind = 'ice' | 'iron' | 'carbon';
export const ORE_ITEM: Record<OreKind, ItemId> = { ice: 'ice', iron: 'iron_ore', carbon: 'carbon' };
const ORE_AMOUNT: Record<OreKind, number> = { ice: 10, iron: 12, carbon: 9 };

export interface OreNode { id: number; kind: OreKind; pos: THREE.Vector3; radius: number; amount: number; max: number; mesh: THREE.InstancedMesh; index: number; base: THREE.Matrix4 }

function recolor(g: THREE.BufferGeometry, f: (c: THREE.Color, gl: THREE.Color, y: number) => void) {
  const col = g.getAttribute('color'), glow = g.getAttribute('glow'), pos = g.getAttribute('position');
  const c = new THREE.Color(), gl = new THREE.Color();
  for (let i = 0; i < col.count; i++) {
    c.fromBufferAttribute(col as THREE.BufferAttribute, i); gl.setRGB(0, 0, 0);
    f(c, gl, pos.getY(i));
    col.setXYZ(i, c.r, c.g, c.b); glow.setXYZ(i, gl.r, gl.g, gl.b);
  }
  return g;
}

export class OreField {
  readonly group = new THREE.Group();
  readonly nodes: OreNode[] = [];
  private tmp = new THREE.Matrix4();

  constructor(terrain: Terrain, seed: number, base: { up: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 }, avoid: { pos: THREE.Vector3; radius: number }[]) {
    this.group.name = 'ore';
    const ice = recolor(crystalCluster(501), (c, gl) => { c.lerp(new THREE.Color('#e8f8ff'), 0.4); gl.setRGB(0.35, 0.85, 1.0); });
    const iron = recolor(sandstone(502), (c, _gl, y) => { c.set('#a9472a').lerp(new THREE.Color('#5c2416'), Math.sin(y * 9) > 0.6 ? 0.6 : 0); });
    const carbon = recolor(sandstone(503), (c, gl, y) => { c.set('#2a2630'); if (Math.sin(y * 13) > 0.85) gl.setRGB(0.2, 0.1, 0.35); });
    const geoms: Record<OreKind, THREE.BufferGeometry> = { ice, iron, carbon };
    const mats: Record<OreKind, THREE.Material> = {
      ice: stylised({ vertexColors: true, glow: true, roughness: 0.2, glowDay: 0.6, glowNight: 2.2 }),
      iron: stylised({ vertexColors: true, roughness: 0.75, metalness: 0.25 }),
      carbon: stylised({ vertexColors: true, glow: true, roughness: 0.35, metalness: 0.1 }),
    };
    const R = terrain.radius;
    const spots: { kind: OreKind; dir: THREE.Vector3; scale: number }[] = [];
    const at = (fw: number, rt: number) => base.up.clone().multiplyScalar(R).addScaledVector(base.forward, fw).addScaledVector(base.right, rt).normalize();
    // Guaranteed deposits near where you wake up.
    spots.push({ kind: 'ice', dir: at(4.5, -3.2), scale: 1.2 }, { kind: 'ice', dir: at(-6, 9), scale: 1.0 });
    spots.push({ kind: 'iron', dir: at(8, -8), scale: 1.1 }, { kind: 'iron', dir: at(17, -6), scale: 1.3 }, { kind: 'iron', dir: at(-4, -11), scale: 1.0 });
    spots.push({ kind: 'carbon', dir: at(24, 9), scale: 1.1 }, { kind: 'carbon', dir: at(-14, 3), scale: 1.0 });
    // Scattered across the planet.
    const r = rng(seed + 77);
    let tries = 0;
    while (spots.length < 160 && tries++ < 20000) {
      const d = randomDir(r);
      const dir = new THREE.Vector3(d.x, d.y, d.z);
      if (dir.angleTo(base.up) < 0.12) continue;
      const s = terrain.sample(d.x, d.y, d.z);
      if (s.h < terrain.seaLevel + 0.3) continue;
      const roll = r();
      const kind: OreKind = s.snow > 0.3 || (roll < 0.3) ? 'ice' : s.rock > 0.3 || roll < 0.7 ? 'iron' : 'carbon';
      spots.push({ kind, dir, scale: 0.8 + r() * 0.7 });
    }
    const byKind: Record<OreKind, typeof spots> = { ice: [], iron: [], carbon: [] };
    for (const s of spots) {
      const p = s.dir.clone().multiplyScalar(terrain.groundRadius(s.dir));
      if (avoid.some((a) => a.pos.distanceTo(p) < a.radius)) continue;
      byKind[s.kind].push(s);
    }
    let id = 0;
    for (const kind of Object.keys(byKind) as OreKind[]) {
      const list = byKind[kind];
      if (!list.length) continue;
      const im = new THREE.InstancedMesh(geoms[kind], mats[kind], list.length);
      im.castShadow = true; im.receiveShadow = true; im.name = `ore-${kind}`;
      list.forEach((s, i) => {
        const m = surfaceMatrix(terrain, s.dir, i * 1.7, s.scale, kind === 'ice' ? 0.05 : 0.2, 0.5);
        im.setMatrixAt(i, m);
        const pos = s.dir.clone().multiplyScalar(terrain.groundRadius(s.dir)).addScaledVector(surfaceNormal(terrain, s.dir), 0.5 * s.scale);
        const max = Math.round(ORE_AMOUNT[kind] * s.scale);
        this.nodes.push({ id: id++, kind, pos, radius: (kind === 'ice' ? 0.75 : 1.1) * s.scale, amount: max, max, mesh: im, index: i, base: m });
      });
      im.instanceMatrix.needsUpdate = true;
      im.computeBoundingSphere();
      this.group.add(im);
    }
  }

  /** First deposit hit by a ray, within maxDist. */
  raycast(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number): { node: OreNode; t: number } | null {
    let best: { node: OreNode; t: number } | null = null;
    const oc = new THREE.Vector3();
    for (const n of this.nodes) {
      if (n.amount <= 0) continue;
      oc.subVectors(origin, n.pos);
      const b = oc.dot(dir), c = oc.lengthSq() - n.radius * n.radius;
      const h = b * b - c;
      if (h < 0) continue;
      const t = -b - Math.sqrt(h);
      if (t > 0 && t < maxDist && (!best || t < best.t)) best = { node: n, t };
    }
    return best;
  }

  /** Takes one unit from a deposit; shrinks it. Returns true if something was taken. */
  take(n: OreNode): boolean {
    if (n.amount <= 0) return false;
    n.amount--;
    const k = n.amount <= 0 ? 0 : 0.45 + 0.55 * (n.amount / n.max);
    this.tmp.copy(n.base).multiply(new THREE.Matrix4().makeScale(k, k, k));
    n.mesh.setMatrixAt(n.index, this.tmp);
    n.mesh.instanceMatrix.needsUpdate = true;
    return true;
  }

  /** For saving: remaining amount per deposit. */
  amounts(): number[] { return this.nodes.map((n) => n.amount); }
  restore(a: number[]) {
    a.forEach((v, i) => {
      const n = this.nodes[i];
      if (!n) return;
      n.amount = n.max;
      while (n.amount > v) this.take(n);
    });
  }
}

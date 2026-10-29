// Places plants, rocks and crystals over the planet as instanced meshes,
// grouped into regions so off-screen parts are skipped when drawing.
import * as THREE from 'three';
import type { Terrain } from '../core/terrain';
import type { Collider } from '../core/motion';
import { rng, randomDir } from '../core/random';
import { SCATTER } from '../data/base';
import { stylised } from '../art/materials';
import * as F from '../art/flora';

export interface ScatterResult {
  group: THREE.Group;
  colliders: Collider[];
  instances: number;
  triangles: number;
  landmarks: Record<string, THREE.Vector3[]>;
}

type Rule = (s: ReturnType<Terrain['sample']>, slope: number, dir: THREE.Vector3) => number; // acceptance 0..1

interface Kind {
  name: string;
  geoms: THREE.BufferGeometry[];
  material: THREE.Material;
  count: number;
  rule: Rule;
  scale: [number, number];
  sink: number;
  minDeg?: number;          // keep clear of the base
  spacing?: number;         // metres between big objects
  collider?: number;        // collision radius per unit scale
  tilt?: number;            // how much to lean with the slope (0 = upright)
  castShadow?: boolean;
  near?: THREE.Vector3[];   // optional: cluster around these points
  nearRadius?: number;
}

const tmpM = new THREE.Matrix4();

function chunkKey(d: THREE.Vector3): number {
  const ax = Math.abs(d.x), ay = Math.abs(d.y), az = Math.abs(d.z);
  let face: number, u: number, v: number;
  if (ax >= ay && ax >= az) { face = d.x > 0 ? 0 : 1; u = d.y / ax; v = d.z / ax; }
  else if (ay >= az) { face = d.y > 0 ? 2 : 3; u = d.x / ay; v = d.z / ay; }
  else { face = d.z > 0 ? 4 : 5; u = d.x / az; v = d.y / az; }
  return face * 4 + (u > 0 ? 1 : 0) * 2 + (v > 0 ? 1 : 0);
}

export function surfaceNormal(terrain: Terrain, d: THREE.Vector3): THREE.Vector3 {
  const R = terrain.radius, e = 0.004;
  const t1 = new THREE.Vector3().crossVectors(d, Math.abs(d.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
  const t2 = new THREE.Vector3().crossVectors(d, t1);
  const P = (v: THREE.Vector3) => { const n = v.clone().normalize(); return n.multiplyScalar(R + terrain.height(n.x, n.y, n.z)); };
  const a = P(d.clone().addScaledVector(t1, e)).sub(P(d.clone().addScaledVector(t1, -e)));
  const b = P(d.clone().addScaledVector(t2, e)).sub(P(d.clone().addScaledVector(t2, -e)));
  const n = new THREE.Vector3().crossVectors(a, b).normalize();
  if (n.dot(d) < 0) n.negate();
  return n;
}

/** World matrix for an object standing on the surface at unit direction d. */
export function surfaceMatrix(terrain: Terrain, d: THREE.Vector3, yaw: number, scale: number, sink: number, tilt = 0, forward?: THREE.Vector3): THREE.Matrix4 {
  const up = d.clone();
  if (tilt > 0) up.lerp(surfaceNormal(terrain, d), tilt).normalize();
  let f = forward ? forward.clone() : new THREE.Vector3().crossVectors(up, Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0));
  f.addScaledVector(up, -f.dot(up)).normalize();
  if (yaw) f = f.applyAxisAngle(up, yaw);
  const x = new THREE.Vector3().crossVectors(up, f).normalize();
  const z = new THREE.Vector3().crossVectors(x, up).normalize();
  const r = terrain.radius + terrain.height(d.x, d.y, d.z) - sink * scale;
  const pos = d.clone().multiplyScalar(r);
  const m = new THREE.Matrix4().makeBasis(x, up, z);
  m.scale(new THREE.Vector3(scale, scale, scale));
  m.setPosition(pos);
  return m;
}

/** `density` thins the grass and ferns only (phones); trees, rocks and landmarks never change. */
export function scatterWorld(terrain: Terrain, seed: number, baseDir: THREE.Vector3, keepClear: { pos: THREE.Vector3; radius: number }[], density = 1): ScatterResult {
  const r = rng(seed + 7);
  const sea = terrain.seaLevel;
  const group = new THREE.Group();
  group.name = 'scatter';
  const colliders: Collider[] = [];
  const big: { p: THREE.Vector3; rad: number }[] = keepClear.map((k) => ({ p: k.pos.clone(), rad: k.radius }));

  const matTree = stylised({ vertexColors: true, glow: true, roughness: 0.75, glowDay: 0.45, glowNight: 2.6, sway: 0.05, swayHeight: 8, life: 0.8 });
  const matLeaf = stylised({ vertexColors: true, glow: true, roughness: 0.7, side: THREE.DoubleSide, sway: 0.08, swayHeight: 0.6, life: 1 });
  const matGrass = stylised({ vertexColors: true, roughness: 0.9, side: THREE.DoubleSide, sway: 0.1, swayHeight: 0.5, life: 1 });
  const matFlower = stylised({ vertexColors: true, glow: true, roughness: 0.6, side: THREE.DoubleSide, glowDay: 0.5, glowNight: 2.4, sway: 0.03, swayHeight: 0.3, life: 1 });
  const matRock = stylised({ vertexColors: true, roughness: 0.92 });
  const matCrystal = stylised({ vertexColors: true, glow: true, roughness: 0.25, metalness: 0.1, glowDay: 0.5, glowNight: 2.2 });

  const ground = (s: { h: number; snow: number }, minAbove = 0.4) => s.h > sea + minAbove && s.snow < 0.3;
  const kinds: Kind[] = [
    {
      name: 'banyan', geoms: [F.banyanTree(19, 11), F.banyanTree(22, 23), F.banyanTree(17, 37)], material: matTree,
      count: SCATTER.banyan.count, scale: [0.85, 1.2], sink: 0.4, minDeg: SCATTER.banyan.minDegFromBase,
      spacing: SCATTER.banyan.minSpacing, collider: 2.0, castShadow: true,
      rule: (s, slope) => (ground(s, 0.8) && s.rock < 0.15 && slope < 0.1 ? THREE.MathUtils.smoothstep(s.forest, 0.35, 0.8) : 0),
    },
    {
      name: 'mushroomTree',
      geoms: [
        F.mushroomTree({ height: 7, capRadius: 3.6, stemRadius: 0.38, bend: 1.4, seed: 1 }),
        F.mushroomTree({ height: 10, capRadius: 4.6, stemRadius: 0.5, bend: 2.2, seed: 2 }),
        F.mushroomTree({ height: 4.5, capRadius: 2.4, stemRadius: 0.26, bend: 0.8, seed: 3 }),
      ],
      material: matTree, count: SCATTER.mushroomTree.count, scale: [0.75, 1.35], sink: 0.2,
      minDeg: SCATTER.mushroomTree.minDegFromBase, spacing: SCATTER.mushroomTree.minSpacing, collider: 0.55, castShadow: true,
      rule: (s, slope) => (ground(s, 0.5) && s.rock < 0.4 && slope < 0.2 ? 0.25 + 0.75 * s.forest : 0),
    },
    {
      name: 'smallMushroom',
      geoms: [F.mushroomTree({ height: 0.9, capRadius: 0.5, stemRadius: 0.06, bend: 0.2, seed: 4, detail: 0.6 }),
        F.mushroomTree({ height: 1.5, capRadius: 0.7, stemRadius: 0.08, bend: 0.4, seed: 5, detail: 0.6 })],
      material: matTree, count: SCATTER.smallMushroom.count, scale: [0.6, 1.5], sink: 0.05, minDeg: 3.5,
      rule: (s) => (ground(s, 0.3) && s.rock < 0.5 ? 0.3 + 0.7 * s.forest : 0),
    },
    {
      name: 'bigRock', geoms: [F.sandstone(41), F.sandstone(42), F.sandstone(43), F.sandstone(44)], material: matRock,
      count: SCATTER.bigRock.count, scale: [1.6, 4.2], sink: 0.15, minDeg: 5, spacing: 5, collider: 0.95, tilt: 0.5, castShadow: true,
      rule: (s) => (s.h > sea - 0.5 && s.snow < 0.5 ? 0.15 + 0.85 * s.rock : 0),
    },
    {
      name: 'smallRock', geoms: [F.sandstone(51), F.sandstone(52), F.sandstone(53)], material: matRock,
      count: SCATTER.smallRock.count, scale: [0.35, 1.1], sink: 0.1, minDeg: 2.5, tilt: 0.8, castShadow: true,
      rule: (s) => (s.h > sea - 0.8 ? 0.5 + 0.5 * s.rock : 0),
    },
    {
      name: 'crystal', geoms: [F.crystalCluster(61), F.crystalCluster(62)], material: matCrystal,
      count: SCATTER.crystal.count, scale: [0.7, 1.6], sink: 0.1, minDeg: 3.5, tilt: 0.6,
      rule: (s) => (s.h > sea && s.snow < 0.5 ? 0.1 + 0.9 * s.rock : 0),
    },
    {
      name: 'fern', geoms: [F.fernBush(71, 'green'), F.fernBush(72, 'tropical'), F.fernBush(73, 'ember'), F.fernBush(74, 'green')], material: matLeaf,
      count: Math.round(SCATTER.fern.count * density), scale: [0.7, 1.8], sink: 0.05, minDeg: 1.6, tilt: 0.6,
      rule: (s, slope) => (ground(s, 0.3) && s.rock < 0.35 && slope < 0.25 ? 0.2 + 0.8 * s.forest : 0),
    },
    {
      name: 'grass', geoms: [F.grassTuft(81), F.grassTuft(82)], material: matGrass,
      count: Math.round(SCATTER.grass.count * density), scale: [0.8, 1.5], sink: 0.02, minDeg: 0, tilt: 0.9,
      rule: (s, slope, d) => (ground(s, 0.25) && s.rock < 0.25 && slope < 0.3 ? 0.35 + 0.65 * THREE.MathUtils.smoothstep(d.dot(baseDir), 0.7, 0.97) : 0),
    },
    {
      name: 'lotus', geoms: [F.glowLotus(91)], material: matFlower,
      count: SCATTER.lotus.count, scale: [0.9, 1.9], sink: 0.0, minDeg: 3.2,
      rule: (s) => (s.h > sea - 0.4 && s.h < sea + 1.4 && s.snow < 0.2 ? 1 : 0.02),
    },
  ];

  let instances = 0, triangles = 0;
  const landmarks: Record<string, THREE.Vector3[]> = {};
  const angOf = (d: THREE.Vector3) => d.angleTo(baseDir) * (180 / Math.PI);

  for (const k of kinds) {
    const perChunk = new Map<number, THREE.Matrix4[][]>();
    let placed = 0, tries = 0;
    const maxTries = k.count * 60;
    while (placed < k.count && tries++ < maxTries) {
      const rd = randomDir(r);
      const d = new THREE.Vector3(rd.x, rd.y, rd.z);
      if (k.minDeg && angOf(d) < k.minDeg) continue;
      const s = terrain.sample(d.x, d.y, d.z);
      const n = surfaceNormal(terrain, d);
      const slope = 1 - n.dot(d);
      if (r() > k.rule(s, slope, d)) continue;
      const scale = THREE.MathUtils.lerp(k.scale[0], k.scale[1], Math.pow(r(), 1.5));
      const p = d.clone().multiplyScalar(terrain.radius + s.h);
      if (k.spacing) {
        const minD = k.spacing * scale;
        if (big.some((b) => b.p.distanceTo(p) < Math.max(minD, b.rad))) continue;
        big.push({ p, rad: minD });
      } else if (k.collider || k.name === 'crystal' || k.name === 'lotus') {
        if (big.some((b) => b.p.distanceTo(p) < b.rad * 0.6)) continue;
      }
      if (keepClear.some((c) => c.pos.distanceTo(p) < c.radius)) continue;
      const m = surfaceMatrix(terrain, d, r() * Math.PI * 2, scale, k.sink, k.tilt ?? 0);
      const v = Math.floor(r() * k.geoms.length);
      const key = chunkKey(d);
      if (!perChunk.has(key)) perChunk.set(key, k.geoms.map(() => []));
      perChunk.get(key)![v].push(m);
      if (k.collider) colliders.push({ pos: { x: p.x, y: p.y, z: p.z }, radius: k.collider * scale });
      (landmarks[k.name] ??= []).push(p);
      placed++;
    }
    for (const lists of perChunk.values()) {
      lists.forEach((mats, v) => {
        if (!mats.length) return;
        const im = new THREE.InstancedMesh(k.geoms[v], k.material, mats.length);
        mats.forEach((m, i) => im.setMatrixAt(i, m));
        im.instanceMatrix.needsUpdate = true;
        im.computeBoundingSphere();
        im.castShadow = !!k.castShadow;
        im.receiveShadow = true;
        im.name = k.name;
        group.add(im);
        instances += mats.length;
        triangles += (k.geoms[v].getAttribute('position').count / 3) * mats.length;
      });
    }
  }
  void tmpM;
  return { group, colliders, instances, triangles, landmarks };
}

/** A few hand-placed things around the starting base, for the opening view. */
export function decorateBase(terrain: Terrain, frame: { up: THREE.Vector3; forward: THREE.Vector3; right: THREE.Vector3 }, points: { dome: THREE.Vector3 }): THREE.Group {
  const g = new THREE.Group();
  g.name = 'base-decor';
  const at = (fw: number, rt: number) => {
    const R = terrain.radius;
    return frame.up.clone().multiplyScalar(R).addScaledVector(frame.forward, fw).addScaledVector(frame.right, rt).normalize();
  };
  const matTree = stylised({ vertexColors: true, glow: true, roughness: 0.75, glowDay: 0.45, glowNight: 2.6, sway: 0.05, swayHeight: 8, life: 0.8 });
  const matFlower = stylised({ vertexColors: true, glow: true, roughness: 0.6, side: THREE.DoubleSide, glowDay: 0.5, glowNight: 2.4 });
  const matStone = stylised({ vertexColors: true, roughness: 0.9 });

  // Mushroom trees framing the view, like the key art.
  const trees: [number, number, number, number][] = [[9, -11, 1.25, 1], [15, -13, 0.95, 2], [4, -15, 0.8, 0], [22, 14, 1.15, 1], [6, 17, 0.8, 2]];
  const tg = [
    F.mushroomTree({ height: 7, capRadius: 3.6, stemRadius: 0.38, bend: 1.4, seed: 101 }),
    F.mushroomTree({ height: 10, capRadius: 4.6, stemRadius: 0.5, bend: 2.0, seed: 102 }),
    F.mushroomTree({ height: 5, capRadius: 2.6, stemRadius: 0.28, bend: 0.9, seed: 103 }),
  ];
  for (const [fw, rt, sc, v] of trees) {
    const m = new THREE.Mesh(tg[v], matTree);
    m.applyMatrix4(surfaceMatrix(terrain, at(fw, rt), fw * 0.3, sc, 0.2));
    m.castShadow = true; m.receiveShadow = true;
    g.add(m);
  }
  // Glowing lotus flowers near the door and path.
  const lotus = F.glowLotus(201);
  const flowers: [number, number][] = [[7, 4.2], [9.5, 3.4], [13.5, 2.6], [5, -2.5], [10, 11.5], [16, 9.8]];
  for (const [fw, rt] of flowers) {
    const m = new THREE.Mesh(lotus, matFlower);
    m.applyMatrix4(surfaceMatrix(terrain, at(fw, rt), fw, 1.3, 0));
    g.add(m);
  }
  // Stepping-stone path from where you stand to the dome door.
  const start = at(1.5, 0.3);
  const doorDir = points.dome.clone().normalize();
  const stone = F.steppingStone(301);
  const n = 7;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const d = start.clone().lerp(doorDir, t * 0.8).normalize();
    const fwd = doorDir.clone().sub(start);
    const m = new THREE.Mesh(stone, matStone);
    m.applyMatrix4(surfaceMatrix(terrain, d, (i % 2 ? 0.25 : -0.2), 1, 0.06, 0.8, fwd));
    m.receiveShadow = true;
    g.add(m);
  }
  return g;
}

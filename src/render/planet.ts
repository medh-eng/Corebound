// Builds the planet surface mesh (a cube-sphere) and its water from the Terrain maths.
import * as THREE from 'three';
import { Terrain } from '../core/terrain';
import type { WorldDef } from '../data/worlds';
import { stylised } from '../art/materials';

const FACES: [number[], number[], number[]][] = [
  [[1, 0, 0], [0, 0, -1], [0, 1, 0]],
  [[-1, 0, 0], [0, 0, 1], [0, 1, 0]],
  [[0, 1, 0], [1, 0, 0], [0, 0, -1]],
  [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  [[0, 0, 1], [1, 0, 0], [0, 1, 0]],
  [[0, 0, -1], [-1, 0, 0], [0, 1, 0]],
];

/** Maps a cube point to the sphere with even spacing. */
function spherify(x: number, y: number, z: number): [number, number, number] {
  const x2 = x * x, y2 = y * y, z2 = z * z;
  const sx = x * Math.sqrt(1 - y2 / 2 - z2 / 2 + (y2 * z2) / 3);
  const sy = y * Math.sqrt(1 - z2 / 2 - x2 / 2 + (z2 * x2) / 3);
  const sz = z * Math.sqrt(1 - x2 / 2 - y2 / 2 + (x2 * y2) / 3);
  const l = Math.hypot(sx, sy, sz);
  return [sx / l, sy / l, sz / l];
}

export interface PlanetMeshes {
  ground: THREE.Mesh;
  water: THREE.Mesh;
}

export function buildPlanet(world: WorldDef, terrain: Terrain, segments = 144): PlanetMeshes {
  const P = world.palette;
  const col = (s: string) => new THREE.Color(s);
  const cGrassLow = col(P.grassLow), cGrassHigh = col(P.grassHigh), cDry = col(P.grassDry);
  const cRock = col(P.rock), cRockDark = col(P.rockDark), cVein = col(P.vein);
  const cSand = col(P.sand), cSnow = col(P.snow), cSeabed = col(P.seabed);

  const N = segments, V = N + 1;
  const count = 6 * V * V;
  const pos = new Float32Array(count * 3);
  const nor = new Float32Array(count * 3);
  const cols = new Float32Array(count * 3);
  const idx = new Uint32Array(6 * N * N * 6);
  const R = world.radius;
  const eps = 0.004;
  const tmp = new THREE.Color();
  const veinNoise = (x: number, y: number, z: number) => Math.sin(y * 48 + Math.sin(x * 23) * 2 + Math.cos(z * 19) * 2);

  let vi = 0, ii = 0;
  for (let f = 0; f < 6; f++) {
    const [o, a, b] = FACES[f];
    const base = vi;
    for (let j = 0; j <= N; j++) {
      for (let i = 0; i <= N; i++) {
        const u = (i / N) * 2 - 1, v = (j / N) * 2 - 1;
        const [x, y, z] = spherify(o[0] + a[0] * u + b[0] * v, o[1] + a[1] * u + b[1] * v, o[2] + a[2] * u + b[2] * v);
        const s = terrain.sample(x, y, z);
        const r = R + s.h;
        pos[vi * 3] = x * r; pos[vi * 3 + 1] = y * r; pos[vi * 3 + 2] = z * r;

        // Normal from the height field (seamless across cube faces).
        let tx = 0, ty = 1, tz = 0;
        if (Math.abs(y) > 0.9) { tx = 1; ty = 0; }
        // t1 = normalize(cross(n, t)), t2 = cross(n, t1)
        let t1x = y * tz - z * ty, t1y = z * tx - x * tz, t1z = x * ty - y * tx;
        const l1 = Math.hypot(t1x, t1y, t1z); t1x /= l1; t1y /= l1; t1z /= l1;
        const t2x = y * t1z - z * t1y, t2y = z * t1x - x * t1z, t2z = x * t1y - y * t1x;
        const pt = (dx: number, dy: number, dz: number) => {
          const l = Math.hypot(dx, dy, dz); dx /= l; dy /= l; dz /= l;
          const rr = R + terrain.height(dx, dy, dz);
          return [dx * rr, dy * rr, dz * rr];
        };
        const pa = pt(x + t1x * eps, y + t1y * eps, z + t1z * eps);
        const pb = pt(x - t1x * eps, y - t1y * eps, z - t1z * eps);
        const pc = pt(x + t2x * eps, y + t2y * eps, z + t2z * eps);
        const pd = pt(x - t2x * eps, y - t2y * eps, z - t2z * eps);
        const ax = pa[0] - pb[0], ay = pa[1] - pb[1], az = pa[2] - pb[2];
        const bx = pc[0] - pd[0], by = pc[1] - pd[1], bz = pc[2] - pd[2];
        let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
        if (nx * x + ny * y + nz * z < 0) { nx = -nx; ny = -ny; nz = -nz; }
        const nl = Math.hypot(nx, ny, nz);
        nx /= nl; ny /= nl; nz /= nl;
        nor[vi * 3] = nx; nor[vi * 3 + 1] = ny; nor[vi * 3 + 2] = nz;
        const slope = 1 - (nx * x + ny * y + nz * z); // 0 flat .. 1 vertical

        // Colour: grass → sandstone on steep or ridged ground, sand near water, snow at the poles.
        const hn = THREE.MathUtils.clamp((s.h + 2) / 9, 0, 1);
        tmp.copy(cGrassLow).lerp(cGrassHigh, hn * 0.8 + 0.1 * Math.sin(x * 31 + z * 17));
        tmp.lerp(cDry, (1 - THREE.MathUtils.smoothstep(s.forest, 0.0, 0.6)) * 0.35 + s.flat * 0.2);
        const rockAmt = Math.max(s.rock, THREE.MathUtils.smoothstep(slope, 0.12, 0.3));
        if (rockAmt > 0) {
          const rc = cRock.clone().lerp(cRockDark, THREE.MathUtils.clamp(slope * 2.5, 0, 1) * 0.6);
          if (veinNoise(x, y, z) > 0.93) rc.lerp(cVein, 0.85);
          tmp.lerp(rc, rockAmt);
        }
        const shore = 1 - THREE.MathUtils.smoothstep(s.h, world.seaLevel + 0.15, world.seaLevel + 0.9);
        tmp.lerp(cSand, shore * 0.85);
        if (s.h < world.seaLevel - 0.2) tmp.lerp(cSeabed, THREE.MathUtils.clamp((world.seaLevel - s.h) / 1.5, 0, 1));
        tmp.lerp(cSnow, s.snow);
        cols[vi * 3] = tmp.r; cols[vi * 3 + 1] = tmp.g; cols[vi * 3 + 2] = tmp.b;
        vi++;
      }
    }
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const p0 = base + j * V + i, p1 = p0 + 1, p2 = p0 + V, p3 = p2 + 1;
        idx[ii++] = p0; idx[ii++] = p1; idx[ii++] = p2;
        idx[ii++] = p1; idx[ii++] = p3; idx[ii++] = p2;
      }
    }
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  // Make every face wind outward (some cube faces come out inverted).
  fixWinding(g);
  g.computeBoundingSphere();

  const ground = new THREE.Mesh(g, stylised({ vertexColors: true, roughness: 0.93, mottle: 0.12 }));
  ground.receiveShadow = true;
  ground.castShadow = true;
  ground.name = 'ground';

  const water = new THREE.Mesh(
    new THREE.SphereGeometry(R + world.seaLevel, 192, 96),
    new THREE.MeshStandardMaterial({
      color: P.water, roughness: 0.08, metalness: 0.0, transparent: true, opacity: 0.82, envMapIntensity: 1.4,
    }),
  );
  water.name = 'water';
  water.receiveShadow = true;
  return { ground, water };
}

function fixWinding(g: THREE.BufferGeometry) {
  const idx = g.getIndex()!.array as Uint32Array;
  const p = g.getAttribute('position').array as Float32Array;
  for (let i = 0; i < idx.length; i += 3) {
    const a = idx[i] * 3, b = idx[i + 1] * 3, c = idx[i + 2] * 3;
    const abx = p[b] - p[a], aby = p[b + 1] - p[a + 1], abz = p[b + 2] - p[a + 2];
    const acx = p[c] - p[a], acy = p[c + 1] - p[a + 1], acz = p[c + 2] - p[a + 2];
    const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
    if (nx * p[a] + ny * p[a + 1] + nz * p[a + 2] < 0) {
      const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t;
    }
  }
}

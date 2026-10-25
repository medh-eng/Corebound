// Procedural plants, rocks and crystals for Jivagraha, matched to the concept art.
// Every builder returns geometry with position, normal, color and glow attributes.
import * as THREE from 'three';
import { mergeGeometries, mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createNoise3D } from 'simplex-noise';
import { rng } from '../core/random';

const C = (s: string) => new THREE.Color(s);
const BLACK = new THREE.Color(0, 0, 0);

/** Keeps only the attributes we use and makes sure color + glow exist. */
function clean(g: THREE.BufferGeometry): THREE.BufferGeometry {
  const out = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(out.attributes)) if (!['position', 'normal', 'color', 'glow'].includes(k)) out.deleteAttribute(k);
  const n = out.getAttribute('position').count;
  if (!out.getAttribute('color')) out.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(1), 3));
  if (!out.getAttribute('glow')) out.setAttribute('glow', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  if (!out.getAttribute('normal')) out.computeVertexNormals();
  return out;
}

function merge(parts: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const g = mergeGeometries(parts.map(clean), false)!;
  return g;
}

/** Colours each vertex with f(position, normal) -> [color, glow]. */
function shade(g: THREE.BufferGeometry, f: (p: THREE.Vector3, n: THREE.Vector3, c: THREE.Color, gl: THREE.Color) => void) {
  const pos = g.getAttribute('position'), nor = g.getAttribute('normal');
  const n = pos.count;
  const cols = new Float32Array(n * 3), glow = new Float32Array(n * 3);
  const p = new THREE.Vector3(), q = new THREE.Vector3(), c = new THREE.Color(), gl = new THREE.Color();
  for (let i = 0; i < n; i++) {
    p.fromBufferAttribute(pos, i); q.fromBufferAttribute(nor, i);
    c.setRGB(1, 1, 1); gl.setRGB(0, 0, 0);
    f(p, q, c, gl);
    cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    glow[i * 3] = gl.r; glow[i * 3 + 1] = gl.g; glow[i * 3 + 2] = gl.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(cols, 3));
  g.setAttribute('glow', new THREE.BufferAttribute(glow, 3));
  return g;
}

/** A tapered tube along a curve. radius(t) in metres, t = 0 at the base. */
function tube(curve: THREE.Curve<THREE.Vector3>, segs: number, radial: number, radius: (t: number) => number): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(segs, false);
  const pos: number[] = [], idx: number[] = [];
  const P = new THREE.Vector3();
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    curve.getPointAt(t, P);
    const N = frames.normals[i], B = frames.binormals[i];
    const r = radius(t);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const cx = Math.cos(a), sx = Math.sin(a);
      pos.push(P.x + r * (cx * N.x + sx * B.x), P.y + r * (cx * N.y + sx * B.y), P.z + r * (cx * N.z + sx * B.z));
    }
  }
  for (let i = 0; i < segs; i++)
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function blob(detail: number, sx: number, sy: number, sz: number, wobble: number, seed: number): THREE.BufferGeometry {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute('normal'); g.deleteAttribute('uv');
  g = mergeVertices(g);
  const n3 = createNoise3D(rng(seed));
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const k = 1 + wobble * n3(v.x * 1.7, v.y * 1.7, v.z * 1.7);
    p.setXYZ(i, v.x * sx * k, v.y * sy * k, v.z * sz * k);
  }
  g.computeVertexNormals();
  return g;
}

// ─────────────────────────── Glowing mushroom trees ───────────────────────────

export interface MushroomOpts { height: number; capRadius: number; stemRadius: number; bend: number; seed: number; detail?: number }

export function mushroomTree(o: MushroomOpts): THREE.BufferGeometry {
  const r = rng(o.seed);
  const d = o.detail ?? 1;
  const top = new THREE.Vector3(o.bend * (r() - 0.5) * 2, o.height, o.bend * (r() - 0.5) * 2);
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.3, 0),
    new THREE.Vector3(top.x * 0.15, o.height * 0.35, top.z * 0.15),
    new THREE.Vector3(top.x * 0.6, o.height * 0.75, top.z * 0.6),
    top,
  ]);
  const stem = tube(curve, Math.round(10 * d), Math.round(9 * d), (t) => o.stemRadius * (1 - 0.35 * t) * (1 + 1.4 * Math.pow(1 - t, 6)));
  const stemTop = C('#9fe8d4'), stemBase = C('#3e9c86');
  shade(stem, (p, _n, c, gl) => {
    const t = THREE.MathUtils.clamp(p.y / o.height, 0, 1);
    c.copy(stemBase).lerp(stemTop, t);
    const line = Math.pow(Math.max(0, Math.sin(Math.atan2(p.z, p.x) * 3 + p.y * 0.7)), 18);
    gl.setRGB(0.1, 0.6, 0.5).multiplyScalar(line * 0.8 + 0.05);
  });

  // Cap: lathe profile from the crown, over the rim, back under to the stem.
  const R = o.capRadius, H = o.capRadius * 0.55;
  const prof = [
    [0.001, H], [0.3 * R, 0.96 * H], [0.6 * R, 0.8 * H], [0.85 * R, 0.5 * H], [1.0 * R, 0.18 * H],
    [1.04 * R, -0.02 * H], [0.95 * R, -0.08 * H], [0.7 * R, 0.0], [0.4 * R, 0.08 * H], [o.stemRadius * 0.9, 0.12 * H],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const cap = new THREE.LatheGeometry(prof, Math.round(22 * d));
  const n3 = createNoise3D(rng(o.seed + 3));
  const capTop = C('#1d9e80'), capRim = C('#4fd8b8'), capUnder = C('#17605c');
  const spot = C('#bdfff0');
  cap.computeVertexNormals();
  shade(cap, (p, n, c, gl) => {
    const rr = Math.hypot(p.x, p.z) / R;
    if (n.y > -0.2) {
      c.copy(capTop).lerp(capRim, Math.pow(rr, 2));
      const s = n3(p.x * 2.2 / R * 2, p.y * 3 / R, p.z * 2.2 / R * 2);
      if (s > 0.45 && rr > 0.15) { c.lerp(spot, 0.75); gl.setRGB(0.35, 1.0, 0.85).multiplyScalar(0.9); }
      else gl.setRGB(0.05, 0.3, 0.25).multiplyScalar(rr * 0.6);
    } else {
      c.copy(capUnder);
      gl.setRGB(0.1, 0.55, 0.45).multiplyScalar(0.55 * (1 - rr * 0.5));
    }
  });
  cap.translate(top.x, top.y - 0.05, top.z);
  return merge([stem, cap]);
}

// ─────────────────────────── Banyan trees ───────────────────────────

export function banyanTree(height: number, seed: number): THREE.BufferGeometry {
  const r = rng(seed);
  const parts: THREE.BufferGeometry[] = [];
  const bark = C('#efe9da'), barkDark = C('#cfc5ae');
  const trunkTop = new THREE.Vector3((r() - 0.5) * 1.5, height * 0.55, (r() - 0.5) * 1.5);
  // Twisted trunk strands that flare into roots at the base.
  const strands = 6;
  for (let i = 0; i < strands; i++) {
    const a = (i / strands) * Math.PI * 2 + r() * 0.4;
    const spread = 1.8 + r() * 1.4;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * spread, -0.6, Math.sin(a) * spread),
      new THREE.Vector3(Math.cos(a + 0.6) * 0.9, height * 0.18, Math.sin(a + 0.6) * 0.9),
      new THREE.Vector3(Math.cos(a + 1.2) * 0.7 + trunkTop.x * 0.5, height * 0.38, Math.sin(a + 1.2) * 0.7 + trunkTop.z * 0.5),
      new THREE.Vector3(trunkTop.x + Math.cos(a + 1.8) * 0.5, trunkTop.y, trunkTop.z + Math.sin(a + 1.8) * 0.5),
    ]);
    parts.push(tube(curve, 14, 7, (t) => (0.75 - 0.3 * t) * (1 + 0.5 * Math.pow(1 - t, 3))));
  }
  // Branches.
  const crowns: THREE.Vector3[] = [];
  const nb = 5;
  for (let i = 0; i < nb; i++) {
    const a = (i / nb) * Math.PI * 2 + r() * 0.8;
    const reach = height * (0.3 + r() * 0.15);
    const end = new THREE.Vector3(trunkTop.x + Math.cos(a) * reach, height * (0.78 + r() * 0.15), trunkTop.z + Math.sin(a) * reach);
    crowns.push(end);
    const mid = trunkTop.clone().lerp(end, 0.5).add(new THREE.Vector3(0, height * 0.06, 0));
    parts.push(tube(new THREE.CatmullRomCurve3([trunkTop.clone(), mid, end]), 8, 6, (t) => 0.5 * (1 - 0.6 * t)));
  }
  for (const p of parts)
    shade(p, (pp, n, c, gl) => {
      c.copy(bark).lerp(barkDark, 0.5 + 0.5 * Math.sin(pp.y * 2.3 + pp.x * 1.7 + n.z));
      const vein = Math.pow(Math.max(0, Math.sin(pp.y * 1.3 + Math.atan2(pp.z, pp.x) * 4)), 30);
      gl.setRGB(0.15, 0.85, 0.7).multiplyScalar(vein * 0.6);
    });
  // Canopy: soft layered blobs, dark underneath, sunlit on top.
  const leafDark = C('#1f5a35'), leafMid = C('#2f8a46'), leafTop = C('#7cc34c');
  const canopyCentres: THREE.Vector3[] = [new THREE.Vector3(trunkTop.x, height * 0.92, trunkTop.z), ...crowns];
  for (const cc of canopyCentres) {
    const n = 2 + Math.floor(r() * 2);
    for (let k = 0; k < n; k++) {
      const s = height * (0.16 + r() * 0.08);
      const b = blob(1, s * 1.25, s * 0.55, s * 1.25, 0.18, Math.floor(r() * 1e6));
      b.translate(cc.x + (r() - 0.5) * s, cc.y + (r() - 0.3) * s * 0.5, cc.z + (r() - 0.5) * s);
      shade(b, (_p, nn, c) => {
        c.copy(leafDark).lerp(leafMid, THREE.MathUtils.smoothstep(nn.y, -0.6, 0.2)).lerp(leafTop, THREE.MathUtils.smoothstep(nn.y, 0.4, 0.95) * 0.8);
      });
      parts.push(b);
    }
  }
  // Hanging glowing aerial roots under the canopy.
  const rootCol = C('#7fe9d2');
  const nr = 34;
  for (let i = 0; i < nr; i++) {
    const cc = canopyCentres[Math.floor(r() * canopyCentres.length)];
    const s = height * 0.2;
    const x = cc.x + (r() - 0.5) * s * 2, z = cc.z + (r() - 0.5) * s * 2;
    const y0 = cc.y - s * 0.25;
    const len = height * (0.15 + r() * 0.35);
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, y0, z), new THREE.Vector3(x + (r() - 0.5) * 0.4, y0 - len * 0.5, z + (r() - 0.5) * 0.4),
      new THREE.Vector3(x + (r() - 0.5) * 0.6, y0 - len, z + (r() - 0.5) * 0.6),
    ]);
    const root = tube(curve, 4, 4, (t) => 0.09 * (1 - 0.7 * t));
    shade(root, (_p, _n, c, gl) => { c.copy(rootCol); gl.setRGB(0.25, 1.0, 0.8).multiplyScalar(0.75); });
    parts.push(root);
  }
  return merge(parts);
}

// ─────────────────────────── Rocks ───────────────────────────

export function sandstone(seed: number, size = 1): THREE.BufferGeometry {
  const r = rng(seed);
  const g = blob(2, 1.0 + r() * 0.5, 0.65 + r() * 0.35, 0.9 + r() * 0.4, 0.22, seed);
  const p = g.getAttribute('position') as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) if (p.getY(i) < -0.25) p.setY(i, -0.25 - (p.getY(i) + 0.25) * 0.15);
  g.computeVertexNormals();
  g.scale(size, size, size);
  const base = C('#efdcbc'), shadowed = C('#d8b48c'), vein = C('#b44f2c'), top = C('#f7ead2');
  const ph = r() * 10;
  shade(g, (pp, n, c) => {
    c.copy(base).lerp(shadowed, THREE.MathUtils.clamp(-n.y * 0.8 + 0.2, 0, 1)).lerp(top, THREE.MathUtils.smoothstep(n.y, 0.6, 1.0) * 0.6);
    const band = Math.sin(pp.y / size * 7 + ph + Math.sin(pp.x / size * 2.1) * 0.8);
    if (band > 0.86) c.lerp(vein, 0.8);
  });
  return g;
}

export function crystalCluster(seed: number): THREE.BufferGeometry {
  const r = rng(seed);
  const parts: THREE.BufferGeometry[] = [];
  const n = 4 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const h = 0.5 + r() * 0.9, w = 0.08 + r() * 0.08;
    const prism = new THREE.CylinderGeometry(w * 0.6, w, h, 6, 1);
    prism.translate(0, h / 2, 0);
    const tip = new THREE.ConeGeometry(w * 0.6, h * 0.35, 6);
    tip.translate(0, h + h * 0.175, 0);
    const g = merge([prism, tip]);
    g.rotateZ((r() - 0.5) * 0.9); g.rotateX((r() - 0.5) * 0.9);
    g.translate((r() - 0.5) * 0.3, 0, (r() - 0.5) * 0.3);
    shade(g, (_p, nn, c, gl) => { c.set('#bfeeff').lerp(C('#6cc8ff'), 0.5 - nn.y * 0.3); gl.setRGB(0.25, 0.75, 1.0).multiplyScalar(0.8); });
    parts.push(g);
  }
  return merge(parts);
}

// ─────────────────────────── Ground plants ───────────────────────────

function leaf(length: number, width: number, droop: number, segs = 5): THREE.BufferGeometry {
  const pos: number[] = [], idx: number[] = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs;
    const w = width * Math.sin(Math.PI * Math.min(1, t * 1.1 + 0.05)) * 0.5;
    const z = t * length;
    const y = Math.sin(t * Math.PI * 0.6) * length * 0.35 - droop * t * t * length;
    pos.push(-w, y, z, w, y, z, 0, y + w * 0.25, z);
  }
  for (let i = 0; i < segs; i++) {
    const a = i * 3, b = a + 3;
    idx.push(a, b, a + 2, a + 2, b, b + 2, a + 2, b + 2, a + 1, a + 1, b + 2, b + 1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

export function fernBush(seed: number, palette: 'green' | 'tropical' | 'ember'): THREE.BufferGeometry {
  const r = rng(seed);
  const parts: THREE.BufferGeometry[] = [];
  const n = 7 + Math.floor(r() * 4);
  const pal = {
    green: [C('#1f6b3a'), C('#5fbf4f')],
    tropical: [C('#14593b'), C('#2fa86a')],
    ember: [C('#8a3a1c'), C('#e98a3a')],
  }[palette];
  for (let i = 0; i < n; i++) {
    const L = 0.6 + r() * 0.7;
    const g = leaf(L, L * (palette === 'tropical' ? 0.55 : 0.35), 0.6 + r() * 0.5);
    g.rotateX(-0.5 - r() * 0.4);
    g.rotateY((i / n) * Math.PI * 2 + r() * 0.4);
    shade(g, (p, _n, c) => { c.copy(pal[0]).lerp(pal[1], THREE.MathUtils.clamp(p.y / 0.6 + 0.3, 0, 1)); });
    parts.push(g);
  }
  return merge(parts);
}

export function grassTuft(seed: number): THREE.BufferGeometry {
  const r = rng(seed);
  const pos: number[] = [], cols: number[] = [];
  const base = C('#3f7f2a'), tip = C('#c9df6a');
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = r() * 0.18;
    const x = Math.cos(a) * d, z = Math.sin(a) * d;
    const h = 0.35 + r() * 0.4, w = 0.035 + r() * 0.02;
    const lean = (r() - 0.5) * 0.25, lz = (r() - 0.5) * 0.25;
    const ry = r() * Math.PI;
    const cx = Math.cos(ry) * w, cz = Math.sin(ry) * w;
    pos.push(x - cx, 0, z - cz, x + cx, 0, z + cz, x + lean, h, z + lz);
    cols.push(base.r, base.g, base.b, base.r, base.g, base.b, tip.r, tip.g, tip.b);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  g.computeVertexNormals();
  // Grass looks best lit from above regardless of blade facing.
  const nor = g.getAttribute('normal') as THREE.BufferAttribute;
  for (let i = 0; i < nor.count; i++) nor.setXYZ(i, nor.getX(i) * 0.3, 1, nor.getZ(i) * 0.3);
  g.normalizeNormals();
  g.setAttribute('glow', new THREE.BufferAttribute(new Float32Array(nor.count * 3), 3));
  return g;
}

export function glowLotus(seed: number): THREE.BufferGeometry {
  const r = rng(seed);
  const parts: THREE.BufferGeometry[] = [];
  const petalCol = C('#fff3f6'), petalTip = C('#ffb8d2');
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? 8 : 6;
    for (let i = 0; i < n; i++) {
      const L = ring === 0 ? 0.42 : 0.3;
      const g = leaf(L, L * 0.6, -0.4, 4);
      g.rotateX(ring === 0 ? -1.0 : -1.35);
      g.rotateY((i / n) * Math.PI * 2 + ring * 0.3);
      g.translate(0, 0.08, 0);
      shade(g, (p, _n, c, gl) => {
        const t = THREE.MathUtils.clamp(Math.hypot(p.x, p.z) / L, 0, 1);
        c.copy(petalCol).lerp(petalTip, t * t);
        gl.setRGB(1.0, 0.75, 0.45).multiplyScalar(0.55 * (1 - t) + 0.12);
      });
      parts.push(g);
    }
  }
  const core = new THREE.SphereGeometry(0.07, 8, 6);
  core.translate(0, 0.12, 0);
  shade(core, (_p, _n, c, gl) => { c.set('#ffe9a8'); gl.setRGB(1.0, 0.8, 0.35).multiplyScalar(1.6); });
  parts.push(core);
  for (let i = 0; i < 3; i++) {
    const pad = new THREE.CircleGeometry(0.32 + r() * 0.12, 14, 0.4, Math.PI * 2 - 0.4);
    pad.rotateX(-Math.PI / 2);
    pad.translate(Math.cos(i * 2.1) * 0.45, 0.02, Math.sin(i * 2.1) * 0.45);
    shade(pad, (_p, _n, c) => c.set('#2f8f4a'));
    parts.push(pad);
  }
  return merge(parts);
}

export function steppingStone(seed: number): THREE.BufferGeometry {
  const r = rng(seed);
  const g = blob(1, 0.75 + r() * 0.2, 0.12, 0.5 + r() * 0.15, 0.08, seed);
  shade(g, (_p, n, c) => { c.set('#ecd6ae').lerp(C('#c9a77c'), THREE.MathUtils.clamp(-n.y, 0, 1)); });
  return g;
}

export { BLACK };

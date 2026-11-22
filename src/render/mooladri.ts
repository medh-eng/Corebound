// Mooladri, the Root Guardian (M4 slice 3), built in code from the Commander's trunk concept
// (art-inbox/concept/guardian_root_trunk.png): a broad, faceless, pale-wood trunk on buttress roots
// with a hollow at its foot, two unequal blunt boughs with three aerial roots each, and five uneven
// blunt crown tips. Its glow is a material (sap-white with a green cast), not lights, so phones keep
// their shader budget. Also here: the ring of living roots that closes the valley, the marks a
// seismic scan leaves over the roots, and the planting spots. Calmed, never fought.
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { Terrain } from '../core/terrain';
import type { Collider } from '../core/motion';
import type { Root } from '../systems/guardian';
import { rootPoints } from '../systems/guardian';
import { surfaceMatrix } from './scatter';
import { makeBeam } from './storyprops';
import { shared } from '../art/materials';

const BARK = new THREE.Color('#e6d6b6'), BARK_DARK = new THREE.Color('#b9a07a'), MOSS = new THREE.Color('#8fae46');
const COPPER = new THREE.Color('#b06a3a'), GLOW = new THREE.Color('#d8ffd9');

/** smoothstep in shader order (edge0, edge1, x); edge0 > edge1 gives a falling edge. */
const ss = (e0: number, e1: number, x: number) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };

/** Small deterministic noise for bark (no allocation). */
const n3 = (x: number, y: number, z: number) => Math.sin(x * 1.7 + y * 3.1) * Math.sin(y * 2.3 - z * 1.9) * Math.sin(z * 2.9 + x * 1.3);

/** Paints a vertex: pale bark, darker in the grooves, moss on top-facing wood, and glow along seams. */
function paint(p: THREE.Vector3, nrm: THREE.Vector3, seam: number, copper: number, col: THREE.Color): void {
  const groove = 0.5 + 0.5 * n3(p.x * 2.2, p.y * 0.8, p.z * 2.2);
  col.copy(BARK).lerp(BARK_DARK, groove * 0.55);
  const patch = n3(p.x * 0.9 + 3, p.y * 0.7, p.z * 0.9 - 1);
  const moss = Math.max(ss(0.3, 0.7, nrm.y + 0.25 * n3(p.x * 1.3, p.y * 1.1, p.z * 1.3)), ss(0.3, 0.65, patch) * 0.6 * ss(-0.2, 0.3, nrm.y + 0.3));
  col.lerp(MOSS, moss * 0.6);
  if (copper > 0) col.lerp(COPPER, copper);
  void seam;
}

/** A tube that narrows (or flares) along a curve: radius(t) for t 0..1, ends capped flat (blunt). */
function taperTube(curve: THREE.Curve<THREE.Vector3>, radius: (t: number) => number, glowAt: (t: number, u: number) => number, tubular = 18, radial = 10): THREE.BufferGeometry {
  const frames = curve.computeFrenetFrames(tubular, false);
  const pos: number[] = [], nor: number[] = [], col: number[] = [], glow: number[] = [], idx: number[] = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color();
  for (let i = 0; i <= tubular; i++) {
    const t = i / tubular;
    const center = curve.getPointAt(t);
    const r = radius(t);
    for (let j = 0; j <= radial; j++) {
      const u = j / radial, a = u * Math.PI * 2;
      const wob = 1 + 0.07 * n3(center.x + Math.cos(a) * 2, center.y * 1.3, center.z + Math.sin(a) * 2);
      n.copy(frames.normals[i]).multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i], Math.sin(a)).normalize();
      p.copy(center).addScaledVector(n, r * wob);
      pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      paint(p, n, 0, 0, c); col.push(c.r, c.g, c.b);
      glow.push(glowAt(t, u));
    }
  }
  for (let i = 0; i < tubular; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  // Flat end cap (the blunt, cut-looking tip); it glows with the tube's end glow.
  const end = curve.getPointAt(1), tan = curve.getTangentAt(1).normalize(), ci = pos.length / 3;
  pos.push(end.x, end.y, end.z); nor.push(tan.x, tan.y, tan.z); col.push(BARK.r, BARK.g, BARK.b); glow.push(glowAt(1, -1));
  for (let j = 0; j < radial; j++) {
    const a = tubular * (radial + 1) + j;
    idx.push(a, a + 1, ci);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aGlow', new THREE.Float32BufferAttribute(glow, 1));
  g.setIndex(idx);
  return g;
}

/** A thin glowing seam that runs along one side of a tube. */
const seamGlow = (side: number, strength = 0.75) => (t: number, u: number) => {
  if (u < 0) return 0;
  const d = Math.abs(((u - side - 0.04 * Math.sin(t * 9) + 1.5) % 1) - 0.5);
  return ss(0.05, 0.0, d) * strength * ss(0, 0.25, t);
};

/** The trunk: rings from the top of the buttresses to the crown, irregular and broad all the way up. */
function trunkGeometry(): THREE.BufferGeometry {
  const rings = 30, radial = 28, y0 = 1.8, y1 = 9.6;
  const pos: number[] = [], nor: number[] = [], col: number[] = [], glow: number[] = [], idx: number[] = [];
  const p = new THREE.Vector3(), n = new THREE.Vector3(), c = new THREE.Color();
  const seams = [0.6, 2.3, 3.9, 5.1];                                   // angles of the four glowing seams
  const rad = (y: number, a: number) => {
    const s = (y - y0) / (y1 - y0);
    const base = 1.7 + 1.1 * Math.exp(-s * 5) + 0.25 * (1 - s);
    return base * (1 + 0.09 * Math.sin(3 * a + y * 0.7) + 0.06 * Math.sin(5 * a - y * 1.3) + 0.04 * Math.sin(7 * a + 1));
  };
  for (let i = 0; i <= rings; i++) {
    const y = y0 + (i / rings) * (y1 - y0);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const r = rad(y, a);
      p.set(Math.sin(a) * r, y, Math.cos(a) * r);
      // Normal from neighbouring radii (good enough for painted wood).
      const dr = (rad(y, a + 0.05) - rad(y, a - 0.05)) / 0.1;
      n.set(Math.sin(a) - Math.cos(a) * dr / r, 0.12, Math.cos(a) + Math.sin(a) * dr / r).normalize();
      pos.push(p.x, p.y, p.z); nor.push(n.x, n.y, n.z);
      // The copper seam in the bark runs up the front (facing the base), as in the concept.
      const cop = ss(0.09, 0.0, Math.abs(a - 0.25 - 0.18 * Math.sin(y * 0.9) - (a > Math.PI ? Math.PI * 2 : 0))) * ss(2.5, 4, y);
      paint(p, n, 0, cop * 0.85, c); col.push(c.r, c.g, c.b);
      let g = 0;
      for (const sa of seams) {
        const d = Math.abs(((a - sa - 0.35 * Math.sin(y * 0.55 + sa) + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
        g = Math.max(g, ss(0.07, 0.0, d));
      }
      glow.push(g * 0.7 * ss(2.4, 4.5, y));
    }
  }
  for (let i = 0; i < rings; i++) for (let j = 0; j < radial; j++) {
    const a = i * (radial + 1) + j, b = a + radial + 1;
    idx.push(a, b, a + 1, b, b + 1, a + 1);
  }
  // Caps: the underside is the roof of the hollow; the top is hidden by the crown tips.
  for (const [ring, y, ny] of [[0, y0, -1], [rings, y1, 1]] as const) {
    const ci = pos.length / 3;
    pos.push(0, y, 0); nor.push(0, ny, 0); col.push(BARK_DARK.r * 0.6, BARK_DARK.g * 0.6, BARK_DARK.b * 0.6); glow.push(0);
    for (let j = 0; j < radial; j++) {
      const a = ring * (radial + 1) + j;
      if (ny < 0) idx.push(a, ci, a + 1); else idx.push(a, a + 1, ci);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('aGlow', new THREE.Float32BufferAttribute(glow, 1));
  g.setIndex(idx);
  return g;
}

/** Wood with glowing seams: a standard material plus an extra emissive term from `aGlow`. */
function guardianMaterial(uGlow: { value: number }): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88, metalness: 0 });
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uGlow = uGlow;
    sh.uniforms.uGlowColor = { value: GLOW };
    sh.uniforms.uNight = shared.uNight;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float aGlow;\nvarying float vGlow;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvGlow = aGlow;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uGlow;\nuniform vec3 uGlowColor;\nuniform float uNight;\nvarying float vGlow;')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += uGlowColor * vGlow * uGlow * (1.6 + 2.0 * uNight);');
  };
  return m;
}

export interface MooladriView {
  group: THREE.Group;
  /** Where the trunk stands (on the ground), the way it faces (towards the base) and its local axes. */
  point: THREE.Vector3; up: THREE.Vector3; front: THREE.Vector3; side: THREE.Vector3;
  colliders: Collider[];
  gateColliders: Collider[];
  /** Where you can walk into the valley once it opens (the gate's centre). */
  gatePoint: THREE.Vector3;
  valleyPoint: THREE.Vector3;
  plantPoints: THREE.Vector3[];
  /** 0 = resting in the ground .. 1 = fully risen. */
  setRise(x: number): void;
  setGlow(x: number): void;
  setGateOpen(x: number): void;
  setRoots(roots: Root[]): void;
  /** 0..1: how much of the root map shows (it spreads out from the trunk). */
  setRootReveal(x: number): void;
  setPlantSpots(visible: boolean, planted: number[]): void;
  setBeam(on: boolean): void;
  update(t: number, restless: boolean): void;
  /** A point d metres from the trunk along the ground: forward towards the base, right to its right. */
  at(forward: number, right: number): THREE.Vector3;
}

export function buildMooladri(terrain: Terrain, dir: THREE.Vector3, toward: THREE.Vector3, opts: { restSink: number; gate: { back: number; width: number; arches: number }; plantSpots: number; plantRadius: number }): MooladriView {
  const R = terrain.radius;
  const ground = (d: THREE.Vector3) => terrain.groundRadius({ x: d.x, y: d.y, z: d.z });
  const up = dir.clone().normalize();
  const point = up.clone().multiplyScalar(ground(up));
  const front = toward.clone().sub(point); front.addScaledVector(up, -front.dot(up)).normalize();
  const side = new THREE.Vector3().crossVectors(up, front).normalize();
  const at = (fw: number, rt: number) => up.clone().multiplyScalar(R).addScaledVector(front, fw).addScaledVector(side, rt).normalize();
  const onGround = (d: THREE.Vector3, h = 0) => d.clone().multiplyScalar(ground(d) + h);

  const group = new THREE.Group();
  group.name = 'mooladri';
  const uGlow = { value: 0.2 };
  const mat = guardianMaterial(uGlow);

  // ── The body, in its own frame (y up, +z towards the base) ──
  const parts: THREE.BufferGeometry[] = [trunkGeometry()];
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  const polar = (deg: number, r: number, y: number) => V(Math.sin((deg * Math.PI) / 180) * r, y, Math.cos((deg * Math.PI) / 180) * r);
  // Six buttress roots, spread so the gaps between them stay walkable (Sarvam's note: 1.5 m or more).
  const finAngles = [32, 88, 148, 205, 262, 322];
  const finEnds: THREE.Vector3[] = [];
  finAngles.forEach((deg, i) => {
    const reach = 5.2 + (i % 3) * 0.5;
    const c = new THREE.CatmullRomCurve3([polar(deg, 1.4, 4.4), polar(deg + 4, 2.9, 2.4), polar(deg + 7, 4.2, 0.6), polar(deg + 9, reach, -1.0)]);
    parts.push(taperTube(c, (t) => 1.05 - 0.6 * t, seamGlow(0.1 + i * 0.13, 0.5), 16, 10));
    finEnds.push(polar(deg + 9, reach - 0.6, 0));
  });
  // Two unequal blunt boughs: the longer one lower on the left, the shorter one higher on the right.
  const boughs = [
    { pts: [polar(-90, 1.0, 6.0), polar(-90, 3.2, 6.4), polar(-86, 5.4, 6.3), polar(-84, 7.0, 5.9)], r0: 0.9, r1: 0.62, len: 7.0 },
    { pts: [polar(96, 1.0, 7.7), polar(96, 2.6, 8.15), polar(100, 4.6, 8.0)], r0: 0.75, r1: 0.52, len: 4.6 },
  ];
  const aerialBottoms: THREE.Vector3[] = [];
  boughs.forEach((b, bi) => {
    const curve = new THREE.CatmullRomCurve3(b.pts);
    parts.push(taperTube(curve, (t) => b.r0 + (b.r1 - b.r0) * t, seamGlow(0.25 + bi * 0.3, 0.8), 18, 12));
    // Three thick, stiff, tapering aerial roots from each bough, each reaching the ground.
    const along = bi === 0 ? [0.42, 0.68, 0.94] : [0.38, 0.66, 0.95];
    const spread = bi === 0 ? [-1.0, 0.9, -0.5] : [1.2, -1.1, 0.6];
    along.forEach((f, k) => {
      const top = curve.getPointAt(f).add(V(0, -0.35, 0));
      const out = top.clone().setY(0).normalize();
      const sideways = V(-out.z, 0, out.x).multiplyScalar(spread[k]);
      const bottom = top.clone().setY(-1.0).addScaledVector(out, 0.5 + k * 0.25).add(sideways);
      const mid = top.clone().lerp(bottom, 0.5).addScaledVector(out, 0.15);
      parts.push(taperTube(new THREE.CatmullRomCurve3([top, mid, bottom]), (t) => (0.34 - 0.1 * t) + 0.32 * Math.pow(Math.max(0, (t - 0.8) / 0.2), 2), seamGlow(0.5, 0.45), 12, 8));
      aerialBottoms.push(bottom.clone().setY(0));
    });
  });
  // Five uneven, blunt crown tips with softly glowing cut ends (no single bright centre).
  const tips = [[20, 0.7, 12.0, 0.55], [140, 0.9, 11.0, 0.5], [250, 0.8, 10.4, 0.48], [310, 0.4, 10.9, 0.42], [80, 0.95, 10.1, 0.45]] as const;
  for (const [deg, r, top, rr] of tips) {
    const c = new THREE.CatmullRomCurve3([polar(deg, r * 0.7, 9.0), polar(deg + 6, r, (9.0 + top) / 2), polar(deg + 10, r * 1.15, top)]);
    parts.push(taperTube(c, (t) => rr - 0.12 * t, (t, u) => (u < 0 ? 1 : ss(0.75, 1, t) * 0.8 + seamGlow(0.3, 0.5)(t, u)), 10, 10));
  }
  const geo = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  geo.computeBoundingSphere();
  const mesh = new THREE.Mesh(geo, mat);
  mesh.castShadow = true; mesh.receiveShadow = true;
  const body = new THREE.Group();
  body.add(mesh);
  const holder = new THREE.Group();
  holder.add(body);
  holder.applyMatrix4(surfaceMatrix(terrain, up, 0, 1, 0, 0, front));
  group.add(holder);

  const toWorld = (v: THREE.Vector3) => v.clone().applyMatrix4(holder.matrix);
  const colliders: Collider[] = [
    { pos: toWorld(V(0, 0, 0)), radius: 2.9 },
    ...finEnds.map((p) => ({ pos: toWorld(p), radius: 0.7 })),
    ...aerialBottoms.map((p) => ({ pos: toWorld(p), radius: 0.45 })),
  ].map((c) => ({ pos: { x: c.pos.x, y: c.pos.y, z: c.pos.z }, radius: c.radius }));

  // ── The valley behind it, ringed by living roots; the gate faces the trunk ──
  const vCenter = at(-(opts.gate.back + 7), 0);
  const valleyPoint = onGround(vCenter);
  const ringR = 7.5;
  const ringParts: THREE.BufferGeometry[] = [], gateParts: THREE.BufferGeometry[] = [];
  const gateColliders: Collider[] = [], ringColliders: Collider[] = [];
  const vUp = vCenter.clone();
  const vFront = front.clone().addScaledVector(vUp, -front.dot(vUp)).normalize();
  const vSide = new THREE.Vector3().crossVectors(vUp, vFront).normalize();
  const ringAt = (ang: number, rr = ringR) => vUp.clone().multiplyScalar(R).addScaledVector(vFront, Math.cos(ang) * rr).addScaledVector(vSide, Math.sin(ang) * rr).normalize();
  const arches = 11;
  for (let k = 0; k < arches; k++) {
    // Each arch spans a little more than its share of the ring so they overlap into a closed fence.
    const a0 = (k / arches) * Math.PI * 2 - 0.42, a1 = ((k + 1) / arches) * Math.PI * 2 + 0.42;
    const isGate = k === 0 || k === arches - 1;                         // the two arches facing the trunk
    const h = 2.6 + ((k * 37) % 10) / 10;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 6; i++) {
      const f = i / 6, d = ringAt(a0 + (a1 - a0) * f, ringR + Math.sin(f * Math.PI) * 0.6 * ((k % 2) ? 1 : -1));
      pts.push(onGround(d, -0.8 + (h + 0.8) * Math.sin(f * Math.PI)));
    }
    const g = taperTube(new THREE.CatmullRomCurve3(pts), (t) => 0.55 - 0.18 * Math.sin(t * Math.PI), seamGlow(0.2 + k * 0.07, 0.45), 20, 8);
    (isGate ? gateParts : ringParts).push(g);
    const into = isGate ? gateColliders : ringColliders;
    for (let s = 0; s <= 8; s++) {
      const d = ringAt(a0 + ((a1 - a0) * s) / 8);
      const p = onGround(d);
      if (!into.some((c) => Math.hypot(c.pos.x - p.x, c.pos.y - p.y, c.pos.z - p.z) < 0.9)) into.push({ pos: { x: p.x, y: p.y, z: p.z }, radius: 0.8 });
    }
  }
  const ringMesh = new THREE.Mesh(mergeGeometries(ringParts), mat);
  const gateMesh = new THREE.Mesh(mergeGeometries(gateParts), mat);
  ringMesh.castShadow = gateMesh.castShadow = true;
  ringParts.forEach((p) => p.dispose()); gateParts.forEach((p) => p.dispose());
  group.add(ringMesh, gateMesh);
  colliders.push(...ringColliders);
  const gatePoint = onGround(ringAt(0));

  // ── Root marks: glowing lines on the ground where a seismic scan found living roots ──
  const markMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uReveal: { value: 0 }, uTime: shared.uTime, uColor: { value: new THREE.Color('#b9ffb0') } },
    vertexShader: 'attribute float aT; attribute float aU; varying float vT; varying float vU; void main(){ vT = aT; vU = aU; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uReveal; uniform float uTime; uniform vec3 uColor; varying float vT; varying float vU;\n' +
      'void main(){ float shown = smoothstep(uReveal + 0.02, uReveal - 0.08, vT); float edge = 1.0 - abs(vU * 2.0 - 1.0);\n' +
      ' float pulse = 0.55 + 0.45 * sin(vT * 40.0 - uTime * 3.0); float a = shown * smoothstep(0.0, 0.6, edge) * (0.35 + 0.4 * pulse);\n' +
      ' gl_FragColor = vec4(uColor * a, a); }',
  });
  const marks = new THREE.Mesh(new THREE.BufferGeometry(), markMat);
  marks.frustumCulled = false; marks.renderOrder = 2; marks.visible = false;
  group.add(marks);

  // ── Planting spots round the foot, between the buttresses ──
  const plantPoints: THREE.Vector3[] = [];
  const spotMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: shared.uTime, uColor: { value: new THREE.Color('#ffc6ea') } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform float uTime; uniform vec3 uColor; varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float ring = smoothstep(0.75, 0.9, d) * smoothstep(1.0, 0.9, d); float core = smoothstep(0.5, 0.0, d) * 0.35; float a = (ring + core) * (0.6 + 0.4 * sin(uTime * 2.4)); gl_FragColor = vec4(uColor * a, a); }',
  });
  const spots: THREE.Mesh[] = [], flowers: THREE.Group[] = [];
  const petal = new THREE.MeshStandardMaterial({ color: '#ff9ad5', emissive: '#ff5fb8', emissiveIntensity: 1.2, roughness: 0.5, side: THREE.DoubleSide });
  for (let i = 0; i < opts.plantSpots; i++) {
    const deg = finAngles[i * 2] + 28;                                    // half-way between two buttresses
    const p = toWorld(polar(deg, opts.plantRadius, 0));
    const d = p.clone().normalize();
    plantPoints.push(onGround(d));
    const spot = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6).rotateX(-Math.PI / 2), spotMat);
    spot.applyMatrix4(surfaceMatrix(terrain, d, 0, 1, -0.06));
    spot.visible = false; spot.renderOrder = 2;
    const fl = new THREE.Group();
    for (let k = 0; k < 3; k++) {
      const stem = new THREE.Group();
      for (let q = 0; q < 6; q++) {
        const pe = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 5).scale(0.45, 0.12, 1).translate(0, 0, 0.15), petal);
        pe.rotation.set(-0.5, (q / 6) * Math.PI * 2, 0, 'YXZ');
        stem.add(pe);
      }
      stem.position.set(Math.cos(k * 2.1) * 0.35, 0.45 + k * 0.08, Math.sin(k * 2.1) * 0.35);
      fl.add(stem);
    }
    fl.applyMatrix4(surfaceMatrix(terrain, d, i, 1, 0.02));
    fl.visible = false;
    spots.push(spot); flowers.push(fl);
    group.add(spot, fl);
  }

  // A tall pale-green beam over the crown, so you can find it from the base on this small world.
  const beam = makeBeam('#b9ffb0', 34);
  beam.applyMatrix4(surfaceMatrix(terrain, up, 0, 1, 0));
  beam.visible = false;
  group.add(beam);
  let beamOn = false, beamAmt = 0;

  let rise = 0, gateOpen = 0;
  const apply = () => { body.position.y = -opts.restSink * (1 - rise); };
  apply();
  return {
    group, point, up, front, side, colliders, gateColliders, gatePoint, valleyPoint, plantPoints, at,
    setRise(x) { rise = THREE.MathUtils.clamp(x, 0, 1); apply(); },
    setGlow(x) { uGlow.value = x; },
    setGateOpen(x) {
      gateOpen = THREE.MathUtils.clamp(x, 0, 1);
      gateMesh.position.copy(vUp).multiplyScalar(-4.2 * gateOpen);
      gateMesh.visible = gateOpen < 0.999;
    },
    setRoots(roots) {
      const pos: number[] = [], tAttr: number[] = [], uAttr: number[] = [], idx: number[] = [];
      for (const r of roots) {
        const pts = rootPoints(r, R, 0.8);
        const total = pts.length - 1;
        const base = pos.length / 3;
        pts.forEach((p, i) => {
          const d = new THREE.Vector3(p.x, p.y, p.z);
          const nxt = pts[Math.min(total, i + 1)], prv = pts[Math.max(0, i - 1)];
          const tan = new THREE.Vector3(nxt.x - prv.x, nxt.y - prv.y, nxt.z - prv.z).normalize();
          const w = new THREE.Vector3().crossVectors(d, tan).normalize().multiplyScalar(0.28 * (1 - 0.5 * (i / total)) + 0.1);
          const c = onGround(d, 0.07);
          for (const s of [-1, 1]) { pos.push(c.x + w.x * s, c.y + w.y * s, c.z + w.z * s); tAttr.push(i / total); uAttr.push(s < 0 ? 0 : 1); }
          if (i < total) { const a = base + i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
        });
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('aT', new THREE.Float32BufferAttribute(tAttr, 1));
      g.setAttribute('aU', new THREE.Float32BufferAttribute(uAttr, 1));
      g.setIndex(idx);
      marks.geometry.dispose();
      marks.geometry = g;
    },
    setRootReveal(x) { markMat.uniforms.uReveal.value = x * 1.1; marks.visible = x > 0.001; },
    setPlantSpots(visible, planted) {
      spots.forEach((s, i) => { s.visible = visible && !planted.includes(i); });
      flowers.forEach((f, i) => { f.visible = planted.includes(i); });
    },
    setBeam(on) { beamOn = on; },
    update(t, restless) {
      // Restless: a slow, uneasy lean and a tightening of the roots; calm: almost still.
      const amp = restless ? 0.012 : 0.003;
      body.rotation.set(Math.sin(t * 0.7) * amp, 0, Math.sin(t * 0.53 + 1) * amp);
      flowers.forEach((f, i) => { if (f.visible) f.children.forEach((c, k) => c.rotation.y = t * 0.3 + i + k); });
      beamAmt += ((beamOn ? 0.8 + 0.2 * Math.sin(t * 1.5) : 0) - beamAmt) * 0.05;
      (beam.material as THREE.ShaderMaterial).uniforms.uAmount.value = beamAmt;
      beam.visible = beamAmt > 0.01;
    },
  };
}

// Story props (M4 slice 2): Prof. Huxley's projector and the translator by the escape module's
// hatch, and the Custodian's memory logs scattered by the crash. Each stands under a soft beam of
// light (no real lights, so phones keep their shader budget) until it has been used.
import * as THREE from 'three';
import type { Terrain } from '../core/terrain';
import { loadModel } from './assets';
import { surfaceMatrix } from './scatter';

export type PropKind = 'projector' | 'translator' | 'log';

export interface StoryProp {
  id: string;            // 'projector', 'translator' or a log id such as 'log_03'
  kind: PropKind;
  point: THREE.Vector3;  // on the ground, where the prop stands
  group: THREE.Group;
  beam: THREE.Mesh;
  /** True once used: the beam goes out (and the translator leaves the ground). */
  done: boolean;
}

export interface PropSpot { id: string; kind: PropKind; dir: THREE.Vector3; yawDeg: number; scale: number; sink: number }

const BEAM_COLOR: Record<PropKind, string> = { projector: '#ffd27a', translator: '#9fffe0', log: '#7cc8ff' };

/** A soft column of light, brightest at the ground and fading upwards. */
function makeBeam(color: string, height: number): THREE.Mesh {
  const geo = new THREE.CylinderGeometry(0.16, 0.3, height, 14, 1, true);
  geo.translate(0, height / 2, 0);
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color(color) }, uAmount: { value: 1 }, uHeight: { value: height } },
    vertexShader: 'varying float vH; uniform float uHeight; void main(){ vH = position.y / uHeight; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying float vH; uniform vec3 uColor; uniform float uAmount; void main(){ float a = pow(1.0 - vH, 2.2) * 0.7 * uAmount; gl_FragColor = vec4(uColor * a, a); }',
  });
  const m = new THREE.Mesh(geo, mat);
  m.renderOrder = 2;
  m.frustumCulled = false;
  return m;
}

/** Moves a spot to the nearest dry ground (spiralling out in small steps) if it lies under water. */
export function dryGround(terrain: Terrain, dir: THREE.Vector3, up: THREE.Vector3): THREE.Vector3 {
  const dry = (d: THREE.Vector3) => terrain.height(d.x, d.y, d.z) > terrain.seaLevel + 0.4;
  if (dry(dir)) return dir.clone();
  const t1 = new THREE.Vector3().crossVectors(up, dir).normalize();
  const t2 = new THREE.Vector3().crossVectors(dir, t1).normalize();
  const R = terrain.radius;
  for (let ring = 1; ring <= 20; ring++) {
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      const d = dir.clone().multiplyScalar(R).addScaledVector(t1, Math.cos(a) * ring * 1.5).addScaledVector(t2, Math.sin(a) * ring * 1.5).normalize();
      if (dry(d)) return d;
    }
  }
  return dir.clone();
}

export async function buildStoryProps(terrain: Terrain, spots: PropSpot[], facing: THREE.Vector3): Promise<{ group: THREE.Group; props: StoryProp[]; update(t: number): void }> {
  const group = new THREE.Group();
  group.name = 'story_props';
  const tryLoad = async (n: string) => { try { return await loadModel(n); } catch { return null; } };
  const [projector, translator, log] = await Promise.all([tryLoad('huxley_projector'), tryLoad('translator'), tryLoad('memory_log')]);
  const source: Record<PropKind, THREE.Group | null> = { projector, translator, log };
  const props: StoryProp[] = [];

  for (const s of spots) {
    const g = new THREE.Group();
    g.name = s.id;
    const point = s.dir.clone().multiplyScalar(terrain.groundRadius(s.dir));
    const model = source[s.kind]?.clone(true);
    const holder = new THREE.Group();
    if (model) {
      holder.add(model);
      model.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        // A faint glow of its own, so a small thing still catches the eye at dusk.
        const mat = (m.material as THREE.MeshStandardMaterial).clone();
        if (mat.emissive) { mat.emissive = new THREE.Color(BEAM_COLOR[s.kind]); mat.emissiveIntensity = 0.12; }
        m.material = mat;
      });
    } else {
      // No model file: a plain glowing box keeps the story playable.
      holder.add(new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.12, 0.28), new THREE.MeshStandardMaterial({ color: '#33475c', emissive: BEAM_COLOR[s.kind], emissiveIntensity: 0.6 })));
    }
    const face = facing.clone().sub(point);
    holder.applyMatrix4(surfaceMatrix(terrain, s.dir, (s.yawDeg * Math.PI) / 180, s.scale, s.sink, 0.7, face));
    g.add(holder);
    const beam = makeBeam(BEAM_COLOR[s.kind], s.kind === 'log' ? 3.2 : 2.4);
    beam.applyMatrix4(surfaceMatrix(terrain, s.dir, 0, 1, 0.05));
    g.add(beam);
    group.add(g);
    props.push({ id: s.id, kind: s.kind, point, group: g, beam, done: false });
  }

  return {
    group,
    props,
    update(t: number) {
      props.forEach((p, i) => {
        const u = (p.beam.material as THREE.ShaderMaterial).uniforms.uAmount;
        const target = p.done ? 0 : 0.65 + 0.35 * Math.sin(t * 1.8 + i * 1.3);
        u.value += (target - u.value) * 0.08;
        p.beam.visible = u.value > 0.01;
      });
    },
  };
}

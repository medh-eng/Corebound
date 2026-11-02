// The crash site (M4 slice 1): the Commander's escape module, tilted in a scorched hollow, and the
// cryo-pod you wake in, slid half out of its hatch. Steam hisses from the pod during the wake-up.
import * as THREE from 'three';
import type { Terrain } from '../core/terrain';
import { loadModel } from './assets';
import { surfaceMatrix } from './scatter';
import { chimneySmoke } from '../art/smoke';

interface Placement { yawDeg: number; tiltDeg: number; scale: number; sink: number }

export interface CrashSite {
  group: THREE.Group;
  /** Steam from the pod: 1 at the wake-up, fading to a faint wisp. */
  setSteam(amount: number): void;
  /** A point a little above the pod, for the opening camera to look at. */
  focus: THREE.Vector3;
}

/** `towards` is where the hatch and the pod face (the spot where you stand). */
export async function buildCrashSite(
  terrain: Terrain,
  moduleDir: THREE.Vector3, modulePlace: Placement,
  podDir: THREE.Vector3, podPlace: Placement,
  towards: THREE.Vector3,
): Promise<CrashSite> {
  const group = new THREE.Group();
  group.name = 'crash_site';

  const place = (obj: THREE.Object3D, dir: THREE.Vector3, p: Placement) => {
    const at = dir.clone().multiplyScalar(terrain.groundRadius ? terrain.groundRadius(dir) : terrain.radius);
    const face = towards.clone().sub(at);
    obj.applyMatrix4(surfaceMatrix(terrain, dir, (p.yawDeg * Math.PI) / 180, p.scale, p.sink, 0.6, face));
    // Lean it over sideways, as if it rolled when it landed.
    if (p.tiltDeg) {
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(obj.quaternion).normalize();
      const pivot = obj.position.clone();
      obj.position.sub(pivot);
      obj.applyQuaternion(new THREE.Quaternion().setFromAxisAngle(fwd, (p.tiltDeg * Math.PI) / 180));
      obj.position.add(pivot);
    }
  };

  const tryLoad = async (n: string) => { try { return await loadModel(n); } catch { return null; } };
  const [mod, pod] = await Promise.all([tryLoad('escape_module'), tryLoad('cryo_pod')]);
  if (mod) { const g = new THREE.Group(); g.add(mod); place(g, moduleDir, modulePlace); group.add(g); }
  if (pod) { const g = new THREE.Group(); g.add(pod); place(g, podDir, podPlace); group.add(g); }
  group.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });

  // Scorched ground: a dark, soft disc under the module (no texture needed).
  const scorchMat = new THREE.MeshBasicMaterial({ color: '#1b1410', transparent: true, opacity: 0.45, depthWrite: false });
  scorchMat.onBeforeCompile = (sh) => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <dithering_fragment>', '#include <dithering_fragment>\n  gl_FragColor.a *= smoothstep(1.0, 0.35, length(vUv - 0.5) * 2.0);');
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vUv;').replace('#include <uv_vertex>', '#include <uv_vertex>\nvUv = uv;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec2 vUv;');
  };
  const scorch = new THREE.Mesh(new THREE.CircleGeometry(4.2, 32), scorchMat);
  scorch.rotation.x = -Math.PI / 2;
  const sGroup = new THREE.Group();
  sGroup.add(scorch);
  sGroup.applyMatrix4(surfaceMatrix(terrain, moduleDir, 0, 1, -0.06, 1));
  scorch.renderOrder = 1;
  group.add(sGroup);

  // Steam from the pod.
  const podAt = podDir.clone().multiplyScalar(terrain.radius + terrain.height(podDir.x, podDir.y, podDir.z));
  const up = podDir.clone();
  const steam = chimneySmoke(22);
  const sm = steam.material as THREE.ShaderMaterial;
  sm.uniforms.uRise = { value: 2.4 };
  sm.uniforms.uAmount = { value: 1 };
  sm.vertexShader = sm.vertexShader.replace('(40.0 + life * 220.0)', '(18.0 + life * 95.0)').replace('life * life * 2.5', 'life * life * 0.8').replace('life * 1.4', 'life * 0.5').replace('life * 1.2', 'life * 0.5');
  sm.fragmentShader = sm.fragmentShader.replace('uniform float uNight;', 'uniform float uNight; uniform float uAmount;').replace('* vA * 0.45;', '* vA * 0.6 * uAmount;');
  const sGrp = new THREE.Group();
  sGrp.position.copy(podAt.clone().addScaledVector(up, 1.0));
  sGrp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up);
  sGrp.add(steam);
  group.add(sGrp);

  return {
    group,
    setSteam: (a: number) => { sm.uniforms.uAmount.value = a; steam.visible = a > 0.01; },
    focus: podAt.clone().addScaledVector(up, 0.9),
  };
}

// Machines you craft and place: battery and electrolyzer are built in code; the solar lotus uses your model.
import * as THREE from 'three';
import type { MachineId } from '../data/items';
import { loadModel } from './assets';

const ceramic = () => new THREE.MeshStandardMaterial({ color: '#f2eadb', roughness: 0.5, envMapIntensity: 0.45 });
const copper = () => new THREE.MeshStandardMaterial({ color: '#c8794a', roughness: 0.32, metalness: 0.85 });

export interface MachineView { root: THREE.Group; setLevel?: (v: number) => void; setActive?: (on: boolean) => void }

function battery(): MachineView {
  const root = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.25, 0.8, 1, 1, 1), ceramic());
  body.position.y = 0.72;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.8, 0.12, 24), copper());
  base.position.y = 0.06;
  const cap = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.1, 0.86), copper());
  cap.position.y = 1.39;
  root.add(body, base, cap);
  for (const x of [-0.53, 0.53]) for (let k = 0; k < 4; k++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.7), copper());
    rib.position.set(x, 0.35 + k * 0.25, 0);
    root.add(rib);
  }
  const meterBack = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.9, 0.04), new THREE.MeshStandardMaterial({ color: '#1c2a2e' }));
  meterBack.position.set(0, 0.72, 0.41);
  const meterMat = new THREE.MeshStandardMaterial({ color: '#5cffd6', emissive: '#5cffd6', emissiveIntensity: 2.2 });
  const meter = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.84, 0.03).translate(0, 0.42, 0), meterMat);
  meter.position.set(0, 0.3, 0.43);
  root.add(meterBack, meter);
  root.traverse((o) => { o.castShadow = true; o.receiveShadow = true; });
  return { root, setLevel: (v) => { meter.scale.y = Math.max(0.02, v); meterMat.emissiveIntensity = 0.6 + 2 * v; } };
}

function electrolyzer(): MachineView {
  const root = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.25, 28), copper());
  base.position.y = 0.12;
  const deck = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.08, 28), ceramic());
  deck.position.y = 0.29;
  root.add(base, deck);
  const glass = new THREE.MeshPhysicalMaterial({ color: '#cfefff', roughness: 0.05, transmission: 0, transparent: true, opacity: 0.35, envMapIntensity: 1.2 });
  const fluids: THREE.MeshStandardMaterial[] = [];
  for (const [x, col] of [[-0.32, '#5cc8ff'], [0.32, '#e8f2ff']] as const) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 1.0, 20), glass);
    tank.position.set(x, 0.85, 0);
    const fm = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.3, transparent: true, opacity: 0.85 });
    fluids.push(fm);
    const fluid = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.75, 20), fm);
    fluid.position.set(x, 0.75, 0);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.035, 8, 24), copper());
    ring.rotation.x = Math.PI / 2; ring.position.set(x, 1.36, 0);
    root.add(tank, fluid, ring);
  }
  const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.14, 0.4, 16), copper());
  hopper.position.set(0, 0.6, -0.45);
  const pipe = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.05, 8, 20, Math.PI), copper());
  pipe.position.set(0, 1.36, 0);
  root.add(hopper, pipe);
  root.traverse((o) => { o.castShadow = true; o.receiveShadow = true; });
  return {
    root,
    setActive: (on) => { for (const f of fluids) f.emissiveIntensity = on ? 1.6 + Math.sin(performance.now() / 120) * 0.4 : 0.25; },
  };
}

const models = new Map<MachineId, THREE.Group>();

/** Loads the owner's machine models; any that are missing fall back to code-built versions. */
export async function preloadMachines() {
  for (const id of ['solar_lotus', 'battery', 'electrolyzer', 'smelter'] as MachineId[]) {
    try { models.set(id, await loadModel(id)); } catch { /* fallback below */ }
  }
}

function fromModel(id: MachineId): MachineView | null {
  const m = models.get(id);
  if (!m) return null;
  const root = new THREE.Group();
  const copy = m.clone();
  copy.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.2; });
  root.add(copy);
  // A light that shows the machine is working (inside tanks, furnace mouth, charge meter).
  const light = new THREE.PointLight(id === 'smelter' ? '#ff8a3a' : '#5cffd6', 0, id === 'smelter' ? 6 : 3.5, 2);
  light.position.set(0, id === 'smelter' ? 0.7 : 0.8, id === 'smelter' ? 0.9 : 0.55);
  root.add(light);
  return {
    root,
    setActive: (on) => { light.intensity = on ? (id === 'smelter' ? 6 + Math.sin(performance.now() / 90) * 1.5 : 2.5) : 0; },
    setLevel: (v) => { light.intensity = 0.3 + 2.2 * v; },
  };
}

export function buildMachine(id: MachineId): MachineView {
  const fromArt = fromModel(id);
  if (fromArt) return fromArt;
  if (id === 'battery') return battery();
  if (id === 'electrolyzer') return electrolyzer();
  const root = new THREE.Group();
  root.add(new THREE.Mesh(new THREE.ConeGeometry(0.8, 2, 8), new THREE.MeshStandardMaterial({ color: '#334' })));
  return { root };
}

/** A see-through copy used while choosing where to place a machine. */
export function ghostOf(view: MachineView): THREE.Group {
  const g = view.root;
  const mat = new THREE.MeshBasicMaterial({ color: '#5cffd6', transparent: true, opacity: 0.35, depthWrite: false });
  g.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh) { m.material = mat; m.castShadow = false; } if ((o as THREE.Light).isLight) o.visible = false; });
  g.userData.ghostMat = mat;
  return g;
}

// Machines you craft and place: owner models where they exist; battery, electrolyzer and pylon also have code-built versions.
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
export let conveyorModel: THREE.Group | null = null;

// Where each model's working light sits, and its colour.
const LIGHTS: Partial<Record<MachineId, { color: string; y: number; z: number; range: number; on: number; flicker?: boolean }>> = {
  smelter: { color: '#ff8a3a', y: 0.7, z: 0.9, range: 6, on: 6, flicker: true },
  coal_burner: { color: '#ff7a2a', y: 0.8, z: 0.9, range: 6, on: 5, flicker: true },
  silicon_furnace: { color: '#fff1d0', y: 1.3, z: 0.6, range: 5, on: 4, flicker: true },
  auto_drill: { color: '#ffb347', y: 1.4, z: 0.7, range: 4, on: 2.5 },
  research_station: { color: '#5cffd6', y: 1.9, z: 0.2, range: 4, on: 3 },
  storage_silo: { color: '#ffcf6a', y: 2.0, z: 0.9, range: 3, on: 1.5 },
};

/** A copper power pylon with a ceramic lotus top and an amber lamp. */
function pylon(): MachineView {
  const root = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.12, 4.0, 10), copper());
  pole.position.y = 2.0;
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.4, 0.2, 16), ceramic());
  foot.position.y = 0.1;
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.07, 0.07), copper());
  arm.position.y = 3.75;
  root.add(pole, foot, arm);
  for (const x of [-0.5, 0.5]) {
    const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.18, 8), ceramic());
    ins.position.set(x, 3.88, 0);
    root.add(ins);
  }
  const petals = new THREE.Group();
  for (let i = 0; i < 6; i++) {
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6).scale(0.55, 1.2, 0.3), ceramic());
    const a = (i / 6) * Math.PI * 2;
    p.position.set(Math.cos(a) * 0.12, 4.15, Math.sin(a) * 0.12);
    p.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    petals.add(p);
  }
  const lampMat = new THREE.MeshStandardMaterial({ color: '#ffcf6a', emissive: '#ffb347', emissiveIntensity: 2.5 });
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), lampMat);
  lamp.position.y = 4.2;
  root.add(petals, lamp);
  root.traverse((o) => { o.castShadow = true; });
  return { root, setActive: (on) => { lampMat.emissiveIntensity = on ? 2.5 : 0.2; } };
}

/** Where a pylon's cables attach (local coordinates). */
export const PYLON_TOP = 3.88;

/** Loads the owner's machine models; any that are missing fall back to code-built versions. */
export async function preloadMachines() {
  const ids: MachineId[] = ['solar_lotus', 'battery', 'electrolyzer', 'smelter', 'auto_drill', 'storage_silo', 'research_station', 'coal_burner', 'silicon_furnace'];
  await Promise.all(ids.map(async (id) => { try { models.set(id, await loadModel(id)); } catch { /* fallback below */ } }));
  try { conveyorModel = await loadModel('conveyor_straight'); } catch { conveyorModel = null; }
}

function fromModel(id: MachineId): MachineView | null {
  const m = models.get(id);
  if (!m) return null;
  const root = new THREE.Group();
  const copy = m.clone();
  copy.traverse((o) => { const mesh = o as THREE.Mesh; if (mesh.isMesh) (mesh.material as THREE.MeshStandardMaterial).envMapIntensity = 1.2; });
  root.add(copy);
  // A light that shows the machine is working (inside tanks, furnace mouth, charge meter).
  const L = LIGHTS[id] ?? { color: '#5cffd6', y: 0.8, z: 0.55, range: 3.5, on: 2.5 };
  const light = new THREE.PointLight(L.color, 0, L.range, 2);
  light.position.set(0, L.y, L.z);
  root.add(light);
  return {
    root,
    setActive: (on) => { light.intensity = on ? L.on + (L.flicker ? Math.sin(performance.now() / 90) * L.on * 0.25 : 0) : 0; },
    setLevel: (v) => { light.intensity = 0.3 + 2.2 * v; },
  };
}

export function buildMachine(id: MachineId): MachineView {
  const fromArt = fromModel(id);
  if (fromArt) return fromArt;
  if (id === 'battery') return battery();
  if (id === 'electrolyzer') return electrolyzer();
  if (id === 'power_pylon') return pylon();
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

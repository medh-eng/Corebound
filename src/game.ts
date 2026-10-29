// Corebound — Chapter 1 on Jivagraha: dig, build and breathe on a living world.
import { CHAPTER1_LOGS } from './data/logs';
import * as THREE from 'three';
import { JIVAGRAHA } from './data/worlds';
import { START_BASE } from './data/base';
import { ITEMS, YIELD, MACHINES, SURVIVAL, RECIPES, type ItemId, type MachineId, type Recipe } from './data/items';
import { researchById } from './data/research';
import { CODEX, codexById } from './data/codex';
import { RESEARCH_LINES, MACHINE_LINES, EVENT_LINES } from './data/lines';
import { CHAPTER1_GOALS, SARATHI_EVENTS } from './data/story';
import { SarathiDrone } from './render/sarathi';
import { HoloPortrait } from './render/hologram';
import { Terrain } from './core/terrain';
import { VoxelWorld, type Dig } from './core/voxels';
import { Mat } from './core/geology';
import { stepMover, altitude, type MoverState, type Collider } from './core/motion';
import { sunDir, sunElevation, timeForSunrise, daylight, localClock } from './core/daycycle';
import type { V3 } from './core/vec';
import { buildPlanet } from './render/planet';
import { scatterWorld, decorateBase, surfaceMatrix } from './render/scatter';
import { DigRenderer } from './render/digRender';
import { OreField, ORE_ITEM, type OreNode } from './render/ore';
import { LaserView } from './render/laser';
import { buildMachine, ghostOf, preloadMachines, type MachineView } from './render/machines';
import { BeltRenderer, beltPath, pathLength } from './render/belts';
import { Fauna } from './render/fauna';
import { BloomField, type Bloom } from './render/bloom';
import { harmonyValue, bandOf } from './systems/harmony';
import { HARMONY, BAND_TEXT, type Band } from './data/harmony';
import { buildSky } from './art/sky';
import { shared, quality as matQuality, loadGroundTextures } from './art/materials';
import { paintModel } from './art/paint';
import { chimney, chimneySmoke } from './art/smoke';
import { assetUrl, loadModel } from './render/assets';
import { PlayerView } from './render/player';
import { CameraRig } from './render/cameraRig';
import { buildPostFX } from './render/postfx';
import { Input } from './systems/input';
import { Backpack, type Slot } from './systems/inventory';
import {
  newBase, tickBase, migrateBase, addMachine, removeMachine as removeFromBase, addBelt, beltProblem, beltCost, startResearch, accept,
  powerNetworks, researchReady, total, type BaseState, type PlacedMachine,
} from './systems/base';
import { UI, type Goal } from './ui/ui';
import { Sound } from './audio/sound';

declare global {
  interface Window { __ready?: boolean; __stats?: unknown; __game?: unknown }
}

export interface GameOptions {
  quality: 'low' | 'high';
  skipTitle: boolean;
  timeOffset: number;   // days added to the starting time (0.5 = night)
  view: 'follow' | 'orbit';
  shot: boolean;        // automated screenshot mode
  yawDeg: number;
  pitch?: number;
  dist?: number;
  near?: string;        // testing: start near a landmark kind (e.g. 'banyan')
  alt?: number;         // testing: start this many metres in the air
  log?: string;         // preview: open this memory log a few seconds after the game starts
}

const SAVE_KEY = 'corebound.save.v1';

interface SaveData {
  v: 1;
  days: number;
  me: { pos: V3; heading: V3 };
  pack: (Slot | null)[];
  base: BaseState;
  digs: Dig[];
  ore: number[];
  goal: number;
  mined: Partial<Record<ItemId, number>>;
  crafted: Partial<Record<ItemId, number>>;
  flags: Record<string, boolean>;
  codex?: string[];
}

const V = (v: V3) => new THREE.Vector3(v.x, v.y, v.z);
const P = (v: THREE.Vector3): V3 => ({ x: v.x, y: v.y, z: v.z });
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

function readSave(): SaveData | null {
  try { const s = localStorage.getItem(SAVE_KEY); return s ? (JSON.parse(s) as SaveData) : null; } catch { return null; }
}

export async function startGame(opts: GameOptions) {
  const world = JIVAGRAHA;
  const ui = new UI();
  const low = opts.quality === 'low';
  matQuality.detail = !low;
  loadGroundTextures((n) => assetUrl(`textures/${n}.webp`));

  const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: opts.shot });
  renderer.setPixelRatio(Math.min(devicePixelRatio, low ? 1 : 1.5));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.info.autoReset = false;
  document.body.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 9000);
  const input = new Input(renderer.domElement);
  input.alwaysLocked = opts.shot;
  try { const sv = Number(localStorage.getItem('corebound.sens')); if (sv > 0) input.sensitivity = sv; } catch { /* default */ }
  const sound = new Sound();

  // ── World ─────────────────────────────────────────────
  ui.loading('Shaping the planet', 0.1); await nextFrame();
  const terrain = new Terrain(world);
  const voxels = new VoxelWorld(terrain, world.seed);
  const R = world.radius;
  const groundR = (d: V3, fromR?: number) => (fromR === undefined ? terrain.groundRadius(d) : voxels.floorRadius(d, fromR));
  const groundRV = (d: THREE.Vector3) => groundR(P(d), d.length() > 1 ? d.length() : undefined);
  const solidNearDigs = (p: V3) => voxels.edited(p) && voxels.solid(p);
  const planet = buildPlanet(world, terrain, low ? 96 : 144);
  scene.add(planet.ground, planet.water);
  const dug = new DigRenderer(voxels, terrain, world);
  scene.add(dug.group);

  // Where you start, and which way you face: toward the morning sun, with the sun a little to the right.
  const up0 = V(terrain.spawnDir);
  const t0 = timeForSunrise(P(up0), world.spawn.sunElevationDeg);
  let days = t0 + opts.timeOffset;
  const sun0 = V(sunDir(t0));
  const forward = sun0.clone().addScaledVector(up0, -sun0.dot(up0)).normalize().applyAxisAngle(up0, 0.6 + (opts.yawDeg * Math.PI) / 180);
  const right = new THREE.Vector3().crossVectors(forward, up0).normalize();
  const spawnPoint = up0.clone().multiplyScalar(terrain.groundRadius(P(up0)));
  const along = (fw: number, rt: number) => up0.clone().multiplyScalar(R).addScaledVector(forward, fw).addScaledVector(right, rt).normalize();

  // ── Base: shelter dome, chimney smoke, solar lotus ─────────
  ui.loading('Building your shelter', 0.3); await nextFrame();
  const colliders: Collider[] = [];
  const domeDir = along(START_BASE.shelterDome.forward, START_BASE.shelterDome.right);
  const domePoint = domeDir.clone().multiplyScalar(terrain.groundRadius(P(domeDir)));
  const doorDir = spawnPoint.clone().sub(domePoint); doorDir.addScaledVector(domeDir, -doorDir.dot(domeDir)).normalize();
  const dome = new THREE.Group();
  dome.name = 'shelter';
  try {
    const m = await loadModel('shelter_dome');
    paintModel('shelter_dome', m);
    dome.add(m);
  } catch { /* model missing: base still works */ }
  dome.applyMatrix4(surfaceMatrix(terrain, domeDir, 0, 1, 0.08, 0, spawnPoint.clone().sub(domePoint)));
  const ch = chimney();
  const ca = (START_BASE.chimney.angleDeg * Math.PI) / 180;
  ch.position.set(Math.sin(ca) * START_BASE.chimney.out, START_BASE.chimney.up, Math.cos(ca) * START_BASE.chimney.out);
  const smoke = chimneySmoke();
  smoke.position.set(0, 1.8, 0);
  ch.add(smoke);
  dome.add(ch);
  scene.add(dome);
  colliders.push({ pos: P(domePoint), radius: 3.15 });

  const lotusDir = along(START_BASE.solarLotus.forward, START_BASE.solarLotus.right);
  const lotusPoint = lotusDir.clone().multiplyScalar(terrain.groundRadius(P(lotusDir)));
  await preloadMachines();
  {
    const lv = buildMachine('solar_lotus');
    lv.root.applyMatrix4(surfaceMatrix(terrain, lotusDir, (START_BASE.solarLotus.yawDeg * Math.PI) / 180, 1, 0.05, 0, spawnPoint.clone().sub(lotusPoint)));
    lv.root.traverse((o) => { const mm = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined; if (mm) mm.envMapIntensity = 1.4; });
    scene.add(lv.root);
    colliders.push({ pos: P(lotusPoint), radius: 0.5 });
  }

  // ── Plants, rocks, crystals, ore ──────────────────────
  ui.loading('Growing the forest', 0.5); await nextFrame();
  const scatter = scatterWorld(terrain, world.seed, up0, [
    { pos: domePoint, radius: 8 }, { pos: lotusPoint, radius: 4 }, { pos: spawnPoint, radius: 4.5 },
  ]);
  scene.add(scatter.group);
  colliders.push(...scatter.colliders);
  scene.add(decorateBase(terrain, { up: up0, forward, right }, { dome: domePoint }));
  const ore = new OreField(terrain, world.seed, { up: up0, forward, right }, [{ pos: domePoint, radius: 5 }, { pos: lotusPoint, radius: 2.5 }, { pos: spawnPoint, radius: 2 }]);
  scene.add(ore.group);
  const laser = new LaserView();
  scene.add(laser.group);
  const fauna = new Fauna((d) => terrain.groundRadius(P(d)));
  scene.add(fauna.group);
  const blooms = new BloomField((d) => terrain.groundRadius(P(d)));
  scene.add(blooms.group);

  // ── Sky and light ─────────────────────────────────────
  ui.loading('Lighting the sky', 0.7); await nextFrame();
  const sky = buildSky(world);
  scene.add(sky.group, sky.ringed, sky.atmosphere);
  const rp = world.ringedPlanet;
  const rDir = forward.clone().applyAxisAngle(up0, (rp.azimuthDeg * Math.PI) / 180).multiplyScalar(Math.cos((rp.elevationDeg * Math.PI) / 180))
    .addScaledVector(up0, Math.sin((rp.elevationDeg * Math.PI) / 180)).normalize();
  sky.ringed.position.copy(rDir.multiplyScalar(rp.distance));
  sky.ringed.lookAt(0, 0, 0);
  sky.ringed.rotateZ(0.5);
  if (!low) new THREE.TextureLoader().load(assetUrl('sky/jiva_night_sky.webp'), (t) => sky.setPanorama(t, [0.70, 0.42], sky.ringed.position));

  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), tmpC = new THREE.Vector3();
  const Y_AXIS = new THREE.Vector3(0, 1, 0), X_AXIS = new THREE.Vector3(1, 0, 0);
  const sun = new THREE.DirectionalLight('#fff1d6', 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -38; sc.right = 38; sc.top = 38; sc.bottom = -38; sc.near = 70; sc.far = 230;
  sun.shadow.bias = -0.0006;
  sun.shadow.normalBias = 0.14;
  scene.add(sun, sun.target);
  // Shadows setting: 2 high, 1 low, 0 off.
  let shadowLevel = low ? 1 : 2;
  try { const v = localStorage.getItem('corebound.shadows'); if (v !== null) shadowLevel = Number(v); } catch { /* default */ }
  const setShadows = (lvl: number) => {
    const wasOn = sun.castShadow;
    shadowLevel = lvl;
    sun.castShadow = lvl > 0;
    const size = lvl === 1 ? 1024 : 2048;
    if (sun.shadow.mapSize.x !== size) { sun.shadow.mapSize.set(size, size); sun.shadow.map?.dispose(); sun.shadow.map = null; }
    if (wasOn !== sun.castShadow) scene.traverse((o) => { const m = (o as THREE.Mesh).material; if (m) (Array.isArray(m) ? m : [m]).forEach((x) => (x.needsUpdate = true)); });
  };
  setShadows(shadowLevel);
  const hemi = new THREE.HemisphereLight('#fff1e2', '#6f8a3a', 0.45);
  scene.add(hemi);
  const nightFill = new THREE.DirectionalLight('#8f86ff', 0.0);
  scene.add(nightFill, nightFill.target);
  const helmet = new THREE.SpotLight('#fff0d8', 0, 22, 0.55, 0.6, 1.5);
  scene.add(helmet, helmet.target);
  const fog = new THREE.FogExp2('#ffe3b6', 0.006);
  scene.fog = fog;

  const pmrem = new THREE.PMREMGenerator(renderer);
  let envRT: THREE.WebGLRenderTarget | null = null;
  let envTimer = 0;
  const refreshEnv = () => {
    const rt = pmrem.fromScene(sky.envScene, 0, 0.1, 300);
    scene.environment = rt.texture;
    envRT?.dispose();
    envRT = rt;
  };

  // ── Player ────────────────────────────────────────────
  ui.loading('Waking the Custodian', 0.85); await nextFrame();
  const player = new PlayerView();
  await player.load();
  scene.add(player.root, player.tool);
  // SARATHI floats beside you and opens a ring of light whenever it speaks.
  const drone = new SarathiDrone();
  await drone.load();
  scene.add(drone.root);
  { const say = ui.sarathi.bind(ui); ui.sarathi = (line: string, seconds = 7) => { drone.speak(Math.min(seconds, 2 + line.length / 18)); say(line, seconds); }; }
  const me: MoverState = {
    pos: P(spawnPoint.clone().addScaledVector(up0, 0.05)), vel: { x: 0, y: 0, z: 0 },
    heading: P(forward), grounded: true, jetFuel: 1, jetting: false,
  };
  if (opts.near && scatter.landmarks[opts.near]?.length) {
    const lm = scatter.landmarks[opts.near].slice().sort((a, b) => a.distanceTo(spawnPoint) - b.distanceTo(spawnPoint))[0];
    const u = lm.clone().normalize();
    const away = spawnPoint.clone().sub(lm); away.addScaledVector(u, -away.dot(u)).normalize();
    const d = lm.clone().addScaledVector(away, 16).normalize();
    me.pos = P(d.clone().multiplyScalar(terrain.groundRadius(P(d)) + 0.05));
    const h = lm.clone().sub(V(me.pos)); h.addScaledVector(d, -h.dot(d)).normalize();
    me.heading = P(h);
  }
  if (opts.alt) { const u = V(me.pos).normalize(); me.pos = P(V(me.pos).addScaledVector(u, opts.alt)); me.grounded = false; me.vel = P(u.multiplyScalar(0.5)); }

  const rig = new CameraRig(camera, R, groundRV);
  if (opts.pitch !== undefined) rig.pitch = opts.pitch;
  if (opts.dist !== undefined) rig.dist = opts.dist;
  const post = buildPostFX(renderer, scene, camera);

  // ── Game state ────────────────────────────────────────
  const pack = new Backpack(8);
  let base = newBase();
  addMachine(base, { id: 'solar_lotus', pos: P(lotusPoint) });
  const belts = new BeltRenderer();
  scene.add(belts.group);
  const beltGround = (d: THREE.Vector3) => terrain.groundRadius(P(d));
  const nearShelter = (p: V3) => V(p).distanceTo(domePoint) < SURVIVAL.gridRadius;
  /** Redraws belts and pylon cables after the factory changes. */
  const refreshFactory = () => {
    belts.sync(base.belts, base.machines, beltGround);
    const { links } = powerNetworks(base, nearShelter);
    belts.setCables(links.map(([a, b]) => [a ? V(a.pos) : domePoint.clone().addScaledVector(domeDir, 0.2), V(b.pos)] as [THREE.Vector3, THREE.Vector3]));
    if (base.research.done.includes('backpack_plus')) pack.resize(12);
  };
  const machineViews = new Map<PlacedMachine, MachineView>();
  let goalIndex = 0;
  const mined: Partial<Record<ItemId, number>> = {};
  const crafted: Partial<Record<ItemId, number>> = {};
  const flags: Record<string, boolean> = {};
  const fraction = new Map<ItemId, number>();
  const codexKnown: string[] = [];
  const codexNew: string[] = [];
  /** Adds a Codex entry the first time something is scanned. */
  const unlockCodex = (id: string) => {
    const e = codexById(id);
    if (!e || codexKnown.includes(id)) return false;
    codexKnown.push(id); codexNew.push(id);
    ui.pickup(`Codex: ${e.title.split(':')[0]}`, '#9fe8ff');
    ui.toast('New Codex entry — press J to read it');
    sound.goal();
    if (ui.codexOpen) ui.renderCodex(codexKnown, codexNew);
    return true;
  };

  const machineCollider = (m: PlacedMachine): Collider => ({ pos: m.pos, radius: MACHINES[m.id].radius });
  const addMachineView = (m: PlacedMachine, yaw = 0) => {
    if (machineViews.has(m)) return;
    if (m.id === 'solar_lotus' && V(m.pos).distanceTo(lotusPoint) < 0.5) return; // the starting lotus is already in the scene
    const v = buildMachine(m.id);
    const dir = V(m.pos).normalize();
    v.root.applyMatrix4(surfaceMatrix(terrain, dir, yaw, 1, 0.03, 0, domePoint.clone().sub(V(m.pos))));
    v.root.position.copy(V(m.pos));
    const smokeAt: Partial<Record<MachineId, number>> = { smelter: 2.7, coal_burner: 2.3, silicon_furnace: 2.5 };
    if (smokeAt[m.id] !== undefined) { const sm = chimneySmoke(); sm.position.set(0, smokeAt[m.id]!, 0); v.root.add(sm); v.root.userData.smoke = sm; }
    m.yaw = yaw;
    scene.add(v.root);
    machineViews.set(m, v);
    colliders.push(machineCollider(m));
  };
  /** Takes a machine away (with its belts) and returns what it held. */
  const removeMachine = (m: PlacedMachine) => {
    const v = machineViews.get(m);
    if (v) { scene.remove(v.root); machineViews.delete(m); }
    const back = removeFromBase(base, m);
    const ci = colliders.findIndex((c) => c.pos === m.pos);
    if (ci >= 0) colliders.splice(ci, 1);
    refreshFactory();
    return back;
  };

  // Flora sitting in a freshly dug hole is removed with the soil.
  const clearFlora = (c: THREE.Vector3, r: number) => {
    const m4 = new THREE.Matrix4(), p = new THREE.Vector3(), zero = new THREE.Matrix4().makeScale(0, 0, 0);
    for (const obj of scatter.group.children) {
      const im = obj as THREE.InstancedMesh;
      if (!im.isInstancedMesh || !['grass', 'fern', 'smallMushroom', 'lotus', 'smallRock', 'crystal'].includes(im.name)) continue;
      if (!im.boundingSphere || im.boundingSphere.center.distanceTo(c) > im.boundingSphere.radius + r) continue;
      let changed = false;
      for (let i = 0; i < im.count; i++) {
        im.getMatrixAt(i, m4);
        p.setFromMatrixPosition(m4);
        if (p.distanceTo(c) < r + 0.25) { im.setMatrixAt(i, zero); changed = true; }
      }
      if (changed) im.instanceMatrix.needsUpdate = true;
    }
  };

  const doDig = (c: THREE.Vector3, r: number) => {
    const res = voxels.dig(P(c), r);
    dug.rebuild(res.chunks);
    clearFlora(c, r);
    return res.removed;
  };

  const give = (id: ItemId, n: number, from: 'mine' | 'craft' | 'other' = 'other') => {
    const left = pack.add(id, n);
    const got = n - left;
    if (got > 0) {
      sound.pickup();
      if (from === 'mine') mined[id] = (mined[id] ?? 0) + got;
      ui.pickup(`+${got} ${ITEMS[id].name}`, ITEMS[id].color);
    }
    if (left > 0 && !flags.fullWarned) { ui.sarathi(SARATHI_EVENTS.backpackFull); flags.fullWarned = true; setTimeout(() => (flags.fullWarned = false), 20000); }
    if (ui.packOpen) ui.renderPack(pack.slots, (r) => pack.canCraft(r), unlocked);
  };

  // ── Saving ────────────────────────────────────────────
  const save = () => {
    if (opts.shot) return;
    const data: SaveData = {
      v: 1, days, me: { pos: { ...me.pos }, heading: { ...me.heading } }, pack: pack.toJSON(), base,
      digs: voxels.digs, ore: ore.amounts(), goal: goalIndex, mined, crafted, flags, codex: codexKnown,
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* storage full or blocked */ }
  };
  const load = (d: SaveData) => {
    days = d.days;
    me.pos = d.me.pos; me.heading = d.me.heading; me.vel = { x: 0, y: 0, z: 0 };
    base = migrateBase(d.base);
    if (base.research.done.includes('backpack_plus')) pack.resize(12);
    pack.load(d.pack);
    voxels.replay(d.digs);
    dug.rebuild(voxels.chunks.keys());
    for (const g of d.digs) clearFlora(V(g), g.r);
    ore.restore(d.ore);
    goalIndex = d.goal;
    Object.assign(mined, d.mined); Object.assign(crafted, d.crafted); Object.assign(flags, d.flags);
    codexKnown.splice(0, codexKnown.length, ...(d.codex ?? []));
    for (const m of base.machines) addMachineView(m, m.yaw ?? 0);
    refreshFactory();
  };
  addEventListener('beforeunload', save);

  // ── Goals ─────────────────────────────────────────────
  const goalDone = (id: string): boolean => {
    const has = (mid: MachineId) => base.machines.some((m) => m.id === mid && V(m.pos).distanceTo(domePoint) < SURVIVAL.gridRadius);
    switch (id) {
      case 'ice': return (mined.ice ?? 0) >= 3;
      case 'iron': return (mined.iron_ore ?? 0) >= 6;
      case 'silica': return (mined.silica ?? 0) >= 4;
      case 'craft_elec': return (crafted.electrolyzer ?? 0) >= 1 || has('electrolyzer');
      case 'place_elec': return has('electrolyzer');
      case 'load_ice': return base.machines.some((m) => m.id === 'electrolyzer' && ((m.inv?.ice ?? 0) > 0 || (m.burn ?? 0) > 0)) || base.shelterO2 > 0;
      case 'breathe': return !!flags.breathed;
      case 'battery': return has('battery');
      case 'night': return !!flags.survivedNight;
      case 'smelter': return (mined.iron_plate ?? 0) >= 4;
      case 'research_station': return has('research_station') || base.machines.some((m) => m.id === 'research_station');
      case 'research_drill': return base.research.done.includes('auto_drill');
      case 'place_drill': return base.machines.some((m) => m.id === 'auto_drill' && !!m.mine);
      case 'research_belt': return base.research.done.includes('conveyor');
      case 'belt': return base.belts.length > 0;
      case 'harmony_look': return !!flags.sawPlanet;
      case 'bio_filter': return base.machines.some((m) => m.id === 'bio_filter');
      case 'bloom': return (mined.bloom ?? 0) >= 1;
      case 'auto_plates': return base.machines.filter((m) => m.id === 'smelter' && (m.fedByBelt ?? 0) > 0).reduce((s, m) => s + (m.made ?? 0), 0) >= 5;
      default: return false;
    }
  };
  const goalsView = (): Goal[] => {
    const cur = CHAPTER1_GOALS[Math.min(goalIndex, CHAPTER1_GOALS.length - 1)];
    const next = CHAPTER1_GOALS[goalIndex + 1];
    const list: Goal[] = [{ key: 'Now', text: cur.text }];
    if (next) list.push({ key: 'Next', text: next.text });
    list.push({ key: '???', text: 'Something vast moves beneath the glowing forest…', mystery: true });
    return list;
  };
  const advanceGoals = () => {
    let moved = false;
    while (goalIndex < CHAPTER1_GOALS.length - 1 && goalDone(CHAPTER1_GOALS[goalIndex].id)) { goalIndex++; moved = true; }
    if (moved) { ui.sarathi(CHAPTER1_GOALS[goalIndex].sarathi, 9); ui.toast('Goal complete'); sound.goal(); player.startEmote('salute'); save(); }
    ui.goals(goalsView());
  };

  // ── UI actions ────────────────────────────────────────
  const unlocked = (r: Recipe) => !r.research || base.research.done.includes(r.research);
  const recipeFor = (id: ItemId) => RECIPES.find((r) => r.out === id);
  const needsText = (r?: Recipe) => r ? Object.entries(r.needs).map(([id, n]) => `${n} ${ITEMS[id as ItemId].name.toLowerCase()}`).join(' + ') : '';

  /** What lies under a drill: the best ore in a column 1–8 m down, and how rich it is. */
  const drillSample = (p: THREE.Vector3): { item: ItemId; rich: number } => {
    const up = p.clone().normalize();
    const side = new THREE.Vector3().crossVectors(up, Math.abs(up.y) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0)).normalize();
    const side2 = new THREE.Vector3().crossVectors(up, side);
    const counts = new Map<ItemId, number>();
    let n = 0;
    for (const [a, b] of [[0, 0], [0.8, 0], [-0.8, 0], [0, 0.8], [0, -0.8]]) {
      const d = p.clone().addScaledVector(side, a).addScaledVector(side2, b).normalize();
      const g = terrain.groundRadius(P(d));
      for (let depth = 1; depth <= 8; depth++) {
        const mat = voxels.geology.at(P(d.clone().multiplyScalar(g - depth)), depth);
        const y = YIELD[mat];
        n++;
        if (y && mat !== Mat.Soil) counts.set(y.item, (counts.get(y.item) ?? 0) + 1);
      }
    }
    // Ores beat plain rock (silica) if there is a fair amount of them.
    let best: ItemId = 'silica', bestN = counts.get('silica') ?? 0;
    let oreN = 0;
    for (const [k, c] of counts) if (k !== 'silica' && c >= 4 && c > oreN) { best = k; bestN = c; oreN = c; }
    const rich = best === 'silica' ? Math.min(0.6, bestN / n) : Math.min(1, (bestN / n) * 3);
    return { item: best, rich: Math.max(0.25, rich) };
  };

  let building: { id: MachineId; item: ItemId; ghost: THREE.Group; yaw: number; ok: boolean; pos: THREE.Vector3; sample?: { item: ItemId; rich: number } } | null = null;
  let beltFrom: PlacedMachine | null = null;
  let beltMode = false;
  let beltPreview: THREE.Line | null = null;
  const beltPreviewMat = new THREE.LineBasicMaterial({ color: '#5cffd6' });
  const endBelt = () => { beltMode = false; beltFrom = null; if (beltPreview) { scene.remove(beltPreview); beltPreview = null; } };
  const startBuild = (item: ItemId) => {
    const mid = ITEMS[item].placeable;
    if (!mid || pack.count(item) < 1) return;
    if (building) scene.remove(building.ghost);
    building = { id: mid, item, ghost: ghostOf(buildMachine(mid)), yaw: 0, ok: false, pos: new THREE.Vector3() };
    scene.add(building.ghost);
    closePack();
    ui.toast(`Placing ${ITEMS[item].name}`);
  };
  const cancelBuild = () => { if (building) { scene.remove(building.ghost); building = null; } };
  const placeables = (): ItemId[] => (Object.keys(ITEMS) as ItemId[]).filter((id) => {
    if (!ITEMS[id].placeable) return false;
    const r = recipeFor(id);
    return pack.count(id) > 0 || (r !== undefined && unlocked(r));
  });
  const renderBuild = () => ui.renderBuild(placeables().map((id) => {
    const r = recipeFor(id);
    return { id, have: pack.count(id), canCraft: !!r && unlocked(r) && pack.canCraft(r), needs: needsText(r) };
  }));
  const openBuild = () => { cancelBuild(); endBelt(); sound.uiOpen(); renderBuild(); ui.setBuild(true); if (document.pointerLockElement) document.exitPointerLock(); };
  const closeBuild = (relock = true) => { ui.setBuild(false); if (relock && playing && !opts.shot) input.lock(); };
  ui.onBuild = (id) => {
    if (pack.count(id) < 1) {
      const r = recipeFor(id);
      if (!r || !pack.craft(r)) { ui.toast('Not enough parts'); return; }
      crafted[id] = (crafted[id] ?? 0) + r.n;
    }
    sound.click();
    closeBuild();
    startBuild(id);
  };
  // Research panel at a research station.
  const renderResearch = () => {
    const st = base.machines.find((m) => m.id === 'research_station');
    const powered = !!st && (lastSupply.get(st.uid!) ?? 0) > 0.2;
    ui.renderResearch(base.research, (id) => pack.count(id), powered);
  };
  const openCodex = () => { sound.uiOpen(); ui.renderCodex(codexKnown, codexNew); ui.setCodex(true); codexNew.length = 0; if (document.pointerLockElement) document.exitPointerLock(); };
  const closeCodex = () => { ui.setCodex(false); if (playing && !opts.shot) input.lock(); };
  // Memory logs (T-019 viewer). World placement comes in M4; for now only the test hook opens one.
  const huxley = new HoloPortrait();
  const openLog = (id: string, reaction?: string) => {
    const log = CHAPTER1_LOGS.find((l) => l.id === id); if (!log) return false;
    sound.uiOpen(); ui.showLog(log, reaction);
    if (/huxley/i.test(log.speaker ?? '')) void huxley.start(document.getElementById('log-holo') as HTMLCanvasElement);
    if (document.pointerLockElement) document.exitPointerLock(); return true;
  };
  const closeLog = () => { ui.hideLog(); if (playing && !opts.shot) input.lock(); };
  const openResearch = () => { sound.uiOpen(); renderResearch(); ui.setResearch(true); if (document.pointerLockElement) document.exitPointerLock(); };
  const closeResearch = () => { ui.setResearch(false); if (playing && !opts.shot) input.lock(); };
  const loadResearchParts = () => {
    const node = base.research.active ? researchById(base.research.active) : null;
    const st = base.machines.find((m) => m.id === 'research_station');
    if (!node || !st) return 0;
    let n = 0;
    for (const id of Object.keys(node.needs) as ItemId[]) {
      while (pack.count(id) > 0 && accept(base, st, id)) { pack.remove(id, 1); n++; }
    }
    if (n) { ui.pickup(`Loaded ${n} parts`, '#5cffd6'); sound.place(); }
    return n;
  };
  ui.onResearch = (id) => { if (startResearch(base, id)) { sound.click(); loadResearchParts(); renderResearch(); } };
  ui.onResearchLoad = () => { loadResearchParts(); renderResearch(); };
  let lastSupply = new Map<number, number>();
  ui.onCraft = (r: Recipe) => {
    sound.click();
    if (pack.craft(r)) {
      crafted[r.out] = (crafted[r.out] ?? 0) + r.n;
      ui.pickup(`Crafted ${ITEMS[r.out].name}`, ITEMS[r.out].color);
      ui.renderPack(pack.slots, (x) => pack.canCraft(x), unlocked);
      advanceGoals();
    }
  };
  ui.onPlace = (id) => startBuild(id);
  const openPack = () => { sound.uiOpen(); ui.renderPack(pack.slots, (r) => pack.canCraft(r), unlocked); ui.setPack(true); if (document.pointerLockElement) document.exitPointerLock(); };
  const closePack = () => { sound.uiClose(); ui.setPack(false); if (playing && !opts.shot) input.lock(); };

  // ── State and loop ────────────────────────────────────
  let playing = false;
  let showStats = false;
  let fpsAvg = 60;
  let frames = 0;
  let last = performance.now();
  let acc = 0;
  let digTimer = 0, oreTimer = 0, goalTimer = 0, saveTimer = 20;
  let wasNight = false, lowWarned = false, resTimer = 0, lampOn = false, researchTimer = 0, itemCodexTimer = 1;

  const begin = (resume: boolean) => {
    sound.start();
    const d = resume ? readSave() : null;
    if (d) load(d);
    else { try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ } }
    playing = true;
    rig.autoSpin = 0;
    rig.titleFrame = 0;
    rig.setMode('follow', opts.shot ? 0.001 : 4.5);
    ui.showHud();
    ui.goals(goalsView());
    if (!opts.shot) input.lock();
    setTimeout(() => ui.toast('Jivagraha'), 3800);
    setTimeout(() => ui.sarathi(CHAPTER1_GOALS[goalIndex].sarathi, 10), d ? 1000 : 5200);
    if (opts.log) setTimeout(() => openLog(opts.log!), 6500);
  };

  if (opts.view === 'orbit') { rig.mode = 'orbit'; rig.orbitPitch = 0.75; }
  if (opts.skipTitle) {
    rig.mode = opts.view;
    playing = true;
    ui.showHud();
    ui.goals(goalsView());
  } else {
    rig.mode = 'orbit';
    rig.orbitPitch = 0.62;
    rig.orbitYaw = -0.5;
    rig.autoSpin = 0.035;
    rig.titleFrame = 1;
  }

  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && playing && !opts.shot && !ui.packOpen && !ui.buildOpen && !ui.researchOpen && !ui.codexOpen && !ui.logOpen) { save(); ui.showPause(() => input.lock()); }
  });
  renderer.domElement.addEventListener('click', () => { sound.start(); });
  addEventListener('pointerdown', () => sound.start(), { once: true });   // title music after the first click
  renderer.domElement.addEventListener('click', () => { if (playing && !input.locked && !opts.shot && !ui.packOpen && !ui.buildOpen && !ui.researchOpen && !ui.codexOpen && !ui.logOpen) { ui.hidePause(); input.lock(); } });
  addEventListener('keydown', (e) => {
    if (!playing) return;
    if (e.code === 'Tab') { e.preventDefault(); if (ui.buildOpen) closeBuild(false); if (ui.researchOpen) ui.setResearch(false); if (ui.packOpen) closePack(); else { cancelBuild(); endBelt(); openPack(); } }
    // Closing keys must not also count as a fresh press in the game this frame.
    if ((e.code === 'KeyB' || e.code === 'Escape') && ui.buildOpen) { e.preventDefault(); closeBuild(); setTimeout(() => input.pressed.delete(e.code)); }
    if ((e.code === 'KeyE' || e.code === 'Escape') && ui.researchOpen) { e.preventDefault(); closeResearch(); setTimeout(() => input.pressed.delete(e.code)); }
    if ((e.code === 'KeyE' || e.code === 'Escape') && ui.logOpen) { e.preventDefault(); closeLog(); setTimeout(() => input.pressed.delete(e.code)); return; }
    if ((e.code === 'KeyJ' || e.code === 'Escape') && ui.codexOpen) { e.preventDefault(); closeCodex(); setTimeout(() => input.pressed.delete(e.code)); }
  });

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    post.resize(innerWidth, innerHeight);
  });

  const tmpUp = new THREE.Vector3();
  const tmpCol = new THREE.Color();
  const pal = world.palette;
  const cols = {
    dayZ: new THREE.Color(pal.skyDayZenith), dayH: new THREE.Color(pal.skyDayHorizon), setH: new THREE.Color(pal.skySunsetHorizon), nightH: new THREE.Color(pal.skyNightHorizon),
  };
  const camDir = new THREE.Vector3();
  const murk = new THREE.Color('#6b6a3a');
  const hazeCol = new THREE.Color('#c9b98a');
  let bloomTimer = 8;
  let lastBand: Band | null = null;

  /** What the crosshair points at: a deposit or the ground. */
  const aim = (): { point: THREE.Vector3; normal: THREE.Vector3; node?: OreNode; bloom?: Bloom } | null => {
    camera.getWorldDirection(camDir);
    const o = camera.position;
    const start = Math.max(0, rig.dist - 0.6);
    const hitOre = ore.raycast(o, camDir, start + 9);
    const hitBloom = blooms.raycast(o, camDir, start + 9);
    let tGround = -1;
    for (let t = start; t < start + 9; t += 0.1) {
      const p = o.clone().addScaledVector(camDir, t);
      if (voxels.density(p.x, p.y, p.z) > 0) { tGround = t; break; }
    }
    const pos = V(me.pos);
    if (hitBloom && (tGround < 0 || hitBloom.t < tGround) && (!hitOre || hitBloom.t < hitOre.t)) {
      const p = o.clone().addScaledVector(camDir, hitBloom.t);
      if (p.distanceTo(pos) <= 8) return { point: p, normal: camDir.clone().negate(), bloom: hitBloom.bloom };
    }
    if (hitOre && (tGround < 0 || hitOre.t < tGround)) {
      const p = o.clone().addScaledVector(camDir, hitOre.t);
      if (p.distanceTo(pos) > 8) return null;
      return { point: p, normal: camDir.clone().negate(), node: hitOre.node };
    }
    if (tGround < 0) return null;
    const p = o.clone().addScaledVector(camDir, tGround);
    if (p.distanceTo(pos) > 8) return null;
    return { point: p, normal: camDir.clone().negate() };
  };

  /** The machine under the crosshair (for laying belts), up to 45 m away. */
  const aimMachine = (): PlacedMachine | null => {
    camera.getWorldDirection(camDir);
    const o = camera.position;
    let best: PlacedMachine | null = null, bt = 45;
    for (const m of base.machines) {
      const d = MACHINES[m.id];
      const c = V(m.pos).addScaledVector(V(m.pos).normalize(), d.height * 0.45);
      const rr = Math.max(d.radius, d.height * 0.45) * 0.95;
      const oc = c.clone().sub(o);
      const t = oc.dot(camDir);
      if (t < 0 || t > bt) continue;
      if (oc.lengthSq() - t * t <= rr * rr) { bt = t; best = m; }
    }
    return best;
  };
  const names = (bag: Partial<Record<ItemId, number>> | undefined) => Object.entries(bag ?? {}).filter(([, n]) => (n ?? 0) > 0)
    .map(([id, n]) => `${n} ${ITEMS[id as ItemId].name.toLowerCase()}`).join(', ');
  /** Finished items go into the backpack. */
  const collectOut = (m: PlacedMachine) => {
    for (const [k, n0] of Object.entries(m.out ?? {}) as [ItemId, number][]) {
      if (!n0) continue;
      const left = pack.add(k, n0);
      const got = n0 - left;
      m.out![k] = left;
      if (got > 0) { mined[k] = (mined[k] ?? 0) + got; ui.pickup(`+${got} ${ITEMS[k].name}`, ITEMS[k].color); sound.pickup(); }
      else if (!flags.fullWarned) { ui.toast(`Backpack full — ${ITEMS[k].name.toLowerCase()} waits in the ${MACHINES[m.id].name.toLowerCase()}`); flags.fullWarned = true; setTimeout(() => (flags.fullWarned = false), 8000); }
    }
    advanceGoals();
  };
  const machinePrompt = (m: PlacedMachine): string => {
    const d = MACHINES[m.id];
    const x = ' · <b>X</b> pick up';
    if (m.fault) return `${d.name} · <b>needs attention</b> · <b>E</b> fix it${x}`;
    if (d.filter) return `${d.name} · ${m.working ? 'cleaning' : d.powerKW < 0 ? 'no power' : 'idle'}${x}`;
    if (d.research) return `Research station${base.research.active ? ` · ${researchById(base.research.active)!.name}` : ''} · <b>E</b> research${x}`;
    if (d.storage) return `Storage silo · ${total(m.inv)}/${d.storage}${total(m.inv) ? ` (${names(m.inv)})` : ''} · <b>E</b> take all${x}`;
    if (d.drill) return `Auto-drill · mining ${m.mine ? ITEMS[m.mine].name.toLowerCase() : 'nothing'} (${Math.round((m.rich ?? 0) * 100)}% rich)${total(m.out) ? ` · ${total(m.out)} waiting` : ''}${x}`;
    if (d.accepts) {
      const what = Object.keys(d.accepts).map((k) => ITEMS[k as ItemId].name.toLowerCase()).join(' + ');
      return `${d.name}${total(m.inv) ? ` · ${names(m.inv)} inside` : ''} · <b>E</b> load ${what}${x}`;
    }
    return `${d.name}${x}`;
  };
  const useMachine = (m: PlacedMachine) => {
    const d = MACHINES[m.id];
    if (m.fault) { m.fault = false; sound.place(); ui.pickup(`Fixed the ${d.name.toLowerCase()}`, '#5cffd6'); return; }
    if (d.research) { openResearch(); return; }
    if (d.storage) {
      let got = 0;
      for (const [k, n] of Object.entries(m.inv ?? {}) as [ItemId, number][]) { const left = pack.add(k, n); got += n - left; m.inv![k] = left; }
      if (got) { ui.pickup(`Took ${got} items`, '#ffcf6a'); sound.pickup(); } else ui.toast(total(m.inv) ? 'Backpack full' : 'The silo is empty');
      return;
    }
    if (d.accepts) {
      let n = 0;
      for (const k of Object.keys(d.accepts) as ItemId[]) while (pack.count(k) > 0 && accept(base, m, k)) { pack.remove(k, 1); n++; }
      if (n) { ui.pickup(`Loaded ${names(m.inv) ? n : n} into the ${d.name.toLowerCase()}`, '#5cffd6'); sound.place(); advanceGoals(); }
      else ui.toast(Object.keys(d.accepts).some((k) => pack.count(k as ItemId) > 0) ? `${d.name} is full` : `You have nothing it takes (${Object.keys(d.accepts).map((k) => ITEMS[k as ItemId].name.toLowerCase()).join(', ')})`);
    }
  };
  const pickUpMachine = (m: PlacedMachine) => {
    const item = m.id as ItemId;
    if (pack.add(item, 1) > 0) { ui.toast('Backpack full'); return; }
    const back = removeMachine(m);
    let lost = 0;
    for (const [k, n] of Object.entries(back) as [ItemId, number][]) lost += pack.add(k, n);
    sound.pickupMachine();
    ui.pickup(`Picked up ${ITEMS[item].name}`, ITEMS[item].color);
    if (lost) ui.toast(`Backpack full — ${lost} items were lost`);
  };
  /** A short status line over a machine, or '' when all is well. */
  const machineTag = (m: PlacedMachine): string => {
    const d = MACHINES[m.id];
    const sup = lastSupply.get(m.uid!);
    const feeds = base.belts.filter((b) => b.to === m.uid).length;
    if (m.fault) return 'Needs attention (E)';
    if (d.powerKW < 0 && sup === undefined) return 'No power';
    if (d.research) {
      if (!base.research.active) return 'Choose research (E)';
      const node = researchById(base.research.active)!;
      return researchReady(base) ? `${node.name} ${Math.round((base.research.progress / node.seconds) * 100)}%` : `${node.name}: needs parts`;
    }
    if (d.drill) return total(m.out) >= (d.outCap ?? 20) ? 'Full — collect or add a belt' : '';
    if (d.process?.fuel) return (m.burn ?? 0) <= 0 && !(m.inv?.carbon) ? 'Needs carbon' : '';
    if (d.process) {
      const ready = total(m.out);
      if (ready && !base.belts.some((b) => b.from === m.uid)) return `${ready} ${names(m.out)} ready`;
      const missing = Object.entries(d.process.needs).filter(([k, n]) => (m.inv?.[k as ItemId] ?? 0) < (n ?? 0)).map(([k]) => ITEMS[k as ItemId].name.toLowerCase());
      if ((m.burn ?? 0) <= 0 && missing.length && !feeds) return `Needs ${missing.join(' + ')}`;
      if ((m.burn ?? 0) > 0 && (sup ?? 0) < 0.2) return 'Low power';
    }
    return '';
  };

  let scanTimer = 0;
  const KIND_CODEX: Record<string, string> = { ice: 'ice_crystal', iron: 'iron_ore', carbon: 'carbon' };
  /** What the scanner is pointing at (a Codex id), if anything it knows about. */
  const scanTarget = (): string | null => {
    camera.getWorldDirection(camDir);
    const o = camera.position;
    const hits: [number, string][] = [];
    const m = aimMachine();
    if (m && V(m.pos).distanceTo(camera.position) < 25) hits.push([V(m.pos).distanceTo(o), m.id]);
    { const oc = domePoint.clone().addScaledVector(domeDir, 1.8).sub(o); const t = oc.dot(camDir); if (t > 0 && t < 30 && oc.lengthSq() - t * t < 3.2 * 3.2) hits.push([t, 'shelter_dome']); }
    const bl = blooms.raycast(o, camDir, 30); if (bl) hits.push([bl.t, 'bloom']);
    const on = ore.raycast(o, camDir, 30); if (on) hits.push([on.t, KIND_CODEX[on.node.kind]]);
    const mt = fauna.nearRay(o, camDir, 25); if (mt !== null) hits.push([mt, 'glow_moth']);
    for (const [kind, id, r] of [['banyan', 'banyan', 4.5], ['mushroomTree', 'mushroom_tree', 2.5]] as const) {
      for (const p of scatter.landmarks[kind] ?? []) {
        const c = p.clone().addScaledVector(p.clone().normalize(), kind === 'banyan' ? 5 : 3);
        const oc = c.sub(o); const t = oc.dot(camDir);
        if (t > 0 && t < 45 && oc.lengthSq() - t * t < r * r) hits.push([t, id]);
      }
    }
    // Small plants and sandstone: where the ray meets the ground.
    let tg = -1;
    for (let t = 1; t < 25; t += 0.2) { const p = o.clone().addScaledVector(camDir, t); if (voxels.density(p.x, p.y, p.z) > 0) { tg = t; break; } }
    if (tg > 0) {
      const g = o.clone().addScaledVector(camDir, tg);
      const near = (name: string, r: number) => {
        const m4 = new THREE.Matrix4(), p = new THREE.Vector3();
        for (const obj of scatter.group.children) {
          const im = obj as THREE.InstancedMesh;
          if (!im.isInstancedMesh || im.name !== name) continue;
          if (im.boundingSphere && im.boundingSphere.center.distanceTo(g) > im.boundingSphere.radius + r) continue;
          for (let i = 0; i < im.count; i++) { im.getMatrixAt(i, m4); p.setFromMatrixPosition(m4); if (p.distanceTo(g) < r) return true; }
        }
        return false;
      };
      if (near('lotus', 1.4)) hits.push([tg, 'lotus_pad']);
      else if (near('smallMushroom', 1.2)) hits.push([tg, 'glow_mushroom']);
      else if (near('fern', 1.3)) hits.push([tg, 'fern']);
      else if (voxels.edited(P(g)) && voxels.material(P(g.clone().addScaledVector(g.clone().normalize(), -0.4))) === Mat.Rock) hits.push([tg, 'sandstone']);
    }
    hits.sort((a, b) => a[0] - b[0]);
    return hits.find(([, id]) => !!codexById(id))?.[1] ?? null;
  };

  const nearestMachine = (pos: THREE.Vector3, maxD: number) => {
    let best: PlacedMachine | null = null, bd = maxD;
    for (const m of base.machines) { const d = V(m.pos).distanceTo(pos); if (d < bd) { bd = d; best = m; } }
    return best;
  };

  const update = (dt: number) => {
    const pad = input.pollPad();
    const timeScale = input.down('KeyN') ? 24 : 1;
    days += (dt * timeScale) / world.dayLengthSec;
    shared.uTime.value += dt;

    if (input.hit('F3')) showStats = !showStats;
    if (input.hit('KeyH')) ui.toggleHelp();
    if (input.wheel && !building) rig.dist = THREE.MathUtils.clamp(rig.dist + input.wheel * 0.8, 3.5, 14);

    const active = playing && !ui.paused && !ui.packOpen && !ui.buildOpen && !ui.researchOpen && !ui.codexOpen && !ui.logOpen && (input.locked || opts.shot) && !rig.transitioning;
    if (active && input.hit('KeyM')) rig.setMode(rig.mode === 'follow' ? 'orbit' : 'follow', 1.4);
    const look = input.sensitivity;
    let yaw = 0;
    if (active && rig.mode === 'follow') {
      yaw = -input.mouseDX * look - pad.rx * 2.4 * dt;
      rig.pitch = THREE.MathUtils.clamp(rig.pitch + input.mouseDY * look * 0.8 + pad.ry * 1.6 * dt, -0.2, 1.15);
    } else if (active && rig.mode === 'orbit') {
      rig.orbitYaw -= input.mouseDX * look;
      rig.orbitPitch = THREE.MathUtils.clamp(rig.orbitPitch + input.mouseDY * look, 0.05, 1.3);
    }
    const walk = active && rig.mode === 'follow';
    const fwd = walk ? (input.down('KeyW') || input.down('ArrowUp') ? 1 : 0) - (input.down('KeyS') || input.down('ArrowDown') ? 1 : 0) - pad.ly : 0;
    const side = walk ? (input.down('KeyD') || input.down('ArrowRight') ? 1 : 0) - (input.down('KeyA') || input.down('ArrowLeft') ? 1 : 0) + pad.lx : 0;
    const sprint = input.down('ShiftLeft') || input.down('ShiftRight');
    const jumpHit = walk && input.hit('Space');
    acc += dt;
    const STEP = 1 / 60;
    let first = true;
    const wasGrounded = me.grounded;
    const fallSpeed = -(me.vel.x * me.pos.x + me.vel.y * me.pos.y + me.vel.z * me.pos.z) / Math.max(1, Math.hypot(me.pos.x, me.pos.y, me.pos.z));
    while (acc >= STEP) {
      stepMover(me, {
        forward: fwd, right: side, sprint, jump: jumpHit && first, jet: walk && input.down('Space') && base.power > 0.02, yaw: first ? yaw : 0,
      }, STEP, groundR, colliders, undefined, solidNearDigs);
      first = false;
      acc -= STEP;
    }
    if (first && yaw) me.heading = P(V(me.heading).applyAxisAngle(V(me.pos).normalize(), yaw));
    if (wasGrounded && !me.grounded && jumpHit) sound.jump();
    if (!wasGrounded && me.grounded && fallSpeed > 1.5) sound.land(fallSpeed);
    const pos = V(me.pos);
    const up = tmpUp.copy(pos).normalize();
    const heading = V(me.heading);

    // Machines: use (E), pick up (X), canister (Q), dance (G), build menu (B), conveyor (C).
    const near = nearestMachine(pos, 2.8);
    const atShelter = pos.distanceTo(domePoint) < 4.4;
    let prompt: string | null = null;
    const wasBelt = beltMode;
    if (walk && !building && !beltMode) {
      if (near) {
        if (near.out && total(near.out) > 0 && !base.belts.some((b) => b.from === near.uid)) collectOut(near);
        prompt = machinePrompt(near);
        if (input.hit('KeyE')) useMachine(near);
        if (input.hit('KeyX')) pickUpMachine(near);
      } else if (atShelter) {
        prompt = base.shelterO2 > 0 ? 'Shelter airlock · breathing shelter air' : 'Shelter airlock · <b>no air yet</b> — the shelter needs an electrolyzer';
      }
      if (input.hit('KeyG')) player.startEmote(player.emoting === 'dance' ? 'dance_silly' : 'dance');
      if (input.hit('KeyQ')) {
        if (pack.remove('o2_canister', 1)) { sound.canister(); base.oxygen = Math.min(1, base.oxygen + 0.4); ui.pickup('Breathed an O₂ canister', ITEMS.o2_canister.color); }
        else ui.toast('No O₂ canisters — craft them from ice');
      }
      if (input.hit('KeyB')) openBuild();
      if (input.hit('KeyJ')) openCodex();
      if (input.hit('KeyC')) {
        if (!base.research.done.includes('conveyor')) ui.toast('Research conveyors first (at a research station)');
        else { beltMode = true; beltFrom = null; ui.toast('Conveyor: click the machine that sends, then the one that receives'); }
      }
    } else if (walk && building) {
      if (input.hit('KeyB') || input.hit('Escape')) cancelBuild();
    }

    // Conveyor tool: click a sender, then a receiver.
    if (beltMode && walk) {
      const target = aimMachine();
      if (wasBelt && (input.hit('KeyC') || input.hit('Escape'))) endBelt();
      else if (!beltFrom) {
        if (beltPreview) beltPreview.visible = false;
        prompt = target ? `<b>Click</b> to send from the ${MACHINES[target.id].name.toLowerCase()} · <b>C</b> cancel` : 'Aim at the machine that sends items · <b>C</b> cancel';
        if (target && input.hit('Mouse0')) { beltFrom = target; sound.click(); }
      } else if (!target || target === beltFrom) {
        if (beltPreview) beltPreview.visible = false;
        prompt = `Sending from the ${MACHINES[beltFrom.id].name.toLowerCase()} — aim at the machine that receives · <b>C</b> cancel`;
      } else {
        const pts = beltPath(beltFrom, target, beltGround);
        const len = pathLength(pts);
        const problem = beltProblem(base, beltFrom, target, len);
        const cost = beltCost(len);
        const short = pack.count('conveyor') < cost;
        if (!beltPreview) { beltPreview = new THREE.Line(new THREE.BufferGeometry(), beltPreviewMat); scene.add(beltPreview); }
        beltPreview.geometry.dispose();
        beltPreview.geometry = new THREE.BufferGeometry().setFromPoints(pts.map((q) => q.clone().addScaledVector(q.clone().normalize(), 0.25)));
        beltPreview.visible = true;
        beltPreviewMat.color.set(problem || short ? '#ff6a5a' : '#5cffd6');
        prompt = problem ?? (short ? `Needs ${cost} conveyors — you have ${pack.count('conveyor')} (craft them from iron plates)` : `<b>Click</b> to lay ${Math.round(len)} m of belt (${cost} conveyors) · <b>C</b> cancel`);
        if (!problem && !short && input.hit('Mouse0')) {
          pack.remove('conveyor', cost);
          const belt = addBelt(base, beltFrom, target, len);
          belts.add(belt, pts);
          sound.place();
          ui.pickup(`Belt: ${MACHINES[beltFrom.id].name} → ${MACHINES[target.id].name}`, ITEMS.conveyor.color);
          if (!flags.firstBelt) { flags.firstBelt = true; ui.sarathi(EVENT_LINES.first_belt, 8); }
          endBelt();
          advanceGoals();
          save();
        }
      }
    }

    // Build mode: a ghost on the ground ahead of you.
    if (building) {
      if (input.hit('KeyR')) building.yaw += Math.PI / 4;
      if (input.wheel) building.yaw += input.wheel * 0.2;
      const target = pos.clone().addScaledVector(heading, 3.4).normalize();
      const gr = groundR(P(target), pos.length() + 1);
      building.pos.copy(target).multiplyScalar(gr);
      const r = MACHINES[building.id].radius;
      if (building.id === 'auto_drill') building.sample = drillSample(building.pos);
      const clear = colliders.every((c) => V(c.pos).distanceTo(building!.pos) > c.radius + r + 0.2);
      const dry = terrain.height(target.x, target.y, target.z) > world.seaLevel + 0.2;
      building.ok = clear && dry && building.pos.distanceTo(domePoint) > 3.9;
      const g = building.ghost;
      g.matrixAutoUpdate = true;
      g.position.set(0, 0, 0); g.quaternion.identity(); g.scale.set(1, 1, 1);
      g.applyMatrix4(surfaceMatrix(terrain, target, building.yaw, 1, 0.03, 0, domePoint.clone().sub(building.pos)));
      g.position.copy(building.pos);
      (g.userData.ghostMat as THREE.MeshBasicMaterial).color.set(building.ok ? '#5cffd6' : '#ff6a5a');
      const mines = building.sample ? ` · mines <b>${ITEMS[building.sample.item].name.toLowerCase()}</b>, ${Math.round(building.sample.rich * 100)}% rich` : '';
      prompt = building.ok ? `<b>Click</b> to place${mines} · <b>R</b> turn · <b>B</b> cancel` : 'Too close to something, or in water';
      if (walk && input.hit('Mouse0') && building.ok && pack.remove(building.item, 1)) {
        const m = addMachine(base, { id: building.id, pos: P(building.pos) });
        if (building.sample) { m.mine = building.sample.item; m.rich = building.sample.rich; }
        addMachineView(m, building.yaw);
        refreshFactory();
        ui.pickup(`Placed ${ITEMS[building.item].name}`, ITEMS[building.item].color);
        sound.place();
        if (MACHINES[m.id].powerKW < 0 && !powerNetworks(base, nearShelter).netOf.has(m.uid!)) ui.sarathi(EVENT_LINES.no_power ?? SARATHI_EVENTS.noPower);
        else if (!flags[`placed_${m.id}`] && MACHINE_LINES[m.id]) ui.sarathi(MACHINE_LINES[m.id], 8);
        flags[`placed_${m.id}`] = true;
        cancelBuild();
        advanceGoals();
        save();
      }
    }

    // Scanner (hold right mouse): learn what something is; adds it to the Codex.
    let scanning = false;
    if (walk && !building && !beltMode && input.down('Mouse2')) {
      const t = scanTarget();
      scanning = true;
      if (!t) { prompt = 'Scanner: aim at a plant, rock, creature or machine'; scanTimer = 0; }
      else if (codexKnown.includes(t)) { prompt = `${codexById(t)!.title.split(':')[0]} — already in your Codex (<b>J</b>)`; scanTimer = 0; }
      else {
        scanTimer += dt;
        ui.progress(Math.min(1, scanTimer / 0.9));
        prompt = `Scanning… ${codexById(t)!.title.split(':')[0]}`;
        if (scanTimer >= 0.9) { scanTimer = 0; unlockCodex(t); }
      }
    } else scanTimer = 0;

    // Mining laser.
    let lasering = false;
    let laserTo: THREE.Vector3 | null = null, laserN: THREE.Vector3 | null = null;
    let laserHit: 'rock' | 'crystal' | null = null;
    if (walk && !building && !beltMode && (input.down('Mouse0') || opts.shot && (window as unknown as { __laser?: boolean }).__laser) && base.power > 0.01) {
      const a = aim();
      if (a) {
        lasering = true;
        laserTo = a.point; laserN = a.normal;
        laserHit = a.node?.kind === 'ice' || a.bloom ? 'crystal' : 'rock';
        if (a.bloom) {
          oreTimer += dt;
          ui.progress(Math.min(1, oreTimer / 0.6));
          if (oreTimer >= 0.6) {
            oreTimer = 0;
            blooms.remove(a.bloom);
            give('bloom', 1, 'mine');
            if (!flags.bloomFirst) { flags.bloomFirst = true; ui.sarathi(SARATHI_EVENTS.bloomFirst, 8); }
            advanceGoals();
          }
        } else if (a.node) {
          oreTimer += dt;
          ui.progress(Math.min(1, oreTimer / 0.45));
          if (oreTimer >= 0.45) { oreTimer = 0; if (ore.take(a.node)) give(ORE_ITEM[a.node.kind], 1, 'mine'); }
        } else {
          digTimer += dt;
          ui.progress(Math.min(1, digTimer / 0.16));
          if (digTimer >= 0.16) {
            digTimer = 0;
            const tooClose = a.point.distanceTo(domePoint) < 5.2 || base.machines.some((m) => V(m.pos).distanceTo(a.point) < 1.6);
            if (tooClose) { if (!flags.closeWarned) { ui.sarathi(SARATHI_EVENTS.tooClose); flags.closeWarned = true; } }
            else {
              const removed = doDig(a.point, 0.9);
              sound.dig();
              for (const [mat, vol] of removed) {
                const y = YIELD[mat as Mat];
                if (!y) continue;
                const f = (fraction.get(y.item) ?? 0) + vol * y.perM3;
                const whole = Math.floor(f);
                fraction.set(y.item, f - whole);
                if (whole > 0) give(y.item, whole, 'mine');
              }
            }
          }
        }
      } else {
        // Nothing in reach: still raise the tool and fire a short beam, so the player sees it works.
        camera.getWorldDirection(camDir);
        lasering = true;
        laserTo = camera.position.clone().addScaledVector(camDir, rig.dist + 7);
        laserN = null;
        digTimer = 0; oreTimer = 0; ui.progress(0);
        if (!flags.rangeHint) { ui.toast('Too far — walk closer and aim at the ground or a crystal'); flags.rangeHint = true; }
      }
    }
    if (!lasering && !scanning) { digTimer = 0; oreTimer = 0; ui.progress(0); }
    player.setAim(laserTo);

    // Sun, sky and light for the place you stand.
    const sd = V(sunDir(days));
    const elev = sunElevation(days, P(up));
    const day = daylight(elev);
    const night = 1 - day;
    shared.uNight.value = night;
    sky.uniforms.uSun.value.copy(sd);
    const camUp = camera.position.clone().normalize();
    const camAlt = camera.position.length() - R;
    const space = THREE.MathUtils.smoothstep(camAlt, R * 0.35, R * 1.4);
    sky.uniforms.uUp.value.copy(space > 0.5 ? camUp : up);
    sky.uniforms.uSpace.value = space;
    sky.uniforms.uNight.value = night;
    sky.update(camera);

    {
      // Snap the shadow area to whole shadow-map texels so shadows stay still while you walk.
      const texel = (sc.right - sc.left) / sun.shadow.mapSize.x;
      const ax = tmpA.copy(sd).cross(Math.abs(sd.y) < 0.95 ? Y_AXIS : X_AXIS).normalize();
      const ay = tmpB.copy(ax).cross(sd).normalize();
      const px = pos.dot(ax), py = pos.dot(ay), pz = pos.dot(sd);
      const c = tmpC.copy(ax).multiplyScalar(Math.round(px / texel) * texel)
        .addScaledVector(ay, Math.round(py / texel) * texel).addScaledVector(sd, pz);
      sun.position.copy(c).addScaledVector(sd, 150);
      sun.target.position.copy(c);
    }
    const sunset = 1 - THREE.MathUtils.smoothstep(Math.abs(elev - 0.05), 0, 0.3);
    sun.color.setRGB(1, 0.93 - sunset * 0.25, 0.82 - sunset * 0.42);
    sun.intensity = 4.3 * THREE.MathUtils.smoothstep(elev, -0.06, 0.12);
    hemi.position.copy(up);
    hemi.intensity = 0.5 + 0.25 * day;
    hemi.color.set('#fff1e2').lerp(new THREE.Color('#5a4fb0'), night * 0.8);
    hemi.groundColor.set('#6f8a3a').lerp(new THREE.Color('#1c1838'), night);
    nightFill.position.copy(pos).add(sky.ringed.position.clone().normalize().multiplyScalar(100));
    nightFill.target.position.copy(pos);
    nightFill.intensity = 0.8 * night;
    renderer.toneMappingExposure = 1.05 + night * 0.3;
    // Helmet lamp: on at night and underground.
    const underground = voxels.edited(me.pos) && pos.length() < terrain.groundRadius(P(up)) - 1.2;
    const lampWanted = night > 0.6 || underground;
    if (lampWanted !== lampOn) { lampOn = lampWanted; if (playing) sound.lamp(); }
    helmet.intensity = THREE.MathUtils.lerp(helmet.intensity, lampWanted ? 40 : 0, 1 - Math.exp(-4 * dt));
    sound.surface = underground || voxels.edited(me.pos) ? 'rock' : atShelter ? 'metal' : 'grass';
    helmet.position.copy(pos).addScaledVector(up, 1.7);
    helmet.target.position.copy(pos).addScaledVector(up, 1.0).addScaledVector(camera.getWorldDirection(camDir), 6);

    // Harmony: the world answers the factory.
    const hv = harmonyValue(base.harmony);
    const band: Band = bandOf(hv);
    const ease = 1 - Math.exp(-dt * 0.8);
    shared.uWilt.value += (THREE.MathUtils.clamp((70 - hv) / 50, 0, 1) - shared.uWilt.value) * ease;
    shared.uThrive.value += (THREE.MathUtils.clamp((hv - 80) / 15, 0, 1) - shared.uThrive.value) * ease;
    const haze = THREE.MathUtils.smoothstep(base.harmony.air, 12, 80);
    sky.setHaze(haze);
    (planet.water.material as THREE.MeshStandardMaterial).color.set(world.palette.water).lerp(murk, THREE.MathUtils.smoothstep(base.harmony.water, 10, 70) * 0.8);
    fauna.update(shared.uTime.value, pos, band === 'thriving' ? 1 : THREE.MathUtils.clamp((hv - 25) / 55, 0, 1) * 0.7);
    if (playing && band === 'thriving') {
      bloomTimer -= dt;
      if (bloomTimer <= 0 && blooms.blooms.length < HARMONY.bloomMax) {
        bloomTimer = HARMONY.bloomEverySec * (0.6 + Math.random() * 0.8);
        blooms.spawn(pos, shared.uTime.value, (p) => p.distanceTo(domePoint) < 6 || base.machines.some((m) => V(m.pos).distanceTo(p) < 2.5) || terrain.height(p.x, p.y, p.z) < world.seaLevel + 0.3);
      }
    }
    blooms.update(shared.uTime.value, band === 'thriving');
    if (playing && band !== lastBand) {
      const msg = { thriving: SARATHI_EVENTS.bandThriving, stable: SARATHI_EVENTS.bandStable, stressed: SARATHI_EVENTS.bandStressed, collapse: SARATHI_EVENTS.bandCollapse }[band];
      if (lastBand !== null && (band !== 'thriving' || lastBand !== 'stable' || !flags.toldThriving)) { ui.sarathi(msg, 8); ui.toast(`Harmony: ${BAND_TEXT[band]}`); if (band === 'thriving') flags.toldThriving = true; }
      lastBand = band;
    }
    if (rig.mode === 'orbit' && playing) { flags.sawPlanet = true; for (const id of ['jivagraha', 'harmony_air', 'harmony_water', 'harmony_soil']) if (!codexKnown.includes(id)) unlockCodex(id); }
    ui.harmony({ value: hv, band: BAND_TEXT[band], ...base.harmony }, playing && rig.mode === 'orbit');

    tmpCol.copy(cols.nightH).lerp(cols.dayH, day).lerp(cols.setH, sunset * 0.35).lerp(cols.dayZ, 0.35 * day);
    tmpCol.lerp(hazeCol, haze * 0.6 * day);
    fog.color.copy(tmpCol);
    fog.density = 0.0038 * (1 - space) * (1 + haze * 1.6);

    envTimer -= dt * (timeScale > 1 ? 6 : 1);
    if (envTimer <= 0) { refreshEnv(); envTimer = 1.5; }

    // Survival and power.
    if (playing && !ui.paused) {
      const o2Before = base.oxygen;
      const res = tickBase(base, {
        dt, inShelter: atShelter, running: sprint && (fwd !== 0 || side !== 0), lasering, jetting: me.jetting,
        sunAt: (p) => daylight(sunElevation(days, P(V(p).normalize()))),
        nearShelter,
      });
      lastSupply = res.supply;
      if (res.faults.length) {
        ui.toast(`${res.faults.length > 1 ? `${res.faults.length} machines need` : `The ${MACHINES[res.faults[0].id].name.toLowerCase()} needs`} attention`);
        sound.alarm();
        if (!flags.faultTold) { flags.faultTold = true; ui.sarathi(SARATHI_EVENTS.fault, 9); }
      }
      if (res.researched) {
        const node = researchById(res.researched)!;
        ui.toast(`Research complete: ${node.name}`);
        ui.sarathi(RESEARCH_LINES[node.id] ?? `${SARATHI_EVENTS.researched} ${node.name}. ${node.note}`, 8);
        sound.goal();
        refreshFactory();
        advanceGoals();
      }
      if (atShelter && base.oxygen > o2Before && !flags.breathed) { flags.breathed = true; advanceGoals(); }
      if (res.blackout) {
        const wake = domePoint.clone().addScaledVector(doorDir, 4.2).normalize();
        me.pos = P(wake.multiplyScalar(terrain.groundRadius(P(wake)) + 0.1));
        me.vel = { x: 0, y: 0, z: 0 };
        ui.sarathi(SARATHI_EVENTS.blackout, 8);
        ui.toast('Blackout');
        sound.blackout();
      }
      if (base.oxygen < 0.25 && !lowWarned) { ui.sarathi(SARATHI_EVENTS.lowOxygen); sound.alarm(); lowWarned = true; }
      if (base.oxygen > 0.4) lowWarned = false;
      for (const [m, v] of machineViews) {
        const d = MACHINES[m.id];
        const sup = res.supply.get(m.uid!) ?? 0;
        let on = false;
        if (m.id === 'battery') { v.setLevel?.((m.charge ?? 0) / (d.storeKWh ?? 20)); continue; }
        if (m.id === 'settling_pond') { v.setLevel?.(1 - base.harmony.water / 100); continue; }
        if (m.id === 'power_pylon') on = res.supply.has(m.uid!);
        else if (d.process?.fuel) on = (m.burn ?? 0) > 0;
        else if (d.process) on = (m.burn ?? 0) > 0 && sup > 0.2;
        else if (d.drill) {
          on = !!m.mine && sup > 0.2 && total(m.out) < (d.outCap ?? 20);
          if (total(m.out) >= (d.outCap ?? 20) && !flags.drillFullTold) { flags.drillFullTold = true; ui.sarathi(EVENT_LINES.drill_full, 8); }
        }
        else if (d.research) on = researchReady(base) && sup > 0.2;
        else if (d.storage) on = total(m.inv) > 0;
        else if (d.filter) on = !!m.working;
        if (m.fault) on = false;
        v.setActive?.(on);
        if (v.root.userData.smoke) (v.root.userData.smoke as THREE.Points).visible = on;
      }
      researchTimer -= dt;
      // Items and gases have no shape to scan: their Codex entries open when you first hold or make them.
      itemCodexTimer -= dt;
      if (itemCodexTimer <= 0) {
        itemCodexTimer = 1;
        for (const id of ['iron_plate', 'silicon', 'o2_canister', 'methane'] as ItemId[]) if (pack.count(id) > 0) unlockCodex(id);
        if (base.machines.some((m) => m.id === 'electrolyzer' && (m.made ?? 0) > 0)) { unlockCodex('oxygen'); unlockCodex('hydrogen'); }
      }
      if (ui.researchOpen && researchTimer <= 0) { renderResearch(); researchTimer = 0.4; }
      const baseNight = 1 - daylight(sunElevation(days, P(domeDir)));
      if (baseNight > 0.8 && !wasNight) { wasNight = true; ui.sarathi(SARATHI_EVENTS.nightFalls); if (goalIndex >= 8) flags.sawNight = true; }
      if (baseNight < 0.3 && wasNight) { wasNight = false; ui.sarathi(SARATHI_EVENTS.sunrise); if (flags.sawNight) { flags.survivedNight = true; advanceGoals(); } }
      const gridText = `Power ${res.produceKW.toFixed(1)} kW${res.capacity ? ` · Battery ${base.stored.toFixed(0)}/${res.capacity} kWh` : ''}`;
      ui.vitals(base.oxygen, base.power, base.shelterO2 / SURVIVAL.shelterO2Capacity, localClock(days, P(up)), gridText);
      goalTimer -= dt;
      if (goalTimer <= 0) { advanceGoals(); goalTimer = 0.5; }
      saveTimer -= dt;
      if (saveTimer <= 0) { save(); saveTimer = 20; }
    }
    ui.prompt(playing ? prompt : null);
    // Status tags over machines that need you.
    {
      const tags: { x: number; y: number; text: string }[] = [];
      const w = renderer.domElement.clientWidth, h = renderer.domElement.clientHeight;
      if (walk) for (const m of base.machines) {
        const mp = V(m.pos);
        if (mp.distanceTo(pos) > 40) continue;
        const text = machineTag(m);
        if (!text) continue;
        const sp = tmpC.copy(mp).addScaledVector(mp.clone().normalize(), MACHINES[m.id].height + 0.5).project(camera);
        if (sp.z > 1 || Math.abs(sp.x) > 1.1 || Math.abs(sp.y) > 1.1) continue;
        tags.push({ x: (sp.x * 0.5 + 0.5) * w, y: (-sp.y * 0.5 + 0.5) * h, text });
      }
      ui.tags(tags.slice(0, 10));
    }
    belts.updateItems(base.belts, camera);
    sound.laser(lasering, laserHit);
    sound.jet(me.jetting);
    sound.breathing(playing && base.oxygen < 0.25 && !atShelter);
    {
      let near: number | null = null;
      for (const m of base.machines) if ((m.id === 'smelter' || m.id === 'coal_burner' || m.id === 'silicon_furnace') && (m.burn ?? 0) > 0) { const d = V(m.pos).distanceTo(pos); if (near === null || d < near) near = d; }
      sound.smelter(near);
    }
    // Music for the moment: title, day, night, underground, or a restless planet.
    sound.playMusic(!playing ? 'title_theme' : band === 'collapse' ? 'guardian_awake' : underground ? 'jiva_underground' : night > 0.6 ? 'jiva_night' : 'jiva_day');
    sound.update(dt, night, me.grounded ? Math.hypot(me.vel.x, me.vel.y, me.vel.z) : 0,
      Math.min(1, base.machines.filter((m) => m.working || m.fuelOn).length / 8), harmonyValue(base.harmony) / 100);
    resTimer -= dt;
    if (resTimer <= 0 && playing) {
      resTimer = 0.25;
      ui.resources((['ice', 'iron_ore', 'silica', 'carbon', 'iron_plate', 'silicon', 'conveyor', 'o2_canister'] as ItemId[])
        .filter((id, i) => i < 4 || pack.count(id) > 0)
        .map((id) => ({ name: ITEMS[id].name, color: ITEMS[id].color, n: pack.count(id) })));
    }

    player.update(dt, pos, up, V(me.vel), heading, me.grounded, me.jetting, shared.uTime.value);
    drone.update(dt, pos, up, heading, { visible: playing && rig.mode === 'follow', underground });
    laser.update(dt, laserTo ? player.muzzle : null, laserTo, laserN);
    rig.update(dt, pos, up, heading);
  };

  const render = () => {
    renderer.info.reset();
    post.composer.render();
  };

  // Hooks for tests and tuning in the browser console.
  window.__game = {
    setTime: (offsetDays: number) => { days = t0 + offsetDays; envTimer = 0; },
    teleport: (fw: number, rt: number) => { const d = along(fw, rt); me.pos = P(d.multiplyScalar(terrain.groundRadius(P(d)) + 0.1)); },
    stats: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }),
    state: () => ({ pos: { ...me.pos }, grounded: me.grounded, fuel: me.jetFuel, alt: altitude(me, groundR), oxygen: base.oxygen, power: base.power, shelterO2: base.shelterO2, goal: CHAPTER1_GOALS[goalIndex].id, pack: pack.slots, machines: base.machines.length, smelters: base.machines.filter((m) => m.id === 'smelter').map((m) => ({ inv: m.inv, out: m.out, burn: m.burn, made: m.made, fed: m.fedByBelt })) }),
    base: () => base,
    codex: () => [...codexKnown],
    showLog: (id: string, reaction?: string) => openLog(id, reaction),
    /** Opens a log and waits until Huxley's hologram has drawn (for screenshots). */
    showLogReady: async (id: string) => { openLog(id); await huxley.start(document.getElementById('log-holo') as HTMLCanvasElement); huxley.renderOnce(2.2); },
    say: (line: string, seconds?: number) => ui.sarathi(line, seconds),
    openCodex: () => { codexKnown.push(...CODEX.slice(0, 6).map((c) => c.id).filter((id) => !codexKnown.includes(id))); openCodex(); },
    pollute: (air: number, water: number, soil: number) => {
      base.harmony.air = air; base.harmony.water = water; base.harmony.soil = soil;
      const hv = harmonyValue(base.harmony);   // skip the slow fade so screenshots show it at once
      shared.uWilt.value = THREE.MathUtils.clamp((70 - hv) / 50, 0, 1); shared.uThrive.value = THREE.MathUtils.clamp((hv - 80) / 15, 0, 1);
    },
    bloom: () => blooms.spawn(V(me.pos), shared.uTime.value - 3, () => false),
    planetView: () => rig.setMode('orbit', 0.001),
    remove: (i: number) => { removeMachine(base.machines[i]); },
    research: (id: string) => { if (!base.research.done.includes(id)) base.research.done.push(id); refreshFactory(); advanceGoals(); },
    belt: (a: number, b: number) => {
      const f = base.machines[a], t = base.machines[b];
      const pts = beltPath(f, t, beltGround); const len = pathLength(pts);
      const problem = beltProblem(base, f, t, len);
      if (problem) return problem;
      belts.add(addBelt(base, f, t, len), pts); advanceGoals(); return 'ok';
    },
    goalIndex: (i: number) => { goalIndex = i; ui.goals(goalsView()); },
    /** Runs the factory for `seconds` of game time at once (tests run at a few frames per second). */
    simulate: (seconds: number) => {
      for (let t = 0; t < seconds; t += 0.25) {
        base.oxygen = 1;
        const r = tickBase(base, { dt: 0.25, inShelter: false, running: false, lasering: false, jetting: false, sunAt: (p) => daylight(sunElevation(days, P(V(p).normalize()))), nearShelter });
        lastSupply = r.supply;
      }
      advanceGoals();
    },
    dig: (fw: number, rt: number, depth: number, r: number) => {
      const d = along(fw, rt); const g = terrain.groundRadius(P(d));
      for (let k = 0; k <= depth; k += 0.8) doDig(d.clone().multiplyScalar(g - k), r);
    },
    give: (id: ItemId, n: number) => give(id, n, 'mine'),
    craft: (id: ItemId) => { const r = Backpack.recipes().find((x) => x.out === id); if (r) ui.onCraft(r); },
    place: (id: MachineId, fw: number, rt: number) => {
      const d = along(fw, rt); const p = d.multiplyScalar(terrain.groundRadius(P(d)));
      const m = addMachine(base, { id, pos: P(p) });
      if (id === 'auto_drill') { const smp = drillSample(p); m.mine = smp.item; m.rich = smp.rich; }
      addMachineView(m); refreshFactory();
      return base.machines.length - 1;
    },
    loadIce: (n: number) => { for (const m of base.machines) if (m.id === 'electrolyzer') { m.inv ??= {}; m.inv.ice = (m.inv.ice ?? 0) + n; } },
    fill: (i: number, id: ItemId, n: number) => { const m = base.machines[i]; m.inv ??= {}; m.inv[id] = (m.inv[id] ?? 0) + n; },
    face: (fw: number, rt: number) => { const t = along(fw, rt).multiplyScalar(R).sub(V(me.pos)); const u = V(me.pos).normalize(); t.addScaledVector(u, -t.dot(u)).normalize(); me.heading = P(t); },
  };

  // Pause menu: save, load, volumes, mouse sensitivity.
  ui.menu = {
    save: () => { save(); return `Saved at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`; },
    load: () => { try { sessionStorage.setItem('corebound.autoload', '1'); } catch { /* ignore */ } location.reload(); },
    home: () => { save(); location.reload(); },
    settings: () => ({ ...sound.settings, sens: input.sensitivity, shadows: shadowLevel }),
    change: (k, v) => {
      if (k === 'sens') { input.sensitivity = v; try { localStorage.setItem('corebound.sens', String(v)); } catch { /* ignore */ } }
      else if (k === 'shadows') { setShadows(v); try { localStorage.setItem('corebound.shadows', String(v)); } catch { /* ignore */ } }
      else sound.set({ [k]: v });
    },
  };
  ui.onGear(() => { if (document.pointerLockElement) document.exitPointerLock(); else if (playing) { save(); ui.showPause(() => input.lock()); } });

  ui.loading('Ready', 1);
  await nextFrame();
  ui.hideLoading();
  let autoload = false;
  try { autoload = sessionStorage.getItem('corebound.autoload') === '1'; sessionStorage.removeItem('corebound.autoload'); } catch { /* ignore */ }
  if (autoload && readSave() && !opts.skipTitle) { rig.mode = 'follow'; rig.titleFrame = 0; rig.autoSpin = 0; begin(true); ui.showPause(() => input.lock()); }
  else if (!opts.skipTitle) ui.showTitle(!!readSave(), () => begin(false), () => begin(true));

  const loop = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fpsAvg += (1 / Math.max(dt, 1e-3) - fpsAvg) * 0.05;
    update(opts.shot ? 1 / 60 : dt);
    render();
    if (showStats) {
      const i = renderer.info.render;
      ui.stats(`${fpsAvg.toFixed(0)} fps\n${i.calls} draw calls\n${(i.triangles / 1000).toFixed(0)}k triangles\n${scatter.instances.toLocaleString()} plants & rocks\n${voxels.chunks.size} dug chunks`);
    } else ui.stats(null);
    input.endFrame();
    frames++;
    if (opts.shot && frames === 6) {
      window.__stats = { calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, instances: scatter.instances, scatterTriangles: Math.round(scatter.triangles) };
      window.__ready = true;
    }
    requestAnimationFrame(loop);
  };
  refreshEnv();
  loop();
}

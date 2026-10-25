// Corebound — Chapter 1 on Jivagraha: dig, build and breathe on a living world.
import * as THREE from 'three';
import { JIVAGRAHA } from './data/worlds';
import { START_BASE } from './data/base';
import { ITEMS, YIELD, MACHINES, SURVIVAL, type ItemId, type MachineId, type Recipe } from './data/items';
import { CHAPTER1_GOALS, SARATHI_EVENTS } from './data/story';
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
import { buildSky } from './art/sky';
import { shared } from './art/materials';
import { paintModel } from './art/paint';
import { chimney, chimneySmoke } from './art/smoke';
import { loadModel } from './render/assets';
import { PlayerView } from './render/player';
import { CameraRig } from './render/cameraRig';
import { buildPostFX } from './render/postfx';
import { Input } from './systems/input';
import { Backpack, type Slot } from './systems/inventory';
import { newBase, tickBase, type BaseState, type PlacedMachine } from './systems/base';
import { UI, type Goal } from './ui/ui';

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

  const sun = new THREE.DirectionalLight('#fff1d6', 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(low ? 1024 : 2048, low ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -38; sc.right = 38; sc.top = 38; sc.bottom = -38; sc.near = 1; sc.far = 400;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.05;
  scene.add(sun, sun.target);
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
  scene.add(player.root);
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
  base.machines.push({ id: 'solar_lotus', pos: P(lotusPoint) });
  const machineViews = new Map<PlacedMachine, MachineView>();
  let goalIndex = 0;
  const mined: Partial<Record<ItemId, number>> = {};
  const crafted: Partial<Record<ItemId, number>> = {};
  const flags: Record<string, boolean> = {};
  const fraction = new Map<ItemId, number>();

  const machineCollider = (m: PlacedMachine): Collider => ({ pos: m.pos, radius: MACHINES[m.id].radius });
  const addMachineView = (m: PlacedMachine, yaw = 0) => {
    if (machineViews.has(m)) return;
    if (m.id === 'solar_lotus' && V(m.pos).distanceTo(lotusPoint) < 0.5) return; // the starting lotus is already in the scene
    const v = buildMachine(m.id);
    const dir = V(m.pos).normalize();
    v.root.applyMatrix4(surfaceMatrix(terrain, dir, yaw, 1, 0.03, 0, domePoint.clone().sub(V(m.pos))));
    v.root.position.copy(V(m.pos));
    scene.add(v.root);
    machineViews.set(m, v);
    colliders.push(machineCollider(m));
  };
  const removeMachine = (m: PlacedMachine) => {
    const v = machineViews.get(m);
    if (v) { scene.remove(v.root); machineViews.delete(m); }
    base.machines = base.machines.filter((x) => x !== m);
    const ci = colliders.findIndex((c) => c.pos === m.pos);
    if (ci >= 0) colliders.splice(ci, 1);
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
      if (from === 'mine') mined[id] = (mined[id] ?? 0) + got;
      ui.pickup(`+${got} ${ITEMS[id].name}`, ITEMS[id].color);
    }
    if (left > 0 && !flags.fullWarned) { ui.sarathi(SARATHI_EVENTS.backpackFull); flags.fullWarned = true; setTimeout(() => (flags.fullWarned = false), 20000); }
    if (ui.packOpen) ui.renderPack(pack.slots, (r) => pack.canCraft(r));
  };

  // ── Saving ────────────────────────────────────────────
  const save = () => {
    if (opts.shot) return;
    const data: SaveData = {
      v: 1, days, me: { pos: { ...me.pos }, heading: { ...me.heading } }, pack: pack.toJSON(), base,
      digs: voxels.digs, ore: ore.amounts(), goal: goalIndex, mined, crafted, flags,
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* storage full or blocked */ }
  };
  const load = (d: SaveData) => {
    days = d.days;
    me.pos = d.me.pos; me.heading = d.me.heading; me.vel = { x: 0, y: 0, z: 0 };
    pack.load(d.pack);
    base = d.base;
    voxels.replay(d.digs);
    dug.rebuild(voxels.chunks.keys());
    for (const g of d.digs) clearFlora(V(g), g.r);
    ore.restore(d.ore);
    goalIndex = d.goal;
    Object.assign(mined, d.mined); Object.assign(crafted, d.crafted); Object.assign(flags, d.flags);
    for (const m of base.machines) addMachineView(m);
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
      case 'load_ice': return base.machines.some((m) => m.id === 'electrolyzer' && ((m.ice ?? 0) > 0 || (m.burn ?? 0) > 0)) || base.shelterO2 > 0;
      case 'breathe': return !!flags.breathed;
      case 'battery': return has('battery');
      case 'night': return !!flags.survivedNight;
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
    if (moved) { ui.sarathi(CHAPTER1_GOALS[goalIndex].sarathi, 9); ui.toast('Goal complete'); save(); }
    ui.goals(goalsView());
  };

  // ── UI actions ────────────────────────────────────────
  let building: { id: MachineId; item: ItemId; ghost: THREE.Group; yaw: number; ok: boolean; pos: THREE.Vector3 } | null = null;
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
  ui.onCraft = (r: Recipe) => {
    if (pack.craft(r)) {
      crafted[r.out] = (crafted[r.out] ?? 0) + r.n;
      ui.pickup(`Crafted ${ITEMS[r.out].name}`, ITEMS[r.out].color);
      ui.renderPack(pack.slots, (x) => pack.canCraft(x));
      advanceGoals();
    }
  };
  ui.onPlace = (id) => startBuild(id);
  const openPack = () => { ui.renderPack(pack.slots, (r) => pack.canCraft(r)); ui.setPack(true); if (document.pointerLockElement) document.exitPointerLock(); };
  const closePack = () => { ui.setPack(false); if (playing && !opts.shot) input.lock(); };

  // ── State and loop ────────────────────────────────────
  let playing = false;
  let showStats = false;
  let fpsAvg = 60;
  let frames = 0;
  let last = performance.now();
  let acc = 0;
  let digTimer = 0, oreTimer = 0, goalTimer = 0, saveTimer = 20;
  let wasNight = false, lowWarned = false;

  const begin = (resume: boolean) => {
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
    if (!document.pointerLockElement && playing && !opts.shot && !ui.packOpen) { save(); ui.showPause(() => input.lock()); }
  });
  renderer.domElement.addEventListener('click', () => { if (playing && !input.locked && !opts.shot && !ui.packOpen) { ui.hidePause(); input.lock(); } });
  addEventListener('keydown', (e) => {
    if (!playing) return;
    if (e.code === 'Tab') { e.preventDefault(); if (ui.packOpen) closePack(); else { cancelBuild(); openPack(); } }
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

  /** What the crosshair points at: a deposit or the ground. */
  const aim = (): { point: THREE.Vector3; normal: THREE.Vector3; node?: OreNode } | null => {
    camera.getWorldDirection(camDir);
    const o = camera.position;
    const start = Math.max(0, rig.dist - 0.6);
    const hitOre = ore.raycast(o, camDir, start + 9);
    let tGround = -1;
    for (let t = start; t < start + 9; t += 0.1) {
      const p = o.clone().addScaledVector(camDir, t);
      if (voxels.density(p.x, p.y, p.z) > 0) { tGround = t; break; }
    }
    const pos = V(me.pos);
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

    const active = playing && !ui.paused && !ui.packOpen && (input.locked || opts.shot) && !rig.transitioning;
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
    while (acc >= STEP) {
      stepMover(me, {
        forward: fwd, right: side, sprint, jump: jumpHit && first, jet: walk && input.down('Space') && base.power > 0.02, yaw: first ? yaw : 0,
      }, STEP, groundR, colliders, undefined, solidNearDigs);
      first = false;
      acc -= STEP;
    }
    if (first && yaw) me.heading = P(V(me.heading).applyAxisAngle(V(me.pos).normalize(), yaw));
    const pos = V(me.pos);
    const up = tmpUp.copy(pos).normalize();
    const heading = V(me.heading);

    // Machines: interact (E), pick up (X), use canister (Q).
    const near = nearestMachine(pos, 2.8);
    const atShelter = pos.distanceTo(domePoint) < 4.4;
    let prompt: string | null = null;
    if (walk && !building) {
      if (near?.id === 'electrolyzer') {
        prompt = `<b>E</b> load ice (${near.ice ?? 0} inside) · <b>X</b> pick up`;
        if (input.hit('KeyE')) {
          const n = Math.min(pack.count('ice'), 20 - (near.ice ?? 0));
          if (n > 0) { pack.remove('ice', n); near.ice = (near.ice ?? 0) + n; ui.pickup(`Loaded ${n} ice`, ITEMS.ice.color); advanceGoals(); }
          else ui.toast(pack.count('ice') ? 'Electrolyzer is full' : 'You have no ice');
        }
      } else if (near) {
        prompt = `${MACHINES[near.id].name} · <b>X</b> pick up`;
      } else if (atShelter) {
        prompt = base.shelterO2 > 0 ? 'Shelter airlock · breathing shelter air' : 'Shelter airlock · <b>no air yet</b> — the shelter needs an electrolyzer';
      }
      if (near && input.hit('KeyX')) {
        const item = near.id as ItemId;
        if (pack.add(item, 1) === 0) {
          if (near.ice) pack.add('ice', near.ice);
          removeMachine(near);
          ui.pickup(`Picked up ${ITEMS[item].name}`, ITEMS[item].color);
        } else ui.toast('Backpack full');
      }
      if (input.hit('KeyQ')) {
        if (pack.remove('o2_canister', 1)) { base.oxygen = Math.min(1, base.oxygen + 0.4); ui.pickup('Breathed an O₂ canister', ITEMS.o2_canister.color); }
        else ui.toast('No O₂ canisters — craft them from ice');
      }
      if (input.hit('KeyB')) {
        if (building) cancelBuild();
        else {
          const item = (['electrolyzer', 'battery', 'solar_lotus'] as ItemId[]).find((i) => pack.count(i) > 0);
          if (item) startBuild(item); else ui.toast('Nothing to build — craft a machine first (Tab)');
        }
      }
    } else if (walk && building) {
      if (input.hit('KeyB') || input.hit('Escape')) cancelBuild();
    }

    // Build mode: a ghost on the ground ahead of you.
    if (building) {
      if (input.hit('KeyR')) building.yaw += Math.PI / 4;
      if (input.wheel) building.yaw += input.wheel * 0.2;
      const target = pos.clone().addScaledVector(heading, 3.4).normalize();
      const gr = groundR(P(target), pos.length() + 1);
      building.pos.copy(target).multiplyScalar(gr);
      const r = MACHINES[building.id].radius;
      const clear = colliders.every((c) => V(c.pos).distanceTo(building!.pos) > c.radius + r + 0.2);
      const dry = terrain.height(target.x, target.y, target.z) > world.seaLevel + 0.2;
      building.ok = clear && dry && building.pos.distanceTo(domePoint) > 3.9;
      const g = building.ghost;
      g.matrixAutoUpdate = true;
      g.position.set(0, 0, 0); g.quaternion.identity(); g.scale.set(1, 1, 1);
      g.applyMatrix4(surfaceMatrix(terrain, target, building.yaw, 1, 0.03, 0, domePoint.clone().sub(building.pos)));
      g.position.copy(building.pos);
      (g.userData.ghostMat as THREE.MeshBasicMaterial).color.set(building.ok ? '#5cffd6' : '#ff6a5a');
      prompt = building.ok ? '<b>Click</b> to place · <b>R</b> turn · <b>B</b> cancel' : 'Too close to something, or in water';
      if (walk && input.hit('Mouse0') && building.ok && pack.remove(building.item, 1)) {
        const m: PlacedMachine = { id: building.id, pos: P(building.pos) };
        if (m.id === 'electrolyzer') m.ice = 0;
        base.machines.push(m);
        addMachineView(m, building.yaw);
        ui.pickup(`Placed ${ITEMS[building.item].name}`, ITEMS[building.item].color);
        if (V(m.pos).distanceTo(domePoint) > SURVIVAL.gridRadius) ui.sarathi('That is too far from the shelter to share its power.');
        cancelBuild();
        advanceGoals();
        save();
      }
    }

    // Mining laser.
    let lasering = false;
    let laserTo: THREE.Vector3 | null = null, laserN: THREE.Vector3 | null = null;
    if (walk && !building && (input.down('Mouse0') || opts.shot && (window as unknown as { __laser?: boolean }).__laser) && base.power > 0.01) {
      const a = aim();
      if (a) {
        lasering = true;
        laserTo = a.point; laserN = a.normal;
        if (a.node) {
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
      }
    }
    if (!lasering) { digTimer = 0; oreTimer = 0; ui.progress(0); }
    const hand = pos.clone().addScaledVector(up, 1.15).addScaledVector(new THREE.Vector3().crossVectors(up, player.facing).normalize(), -0.38).addScaledVector(player.facing, 0.35);
    laser.update(dt, laserTo ? hand : null, laserTo, laserN);

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

    sun.position.copy(pos).addScaledVector(sd, 150);
    sun.target.position.copy(pos);
    const sunset = 1 - THREE.MathUtils.smoothstep(Math.abs(elev - 0.05), 0, 0.3);
    sun.color.setRGB(1, 0.93 - sunset * 0.25, 0.82 - sunset * 0.42);
    sun.intensity = 5.0 * THREE.MathUtils.smoothstep(elev, -0.06, 0.12);
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
    helmet.intensity = THREE.MathUtils.lerp(helmet.intensity, (night > 0.6 || underground) ? 40 : 0, 1 - Math.exp(-4 * dt));
    helmet.position.copy(pos).addScaledVector(up, 1.7);
    helmet.target.position.copy(pos).addScaledVector(up, 1.0).addScaledVector(camera.getWorldDirection(camDir), 6);

    tmpCol.copy(cols.nightH).lerp(cols.dayH, day).lerp(cols.setH, sunset * 0.35).lerp(cols.dayZ, 0.35 * day);
    fog.color.copy(tmpCol);
    fog.density = 0.0038 * (1 - space);

    envTimer -= dt * (timeScale > 1 ? 6 : 1);
    if (envTimer <= 0) { refreshEnv(); envTimer = 1.5; }

    // Survival and power.
    if (playing && !ui.paused) {
      const res = tickBase(base, {
        dt, inShelter: atShelter, running: sprint && (fwd !== 0 || side !== 0), lasering, jetting: me.jetting,
        sunAt: (p) => daylight(sunElevation(days, P(V(p).normalize()))),
        nearShelter: (p) => V(p).distanceTo(domePoint) < SURVIVAL.gridRadius,
      });
      if (atShelter && base.shelterO2 > 0 && base.oxygen > 0.5 && !flags.breathed) { flags.breathed = true; advanceGoals(); }
      if (res.blackout) {
        const wake = domePoint.clone().addScaledVector(doorDir, 4.2).normalize();
        me.pos = P(wake.multiplyScalar(terrain.groundRadius(P(wake)) + 0.1));
        me.vel = { x: 0, y: 0, z: 0 };
        ui.sarathi(SARATHI_EVENTS.blackout, 8);
        ui.toast('Blackout');
      }
      if (base.oxygen < 0.25 && !lowWarned) { ui.sarathi(SARATHI_EVENTS.lowOxygen); lowWarned = true; }
      if (base.oxygen > 0.4) lowWarned = false;
      for (const [m, v] of machineViews) {
        if (m.id === 'battery') v.setLevel?.(res.capacity > 0 ? base.stored / res.capacity : 0);
        if (m.id === 'electrolyzer') v.setActive?.(res.making);
      }
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

    player.update(dt, pos, up, V(me.vel), heading, me.grounded, me.jetting, shared.uTime.value);
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
    state: () => ({ pos: { ...me.pos }, grounded: me.grounded, fuel: me.jetFuel, alt: altitude(me, groundR), oxygen: base.oxygen, power: base.power, shelterO2: base.shelterO2, goal: CHAPTER1_GOALS[goalIndex].id, pack: pack.slots, machines: base.machines.length }),
    dig: (fw: number, rt: number, depth: number, r: number) => {
      const d = along(fw, rt); const g = terrain.groundRadius(P(d));
      for (let k = 0; k <= depth; k += 0.8) doDig(d.clone().multiplyScalar(g - k), r);
    },
    give: (id: ItemId, n: number) => give(id, n, 'mine'),
    craft: (id: ItemId) => { const r = Backpack.recipes().find((x) => x.out === id); if (r) ui.onCraft(r); },
    place: (id: MachineId, fw: number, rt: number) => {
      const d = along(fw, rt); const m: PlacedMachine = { id, pos: P(d.multiplyScalar(terrain.groundRadius(P(d)))) };
      if (id === 'electrolyzer') m.ice = 0;
      base.machines.push(m); addMachineView(m);
    },
    loadIce: (n: number) => { for (const m of base.machines) if (m.id === 'electrolyzer') m.ice = (m.ice ?? 0) + n; },
    face: (fw: number, rt: number) => { const t = along(fw, rt).multiplyScalar(R).sub(V(me.pos)); const u = V(me.pos).normalize(); t.addScaledVector(u, -t.dot(u)).normalize(); me.heading = P(t); },
  };

  ui.loading('Ready', 1);
  await nextFrame();
  ui.hideLoading();
  if (!opts.skipTitle) ui.showTitle(!!readSave(), () => begin(false), () => begin(true));

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

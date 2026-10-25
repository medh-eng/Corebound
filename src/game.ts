// Corebound M0 "look test": a living planet you can walk, jump and fly around.
import * as THREE from 'three';
import { JIVAGRAHA } from './data/worlds';
import { START_BASE } from './data/base';
import { Terrain } from './core/terrain';
import { stepMover, altitude, type MoverState, type Collider } from './core/motion';
import { sunDir, sunElevation, timeForSunrise, daylight, localClock } from './core/daycycle';
import type { V3 } from './core/vec';
import { buildPlanet } from './render/planet';
import { scatterWorld, decorateBase, surfaceMatrix } from './render/scatter';
import { buildSky } from './art/sky';
import { shared } from './art/materials';
import { paintModel } from './art/paint';
import { chimney, chimneySmoke } from './art/smoke';
import { loadModel } from './render/assets';
import { PlayerView } from './render/player';
import { CameraRig } from './render/cameraRig';
import { buildPostFX } from './render/postfx';
import { Input } from './systems/input';
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
  near?: string;      // testing: start near a landmark kind (e.g. 'banyan')
  alt?: number;       // testing: start this many metres in the air
}

const V = (v: V3) => new THREE.Vector3(v.x, v.y, v.z);
const P = (v: THREE.Vector3): V3 => ({ x: v.x, y: v.y, z: v.z });
const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));

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
  const R = world.radius;
  const groundR = (d: V3) => terrain.groundRadius(d);
  const groundRV = (d: THREE.Vector3) => terrain.groundRadius(P(d));
  const planet = buildPlanet(world, terrain, low ? 96 : 144);
  scene.add(planet.ground, planet.water);

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
  try {
    const lotus = await loadModel('solar_lotus');
    lotus.applyMatrix4(surfaceMatrix(terrain, lotusDir, (START_BASE.solarLotus.yawDeg * Math.PI) / 180, 1, 0.05, 0, spawnPoint.clone().sub(lotusPoint)));
    lotus.traverse((o) => { const mm = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined; if (mm) mm.envMapIntensity = 1.4; });
    scene.add(lotus);
    colliders.push({ pos: P(lotusPoint), radius: 0.5 });
  } catch { /* optional */ }

  // ── Plants, rocks, crystals ───────────────────────────
  ui.loading('Growing the forest', 0.5); await nextFrame();
  const scatter = scatterWorld(terrain, world.seed, up0, [
    { pos: domePoint, radius: 8 }, { pos: lotusPoint, radius: 4 }, { pos: spawnPoint, radius: 4.5 },
  ]);
  scene.add(scatter.group);
  colliders.push(...scatter.colliders);
  scene.add(decorateBase(terrain, { up: up0, forward, right }, { dome: domePoint }));

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
  const fog = new THREE.FogExp2('#ffe3b6', 0.006);
  scene.fog = fog;

  // Environment lighting for metal and water, refreshed as the sun moves.
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
    // Testing: stand 16 m from the landmark closest to the base, facing it.
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

  // ── Goals for this first look ─────────────────────────
  const circumference = 2 * Math.PI * R;
  let travelled = 0;
  let reachedDome = false, flewHigh = false;
  const goals = (): Goal[] => [
    { key: 'Now', text: 'Walk to your shelter dome', done: reachedDome },
    { key: 'Next', text: flewHigh ? 'Jetpack high above the forest' : 'Hold Space in the air to jetpack 8 m up', done: flewHigh },
    { key: 'Explore', text: `Walk all the way around the world · ${Math.min(100, Math.floor((travelled / circumference) * 100))}%` },
    { key: '???', text: 'Something vast moves beneath the glowing forest…', mystery: true },
  ];

  // ── State and loop ────────────────────────────────────
  let playing = false;
  let showStats = false;
  let fpsAvg = 60;
  let frames = 0;
  let last = performance.now();
  let acc = 0;

  const begin = () => {
    playing = true;
    rig.autoSpin = 0;
    rig.titleFrame = 0;
    rig.setMode('follow', opts.shot ? 0.001 : 4.5);
    ui.showHud();
    ui.goals(goals());
    if (!opts.shot) input.lock();
    setTimeout(() => ui.toast('Jivagraha'), 3800);
  };

  if (opts.view === 'orbit') { rig.mode = 'orbit'; rig.orbitPitch = 0.75; }
  if (opts.skipTitle) {
    rig.mode = opts.view;
    playing = true;
    ui.showHud();
    ui.goals(goals());
  } else {
    rig.mode = 'orbit';
    rig.orbitPitch = 0.62;
    rig.orbitYaw = -0.5;
    rig.autoSpin = 0.035;
    rig.titleFrame = 1;
  }

  document.addEventListener('pointerlockchange', () => {
    if (!document.pointerLockElement && playing && !opts.shot) ui.showPause(() => input.lock());
  });
  renderer.domElement.addEventListener('click', () => { if (playing && !input.locked && !opts.shot) { ui.hidePause(); input.lock(); } });

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

  const update = (dt: number) => {
    const pad = input.pollPad();
    const timeScale = input.down('KeyN') ? 24 : 1;
    days += (dt * timeScale) / world.dayLengthSec;
    shared.uTime.value += dt;

    if (input.hit('F3')) showStats = !showStats;
    if (input.hit('KeyH')) ui.toggleHelp();
    if (input.wheel) rig.dist = THREE.MathUtils.clamp(rig.dist + input.wheel * 0.8, 3.5, 14);

    // Movement (fixed steps for stable physics).
    const active = playing && !ui.paused && (input.locked || opts.shot) && !rig.transitioning;
    if (playing && input.hit('KeyM')) rig.setMode(rig.mode === 'follow' ? 'orbit' : 'follow', 1.4);
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
    const jumpHit = walk && input.hit('Space');
    acc += dt;
    const STEP = 1 / 60;
    let first = true;
    const before = V(me.pos);
    while (acc >= STEP) {
      stepMover(me, {
        forward: fwd, right: side, sprint: input.down('ShiftLeft') || input.down('ShiftRight'),
        jump: jumpHit && first, jet: walk && input.down('Space'), yaw: first ? yaw : 0,
      }, STEP, groundR, colliders);
      first = false;
      acc -= STEP;
    }
    if (first && yaw) me.heading = P(V(me.heading).applyAxisAngle(V(me.pos).normalize(), yaw));
    const pos = V(me.pos);
    travelled += pos.distanceTo(before);
    const up = tmpUp.copy(pos).normalize();

    // Goals.
    if (!reachedDome && pos.distanceTo(domePoint) < 6.5) { reachedDome = true; ui.toast('Shelter reached'); }
    if (!flewHigh && altitude(me, groundR) > 8) { flewHigh = true; ui.toast('Look at that view'); }
    if (frames % 15 === 0 && playing) ui.goals(goals());

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

    tmpCol.copy(cols.nightH).lerp(cols.dayH, day).lerp(cols.setH, sunset * 0.35).lerp(cols.dayZ, 0.35 * day);
    fog.color.copy(tmpCol);
    fog.density = 0.0038 * (1 - space);

    envTimer -= dt * (timeScale > 1 ? 6 : 1);
    if (envTimer <= 0) { refreshEnv(); envTimer = 1.5; }

    player.update(dt, pos, up, V(me.vel), V(me.heading), me.grounded, me.jetting, shared.uTime.value);
    rig.update(dt, pos, up, V(me.heading));
    ui.vitals(me.jetFuel, localClock(days, P(up)));
  };

  const render = () => {
    renderer.info.reset();
    post.composer.render();
  };

  // Shared for testing and tuning in the browser console.
  window.__game = {
    setTime: (offsetDays: number) => { days = t0 + offsetDays; envTimer = 0; },
    teleport: (fw: number, rt: number) => { const d = along(fw, rt); me.pos = P(d.multiplyScalar(terrain.groundRadius(P(d)) + 0.1)); },
    stats: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }),
    state: () => ({ pos: { ...me.pos }, grounded: me.grounded, fuel: me.jetFuel, alt: altitude(me, groundR), travelled }),
  };

  ui.loading('Ready', 1);
  await nextFrame();
  ui.hideLoading();
  if (!opts.skipTitle) ui.showTitle(begin);

  const loop = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    fpsAvg += (1 / Math.max(dt, 1e-3) - fpsAvg) * 0.05;
    update(opts.shot ? 1 / 60 : dt);
    render();
    if (showStats) {
      const i = renderer.info.render;
      ui.stats(`${fpsAvg.toFixed(0)} fps\n${i.calls} draw calls\n${(i.triangles / 1000).toFixed(0)}k triangles\n${scatter.instances.toLocaleString()} plants & rocks`);
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

// The base and its factory: suit oxygen and power, the shelter's air, power networks
// (shelter + pylons; solar, coal, batteries), machines that turn inputs into outputs,
// auto-drills, storage silos, conveyor belts and research. Plain TypeScript, unit-tested.
import { BELTS, MACHINES, SURVIVAL, type ItemId, type MachineId } from '../data/items';
import { RESEARCH, researchById } from '../data/research';
import { HARMONY } from '../data/harmony';
import { newHarmony, tickHarmony, harmonyValue, bandOf, type HarmonyState } from './harmony';

type Pos = { x: number; y: number; z: number };
type Bag = Partial<Record<ItemId, number>>;

export interface PlacedMachine {
  id: MachineId;
  pos: Pos;
  uid?: number;
  yaw?: number;
  inv?: Bag;            // inputs waiting (silo: everything stored)
  out?: Bag;            // finished items waiting for a belt or for you
  burn?: number;        // seconds left on the current job (drill: seconds of progress)
  charge?: number;      // battery: kWh stored
  mine?: ItemId | null; // drill: what it mines here
  rich?: number;        // drill: 0..1, how rich the ground is
  made?: number;        // items finished, ever
  fedByBelt?: number;   // items that arrived by belt, ever
  working?: boolean;    // did something useful in the last tick
  fuelOn?: boolean;     // burner: burning this tick
  fault?: boolean;      // needs attention (acid rain, grit, clogged petals): stops until you fix it (E)
  // Saves from before M2 (moved into inv/out by migrateBase):
  ice?: number; ore?: number; carbon?: number; plates?: number;
}

export interface BeltItem { id: ItemId; d: number }
export interface Belt { id: number; from: number; to: number; length: number; items: BeltItem[] }

export interface ResearchState { done: string[]; active: string | null; inv: Bag; progress: number }

export interface BaseState {
  oxygen: number;        // suit, 0..1
  power: number;         // suit, 0..1
  shelterO2: number;     // units in the shelter tank
  stored: number;        // kWh in the shelter network's batteries (kept for the HUD)
  machines: PlacedMachine[];
  belts: Belt[];
  blackouts: number;
  nextUid: number;
  research: ResearchState;
  harmony: HarmonyState;
}

export interface Tick {
  dt: number;
  inShelter: boolean;
  running: boolean;
  lasering: boolean;
  jetting: boolean;
  sunAt: (p: Pos) => number;            // daylight 0..1 at a machine
  nearShelter: (p: Pos) => boolean;     // inside the shelter's own power area
  random?: () => number;                // for machine faults (tests pass their own)
}

export interface TickResult {
  blackout: boolean;
  produceKW: number;      // shelter network
  useKW: number;
  capacity: number;
  making: boolean;        // an electrolyzer is making air
  smelting: boolean;
  researched: string | null;
  supply: Map<number, number>;   // machine uid → power ratio of its network (absent: no network)
  faults: PlacedMachine[];       // machines that needed attention this tick
}

export function newBase(): BaseState {
  return { oxygen: SURVIVAL.startOxygen, power: 1, shelterO2: 0, stored: 0, machines: [], belts: [], blackouts: 0, nextUid: 1, research: { done: [], active: null, inv: {}, progress: 0 }, harmony: newHarmony() };
}

/** Brings older saves and hand-made states up to date: ids, buffers, belts, research. */
export function migrateBase(b: BaseState): BaseState {
  b.belts ??= [];
  b.research ??= { done: [], active: null, inv: {}, progress: 0 };
  b.nextUid ??= 1;
  b.harmony ??= newHarmony();
  const batteries = b.machines.filter((m) => m.id === 'battery' && m.charge === undefined);
  for (const m of b.machines) {
    if (m.uid === undefined) m.uid = b.nextUid++;
    if (m.ice !== undefined) { add(inv(m), 'ice', m.ice); delete m.ice; }
    if (m.ore !== undefined) { add(inv(m), 'iron_ore', m.ore); delete m.ore; }
    if (m.carbon !== undefined) { add(inv(m), 'carbon', m.carbon); delete m.carbon; }
    if (m.plates !== undefined) { add(outOf(m), 'iron_plate', m.plates); delete m.plates; }
  }
  for (const m of batteries) m.charge = (b.stored ?? 0) / batteries.length;
  return b;
}

export function addMachine(b: BaseState, m: PlacedMachine): PlacedMachine {
  m.uid ??= b.nextUid++;
  b.nextUid = Math.max(b.nextUid, m.uid + 1);
  b.machines.push(m);
  return m;
}

/** Removes a machine and every belt touching it; returns what they held (and the belts' conveyor items). */
export function removeMachine(b: BaseState, m: PlacedMachine): Bag {
  const back: Bag = {};
  for (const [k, v] of Object.entries(m.inv ?? {})) add(back, k as ItemId, v ?? 0);
  for (const [k, v] of Object.entries(m.out ?? {})) add(back, k as ItemId, v ?? 0);
  for (const belt of b.belts.filter((x) => x.from === m.uid || x.to === m.uid)) {
    for (const [k, v] of Object.entries(removeBelt(b, belt))) add(back, k as ItemId, v ?? 0);
  }
  b.machines = b.machines.filter((x) => x !== m);
  return back;
}

export function removeBelt(b: BaseState, belt: Belt): Bag {
  const back: Bag = {};
  for (const it of belt.items) add(back, it.id, 1);
  add(back, 'conveyor', beltCost(belt.length));
  b.belts = b.belts.filter((x) => x !== belt);
  return back;
}

export const beltCost = (length: number) => Math.max(1, Math.ceil(length / BELTS.metresPerItem));

/** Can a belt run from machine `from` to machine `to`? Returns a reason when it cannot. */
export function beltProblem(b: BaseState, from: PlacedMachine, to: PlacedMachine, length: number): string | null {
  if (from === to) return 'Pick a different machine';
  if (length > BELTS.maxLength) return `Too long (${Math.round(length)} m, max ${BELTS.maxLength} m)`;
  if (!hasOutput(from)) return `${MACHINES[from.id].name} makes nothing to send`;
  if (!takesAnything(to)) return `${MACHINES[to.id].name} takes nothing in`;
  if (b.belts.some((x) => x.from === from.uid)) return `${MACHINES[from.id].name} already sends a belt`;
  if (b.belts.filter((x) => x.to === to.uid).length >= BELTS.maxIn) return `${MACHINES[to.id].name} already has ${BELTS.maxIn} belts in`;
  return null;
}

export function addBelt(b: BaseState, from: PlacedMachine, to: PlacedMachine, length: number): Belt {
  const belt: Belt = { id: b.nextUid++, from: from.uid!, to: to.uid!, length, items: [] };
  b.belts.push(belt);
  return belt;
}

export const hasOutput = (m: PlacedMachine) => { const d = MACHINES[m.id]; return !!(d.process?.makes || d.drill || d.storage); };
export const takesAnything = (m: PlacedMachine) => { const d = MACHINES[m.id]; return !!(d.accepts || d.storage || d.research); };

/** Gives one item to a machine if it has room for it. */
export function accept(b: BaseState, m: PlacedMachine, item: ItemId): boolean {
  const d = MACHINES[m.id];
  if (d.accepts) {
    const cap = d.accepts[item];
    if (cap === undefined || (m.inv?.[item] ?? 0) >= cap) return false;
    add(inv(m), item, 1);
    return true;
  }
  if (d.storage) {
    if (total(m.inv) >= d.storage) return false;
    add(inv(m), item, 1);
    return true;
  }
  if (d.research) {
    const node = b.research.active ? researchById(b.research.active) : null;
    if (!node || (b.research.inv[item] ?? 0) >= (node.needs[item] ?? 0)) return false;
    add(b.research.inv, item, 1);
    return true;
  }
  return false;
}

/** Takes one finished item from a machine for a belt (silos give what they store). */
function takeForBelt(m: PlacedMachine, last: { k?: ItemId }): ItemId | null {
  const src = MACHINES[m.id].storage ? m.inv : m.out;
  if (!src) return null;
  const keys = (Object.keys(src) as ItemId[]).filter((k) => (src[k] ?? 0) > 0);
  if (!keys.length) return null;
  // Round-robin so a silo of mixed items sends a mix.
  const i = last.k ? (keys.indexOf(last.k) + 1) % keys.length : 0;
  const k = keys[Math.max(0, i)];
  src[k] = (src[k] ?? 0) - 1;
  last.k = k;
  return k;
}
const lastSent = new WeakMap<Belt, { k?: ItemId }>();

/** Which machines share power: the shelter's area, extended by chains of pylons. */
export function powerNetworks(b: BaseState, nearShelter: (p: Pos) => boolean) {
  const pylons = b.machines.filter((m) => m.id === 'power_pylon');
  const parent = new Map<number, number>();               // pylon uid → parent (0 = shelter)
  const find = (x: number): number => { while (parent.get(x) !== x) { const p = parent.get(x)!; parent.set(x, parent.get(p)!); x = p; } return x; };
  parent.set(0, 0);
  for (const p of pylons) parent.set(p.uid!, p.uid!);
  const link = (a: number, c: number) => { const ra = find(a), rc = find(c); if (ra !== rc) parent.set(Math.max(ra, rc), Math.min(ra, rc)); };
  const links: [PlacedMachine | null, PlacedMachine][] = [];  // null = the shelter
  for (const p of pylons) if (nearShelter(p.pos)) { link(0, p.uid!); links.push([null, p]); }
  for (let i = 0; i < pylons.length; i++) for (let j = i + 1; j < pylons.length; j++) {
    const a = pylons[i], c = pylons[j];
    if (dist(a.pos, c.pos) <= Math.min(MACHINES.power_pylon.pylon!.link, 26)) { link(a.uid!, c.uid!); links.push([a, c]); }
  }
  const netOf = new Map<number, number>();                // machine uid → network root (0 = shelter's)
  for (const m of b.machines) {
    if (m.id === 'power_pylon') { netOf.set(m.uid!, find(m.uid!)); continue; }
    if (nearShelter(m.pos)) { netOf.set(m.uid!, 0); continue; }
    let best: PlacedMachine | null = null, bd = MACHINES.power_pylon.pylon!.range;
    for (const p of pylons) { const d = dist(m.pos, p.pos); if (d <= bd) { bd = d; best = p; } }
    if (best) netOf.set(m.uid!, find(best.uid!));
  }
  return { netOf, links };
}

const effectOn = (b: BaseState, id: string) => b.research.done.includes(id);

/** Can this machine start (or keep doing) its job right now? */
function wantsPower(b: BaseState, m: PlacedMachine): boolean {
  const d = MACHINES[m.id];
  if (m.fault) return false;
  if (d.filter) return true;
  if (d.process && !d.process.fuel) return (m.burn ?? 0) > 0 || (canStart(m) && outRoom(m));
  if (d.drill) return !!m.mine && outRoom(m);
  if (d.research) return researchReady(b);
  return false;
}
const canStart = (m: PlacedMachine) => !m.fault && Object.entries(MACHINES[m.id].process?.needs ?? {}).every(([k, n]) => (m.inv?.[k as ItemId] ?? 0) >= (n ?? 0));
const outRoom = (m: PlacedMachine) => { const d = MACHINES[m.id]; return d.process?.vent || d.outCap === undefined || total(m.out) < d.outCap; };
export function researchReady(b: BaseState): boolean {
  const node = b.research.active ? researchById(b.research.active) : null;
  return !!node && Object.entries(node.needs).every(([k, n]) => (b.research.inv[k as ItemId] ?? 0) >= (n ?? 0));
}

export function tickBase(b: BaseState, t: Tick): TickResult {
  migrateBase(b);
  const dt = t.dt;
  const hours = dt * SURVIVAL.gameHoursPerSecond;
  const { netOf } = powerNetworks(b, t.nearShelter);
  const nets = new Map<number, PlacedMachine[]>();
  for (const m of b.machines) { const n = netOf.get(m.uid!); if (n !== undefined) { if (!nets.has(n)) nets.set(n, []); nets.get(n)!.push(m); } }
  if (!nets.has(0)) nets.set(0, []);

  const supply = new Map<number, number>();
  const solarMult = effectOn(b, 'solar_plus') ? 1.25 : 1;
  let shelterProduce = 0, shelterUse = 0, shelterCap = 0, making = false, smelting = false, researched: string | null = null;
  const wantSuit = t.inShelter && b.power < 1 ? SURVIVAL.suitChargeKW : 0;

  for (const [net, ms] of nets) {
    // Burners keep burning whether or not anyone needs the power.
    for (const m of ms) {
      const p = MACHINES[m.id].process;
      if (!p?.fuel) continue;
      if (m.fault) { m.fuelOn = false; continue; }
      if ((m.burn ?? 0) <= 0 && canStart(m)) { take(m, p.needs); m.burn = p.seconds; }
      if ((m.burn ?? 0) > 0) m.burn = Math.max(0, (m.burn ?? 0) - dt);
      m.fuelOn = (m.burn ?? 0) > 0;
    }
    let produce = 0, demand = net === 0 ? wantSuit : 0;
    for (const m of ms) {
      const d = MACHINES[m.id];
      if (m.id === 'solar_lotus') produce += d.powerKW * t.sunAt(m.pos) * solarMult * (m.fault ? 0.3 : 1);
      else if (d.process?.fuel) { if (m.fuelOn) produce += d.powerKW; }
      else if (d.powerKW < 0 && wantsPower(b, m)) demand += -d.powerKW;
    }
    const batteries = ms.filter((m) => m.id === 'battery');
    const capacity = batteries.length * (MACHINES.battery.storeKWh ?? 0);
    let stored = batteries.reduce((s, m) => s + (m.charge ?? 0), 0);
    const canDraw = stored / Math.max(hours, 1e-6);
    const supplied = Math.min(demand, produce + canDraw);
    const ratio = demand > 0 ? supplied / demand : 1;
    stored = Math.max(0, Math.min(capacity, stored + (produce - demand) * hours));
    for (const m of batteries) m.charge = stored / batteries.length;
    for (const m of ms) supply.set(m.uid!, ratio);

    for (const m of ms) {
      const d = MACHINES[m.id];
      m.working = false;
      if (m.fault) continue;
      if (d.process && !d.process.fuel) {
        if ((m.burn ?? 0) <= 0 && canStart(m) && outRoom(m)) { take(m, d.process.needs); m.burn = d.process.seconds; }
        if ((m.burn ?? 0) > 0 && ratio > 0.2) {
          m.working = true;
          const step = Math.min(m.burn ?? 0, dt * ratio);
          m.burn = (m.burn ?? 0) - step;
          if (d.process.o2) { b.shelterO2 = Math.min(SURVIVAL.shelterO2Capacity, b.shelterO2 + (d.process.o2 / d.process.seconds) * step); making = true; }
          if (m.id === 'smelter') smelting = true;
          if ((m.burn ?? 0) <= 1e-9) {
            m.burn = 0;
            const full = d.process.vent && d.outCap !== undefined && total(m.out) >= d.outCap;   // vented gas is simply let go
            if (!full) for (const [k, n] of Object.entries(d.process.makes ?? {})) add(outOf(m), k as ItemId, n ?? 0);
            if (d.process.makes) m.made = (m.made ?? 0) + 1;
          }
        }
      } else if (d.filter) {
        m.working = d.powerKW >= 0 || ratio > 0.2;
      } else if (d.drill && m.mine && outRoom(m) && ratio > 0.2) {
        m.working = true;
        const speed = effectOn(b, 'drill_plus') ? 1.5 : 1;
        const per = d.drill.seconds / Math.max(0.25, m.rich ?? 1);
        m.burn = (m.burn ?? 0) + dt * ratio * speed;
        while ((m.burn ?? 0) >= per && outRoom(m)) { m.burn = (m.burn ?? 0) - per; add(outOf(m), m.mine, 1); m.made = (m.made ?? 0) + 1; }
      } else if (d.research && researchReady(b) && ratio > 0.2) {
        m.working = true;
        const node = researchById(b.research.active!)!;
        b.research.progress += dt * ratio;
        if (b.research.progress >= node.seconds) {
          b.research.done.push(node.id);
          b.research.active = null; b.research.inv = {}; b.research.progress = 0;
          researched = node.id;
        }
      }
    }
    if (net === 0) { shelterProduce = produce; shelterUse = supplied; shelterCap = capacity; b.stored = stored; }
    if (net === 0 && wantSuit > 0 && t.inShelter) b.power = Math.min(1, b.power + 0.05 * dt * ratio);
  }

  tickBelts(b, dt);

  // Harmony: working machines dirty or clean the world; when it suffers, machines need attention.
  const working = b.machines.filter((m) => m.working || m.fuelOn).map((m) => m.id);
  tickHarmony(b.harmony, working, dt, { clean: effectOn(b, 'clean_smelting'), filter2: effectOn(b, 'bloom_filter') });
  const faults: PlacedMachine[] = [];
  const band = bandOf(harmonyValue(b.harmony));
  const perMin = band === 'collapse' ? HARMONY.faultPerMinute.collapse : band === 'stressed' ? HARMONY.faultPerMinute.stressed : 0;
  if (perMin > 0) {
    const rnd = t.random ?? Math.random;
    for (const m of b.machines) {
      if (m.fault || m.id === 'power_pylon' || m.id === 'battery') continue;
      if (rnd() < perMin * dt / 60) { m.fault = true; faults.push(m); }
    }
  }

  // Suit.
  if (t.inShelter && b.shelterO2 > 0 && b.oxygen < 1) {
    const takeO2 = Math.min(b.shelterO2, (1 - b.oxygen) * 100, 12 * dt);
    b.shelterO2 -= takeO2;
    b.oxygen = Math.min(1, b.oxygen + takeO2 / 100);
  } else if (!t.inShelter) {
    b.oxygen -= (dt / SURVIVAL.oxygenSeconds) * (t.running ? SURVIVAL.sprintO2 : 1);
  }
  b.power -= dt * (SURVIVAL.suitDrainPerSec * (t.running ? 2 : 1) + (t.lasering ? SURVIVAL.laserDrainPerSec : 0));
  b.power = Math.max(0, b.power);

  let blackout = false;
  if (b.oxygen <= 0) {
    blackout = true;
    b.blackouts++;
    b.oxygen = SURVIVAL.wakeOxygen;
    b.power = Math.max(b.power, 0.3);
  }
  return { blackout, produceKW: shelterProduce, useKW: shelterUse, capacity: shelterCap, making, smelting, researched, supply, faults };
}

/** Moves items along belts, hands them over at the far end, and loads new ones at the start. */
export function tickBelts(b: BaseState, dt: number) {
  const byUid = new Map(b.machines.map((m) => [m.uid!, m]));
  for (const belt of b.belts) {
    const from = byUid.get(belt.from), to = byUid.get(belt.to);
    if (!from || !to) continue;
    // Items are kept front first: items[0] is nearest the end.
    for (let i = 0; i < belt.items.length; i++) {
      const limit = i === 0 ? belt.length : belt.items[i - 1].d - BELTS.spacing;
      belt.items[i].d = Math.min(limit, belt.items[i].d + BELTS.speed * dt);
    }
    while (belt.items.length && belt.items[0].d >= belt.length - 1e-6 && accept(b, to, belt.items[0].id)) {
      belt.items.shift();
      to.fedByBelt = (to.fedByBelt ?? 0) + 1;
    }
    const lastItem = belt.items[belt.items.length - 1];
    if (!lastItem || lastItem.d >= BELTS.spacing) {
      if (!lastSent.has(belt)) lastSent.set(belt, {});
      const k = takeForBelt(from, lastSent.get(belt)!);
      if (k) belt.items.push({ id: k, d: 0 });
    }
  }
}

/** Starts a research node if it is available. */
export function startResearch(b: BaseState, id: string): boolean {
  const node = researchById(id);
  if (!node || b.research.done.includes(id) || !node.requires.every((r) => b.research.done.includes(r))) return false;
  if (b.research.active === id) return true;
  b.research.active = id; b.research.inv = {}; b.research.progress = 0;
  return true;
}

export const researchAvailable = (b: BaseState) =>
  RESEARCH.filter((n) => !b.research.done.includes(n.id) && n.requires.every((r) => b.research.done.includes(r)));

export function capacityKWh(b: BaseState): number {
  return b.machines.filter((m) => m.id === 'battery').length * (MACHINES.battery.storeKWh ?? 0);
}

// ── helpers ──
const inv = (m: PlacedMachine) => (m.inv ??= {});
const outOf = (m: PlacedMachine) => (m.out ??= {});
function add(bag: Bag, k: ItemId, n: number) { if (n) bag[k] = (bag[k] ?? 0) + n; }
function take(m: PlacedMachine, needs: Bag) { for (const [k, n] of Object.entries(needs)) inv(m)[k as ItemId] = (m.inv![k as ItemId] ?? 0) - (n ?? 0); }
export const total = (bag?: Bag) => Object.values(bag ?? {}).reduce((s, n) => s + (n ?? 0), 0);
const dist = (a: Pos, c: Pos) => Math.hypot(a.x - c.x, a.y - c.y, a.z - c.z);

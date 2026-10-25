// Survival and the starting base: suit oxygen and power, the shelter's air supply,
// and a simple power grid (solar → battery → electrolyzer, suit charging).
import { MACHINES, SURVIVAL, type MachineId } from '../data/items';

export interface PlacedMachine { id: MachineId; pos: { x: number; y: number; z: number }; ice?: number; burn?: number }

export interface BaseState {
  oxygen: number;        // suit, 0..1
  power: number;         // suit, 0..1
  shelterO2: number;     // units in the shelter tank
  stored: number;        // kWh in batteries
  machines: PlacedMachine[];
  blackouts: number;
}

export interface Tick {
  dt: number;
  inShelter: boolean;
  running: boolean;
  lasering: boolean;
  jetting: boolean;
  sunAt: (p: { x: number; y: number; z: number }) => number; // daylight 0..1 at a machine
  nearShelter: (p: { x: number; y: number; z: number }) => boolean;
}

export interface TickResult { blackout: boolean; produceKW: number; useKW: number; capacity: number; making: boolean }

export function newBase(): BaseState {
  return { oxygen: SURVIVAL.startOxygen, power: 1, shelterO2: 0, stored: 0, machines: [], blackouts: 0 };
}

export function capacityKWh(b: BaseState): number {
  return b.machines.filter((m) => m.id === 'battery').length * (MACHINES.battery.storeKWh ?? 0);
}

export function tickBase(b: BaseState, t: Tick): TickResult {
  const dt = t.dt;
  const hours = dt * SURVIVAL.gameHoursPerSecond;
  // Power grid around the shelter.
  let produce = 0, use = 0;
  const grid = b.machines.filter((m) => t.nearShelter(m.pos));
  for (const m of grid) if (m.id === 'solar_lotus') produce += MACHINES.solar_lotus.powerKW * t.sunAt(m.pos);
  const capacity = grid.filter((m) => m.id === 'battery').length * (MACHINES.battery.storeKWh ?? 0);
  const electrolyzers = grid.filter((m) => m.id === 'electrolyzer');
  let making = false;
  const wantSuit = t.inShelter && b.power < 1 ? SURVIVAL.suitChargeKW : 0;
  const wantElec = electrolyzers.filter((e) => (e.ice ?? 0) > 0 || (e.burn ?? 0) > 0).length * -MACHINES.electrolyzer.powerKW;
  const demand = wantSuit + wantElec;
  // Use solar first, then batteries; surplus charges batteries.
  const fromBattery = Math.max(0, demand - produce);
  const canDraw = b.stored / Math.max(hours, 1e-6);
  const supplied = Math.min(demand, produce + canDraw);
  const ratio = demand > 0 ? supplied / demand : 1;
  b.stored = Math.max(0, Math.min(capacity, b.stored + (produce - demand) * hours * (fromBattery > 0 ? 1 : 1)));
  use = supplied;

  // Electrolyzers turn ice into shelter oxygen when powered.
  for (const e of electrolyzers) {
    if ((e.burn ?? 0) <= 0 && (e.ice ?? 0) > 0) { e.ice = (e.ice ?? 0) - 1; e.burn = SURVIVAL.iceBurnSeconds; }
    if ((e.burn ?? 0) > 0 && ratio > 0.2) {
      const step = dt * ratio;
      e.burn = Math.max(0, (e.burn ?? 0) - step);
      b.shelterO2 = Math.min(SURVIVAL.shelterO2Capacity, b.shelterO2 + (SURVIVAL.o2PerIce / SURVIVAL.iceBurnSeconds) * step);
      making = true;
    }
  }

  // Suit.
  if (t.inShelter && b.shelterO2 > 0 && b.oxygen < 1) {
    const take = Math.min(b.shelterO2, (1 - b.oxygen) * 100, 12 * dt);
    b.shelterO2 -= take;
    b.oxygen = Math.min(1, b.oxygen + take / 100);
  } else if (!t.inShelter) {
    b.oxygen -= (dt / SURVIVAL.oxygenSeconds) * (t.running ? SURVIVAL.sprintO2 : 1);
  }
  if (t.inShelter && wantSuit > 0) b.power = Math.min(1, b.power + 0.05 * dt * ratio);
  b.power -= dt * (SURVIVAL.suitDrainPerSec * (t.running ? 2 : 1) + (t.lasering ? SURVIVAL.laserDrainPerSec : 0));
  b.power = Math.max(0, b.power);

  let blackout = false;
  if (b.oxygen <= 0) {
    blackout = true;
    b.blackouts++;
    b.oxygen = SURVIVAL.wakeOxygen;
    b.power = Math.max(b.power, 0.3);
  }
  return { blackout, produceKW: produce, useKW: use, capacity, making };
}

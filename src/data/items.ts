// Items, mining yields, recipes and machines for Chapter 1. Numbers are starting values (tune).
import { Mat } from '../core/geology';

export type ItemId = 'ice' | 'iron_ore' | 'silica' | 'carbon' | 'o2_canister' | 'electrolyzer' | 'battery' | 'solar_lotus';

export interface ItemDef { id: ItemId; name: string; color: string; stack: number; placeable?: MachineId; note: string }

export const ITEMS: Record<ItemId, ItemDef> = {
  ice: { id: 'ice', name: 'Ice', color: '#a8e6ff', stack: 50, note: 'Frozen water. Split it for oxygen.' },
  iron_ore: { id: 'iron_ore', name: 'Iron ore', color: '#c0563a', stack: 50, note: 'Rust-red rock rich in iron oxide (Fe₂O₃).' },
  silica: { id: 'silica', name: 'Silica', color: '#f1e3c4', stack: 50, note: 'Sandstone grains (SiO₂). Glass and solar cells start here.' },
  carbon: { id: 'carbon', name: 'Carbon', color: '#3a3440', stack: 50, note: 'Black seams of ancient plant matter.' },
  o2_canister: { id: 'o2_canister', name: 'O₂ canister', color: '#5cc8ff', stack: 10, note: 'Press Q to breathe it: +40% oxygen.' },
  electrolyzer: { id: 'electrolyzer', name: 'Electrolyzer', color: '#7fd6ff', stack: 3, placeable: 'electrolyzer', note: 'Splits ice into oxygen and hydrogen. Feeds your shelter.' },
  battery: { id: 'battery', name: 'Battery', color: '#5cffd6', stack: 5, placeable: 'battery', note: 'Stores solar power for the night.' },
  solar_lotus: { id: 'solar_lotus', name: 'Solar lotus', color: '#4a6cff', stack: 5, placeable: 'solar_lotus', note: 'Turns sunlight into power. Useless at night.' },
};

/** Cubic metres of each material that make one item when mined. Soil gives nothing. */
export const YIELD: Partial<Record<Mat, { item: ItemId; perM3: number }>> = {
  [Mat.Rock]: { item: 'silica', perM3: 0.9 },
  [Mat.DeepRock]: { item: 'silica', perM3: 0.9 },
  [Mat.Iron]: { item: 'iron_ore', perM3: 2.2 },
  [Mat.Ice]: { item: 'ice', perM3: 2.2 },
  [Mat.Carbon]: { item: 'carbon', perM3: 2.2 },
};

export interface Recipe { out: ItemId; n: number; needs: Partial<Record<ItemId, number>> }

export const RECIPES: Recipe[] = [
  { out: 'electrolyzer', n: 1, needs: { iron_ore: 6, silica: 4 } },
  { out: 'battery', n: 1, needs: { iron_ore: 4, carbon: 4 } },
  { out: 'solar_lotus', n: 1, needs: { silica: 8, iron_ore: 3 } },
  { out: 'o2_canister', n: 1, needs: { ice: 3 } },
];

export type MachineId = 'electrolyzer' | 'battery' | 'solar_lotus';

export interface MachineDef { id: MachineId; name: string; radius: number; powerKW: number; storeKWh?: number; note: string }

export const MACHINES: Record<MachineId, MachineDef> = {
  solar_lotus: { id: 'solar_lotus', name: 'Solar lotus', radius: 0.6, powerKW: 4, note: 'Makes up to 4 kW in full sun.' },
  battery: { id: 'battery', name: 'Battery', radius: 0.6, powerKW: 0, storeKWh: 20, note: 'Stores 20 kWh.' },
  electrolyzer: { id: 'electrolyzer', name: 'Electrolyzer', radius: 0.7, powerKW: -2.5, note: 'Uses 2.5 kW and ice to make oxygen for the shelter.' },
};

export const SURVIVAL = {
  oxygenSeconds: 240,        // a full suit tank outside
  startOxygen: 0.45,
  sprintO2: 1.6,             // drain multiplier while running
  suitDrainPerSec: 0.004,    // walking
  laserDrainPerSec: 0.035,
  wakeOxygen: 0.35,
  shelterRadius: 3.0,
  shelterO2Capacity: 100,    // units; standing inside refills the suit from here
  electrolyzerIcePerUnit: 1, // one ice → 6 units of shelter oxygen
  o2PerIce: 6,
  iceBurnSeconds: 6,         // seconds per ice while powered
  gridRadius: 30,            // machines this close to the shelter share power
  suitChargeKW: 1,
  gameHoursPerSecond: 24 / 360,
};

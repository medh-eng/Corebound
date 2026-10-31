// Items, mining yields, recipes and machines for Chapter 1. Numbers are starting values (tune).
import { Mat } from '../core/geology';

export type ItemId =
  | 'ice' | 'iron_ore' | 'silica' | 'carbon' | 'iron_plate' | 'silicon' | 'o2_canister' | 'conveyor'
  | 'hydrogen' | 'methane' | 'bloom'
  | 'electrolyzer' | 'battery' | 'solar_lotus' | 'smelter'
  | 'research_station' | 'auto_drill' | 'storage_silo' | 'power_pylon' | 'coal_burner' | 'silicon_furnace'
  | 'bio_filter' | 'settling_pond' | 'sabatier_reactor';

export interface ItemDef { id: ItemId; name: string; color: string; stack: number; placeable?: MachineId; note: string }

export const ITEMS: Record<ItemId, ItemDef> = {
  ice: { id: 'ice', name: 'Ice', color: '#a8e6ff', stack: 50, note: 'Frozen water. Split it for oxygen.' },
  iron_ore: { id: 'iron_ore', name: 'Iron ore', color: '#c0563a', stack: 50, note: 'Rust-red rock rich in iron oxide (Fe₂O₃).' },
  silica: { id: 'silica', name: 'Silica', color: '#f1e3c4', stack: 50, note: 'Sandstone grains (SiO₂). Glass and solar cells start here.' },
  carbon: { id: 'carbon', name: 'Carbon', color: '#3a3440', stack: 50, note: 'Black seams of ancient plant matter.' },
  iron_plate: { id: 'iron_plate', name: 'Iron plate', color: '#9aa3ad', stack: 50, note: 'Smelted iron. Carbon pulls the oxygen out of the ore (and leaves smoke).' },
  silicon: { id: 'silicon', name: 'Silicon', color: '#7b8ea8', stack: 50, note: 'Pure silicon, baked out of silica with carbon. The heart of solar cells and chips.' },
  o2_canister: { id: 'o2_canister', name: 'O₂ canister', color: '#5cc8ff', stack: 10, note: 'Press Q to breathe it: +40% oxygen.' },
  hydrogen: { id: 'hydrogen', name: 'Hydrogen', color: '#e6f0ff', stack: 50, note: 'Left over when the electrolyzer splits water. A Sabatier reactor turns it into fuel.' },
  methane: { id: 'methane', name: 'Methane', color: '#8fd16a', stack: 50, note: 'Fuel made from CO₂ and hydrogen. Rockets will need it.' },
  bloom: { id: 'bloom', name: 'Bloom', color: '#ff9ad5', stack: 20, note: 'A rare glowing flower that only grows where the air, water and soil are clean.' },
  conveyor: { id: 'conveyor', name: 'Conveyor', color: '#d9b48a', stack: 50, note: 'Belt sections, 2 m each. Press C to lay a belt from one machine to another.' },
  electrolyzer: { id: 'electrolyzer', name: 'Electrolyzer', color: '#7fd6ff', stack: 3, placeable: 'electrolyzer', note: 'Splits ice into oxygen and hydrogen. Feeds your shelter.' },
  battery: { id: 'battery', name: 'Battery', color: '#5cffd6', stack: 5, placeable: 'battery', note: 'Stores solar power for the night.' },
  solar_lotus: { id: 'solar_lotus', name: 'Solar lotus', color: '#4a6cff', stack: 5, placeable: 'solar_lotus', note: 'Turns sunlight into power. Useless at night.' },
  smelter: { id: 'smelter', name: 'Smelter', color: '#e08a3a', stack: 3, placeable: 'smelter', note: 'Turns iron ore and carbon into iron plates. Needs 3 kW. Smokes.' },
  research_station: { id: 'research_station', name: 'Research station', color: '#9fe8ff', stack: 2, placeable: 'research_station', note: 'Works out new machines from the parts you give it.' },
  auto_drill: { id: 'auto_drill', name: 'Auto-drill', color: '#f0b46a', stack: 5, placeable: 'auto_drill', note: 'Mines whatever lies under it, forever. Place it over rich ground.' },
  storage_silo: { id: 'storage_silo', name: 'Storage silo', color: '#e8dcc6', stack: 3, placeable: 'storage_silo', note: 'Holds 300 items. Belts can fill it and empty it.' },
  power_pylon: { id: 'power_pylon', name: 'Power pylon', color: '#ffcf6a', stack: 10, placeable: 'power_pylon', note: 'Carries power 14 m further. Pylons link to each other up to 26 m apart.' },
  coal_burner: { id: 'coal_burner', name: 'Coal burner', color: '#c25a3a', stack: 3, placeable: 'coal_burner', note: 'Burns carbon for 5 kW, day and night. Smoky.' },
  silicon_furnace: { id: 'silicon_furnace', name: 'Silicon furnace', color: '#b7c6e0', stack: 3, placeable: 'silicon_furnace', note: 'Bakes silica with carbon into silicon. Needs 3 kW.' },
  bio_filter: { id: 'bio_filter', name: 'Bio-filter', color: '#5fd38a', stack: 3, placeable: 'bio_filter', note: 'Algae clean the air while it has power.' },
  settling_pond: { id: 'settling_pond', name: 'Settling pond', color: '#6fb6c9', stack: 3, placeable: 'settling_pond', note: 'Lets mud and grit sink out of dirty water. Cleans water and soil, needs no power.' },
  sabatier_reactor: { id: 'sabatier_reactor', name: 'Sabatier reactor', color: '#9fd16a', stack: 2, placeable: 'sabatier_reactor', note: 'Turns CO₂ from the air and hydrogen into methane fuel and water.' },
};

/** Cubic metres of each material that make one item when mined. Soil gives nothing. */
export const YIELD: Partial<Record<Mat, { item: ItemId; perM3: number }>> = {
  [Mat.Soil]: { item: 'silica', perM3: 0.45 },   // sandy topsoil
  [Mat.Rock]: { item: 'silica', perM3: 0.9 },
  [Mat.DeepRock]: { item: 'silica', perM3: 0.9 },
  [Mat.Iron]: { item: 'iron_ore', perM3: 2.2 },
  [Mat.Ice]: { item: 'ice', perM3: 2.2 },
  [Mat.Carbon]: { item: 'carbon', perM3: 2.2 },
};

/** `research`: the research node that must be finished before this can be crafted. */
export interface Recipe { out: ItemId; n: number; needs: Partial<Record<ItemId, number>>; research?: string }

export const RECIPES: Recipe[] = [
  { out: 'electrolyzer', n: 1, needs: { iron_ore: 6, silica: 4 } },
  { out: 'battery', n: 1, needs: { iron_ore: 4, carbon: 4 } },
  { out: 'smelter', n: 1, needs: { silica: 10, iron_ore: 6, carbon: 2 } },
  { out: 'solar_lotus', n: 1, needs: { silica: 8, iron_plate: 2 } },
  { out: 'o2_canister', n: 1, needs: { ice: 3 } },
  { out: 'research_station', n: 1, needs: { iron_plate: 6, silica: 6, carbon: 2 } },
  { out: 'auto_drill', n: 1, needs: { iron_plate: 6, silica: 4 }, research: 'auto_drill' },
  { out: 'conveyor', n: 2, needs: { iron_plate: 1 }, research: 'conveyor' },
  { out: 'storage_silo', n: 1, needs: { iron_plate: 8, silica: 10 }, research: 'storage_silo' },
  { out: 'power_pylon', n: 1, needs: { iron_plate: 2, carbon: 1 }, research: 'power_pylon' },
  { out: 'coal_burner', n: 1, needs: { iron_plate: 6, silica: 8 }, research: 'coal_burner' },
  { out: 'silicon_furnace', n: 1, needs: { iron_plate: 8, silica: 12, carbon: 2 }, research: 'silicon_furnace' },
  { out: 'bio_filter', n: 1, needs: { iron_plate: 4, silica: 6, ice: 4 }, research: 'bio_filter' },
  { out: 'settling_pond', n: 1, needs: { silica: 12, iron_plate: 2 }, research: 'settling_pond' },
  { out: 'sabatier_reactor', n: 1, needs: { iron_plate: 8, silicon: 4 }, research: 'sabatier_reactor' },
];

export type MachineId = 'electrolyzer' | 'battery' | 'solar_lotus' | 'smelter'
  | 'research_station' | 'auto_drill' | 'storage_silo' | 'power_pylon' | 'coal_burner' | 'silicon_furnace'
  | 'bio_filter' | 'settling_pond' | 'sabatier_reactor';

/** What a machine does with its inputs. `o2` sends shelter oxygen instead of items;
 *  `fuel` means it burns its input to make power and needs no power itself. */
export interface Process { needs: Partial<Record<ItemId, number>>; makes?: Partial<Record<ItemId, number>>; seconds: number; o2?: number; fuel?: boolean; vent?: boolean }

export interface MachineDef {
  id: MachineId; name: string; note: string;
  radius: number;              // metres (collision and spacing)
  height: number;              // metres (for tags and belt ends)
  powerKW: number;             // + makes power, − uses it while working
  storeKWh?: number;
  accepts?: Partial<Record<ItemId, number>>; // input buffer: item → how many it holds
  process?: Process;
  outCap?: number;             // finished items it holds before stopping
  storage?: number;            // silo capacity (any items)
  drill?: { seconds: number }; // seconds per item over rich ground
  research?: boolean;
  pylon?: { range: number; link: number };
  filter?: boolean;            // works whenever it has power (bio-filter), or always if it needs none
}

export const MACHINES: Record<MachineId, MachineDef> = {
  solar_lotus: { id: 'solar_lotus', name: 'Solar lotus', radius: 0.6, height: 2.6, powerKW: 4, note: 'Makes up to 4 kW in full sun.' },
  battery: { id: 'battery', name: 'Battery', radius: 0.6, height: 1.5, powerKW: 0, storeKWh: 20, note: 'Stores 20 kWh.' },
  electrolyzer: {
    id: 'electrolyzer', name: 'Electrolyzer', radius: 0.8, height: 1.7, powerKW: -2.5, note: 'Uses 2.5 kW and ice to make oxygen for the shelter.',
    accepts: { ice: 20 }, process: { needs: { ice: 1 }, makes: { hydrogen: 1 }, seconds: 6, o2: 6, vent: true }, outCap: 20,
  },
  smelter: {
    id: 'smelter', name: 'Smelter', radius: 1.1, height: 2.6, powerKW: -3, note: 'Uses 3 kW. 2 iron ore + 1 carbon → 1 iron plate.',
    accepts: { iron_ore: 20, carbon: 10 }, process: { needs: { iron_ore: 2, carbon: 1 }, makes: { iron_plate: 1 }, seconds: 8 }, outCap: 20,
  },
  silicon_furnace: {
    id: 'silicon_furnace', name: 'Silicon furnace', radius: 0.7, height: 2.4, powerKW: -3, note: 'Uses 3 kW. 2 silica + 1 carbon → 1 silicon.',
    accepts: { silica: 20, carbon: 10 }, process: { needs: { silica: 2, carbon: 1 }, makes: { silicon: 1 }, seconds: 10 }, outCap: 20,
  },
  coal_burner: {
    id: 'coal_burner', name: 'Coal burner', radius: 1.1, height: 2.2, powerKW: 5, note: 'Makes 5 kW while it has carbon (one every 30 s).',
    accepts: { carbon: 20 }, process: { needs: { carbon: 1 }, seconds: 30, fuel: true },
  },
  auto_drill: {
    id: 'auto_drill', name: 'Auto-drill', radius: 1.2, height: 2.5, powerKW: -2, note: 'Uses 2 kW. Mines what lies beneath it.',
    drill: { seconds: 5 }, outCap: 20,
  },
  storage_silo: { id: 'storage_silo', name: 'Storage silo', radius: 1.0, height: 3.0, powerKW: 0, note: 'Holds 300 items of any kind.', storage: 300 },
  research_station: { id: 'research_station', name: 'Research station', radius: 1.1, height: 2.4, powerKW: -1.5, note: 'Uses 1.5 kW while researching.', research: true },
  bio_filter: { id: 'bio_filter', name: 'Bio-filter', radius: 1.3, height: 2.0, powerKW: -1.5, note: 'Uses 1.5 kW. Cleans the air.', filter: true },
  settling_pond: { id: 'settling_pond', name: 'Settling pond', radius: 1.6, height: 0.6, powerKW: 0, note: 'Cleans water and soil, slowly, always.', filter: true },
  sabatier_reactor: {
    id: 'sabatier_reactor', name: 'Sabatier reactor', radius: 1.35, height: 2.1, powerKW: -1.5, note: 'Uses 1.5 kW. CO₂ + 4 H₂ → CH₄ + 2 H₂O: cleans the air and makes methane.',
    accepts: { hydrogen: 20 }, process: { needs: { hydrogen: 2 }, makes: { methane: 1 }, seconds: 10 }, outCap: 20,
  },
  power_pylon: { id: 'power_pylon', name: 'Power pylon', radius: 0.35, height: 4.2, powerKW: 0, note: 'Carries power 14 m; links to pylons up to 26 m away.', pylon: { range: 14, link: 26 } },
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
  gridRadius: 30,            // machines this close to the shelter share its power
  suitChargeKW: 1,
  gameHoursPerSecond: 24 / 360,
  smeltSeconds: 8,           // per iron plate
};

/** Conveyor belts. */
export const BELTS = {
  speed: 1.6,         // metres per second
  spacing: 0.55,      // metres between items
  maxLength: 30,      // metres
  metresPerItem: 2,   // one conveyor item lays this much belt
  maxIn: 3,           // belts that can feed one machine
};

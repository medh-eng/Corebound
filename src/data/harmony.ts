// Harmony: how clean Jivagraha's Air, Water and Soil are (GDD §10). Numbers are starting values (tune).
// Pollution stocks run 0 (pristine) to 100 (ruined). Harmony = 100 − weighted pollution.
import type { MachineId } from './items';

export type Stock = 'air' | 'water' | 'soil';

export const HARMONY = {
  start: { air: 4, water: 3, soil: 3 },
  weights: { air: 0.4, water: 0.3, soil: 0.3 },
  /** Change per minute of play while a machine is working (+ dirties, − cleans). */
  emit: {
    coal_burner: { air: 4.0 },
    smelter: { air: 2.0 },
    silicon_furnace: { air: 2.0 },
    auto_drill: { soil: 1.0, water: 0.6 },
    bio_filter: { air: -2.5 },
    settling_pond: { water: -1.6, soil: -1.0 },
    sabatier_reactor: { air: -2.0 },
  } as Partial<Record<MachineId, Partial<Record<Stock, number>>>>,
  /** What the living world cleans by itself per minute, scaled by how healthy the plants are (never below `minHealth`). */
  recovery: { air: 0.7, water: 0.45, soil: 0.35 },
  minHealth: 0.25,
  /** Harmony bands (GDD §10). */
  bands: { thriving: 80, stable: 50, stressed: 25 },
  /** Chance per machine per game minute of needing attention (acid rain, grit, clogged petals). */
  faultPerMinute: { stressed: 0.06, collapse: 0.2 },
  /** Bloom flowers: while thriving, one appears about this often (seconds), up to `max` at once. */
  bloomEverySec: 45,
  bloomMax: 6,
};

export type Band = 'thriving' | 'stable' | 'stressed' | 'collapse';
export const BAND_TEXT: Record<Band, string> = {
  thriving: 'Thriving', stable: 'Stable', stressed: 'Stressed', collapse: 'Collapse',
};

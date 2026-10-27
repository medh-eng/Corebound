// Harmony (GDD §10): pollution stocks that machines raise and living things (and filters) lower.
import { HARMONY, type Band, type Stock } from '../data/harmony';
import type { MachineId } from '../data/items';

export interface HarmonyState { air: number; water: number; soil: number }

export const newHarmony = (): HarmonyState => ({ ...HARMONY.start });

/** 0 (ruined) .. 100 (pristine). */
export function harmonyValue(h: HarmonyState): number {
  const w = HARMONY.weights;
  return Math.max(0, Math.min(100, 100 - (w.air * h.air + w.water * h.water + w.soil * h.soil)));
}

export function bandOf(value: number): Band {
  const b = HARMONY.bands;
  return value >= b.thriving ? 'thriving' : value >= b.stable ? 'stable' : value >= b.stressed ? 'stressed' : 'collapse';
}

/** How healthy the plants are, 0..1 (they never stop cleaning entirely: recovery is always possible). */
export function floraHealth(value: number): number {
  return Math.max(HARMONY.minHealth, Math.min(1, (value - 20) / 60));
}

const DIRTY_HEAT: MachineId[] = ['smelter', 'silicon_furnace', 'coal_burner'];

/** Advances the stocks by `dt` seconds of play, given which machines worked this tick. */
export function tickHarmony(h: HarmonyState, working: MachineId[], dt: number, fx: { clean?: boolean; filter2?: boolean } = {}) {
  const minutes = dt / 60;
  for (const id of working) {
    const e = HARMONY.emit[id];
    if (!e) continue;
    for (const k of Object.keys(e) as Stock[]) {
      let v = e[k] ?? 0;
      if (v > 0 && fx.clean && DIRTY_HEAT.includes(id)) v *= 0.5;
      if (v < 0 && fx.filter2 && id === 'bio_filter') v *= 2;
      h[k] += v * minutes;
    }
  }
  const health = floraHealth(harmonyValue(h));
  for (const k of ['air', 'water', 'soil'] as Stock[]) {
    h[k] = Math.max(0, Math.min(100, h[k] - HARMONY.recovery[k] * health * minutes));
  }
}

// The research tree, tiers 1–2 (M2). You give the research station the parts; with power it
// works for `seconds`, then the node is done. Numbers are starting values (tune).
import type { ItemId } from './items';

export type ResearchEffect = 'backpack' | 'drill_speed' | 'solar' | 'clean' | 'filter2';

export interface ResearchNode {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  needs: Partial<Record<ItemId, number>>;
  seconds: number;
  requires: string[];
  note: string;
  effect?: ResearchEffect;
}

export const RESEARCH: ResearchNode[] = [
  { id: 'auto_drill', name: 'Auto-drill', tier: 1, needs: { iron_plate: 4, silica: 6 }, seconds: 20, requires: [], note: 'A drill that mines on its own, forever, from whatever lies beneath it.' },
  { id: 'conveyor', name: 'Conveyors', tier: 1, needs: { iron_plate: 3 }, seconds: 15, requires: [], note: 'Belts that carry items from one machine to the next.' },
  { id: 'power_pylon', name: 'Power pylons', tier: 1, needs: { iron_plate: 4, carbon: 4 }, seconds: 20, requires: [], note: 'Carry power away from the shelter.' },
  { id: 'storage_silo', name: 'Storage silo', tier: 1, needs: { iron_plate: 4, silica: 8 }, seconds: 20, requires: ['conveyor'], note: 'Somewhere for belts to pile things up.' },
  { id: 'coal_burner', name: 'Coal burner', tier: 1, needs: { iron_plate: 5, carbon: 8 }, seconds: 25, requires: ['power_pylon'], note: 'Power all night from carbon. The forest will not like the smoke.' },
  { id: 'silicon_furnace', name: 'Silicon furnace', tier: 2, needs: { iron_plate: 8, silica: 12, carbon: 4 }, seconds: 30, requires: ['auto_drill', 'conveyor'], note: 'Bakes silica into silicon for better machines.' },
  { id: 'backpack_plus', name: 'Bigger backpack', tier: 2, needs: { iron_plate: 10, silicon: 6 }, seconds: 30, requires: ['silicon_furnace'], note: 'Four more backpack slots.', effect: 'backpack' },
  { id: 'drill_plus', name: 'Faster drills', tier: 2, needs: { iron_plate: 12, silicon: 8 }, seconds: 40, requires: ['silicon_furnace'], note: 'Every auto-drill works 50% faster.', effect: 'drill_speed' },
  { id: 'solar_plus', name: 'Silicon lotus cells', tier: 2, needs: { iron_plate: 4, silicon: 10 }, seconds: 30, requires: ['silicon_furnace'], note: 'Solar lotuses make 25% more power.', effect: 'solar' },
  { id: 'bio_filter', name: 'Bio-filter', tier: 1, needs: { iron_plate: 4, silica: 6, ice: 4 }, seconds: 20, requires: [], note: 'Algae in glass that eat smoke. The forest will thank you.' },
  { id: 'settling_pond', name: 'Settling pond', tier: 1, needs: { iron_plate: 3, silica: 10 }, seconds: 20, requires: ['auto_drill'], note: 'Drills stir up mud. A pond lets it sink.' },
  { id: 'sabatier_reactor', name: 'Sabatier reactor', tier: 2, needs: { iron_plate: 8, silicon: 6 }, seconds: 35, requires: ['bio_filter', 'silicon_furnace'], note: 'Hydrogen from the electrolyzer plus CO₂ from the air make methane: cleaner air and rocket fuel.' },
  { id: 'clean_smelting', name: 'Clean smelting', tier: 3, needs: { bloom: 3, silicon: 6 }, seconds: 45, requires: ['sabatier_reactor'], note: 'Smelters, furnaces and burners make half the smoke.', effect: 'clean' },
  { id: 'bloom_filter', name: 'Bloom filters', tier: 3, needs: { bloom: 5, iron_plate: 6 }, seconds: 45, requires: ['bio_filter'], note: 'Bloom cells in the bio-filters: they clean twice as fast.', effect: 'filter2' },
];

export const researchById = (id: string) => RESEARCH.find((r) => r.id === id);

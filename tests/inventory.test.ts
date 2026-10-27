import { describe, it, expect } from 'vitest';
import { Backpack } from '../src/systems/inventory';
import { ITEMS, MACHINES, RECIPES, type ItemId } from '../src/data/items';

describe('backpack', () => {
  it.each(Object.values(ITEMS))('stacks $id up to its limit before opening another slot', ({ id, stack }) => {
    const b = new Backpack();
    expect(b.slots).toEqual(new Array(8).fill(null));
    expect(b.add(id, stack - 1)).toBe(0);
    expect(b.add(id, 2)).toBe(0);
    expect(b.slots).toEqual([
      { id, n: stack }, { id, n: 1 }, ...new Array(6).fill(null),
    ]);
  });

  it('tops up matching stacks before using an earlier empty slot', () => {
    const b = new Backpack();
    const stack = ITEMS.ice.stack;
    b.slots[1] = { id: 'ice', n: stack - 2 };
    b.slots[3] = { id: 'ice', n: stack - 1 };
    b.slots[5] = { id: 'carbon', n: 4 };
    expect(b.add('ice', 5)).toBe(0);
    expect(b.slots).toEqual([
      { id: 'ice', n: 2 }, { id: 'ice', n: stack }, null,
      { id: 'ice', n: stack }, null, { id: 'carbon', n: 4 }, null, null,
    ]);
  });

  it.each(Object.values(ITEMS))('returns overflow when all eight slots hold $id', ({ id, stack }) => {
    const b = new Backpack();
    expect(b.add(id, 8 * stack + 7)).toBe(7);
    expect(b.slots).toEqual(new Array(8).fill(null).map(() => ({ id, n: stack })));
    const before = structuredClone(b.slots);
    expect(b.add(id, 1)).toBe(1);
    expect(b.slots).toEqual(before);
  });

  it('fills remaining matching capacity in a full mixed backpack', () => {
    const b = new Backpack();
    b.slots = [
      { id: 'ice', n: ITEMS.ice.stack - 2 },
      ...new Array(7).fill(null).map(() => ({ id: 'carbon' as const, n: ITEMS.carbon.stack })),
    ];
    expect(b.add('ice', 5)).toBe(3);
    expect(b.count('ice')).toBe(ITEMS.ice.stack);
    const before = structuredClone(b.slots);
    expect(b.add('silica', 3)).toBe(3);
    expect(b.slots).toEqual(before);
  });

  it('counts matching items across separated stacks and ignores other items', () => {
    const b = new Backpack();
    b.slots[0] = { id: 'ice', n: 8 };
    b.slots[2] = { id: 'carbon', n: 19 };
    b.slots[4] = { id: 'ice', n: 11 };
    b.slots[7] = { id: 'ice', n: 3 };
    expect(b.count('ice')).toBe(22);
    expect(b.count('carbon')).toBe(19);
    expect(b.count('silica')).toBe(0);
  });

  it('removes across matching stacks, clears exhausted slots and preserves other items', () => {
    const b = new Backpack();
    b.slots[0] = { id: 'ice', n: 8 };
    b.slots[2] = { id: 'carbon', n: 19 };
    b.slots[4] = { id: 'ice', n: 3 };
    b.slots[7] = { id: 'ice', n: 2 };
    expect(b.remove('ice', 7)).toBe(true);
    expect(b.slots).toEqual([
      { id: 'ice', n: 6 }, null, { id: 'carbon', n: 19 }, null,
      null, null, null, null,
    ]);
    expect(b.remove('ice', 6)).toBe(true);
    expect(b.count('ice')).toBe(0);
    expect(b.slots[0]).toBeNull();
    expect(b.count('carbon')).toBe(19);
  });

  it('takes nothing when the requested quantity is unavailable', () => {
    const b = new Backpack();
    b.slots[0] = { id: 'ice', n: 8 };
    b.slots[3] = { id: 'carbon', n: 5 };
    b.slots[7] = { id: 'ice', n: 2 };
    const before = structuredClone(b.slots);
    expect(b.remove('ice', 11)).toBe(false);
    expect(b.slots).toEqual(before);
    expect(b.remove('silica', 1)).toBe(false);
    expect(b.slots).toEqual(before);
  });

  it('leaves the backpack unchanged when adding or removing zero', () => {
    const b = new Backpack();
    b.add('ice', 5);
    const before = structuredClone(b.slots);
    expect(b.add('carbon', 0)).toBe(0);
    expect(b.remove('ice', 0)).toBe(true);
    expect(b.slots).toEqual(before);
  });
});

describe('crafting eligibility', () => {
  for (const recipe of RECIPES) {
    it(`requires every ingredient for ${recipe.out} without consuming any`, () => {
      const b = new Backpack();
      expect(b.canCraft(recipe)).toBe(false);
      for (const [id, n] of Object.entries(recipe.needs)) {
        expect(b.add(id as ItemId, n)).toBe(0);
      }
      const before = structuredClone(b.slots);
      expect(b.canCraft(recipe)).toBe(true);
      expect(b.slots).toEqual(before);
      for (const [id, n] of Object.entries(recipe.needs)) {
        const short = new Backpack();
        short.slots = structuredClone(before);
        expect(short.remove(id as ItemId, 1)).toBe(true);
        expect(short.canCraft(recipe)).toBe(false);
        expect(short.remove(id as ItemId, n - 1)).toBe(true);
        expect(short.canCraft(recipe)).toBe(false);
      }
      for (const id of Object.keys(recipe.needs)) b.add(id as ItemId, 1);
      expect(b.canCraft(recipe)).toBe(true);
    });
  }

  it('counts ingredients split between slots', () => {
    const b = new Backpack();
    b.slots[0] = { id: 'ice', n: 1 };
    b.slots[7] = { id: 'ice', n: 2 };
    const recipe = RECIPES.find((r) => r.out === 'o2_canister')!;
    expect(b.canCraft(recipe)).toBe(true);
  });
});

describe('item and recipe data', () => {
  it.each(RECIPES)('uses existing items for the $out recipe', (recipe) => {
    expect(Object.hasOwn(ITEMS, recipe.out)).toBe(true);
    for (const id of Object.keys(recipe.needs)) {
      expect(Object.hasOwn(ITEMS, id)).toBe(true);
    }
  });

  it.each(Object.values(ITEMS))('has valid display text, stack size and machine reference for $id', (item) => {
    expect(item.name.trim().length).toBeGreaterThan(0);
    expect(item.note.trim().length).toBeGreaterThan(0);
    expect(item.stack).toBeGreaterThanOrEqual(1);
    if (item.placeable !== undefined) {
      expect(Object.hasOwn(MACHINES, item.placeable)).toBe(true);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { ITEMS, MACHINES, RECIPES } from '../src/data/items';
import { RESEARCH } from '../src/data/research';
import { CHAPTER1_GOALS } from '../src/data/story';
import { CREATURE_NAMES, GUARDIAN_NAMES, PEOPLE_NAMES, SZYNTHAR_HOMELAND } from '../src/data/names';

function expectItems(values: object | undefined, where: string) {
  for (const id of Object.keys(values ?? {})) {
    expect(Object.hasOwn(ITEMS, id), `${where}: unknown item ${id}`).toBe(true);
  }
}

function findCycle(nodes: { id: string; requires: string[] }[]): string[] | null {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const visited = new Set<string>();
  const path: string[] = [];
  const visit = (id: string): string[] | null => {
    const index = path.indexOf(id);
    if (index !== -1) return [...path.slice(index), id];
    if (visited.has(id)) return null;
    path.push(id);
    for (const required of byId.get(id)?.requires ?? []) {
      const cycle = visit(required);
      if (cycle) return cycle;
    }
    path.pop();
    visited.add(id);
    return null;
  };
  for (const node of nodes) {
    const cycle = visit(node.id);
    if (cycle) return cycle;
  }
  return null;
}

describe('game data references', () => {
  it('uses existing research nodes for recipe unlocks and prerequisites', () => {
    const ids = new Set(RESEARCH.map((node) => node.id));
    expect(ids.size, 'research IDs must be unique').toBe(RESEARCH.length);
    for (const recipe of RECIPES) {
      if (recipe.research !== undefined) {
        expect(ids.has(recipe.research), `${recipe.out}: unknown research ${recipe.research}`).toBe(true);
      }
    }
    for (const node of RESEARCH) {
      for (const id of node.requires) {
        expect(ids.has(id), `${node.id}: unknown prerequisite ${id}`).toBe(true);
      }
    }
  });

  it('has no research cycles, including disconnected branches', () => {
    expect(findCycle(RESEARCH)).toBeNull();
  });

  it('uses existing items for costs, inputs and outputs', () => {
    for (const node of RESEARCH) expectItems(node.needs, `research ${node.id}`);
    for (const recipe of RECIPES) {
      expectItems(recipe.needs, `recipe ${recipe.out}`);
      expect(Object.hasOwn(ITEMS, recipe.out), `recipe output ${recipe.out}`).toBe(true);
    }
    for (const machine of Object.values(MACHINES)) {
      expectItems(machine.accepts, `${machine.id} accepts`);
      expectItems(machine.process?.needs, `${machine.id} process inputs`);
      expectItems(machine.process?.makes, `${machine.id} process outputs`);
    }
  });

  it('maps placeable items to machines and makes machines craftable', () => {
    for (const item of Object.values(ITEMS)) {
      if (item.placeable !== undefined) {
        expect(Object.hasOwn(MACHINES, item.placeable), `${item.id}: unknown machine ${item.placeable}`).toBe(true);
      }
    }
    for (const machine of Object.values(MACHINES)) {
      if (machine.id === 'solar_lotus') continue;
      expect(RECIPES.some((recipe) => ITEMS[recipe.out]?.placeable === machine.id), `${machine.id}: no crafting recipe`).toBe(true);
    }
  });

  it('has positive finite machine dimensions and process times', () => {
    for (const machine of Object.values(MACHINES)) {
      const values: Record<string, number> = { radius: machine.radius, height: machine.height };
      if (machine.process) values.seconds = machine.process.seconds;
      if (machine.drill) values.drillSeconds = machine.drill.seconds;
      for (const [key, value] of Object.entries(values)) {
        expect(Number.isFinite(value), `${machine.id}.${key} must be finite`).toBe(true);
        expect(value, `${machine.id}.${key} must be positive`).toBeGreaterThan(0);
      }
    }
  });

  it('has unique goal IDs and ends with done', () => {
    expect(new Set(CHAPTER1_GOALS.map((goal) => goal.id)).size).toBe(CHAPTER1_GOALS.length);
    expect(CHAPTER1_GOALS.at(-1)?.id).toBe('done');
  });

  it('has names, Devanagari and pronunciation for every named entry', () => {
    const groups = { guardians: GUARDIAN_NAMES, peoples: PEOPLE_NAMES, creatures: CREATURE_NAMES, homeland: { szynthar: SZYNTHAR_HOMELAND } };
    for (const [group, entries] of Object.entries(groups)) {
      for (const [id, entry] of Object.entries(entries)) {
        for (const field of ['name', 'deva', 'say'] as const) {
          expect(typeof entry[field], `${group}.${id}.${field}`).toBe('string');
          expect(entry[field].trim().length, `${group}.${id}.${field} must not be blank`).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe('research cycle detection', () => {
  it('detects a self-loop', () => {
    expect(findCycle([{ id: 'a', requires: ['a'] }])).toEqual(['a', 'a']);
  });
  it('detects a cycle in a disconnected component', () => {
    expect(findCycle([{ id: 'root', requires: [] }, { id: 'a', requires: ['b'] }, { id: 'b', requires: ['a'] }])).toEqual(['a', 'b', 'a']);
  });
  it('allows shared prerequisites in an acyclic diamond', () => {
    expect(findCycle([{ id: 'a', requires: ['b', 'c'] }, { id: 'b', requires: ['d'] }, { id: 'c', requires: ['d'] }, { id: 'd', requires: [] }])).toBeNull();
  });
});

import { describe, expect, it } from 'vitest';
import { CREATURE_NAMES, CREATURE_CODEX } from '../src/data/names';
import { CODEX, CHAPTER1_CODEX, codexById } from '../src/data/codex';
import { CREATURE_LINES } from '../src/data/lines';
import { CHAPTER1_MILESTONES as CHAPTER1_GOALS, STUCK_HINTS, PHONE_GOAL_HINTS, PHONE_STUCK_HINTS } from '../src/data/chapter1';

const words = (s: string) => s.trim().split(/\s+/).length;

describe('T-036 creature names', () => {
  it('each Jivagraha creature name is on its Codex entry, with its Devanagari and a voice respelling', () => {
    for (const [key, id] of Object.entries(CREATURE_CODEX)) {
      const n = CREATURE_NAMES[key]; const e = codexById(id);
      expect(n, key).toBeTruthy(); expect(e, id).toBeTruthy();
      expect(e!.name).toBe(n.name); expect(e!.deva).toBe(n.deva);
      expect(n.deva).toMatch(/^[ऀ-ॿ]+$/); expect(n.voice).toBeTruthy();
    }
  });
  it('no two creature names are the same', () => {
    const names = Object.values(CREATURE_NAMES).map((n) => n.name);
    expect(new Set(names).size).toBe(names.length);
  });
});

describe('T-037 creature lines and T-030 Chapter 1 Codex', () => {
  it('SARATHI creature lines are under 30 words', () => {
    expect(Object.keys(CREATURE_LINES).sort()).toEqual(['bird_roost', 'burrower_shy', 'first_bird', 'first_burrower', 'first_grazer', 'grazer_shy']);
    for (const [id, l] of Object.entries(CREATURE_LINES)) expect(words(l), id).toBeLessThan(30);
  });
  it('Chapter 1 entries have unique ids, 40-100 words, a science line, and no violence words', () => {
    const ids = [...CODEX, ...CHAPTER1_CODEX].map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const e of CHAPTER1_CODEX) {
      expect(words(e.text), e.id).toBeGreaterThanOrEqual(40); expect(words(e.text), e.id).toBeLessThanOrEqual(100);
      expect(e.science, e.id).toBeTruthy();
      expect(`${e.text} ${e.science}`).not.toMatch(/\b(kill|fight|defeat|attack|weapon|temple|shrine|god)\b/i);
    }
  });
});

describe('T-031 Chapter 1 goals', () => {
  it('16 goals in order with short titles and hints, each with a stuck hint under 30 words', () => {
    expect(CHAPTER1_GOALS.length).toBe(16);
    expect(CHAPTER1_GOALS[0].id).toBe('wake'); expect(CHAPTER1_GOALS.at(-1)!.id).toBe('lift_off');
    for (const g of CHAPTER1_GOALS) {
      expect(words(g.title), g.id).toBeLessThanOrEqual(6);
      expect(words(g.hint), g.id).toBeLessThanOrEqual(20);
      expect(STUCK_HINTS[g.id], g.id).toBeTruthy();
      expect(words(STUCK_HINTS[g.id]), g.id).toBeLessThan(30);
    }
  });
  it('Mooladri is calmed in the scenes order: roots, then air, then the bloom', () => {
    const i = (id: string) => CHAPTER1_GOALS.findIndex((g) => g.id === id);
    expect(i('roots')).toBeLessThan(i('clear_smog')); expect(i('clear_smog')).toBeLessThan(i('replant_bloom'));
  });
  it('phone wording only for real goals, and never names a keyboard key', () => {
    for (const map of [PHONE_GOAL_HINTS, PHONE_STUCK_HINTS]) for (const [id, l] of Object.entries(map)) {
      expect(CHAPTER1_GOALS.some((g) => g.id === id), id).toBe(true);
      expect(l).not.toMatch(/\b(press|click)\b|\bwith [EJC]\b/);
    }
  });
});

import { describe, it, expect } from 'vitest';
import { STORY_PROPS, CRASH_SITE } from '../src/data/base';
import { CHAPTER1_LOGS } from '../src/data/logs';
import { CHAPTER1_GOALS } from '../src/data/story';
import { CHAPTER1_MILESTONES, STEP_MILESTONE } from '../src/data/chapter1';
import { codexById } from '../src/data/codex';

describe('M4 slice 2: Huxley, the translator and the memory logs', () => {
  it('every placed log is a real log, placed once', () => {
    const ids = STORY_PROPS.logs.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(CHAPTER1_LOGS.some((l) => l.id === id)).toBe(true);
    expect(STORY_PROPS.logsForGoal).toBeLessThanOrEqual(ids.length);
  });
  it('the three new steps come after the factory and before the planet view, each under its milestone', () => {
    const at = (id: string) => CHAPTER1_GOALS.findIndex((g) => g.id === id);
    expect(at('auto_plates')).toBeLessThan(at('huxley_message'));
    expect(at('huxley_message')).toBeLessThan(at('translator'));
    expect(at('translator')).toBeLessThan(at('memory_logs'));
    expect(at('memory_logs')).toBeLessThan(at('harmony_look'));
    for (const id of ['huxley_message', 'translator', 'memory_logs']) expect(CHAPTER1_MILESTONES.some((m) => m.id === STEP_MILESTONE[id])).toBe(true);
  });
  it('every step milestone exists', () => {
    for (const m of Object.values(STEP_MILESTONE)) expect(CHAPTER1_MILESTONES.some((x) => x.id === m)).toBe(true);
  });
  it('the projector and translator stand clear of the module and pod', () => {
    const d = (a: { forward: number; right: number }, b: { forward: number; right: number }) => Math.hypot(a.forward - b.forward, a.right - b.right);
    for (const p of [STORY_PROPS.projector, STORY_PROPS.translator]) {
      expect(d(p, CRASH_SITE.escapeModule)).toBeGreaterThan(CRASH_SITE.escapeModule.radius + 0.2);
      expect(d(p, CRASH_SITE.cryoPod)).toBeGreaterThan(CRASH_SITE.cryoPod.radius + 0.2);
    }
  });
  it('the crash site and translator can be scanned', () => {
    for (const id of ['cryo_pod', 'escape_module', 'translator']) expect(codexById(id)).toBeTruthy();
  });
});

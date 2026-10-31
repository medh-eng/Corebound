import { describe, expect, it } from 'vitest';
import { forTouch, machineAction, machineOutput, PHONE_HELP } from '../src/data/controls';

describe('machine prompt wording', () => {
  it.each([false, true])('counts each output once (touch=%s)', (touch) => {
    expect(forTouch(machineOutput([{ name: 'Iron plate', n: 1 }]), touch)).toBe('1 iron plate ready');
    expect(forTouch(machineOutput([{ name: 'Iron plate', n: 3 }]), touch)).toBe('3 iron plates ready');
  });
  it('counts mixed outputs separately and leaves bulk materials singular', () => {
    expect(machineOutput([{ name: 'Iron plate', n: 3 }, { name: 'Silicon', n: 2 }, { name: 'Hydrogen', n: 0 }]))
      .toBe('3 iron plates, 2 silicon ready');
  });
  it('names the pickup key on desktop and the button once on touch', () => {
    expect(forTouch(machineAction('pickup'), false)).toBe('<b>X</b> Pick up');
    expect(forTouch(machineAction('pickup'), true)).toBe('<b>Pick up</b>');
  });
  it('builds loading from one action template', () => {
    expect(forTouch(machineAction('load', 'ice'), false)).toBe('<b>E</b> Load ice');
    expect(forTouch(machineAction('load', 'ice'), true)).toBe('Tap <b>Use</b> to load ice');
    expect(forTouch('Press E to load ice', true)).toBe('Tap Use to load ice');
  });
  it('translates complete machine prompts without repeating a verb', () => {
    const prompt = `Electrolyzer · 7 ice inside · ${machineAction('load', 'ice')} · ${machineAction('pickup')}`;
    expect(forTouch(prompt, true)).toBe('Electrolyzer · 7 ice inside · Tap <b>Use</b> to load ice · <b>Pick up</b>');
    expect(forTouch(forTouch(prompt, true), true)).toBe(forTouch(prompt, true));
  });
  it('keeps every approved phone instruction, without keyboard controls', () => {
    expect(PHONE_HELP).toHaveLength(11);
    for (const line of PHONE_HELP) expect(line).not.toMatch(/\b(mouse|keyboard|WASD|press [A-Z])\b/);
  });
});

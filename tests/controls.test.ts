import { describe, expect, it } from 'vitest';
import { forTouch } from '../src/data/controls';
import { CHAPTER1_GOALS } from '../src/data/story';
import { TIPS } from '../src/data/tips';

describe('touch wording', () => {
  it('leaves keyboard text alone off touch', () => {
    expect(forTouch('Press Tab to open your backpack', false)).toBe('Press Tab to open your backpack');
  });
  it('names the on-screen buttons on touch', () => {
    expect(forTouch('Mine 3 ice — hold the left mouse button on the blue crystals', true)).toBe('Mine 3 ice — hold Mine on the blue crystals');
    expect(forTouch('Load it with ice — walk up to it and press E', true)).toBe('Load it with ice — walk up to it and tap Use');
    expect(forTouch('Press Tab to open your backpack', true)).toBe('Tap Bag to open your backpack');
    expect(forTouch('Smelter · <b>E</b> load ore · <b>X</b> pick up', true)).toBe('Smelter · Tap <b>Use</b> to load ore · <b>Pick up</b>');
  });
  it('no goal or tip still mentions a key or the mouse on touch', () => {
    const keyish = /\b(press|mouse|Tab|click)\b|\((E|Tab)\)/i;
    for (const g of CHAPTER1_GOALS) expect(keyish.test(forTouch(g.text, true)), g.text).toBe(false);
    for (const t of TIPS) expect(keyish.test(forTouch(t, true)), t).toBe(false);
  });
});

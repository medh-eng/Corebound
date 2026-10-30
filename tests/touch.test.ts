import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TouchControls } from '../src/ui/touch';
import type { Input } from '../src/systems/input';

// Only DOM/event plumbing is substituted; each test uses the real controller's public events.
class Element extends EventTarget {
  classList = {
    values: new Set<string>(),
    add(c: string) { this.values.add(c); },
    remove(c: string) { this.values.delete(c); },
    contains(c: string) { return this.values.has(c); },
    toggle(c: string, on: boolean) { if (on) this.add(c); else this.remove(c); },
  };
  style: Record<string, string> = {};
  dataset: Record<string, string> = {};
  textContent = '';
  captures = new Set<number>();
  captureFails = false;
  children = new Map<string, Element>();
  buttons: Element[] = [];
  insertAdjacentHTML() {}
  querySelector(s: string) { return this.children.get(s)!; }
  querySelectorAll() { return this.buttons; }
  setPointerCapture(id: number) { if (this.captureFails) throw new Error('pointer ended'); this.captures.add(id); }
  hasPointerCapture(id: number) { return this.captures.has(id); }
  releasePointerCapture(id: number) { this.captures.delete(id); }
}

class KeyEvent extends Event {
  readonly code: string;
  constructor(type: string, init: KeyboardEventInit) { super(type); this.code = init.code!; }
}

describe('touch input recovery', () => {
  let doc: EventTarget;
  let win: EventTarget;
  let orientation: EventTarget;
  let root: Element;
  let look: Element;
  let stick: Element;
  let knob: Element;
  let close: Element;
  let controls: TouchControls;
  let input: { touch: boolean; stick: { x: number; y: number }; mouseDX: number; mouseDY: number;
    press: ReturnType<typeof vi.fn>; release: ReturnType<typeof vi.fn> };
  let keys: string[];
  const play = { mode: 'play', building: false, belt: false, near: false } as const;

  function pointer(target: Element, type: string, id = 1, x = 100, y = 200) {
    const e = new Event(type, { cancelable: true });
    Object.defineProperties(e, { pointerId: { value: id }, clientX: { value: x }, clientY: { value: y }, target: { value: target } });
    if (type === 'lostpointercapture') target.captures.delete(id);
    doc.dispatchEvent(e);
    target.dispatchEvent(e);
  }
  function walk(id = 1) { pointer(look, 'pointerdown', id); pointer(look, 'pointermove', id, 100, 144); }
  function released() {
    expect(input.stick).toEqual({ x: 0, y: 0 });
    expect(stick.classList.contains('hidden')).toBe(true);
    expect(knob.style.transform).toBe('translate(0px, 0px)');
  }
  function restart(id = 2) { walk(id); expect(input.stick.y).toBe(-1); pointer(look, 'pointerup', id); released(); }
  function button(code: string) { return root.buttons.find((b) => b.dataset.code === code)!; }

  beforeEach(() => {
    doc = new EventTarget(); win = new EventTarget(); orientation = new EventTarget();
    root = new Element(); look = new Element(); stick = new Element(); knob = new Element(); close = new Element();
    stick.children.set('i', knob);
    root.children.set('.t-stick', stick); root.children.set('.t-look', look); root.children.set('.t-close', close);
    root.buttons = ['Mouse0', 'Space', 'KeyE', 'Mouse2', 'Tab'].map((code) => {
      const b = new Element(); b.dataset.code = code; return b;
    });
    root.children.set('.a-main', button('Mouse0'));
    Object.assign(doc, { body: new Element(), getElementById: () => root });
    vi.stubGlobal('document', doc); vi.stubGlobal('window', win);
    vi.stubGlobal('screen', { orientation }); vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('KeyboardEvent', KeyEvent);
    keys = [];
    vi.stubGlobal('dispatchEvent', (e: KeyEvent) => { keys.push(`${e.type}:${e.code}`); return true; });
    input = { touch: false, stick: { x: 0, y: 0 }, mouseDX: 0, mouseDY: 0, press: vi.fn(), release: vi.fn() };
    controls = new TouchControls(input as unknown as Input);
    controls.update(play);
  });
  afterEach(() => vi.unstubAllGlobals());

  it.each(['pointerup', 'pointercancel', 'lostpointercapture'])('releases and restarts after %s', (type) => {
    walk(); pointer(look, type); released(); restart();
  });
  it('sees a release delivered outside the original look layer', () => {
    walk(); pointer(new Element(), 'pointerup'); released(); restart();
  });
  it('a new thumb replaces an old held or stale joystick', () => {
    walk(); walk(2); pointer(look, 'pointerup', 1);
    expect(input.stick.y).toBe(-1);
    expect(look.hasPointerCapture(1)).toBe(false);
    pointer(look, 'pointerup', 2); released(); restart(3);
  });
  it('reuses the same pointer id without a preceding release', () => { walk(); walk(); pointer(look, 'pointerup'); released(); restart(); });
  it('clears an old button when its pointer id is reused for movement', () => {
    pointer(button('Mouse0'), 'pointerdown'); walk();
    expect(input.release).toHaveBeenCalledWith('Mouse0');
    expect(button('Mouse0').classList.contains('on')).toBe(false);
    expect(input.stick.y).toBe(-1);
  });
  it('does not let another finger ending cancel movement', () => {
    walk(); pointer(look, 'pointerdown', 2, 500); pointer(look, 'pointerup', 2);
    expect(input.stick.y).toBe(-1);
  });
  it('releases a button only when its final thumb ends', () => {
    const mine = button('Mouse0'); pointer(mine, 'pointerdown', 2); pointer(mine, 'pointerdown', 3);
    pointer(mine, 'pointerup', 2); expect(input.release).not.toHaveBeenCalled();
    expect(mine.classList.contains('on')).toBe(true);
    pointer(mine, 'pointerup', 3); expect(input.release).toHaveBeenCalledWith('Mouse0');
    expect(mine.classList.contains('on')).toBe(false);
  });
  it('still recovers if capture throws during an interruption', () => {
    look.captureFails = true; walk(); pointer(new Element(), 'pointerup'); released(); restart();
  });
  it('ignores a delayed capture-loss notification after capture is regained', () => {
    walk();
    const e = new Event('lostpointercapture');
    Object.defineProperties(e, { pointerId: { value: 1 }, target: { value: look } });
    doc.dispatchEvent(e); expect(input.stick.y).toBe(-1);
  });
  it.each(['blur', 'pagehide', 'pageshow', 'resize', 'orientationchange'])('releases movement, camera and actions on %s', (event) => {
    walk(); pointer(button('Mouse0'), 'pointerdown', 2, 600); pointer(button('Space'), 'pointerdown', 3, 650);
    pointer(look, 'pointerdown', 4, 500); pointer(look, 'pointermove', 4, 530);
    win.dispatchEvent(new Event(event)); released();
    expect(input.mouseDX).toBe(0); expect(input.release).toHaveBeenCalledWith('Mouse0');
    expect(keys).toContain('keyup:Space'); expect(root.buttons.every((b) => !b.classList.contains('on'))).toBe(true);
    pointer(look, 'pointermove', 4, 550); expect(input.mouseDX).toBe(0); restart(5);
  });
  it('resets on the screen orientation API event', () => { walk(); orientation.dispatchEvent(new Event('change')); released(); restart(); });
  it.each(['visibilitychange', 'touchcancel'])('resets after document %s', (event) => {
    walk(); doc.dispatchEvent(new Event(event)); released();
    doc.dispatchEvent(new Event(event)); restart();
  });
  it.each(['panel', 'hidden', 'orbit'] as const)('clears held controls across %s and return to play', (mode) => {
    walk(); pointer(button('Space'), 'pointerdown', 2);
    controls.update({ ...play, mode }); released(); expect(keys).toContain('keyup:Space');
    controls.update(play); restart(3);
  });
  it('clears input when a panel closes and ignores joystick presses inside panels', () => {
    controls.update({ ...play, mode: 'panel' }); walk(); expect(input.stick.y).toBe(0);
    controls.onClose = () => controls.update(play);
    close.dispatchEvent(new Event('click')); restart();
  });
});

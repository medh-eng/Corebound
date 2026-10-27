// Keyboard, mouse and gamepad, merged into one simple state the game reads each frame.
export class Input {
  keys = new Set<string>();
  pressed = new Set<string>();
  mouseDX = 0;
  mouseDY = 0;
  wheel = 0;
  locked = false;
  sensitivity = 0.0022;
  private padPrev: boolean[] = [];

  constructor(private canvas: HTMLCanvasElement) {
    addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.keys.add(e.code);
      this.pressed.add(e.code);
      if (['Space', 'Tab', 'KeyM', 'F3'].includes(e.code)) e.preventDefault();
    });
    addEventListener('keyup', (e) => this.keys.delete(e.code));
    addEventListener('blur', () => this.keys.clear());
    addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });
    addEventListener('mousedown', (e) => {
      if (!this.locked && !this.alwaysLocked) return;
      this.pressed.add(`Mouse${e.button}`);
      this.keys.add(`Mouse${e.button}`);
    });
    addEventListener('mouseup', (e) => this.keys.delete(`Mouse${e.button}`));
    document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement) { this.keys.delete('Mouse0'); this.keys.delete('Mouse2'); } });
    addEventListener('contextmenu', (e) => { if (this.locked || this.alwaysLocked) e.preventDefault(); });   // right mouse = scanner
    addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); }, { passive: true });
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === this.canvas; });
  }

  lock() { this.canvas.requestPointerLock?.(); }

  /** Testing: treat the mouse as captured without pointer lock. */
  alwaysLocked = false;

  down(code: string) { return this.keys.has(code); }
  hit(code: string) { return this.pressed.has(code); }

  /** Reads the first gamepad (Steam Deck / controller) into the same key names. */
  pollPad(): { lx: number; ly: number; rx: number; ry: number } {
    const pads = navigator.getGamepads?.() ?? [];
    const p = pads.find((x) => x);
    if (!p) return { lx: 0, ly: 0, rx: 0, ry: 0 };
    const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : v);
    const map: [number, string][] = [[0, 'Space'], [1, 'ShiftLeft'], [2, 'KeyE'], [3, 'KeyM'], [4, 'KeyB'], [5, 'KeyQ'], [7, 'Mouse0'], [8, 'Tab'], [10, 'ShiftLeft'], [9, 'Escape']];
    for (const [i, code] of map) {
      const b = !!p.buttons[i]?.pressed;
      if (b && !this.padPrev[i]) this.pressed.add(code);
      if (b) this.keys.add(code); else if (this.padPrev[i]) this.keys.delete(code);
      this.padPrev[i] = b;
    }
    return { lx: dz(p.axes[0] ?? 0), ly: dz(p.axes[1] ?? 0), rx: dz(p.axes[2] ?? 0), ry: dz(p.axes[3] ?? 0) };
  }

  endFrame() {
    this.pressed.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }
}

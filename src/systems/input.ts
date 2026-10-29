// Keyboard, mouse, gamepad and touch, merged into one simple state the game reads each frame.
export class Input {
  keys = new Set<string>();
  pressed = new Set<string>();
  mouseDX = 0;
  mouseDY = 0;
  wheel = 0;
  locked = false;
  sensitivity = 0.0022;
  /** Touch play (phones and tablets): no pointer lock; the on-screen controls feed this state. */
  touch = false;
  /** On-screen joystick, -1..1 (y down = backwards), added to the gamepad's left stick. */
  stick = { x: 0, y: 0 };
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
    addEventListener('contextmenu', (e) => { if (this.locked || this.alwaysLocked || this.touch) e.preventDefault(); });   // right mouse = scanner
    addEventListener('wheel', (e) => { this.wheel += Math.sign(e.deltaY); }, { passive: true });
    document.addEventListener('pointerlockchange', () => { this.locked = document.pointerLockElement === this.canvas; });
  }

  lock() { if (!this.touch) this.canvas.requestPointerLock?.(); }

  /** On-screen buttons: press and release a key or mouse button by its code (e.g. 'Mouse0'). */
  press(code: string) { this.keys.add(code); this.pressed.add(code); }
  release(code: string) { this.keys.delete(code); }

  /** Testing: treat the mouse as captured without pointer lock. */
  alwaysLocked = false;

  down(code: string) { return this.keys.has(code); }
  hit(code: string) { return this.pressed.has(code); }

  /** Reads the first gamepad (Steam Deck / controller) into the same key names. */
  pollPad(): { lx: number; ly: number; rx: number; ry: number } {
    const pads = navigator.getGamepads?.() ?? [];
    const p = pads.find((x) => x);
    // The touch joystick runs when pushed nearly to its edge.
    if (Math.hypot(this.stick.x, this.stick.y) > 0.92) this.keys.add('ShiftTouch'); else this.keys.delete('ShiftTouch');
    if (!p) return { lx: this.stick.x, ly: this.stick.y, rx: 0, ry: 0 };
    const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : v);
    const map: [number, string][] = [[0, 'Space'], [1, 'ShiftLeft'], [2, 'KeyE'], [3, 'KeyM'], [4, 'KeyB'], [5, 'KeyQ'], [7, 'Mouse0'], [8, 'Tab'], [10, 'ShiftLeft'], [9, 'Escape']];
    for (const [i, code] of map) {
      const b = !!p.buttons[i]?.pressed;
      if (b && !this.padPrev[i]) this.pressed.add(code);
      if (b) this.keys.add(code); else if (this.padPrev[i]) this.keys.delete(code);
      this.padPrev[i] = b;
    }
    const c = (v: number) => Math.max(-1, Math.min(1, v));
    return { lx: c(dz(p.axes[0] ?? 0) + this.stick.x), ly: c(dz(p.axes[1] ?? 0) + this.stick.y), rx: dz(p.axes[2] ?? 0), ry: dz(p.axes[3] ?? 0) };
  }

  endFrame() {
    this.pressed.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
  }
}

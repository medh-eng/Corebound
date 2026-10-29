// On-screen controls for phones and tablets (Android first). A joystick appears wherever the left
// thumb lands; dragging anywhere else turns the camera; buttons press the same keys a keyboard
// would, so the game needs no separate touch logic. Holding Mine or Scan and sliding the thumb
// also turns the camera, so you can aim while the laser runs.
import type { Input } from '../systems/input';

type Mode = 'hidden' | 'play' | 'panel' | 'orbit';
export interface TouchState { mode: Mode; building: boolean; belt: boolean; near: boolean }

/** [code, label, where]. Codes starting with "Mouse" go straight to the input state; the rest are
 *  sent as keyboard events so the game's own key handlers (Tab, Esc, J…) work unchanged. */
const ACTIONS: [string, string, string][] = [
  ['Mouse0', 'Mine', 'a-main'],
  ['Space', 'Jump', 'a-jump'],
  ['KeyE', 'Use', 'a-use'],
  ['Mouse2', 'Scan', 'a-scan'],
  ['KeyR', 'Turn', 'a-turn'],
  ['Escape', 'Cancel', 'a-cancel'],
];
const TOOLS: [string, string][] = [
  ['Tab', 'Bag'], ['KeyB', 'Build'], ['KeyC', 'Belt'], ['KeyJ', 'Codex'], ['KeyM', 'Planet'],
  ['KeyQ', 'O₂'], ['KeyX', 'Pick up'], ['KeyG', 'Dance'],
];
const LOOK_GAIN = 2.4;     // touch pixels → the same units as mouse movement
const STICK_RADIUS = 56;   // pixels

export class TouchControls {
  readonly root: HTMLElement;
  /** Closes whichever panel is open (set by the game). */
  onClose: () => void = () => {};
  private stickEl: HTMLElement;
  private knob: HTMLElement;
  private stickId: number | null = null;
  private stickOrigin = { x: 0, y: 0 };
  private looks = new Map<number, { x: number; y: number }>();
  private mode: Mode = 'hidden';

  constructor(private input: Input) {
    input.touch = true;
    document.body.classList.add('touch');
    const btn = (code: string, label: string, cls: string) => `<button class="tb ${cls}" data-code="${code}" aria-label="${label}">${label}</button>`;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="touch" class="hidden">
        <div class="t-look"></div>
        <div class="t-stick hidden"><i></i></div>
        <div class="t-actions">${ACTIONS.map(([c, l, w]) => btn(c, l, w)).join('')}</div>
        <div class="t-tools">${TOOLS.map(([c, l]) => btn(c, l, 'tool')).join('')}</div>
        <button class="tb t-close" aria-label="Close">✕</button>
      </div>
      <div id="rotate"><div>Turn your phone sideways to play</div></div>`);
    this.root = document.getElementById('touch')!;
    this.stickEl = this.root.querySelector('.t-stick')!;
    this.knob = this.stickEl.querySelector('i')!;

    // Look area: the whole screen behind the buttons. The left part starts the joystick instead.
    const look = this.root.querySelector<HTMLElement>('.t-look')!;
    look.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      look.setPointerCapture(e.pointerId);
      if (this.mode === 'play' && this.stickId === null && e.clientX < innerWidth * 0.4) {
        this.stickId = e.pointerId;
        this.stickOrigin = { x: e.clientX, y: e.clientY };
        this.stickEl.style.left = `${e.clientX}px`; this.stickEl.style.top = `${e.clientY}px`;
        this.stickEl.classList.remove('hidden');
        this.moveStick(e.clientX, e.clientY);
      } else this.looks.set(e.pointerId, { x: e.clientX, y: e.clientY });
    });
    look.addEventListener('pointermove', (e) => {
      if (e.pointerId === this.stickId) this.moveStick(e.clientX, e.clientY);
      else this.lookMove(e);
    });
    const end = (e: PointerEvent) => {
      if (e.pointerId === this.stickId) { this.stickId = null; this.input.stick.x = this.input.stick.y = 0; this.stickEl.classList.add('hidden'); }
      this.looks.delete(e.pointerId);
    };
    look.addEventListener('pointerup', end);
    look.addEventListener('pointercancel', end);

    // Buttons. Mine and Scan also turn the camera while held.
    this.root.querySelectorAll<HTMLButtonElement>('[data-code]').forEach((b) => {
      const code = b.dataset.code!;
      const aims = code === 'Mouse0' || code === 'Mouse2';
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault(); e.stopPropagation();
        b.setPointerCapture(e.pointerId);
        b.classList.add('on');
        this.press(code);
        if (aims) this.looks.set(e.pointerId, { x: e.clientX, y: e.clientY });
      });
      if (aims) b.addEventListener('pointermove', (e) => this.lookMove(e));
      const up = (e: PointerEvent) => { b.classList.remove('on'); this.release(code); this.looks.delete(e.pointerId); };
      b.addEventListener('pointerup', up);
      b.addEventListener('pointercancel', up);
      b.addEventListener('contextmenu', (e) => e.preventDefault());
    });
    this.root.querySelector<HTMLButtonElement>('.t-close')!.addEventListener('click', (e) => { e.preventDefault(); this.onClose(); });
  }

  private moveStick(x: number, y: number) {
    let dx = x - this.stickOrigin.x, dy = y - this.stickOrigin.y;
    const d = Math.hypot(dx, dy);
    if (d > STICK_RADIUS) { dx *= STICK_RADIUS / d; dy *= STICK_RADIUS / d; }
    this.knob.style.transform = `translate(${dx}px, ${dy}px)`;
    this.input.stick.x = dx / STICK_RADIUS;
    this.input.stick.y = dy / STICK_RADIUS;
  }

  private lookMove(e: PointerEvent) {
    const p = this.looks.get(e.pointerId);
    if (!p) return;
    this.input.mouseDX += (e.clientX - p.x) * LOOK_GAIN;
    this.input.mouseDY += (e.clientY - p.y) * LOOK_GAIN;
    p.x = e.clientX; p.y = e.clientY;
  }

  private press(code: string) {
    if (code.startsWith('Mouse')) this.input.press(code);
    else dispatchEvent(new KeyboardEvent('keydown', { code, key: code === 'Escape' ? 'Escape' : code === 'Tab' ? 'Tab' : code.replace('Key', '').toLowerCase(), bubbles: true }));
  }

  private release(code: string) {
    if (code.startsWith('Mouse')) this.input.release(code);
    else dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }));
  }

  /** Called every frame by the game: shows the controls that make sense right now. */
  update(s: TouchState) {
    if (s.mode !== this.mode) {
      this.mode = s.mode;
      this.root.classList.toggle('hidden', s.mode === 'hidden');
      this.root.dataset.mode = s.mode;
      if (s.mode !== 'play') {
        this.stickId = null; this.input.stick.x = this.input.stick.y = 0; this.stickEl.classList.add('hidden');
        for (const c of ['Mouse0', 'Mouse2', 'Space']) this.input.release(c);
        this.root.querySelectorAll('.tb.on').forEach((b) => b.classList.remove('on'));
      }
    }
    const placing = s.building || s.belt;
    this.root.classList.toggle('placing', placing);
    this.root.classList.toggle('near', s.near);
    const main = this.root.querySelector<HTMLElement>('.a-main')!;
    const label = s.building ? 'Place' : s.belt ? 'Pick' : 'Mine';
    if (main.textContent !== label) main.textContent = label;
  }

  /** Full screen and landscape, from the Start button's tap (browsers need a tap for this). */
  static enterFullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement || !el.requestFullscreen) return;
    el.requestFullscreen({ navigationUI: 'hide' })
      .then(() => (screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }).lock?.('landscape'))
      .catch(() => { /* not allowed here: play in the browser window */ });
  }
}

/** True on phones and tablets: a touch screen and no mouse. `?touch=1` / `?touch=0` override. */
export function wantsTouch(param: string | null): boolean {
  if (param === '1') return true;
  if (param === '0') return false;
  return matchMedia('(pointer: coarse)').matches && !matchMedia('(pointer: fine)').matches;
}

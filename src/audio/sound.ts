// Sound and music made in code (Web Audio) until recorded tracks arrive in art-inbox/audio.
// Music: slow D-minor pads with sparse bell notes (80 BPM feel), softer at night.
// Effects: laser, pickups, placing, footsteps, jetpack, alarms, goal chime.

export interface AudioSettings { master: number; music: number; sfx: number }

export class Sound {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private noise!: AudioBuffer;
  private laserNodes: { stop: () => void } | null = null;
  private jetNodes: { stop: () => void } | null = null;
  private wind: GainNode | null = null;
  private musicTimer = 0;
  private chord = 0;
  private stepPhase = 0;
  settings: AudioSettings;

  constructor() {
    let s: AudioSettings = { master: 0.8, music: 0.55, sfx: 0.8 };
    try { s = { ...s, ...JSON.parse(localStorage.getItem('corebound.audio') ?? '{}') }; } catch { /* defaults */ }
    this.settings = s;
  }

  /** Must be called from a click or key press (browsers block sound before that). */
  start() {
    if (this.ctx) { void this.ctx.resume(); return; }
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.musicBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    this.musicBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.master.connect(ctx.destination);
    this.apply();
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // Wind bed.
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 500; bp.Q.value = 0.6;
    const g = ctx.createGain(); g.gain.value = 0.05;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const lfoG = ctx.createGain(); lfoG.gain.value = 260;
    lfo.connect(lfoG).connect(bp.frequency);
    src.connect(bp).connect(g).connect(this.musicBus);
    src.start(); lfo.start();
    this.wind = g;
  }

  set(s: Partial<AudioSettings>) {
    this.settings = { ...this.settings, ...s };
    try { localStorage.setItem('corebound.audio', JSON.stringify(this.settings)); } catch { /* ignore */ }
    this.apply();
  }

  private apply() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.settings.master, t, 0.05);
    this.musicBus.gain.setTargetAtTime(this.settings.music * 0.6, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(this.settings.sfx, t, 0.05);
  }

  private env(g: GainNode, t: number, a: number, peak: number, r: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
  }

  private tone(freq: number, type: OscillatorType, peak: number, a: number, r: number, bus: GainNode, when = 0, detune = 0) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.value = freq; o.detune.value = detune;
    const g = this.ctx.createGain();
    this.env(g, t, a, peak, r);
    o.connect(g).connect(bus);
    o.start(t); o.stop(t + a + r + 0.05);
  }

  private burst(freq: number, q: number, peak: number, r: number, type: BiquadFilterType = 'lowpass') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain(); this.env(g, t, 0.005, peak, r);
    s.connect(f).connect(g).connect(this.sfxBus);
    s.start(t, Math.random()); s.stop(t + r + 0.05);
  }

  // ── Music ─────────────────────────────────────────────
  private static CHORDS = [[50, 53, 57, 62], [46, 50, 53, 58], [53, 57, 60, 65], [48, 52, 55, 60]]; // Dm Bb F C
  private static SCALE = [62, 64, 65, 69, 72, 74, 77, 81]; // D minor pentatonic-ish bells
  private midi(n: number) { return 440 * Math.pow(2, (n - 69) / 12); }

  update(dt: number, night: number, walking: number) {
    if (!this.ctx) return;
    this.musicTimer -= dt;
    if (this.musicTimer <= 0) {
      this.musicTimer = 9;
      const ch = Sound.CHORDS[this.chord++ % Sound.CHORDS.length];
      for (const n of ch) {
        this.tone(this.midi(n - 12), 'triangle', 0.05, 3.5, 6, this.musicBus, 0, -6);
        this.tone(this.midi(n), 'sine', 0.03, 4, 5.5, this.musicBus, 0.2, 7);
      }
      // A few bell notes over the chord; more at night.
      const bells = 2 + Math.round(night * 3);
      for (let i = 0; i < bells; i++) {
        const n = Sound.SCALE[Math.floor(Math.random() * Sound.SCALE.length)];
        this.tone(this.midi(n + (night > 0.5 ? 12 : 0)), 'sine', 0.035, 0.01, 2.8, this.musicBus, 1 + Math.random() * 7);
      }
    }
    if (this.wind) this.wind.gain.setTargetAtTime(0.035 + 0.03 * (1 - night), this.ctx.currentTime, 1);
    // Footsteps follow walking speed.
    if (walking > 0.4) {
      this.stepPhase += dt * (1.6 + walking * 0.28);
      if (this.stepPhase >= 1) { this.stepPhase = 0; this.burst(380 + Math.random() * 120, 0.8, 0.12, 0.09); }
    }
  }

  // ── Effects ───────────────────────────────────────────
  laser(on: boolean) {
    if (!this.ctx) return;
    if (on && !this.laserNodes) {
      const ctx = this.ctx;
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 96;
      const fm = ctx.createOscillator(); fm.frequency.value = 31; const fmg = ctx.createGain(); fmg.gain.value = 22;
      fm.connect(fmg).connect(o.frequency);
      const n = ctx.createBufferSource(); n.buffer = this.noise; n.loop = true;
      const hp = ctx.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 2400; hp.Q.value = 1.2;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1300;
      const g = ctx.createGain(); g.gain.value = 0.0001;
      g.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + 0.08);
      o.connect(lp).connect(g); n.connect(hp).connect(g); g.connect(this.sfxBus);
      o.start(); fm.start(); n.start();
      this.laserNodes = { stop: () => { g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.04); setTimeout(() => { o.stop(); fm.stop(); n.stop(); }, 300); } };
    } else if (!on && this.laserNodes) { this.laserNodes.stop(); this.laserNodes = null; }
  }

  jet(on: boolean) {
    if (!this.ctx) return;
    if (on && !this.jetNodes) {
      const ctx = this.ctx;
      const n = ctx.createBufferSource(); n.buffer = this.noise; n.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
      const g = ctx.createGain(); g.gain.value = 0.0001; g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.1);
      n.connect(f).connect(g).connect(this.sfxBus); n.start();
      this.jetNodes = { stop: () => { g.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06); setTimeout(() => n.stop(), 400); } };
    } else if (!on && this.jetNodes) { this.jetNodes.stop(); this.jetNodes = null; }
  }

  pickup() { this.tone(880, 'sine', 0.12, 0.005, 0.18, this.sfxBus); this.tone(1320, 'sine', 0.08, 0.005, 0.22, this.sfxBus, 0.06); }
  dig() { this.burst(700, 0.7, 0.18, 0.12); }
  place() { this.tone(70, 'sine', 0.4, 0.005, 0.35, this.sfxBus); this.burst(300, 0.6, 0.2, 0.18); }
  click() { this.tone(1500, 'square', 0.04, 0.002, 0.04, this.sfxBus); }
  goal() { [0, 0.12, 0.24].forEach((w, i) => this.tone(this.midi(74 + [0, 3, 7][i]), 'sine', 0.12, 0.01, 1.4, this.sfxBus, w)); }
  alarm() { this.tone(988, 'square', 0.06, 0.005, 0.12, this.sfxBus); this.tone(740, 'square', 0.06, 0.005, 0.12, this.sfxBus, 0.18); }
  get started() { return !!this.ctx; }
}

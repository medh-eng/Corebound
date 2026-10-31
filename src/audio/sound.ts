// Sound and music (Web Audio).
// Recorded effects come from public/assets/audio/sfx (made from art-inbox/audio/sfx by
// scripts/process-audio.py and listed in index.json). Anything without a recording falls back
// to a sound made in code. Music is code-made (D-minor pads and bells) until owner tracks arrive.
// SARATHI's spoken lines are recorded files (public/assets/audio/voice) mapped in data/voice.ts.
import { VOICE_FILE } from '../data/voice';

export interface AudioSettings { master: number; music: number; sfx: number; voice: number }

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
  private buffers = new Map<string, AudioBuffer>();
  private musicFiles = new Set<string>();
  private tracks = new Map<string, { el: HTMLAudioElement; gain: GainNode }>();
  private currentTrack: string | null = null;
  private loops = new Map<string, { src: AudioBufferSourceNode; gain: GainNode }>();
  private lastStep = '';
  // SARATHI's recorded voice (Sarvam Bulbul, T-005): one file per line of text.
  private voiceBus!: GainNode;
  private voiceSrc: AudioBufferSourceNode | null = null;
  private voiceCache = new Map<string, AudioBuffer>();
  /** Surface under the player's feet, for footsteps: grass, rock, metal, sand, snow. */
  surface = 'grass';
  settings: AudioSettings;

  constructor() {
    let s: AudioSettings = { master: 0.8, music: 0.55, sfx: 0.8, voice: 0.9 };
    current = this;
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
    this.voiceBus = ctx.createGain();
    this.musicBus.connect(this.master);
    this.sfxBus.connect(this.master);
    this.voiceBus.connect(this.master);
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
    void this.loadSamples();
    void this.loadMusicList();
  }

  private async loadMusicList() {
    const base = `${import.meta.env.BASE_URL}assets/audio/music/`;
    try {
      const list = (await (await fetch(`${base}index.json`)).json()) as string[];
      for (const f of list) this.musicFiles.add(f);
      // Short factory loops are decoded; long tracks are streamed when needed.
      await Promise.all(list.filter((f) => f.startsWith('factory_layer')).map(async (f) => {
        try { this.buffers.set('music_' + f.replace(/\.(mp3|wav)$/, ''), await this.ctx!.decodeAudioData(await (await fetch(base + f)).arrayBuffer())); } catch { /* skip */ }
      }));
    } catch { /* no music yet */ }
  }

  /** Crossfades to a recorded track (null = silence; code-made pads take over). Tracks loop. */
  playMusic(name: string | null) {
    if (!this.ctx || name === this.currentTrack) return;
    const file = name ? [...this.musicFiles].find((f) => f.startsWith(name + '.')) : undefined;
    if (name && !file) return;   // not delivered: keep whatever plays now
    const t = this.ctx.currentTime;
    if (this.currentTrack) {
      const old = this.tracks.get(this.currentTrack);
      if (old) { old.gain.gain.setTargetAtTime(0, t, 1.2); const el = old.el; setTimeout(() => { if (old.gain.gain.value < 0.02) el.pause(); }, 6000); }
    }
    this.currentTrack = name;
    if (!name || !file) return;
    let tr = this.tracks.get(name);
    if (!tr) {
      const el = new Audio(`${import.meta.env.BASE_URL}assets/audio/music/${file}`);
      el.loop = true; el.preload = 'auto';
      const src = this.ctx.createMediaElementSource(el);
      const gain = this.ctx.createGain(); gain.gain.value = 0;
      src.connect(gain).connect(this.musicBus);
      tr = { el, gain };
      this.tracks.set(name, tr);
    }
    void tr.el.play().catch(() => { /* blocked until a click */ });
    tr.gain.gain.setTargetAtTime(1, t, 1.5);
  }
  get recordedMusic() { return this.currentTrack !== null; }

  private async loadSamples() {
    const base = `${import.meta.env.BASE_URL}assets/audio/sfx/`;
    try {
      const list = (await (await fetch(`${base}index.json`)).json()) as string[];
      await Promise.all(list.map(async (f) => {
        try {
          const buf = await this.ctx!.decodeAudioData(await (await fetch(base + f)).arrayBuffer());
          this.buffers.set(f.replace(/\.(mp3|wav|ogg)$/, ''), buf);
        } catch { /* skip a broken file; the code-made sound stays */ }
      }));
    } catch { /* no recordings yet */ }
  }

  has(name: string) { return this.buffers.has(name); }

  /** Says a SARATHI line, if a recording exists for it. Silent when there is none. */
  speakVoice(text: string) {
    if (!this.ctx || this.settings.voice <= 0) return;
    const file = VOICE_FILE[text.trim()];
    if (file) void this.playVoiceFile(file);
  }

  /** Cuts the line that is playing: a new line always interrupts the last one. */
  stopVoice() {
    if (!this.voiceSrc) return;
    try { this.voiceSrc.stop(); } catch { /* already finished */ }
    this.voiceSrc = null;
  }

  private async playVoiceFile(file: string) {
    if (!this.ctx) return;
    const cached = this.voiceCache.get(file);
    let buf: AudioBuffer;
    if (cached) buf = cached;
    else {
      try { buf = await this.ctx.decodeAudioData(await (await fetch(`${import.meta.env.BASE_URL}assets/audio/voice/${file}`)).arrayBuffer()); } catch { return; }
      this.voiceCache.set(file, buf);
    }
    this.stopVoice();
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    src.connect(this.voiceBus);
    src.onended = () => { if (this.voiceSrc === src) this.voiceSrc = null; };
    this.voiceSrc = src;
    src.start();
  }

  /** Plays a recorded one-shot. Returns false when it is missing (caller can fall back). */
  play(name: string, vol = 1, rate = 1, jitter = 0): boolean {
    const buf = this.buffers.get(name);
    if (!this.ctx || !buf) return false;
    const src = this.ctx.createBufferSource(); src.buffer = buf;
    src.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * jitter);
    const g = this.ctx.createGain(); g.gain.value = vol;
    src.connect(g).connect(this.sfxBus); src.start();
    return true;
  }

  /** Starts or stops a recorded loop, fading in and out. `vol` can change while it plays. */
  loop(name: string, on: boolean, vol = 1, fade = 0.08, bus?: GainNode): boolean {
    const buf = this.buffers.get(name);
    if (!this.ctx || !buf) return false;
    const cur = this.loops.get(name);
    const t = this.ctx.currentTime;
    if (on && !cur) {
      const src = this.ctx.createBufferSource(); src.buffer = buf; src.loop = true;
      const gain = this.ctx.createGain(); gain.gain.value = 0;
      gain.gain.setTargetAtTime(vol, t, fade);
      src.connect(gain).connect(bus ?? this.sfxBus); src.start(t, name.startsWith('music_') ? 0 : Math.random() * buf.duration);
      this.loops.set(name, { src, gain });
    } else if (on && cur) {
      cur.gain.gain.setTargetAtTime(vol, t, 0.1);
    } else if (!on && cur) {
      cur.gain.gain.setTargetAtTime(0, t, fade);
      cur.src.stop(t + fade * 6);
      this.loops.delete(name);
    }
    return true;
  }

  private step() {
    const n = [1, 2, 3, 4, 5, 6].filter((i) => this.buffers.has(`step_${this.surface}_${i}`) && `step_${this.surface}_${i}` !== this.lastStep);
    if (n.length) {
      const name = `step_${this.surface}_${n[Math.floor(Math.random() * n.length)]}`;
      this.lastStep = name;
      this.play(name, 0.9, 1, 0.06);
    } else this.burst(380 + Math.random() * 120, 0.8, 0.12, 0.09);
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
    this.voiceBus.gain.setTargetAtTime(this.settings.voice, t, 0.05);
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

  private burstTo(bus: GainNode, freq: number, q: number, peak: number, r: number, type: BiquadFilterType = 'lowpass') {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain(); this.env(g, t, 0.003, peak, r);
    s.connect(f).connect(g).connect(bus);
    s.start(t, Math.random()); s.stop(t + r + 0.05);
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

  private static DARK = [[50, 53, 56, 62], [49, 53, 56, 61], [46, 50, 53, 56], [48, 51, 55, 58]]; // uneasy: dim and minor
  private beat = 0;
  private beatN = 0;

  /** night 0..1; walking speed; activity 0..1 = how much of the factory is running; harmony 0..1. */
  update(dt: number, night: number, walking: number, activity = 0, harmony = 1) {
    if (!this.ctx) return;
    // Factory layer: a soft mechanical pulse at 80 BPM that grows with the factory (GDD §17).
    this.beat -= dt;
    if (this.beat <= 0) {
      this.beat += 0.75;
      this.beatN++;
      if (activity > 0.05 && !this.has('music_factory_layer_1')) {
        const v = 0.05 + activity * 0.1;
        if (this.beatN % 2 === 0) this.tone(55, 'sine', v * 1.4, 0.004, 0.22, this.musicBus);           // thump
        this.burstTo(this.musicBus, 5200, 0.9, v * 0.35, 0.05, 'highpass');                              // tick
        if (activity > 0.45 && this.beatN % 4 === 3) this.tone(this.midi(62), 'triangle', v * 0.5, 0.004, 0.18, this.musicBus); // ping
      }
    }
    // Recorded factory layers: more join as more machines run.
    if (this.has('music_factory_layer_1')) {
      this.loop('music_factory_layer_1', activity > 0.05, 0.35 + activity * 0.35, 1.5, this.musicBus);
      this.loop('music_factory_layer_2', activity > 0.4, 0.3 + activity * 0.3, 1.5, this.musicBus);
      this.loop('music_factory_layer_3', activity > 0.75, 0.3, 1.5, this.musicBus);
    }
    this.musicTimer -= dt;
    if (this.musicTimer <= 0 && this.recordedMusic) this.musicTimer = 9;   // recorded music replaces the code-made pads
    if (this.musicTimer <= 0) {
      this.musicTimer = 9;
      const set = harmony < 0.5 ? Sound.DARK : Sound.CHORDS;
      const ch = set[this.chord++ % set.length];
      for (const n of ch) {
        this.tone(this.midi(n - 12), 'triangle', 0.05, 3.5, 6, this.musicBus, 0, -6);
        this.tone(this.midi(n), 'sine', 0.03, 4, 5.5, this.musicBus, 0.2, 7);
      }
      // A few bell notes over the chord; more at night.
      const bells = Math.max(0, Math.round((2 + night * 3) * Math.min(1, harmony * 1.4) + (harmony > 0.85 ? 2 : 0)));
      for (let i = 0; i < bells; i++) {
        const n = Sound.SCALE[Math.floor(Math.random() * Sound.SCALE.length)];
        this.tone(this.midi(n + (night > 0.5 ? 12 : 0)), 'sine', 0.035, 0.01, 2.8, this.musicBus, 1 + Math.random() * 7);
      }
    }
    if (this.wind) this.wind.gain.setTargetAtTime(0.035 + 0.03 * (1 - night), this.ctx.currentTime, 1);
    // Footsteps follow walking speed.
    if (walking > 0.4) {
      this.stepPhase += dt * (1.6 + walking * 0.28);
      if (this.stepPhase >= 1) { this.stepPhase = 0; this.step(); }
    }
  }

  // ── Effects ───────────────────────────────────────────
  /** Laser on/off; `hit` is what the beam touches ('rock', 'crystal' or null for nothing). */
  laser(on: boolean, hit: 'rock' | 'crystal' | null = null) {
    if (!this.ctx) return;
    if (this.has('laser_loop')) {
      const was = this.loops.has('laser_loop');
      if (on && !was) this.play('laser_start', 0.8);
      if (!on && was) this.play('laser_stop', 0.8);
      this.loop('laser_loop', on, 0.7);
      this.loop('laser_hit_rock', on && hit === 'rock', 0.8);
      this.loop('laser_hit_crystal', on && hit === 'crystal', 0.8);
      return;
    }
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
    if (this.has('jetpack_loop')) {
      const was = this.loops.has('jetpack_loop');
      if (on && !was) this.play('jetpack_start', 0.7);
      if (!on && was) this.play('jetpack_stop', 0.5);
      this.loop('jetpack_loop', on, 0.6, 0.12);
      return;
    }
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
  dig() { if (!this.play('dig_chunk', 0.7, 1, 0.12)) this.burst(700, 0.7, 0.18, 0.12); }
  place() { if (!this.play('place_machine', 0.9)) { this.tone(70, 'sine', 0.4, 0.005, 0.35, this.sfxBus); this.burst(300, 0.6, 0.2, 0.18); } }
  click() { if (!this.play('ui_click', 0.8)) this.tone(1500, 'square', 0.04, 0.002, 0.04, this.sfxBus); }
  goal() { [0, 0.12, 0.24].forEach((w, i) => this.tone(this.midi(74 + [0, 3, 7][i]), 'sine', 0.12, 0.01, 1.4, this.sfxBus, w)); }
  alarm() { if (!this.play('o2_low', 0.8)) { this.tone(988, 'square', 0.06, 0.005, 0.12, this.sfxBus); this.tone(740, 'square', 0.06, 0.005, 0.12, this.sfxBus, 0.18); } }
  jump() { this.play('jump', 0.6, 1, 0.05); }
  land(strength: number) { this.play('land', Math.min(1, 0.3 + strength * 0.12), 1, 0.05); }
  canister() { this.play('canister_breathe', 0.8); }
  blackout() { this.play('blackout', 0.8); }
  lamp() { this.play('helmet_lamp', 0.5); }
  uiOpen() { this.play('ui_open', 0.6); }
  uiClose() { this.play('ui_close', 0.6); }
  pickupMachine() { this.play('pickup_machine', 0.8); }
  powerOut() { this.play('power_out', 0.8); }
  powerOn() { this.play('power_on', 0.7); }
  /** Heavy breathing while oxygen is low. */
  breathing(on: boolean) { this.loop('breath_low', on, 0.55, 0.6); }
  /** A working smelter nearby: volume falls with distance (metres). */
  smelter(dist: number | null) { this.loop('smelter_loop', dist !== null && dist < 14, dist === null ? 0 : Math.max(0, 1 - dist / 14) * 0.8, 0.4); }
  get started() { return !!this.ctx; }
}

/** The one Sound of the running game, so the HUD can speak SARATHI's lines. */
let current: Sound | null = null;
export const sharedSound = () => current;

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Sound } from '../src/audio/sound';
import { VOICE_FILE } from '../src/data/voice';
import { UI } from '../src/ui/ui';

class Param {
  value = 1;
  setTargetAtTime = vi.fn((value: number, _time: number, _constant: number) => { this.value = value; });
  setValueAtTime = vi.fn((value: number, _time: number) => { this.value = value; });
  linearRampToValueAtTime = vi.fn((_value: number, _time: number) => {});
  cancelAndHoldAtTime = vi.fn((_time: number) => {});
  cancelScheduledValues = vi.fn((_time: number) => {});
}
class Node {
  connections: unknown[] = [];
  connect<T>(node: T): T { this.connections.push(node); return node; }
}
class Gain extends Node { gain = new Param(); }
class Source extends Node {
  buffer: { duration: number } | null = null;
  loop = false;
  onended: (() => void) | null = null;
  start = vi.fn();
  stop = vi.fn(() => { this.onended?.(); });
  finish() { this.onended?.(); }
}
class Context {
  currentTime = 10;
  sampleRate = 10;
  destination = new Node();
  gains: Gain[] = [];
  sources: Source[] = [];
  createGain() { const g = new Gain(); this.gains.push(g); return g; }
  createBufferSource() { const s = new Source(); this.sources.push(s); return s; }
  createBuffer(_channels: number, length: number, rate: number) {
    return { duration: length / rate, getChannelData: () => new Float32Array(length) };
  }
  createBiquadFilter() { return Object.assign(new Node(), { type: '', frequency: new Param(), Q: new Param() }); }
  createOscillator() { return Object.assign(new Node(), { frequency: new Param(), start: vi.fn() }); }
  async decodeAudioData(bytes: ArrayBuffer) { return { duration: bytes.byteLength }; }
}

const [first, second] = Object.keys(VOICE_FILE);
const response = (seconds: number) => ({ arrayBuffer: async () => new ArrayBuffer(seconds) });
const deferred = <T>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => { resolve = r; });
  return { promise, resolve };
};

describe('SARATHI voice ducking and subtitles', () => {
  let ctx: Context;
  let sound: Sound;
  let fetcher: ReturnType<typeof vi.fn>;
  let hud: UI;
  let hidden: Set<string>;
  let subtitle: { textContent: string };
  const music = () => ctx.gains[1].gain;
  const effects = () => ctx.gains[2].gain;
  const duck = () => ctx.gains[4].gain;
  const source = () => ctx.sources[ctx.sources.length - 1];
  const say = (line = first, seconds?: number) => UI.prototype.sarathi.call(hud, line, seconds);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('performance', { now: () => Date.now() });
    ctx = new Context();
    vi.stubGlobal('AudioContext', class { constructor() { return ctx; } });
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: vi.fn() });
    fetcher = vi.fn(async (url: string) => url.includes('/voice/') ? response(12) : { json: async () => [] });
    vi.stubGlobal('fetch', fetcher);
    vi.stubGlobal('window', { setTimeout });
    hidden = new Set(['hidden']);
    subtitle = { textContent: '' };
    vi.stubGlobal('document', {
      body: { classList: { contains: () => false } },
      querySelector: (selector: string) => selector === '#sarathi .line' ? subtitle
        : { classList: { add: (c: string) => hidden.add(c), remove: (c: string) => hidden.delete(c) } },
    });
    hud = { sarathiRequest: 0, sarathiTimer: 0 } as unknown as UI;
    sound = new Sound();
    sound.start();
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it('returns decoded seconds, dips over 0.25 s and restores over 0.8 s', async () => {
    const effectsCalls = effects().setTargetAtTime.mock.calls.length;
    expect(await sound.speakVoice(first)).toBe(12);
    expect(duck().cancelAndHoldAtTime).toHaveBeenLastCalledWith(10);
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(0.45, 10.25);
    ctx.currentTime = 22;
    source().finish();
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 22.8);
    expect(effects().setTargetAtTime).toHaveBeenCalledTimes(effectsCalls);
    expect(effects().linearRampToValueAtTime).not.toHaveBeenCalled();
    expect(ctx.gains[1].connections).toContain(ctx.gains[4]);
    expect(ctx.gains[2].connections).toContain(ctx.gains[0]);
  });
  it('returns 0 and never ducks before audio starts, for missing recordings, or when muted', async () => {
    expect(await new Sound().speakVoice(first)).toBe(0);
    expect(await sound.speakVoice('A line without a recording')).toBe(0);
    sound.set({ voice: 0 });
    expect(await sound.speakVoice(first)).toBe(0);
    expect(duck().linearRampToValueAtTime).not.toHaveBeenCalled();
  });
  it('restores music when explicitly interrupted, without a following line', async () => {
    await sound.speakVoice(first);
    const old = source();
    ctx.currentTime = 11;
    sound.stopVoice();
    expect(old.stop).toHaveBeenCalledOnce();
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 11.8);
  });
  it('uses the cached duration and ignores the previous source ending after replacement', async () => {
    await sound.speakVoice(first);
    const old = source();
    const ended = old.onended!;
    const requests = fetcher.mock.calls.length;
    expect(await sound.speakVoice(first)).toBe(12);
    expect(fetcher).toHaveBeenCalledTimes(requests);
    ended();
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(0.45, 10.25);
    source().finish();
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 10.8);
  });
  it('keeps the envelope when settings change and restores it when voice is muted', async () => {
    await sound.speakVoice(first);
    sound.set({ music: 0.2 });
    expect(music().setTargetAtTime).toHaveBeenLastCalledWith(0.12, 10, 0.05);
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(0.45, 10.25);
    sound.set({ voice: 0 });
    expect(source().stop).toHaveBeenCalledOnce();
    expect(duck().linearRampToValueAtTime).toHaveBeenLastCalledWith(1, 10.8);
  });
  it('does not play or duck a superseded download', async () => {
    const pending = deferred<ReturnType<typeof response>>();
    fetcher.mockImplementationOnce(() => pending.promise);
    const old = sound.speakVoice(first);
    expect(await sound.speakVoice(second)).toBe(12);
    const current = source();
    pending.resolve(response(20));
    expect(await old).toBe(0);
    expect(source()).toBe(current);
    expect(current.stop).not.toHaveBeenCalled();
  });
  it.each(['stop', 'mute'])('cancels a pending download on %s', async (action) => {
    const pending = deferred<ReturnType<typeof response>>();
    fetcher.mockImplementationOnce(() => pending.promise);
    const play = sound.speakVoice(first);
    if (action === 'mute') sound.set({ voice: 0 });
    else sound.stopVoice();
    pending.resolve(response(12));
    expect(await play).toBe(0);
    expect(duck().linearRampToValueAtTime).not.toHaveBeenCalled();
  });
  it('returns 0 on a failed recording without lowering music', async () => {
    fetcher.mockRejectedValueOnce(new Error('missing recording'));
    expect(await sound.speakVoice(first)).toBe(0);
    expect(duck().linearRampToValueAtTime).not.toHaveBeenCalled();
  });
  it('holds the subtitle through the full recording plus one second', async () => {
    say();
    await vi.advanceTimersByTimeAsync(12999);
    expect(hidden.has('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(hidden.has('hidden')).toBe(true);
  });
  it('preserves the requested text time when it exceeds the voice', async () => {
    say(first, 20);
    await vi.advanceTimersByTimeAsync(19999);
    expect(hidden.has('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(hidden.has('hidden')).toBe(true);
  });
  it('uses the normal text timeout when there is no recording', async () => {
    say('A line without a recording');
    await vi.advanceTimersByTimeAsync(6999);
    expect(hidden.has('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(hidden.has('hidden')).toBe(true);
  });
  it('keeps a delayed recording visible and cannot let an old request hide newer text', async () => {
    const pending = deferred<ReturnType<typeof response>>();
    fetcher.mockImplementationOnce(() => pending.promise);
    say(first);
    await vi.advanceTimersByTimeAsync(10000);
    expect(hidden.has('hidden')).toBe(false);
    say(second, 20);
    await vi.advanceTimersByTimeAsync(0);
    pending.resolve(response(3));
    await vi.advanceTimersByTimeAsync(19999);
    expect(subtitle.textContent).toBe(second);
    expect(hidden.has('hidden')).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(hidden.has('hidden')).toBe(true);
  });
});

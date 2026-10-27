#!/usr/bin/env python3
"""Turns sound uploads in art-inbox/audio/sfx into game-ready sounds in public/assets/audio/sfx.

Recipes live in scripts/audio.config.json. Each sound is trimmed, optionally re-pitched,
reversed or filtered, levelled to a target loudness, faded, and saved:
  shot  -> one-shot .mp3
  loop  -> seamless loop .wav (crossfaded end into start; mp3 would click at the seam)
  steps -> several single footsteps cut out of long recordings: <out>_1.mp3 ... <out>_N.mp3
Also writes public/assets/audio/sfx/index.json listing what exists, so the game can load it.
Needs ffmpeg and numpy.  Usage: python3 scripts/process-audio.py [name ...]
"""
import json, os, subprocess, sys
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art-inbox', 'audio', 'sfx')
OUT = os.path.join(ROOT, 'public', 'assets', 'audio', 'sfx')
SR = 44100


def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SRC, name), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def resample(x, rate, rate_end=None):
    """Play x at `rate` (2 = octave up). With rate_end the rate glides across the clip."""
    if rate == 1 and rate_end is None:
        return x
    n_out = int(len(x) / ((rate + (rate_end or rate)) / 2))
    r = np.linspace(rate, rate_end if rate_end is not None else rate, n_out)
    pos = np.cumsum(r) - r[0]
    pos = pos[pos < len(x) - 1]
    return np.interp(pos, np.arange(len(x)), x)


def lowpass(x, hz):
    # One-pole low-pass run twice: gentle and enough to dull a roar.
    a = np.exp(-2 * np.pi * hz / SR)
    for _ in range(2):
        y = np.empty_like(x); acc = 0.0
        for i, v in enumerate(x):
            acc = (1 - a) * v + a * acc; y[i] = acc
        x = y
    return x


def level(x, target_db):
    """Scale so the loud part of the sound sits at target_db RMS, then keep peaks under -1 dBFS."""
    hop = 441
    n = max(1, len(x) // hop)
    env = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-12
    loud = env[env > env.max() * 0.1]
    rms = np.sqrt((loud ** 2).mean())
    x = x * (10 ** (target_db / 20) / rms)
    peak = np.abs(x).max()
    lim = 10 ** (-1 / 20)
    if peak > lim:
        x = x * (lim / peak)
    return x


def peak_level(x, target_db):
    return x * (10 ** (target_db / 20) / (np.abs(x).max() + 1e-12))


def fades(x, fin=0.004, fout=0.06):
    a, b = int(fin * SR), int(min(fout * SR, len(x) // 2))
    x = x.copy()
    if a: x[:a] *= np.linspace(0, 1, a)
    if b: x[-b:] *= np.linspace(1, 0, b) ** 2
    return x


def make_loop(x, dur, xf):
    """Equal-power crossfade of the tail into the head so the loop has no seam."""
    L, X = int(dur * SR), int(xf * SR)
    seg = x[:L + X]
    if len(seg) < L + X:
        raise ValueError('source too short for loop')
    out = seg[:L].copy()
    t = np.linspace(0, np.pi / 2, X)
    out[:X] = seg[:X] * np.sin(t) + seg[L:L + X] * np.cos(t)
    return out


def save(x, name, fmt):
    pcm = (np.clip(x, -1, 1) * 32767).astype('<i2').tobytes()
    path = os.path.join(OUT, f'{name}.{fmt}')
    args = ['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-']
    args += (['-c:a', 'libmp3lame', '-b:a', '112k'] if fmt == 'mp3' else ['-ar', '32000', '-c:a', 'pcm_s16le'])
    subprocess.run(args + [path], input=pcm, check=True)
    return f'{name}.{fmt}'


def hits(x):
    """Find single impacts: (start sample, peak dB) for short bursts that stand out from the file."""
    hop = 441
    n = len(x) // hop
    env = np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9
    db = 20 * np.log10(env)
    thr = db.max() - 22
    found, active, start = [], False, 0
    for i, v in enumerate(db):
        if not active and v > thr:
            active, start = True, i
        elif active and v < thr - 8:
            active = False
            dur = (i - start) / 100
            if 0.04 <= dur <= 0.7:
                # Anchor on the loudest sample so the step lands at the start of the clip.
                a, b = start * hop, i * hop
                pk = a + int(np.abs(x[a:b]).argmax())
                seg = x[pk:pk + int(0.3 * SR)]
                # Clean steps are sharp: high peak compared with their average level.
                crest = np.abs(seg).max() / (np.sqrt((seg ** 2).mean()) + 1e-9)
                found.append((pk, db[start:i].max(), crest))
    return found
    return found


def process(r):
    kind = r['kind']
    if kind == 'steps':
        cands = []
        for s in r['srcs']:
            x = load(s)
            hs = hits(x)
            if not hs: continue
            top = max(p for _, p, _ in hs)
            for st, p, crest in hs:
                if p > top - 9 and crest > 3.5:
                    cands.append((x, st))
        if not cands:
            return []
        pick = [cands[int(i)] for i in np.linspace(0, len(cands) - 1, min(r['count'], len(cands)))]
        outs = []
        for k, (x, st) in enumerate(pick, 1):
            a = max(0, st - int(0.012 * SR))
            seg = x[a:a + int(0.34 * SR)]
            outs.append(save(fades(level(seg, r['level']), 0.003, 0.12), f"{r['out']}_{k}", 'mp3'))
        return outs
    x = load(r['src'])
    rate = r.get('rate', 1.0)
    a = int(r.get('start', 0) * SR)
    need = r['dur'] + r.get('xfade', 0)
    b = a + int(need * SR * max(rate, r.get('rateEnd', rate)) + SR * 0.05)
    x = x[a:b]
    if r.get('reverse'): x = x[::-1]
    x = resample(x, rate, r.get('rateEnd'))
    if 'lowpass' in r: x = lowpass(x, r['lowpass'])
    if kind == 'loop':
        x = make_loop(x, r['dur'], r['xfade'])
        return [save(level(x, r['level']), r['out'], 'wav')]
    x = x[:int(r['dur'] * SR)]
    lv = peak_level(x, r['peak']) if 'peak' in r else level(x, r['level'])
    return [save(fades(lv, 0.002, min(0.25, r['dur'] * 0.3)), r['out'], 'mp3')]


MUSIC_SRC = os.path.join(ROOT, 'art-inbox', 'audio', 'music')
MUSIC_OUT = os.path.join(ROOT, 'public', 'assets', 'audio', 'music')


def music(r):
    src = os.path.join(MUSIC_SRC, r['src'])
    if r['kind'] == 'stream':
        out = os.path.join(MUSIC_OUT, r['out'] + '.mp3')
        dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', src], capture_output=True, text=True).stdout)
        length = min(dur, r.get('max', dur))
        af = f"loudnorm=I=-18:TP=-1.5:LRA=11,afade=t=in:d=2,afade=t=out:st={max(0, length - 4):.2f}:d=4"
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-t', f'{length:.2f}', '-af', af, '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '128k', out], check=True)
        return f"{r['out']}.mp3 ({length:.0f} s)"
    # beatloop: an exact number of beats, ends crossfaded into the start
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).astype(np.float64).reshape(-1, 2)
    L = int(round(r['beats'] * 60 / r['bpm'] * SR))
    X = int(0.02 * SR)
    if len(x) < L + X:
        x = np.concatenate([x, np.zeros((L + X - len(x), 2))])
    seg = x[:L + X]
    out = seg[:L].copy()
    t = np.linspace(0, np.pi / 2, X)[:, None]
    out[:X] = seg[:X] * np.sin(t) + seg[L:L + X] * np.cos(t)
    out *= (10 ** (-20 / 20)) / (np.sqrt((out ** 2).mean()) + 1e-9)
    out = np.clip(out, -0.95, 0.95)
    pcm = (out * 32767).astype('<i2').tobytes()
    path = os.path.join(MUSIC_OUT, r['out'] + '.wav')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '2', '-i', '-', '-c:a', 'pcm_s16le', path], input=pcm, check=True)
    return f"{r['out']}.wav ({L / SR:.2f} s loop)"


def main():
    cfg = json.load(open(os.path.join(ROOT, 'scripts', 'audio.config.json')))
    os.makedirs(OUT, exist_ok=True)
    only = set(sys.argv[1:])
    for r in cfg['sounds']:
        if only and r['out'] not in only: continue
        srcs = r.get('srcs', [r.get('src')])
        if not all(os.path.exists(os.path.join(SRC, s)) for s in srcs):
            print(f"skip {r['out']}: source missing"); continue
        made = process(r)
        print(f"{r['out']:20s} -> {', '.join(made) if made else 'NOTHING (no clean hits found)'}")
    files = sorted(f for f in os.listdir(OUT) if f.endswith(('.mp3', '.wav')))
    json.dump(files, open(os.path.join(OUT, 'index.json'), 'w'), indent=0)
    os.makedirs(MUSIC_OUT, exist_ok=True)
    for r in cfg.get('music', []):
        if only and r['out'] not in only: continue
        if not os.path.exists(os.path.join(MUSIC_SRC, r['src'])):
            print(f"skip {r['out']}: source missing"); continue
        print(f"{r['out']:20s} -> {music(r)}")
    mf = sorted(f for f in os.listdir(MUSIC_OUT) if f.endswith(('.mp3', '.wav')))
    json.dump(mf, open(os.path.join(MUSIC_OUT, 'index.json'), 'w'), indent=0)


if __name__ == '__main__':
    main()

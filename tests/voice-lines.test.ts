import { describe, it, expect } from 'vitest';
import { VOICE_LINES, VOICE_FILE } from '../src/data/voice';

describe('SARATHI voice file names (T-040)', () => {
  it('no two different lines share one file name', () => {
    const byFile = new Map<string, string>();
    const clashes: string[] = [];
    for (const l of VOICE_LINES) {
      const t = byFile.get(l.file);
      if (t !== undefined && t !== l.text) clashes.push(l.file);
      byFile.set(l.file, l.text);
    }
    expect(clashes).toEqual([]);
  });
  it('the Chapter 1 script has its 56 files (52 desktop lines and 4 phone variants)', () => {
    const ch1 = VOICE_LINES.filter((l) => ['intro', 'guardian', 'chamber', 'liftoff', 'creature', 'stuck'].includes(l.group));
    expect(ch1.length).toBe(56);
    expect(ch1.filter((l) => l.file.endsWith('_touch.mp3')).length).toBe(4);
  });
  it('the reworded wake-up line is the one in the script', () => {
    expect(VOICE_LINES.find((l) => l.file === 'intro_systems.mp3')!.text.startsWith('Systems online.')).toBe(true);
  });
  it('lines waiting for a recording never play an old file', () => {
    expect(Object.values(VOICE_FILE).some((f) => f.startsWith('intro_') || f.startsWith('stuck_'))).toBe(false);
  });
});

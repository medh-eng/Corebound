import { describe, it, expect } from 'vitest';
import { VOICE_FILE } from '../src/data/voice';

describe('SARATHI voice files', () => {
  it('every mapped line has its recording in public/assets/audio/voice', () => {
    // Vite lists the recordings at build time, so no Node file access is needed.
    const files = new Set(Object.keys(import.meta.glob('../public/assets/audio/voice/*.mp3')).map((p) => p.split('/').pop()));
    const missing = [...new Set(Object.values(VOICE_FILE))].filter((f) => !files.has(f));
    expect(missing).toEqual([]);
  });
});

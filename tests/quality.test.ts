import { describe, expect, it } from 'vitest';
import { chooseQuality, readQuality } from '../src/ui/ui';

describe('graphics quality choice', () => {
  const qualities = ['phone', 'low', 'high'] as const;

  it('lets each valid URL override win over every saved value on either device', () => {
    for (const touch of [false, true]) {
      for (const url of qualities) {
        for (const saved of [...qualities, null, 'broken']) {
          expect(chooseQuality(url, saved, touch)).toBe(url);
        }
      }
    }
  });

  it('uses each saved preset when the URL is absent or invalid', () => {
    for (const touch of [false, true]) {
      for (const saved of qualities) {
        for (const url of [null, '', 'broken']) {
          expect(chooseQuality(url, saved, touch)).toBe(saved);
        }
      }
    }
  });

  it('ignores broken saved values and falls back to the device default', () => {
    for (const saved of [null, '', 'broken', 'High', 'undefined']) {
      for (const url of [null, '', 'broken']) {
        expect(chooseQuality(url, saved, true)).toBe('phone');
        expect(chooseQuality(url, saved, false)).toBe('high');
      }
    }
  });

  it('still honours URL and device choices when browser storage is unavailable', () => {
    // Node has no window, exercising the same guarded read as denied browser storage.
    expect(readQuality('low', true)).toBe('low');
    expect(readQuality(null, true)).toBe('phone');
    expect(readQuality(null, false)).toBe('high');
  });
});

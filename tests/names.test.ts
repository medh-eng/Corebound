import { describe, expect, it } from 'vitest';
import { FLORA_NAMES } from '../src/data/names';
import { codexById } from '../src/data/codex';

describe('T-017 plant and rock names', () => {
  it('every chosen name is on its Codex entry, with its Devanagari', () => {
    for (const [id, n] of Object.entries(FLORA_NAMES)) {
      const e = codexById(id);
      expect(e, id).toBeTruthy();
      expect(e!.name).toBe(n.name);
      expect(e!.deva).toBe(n.deva);
      expect(n.deva).toMatch(/^[ऀ-ॿ]+$/);
    }
  });
});

import { describe, expect, it } from 'vitest';
import { INTRO_LINES, GUARDIAN_LINES, CHAMBER_LINES, LIFTOFF_LINES } from '../src/data/scenes';
import { FLORA_NAMES } from '../src/data/names';

const ALL = { ...INTRO_LINES, ...GUARDIAN_LINES, ...CHAMBER_LINES, ...LIFTOFF_LINES };
const VIOLENT = /\b(fight|fought|kill|attack|weapon|enemy|defeat|beat|beaten|shoot|stun|stunned|destroy|battle|target)\w*/i;

describe('Chapter 1 scene lines (T-022)', () => {
  it('keeps every line short enough to say aloud', () => {
    for (const [id, line] of Object.entries(ALL)) expect(line.split(/\s+/).length, id).toBeLessThanOrEqual(30);
  });
  it('uses no violent words', () => {
    for (const [id, line] of Object.entries(ALL)) expect(VIOLENT.test(line), `${id}: ${line}`).toBe(false);
  });
  it('never gives Mooladri a face', () => {
    for (const [id, line] of Object.entries(GUARDIAN_LINES)) expect(/\b(face|eyes?|gaze|stares?)\b/i.test(line), id).toBe(false);
  });
  it('covers the three calming steps with a hint and a done line each', () => {
    for (const k of ['roots_hint', 'roots_done', 'air_hint', 'air_done', 'bloom_hint', 'bloom_done', 'calm']) expect(GUARDIAN_LINES[k], k).toBeTruthy();
  });
});

describe('voice respellings (T-023)', () => {
  it('every plant and rock name has one, with spaces and no hyphens', () => {
    for (const n of Object.values(FLORA_NAMES)) {
      expect(n.voice, n.name).toBeTruthy();
      expect(n.voice!.includes('-'), n.name).toBe(false);
    }
  });
});

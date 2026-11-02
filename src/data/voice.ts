// Which recorded line belongs to which SARATHI text (task T-005, Sarvam Bulbul, voice: ishita).
// The recordings live in public/assets/audio/voice/ and are named after the line's id, for example
// goal_ice.mp3. Built from the text itself so a line never has to be listed twice: if a
// line has no recording, the lookup misses and SARATHI simply stays quiet.
import { RESEARCH_LINES, MACHINE_LINES, EVENT_LINES, CREATURE_LINES } from './lines';
import { CHAPTER1_GOALS, SARATHI_EVENTS } from './story';
import { INTRO_LINES, GUARDIAN_LINES, CHAMBER_LINES, LIFTOFF_LINES } from './scenes';
import { STUCK_HINTS, PHONE_STUCK_HINTS } from './chapter1';

/** Lines whose words changed (or are new) and wait for the Commander to record them (T-040):
 *  until then SARATHI shows them as text only, so an old recording never plays with new words. */
export const AWAITING_VOICE = new Set(['goal_wake.mp3', 'goal_ice.mp3', 'goal_huxley_message.mp3', 'goal_translator.mp3', 'goal_memory_logs.mp3']);

/** Groups of lines in the Chapter 1 recording script (T-040) that are not recorded yet. When the
 *  Commander uploads a group's files, the Director removes it from this list and they play. */
export const AWAITING_GROUPS = new Set(['intro', 'guardian', 'chamber', 'liftoff', 'creature', 'stuck']);

/** Every line SARATHI may speak, with the file it is (or will be) recorded as. */
export const VOICE_LINES: { group: string; file: string; text: string }[] = [];
const add = (group: string, key: string, text: string, suffix = '') =>
  VOICE_LINES.push({ group, file: `${group}_${key}${suffix}.mp3`, text: text.trim() });

for (const [k, v] of Object.entries(RESEARCH_LINES)) add('research', k, v);
for (const [k, v] of Object.entries(MACHINE_LINES)) add('machine', k, v);
for (const [k, v] of Object.entries(EVENT_LINES)) add('event', k, v);
for (const [k, v] of Object.entries(SARATHI_EVENTS)) add('events', k, v);
for (const g of CHAPTER1_GOALS) add('goal', g.id, g.sarathi);
// Chapter 1 (T-040): six groups, plus the phone wording of four stuck hints.
for (const [k, v] of Object.entries(INTRO_LINES)) add('intro', k, v);
for (const [k, v] of Object.entries(GUARDIAN_LINES)) add('guardian', k, v);
for (const [k, v] of Object.entries(CHAMBER_LINES)) add('chamber', k, v);
for (const [k, v] of Object.entries(LIFTOFF_LINES)) add('liftoff', k, v);
for (const [k, v] of Object.entries(CREATURE_LINES)) add('creature', k, v);
for (const [k, v] of Object.entries(STUCK_HINTS)) add('stuck', k, v);
for (const [k, v] of Object.entries(PHONE_STUCK_HINTS)) add('stuck', k, v, '_touch');

const map: Record<string, string> = {};
for (const l of VOICE_LINES) if (!AWAITING_VOICE.has(l.file) && !AWAITING_GROUPS.has(l.group) && !(l.text in map)) map[l.text] = l.file;

/** SARATHI's line of text → the name of its recording. */
export const VOICE_FILE: Record<string, string> = map;

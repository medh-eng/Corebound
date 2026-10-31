// Which recorded line belongs to which SARATHI text (task T-005, Sarvam Bulbul, voice: ishita).
// The recordings live in public/assets/audio/voice/ and are named after the line's id, for example
// goal_ice.mp3. Built from the text itself so a line never has to be listed twice: if a
// line has no recording, the lookup misses and SARATHI simply stays quiet.
import { RESEARCH_LINES, MACHINE_LINES, EVENT_LINES } from './lines';
import { CHAPTER1_GOALS, SARATHI_EVENTS } from './story';

const map: Record<string, string> = {};
const add = (prefix: string, key: string, text: string) => { map[text.trim()] = `${prefix}_${key}.mp3`; };

for (const [k, v] of Object.entries(RESEARCH_LINES)) add('research', k, v);
for (const [k, v] of Object.entries(MACHINE_LINES)) add('machine', k, v);
for (const [k, v] of Object.entries(EVENT_LINES)) add('event', k, v);
for (const [k, v] of Object.entries(SARATHI_EVENTS)) add('events', k, v);
for (const g of CHAPTER1_GOALS) add('goal', g.id, g.sarathi);

/** SARATHI's line of text → the name of its recording. */
export const VOICE_FILE: Record<string, string> = map;

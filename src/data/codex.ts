// The Codex: entries the player unlocks by scanning things (M3). Text comes from the writers
// (T-002 science cards, T-018 flora and fauna); these few entries are placeholders until then.

export type CodexKind = 'flora' | 'fauna' | 'mineral' | 'machine' | 'world';

export interface CodexEntry {
  id: string;
  kind: CodexKind;
  title: string;          // English name
  name?: string;          // in-world (Sanskrit) name, if any
  deva?: string;          // Devanagari, set by hand (see T-012 §4)
  text: string;           // 40–100 words
  science?: string;       // one line of real science
}

export const CODEX: CodexEntry[] = [
  { id: 'jivagraha', kind: 'world', title: 'Jivagraha', name: 'Jivagraha', deva: 'जीवग्रह', text: 'A small, living world, 150 metres from surface to core. Forests glow at night, and the soil is younger than it has any right to be.', science: 'Small worlds have weak gravity: here you weigh about a tenth of what you would on Earth.' },
  { id: 'ice_crystal', kind: 'mineral', title: 'Ice crystals', text: 'Blue spires of frozen water that grow from the rock. Split them with electricity and they give you air to breathe.', science: 'Electrolysis: 2H₂O → 2H₂ + O₂.' },
  { id: 'glow_moth', kind: 'fauna', title: 'Glow-moth', name: 'Jyotipatang', deva: 'ज्योतिपतंग', text: 'Soft moths that carry their own light. They gather where the air is clean and vanish where it is not.', science: 'Many Earth insects make light with an enzyme called luciferase.' },
];

export const codexById = (id: string) => CODEX.find((c) => c.id === id);

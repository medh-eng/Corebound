// Names of Guardians, peoples and creatures, chosen 2026-10-27 from Sarvam AI's options
// (team-inbox/writing/T-004-names.md); three corrected after Sarvam's review (T-004-names-review.md). "say" is a pronunciation guide (capitals = stressed).

export interface Name { name: string; deva: string; say: string; meaning: string }

export const GUARDIAN_NAMES: Record<string, Name> = {
  jivagraha: { name: 'Mooladri', deva: 'मूलाद्रि', say: 'MOO-lah-dree', meaning: 'root-mountain' },
  taptashila: { name: 'Shailasarpa', deva: 'शैलसर्प', say: 'SHY-luh-SUR-puh', meaning: 'rock-serpent' },
  marubhumi: { name: 'Balukavela', deva: 'बालुकावेल', say: 'BAA-loo-KAA-vale', meaning: 'sand-tide' },
  himasagara: { name: 'Himavela', deva: 'हिमवेल', say: 'HEE-muh-vale', meaning: 'ice-tide' },
  vayumandala: { name: 'Meghapakshi', deva: 'मेघपक्षी', say: 'MAY-ghuh-PUK-shee', meaning: 'cloud-bird' },
  vishamegha: { name: 'Tantukari', deva: 'तन्तुकारी', say: 'TUN-too-KAA-ree', meaning: 'thread-maker' },
};

export const PEOPLE_NAMES: Record<string, Name> = {
  jivagraha: { name: 'Deepajana', deva: 'दीपजन', say: 'DEE-puh-JUH-nuh', meaning: 'lamp-folk' },
  taptashila: { name: 'Khanik', deva: 'खनिक', say: 'KHUH-nik', meaning: 'miners' },
  marubhumi: { name: 'Maruyatri', deva: 'मरुयात्री', say: 'MUH-roo-YAA-tree', meaning: 'desert travellers' },
  himasagara: { name: 'Jalabandhu', deva: 'जलबन्धु', say: 'JUH-luh-BUN-dhoo', meaning: 'water-friends' },
  vayumandala: { name: 'Patangajana', deva: 'पतंगजन', say: 'puh-TUN-guh-JUH-nuh', meaning: 'kite-folk' },
  vishamegha: { name: 'Shvasajana', deva: 'श्वासजन', say: 'SHVAAS-uh-JUH-nuh', meaning: 'breath-folk' },
};

export const CREATURE_NAMES: Record<string, Name> = {
  glow_moth: { name: 'Jyotishalabha', deva: 'ज्योतिशलभ', say: 'JYOH-tee-SHUH-luh-bhuh', meaning: 'light-moth' },
  rock_crab: { name: 'Golakarka', deva: 'गोलकर्क', say: 'GOH-luh-KUR-kuh', meaning: 'round-crab' },
  mountain_grazer: { name: 'Lavana', deva: 'लवण', say: 'LUH-vun', meaning: 'salt, mineral' },
  szynthar: { name: 'Szynthar', deva: 'सिन्थार', say: 'SIN-thar', meaning: "Medhanshu's own name" },
  savannah_grazer: { name: 'Lambagriva', deva: 'लम्बग्रीव', say: 'LUM-buh-GREE-vuh', meaning: 'long-neck' },
  sand_swimmer: { name: 'Marumina', deva: 'मरुमीन', say: 'MUH-roo-MEEN', meaning: 'desert-fish' },
  light_jellyfish: { name: 'Tarakajala', deva: 'तारकाजल', say: 'TAA-ruh-KAA-jul', meaning: 'star-water' },
  ice_crab: { name: 'Himakarka', deva: 'हिमकर्क', say: 'HEE-muh-KUR-kuh', meaning: 'ice-crab' },
  balloon: { name: 'Meghapota', deva: 'मेघपोट', say: 'MAY-ghuh-POTE', meaning: 'cloud-belly' },
  ribbon_glider: { name: 'Tarangini', deva: 'तरंगिणी', say: 'tuh-RUN-gi-nee', meaning: 'the flowing one' },
  acid_beetle: { name: 'Kathorakita', deva: 'कठोरकीट', say: 'kuh-THOR-uh-KEET', meaning: 'hard-shelled beetle' },
  cloud_ray: { name: 'Neelachhaya', deva: 'नीलछाया', say: 'NEEL-uh-CHHAA-yaa', meaning: 'blue shadow' },
};

/** The Szynthars' own name for the grove-and-grass belt of Marubhumi where their packs were born
 *  (Medhanshu's word, kept as he wrote it). */
export const SZYNTHAR_HOMELAND: Name = { name: 'Padakanan', deva: 'पादकानन', say: 'PAA-duh-KAA-nuh-nun', meaning: 'the grove at the foot (of the dunes)' };

/** Plants, rocks and the bloom of Jivagraha, chosen 2026-10-28 from Sarvam AI's suggested set (team-inbox/writing/T-017-flora-names.md).
 *  The HUD and goals keep the English words ("the bloom"); these names live in the Codex. */
export const FLORA_NAMES: Record<string, Name> = {
  banyan: { name: 'Jyotivata', deva: 'ज्योतिवट', say: 'JYOH-tee-vut', meaning: 'light-banyan' },
  mushroom_tree: { name: 'Deepashirsha', deva: 'दीपशीर्ष', say: 'DEEP-uh-SHEER-shuh', meaning: 'lamp-headed' },
  glow_mushroom: { name: 'Jyotiguccha', deva: 'ज्योतिगुच्छ', say: 'JYOH-tee-GOO-chhuh', meaning: 'light-cluster' },
  fern: { name: 'Deepalata', deva: 'दीपलता', say: 'DEEP-uh-LUH-taa', meaning: 'lamp-creeper' },
  lotus_pad: { name: 'Shantakamala', deva: 'शान्तकमल', say: 'SHAAN-tuh-KUH-mul', meaning: 'calm lotus' },
  ice_crystal: { name: 'Sheetashikhara', deva: 'शीतशिखर', say: 'SHEE-tuh-SHEE-khuh-ruh', meaning: 'cold spire' },
  iron_ore: { name: 'Lohashila', deva: 'लोहशिला', say: 'LOH-huh-SHEE-laa', meaning: 'iron-rock' },
  carbon: { name: 'Kajjala', deva: 'कज्जल', say: 'KUJ-juh-luh', meaning: 'lamp-black, soot' },
  sandstone: { name: 'Dhavala', deva: 'धवल', say: 'DHUH-vuh-luh', meaning: 'white, pale' },
  bloom: { name: 'Sakshi', deva: 'साक्षी', say: 'SAAK-shee', meaning: 'witness' },
};

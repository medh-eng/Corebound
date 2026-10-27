// Names of Guardians, peoples and creatures, chosen 2026-10-27 from Sarvam AI's options
// (team-inbox/writing/T-004-names.md). "say" is a pronunciation guide (capitals = stressed).

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
  taptashila: { name: 'Khanaka', deva: 'खनक', say: 'KHAA-nuk', meaning: 'miners' },
  marubhumi: { name: 'Maruyatri', deva: 'मरुयात्री', say: 'MUH-roo-YAA-tree', meaning: 'desert travellers' },
  himasagara: { name: 'Jalabandhu', deva: 'जलबन्धु', say: 'JUH-luh-BUN-dhoo', meaning: 'water-friends' },
  vayumandala: { name: 'Patangajana', deva: 'पतंगजन', say: 'puh-TUN-guh-JUH-nuh', meaning: 'kite-folk' },
  vishamegha: { name: 'Shvasajana', deva: 'श्वासजन', say: 'SHVAAS-uh-JUH-nuh', meaning: 'breath-folk' },
};

export const CREATURE_NAMES: Record<string, Name> = {
  glow_moth: { name: 'Jyotipatang', deva: 'ज्योतिपतंग', say: 'JYOH-tee-puh-TUNG', meaning: 'light-moth' },
  rock_crab: { name: 'Golakarka', deva: 'गोलकर्क', say: 'GOH-luh-KUR-kuh', meaning: 'round-crab' },
  mountain_grazer: { name: 'Lavana', deva: 'लवण', say: 'LUH-vun', meaning: 'salt, mineral' },
  szynthar: { name: 'Szynthar', deva: 'सिन्थार', say: 'SIN-thar', meaning: "Medhanshu's own name" },
  savannah_grazer: { name: 'Lambagriva', deva: 'लम्बग्रीव', say: 'LUM-buh-GREE-vuh', meaning: 'long-neck' },
  sand_swimmer: { name: 'Marumina', deva: 'मरुमीन', say: 'MUH-roo-MEEN', meaning: 'desert-fish' },
  light_jellyfish: { name: 'Tarakajala', deva: 'तारकाजल', say: 'TAA-ruh-KAA-jul', meaning: 'star-water' },
  ice_crab: { name: 'Himakarka', deva: 'हिमकर्क', say: 'HEE-muh-KUR-kuh', meaning: 'ice-crab' },
  balloon: { name: 'Meghapota', deva: 'मेघपोट', say: 'MAY-ghuh-POTE', meaning: 'cloud-belly' },
  ribbon_glider: { name: 'Tarangini', deva: 'तरंगिणी', say: 'tuh-RUN-gi-nee', meaning: 'the flowing one' },
  acid_beetle: { name: 'Kathinakita', deva: 'कठिनकीट', say: 'kuh-THEE-nuh-KEET', meaning: 'hard-shelled beetle' },
  cloud_ray: { name: 'Neelachhaya', deva: 'नीलछाया', say: 'NEEL-uh-CHHAA-yaa', meaning: 'blue shadow' },
};

/** The Szynthars' own name for the grove-and-grass belt of Marubhumi where their packs were born
 *  (Medhanshu's word, kept as he wrote it). */
export const SZYNTHAR_HOMELAND: Name = { name: 'Padakanan', deva: 'पादकानन', say: 'PAA-duh-KAA-nuh-nun', meaning: 'the grove at the foot (of the dunes)' };

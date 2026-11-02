// Chapter 1 goals and SARATHI's "stuck" hints, in play order (ChatGPT, T-031; reviewed by the Director 2026-11-02).
// Used in M4: the goal panel shows title + hint; after 3 minutes with no progress on the active goal SARATHI says
// the stuck hint (phone wording on touch screens). Existing M1-M2 goals in story.ts stay as the build sub-steps.
// Places such as "main deck" and "front deck" are placeholders until the escape module level is built.

export interface ChapterGoal { id: string; title: string; hint: string }

export const CHAPTER1_MILESTONES: ChapterGoal[] = [
  {
    id: "wake",
    title: "Follow the daylight",
    hint: "Check your oxygen gauge, leave the cryo-pod through the open hatch, and find the shelter beside the solar lotus.",
  },
  {
    id: "oxygen_supply",
    title: "Give the shelter air",
    hint: "Gather ice, iron and silica; craft an electrolyzer, place it near the shelter, and load ice.",
  },
  {
    id: "battery",
    title: "Store daylight for the night",
    hint: "Gather carbon from black rocks, then craft and place a battery so daylight power lasts after sunset.",
  },
  {
    id: "smelter",
    title: "Make your first iron plates",
    hint: "Craft and place a smelter, load iron ore and carbon with E, then collect four iron plates.",
  },
  {
    id: "automation",
    title: "Let the factory carry things",
    hint: "Build a research station, unlock drills and conveyors, then connect a drill to a smelter with a belt.",
  },
  {
    id: "huxley_message",
    title: "Listen to Prof. Huxley",
    hint: "Find the main-deck recording and press E to hear Prof. Huxley explain your next step.",
  },
  {
    id: "translator",
    title: "Find the translator",
    hint: "Follow Prof. Huxley's directions to the front deck and collect the translator.",
  },
  {
    id: "memory_logs",
    title: "Gather the missing memories",
    hint: "Find memory logs as you explore; press E to read them and press J to replay them.",
  },
  {
    id: "rover",
    title: "Build a rover",
    hint: "Unlock the rover, build a vehicle bay, and supply the parts it needs to assemble your vehicle.",
  },
  {
    id: "roots",
    title: "Give the roots room",
    hint: "Use a seismic scan beside the valley, then move every drill clear of the marked roots.",
  },
  {
    id: "clear_smog",
    title: "Let the forest breathe",
    hint: "Research bio-filters, place them near the smog, and keep them supplied with water and power until the haze clears.",
  },
  {
    id: "replant_bloom",
    title: "Help the bloom take root",
    hint: "When the soil is clean, replant bloom spores around Mooladri's exposed roots and let the valley settle.",
  },
  {
    id: "fragment_chamber",
    title: "Follow the unfamiliar light",
    hint: "After Mooladri settles, follow the opened valley path towards the Fragment chamber and scan the unfamiliar signal.",
  },
  {
    id: "launch_pad",
    title: "Build the launch pad",
    hint: "Gather the launch pad's listed parts and place it in a clear area for the starter ship.",
  },
  {
    id: "starter_ship",
    title: "Prepare the starter ship",
    hint: "Supply the launch pad with the listed ship parts, hydrogen and oxygen, then check the cargo.",
  },
  {
    id: "lift_off",
    title: "See Jivagraha from above",
    hint: "Complete the launch checks, clear the pad, and begin the first lift-off towards Taptashila.",
  },
];

export const STUCK_HINTS: Record<string, string> = {
  wake: "Follow the daylight through the open hatch to the shelter beside the solar lotus.",
  oxygen_supply: "Gather blue ice, rust-red iron and silica beneath the grass, then press Tab to craft an electrolyzer.",
  battery: "Place a battery on the shelter's power network before sunset and let spare solar power charge it. Darkness accepts no promises.",
  smelter: "Load the powered smelter with iron ore and carbon, then walk close to collect its finished plates.",
  automation: "Research drills and conveyors at a powered station, then press C, click the drill, then click the smelter.",
  huxley_message: "Look for Prof. Huxley's recording on the main deck and press E to listen.",
  translator: "Search the front deck for the translator Prof. Huxley mentioned.",
  memory_logs: "Read any memory log you find with E, then press J to revisit it in the Codex.",
  rover: "Check the vehicle bay's parts list and supply what is missing to finish the rover. Your boots have earned some assistance.",
  roots: "Use a seismic scan beside the valley, then move every drill away from the marked living roots.",
  clear_smog: "Keep bio-filters near the smog supplied with water and power until the haze clears.",
  replant_bloom: "Replant bloom spores around Mooladri's exposed roots once the soil is clean, then give the new growth time to settle.",
  fragment_chamber: "Follow the path Mooladri has opened and scan the unfamiliar light below the seam when the chamber is safely reachable.",
  launch_pad: "Check the launch pad's parts list, gather what is missing, and choose a clear site for assembly.",
  starter_ship: "Finish the ship's listed parts, supply hydrogen and oxygen, and check its cargo before launch.",
  lift_off: "Complete the launch checks and begin lift-off once the pad is clear. My navigation system is preparing its best effort.",
};

export const PHONE_GOAL_HINTS: Record<string, string> = {
  smelter: "Craft and place a smelter, load iron ore and carbon with Use, then collect four iron plates.",
  huxley_message: "Find the main-deck recording and tap Use to hear Prof. Huxley explain your next step.",
  memory_logs: "Find memory logs as you explore; tap Use to read them and tap Codex to replay them.",
};

export const PHONE_STUCK_HINTS: Record<string, string> = {
  oxygen_supply: "Gather blue ice, rust-red iron and silica beneath the grass, then tap Bag to craft an electrolyzer.",
  automation: "Research drills and conveyors at a powered station, then tap Belt, then Pick on the drill, then Pick on the smelter.",
  huxley_message: "Look for Prof. Huxley's recording on the main deck and tap Use to listen.",
  memory_logs: "Read any memory log you find with Use, then tap Codex to revisit it.",
};


/** Which Chapter 1 milestone each step of the guided goals (story.ts) belongs to. The goal panel
 *  shows the milestone's title above the step, and SARATHI's stuck hint is the milestone's.
 *  Steps not listed (the M3 Harmony steps until slice 3) show no milestone and fall back to the
 *  step's own SARATHI line. */
export const STEP_MILESTONE: Record<string, string> = {
  wake: 'wake',
  ice: 'oxygen_supply', iron: 'oxygen_supply', silica: 'oxygen_supply', craft_elec: 'oxygen_supply',
  place_elec: 'oxygen_supply', load_ice: 'oxygen_supply', breathe: 'oxygen_supply',
  battery: 'battery', night: 'battery',
  smelter: 'smelter',
  research_station: 'automation', research_drill: 'automation', place_drill: 'automation',
  research_belt: 'automation', belt: 'automation', auto_plates: 'automation',
};

/** Seconds without progress on the active goal before SARATHI offers its stuck hint (T-031),
 *  and before she offers it again. */
export const STUCK = { firstAfter: 180, repeatAfter: 360 };

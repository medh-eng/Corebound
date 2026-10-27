// SARATHI's lines for research, first machines and factory events (ChatGPT, T-014; reviewed 2026-10-27).

/** Said when a research node completes. */
export const RESEARCH_LINES: Record<string, string> = {
  auto_drill: "Auto-drill research complete. Build one over rich ground, and let it collect ore while you plan the next step.",
  conveyor: "Conveyors ready. Connect a drill to the machine that needs its output. Your backpack may finally have a quiet afternoon.",
  power_pylon: "Power pylons ready. Link them to your existing network before building machines farther from the shelter.",
  storage_silo: "Storage silos ready. Give your belts somewhere to deliver spare materials. The floor has served admirably, but lacks organisation.",
  coal_burner: "Coal power is available. It works through the night, but the smoke is a cost. Keep improving your solar supply.",
  silicon_furnace: "Silicon furnace ready. Feed it silica and carbon, then use the silicon to research better equipment.",
  backpack_plus: "Four more backpack slots. A remarkable advance in the science of putting things somewhere.",
  drill_plus: "Drill upgrade complete. Your auto-drills work faster now. Check that their belts and storage can keep up.",
  solar_plus: "Solar output improved. Your lotuses make more power in daylight. Keep enough battery storage for the night.",
};

/** Said the first time each kind of machine is placed. */
export const MACHINE_LINES: Record<string, string> = {
  electrolyzer: "Electrolyzer placed. Give it ice and power near the shelter. Water supplies the oxygen; electricity does the separating.",
  battery: "Battery placed. Let spare power charge it before sunset. An empty battery is chiefly an optimistic box.",
  solar_lotus: "Solar lotus placed. Daylight becomes electricity. Pair it with a battery to keep useful work going after sunset.",
  smelter: "Smelter placed. Load iron ore and carbon, and check its power supply. Iron plates come with smoke; plan accordingly.",
  research_station: "Research station placed. Choose a project and load its parts. It will need power while it works.",
  auto_drill: "Auto-drill placed. Check the resource beneath it, then arrange a belt or regular collection for its output.",
  storage_silo: "Storage silo placed. Connect an incoming belt to store materials, and an outgoing belt when another machine needs them.",
  power_pylon: "Pylon placed. Check its connection to a powered network. A tall pole cannot generate electricity through confidence alone.",
  coal_burner: "Coal burner placed. Carbon will keep it running after sunset. Watch the air as carefully as the power meter.",
  silicon_furnace: "Silicon furnace placed. It needs silica, carbon and power. The silicon will help improve your drills, backpack and solar cells.",
};

/** Factory events. */
export const EVENT_LINES: Record<string, string> = {
  first_belt: "First belt connected. Check the receiving machine has room and the right inputs. One moving item is a promising start.",
  drill_full: "The drill has filled its output space. Empty it or connect a belt so it can get back to work.",
  no_power: "This machine is outside your power network. Move it closer, or extend a connected line of pylons to reach it.",
};

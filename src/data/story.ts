// The guided first hour on Jivagraha: goals in order, and what SARATHI says along the way.
export interface StoryGoal { id: string; text: string; sarathi: string }

export const CHAPTER1_GOALS: StoryGoal[] = [
  { id: 'ice', text: 'Mine 3 ice — hold the left mouse button on the blue crystals', sarathi: 'Custodian… can you hear me? Oxygen is low. There is ice in the rocks nearby. Use your laser.' },
  { id: 'iron', text: 'Mine 6 iron ore from the rust-red boulders', sarathi: 'Good. Ice gives us water, and water gives us air. We need iron to build the machine that splits it.' },
  { id: 'silica', text: 'Dig 4 silica — laser the ground; sandstone below gives more', sarathi: 'Sandstone is mostly silica. Dig into the ground below the grass — I will count what you collect.' },
  { id: 'craft_elec', text: 'Open your backpack (Tab) and craft an electrolyzer', sarathi: 'You have everything for an electrolyzer. It splits ice into oxygen and hydrogen.' },
  { id: 'place_elec', text: 'Place the electrolyzer near your shelter (B, then click)', sarathi: 'Set it close to the shelter so its air pipes reach inside.' },
  { id: 'load_ice', text: 'Load it with ice — walk up to it and press E', sarathi: 'The solar lotus will power it while the sun is up.' },
  { id: 'breathe', text: 'Step into your shelter and breathe', sarathi: 'Electrolysis complete. You are breathing. I consider that a good start.' },
  { id: 'battery', text: 'Find carbon (black rocks), craft a battery and place it', sarathi: 'Night is coming. Solar power will fall to zero. I recommend a battery. And perhaps a blanket.' },
  { id: 'night', text: 'Survive your first night on Jivagraha', sarathi: 'The forest is glowing. I have never seen anything like it. Or… I do not remember seeing it.' },
  { id: 'smelter', text: 'Craft a smelter, load it with iron ore and carbon (E), and collect 4 iron plates', sarathi: 'Iron plates mean real machines. Careful — smelting makes smoke, and this world notices.' },
  { id: 'research_station', text: 'Craft a research station and place it near the shelter (B)', sarathi: 'Carrying everything by hand will not scale. A research station can work out machines that do it for us.' },
  { id: 'research_drill', text: 'Research the auto-drill: press E at the station, choose it, load the parts', sarathi: 'Give the station the parts it asks for. It needs power while it thinks.' },
  { id: 'place_drill', text: 'Craft an auto-drill and place it on rich ground — it shows what lies beneath', sarathi: 'The drill mines whatever is under it. Iron veins run in thin stripes; look for rich ground.' },
  { id: 'research_belt', text: 'Research conveyors at the research station', sarathi: 'A drill that nobody empties will fill up and stop. We need belts.' },
  { id: 'belt', text: 'Craft conveyors, press C, click the drill, then click the smelter', sarathi: 'A belt from the drill to the smelter, and the smelter never waits for you again.' },
  { id: 'auto_plates', text: 'Make 5 iron plates from ore that came by belt (keep the smelter fed with carbon)', sarathi: 'Iron plates, made while you were not looking. I believe this is called a factory.' },
  { id: 'done', text: 'Explore, research, automate — and keep your shelter breathing', sarathi: 'Seismic activity below us. Something very large is… waking. We should be ready.' },
];

export const SARATHI_EVENTS = {
  lowOxygen: 'Oxygen below twenty-five percent. Get to the shelter, or breathe a canister with Q.',
  blackout: 'You blacked out. I carried you back to the shelter. Please do not make me do that again.',
  nightFalls: 'The sun is setting. Solar output dropping.',
  sunrise: 'Sunrise. Solar power returning.',
  backpackFull: 'Your backpack is full. Craft something, or we will need machines to carry more.',
  tooClose: 'Not here — I will not let you dig under the shelter.',
  researched: 'Research complete:',
  noPower: 'That machine has no power. Build it within 30 m of the shelter, or carry power out with pylons.',
  drillFull: 'A drill is full and has stopped. Empty it, or give it a belt.',
};

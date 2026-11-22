// The guided first hour on Jivagraha: goals in order, and what SARATHI says along the way.
import { GUARDIAN_LINES } from './scenes';
import { VALLEY_STEPS } from './valley';

export interface StoryGoal { id: string; text: string; sarathi: string }

export const CHAPTER1_GOALS: StoryGoal[] = [
  // M4: you wake in the crashed escape module; the opening's own lines are in scenes.ts (INTRO_LINES).
  { id: 'wake', text: 'Follow the daylight to the shelter beside the solar lotus', sarathi: 'The hatch is responding. Take one breath, then follow the daylight.' },
  { id: 'ice', text: 'Mine 3 ice — hold the left mouse button on the blue crystals', sarathi: 'The shelter is sound, but its tank is empty. There is ice in the rocks nearby. Use your laser.' },
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
  // M4 slice 2: Huxley's message, the translator and the memory logs (milestones in chapter1.ts; polished in T-042).
  { id: 'huxley_message', text: "Return to the escape module; press E at Prof. Huxley's projector by the hatch", sarathi: "Return to the module and listen to Prof. Huxley's recording by the hatch. The factory can manage a short absence." },
  { id: 'translator', text: 'Press E to collect the translator beside the escape module', sarathi: 'Collect the translator beside the escape module, as Prof. Huxley suggested.' },
  { id: 'memory_logs', text: 'Follow the blue beams to find 3 memory logs; press E to read each one', sarathi: 'Follow the blue beams to find three memory logs scattered by the crash and read each one.' },
  { id: 'harmony_look', text: 'Press M to see the whole planet — and how healthy it is', sarathi: 'Our machines make smoke and stir up mud. The planet notices. Look at it from above.' },
  // M4 slice 3: Mooladri (valley.ts, scenes.ts GUARDIAN_LINES). Calmed, never fought.
  { id: 'guardian_find', text: 'Follow the tremor to the forest valley: walk towards the pale-green light', sarathi: GUARDIAN_LINES.first_tremor },
  { id: 'seismic_scan', ...VALLEY_STEPS.seismic_scan },
  { id: 'move_drills', ...VALLEY_STEPS.move_drills },
  { id: 'bio_filters_valley', ...VALLEY_STEPS.bio_filters_valley },
  { id: 'replant_bloom', ...VALLEY_STEPS.replant_bloom },
  { id: 'valley_calm', text: 'Give Mooladri time to settle', sarathi: 'Stay a moment. The roots are loosening.' },
  { id: 'done', text: 'Walk the valley path Mooladri opened, and keep your shelter breathing', sarathi: GUARDIAN_LINES.flora_bonus },
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
  fault: 'Acid rain is getting into the machines. Walk up to any that need attention and press E.',
  bandThriving: 'The forest is thriving. Look — blooms are opening.',
  bandStable: 'The air is getting heavier. The forest is holding on.',
  bandStressed: 'The forest is wilting and the rain is turning sour. Build filters, or slow the smelters.',
  bandCollapse: 'Jivagraha is struggling to breathe. Something deep below is restless.',
  bloomFirst: 'A bloom. It grew because the world is clean. Research can use it.',
};

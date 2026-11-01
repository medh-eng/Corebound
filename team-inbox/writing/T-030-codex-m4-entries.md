# T-030: Codex entries for Chapter 1 objects

## Delivery note

```ts
export const DELIVERY_NOTE = {
  task: 'T-030: Ten Chapter 1 field-note entries, ready for Director review.',
  checks: 'Each text is 67–73 words; fields, existing kinds, names, scene sequence and real-science lines have been checked.',
  doubt: 'Please review the proposed fauna category for Mooladri and the mineral category for the Fragment.',
};
```

## Codex entries

```ts
export const M4_CODEX_ENTRIES = [
  {
    id: "cryo_pod",
    kind: "machine",
    title: "Cryo-pod",
    text:
      "The pod opens before I can remember closing it. " +
      "Its seals, gauges and quiet lights belong to the journey that brought us here, though my memory supplies very little detail. " +
      "I check the suit's oxygen before stepping out. " +
      "Whatever kept me through the voyage cannot replace a working shelter outside. " +
      "I make a note of the pod's condition; familiar equipment may offer useful clues when the rest of the surroundings are unfamiliar.",
    science: "Thermal insulation reduces heat transfer between regions at different temperatures.",
  },
  {
    id: "escape_module",
    kind: "machine",
    title: "Escape module",
    text:
      "The escape module is where this part of the journey begins: a small enclosure with limited reserves and a hatch opening onto Jivagraha. " +
      "Outside, a shelter and a solar lotus offer the beginnings of a more lasting base. " +
      "I check what remains useful before leaving. " +
      "The module brought us to the ground, but keeping a settlement supplied will require more than the equipment that arrived with us.",
    science: "A parachute slows descent by creating aerodynamic drag as it moves through a gas such as air.",
  },
  {
    id: "vehicle_bay",
    kind: "machine",
    title: "Vehicle bay",
    text:
      "The vehicle bay brings the rover's parts together in one place. " +
      "I leave a clear approach rather than fitting it into the last convenient gap between machines. " +
      "A vehicle needs a way out as well as somewhere to be assembled. " +
      "Before making another supply trip, I check the route towards the places I want to explore. " +
      "A tidy workshop is most useful when its finished work can leave it.",
    science: "Suspension systems connect a vehicle's wheels to its frame and help it travel over uneven ground.",
  },
  {
    id: "rover",
    kind: "machine",
    title: "Small rover",
    text:
      "The rover makes a longer journey across Jivagraha feel possible. " +
      "The curved horizon still limits what I can see, so I choose landmarks before setting off. " +
      "A smooth stretch near the shelter is a poor guide to the ground beyond it. " +
      "I leave room around roots and moving creatures, and note the return route. " +
      "Reaching a deposit is only part of exploring; understanding the way home matters too.",
    science: "Lowering a vehicle's centre of gravity generally increases its resistance to tipping over.",
  },
  {
    id: "launch_pad",
    kind: "machine",
    title: "Launch pad",
    text:
      "The launch pad marks the point where the factory's work becomes a journey. " +
      "Parts, fuel and preparation have to come together before the first lift-off. " +
      "I keep the area clear and follow SARATHI's checks rather than treating a ready ship as a reason to hurry. " +
      "From the ground, the next world is still a distant light. " +
      "Soon the small base we have built will be the distant light instead.",
    science: "Rocket engines produce thrust by expelling exhaust, with the vehicle accelerating in the opposite direction.",
  },
  {
    id: "starter_ship",
    kind: "machine",
    title: "Starter ship",
    text:
      "Our first ship is for the next step, not every possible journey at once. " +
      "Before leaving Jivagraha, I check the supplies, secure the cargo and listen to SARATHI's navigation report. " +
      "Taptashila is our next destination, with unfamiliar conditions waiting beyond this familiar sky. " +
      "The shelter below is worth one last look. " +
      "Learning to leave a world should include remembering what we built there and how we left its surroundings.",
    science: "A rocket can produce thrust in a vacuum without pushing against surrounding air.",
  },
  {
    id: "translator",
    kind: "machine",
    title: "Translator",
    text:
      "Huxley's message points towards a translator, a useful admission that our own words may not be enough. " +
      "I want to understand what another speaker means, not merely hear familiar sounds in place of unfamiliar ones. " +
      "A name, a warning and a question can depend on the situation as much as the words. " +
      "I keep my first attempts simple. " +
      "Understanding should leave room for the other person to correct me.",
    science: "Sound waves need a material medium, while radio waves can travel through a vacuum.",
  },
  {
    id: "quantum_fragment",
    kind: "mineral",
    title: "Quantum Fragment",
    text:
      "A light below the surface does not resemble the minerals around it. " +
      "SARATHI's readings suggest a Quantum Fragment, although that name explains very little by itself. " +
      "Roots run along the chamber wall, close to something I do not yet understand. " +
      "I record the signal and the surrounding material before drawing conclusions. " +
      "The useful question is what we can measure next, not how quickly an unfamiliar object can become an explanation.",
    science: "Visible light and radio waves are both forms of electromagnetic radiation.",
  },
  {
    id: "mooladri",
    kind: "fauna",
    title: "Mooladri: Root Guardian",
    text:
      "Mooladri is faceless, with a crown of glowing root tips. " +
      "Its restlessness follows the strain our machines place on the forest. " +
      "Helping begins with a seismic scan and moving drills away from the mapped roots. " +
      "Working bio-filters clear the haze; replanting bloom spores helps the exposed roots recover. " +
      "When Mooladri settles, the valley opens. " +
      "I record the change as a reason to care for the forest, not simply a route to somewhere new.",
    science: "Plant roots take up water and dissolved nutrients and help anchor plants in soil.",
  },
  {
    id: "root_valley",
    kind: "world",
    title: "Root valley",
    text:
      "Living roots close the way into this valley while Mooladri is restless. " +
      "The obstruction is a reminder to look at the ground beneath the factory, not only at its output. " +
      "Moving the drills, clearing the haze and replanting bloom spores allow the forest to settle. " +
      "Once the path opens, I can explore further. " +
      "I still leave space for the roots: an open route does not make the valley an empty building site.",
    science: "Living roots help hold soil in place, while leaf litter protects its surface and slows runoff.",
  },
];
```

## Director notes

```ts
export const DIRECTOR_NOTES = {
  kinds: 'All kinds already exist; fauna is proposed for Mooladri, world for the valley, and mineral for the Fragment without asserting its composition.',
  guardian: 'Mooladri remains faceless, with glowing root tips and no specified body shape, as this task requests.',
  sequence: 'Seismic scan and drill relocation come first, working bio-filters second, and bloom spores after the soil is clean.',
  fuel: 'Starter-ship fuel remains consistent with scenes.ts: hydrogen and oxygen; the entry keeps its checklist general.',
  science: 'The real-world comparisons explain principles; parachutes and suspension do not introduce gameplay systems.',
  integration: 'These entries await review and integration into src/data/codex.ts.',
};
```

## Science sources

```ts
export const SCIENCE_SOURCES = {
  cryo_pod: "https://bsesc.energy.gov/energy-basics/building-envelope-building-science-intro-heat-flow",
  escape_module: "https://www.grc.nasa.gov/www/k-12/VirtualAero/BottleRocket/airplane/rktvrecv",
  vehicle_bay: "https://www.nasa.gov/centers-and-facilities/marshall/anatomy-of-a-rover-the-mechanics-of-a-winning-student-vehicle-design/",
  rover: "https://www.nhtsa.gov/cars/rules/rulings/Rollover/2001Standards/RolloverResistance.pdf",
  launch_pad: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/rocket-thrust/",
  starter_ship: "https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/rocket-thrust/",
  translator: "https://science.nasa.gov/ems/02_anatomy/",
  quantum_fragment: "https://science.nasa.gov/ems/01_intro/",
  mooladri: "https://www.nrcs.usda.gov/conservation-basics/soil/soil-health/soil-health-on-forestland",
  root_valley: "https://www.nrcs.usda.gov/conservation-basics/soil/soil-health/soil-health-on-forestland",
};
```

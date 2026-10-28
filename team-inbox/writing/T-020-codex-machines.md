Delivery note — T-020: Eight Codex entries: four machines and four items, each with 40–100 words of field notes and one science line. IDs and kinds follow the task exactly; the existing bloom entry is not repeated. The mineral category includes manufactured items and gases as requested, rather than as a scientific classification. Descriptions follow the documented game systems without adding recipes, controls or rewards. Real-world processing and life-support details are distinguished from game simplifications. No story reveal. Delivery only: the Director integrates these entries into src/data/codex.ts.

```ts
[
  {
    "id": "research_station",
    "kind": "machine",
    "title": "Research station",
    "text": "The station gives our collected materials a purpose beyond the next machine. I supply the parts and power, then watch a new possibility become available. Outside this simplified research process, a promising sample would be only the beginning: measurements, repeated trials and careful records would follow. I keep a notebook beside the equipment. An unexpected result deserves a second look before it becomes a confident conclusion.",
    "science": "Repeating an experiment helps researchers assess whether a result is consistent under the tested conditions."
  },
  {
    "id": "storage_silo",
    "kind": "machine",
    "title": "Storage silo",
    "text": "The silo holds a reserve between the place where material emerges and the place where it is needed. Watching its contents accumulate makes the rhythm of the factory easier to understand. A growing stock can mean useful preparation, or a later machine waiting for something else. I check the whole route before adding another drill. More material is not always the missing part.",
    "science": "A storage buffer can absorb temporary differences between the rates at which material is supplied and used."
  },
  {
    "id": "power_pylon",
    "kind": "machine",
    "title": "Power pylon",
    "text": "A line of pylons carries the grid towards equipment beyond the shelter. I trace the connections back to the source before expecting a distant machine to work. The poles extend our reach, but they do not supply extra energy. It is easy to admire a tidy cable route and overlook an empty battery. Both the connection and the available supply belong in the same field check.",
    "science": "Electrical conductors have resistance, so carrying current through them converts some electrical energy into heat."
  },
  {
    "id": "conveyor",
    "kind": "machine",
    "title": "Conveyor",
    "text": "Items travel along the belt in a small, steady procession. Connecting an output to the next machine turns repeated carrying into a route I can observe. If the flow stops, I look at both ends: is anything ready to leave, and is there somewhere for it to go? A working factory is a conversation between machines. The belt makes the pauses visible.",
    "science": "A conveyor transports material between locations; it does not change the chemical identity of that material."
  },
  {
    "id": "silicon",
    "kind": "mineral",
    "title": "Silicon",
    "text": "The furnace product has a name remarkably close to the material that went in. I label the samples carefully: silica contains silicon joined to oxygen, while silicon is the element we are trying to obtain. Here it helps improve the solar equipment. Real photovoltaic manufacturing would require further purification and carefully controlled processing. The short factory route leaves a much longer laboratory story inside this modest piece of material.",
    "science": "Silicon is a semiconductor whose electrical properties can be altered by adding controlled amounts of other elements."
  },
  {
    "id": "iron_plate",
    "kind": "mineral",
    "title": "Iron plate",
    "text": "A finished plate is a satisfying change from the rough ore collected nearby. It offers a useful shape for construction, but its neat edges conceal several steps. The smelter has simplified the separation and shaping of metal into a single production route. I record both the plates obtained and the inputs consumed. The finished object is only one part of the material's journey through the factory.",
    "science": "Iron can react with oxygen and water to form rust, a mixture of iron oxides and hydroxides."
  },
  {
    "id": "oxygen",
    "kind": "mineral",
    "title": "Oxygen",
    "text": "At the shelter, the oxygen supply is less visible than the machines that sustain it. I check the electrolyzer's water source and power rather than trusting the quiet dome alone. Oxygen is one part of a suitable breathing environment; pressure, carbon dioxide removal and other conditions matter too. Our shelter controls simplify those jobs. A comfortable pause here is still the result of equipment doing useful work.",
    "science": "Earth's dry atmosphere contains about 21 per cent oxygen by volume."
  },
  {
    "id": "o2_canister",
    "kind": "mineral",
    "title": "O₂ canister",
    "text": "I reserve a place in the backpack for a canister before walking beyond the familiar ground around the shelter. It replenishes the suit's oxygen supply when needed, giving a stored resource a different role from the stationary system at base. The container is a reserve, not a producer. After using one, I check my supplies again before choosing the next stretch of the journey.",
    "science": "A real compressed-oxygen cylinder stores gas under pressure and uses a regulator to control its delivery."
  }
]
```

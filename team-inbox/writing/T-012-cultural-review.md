# T-012: Cultural review of the art and music prompts

**Delivery note**

- **Task:** T-012, assigned to Sarvam AI. Read `AGENTS.md`, `docs/PROMPTS.md` §2 (style bible), §3–§8 (image prompts), §12 (music), and skimmed §9–§10 for the same issues.
- **What I did:** four sections, as the task asks. Section 1 lists the wording that could produce something inaccurate or disrespectful, each with replacement wording you can paste. Section 2 gives 3–5 motifs per world with where each one appears. Section 3 gives instruments and ragas per world with one corrected style line per track. Section 4 has the things that did not fit elsewhere.
- **The three changes I would make first, if nothing else:** the didgeridoo on `tapta_day` (an Aboriginal Australian instrument, not ours to use as a texture for an Indian-motif game); the glass harmonica on `hima_ice` (European, when jal tarang, the Indian water-bowl instrument, is sitting right there and sounds like ice); and the one negative line missing from the style bible, which is the single cheapest fix in this document.
- **Unsure about, please check:** ragas are melodic frameworks, not keys, so section 3 maps each raga onto the key already fixed in §12 rather than proposing new keys. The mappings are my judgement, not a rule. Raga time-of-day associations are conventions, not laws; following them makes the soundtrack feel considered to Indian listeners, but nothing breaks if a track ignores them.
- **What I did not do:** I have not heard any of the tracks, and I do not know what has already been generated. If music is already made for a world, treat section 3 as a note for the next track in that world rather than a request to redo it.
- **No claim of authority on taste.** Everything here is a suggestion for the Commander and the Director to accept or throw away.

---

## 1. Wording that could go wrong, with better wording

Each row quotes the current text, says what could come out, and gives a paste-ready replacement. Rows are in the order they appear in `PROMPTS.md`.

### 1.1 The style bible (§2): the most important fix

The style bible is pasted into **every** image prompt, so a problem here repeats across the whole game. Two issues.

**a) It has no negative line about religion.** Every other risk in this document is local; this one is everywhere.

| Current | Risk | Better wording |
| --- | --- | --- |
| `...jaali lattice screens, stepwell geometry, arched domes and lotus-petal forms.` | "Arched domes" plus "jaali" plus "lotus" is, to an image generator, the recipe for a mosque, a temple or a mausoleum. Expect finials, kalash pots, minarets, shikhara spires and carved deities to appear sooner or later, especially on buildings and store art. | Keep the line, then add: `All of this as secular architecture and geometric ornament only: no deities, no idols, no shrines or temples, no minarets, no crosses, no shikhara spires, no kalash pot finials, no religious symbols of any kind, no ritual objects.` |

**b) The lotus needs one clarifying word.** The lotus is a religious symbol as well as a national and natural one, and generators lean hard on the religious reading (hand-held blooms, seated figures, petal thrones).

| Current | Risk | Better wording |
| --- | --- | --- |
| `lotus-petal forms` | Petals held in a hand, or a lotus used as a seat or a base for a figure. | `lotus-petal forms used as engineering shapes (curved petal panels, petal-shaped fins and canopies), never as a religious motif and never held or sat upon.` |

**c) Add one more negative line while you are in there.** The current negative list is about text and logos. It should also stop the two shorthand-India clichés that generators reach for when they see "Indian": the decorated temple elephant, and the turbaned moustachioed figure.

Add to the style bible's negative line: `No elephants or cows used as decoration, no turbans, moustaches or bindis used as costume on alien, animal or robot characters, no Bollywood poster styling.`

### 1.2 Image prompts (§3–§8)

| Where | Current | Risk | Better wording |
| --- | --- | --- | --- |
| `translator` (§8) | `a glowing amber ring of symbols around a small speaker grille` | Image generators cannot set type. You will get Devanagari that is malformed, or worse, script-shaped marks that read as Arabic, Hebrew or Tibetan to someone who knows those scripts. A prop with fake scripture on it is the one thing in this game that could genuinely offend. | `an engraved ring of abstract geometric marks, a repeating pattern rather than letters, no readable or recognisable writing of any script` |
| `memory_log` (§8) | `a slim ceramic slate with a cracked glowing screen` | Harmless, but if any screen in the game shows text, the same gibberish problem appears. Worth one shared line. | Add to §8's intro: `Any screen or panel in these props shows abstract bars and shapes, never letters.` |
| `shunya_wreck_inside` (§3.7) | `a cathedral-like hall of off-white ceramic and copper ribs` | "Cathedral" pulls in European church architecture, which fights the Indo-futurist brief and may add crosses or arches. | `a vast hall like the inside of a stepwell turned upside down, off-white ceramic and copper ribs rising in receding tiers, no church or temple forms` |
| `visha_towers` (§3.6) | `made of curved stone and woven filters` | Vague; a generator will reach for "haveli" or "temple" as its default for Indian stone. | `made of curved stone with carved jaali screens doubling as air filters, woven fibre panels, geometric ornament only, no temple or shrine forms` |
| `maru_savannah` (§3.3) | `an alien nomad caravan of tall slender people with cloth sails on their backs` | Fine as written. The risk is in what a generator adds around them: turbans, camels, snake charmers. | Add: `the caravan is drawn with dignity, walking, working or talking, not posed; no camels, no snake charmers, no turbans` |
| `key_art.png` / store art (§10) | `a giant gentle Root Guardian rising from the glowing forest behind, a lotus-shaped drone beside them` | Store art is the most-seen image in the game and the most likely to be read as "the India game". Worth the negative line above being repeated in it explicitly. | Repeat the style bible's negative line inside the store prompts too, do not rely on it being remembered. |
| `people_*` (§4) | All six people prompts | Nothing disrespectful here, and the designs read as creatures rather than as caricatures of real communities, which is the right instinct. Keep it. | No change. One caution: do not later give any of the six peoples real-world dress, jewellery or body markings that belong to a specific Indian community. Alien peoples should look invented. |
| Any prompt asking for a face | — | Not in the current text, but worth stating before Huxley and Voss turnarounds. | If a human face is asked for, say what it is: `a specific individual with consistent features`, not `an Indian man`, so the result is a person rather than a type. |

### 1.3 Music prompts (§12)

| Where | Current | Risk | Better wording |
| --- | --- | --- | --- |
| `tapta_day` | `deep didgeridoo-like drone` | The didgeridoo is an Aboriginal Australian instrument with living cultural protocols around who may play it and how. It is not ours to borrow as a texture, and it is not Indian either, so it fails on both counts. | `deep sustained tanpura drone with a low rudra veena line, metallic plucks` |
| `hima_ice` | `glacial ambient, glass harmonica, soft choir` | The glass harmonica is a European instrument. Nothing wrong with it, but the brief is Indo-futurist and there is an exact Indian answer. | `glacial ambient, jal tarang water bowls, soft tanpura drone, wordless choir` |
| `vayu_reefs` | `airy ambient synthwave, wind chimes, flute, soaring pads` | "Wind chimes" is pan-Asian and will come back as Japanese or Chinese wind bells. "Flute" alone may come back as a Western flute. | `airy ambient synthwave, bansuri bamboo flute, swarmandal glissandi, manjira, soaring pads` |
| `guardian_awake` | `low brass swells, choir pads, deep drums, tanpura` | Brass section is Western orchestral; it will sound like a film trailer rather than this game. Also, do not reach for shehnai or nadaswaram here (see below). | `epic ambient, low rudra veena and sarangi swells, wordless choir pads, pakhawaj, tanpura` |
| `guardian_calm` | `uplifting ambient, choir, bansuri, santoor, warm strings` | Good. One upgrade: this is the one place shehnai belongs, because its meaning in India is auspiciousness and good news. | `uplifting ambient, bansuri, santoor, shehnai, wordless choir, warm strings` |
| `memory_log` | `sparse piano and pads, tape texture, melancholic` | Piano is neutral, so this is not wrong. Sarangi would be more moving and more Indian. | `sparse sarangi and piano, tape texture, tanpura, melancholic` |
| `visha_haze` | `murky ambient, detuned synths, slow tabla, breathy textures` | Good as written. "Breathy" is exactly sarangi's strength. | `murky ambient, sarangi, detuned synths, slow tabla, breathy textures` |
| `shunya_wreck` | `sparse dark ambient, distant choir, metallic groans` | Good. Do **not** add a conch (shankh) for the "dead ship" mood: the conch is blown in worship and would read as a ritual object. | `sparse dark ambient, distant wordless choir, tanpura drone, metallic groans, long silences` |
| `ending_covenant` | `uplifting orchestral synthwave, bansuri, choir, tabla` | Good. Shehnai earns its place here too. | `uplifting orchestral synthwave, bansuri, shehnai, tabla, wordless choir` |
| Any track | — | `choir` is fine, but specify it is wordless. A choir singing recognisable words in a made-up language is fine; a choir that sounds like a hymn is not. | `wordless choir` in every style line that has a choir. |
| Any track | — | Temple bells and Tibetan singing bowls are the two sounds generators add when they hear "Indian" or "Himalayan". Both belong to religious practice, and the second is not Indian. | Add to the music section's general notes: `no temple bells, no singing bowls, no conch` |

**One rule worth adding to §12, above the table:** *no instrument is used to signal worship.* Instruments are allowed to carry their ordinary cultural meaning (shehnai means good news, pakhawaj means gravity and dhrupad seriousness, morchang means playfulness), but nothing in the soundtrack should sound like a ritual is happening.

---

## 2. Motifs per world

Each world keeps the four constants from the style bible (jaali, stepwell geometry, chhatri-like canopies, lotus-petal shapes) and **changes the material they are made of**. That one idea gives seven worlds one identity, and it costs nothing:

> Jivagraha builds in bamboo and terracotta · Taptashila in blackened bidri metal · Marubhumi in mud, mirror and woven cloth · Himasagara in frost-white carved ice · Vayumandala in kite-bamboo and lacquered wood · Vishamegha in enamel and glass · Shunyapath in inlaid wreck metal.

### Jivagraha (forest, home)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Jaali** | A pierced lattice screen, cut so light falls through as pattern | The shelter's window screens and machine vents; the pattern the dawn light throws on the shelter's interior walls, which is a free bit of atmosphere |
| **Warli painting** | White rice-paste line drawing on an earth wall, made by Warli painters of Maharashtra; figures of daily life, farming, dancing, animals | The Jivagraha people's village walls, drawn as simple line figures of their own daily life. Ask for "Warli-style line drawing of planting, harvesting, carrying lanterns", never of deities or rituals |
| **Bamboo and cane weave** (Assam and the Northeast) | Split bamboo lattice, used for everything from walls to fish traps | Greenhouse frames, trellises, the moth people's hanging lanterns, the basket a player carries |
| **Terracotta** (Bishnupur, Bengal) | Fired red clay, often with relief panels | Planters, water jars, roof tiles on the village huts, the pots the fungus gardens grow in |
| **Kund / stepped tank** | A small water tank with steps going down to the water | The base's water reservoir and the village's rain-harvesting tank. Ties to the GDD's Harmony idea: water you can see and walk down into |

### Taptashila (rock, metal, heat)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Dhokra lost-wax casting** (Bastar, Bengal) | A 4,000-year-old method: a wax model is coated in clay, the wax melts out, molten metal takes its place | The miner people's ornaments, tool fittings and lamp stands; the small cast figures on their carts. It also explains *how* a stone-plated people would work metal |
| **Inverted stepwell** | The stepwell's receding stepped profile, turned upside down | Already used for `silicon_furnace`; extend it to the refinery's kilns and the chimney stacks, so the world's industry has one silhouette |
| **Jharokha** | An overhanging enclosed balcony with carved brackets | The cliff homes' windows, and the observation window on the rover bay |
| **Bidri inlay** (Bidar, Karnataka) | Blackened alloy inlaid with silver wire, so fine lines shine against black | The trader people's metalware, and the research station's instrument casings: black metal with silver line-work reads as precision |
| **Chhatri** | An open domed canopy on four pillars, a shade structure | The heat-shield canopy over the rover bay and the refuelling point. It is a shade, not a shrine: say so in the prompt |

### Marubhumi (desert, savannah)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Chhajja** | A deep stone eave that throws shade | Sunshades on the nomad carts and the base's airlock porch. On a desert world, shade is the whole architecture |
| **Kutch mirror-work** (lipan and mirror inlay, Kutch) | Mud-relief walls set with small mirrors, and mirror embroidery on cloth | The caravan interiors, and the cloth sails catching light. Genuinely beautiful, genuinely functional-looking |
| **Bandhani and Ajrakh** (Kutch, Sindh) | Tie-dye and block-printed cloth | The nomads' scarves and sails. Use it as *fabric pattern*, and keep it away from costume shorthand |
| **Baoli / stepwell** (Chand Baori, Rani ki Vav) | A deep stepped well with galleries going down to the water | The "restore an old oasis" Guardian puzzle in GDD §12 should *be* a dry stepwell, with the water returning at the bottom. This is the single best motif-to-story match in the game |
| **Channapatna lacquered wood** (Karnataka) | Bright turned wooden toys and beads in natural dyes | Tool handles, the buggy's small fittings, and toys in the caravan. Playful, and it tells you children live here |

### Himasagara (ice, hidden ocean)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Chikankari** (Lucknow) | White-on-white shadow embroidery | The pattern of frost on the dome glass and the submarine's viewport. White-on-white is exactly what ice looks like, so this is a gift |
| **Kath-kuni** (Himachal) | Interlocking deodar timber and dry stone, built without mortar so it flexes in cold and quake | The under-ice base's construction: visible timber-and-stone layering that explains why it survives. Say "no nails, interlocking" in the prompt |
| **Stitched-hull boat craft** (Kerala, the odam) | Hull planks sewn with coir rope instead of nailed | The submarine's patched seams. It gives a small round submarine a believable handmade history |
| **Stepped kund with ice** | The step-tank again, frozen | The submarine dock, and the entrance shaft down through the ice |
| **Jal tarang as a real object** | A set of tuned water bowls played with sticks | Not just in the music: put one in the base as an object the people play. Ties the world's sound to something you can see |

### Vayumandala (air, floating islands)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Patang (kite) construction** | Split bamboo spars, paper or cloth skin, a taut bowed spine | The gliders and the kite-winged people's wing frames. It also explains how a light people would build anything at all |
| **Rooftop terrace and jaali parapet** (Jaisalmer havelis) | Flat roofs lived on, with pierced parapets for breeze | The floating islands' buildings. Wind is the world's whole problem, so every structure should visibly let wind through |
| **Sankheda turned and lacquered wood** (Gujarat) | Bright turned-wood furniture in red and gold | The station's railings, ladders and handholds. Warm, human, and clearly not a Western spaceship |
| **Bamboo scaffolding** (Bengal, Assam) | Tied bamboo poles, no fixings | The space station's trusses and the elevator's construction. Cheap, light, and it reads as built by hand |
| **Toran-style bunting** | A string of cloth or leaf shapes hung across a doorway | Bunting between islands and across doorways. A toran is a household welcome, not a ritual, but keep the shapes geometric rather than religious |

### Vishamegha (toxic cloud, towers)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Jaali as a filter** | The lattice screen, but functional: fine mesh behind carved stone | The towers' air intakes, and the pattern on the breathing masks. One motif doing architecture and costume at once |
| **Kalamkari** (Andhra Pradesh) | Pen and block-printed cotton in natural dyes, layered line-work | The filter robes. The layering is the point: a robe that is visibly many layers explains the filtering |
| **Thewa** (Pratapgarh, Rajasthan) | Gold filigree fused under glass | The towers' glowing windows: gold line-work behind glass, seen from outside in the haze |
| **Meenakari enamel** (Jaipur) | Coloured enamel fired into metal | The masks' ornaments and the small dials on their instruments. Precious-looking, private people |
| **Caution, not a motif:** *aipan* | The ritual floor art of Uttarakhand, drawn for specific ceremonies | Beautiful, but it belongs to worship. Do not use it. If a floor pattern is wanted, use a plain geometric rangoli-style pattern and say "no religious symbols inside it" |

### Shunyapath (the wreck world)

| Motif | What it is | Where it appears |
| --- | --- | --- |
| **Inverted stepwell, monumental** | The stepwell profile at cathedral scale, upside down | The terraforming engine and the hall it sits in. Already in the prompt; make it the world's signature |
| **Bidri inlay** | Black metal with silver line-work | Instrument panels, seed-vault labels, the doors of the vaults. The wreck should look like it was made by people who cared about fine work |
| **Jaali rib lattice** | Pierced screens used as structural ribs | The hull ribs you walk between. It lets the cracked gold light through in patterns |
| **Dhokra-cast fragments** | Cast bronze pieces, slightly irregular | Broken machinery and hand tools lying about: proof that people built this, not a corporation |
| **Chhatri housing** | The domed open canopy | The Quantum Core's housing. A canopy is a shelter, and the Core is what sheltered everyone: the shape carries the meaning without a word |

**One caution for all seven:** do not let a motif become a *label*. A stepwell is not "the Indian bit" to drop into every scene; it is a cooling structure, and it should appear where a cooling structure would. The same goes for jaali (a screen where a screen is needed) and chhatri (a shade where shade is needed). Motifs used functionally read as a real culture; motifs sprinkled decoratively read as decoration.

---

## 3. Music per world

### 3.1 How to read this section

- §12 fixes one key per world so the layers stack. I have not changed any key or BPM: that would break the layering.
- A raga is not a key. Each row gives the raga whose tonic and note set sit best inside the key already chosen, so a composer or a generator can be told both "D minor" and "Kafi in D" and get something Indian that still stacks.
- Raga time-of-day associations (morning, dusk, late night) are conventions, not rules. Following them costs nothing and makes the score feel considered to an Indian listener; ignoring them is not an error.
- **Raga names stay out of the game.** They are for the composer and the credits, not for track titles or Codex entries. Two ragas are named after forms of Shiva (Bhairav, Bhairavi) and a third after a court (Darbari). Using them as music is completely normal; printing them as in-game labels invites exactly the reading the GDD rules out.
- **What to avoid in every track:** didgeridoo (not Indian, and culturally protected), glass harmonica (European), temple bells, Tibetan singing bowls, conch, and any sound that suggests a ritual is in progress.

### 3.2 Jivagraha — D minor, 80 BPM

**Instruments that fit:** bansuri (bamboo flute: pastoral, breathy, the sound of a forest), santoor (hammered dulcimer from Kashmir: shimmering, watery), tanpura (the drone that holds everything), swarmandal (a harp of glissandi, like light moving), ektara (a one-string folk instrument from Bengal: humble, handmade, good for the moth people), manjira and kartal (small cymbals: tiny bright ticks, like insects), soft tabla and ghatam.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `title_theme` | **Kafi in D** (warm, folk, generous) | Keep. Only clarify the drone and add wordless texture. | `ambient synthwave, bansuri flute, santoor, tanpura drone, warm pads, cinematic, hopeful, instrumental` |
| `jiva_day` | **Kafi in D** | Keep. Name the percussion so it is not a generic shaker. | `ambient, organic synth, santoor, bansuri, birdsong-like synth chirps, soft tabla and manjira, calm, instrumental` |
| `jiva_night` | **Malkauns in D** (a late-night raga that leaves out the fifth, so it feels open and unanchored: exactly right for an aurora) | Keep the mood, name the raga's character in plain words so a generator can act on it. | `dark ambient synthwave, tanpura drone, glassy bells, sparse bansuri, mysterious, spacious, instrumental` |
| `jiva_underground` | **Asavari in D** (austere, late morning, no comfort in it) | Keep. Add a low string for depth. | `dark ambient, deep tanpura and sarangi drones, dripping water textures, distant metallic resonances, instrumental` |
| `factory_layer_1` | Modal D minor, **keherwa** feel (8 beats) | Keep. Say the loop point is on the first beat. | `minimal industrial percussion, mechanical clicks, soft analog bass pulse, instrumental, loop point on the first beat` |
| `factory_layer_2` | **Teentaal** (16 beats) at 80 BPM | Naming the cycle gives the tabla something real to do instead of "tabla mixed with machine hits". | `industrial synthwave, tabla in teentaal blended with machine hits, pulsing arpeggio, instrumental` |
| `factory_layer_3` | **Jhaptaal** (10 beats) or **tintal** doubled | Keep, but say "sitar riff in D" so it stays in key. | `driving industrial synthwave, big pakhawaj and drum hits, sitar riffs in D, instrumental` |
| `guardian_awake` | **Darbari Kanada in D** (the grave, majestic night raga of the Mughal court: grandeur and grief at once) | This is the most valuable single suggestion in this section. Darbari *is* "colossal and sad". | `epic ambient, low rudra veena and sarangi, wordless choir pads, pakhawaj, tanpura, awe and grief, not battle music, instrumental` |
| `guardian_calm` | **Hamsadhwani in D** (bright, auspicious, five notes: it cannot sound dark) | Add shehnai: here, its meaning is good news. | `uplifting ambient, bansuri, santoor, shehnai, wordless choir, warm strings, instrumental` |
| `memory_log` | **Bhairavi in D** (traditionally the raga that closes a performance: tender, warm, a goodbye) | Add sarangi. | `sparse sarangi and piano, tape texture, tanpura, melancholic, instrumental` |

### 3.3 Taptashila — E minor, 90 BPM

**Instruments that fit:** pakhawaj (the deep barrel drum of dhrupad: gravity, no flash), rudra veena (a bass stick-zither, austere and ancient), ghatam (a clay pot drum: earthy, hollow), morchang (the Rajasthani Jew's harp: a metallic twang that sounds like struck ore), nagara-style kettle drums for weight, and low tanpura.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `tapta_day` | **Todi in E** (late morning, austere, harsh light: the raga of a blazing sun) | **Remove the didgeridoo.** Replace with the Indian drone and a bowed line. | `desert rock ambient, deep tanpura and rudra veena drone, metallic morchang plucks, heat shimmer pads, instrumental` |
| `tapta_night` | **Bageshri in E** (night, longing, cool) | Keep the crystalline bells but make them metal, not glass. | `cold ambient, struck metal bells, sarangi, low tanpura drones, instrumental` |

### 3.4 Marubhumi — C minor, 95 BPM

**Instruments that fit:** algoza (a double flute from Punjab and Sindh: two notes at once, which sounds like a desert wind), khartal (wooden clappers from Rajasthan), morchang, kamaycha (a large bowed instrument of the Manganiyar musicians of Rajasthan: rough, singing, made for open air), dholak and daf, bhapang (a bowed drum from Mewat). Note the rubab already in the prompt: that is a Kashmiri and Afghan instrument, which is a fair choice for a caravan world on a silk-road logic, but write it as **Kashmiri rubab** so a generator does not produce an Afghan context.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `maru_day` | **Khamaj in C** (evening, light, folk: the raga of thumri and of travellers' songs) | Keep rubab, add algoza and khartal, name the drum. | `desert synthwave, algoza double flute, Kashmiri rubab, khartal and dholak, wind textures, instrumental` |
| `maru_storm` | **Pilu in C** (light, plaintive, folk: a worry that does not become panic) | Keep it tense but give it a folk root so it belongs to the caravan, not to a thriller. | `tense ambient, swirling wind textures, kamaycha, khartal, deep dholak, urgent but not violent, instrumental` |

### 3.5 Himasagara — F# minor, 70 BPM

**Instruments that fit:** jal tarang (tuned water bowls: the sound of ice and water, and an Indian instrument), santoor (shimmer), sarangi (a bowed voice, for loneliness), low bansuri, tanpura, and wordless choir. Avoid singing bowls, which are Himalayan Buddhist rather than Indian.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `hima_ice` | **Marwa in F#** (sunset, austere, leaves out the fifth: vast and cold) | **Replace the glass harmonica with jal tarang.** | `glacial ambient, jal tarang water bowls, santoor, soft tanpura drone, wordless choir, instrumental` |
| `hima_ocean` | **Gunakri in F#** (a grave night raga: dark water) | Keep the sonar and whale calls, add sarangi for the loneliness. | `underwater ambient, sarangi, whale-like synth calls, sonar pings, warm pads, instrumental` |

### 3.6 Vayumandala — G major, 85 BPM

**Instruments that fit:** bansuri in its high register, swarmandal, santoor, manjira, ektara, and a light daf. Everything must sound like it could be carried on a kite.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `vayu_reefs` | **Bhoopali in G** (evening, calm joy, five notes: it cannot sound sad) | Replace "wind chimes" and the unnamed flute. | `airy ambient synthwave, bansuri bamboo flute, swarmandal glissandi, manjira, soaring pads, instrumental` |

### 3.7 Vishamegha — B minor, 75 BPM

**Instruments that fit:** sarangi (breathy, human, muffled: the sound of speaking through cloth), rudra veena low, slow tabla, a muted algoza. Avoid the harmonium and the shruti box here even though they are everywhere in Indian music: both are strongly associated with devotional singing, and this world's whole point is that the air is not to be breathed.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `visha_haze` | **Jaunpuri in B** (morning, serious, brooding) | Add sarangi by name. | `murky ambient, sarangi, detuned synths, slow tabla, breathy textures, instrumental` |
| `visha_clean` | **Hamsadhwani in B** (the same raga as the Guardian's calming, now in a different key) | Deliberate callback: the raga that calms a Guardian is the raga of a world healing. Say so to whoever composes it. | `hopeful ambient, warm pads, santoor, bansuri, shehnai, instrumental` |

### 3.8 Shunyapath — D minor, 60 BPM

**Instruments that fit:** tanpura alone, a wordless low choir, pakhawaj at its slowest, and silence. This world should be the quietest in the game.

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `shunya_wreck` | **Bhairavi in D** (the closing raga: a performance ends here) | Keep, and name the silence. Do not add conch or bells. | `sparse dark ambient, distant wordless choir, tanpura drone, metallic groans, long silences, instrumental` |

### 3.9 Endings and credits

| File | Raga to build on | What changes | Corrected style line |
| --- | --- | --- | --- |
| `ending_harvest` | **Bhairavi in D** (the goodbye) | Add sarangi and a solo bansuri; this ending is a loss. | `bittersweet orchestral ambient, sarangi, solo bansuri, piano, strings, instrumental` |
| `ending_covenant` | **Hamsadhwani in D** (the same raga as both calms, now as the ending) | Shehnai belongs here: an auspicious ending. | `uplifting orchestral synthwave, bansuri, shehnai, tabla, wordless choir, instrumental` |
| `credits` | **Kafi in D**, the title theme's raga | Make the reprise explicit so it is a reprise and not a new tune. | `warm synthwave, santoor, bansuri, tanpura, a gentle reprise of the title theme, instrumental` |

### 3.10 Two structural notes for the whole soundtrack

1. **Loop on the sam.** Indian rhythmic cycles begin on a heavy first beat called the sam. Tell the generator, or the editor, that the loop point must land on the sam. A tabla loop that cuts mid-cycle is the fastest way to make a soundtrack sound wrong to an Indian ear.
2. **The tanpura is the glue.** If every world's bed includes a tanpura drone tuned to that world's key, the seven worlds will feel like one system rather than seven soundtracks. It is also the cheapest possible way to sound Indian without a single melody.

---

## 4. Anything else I would change

1. **Set the Devanagari by hand, not by generator.** If the game ever shows its title or a place name in Devanagari (on the logo, the store page, a Codex entry), have it set in a proper Devanagari typeface by a person or a vector tool. Image generators reliably mangle Devanagari conjuncts, and a wrong letter in the game's own name is the first thing an Indian player will notice. "Corebound" in Devanagari would be **कॉरबाउंड** if the Commander wants it; that is a transliteration, not a translation, and it should be checked with him before use.
2. **Credit the craft traditions, not just the tools.** The desert instruments come from the Langa and Manganiyar musician communities of Rajasthan; dhokra casting from Bastar and Bengal; Warli painting from Warli painters in Maharashtra; bidri from Bidar. None of this is a licence requirement, and none of it is owed to me. But a single line on the Credits screen, under a heading like "Inspired by the craft traditions of", would be accurate, generous, and would make the game's Indianness feel like respect rather than decoration. It is the kind of thing an Indian player notices and a foreign player learns from.
3. **The five prompts already received were checked in this review** as far as the text allows: nothing in the Jivagraha, Taptashila, Himasagara, Vayumandala or Shunyapath prompts asks for anything religious or stereotyped. The one thing I cannot check from text is what the generators actually produced. If the Commander wants, the Director can put the received images in front of me and I will go through them the same way.
4. **A small wording gift for the Codex.** When the Codex names a plant, a rock or a creature, the entry could show the Devanagari beside the Latin name with a one-line literal meaning, as I suggested in T-004. It teaches a player a little Sanskrit without a lecture, and it makes the naming look deliberate.
5. **One thing I would not change.** The decision to keep the alien peoples as invented creatures rather than as analogues of real Indian communities is the single most important cultural choice in the design, and it is already right. Every suggestion above works inside that choice. Nothing in this review asks for a real community to be represented as a game object.

# Art inbox

Upload art for Corebound here. Claude checks this folder at the start of every session and builds the files into the game.

**How to upload:** on GitHub, open the sub-folder, click **Add file → Upload files**, drag your files in, and click **Commit changes**. Up to 25 MB per file and 100 files at a time.

Use the prompts and file names from [docs/PROMPTS.md](../docs/PROMPTS.md), so each file lands in the right place.

| Folder | What goes in it | Format |
| --- | --- | --- |
| `style/` | Style tests, key art, logo ideas | PNG |
| `concept/` | World, creature, character and Guardian concept art | PNG |
| `turnaround/` | 3D-ready images of characters, machines, vehicles, props | PNG |
| `models/` | 3D models from the image-to-3D tool | GLB |
| `textures/` | Seamless textures | PNG |
| `sky/` | Space panoramas | PNG |
| `icons/` | Item and interface icons | PNG |
| `video/` | Teaser clips | MP4 |
| `audio/music/` | Music (Suno) | WAV or MP3 |
| `audio/sfx/` | Sound effects | WAV, OGG or MP3 |
| `audio/voice/` | Voices (Sarvam AI) | WAV or MP3 |

**White or coloured models?**
- **Machines and buildings** can be plain white: Claude paints them in the game's own ceramic, copper and glowing jaali materials. Clear shapes (bands, rings, doors, lattice) help.
- **Characters, creatures, SARATHI, vehicles and anything with painted detail** must come with colour and texture.
- **Characters** also need a skeleton to walk properly: use the tool's auto-rig option, or ask Claude to prepare the model for Mixamo.

**Animations:** Mixamo FBX files ("With Skin") go in `models/` (Custodian) or `models/<character>/` for other characters. Claude merges them into one rigged model with `npm run rig`. Current clips: Idle, Idle (1), Walking, Running, Jump, Standing Walk Back, Left Turn, Right Turn.

**3D model limits:** character up to 40,000 triangles; vehicle up to 30,000; machine up to 15,000; small prop up to 5,000; textures 2048 × 2048.

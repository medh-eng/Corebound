# Moving Corebound to Unity: the Director's advice and plan

*Written by the Director on 22 November 2026, after M4 slice 3 (Mooladri). Waits for the Commander's decision.*

## 1. Short answer

**Yes, move to Unity, but do it as a clean port at a clean break, not bit by bit.** The best break is **now, after slice 3**:

1. **Freeze the web game at slice 3.** It is a complete first 45 minutes: waking up, survival, factory, Huxley, logs, and Mooladri. It stays live on GitHub Pages as the playable prototype.
2. **Run the hook test on the web build first** (five first-time players, first 30 minutes; M4-PLAN slice 6). It costs nothing and tells us what to fix *before* we rebuild it.
3. **Build Corebound in Unity from the web game as the specification.** Slices 4–6 (rover, Fragment chamber, launch pad, lift-off) are built **only in Unity**, so nothing is built twice.

## 2. What Unity gives us, and what it costs

**Gains**
- **Better visuals:** URP (Unity's Universal Render Pipeline) lighting, shadows, fog and post-processing; Shader Graph for glowing plants, water and Mooladri; VFX Graph for smoke, spores and the lift-off; GPU-instanced grass and forests.
- **Better feel:** Mixamo clips drop straight into Unity's Animator (blending, no more custom rig tool); Cinemachine and Timeline for the wake-up shot, Mooladri rising and the lift-off.
- **Real phone apps:** a native Android build (APK/Play Store) runs much faster than a browser tab. Windows build for Steam.
- **Easier editing:** you can open the scene, move things and see them, instead of only describing them.
- **AI tooling:** Unity's official Plugin for Claude Code (September 2026) installs Unity's skills, the Unity CLI and an MCP server that lets Claude control the open Unity Editor.
- **Cost:** Unity Personal is free under US$200,000 a year in revenue and funding, and the "Made with Unity" splash screen is optional in Unity 6.

**Costs and risks (please read)**
- **It is a rewrite.** About 9,000 lines of TypeScript and 240 tests become C#. The two hardest parts are the **round planet** (walking, gravity and building on a sphere) and **digging** (the voxel ground). Rough size: **4 to 6 weeks of sessions to reach what the web game does today**, then slices 4–6.
- **The instant link goes away for a while.** Unity can build for the web (Unity 6 supports Android and iOS browsers), but downloads are much bigger. The web prototype stays live meanwhile.
- **How I work changes.** My cloud sessions cannot run the Unity Editor (no screen, no graphics card). To play-test, take screenshots and build, I need to run **inside Claude Code on your PC**, with Unity open. Cloud sessions can still write code and test the game's rules (see step 3).
- **Repository size.** Unity projects need Git LFS for models, textures and audio.
- **Unity AI / MCP terms.** Unity's May 2026 notes said its MCP server needed a Unity AI trial or subscription. Check what the plugin asks for when you install it; if it needs payment, there are free community MCP servers, and Claude can also work from the Unity CLI and the console log.

*Also considered:* Godot (free, open source, and I could run and test it fully in the cloud). Unity wins on visuals, tools, the official Claude plugin and your earlier Unity work, so Unity is the recommendation.

## 3. Step by step

### Step 0. Decide (Commander, 10 minutes)
- Say **yes or no** to: "freeze the web game at slice 3, run the hook test, port to Unity, build slices 4–6 only in Unity".

### Step 1. Set up your PC (Commander, about 1 hour, I guide you)
1. Install **Unity Hub**, then the **newest Unity 6 LTS** it offers, with **Android Build Support** (OpenJDK, SDK and NDK ticked) and **Windows Build Support**.
2. Install **Git** and **Git LFS**; sign in to GitHub.
3. Install **Claude Code** (terminal or the Claude desktop app), then add the **official Unity plugin** from the Claude plugins directory.
4. Create a new GitHub repository **`medh-eng/Corebound-Unity`** (keep `medh-eng/Corebound` as the prototype and specification).
5. Open Claude Code in that folder and say: *"Director: start the Unity port, read docs/UNITY-PLAN.md in medh-eng/Corebound."*

### Step 2. Foundations (Director, first sessions)
- New **URP** project, Git LFS rules, folder layout that mirrors the web game: `Data`, `Core`, `Systems`, `Render`, `UI`, `Audio`, `Art`.
- **Data bridge:** a script in the web repo exports everything in `src/data/` (machines, recipes, goals, SARATHI lines, Codex, logs, names, translations, valley numbers) to JSON; Unity imports it into ScriptableObjects. All the workers' writing and Sarvam's translations come across unchanged.
- **Art bridge:** every processed model in `public/assets/` imports with **glTFast** (Unity's glTF package); `art-inbox/` stays the place you upload to.

### Step 3. The game's rules in plain C#, tested without Unity (Director, cloud or PC)
- Port `src/core` and `src/systems` (oxygen, power, belts, research, Harmony, Mooladri's roots and steps, inventory, day cycle) into a plain C# library with **no Unity code in it**.
- Port the 240 tests to NUnit. They run with `dotnet test`, so cloud sessions can still check every change. **The tests are the proof the port is faithful.**

### Step 4. The round planet (Director, on your PC)
- Same seed, same terrain noise, so Jivagraha has the same hills, rivers and crash site.
- Custodian controller with gravity towards the planet's centre; camera rig; jetpack.
- Digging: the voxel ground and its meshing, ported (later sped up with Unity's Jobs and Burst).
- *Check:* walk, run, jump, jetpack and dig on a phone build at 30 fps or better.

### Step 5. World, factory and story (Director; Codex for small pieces)
- Machines, belts, pylons and the build menu; Harmony visuals; creatures; SARATHI drone and voice; Huxley's hologram; logs, Codex, goals and stuck hints; saving and loading.
- Slices 1–3 rebuilt: the wake-up (Cinemachine shot), Huxley and the logs, Mooladri (the same procedural body, or a sculpted version from your concept).
- *Check:* the slice 1–3 playtests rewritten as Unity play-mode tests.

### Step 6. The visual upgrade (Director, with your eye)
- Lighting, sky and aurora, fog and haze, bloom; Shader Graph for glow, wind and water; VFX Graph for smoke, spores, moths and dust; denser forests.
- Side-by-side screenshots, web against Unity, for your yes.

### Step 7. Finish Chapter 1 in Unity
- Slices 4–6 of `docs/M4-PLAN.md`: rover and vehicle bay, Fragment chamber, launch pad, starter ship and the lift-off (Timeline), difficulty, photo mode, graphics settings.
- Android build (APK first, Play Store later), Windows build for Steam and itch.io, store pages.

## 4. What changes for the team
- **Commander:** same art, music and sound work. FBX or GLB both work. You can now open the scene and look. You run Claude Code on your PC for building sessions.
- **ChatGPT (Codex):** small, isolated C# tasks (UI panels, settings, editor tools) with the same AGENTS.md rules.
- **ChatGPT (chat) and Sarvam AI:** unchanged. Text still lives in data files.
- **Director:** keeps engine, systems, integration and checks, as now.

## 5. What happens to the web game
It stays live at https://medh-eng.github.io/Corebound/ as the prototype, gets bug fixes only, and remains the reference for "how should this feel".

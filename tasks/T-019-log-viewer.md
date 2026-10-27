# T-019: The memory-log viewer

- **Assigned to:** ChatGPT (Codex)
- **Status:** review
- **Priority:** P1 (M4)
- **Deliver to:** pull request from branch `chatgpt/T-019-log-viewer`

## Goal
In M4 the player finds memory logs and Prof. Huxley's hologram message. Build the panel that plays one. The Director places the logs in the world and wires the keys.

## Read first
- `AGENTS.md`; `src/data/logs.ts` (`StoryLog`: id, speaker, where, title, text); `src/ui/ui.ts` (`#codex` and `#research` as examples)

## Files you may change
- `src/ui/ui.ts`, `src/ui/style.css` only.

## What to build
1. Hidden overlay `#log`: speaker line (small caps), title, the text revealed like a recording (a few words at a time, about 14 words per second; a click or Space shows it all at once), and a "Close (E)" hint.
2. Huxley's logs (`speaker` contains "Huxley") get a soft blue-gold hologram tint and a faint flicker; SARATHI's corrupted records get a slightly glitched style (letter-spacing jitter, never unreadable); the Custodian's voice notes are plain and warm.
3. Public methods: `showLog(log: StoryLog, reaction?: string)` (the optional SARATHI reaction appears under the text when the reveal ends), `hideLog()`, getter `logOpen`. Respect `prefers-reduced-motion` (no flicker, instant text).
4. Works at 360 px wide.

## Done when
- [ ] `npm test` and `npm run build` pass; only the two files changed (plus this Status line)

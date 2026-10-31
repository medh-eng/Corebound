# T-034: Lower the music while SARATHI speaks; keep the text on screen as long as the voice

- **Assigned to:** ChatGPT (Codex)
- **Status:** review
- **Priority:** P2
- **Branch:** `chatgpt/T-034-voice-ducking`

## Goal
SARATHI's 57 recorded lines now play (T-005 merged 31 Oct). Two polish items: the music should dip while she speaks, and her text line should stay visible until the voice finishes.

## Read first
`AGENTS.md`; `src/audio/sound.ts` (`speakVoice`, `playVoiceFile`, `musicBus`); `src/data/voice.ts`; in `src/ui/ui.ts`, the place that calls `sharedSound()?.speakVoice(line)`.

## Do
1. While a voice line plays, lower the music bus to 45% of its setting over 0.25 s, and bring it back over 0.8 s after the line ends (or is interrupted with nothing following). Sound effects are not lowered.
2. `speakVoice` returns the line's length in seconds (or 0 if there is no recording). The HUD keeps SARATHI's text visible for at least that long plus 1 s.
3. If the voice volume is 0, nothing is lowered.
4. Unit tests for the ducking timing using a fake AudioContext/gain (no real audio).

## Allowed files
`src/audio/sound.ts`, `src/ui/ui.ts` (only the SARATHI line display), `tests/`, this task's Status line.

## Done when
- [ ] `npm test` and `npm run build` pass
- [ ] Music dips and returns; text stays as long as the voice
- [ ] PR opened with the AGENTS.md template; Status "review"

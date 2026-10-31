# T-029: Android movement sometimes stops working (issue #24)

- **Assigned to:** ChatGPT (Codex)
- **Status:** done
- **Priority:** P1 (most important bug)
- **Branch:** `chatgpt/T-029-android-movement-lock`

## Goal
On an Android phone the Commander sometimes cannot move, especially during long walks looking for resources. Movement must always recover, without opening a menu.

## Read first
`AGENTS.md`; issue #24; `src/ui/touch.ts` (joystick, look area, action buttons); `scripts/playtest-touch.mjs`.

## Do
1. Find every way the joystick can be left "held" or "dead": a finger lifted outside the joystick, `pointercancel`, `lostpointercapture`, a second finger taking the same pointer id, the browser's own gesture (pull-to-refresh, back swipe), a panel opening or closing mid-walk, the app going to the background (`visibilitychange`, `blur`), screen rotation/resizing.
2. Make each path reset the joystick to "released", clear its pointer id and its move vector. A new touch on the joystick must always take it over, even if an old pointer id is still stored.
3. Add `touch-action: none` and `overscroll-behavior: none` to the game surface and controls if missing.
4. Write in the PR which cause you found most likely and why; it is a guess until the Commander retests on his phone.
5. Extend `scripts/playtest-touch.mjs` with: a 60-second walk; a release outside the joystick; a `pointercancel` mid-walk; a panel open/close mid-walk; a hidden/visible cycle. After each, movement must restart.

## Allowed files
`src/ui/touch.ts`, `src/ui/style.css`, `index.html` (CSS only), `scripts/playtest-touch.mjs`, `tests/`, this task's Status line.

## Done when
- [ ] `npm test`, `npm run build` and `node scripts/playtest-touch.mjs` pass
- [ ] Every path in step 1 resets the joystick; the new playtest checks prove it
- [ ] PR opened; Status "review"; list your doubts for the Director

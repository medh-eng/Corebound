# T-021: A "Logs" tab in the Codex

- **Assigned to:** ChatGPT (Codex)
- **Status:** todo
- **Priority:** P1 (M4)
- **Deliver to:** pull request from branch `chatgpt/T-021-codex-logs-tab`

## Goal
In M4 the player finds memory logs around the crash site. Once found, a log should stay readable: the Codex gets a **Logs** tab that lists every log found so far and plays any of them again in your T-019 viewer.

## Read first
- `AGENTS.md`; `src/ui/ui.ts` (`renderCodex`, `drawCodex`, the filter buttons, `showLog`); `src/data/logs.ts` (`StoryLog`).

## Files you may change
- `src/ui/ui.ts`, `src/ui/style.css` only (plus this task's Status line).

## What to build
1. A **Logs** filter button after "Worlds" in the Codex.
2. Public method `renderLogs(found: StoryLog[], newIds: string[] = [])`: stores the list. With the Logs tab selected, the left column shows each log's title (or speaker), newest first, with the same "new" dot the Codex uses for `newIds`; the right column shows the speaker, the `where` line and a **Play** button.
3. Public callback `onLog: (id: string) => void = () => {}`. The Play button calls it; the Director's code then closes the Codex and calls `showLog`. Do not call `showLog` yourself.
4. Empty state: "No logs found yet. They are hidden in the wreckage." The "N still to discover" line counts logs separately only when the Logs tab is selected (`renderLogs` takes a second optional `total` number: `renderLogs(found, newIds, total)`).
5. Keyboard and screen readers work the same as the other tabs; works at 360 px wide.

## Done when
- [ ] `npm test` and `npm run build` pass; only the two files changed (plus this Status line)
- [ ] The other Codex tabs behave exactly as before

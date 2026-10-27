# T-001: Chapter 1 story: Huxley's first message and memory logs

- **Assigned to:** ChatGPT (chat)
- **Status:** done (merged 2026-10-27)
- **Priority:** P2 (needed for M4, write now so it can be reviewed early)
- **Deliver to:** `team-inbox/writing/T-001-chapter1-logs.md`
- **Depends on:** nothing

## Goal
Write the story text that Chapter 1 (Jivagraha) needs: Prof. Orion Huxley's first hologram message and 9 memory logs the player finds while exploring and digging.

## Read first
- `AGENTS.md` (rules and writing style)
- `docs/GDD.md` §15 Story (characters and the reveal path), §14 The first hour, §2 Pillars
- `src/data/story.ts` (SARATHI's current lines, to match the tone)

## What to write

**1. Huxley's first hologram** (id `huxley_01`, 120–180 words). The player finds it in the crashed escape module's main deck. He: introduces himself as chief scientist of Project Amarnath (without explaining what it really is); tells the Custodian that if they hear this, something went wrong; asks them to find the **translator** in the front deck; says the ship's manual in the **control room** explains everything, but the control room was badly damaged. Warm, tired, slightly guilty. No twist reveal.

**2. Nine memory logs** (ids `log_01` … `log_09`, 40–90 words each). Mix of voices: the Custodian's own fragmented voice notes from before the crash (5), Huxley's notes (2), SARATHI's corrupted system records (2). Spread them across Chapter 1:
- 3 near the crash site and base (Earth is gone; the Seeds of Humanity; the Custodian's job),
- 3 underground (strange readings; the ship's Quantum Core; the crash "was no accident" hint, as in GDD §14 minute 20),
- 3 deep or near the Root Guardian (the forest seems to know the Core; "the readings say this forest is only a few centuries old").

Only hints. The full truth (the Core created these worlds) must **not** be stated in Chapter 1.

**3. Five short SARATHI reactions** (ids `sarathi_log_react_01`…`05`, under 25 words) for when the player opens a log.

## Format
```
## huxley_01
Speaker: Prof. Orion Huxley
Where: escape module, main deck
Text: ...

## log_01
Speaker: The Custodian (voice note)
Where: near the crash site
Title: (3–5 words, shown in the Codex)
Text: ...
```

## Done when
- [ ] All ids present, word counts respected
- [ ] No violence, no twist reveal, British spelling
- [ ] Delivery note at the top

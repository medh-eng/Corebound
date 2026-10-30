# T-033: Hindi and Marathi for controls, tips, phone help and the privacy notice

- **Assigned to:** Sarvam AI
- **Status:** todo
- **Priority:** P3
- **Deliver to:** `team-inbox/writing/T-033-hindi-marathi-ui.md`

## Goal
Chapter 1 story waits for the M4 text freeze (T-006), but menu and help text is stable. Translate it now.

## Read first
`AGENTS.md`; your glossary from T-006 (`team-inbox/writing/`); `src/data/controls.ts`; `src/data/tips.ts`; `team-inbox/writing/T-027-privacy-and-phone-help.md`.

## Write
For every string in `controls.ts` and `tips.ts`, the 11 phone-help lines and the privacy notice: Hindi and Marathi, as TypeScript objects keyed by the same ids (`{ id: { hi: "...", mr: "..." } }`). Keep key and button names (E, Tab, Use, Bag…) in English. Keep proper names as in `names.ts`. Natural, simple language for players aged 10 and up; no Sanskrit-heavy words where an everyday word exists.

## Done when
- [ ] Every string translated in both languages, same ids
- [ ] Note any line that did not translate cleanly

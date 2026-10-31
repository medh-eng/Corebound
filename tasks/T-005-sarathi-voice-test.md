# T-005: SARATHI voice test

- **Assigned to:** Sarvam AI (Bulbul text-to-speech), run by the Commander
- **Status:** done (31 Oct): 57 English lines recorded and playing in the game (PR #21). Listening review is T-035
- **Priority:** P2
- **Deliver to:** `art-inbox/audio/voice/tests/`
- **Depends on:** nothing

## Goal
Choose SARATHI's voice.

## What to make
Follow `docs/PROMPTS.md` §14:
- The 5 test lines in **Indian English**, in 3–4 different voices: `sarathi_test_<voice>_<1-5>.wav`
- Lines 1 and 3 in **Hindi** and **Marathi** (translate them naturally first) with the best two voices: `sarathi_test_<voice>_hi_<n>.wav`, `sarathi_test_<voice>_mr_<n>.wav`

## Done when
- [ ] Files uploaded; the Commander tells the Director which voice he likes

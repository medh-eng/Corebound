# T-018: Codex entries for Jivagraha and Harmony

- **Assigned to:** ChatGPT (chat)
- **Status:** review
- **Priority:** P2 (M3)
- **Deliver to:** `team-inbox/writing/T-018-codex-text.md`
- **Depends on:** nothing (use English names; the Director adds Sarvam's names from T-017)

## Read first
- `AGENTS.md`; `src/data/codex.ts` (the entry shape and examples); `docs/GDD.md` §10 Harmony and §11 Living world

## What to write
Entries in the `CodexEntry` shape (`id`, `kind`, `title`, `text` 40–100 words, `science` one line of true science):
1. **Flora (6):** banyan tree, mushroom tree, small glow-mushrooms, ferns, lotus pads, the bloom.
2. **Fauna (3):** glow-moth (Jyotipatang), a gentle grazer, a small burrower. Shy, curious, never dangerous.
3. **Minerals (4):** ice crystals, iron ore, carbon, sandstone/silica.
4. **Harmony (3, kind `world`):** what dirties the Air, the Water and the Soil on Jivagraha, what cleans them, and what the player sees when they change. Hint that the planet *reacts* as if it were alive, without explaining why.

Write as a field scientist's notes: curious, precise, a little wonder. No violence, no story twist, British spelling.

## Format
A TypeScript-style list the Director can paste:
```
{ id: 'banyan', kind: 'flora', title: 'Banyan tree', text: '...', science: '...' },
```

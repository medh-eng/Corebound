// The backpack: a few stacks, so anything you need in bulk must be automated later.
import { ITEMS, RECIPES, type ItemId, type Recipe } from '../data/items';

export interface Slot { id: ItemId; n: number }

export class Backpack {
  slots: (Slot | null)[];
  constructor(public size = 8) { this.slots = new Array(size).fill(null); }

  count(id: ItemId): number { return this.slots.reduce((s, x) => s + (x && x.id === id ? x.n : 0), 0); }

  /** Adds up to n items; returns how many did not fit. */
  add(id: ItemId, n: number): number {
    const max = ITEMS[id].stack;
    for (const s of this.slots) if (s && s.id === id && s.n < max && n > 0) { const k = Math.min(n, max - s.n); s.n += k; n -= k; }
    for (let i = 0; i < this.slots.length && n > 0; i++) if (!this.slots[i]) { const k = Math.min(n, max); this.slots[i] = { id, n: k }; n -= k; }
    return n;
  }

  remove(id: ItemId, n: number): boolean {
    if (this.count(id) < n) return false;
    for (let i = this.slots.length - 1; i >= 0 && n > 0; i--) {
      const s = this.slots[i];
      if (!s || s.id !== id) continue;
      const k = Math.min(n, s.n); s.n -= k; n -= k;
      if (s.n === 0) this.slots[i] = null;
    }
    return true;
  }

  canCraft(r: Recipe): boolean {
    return Object.entries(r.needs).every(([id, n]) => this.count(id as ItemId) >= (n ?? 0));
  }

  craft(r: Recipe): boolean {
    if (!this.canCraft(r)) return false;
    // Make sure the result will fit once ingredients are gone.
    const trial = new Backpack(this.size);
    trial.slots = this.slots.map((s) => (s ? { ...s } : null));
    for (const [id, n] of Object.entries(r.needs)) trial.remove(id as ItemId, n ?? 0);
    if (trial.add(r.out, r.n) > 0) return false;
    this.slots = trial.slots;
    return true;
  }

  /** Grows (never shrinks) the backpack. */
  resize(n: number) { if (n > this.size) { this.slots = this.slots.concat(new Array(n - this.size).fill(null)); this.size = n; } }

  static recipes() { return RECIPES; }
  toJSON() { return this.slots; }
  load(slots: (Slot | null)[]) { this.slots = slots.slice(0, this.size).concat(new Array(Math.max(0, this.size - slots.length)).fill(null)); }
}

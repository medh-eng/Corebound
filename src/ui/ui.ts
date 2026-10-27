// Menus and heads-up display (plain DOM over the 3D canvas).
import { assetUrl } from '../render/assets';
import { CREDITS } from '../data/credits';
import { CODEX, type CodexKind } from '../data/codex';
import { ITEMS, RECIPES, type ItemId, type Recipe } from '../data/items';
import { RESEARCH, type ResearchNode } from '../data/research';
import type { Slot } from '../systems/inventory';
import { TIPS } from '../data/tips';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const KEYS: [string, string][] = [
  ['W A S D', 'Walk'],
  ['Mouse', 'Look around'],
  ['Left mouse (hold)', 'Mining laser'],
  ['Shift', 'Run'],
  ['Space', 'Jump · hold in the air for jetpack'],
  ['Tab', 'Backpack and crafting'],
  ['B', 'Build menu (click to place, R to turn)'],
  ['C', 'Lay a conveyor belt between two machines'],
  ['E', 'Use a machine (load it, collect, research)'],
  ['X', 'Pick up a machine'],
  ['Q', 'Breathe an O₂ canister'],
  ['M', 'Planet view'],
  ['G', 'Dance (press again for another)'],
  ['N (hold)', 'Speed up time'],
  ['F3', 'Performance info'],
  ['Esc', 'Pause'],
];

export interface Goal { key: string; text: string; done?: boolean; mystery?: boolean }

export class UI {
  private loadingTipTimer = 0;
  onCraft: (r: Recipe) => void = () => {};
  onPlace: (id: ItemId) => void = () => {};
  onBuild: (id: ItemId) => void = () => {};
  onResearch: (id: string) => void = () => {};
  onResearchLoad: () => void = () => {};
  private sarathiTimer = 0;
  private codexFilter: CodexKind | 'all' = 'all';
  private codexSelected: string | null = null;
  private codexUnlocked = new Set<string>();
  private codexNew = new Set<string>();

  constructor() {
    const keys = KEYS.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('');
    document.body.insertAdjacentHTML('beforeend', `
      <div id="loading" style="background-image:url('${assetUrl('ui/key_art.webp')}')">
        <div class="box"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="msg">Preparing Jivagraha</div><div class="bar"><i></i></div><div class="tip"></div></div>
      </div>
      <div id="title" class="hidden">
        <div class="top"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="tag">Build · Automate · Survive · Preserve</div></div>
        <div class="bottom"><div class="btns"><button class="btn" id="continue">Continue</button><button class="btn" id="begin">New game</button><button class="btn" id="title-credits">${CREDITS.button}</button></div>
        <div class="note">Chapter 1 · Jivagraha · dig, build and breathe on a living world</div></div>
      </div>
      <div id="pause" class="hidden"><div class="card">
        <h2>Paused</h2>
        <div class="menu-btns"><button class="btn" id="resume">Resume</button><button class="btn small" id="save">Save game</button><button class="btn small" id="load">Load last save</button><button class="btn small" id="home">Main menu</button><button class="btn small" id="pause-credits">${CREDITS.button}</button></div>
        <div id="saved-note" class="note"></div>
        <h3>Settings</h3>
        <label class="slider"><span>Music</span><input type="range" id="vol-music" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Sound effects</span><input type="range" id="vol-sfx" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Master volume</span><input type="range" id="vol-master" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Mouse sensitivity</span><input type="range" id="sens" min="0.0008" max="0.005" step="0.0002"></label>
        <label class="slider"><span>Shadows</span><select id="shadows"><option value="2">High</option><option value="1">Low</option><option value="0">Off</option></select></label>
        <details><summary>Controls</summary><div class="keys">${keys}</div></details>
      </div></div>
      <div id="credits" class="hidden" role="dialog" aria-modal="true" aria-label="${CREDITS.button}"><div class="card">
        <img alt="${CREDITS.logoAlt}" src="${assetUrl('ui/logo.webp')}">
        <p>${CREDITS.title}</p><h2>${CREDITS.author}</h2>
        ${CREDITS.lines.map((line) => `<p>${line}</p>`).join('')}
        <button class="btn" id="credits-close">${CREDITS.close}</button>
      </div></div>
      <div id="pack" class="hidden"><div class="card">
        <h2>Backpack</h2><div class="slots"></div><div class="note" id="pack-note">8 slots. Anything you need in bulk, you will automate later.</div>
        <h3>Craft</h3><div class="recipes"></div>
        <div class="note">Tab to close · click a machine in your backpack to place it</div>
      </div></div>
      <div id="build" class="hidden"><div class="card">
        <h2>Build</h2><div class="builds"></div>
        <div class="note">Click to place (crafts it first if you have the parts) · B or Esc to close</div>
      </div></div>
      <div id="research" class="hidden"><div class="card">
        <h2>Research</h2><div class="current"></div><div class="nodes"></div>
        <div class="note">E or Esc to close · the station needs power while it works</div>
      </div></div>
      <div id="codex" class="hidden"><div class="card">
        <h2>Codex</h2>
        <div class="codex-filters" role="group" aria-label="Filter Codex">
          <button class="btn small" data-kind="all" aria-pressed="true">All</button>
          <button class="btn small" data-kind="flora" aria-pressed="false">Flora</button>
          <button class="btn small" data-kind="fauna" aria-pressed="false">Fauna</button>
          <button class="btn small" data-kind="mineral" aria-pressed="false">Minerals</button>
          <button class="btn small" data-kind="machine" aria-pressed="false">Machines</button>
          <button class="btn small" data-kind="world" aria-pressed="false">Worlds</button>
        </div>
        <div class="codex-columns"><nav class="codex-list" aria-label="Discovered entries"></nav><article class="codex-entry" aria-live="polite"></article></div>
        <div class="note codex-count"></div>
      </div></div>
      <div id="hud" class="hidden">
        <div id="vitals" class="panel">
          <div class="row"><span class="label">Oxygen</span><span class="meter" id="o2"><i style="width:100%"></i></span></div>
          <div class="row"><span class="label">Suit</span><span class="meter" id="power"><i style="width:100%"></i></span></div>
          <div class="row"><span class="label">Shelter</span><span class="meter" id="air"><i style="width:0%"></i></span></div>
          <div class="row small"><span id="clock">06:00</span><span id="grid"></span></div>
          <div class="row small" id="harm" title="Planet health: Air, Water, Soil"><span class="hs air">◆ Air</span><span class="hs water">● Water</span><span class="hs soil">■ Soil</span></div>
        </div>
        <div id="goals" class="panel"></div>
        <div id="res" class="panel"></div>
        <button id="gear" title="Menu (Esc)" aria-label="Menu">⚙</button>
        <div id="help" class="panel"><div class="keys">${keys}</div></div>
        <div id="stats" class="panel hidden"></div>
        <div id="toast"></div>
        <div id="crosshair"><svg viewBox="0 0 40 40"><circle id="ring" cx="20" cy="20" r="14" fill="none" stroke="#ffb347" stroke-width="3" stroke-dasharray="0 88" transform="rotate(-90 20 20)"/></svg></div>
        <div id="prompt" class="hidden"></div>
        <div id="sarathi" class="hidden"><span class="who">SARATHI</span><span class="line"></span></div>
        <div id="pickups"></div>
        <div id="tags"></div>
        <div id="planet" class="panel hidden"></div>
      </div>`);
    const tip = $('#loading .tip');
    let remaining: string[] = [];
    let lastTip = '';
    const nextTip = () => {
      if (!remaining.length) {
        remaining = [...TIPS];
        for (let i = remaining.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
        }
        // Avoid repeating the last tip at the boundary between shuffled rounds.
        if (remaining.length > 1 && remaining[remaining.length - 1] === lastTip) {
          [remaining[0], remaining[remaining.length - 1]] = [remaining[remaining.length - 1], remaining[0]];
        }
      }
      lastTip = remaining.pop() ?? '';
      tip.textContent = lastTip;
    };
    nextTip();
    this.loadingTipTimer = window.setInterval(nextTip, 5000);
    const credits = $('#credits');
    const close = $('#credits-close');
    let creditsOpener: HTMLElement | null = null;
    const closeCredits = () => {
      credits.classList.add('hidden');
      creditsOpener?.focus();
    };
    for (const id of ['title-credits', 'pause-credits']) {
      const opener = $(`#${id}`);
      opener.onclick = () => {
        creditsOpener = opener;
        credits.classList.remove('hidden');
        close.focus();
      };
    }
    close.onclick = closeCredits;
    // Capture Escape before the game's pause handler can also consume it.
    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || credits.classList.contains('hidden')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      closeCredits();
    }, true);
    credits.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      e.preventDefault();
      close.focus();
    });
    $('#codex .codex-filters').addEventListener('click', (e) => {
      const tab = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-kind]');
      if (!tab) return;
      this.codexFilter = tab.dataset.kind as CodexKind | 'all';
      this.drawCodex();
    });
    $('#codex .codex-list').addEventListener('click', (e) => {
      const entry = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-entry]');
      if (!entry) return;
      this.codexSelected = entry.dataset.entry!;
      this.drawCodex();
      // Rebuilding the list replaces the clicked button; keep keyboard focus on it.
      [...document.querySelectorAll<HTMLButtonElement>('#codex [data-entry]')]
        .find((button) => button.dataset.entry === this.codexSelected)?.focus();
    });
    this.renderCodex([]);
    $('#build').addEventListener('click', (e) => {
      const b = (e.target as HTMLElement).closest('[data-build]') as HTMLButtonElement | null;
      if (b && !b.disabled) this.onBuild(b.dataset.build as ItemId);
    });
    $('#research').addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const n = t.closest('[data-node]') as HTMLButtonElement | null;
      if (n && !n.disabled) this.onResearch(n.dataset.node!);
      if (t.closest('[data-load]')) this.onResearchLoad();
    });
    ($('#pack') as HTMLElement).addEventListener('click', (e) => {
      const t = e.target as HTMLElement;
      const r = t.closest('[data-recipe]') as HTMLElement | null;
      if (r) this.onCraft(RECIPES[Number(r.dataset.recipe)]);
      const s = t.closest('[data-place]') as HTMLElement | null;
      if (s) this.onPlace(s.dataset.place as ItemId);
    });
  }

  loading(text: string, progress: number) {
    $('#loading .msg').textContent = text;
    ($('#loading .bar i') as HTMLElement).style.width = `${Math.round(progress * 100)}%`;
  }
  hideLoading() {
    window.clearInterval(this.loadingTipTimer);
    this.loadingTipTimer = 0;
    $('#loading').classList.add('hidden');
  }

  showTitle(hasSave: boolean, onNew: () => void, onContinue: () => void) {
    $('#title').classList.remove('hidden');
    const c = $('#continue') as HTMLButtonElement;
    c.classList.toggle('hidden', !hasSave);
    c.onclick = () => { this.hideTitle(); onContinue(); };
    ($('#begin') as HTMLButtonElement).onclick = () => { this.hideTitle(); onNew(); };
    (hasSave ? c : ($('#begin') as HTMLButtonElement)).focus();
  }
  hideTitle() { $('#title').classList.add('hidden'); }

  /** Hooks for the pause menu. */
  menu: {
    save: () => string; load: () => void; home: () => void;
    settings: () => { music: number; sfx: number; master: number; sens: number; shadows: number };
    change: (k: 'music' | 'sfx' | 'master' | 'sens' | 'shadows', v: number) => void;
  } = { save: () => '', load: () => {}, home: () => {}, settings: () => ({ music: 0.5, sfx: 0.8, master: 0.8, sens: 0.0022, shadows: 2 }), change: () => {} };

  showPause(onResume: () => void) {
    $('#pause').classList.remove('hidden');
    ($('#resume') as HTMLButtonElement).onclick = () => { this.hidePause(); onResume(); };
    ($('#save') as HTMLButtonElement).onclick = () => { $('#saved-note').textContent = this.menu.save(); };
    ($('#load') as HTMLButtonElement).onclick = () => this.menu.load();
    ($('#home') as HTMLButtonElement).onclick = () => this.menu.home();
    const sh = $('#shadows') as HTMLSelectElement;
    sh.value = String(this.menu.settings().shadows);
    sh.onchange = () => this.menu.change('shadows', Number(sh.value));
    const s = this.menu.settings();
    for (const k of ['music', 'sfx', 'master'] as const) {
      const el = $(`#vol-${k}`) as HTMLInputElement;
      el.value = String(s[k]);
      el.oninput = () => this.menu.change(k, Number(el.value));
    }
    const sens = $('#sens') as HTMLInputElement;
    sens.value = String(s.sens);
    sens.oninput = () => this.menu.change('sens', Number(sens.value));
    $('#saved-note').textContent = '';
  }

  onGear(f: () => void) { ($('#gear') as HTMLButtonElement).onclick = f; }

  resources(counts: { name: string; color: string; n: number }[]) {
    $('#res').innerHTML = counts.map((c) => `<div class="r"><i style="background:${c.color}"></i><span>${c.name}</span><b>${c.n}</b></div>`).join('');
  }
  /** Small labels floating over machines (screen position in pixels). */
  tags(list: { x: number; y: number; text: string }[]) {
    const box = $('#tags');
    while (box.children.length < list.length) box.appendChild(document.createElement('div'));
    [...box.children].forEach((el, i) => {
      const e = el as HTMLElement; const t = list[i];
      e.style.display = t ? '' : 'none';
      if (t) { e.className = 'tag'; e.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -100%)`; if (e.textContent !== t.text) e.textContent = t.text; }
    });
  }
  /** Harmony: colour-coded shapes in the HUD; numbers only in planet view (GDD §10). */
  harmony(h: { value: number; band: string; air: number; water: number; soil: number }, planetView: boolean) {
    const col = (p: number) => (p < 25 ? '#5cffd6' : p < 50 ? '#c9e86a' : p < 75 ? '#ffb347' : '#ff6a5a');
    for (const k of ['air', 'water', 'soil'] as const) ($(`#harm .${k}`) as HTMLElement).style.color = col(h[k]);
    const pv = $('#planet');
    pv.classList.toggle('hidden', !planetView);
    if (planetView) {
      const bar = (label: string, p: number) => `<div class="pr"><span>${label}</span><i><b style="width:${Math.round(100 - p)}%;background:${col(p)}"></b></i><em>${Math.round(100 - p)}% clean</em></div>`;
      pv.innerHTML = `<div class="ph">Jivagraha · Harmony <b>${Math.round(h.value)}</b> · ${h.band}</div>${bar('Air', h.air)}${bar('Water', h.water)}${bar('Soil', h.soil)}`;
    }
  }

  hidePause() { $('#pause').classList.add('hidden'); }
  get paused() { return !$('#pause').classList.contains('hidden'); }

  get packOpen() { return !$('#pack').classList.contains('hidden'); }
  setPack(open: boolean) { $('#pack').classList.toggle('hidden', !open); }

  get buildOpen() { return !$('#build').classList.contains('hidden'); }
  setBuild(open: boolean) { $('#build').classList.toggle('hidden', !open); }
  /** Machines you can place: how many you carry, and what one costs. */
  renderBuild(list: { id: ItemId; have: number; canCraft: boolean; needs: string }[]) {
    $('#build .builds').innerHTML = list.map((b) => {
      const d = ITEMS[b.id];
      const ok = b.have > 0 || b.canCraft;
      return `<button class="recipe" data-build="${b.id}" ${ok ? '' : 'disabled'}><b><i class="dot" style="background:${d.color}"></i>${d.name}${b.have ? ` <small>× ${b.have} in backpack</small>` : ''}</b><span>${b.have ? 'Ready to place' : b.needs}</span><em>${d.note}</em></button>`;
    }).join('') || '<div class="note">Nothing to build yet.</div>';
  }

  get researchOpen() { return !$('#research').classList.contains('hidden'); }
  setResearch(open: boolean) { $('#research').classList.toggle('hidden', !open); }
  /** The research tree: done, the current project (with parts delivered), what can start, what is locked. */
  renderResearch(r: { done: string[]; active: string | null; inv: Partial<Record<ItemId, number>>; progress: number }, carried: (id: ItemId) => number, powered: boolean) {
    const node = r.active ? RESEARCH.find((n) => n.id === r.active)! : null;
    const parts = (n: ResearchNode, got?: Partial<Record<ItemId, number>>) => Object.entries(n.needs)
      .map(([id, k]) => `${got ? `${Math.min(got[id as ItemId] ?? 0, k ?? 0)}/` : ''}${k} ${ITEMS[id as ItemId].name.toLowerCase()}`).join(' · ');
    if (node) {
      const ready = Object.entries(node.needs).every(([id, k]) => (r.inv[id as ItemId] ?? 0) >= (k ?? 0));
      const missing = Object.entries(node.needs).some(([id, k]) => (r.inv[id as ItemId] ?? 0) < (k ?? 0) && carried(id as ItemId) > 0);
      $('#research .current').innerHTML = `<div class="now"><b>${node.name}</b><span>${parts(node, r.inv)}</span>
        <div class="bar"><i style="width:${Math.round((r.progress / node.seconds) * 100)}%"></i></div>
        <em>${ready ? (powered ? 'Researching…' : 'Waiting for power') : 'Give it the parts: load from your backpack, or send them by conveyor.'}</em>
        ${ready ? '' : `<button class="btn small" data-load ${missing ? '' : 'disabled'}>Load parts from backpack</button>`}</div>`;
    } else $('#research .current').innerHTML = '<div class="note">Choose what to research.</div>';
    $('#research .nodes').innerHTML = RESEARCH.map((n) => {
      const done = r.done.includes(n.id);
      const open = n.requires.every((q) => r.done.includes(q));
      const state = done ? '✓ Done' : n.id === r.active ? 'In progress' : open ? parts(n) : `Needs ${n.requires.filter((q) => !r.done.includes(q)).map((q) => RESEARCH.find((x) => x.id === q)!.name).join(', ')}`;
      return `<button class="recipe${done ? ' done' : ''}" data-node="${n.id}" ${done || !open || n.id === r.active ? 'disabled' : ''}><b>${n.name} <small>tier ${n.tier}</small></b><span>${state}</span><em>${n.note}</em></button>`;
    }).join('');
  }

  get codexOpen() { return !$('#codex').classList.contains('hidden'); }
  setCodex(open: boolean) { $('#codex').classList.toggle('hidden', !open); }

  renderCodex(unlocked: string[], newIds: string[] = []) {
    this.codexUnlocked = new Set(unlocked);
    this.codexNew = new Set(newIds);
    this.drawCodex();
  }

  private drawCodex() {
    const unlocked = CODEX.filter((entry) => this.codexUnlocked.has(entry.id));
    const visible = unlocked.filter((entry) => this.codexFilter === 'all' || entry.kind === this.codexFilter);
    const selected = visible.find((entry) => entry.id === this.codexSelected) ?? visible[0];
    this.codexSelected = selected?.id ?? null;
    document.querySelectorAll<HTMLButtonElement>('#codex [data-kind]').forEach((tab) => {
      tab.setAttribute('aria-pressed', String(tab.dataset.kind === this.codexFilter));
    });
    const list = $('#codex .codex-list');
    list.replaceChildren();
    for (const entry of visible) {
      const button = document.createElement('button');
      button.className = 'recipe';
      button.dataset.entry = entry.id;
      button.setAttribute('aria-pressed', String(entry.id === selected?.id));
      button.textContent = entry.title;
      if (this.codexNew.has(entry.id)) {
        const badge = document.createElement('small');
        badge.className = 'codex-new';
        badge.textContent = 'new';
        button.append(badge);
      }
      list.append(button);
    }
    const detail = $('#codex .codex-entry');
    detail.replaceChildren();
    if (selected) {
      const title = document.createElement('h3');
      title.textContent = selected.title;
      detail.append(title);
      if (selected.name || selected.deva) {
        const name = document.createElement('p');
        name.className = 'codex-name';
        name.textContent = [selected.name, selected.deva].filter(Boolean).join(' · ');
        detail.append(name);
      }
      const text = document.createElement('p');
      text.textContent = selected.text;
      detail.append(text);
      if (selected.science) {
        const science = document.createElement('p');
        science.className = 'codex-science';
        const label = document.createElement('strong');
        label.textContent = 'Science: ';
        science.append(label, selected.science);
        detail.append(science);
      }
    } else {
      detail.textContent = unlocked.length ? 'No discoveries in this category yet.' : 'Scan your surroundings to discover Codex entries.';
    }
    $('#codex .codex-count').textContent = `${CODEX.length - unlocked.length} still to discover`;
  }

  renderPack(slots: (Slot | null)[], canCraft: (r: Recipe) => boolean, unlocked: (r: Recipe) => boolean = () => true) {
    $('#pack .slots').innerHTML = slots.map((s) => {
      if (!s) return '<div class="slot empty"></div>';
      const d = ITEMS[s.id];
      const place = d.placeable ? ` data-place="${s.id}" title="Click to place"` : '';
      return `<div class="slot${d.placeable ? ' placeable' : ''}"${place}><i style="background:${d.color}"></i><b>${s.n}</b><span>${d.name}</span></div>`;
    }).join('');
    $('#pack .recipes').innerHTML = RECIPES.map((r, i) => {
      if (!unlocked(r)) return '';
      const ok = canCraft(r);
      const needs = Object.entries(r.needs).map(([id, n]) => `${n} ${ITEMS[id as ItemId].name.toLowerCase()}`).join(' + ');
      return `<button class="recipe" data-recipe="${i}" ${ok ? '' : 'disabled'}><b>${ITEMS[r.out].name}</b><span>${needs}</span><em>${ITEMS[r.out].note}</em></button>`;
    }).join('');
  }

  showHud() { $('#hud').classList.remove('hidden'); setTimeout(() => ($('#help').style.opacity = '0'), 30000); }
  toggleHelp() { const h = $('#help'); h.style.opacity = h.style.opacity === '0' ? '1' : '0'; }

  vitals(o2: number, power: number, air: number, clock: string, grid: string) {
    const o = $('#o2 i') as HTMLElement;
    o.style.width = `${Math.round(o2 * 100)}%`;
    o.classList.toggle('low', o2 < 0.25);
    ($('#power i') as HTMLElement).style.width = `${Math.round(power * 100)}%`;
    ($('#air i') as HTMLElement).style.width = `${Math.round(air * 100)}%`;
    $('#clock').textContent = clock;
    $('#grid').textContent = grid;
  }

  goals(list: Goal[]) {
    $('#goals').innerHTML = list
      .map((g) => `<div class="g ${g.done ? 'done' : ''} ${g.mystery ? 'mystery' : ''}"><span class="k">${g.key}</span>${g.done ? '✓ ' : ''}${g.text}</div>`)
      .join('');
  }

  toast(text: string) {
    const t = $('#toast');
    t.textContent = text;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
  }

  pickup(text: string, color: string) {
    const el = document.createElement('div');
    el.className = 'pickup';
    el.innerHTML = `<i style="background:${color}"></i>${text}`;
    $('#pickups').appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  sarathi(line: string, seconds = 7) {
    const s = $('#sarathi');
    s.classList.remove('hidden');
    $('#sarathi .line').textContent = line;
    clearTimeout(this.sarathiTimer);
    this.sarathiTimer = window.setTimeout(() => s.classList.add('hidden'), seconds * 1000);
  }

  prompt(text: string | null) {
    const p = $('#prompt');
    p.classList.toggle('hidden', !text);
    if (text) p.innerHTML = text;
  }

  progress(v: number) {
    $('#ring').setAttribute('stroke-dasharray', `${(v * 88).toFixed(1)} 88`);
  }

  stats(text: string | null) {
    const s = $('#stats');
    if (text === null) { s.classList.add('hidden'); return; }
    s.classList.remove('hidden');
    s.textContent = text;
  }
}

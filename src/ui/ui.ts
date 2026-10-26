// Menus and heads-up display (plain DOM over the 3D canvas).
import { assetUrl } from '../render/assets';
import { ITEMS, RECIPES, type ItemId, type Recipe } from '../data/items';
import type { Slot } from '../systems/inventory';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const KEYS: [string, string][] = [
  ['W A S D', 'Walk'],
  ['Mouse', 'Look around'],
  ['Left mouse (hold)', 'Mining laser'],
  ['Shift', 'Run'],
  ['Space', 'Jump · hold in the air for jetpack'],
  ['Tab', 'Backpack and crafting'],
  ['B', 'Build mode (click to place, R to turn)'],
  ['E', 'Use a machine'],
  ['X', 'Pick up a machine'],
  ['Q', 'Breathe an O₂ canister'],
  ['M', 'Planet view'],
  ['N (hold)', 'Speed up time'],
  ['F3', 'Performance info'],
  ['Esc', 'Pause'],
];

export interface Goal { key: string; text: string; done?: boolean; mystery?: boolean }

export class UI {
  onCraft: (r: Recipe) => void = () => {};
  onPlace: (id: ItemId) => void = () => {};
  private sarathiTimer = 0;

  constructor() {
    const keys = KEYS.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('');
    document.body.insertAdjacentHTML('beforeend', `
      <div id="loading" style="background-image:url('${assetUrl('ui/key_art.webp')}')">
        <div class="box"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="msg">Preparing Jivagraha</div><div class="bar"><i></i></div></div>
      </div>
      <div id="title" class="hidden">
        <div class="top"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="tag">Build · Automate · Survive · Preserve</div></div>
        <div class="bottom"><div class="btns"><button class="btn" id="continue">Continue</button><button class="btn" id="begin">New game</button></div>
        <div class="note">Chapter 1 · Jivagraha · dig, build and breathe on a living world</div></div>
      </div>
      <div id="pause" class="hidden"><div class="card">
        <h2>Paused</h2>
        <div class="menu-btns"><button class="btn" id="resume">Resume</button><button class="btn small" id="save">Save game</button><button class="btn small" id="load">Load last save</button><button class="btn small" id="home">Main menu</button></div>
        <div id="saved-note" class="note"></div>
        <h3>Settings</h3>
        <label class="slider"><span>Music</span><input type="range" id="vol-music" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Sound effects</span><input type="range" id="vol-sfx" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Master volume</span><input type="range" id="vol-master" min="0" max="1" step="0.05"></label>
        <label class="slider"><span>Mouse sensitivity</span><input type="range" id="sens" min="0.0008" max="0.005" step="0.0002"></label>
        <label class="slider"><span>Shadows</span><select id="shadows"><option value="2">High</option><option value="1">Low</option><option value="0">Off</option></select></label>
        <details><summary>Controls</summary><div class="keys">${keys}</div></details>
      </div></div>
      <div id="pack" class="hidden"><div class="card">
        <h2>Backpack</h2><div class="slots"></div><div class="note" id="pack-note">8 slots. Anything you need in bulk, you will automate later.</div>
        <h3>Craft</h3><div class="recipes"></div>
        <div class="note">Tab to close · click a machine in your backpack to place it</div>
      </div></div>
      <div id="hud" class="hidden">
        <div id="vitals" class="panel">
          <div class="row"><span class="label">Oxygen</span><span class="meter" id="o2"><i style="width:100%"></i></span></div>
          <div class="row"><span class="label">Suit</span><span class="meter" id="power"><i style="width:100%"></i></span></div>
          <div class="row"><span class="label">Shelter</span><span class="meter" id="air"><i style="width:0%"></i></span></div>
          <div class="row small"><span id="clock">06:00</span><span id="grid"></span></div>
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
      </div>`);
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
  hideLoading() { $('#loading').classList.add('hidden'); }

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
  hidePause() { $('#pause').classList.add('hidden'); }
  get paused() { return !$('#pause').classList.contains('hidden'); }

  get packOpen() { return !$('#pack').classList.contains('hidden'); }
  setPack(open: boolean) { $('#pack').classList.toggle('hidden', !open); }

  renderPack(slots: (Slot | null)[], canCraft: (r: Recipe) => boolean) {
    $('#pack .slots').innerHTML = slots.map((s) => {
      if (!s) return '<div class="slot empty"></div>';
      const d = ITEMS[s.id];
      const place = d.placeable ? ` data-place="${s.id}" title="Click to place"` : '';
      return `<div class="slot${d.placeable ? ' placeable' : ''}"${place}><i style="background:${d.color}"></i><b>${s.n}</b><span>${d.name}</span></div>`;
    }).join('');
    $('#pack .recipes').innerHTML = RECIPES.map((r, i) => {
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

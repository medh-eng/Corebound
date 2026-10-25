// Menus and heads-up display (plain DOM over the 3D canvas).
import { assetUrl } from '../render/assets';

const $ = <T extends HTMLElement>(sel: string) => document.querySelector(sel) as T;

const KEYS: [string, string][] = [
  ['W A S D', 'Walk'],
  ['Mouse', 'Look around'],
  ['Shift', 'Run'],
  ['Space', 'Jump · hold in the air for jetpack'],
  ['M', 'Planet view'],
  ['N (hold)', 'Speed up time'],
  ['Mouse wheel', 'Camera distance'],
  ['F3', 'Performance info'],
  ['Esc', 'Pause'],
];

export interface Goal { key: string; text: string; done?: boolean; mystery?: boolean }

export class UI {
  constructor() {
    const keys = KEYS.map(([k, v]) => `<b>${k}</b><span>${v}</span>`).join('');
    document.body.insertAdjacentHTML('beforeend', `
      <div id="loading" style="background-image:url('${assetUrl('ui/key_art.webp')}')">
        <div class="box"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="msg">Preparing Jivagraha</div><div class="bar"><i></i></div></div>
      </div>
      <div id="title" class="hidden">
        <div class="top"><img alt="Corebound" src="${assetUrl('ui/logo.webp')}"><div class="tag">Build · Automate · Survive · Preserve</div></div>
        <div class="bottom"><button class="btn" id="begin">Begin</button><div class="note">First look · Jivagraha · walk, jump and fly around a living world</div></div>
      </div>
      <div id="pause" class="hidden"><div class="card"><h2>Paused</h2><div class="keys">${keys}</div><button class="btn" id="resume">Continue</button></div></div>
      <div id="hud" class="hidden">
        <div id="vitals" class="panel">
          <div class="row"><span class="label">Suit</span><span class="meter" id="power"><i style="width:100%"></i></span></div>
          <div class="row"><span class="label">Time</span><span id="clock">06:00</span></div>
        </div>
        <div id="goals" class="panel"></div>
        <div id="help" class="panel"><div class="keys">${keys}</div></div>
        <div id="stats" class="panel hidden"></div>
        <div id="toast"></div>
      </div>`);
  }

  loading(text: string, progress: number) {
    $('#loading .msg').textContent = text;
    ($('#loading .bar i') as HTMLElement).style.width = `${Math.round(progress * 100)}%`;
  }
  hideLoading() { $('#loading').classList.add('hidden'); }

  showTitle(onBegin: () => void) {
    $('#title').classList.remove('hidden');
    const b = $('#begin') as HTMLButtonElement;
    b.onclick = () => { this.hideTitle(); onBegin(); };
    b.focus();
  }
  hideTitle() { $('#title').classList.add('hidden'); }

  showPause(onResume: () => void) {
    $('#pause').classList.remove('hidden');
    ($('#resume') as HTMLButtonElement).onclick = () => { this.hidePause(); onResume(); };
  }
  hidePause() { $('#pause').classList.add('hidden'); }
  get paused() { return !$('#pause').classList.contains('hidden'); }

  showHud() { $('#hud').classList.remove('hidden'); setTimeout(() => ($('#help').style.opacity = '0'), 25000); }
  toggleHelp() { const h = $('#help'); h.style.opacity = h.style.opacity === '0' ? '1' : '0'; }

  vitals(power: number, clock: string) {
    ($('#power i') as HTMLElement).style.width = `${Math.round(power * 100)}%`;
    $('#clock').textContent = clock;
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

  stats(text: string | null) {
    const s = $('#stats');
    if (text === null) { s.classList.add('hidden'); return; }
    s.classList.remove('hidden');
    s.textContent = text;
  }
}

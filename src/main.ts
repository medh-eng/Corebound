import './ui/style.css';
import { startGame } from './game';
import { wantsTouch } from './ui/touch';

// URL options (for testing): ?log=huxley_01 (preview a memory log) ?skip=1 ?t=0.5 ?view=orbit ?q=low ?shot=1 ?yaw=20 ?pitch=0.3 ?dist=8
const q = new URLSearchParams(location.search);
const num = (k: string) => (q.has(k) ? Number(q.get(k)) : undefined);

// Phones and tablets get on-screen controls and the phone graphics preset (?touch=1 / ?q=phone to try them).
const touch = wantsTouch(q.get('touch'));
if (touch) document.body.classList.add('touch');
startGame({
  quality: q.get('q') === 'low' ? 'low' : q.get('q') === 'high' ? 'high' : q.get('q') === 'phone' || touch ? 'phone' : 'high',
  touch,
  skipTitle: q.get('skip') === '1' || q.get('shot') === '1' && q.get('title') !== '1',
  timeOffset: num('t') ?? 0,
  view: q.get('view') === 'orbit' ? 'orbit' : 'follow',
  shot: q.get('shot') === '1',
  yawDeg: num('yaw') ?? 0,
  pitch: num('pitch'),
  dist: num('dist'),
  near: q.get('near') ?? undefined,
  alt: num('alt'),
  log: q.get('log') ?? undefined,
  fps: q.get('fps') === '1',
}).catch((e) => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;inset:20px;color:#fff;white-space:pre-wrap">Corebound could not start: ${String(e?.message ?? e)}\nThis game needs a browser with WebGL 2.</pre>`);
});

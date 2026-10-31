// Words for the controls. Goals, tips, prompts and SARATHI's lines are written for keyboard and
// mouse; on a phone or tablet the same text is shown with the on-screen button names instead.
// Each pair is [what the keyboard text says, what a touch player should read]. Order matters.
export const PHONE_HELP: string[] = [
  'Turn your phone sideways; use your left thumb\'s joystick to walk.',
  'Push the joystick to the edge to run.',
  'Drag elsewhere to look; hold Scan to scan.',
  'Hold Mine and slide to mine and aim.',
  'Tap Jump to jump; hold Jump for the jetpack.',
  'Aim at a machine; tap Use.',
  'Tap Bag for your backpack; Build and Belt open building tools.',
  'Tap Codex, Planet, O₂, Pick up or Dance for other actions.',
  'While building, tap Place, Turn or Cancel.',
  'Tap ✕ to close panels; tap the gear to pause.',
  'In Chrome, open ⋮ → Add to Home screen (or Install app).',
];

/** One template owns the action words; touch replaces the entire instruction. */
export function machineAction(action: 'pickup' | 'load', items = ''): string {
  return action === 'pickup' ? '<b>X</b> Pick up' : `<b>E</b> Load ${items}`;
}

/** Output counts belong to each item, never to the list as a whole. */
export function machineOutput(items: { name: string; n: number }[]): string {
  return items.filter(({ n }) => n > 0).map(({ name, n }) => {
    const label = name.toLowerCase();
    return `${n} ${label}${n !== 1 && label === 'iron plate' ? 's' : ''}`;
  }).join(', ') + ' ready';
}

export const TOUCH_WORDS: [RegExp, string][] = [
  [/hold the left mouse button/gi, 'hold Mine'],
  [/hold the right mouse button/gi, 'hold Scan'],
  [/Left mouse \(hold\)/g, 'Mine (hold)'],
  [/Right mouse \(hold\)/g, 'Scan (hold)'],
  [/press C, click the drill, then click the smelter/gi, 'tap Belt, then Pick on the drill, then Pick on the smelter'],
  [/click the machine that sends, then the one that receives/gi, 'aim at the machine that sends and tap Pick, then the one that receives'],
  [/<b>X<\/b> pick up\b/gi, '<b>Pick up</b>'],
  [/\bpress E to load\b/gi, 'tap Use to load'],
  [/\(E\)/g, '(Use)'],
  [/\(Tab\)/g, '(Bag)'],
  [/\bpress E\b/gi, 'tap Use'],
  [/\bpress Tab\b/gi, 'tap Bag'],
  [/\bpress B\b/gi, 'tap Build'],
  [/\bpress C\b/gi, 'tap Belt'],
  [/\bpress M\b/gi, 'tap Planet'],
  [/\bpress J\b/gi, 'tap Codex'],
  [/\bpress Q\b/gi, 'tap O₂'],
  [/\bpress G\b/gi, 'tap Dance'],
  [/\bPress it again\b/g, 'Tap it again'],
  [/\bclick\b/gi, 'tap'],
];

/** The text a touch player should see. Leaves keyboard text alone when not on touch. */
export function forTouch(text: string, touch: boolean): string {
  if (!touch) return text;
  let t = text.replace(/<b>E<\/b> ([^·<]+)/g, (_match, action: string) =>
    `Tap <b>Use</b> to ${action[0].toLowerCase()}${action.slice(1)}`);
  for (const [from, to] of TOUCH_WORDS) t = t.replace(from, (m) => (m[0] === m[0].toUpperCase() && to[0] !== '<' && to[0] !== '(' ? to[0].toUpperCase() + to.slice(1) : to));
  return t;
}

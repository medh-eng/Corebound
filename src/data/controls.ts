// Words for the controls. Goals, tips, prompts and SARATHI's lines are written for keyboard and
// mouse; on a phone or tablet the same text is shown with the on-screen button names instead.
// Each pair is [what the keyboard text says, what a touch player should read]. Order matters.
export const TOUCH_WORDS: [RegExp, string][] = [
  [/hold the left mouse button/gi, 'hold Mine'],
  [/hold the right mouse button/gi, 'hold Scan'],
  [/Left mouse \(hold\)/g, 'Mine (hold)'],
  [/Right mouse \(hold\)/g, 'Scan (hold)'],
  [/press C, click the drill, then click the smelter/gi, 'tap Belt, then Pick on the drill, then Pick on the smelter'],
  [/click the machine that sends, then the one that receives/gi, 'aim at the machine that sends and tap Pick, then the one that receives'],
  [/<b>E<\/b>/g, '<b>Use</b>'],
  [/<b>X<\/b>/g, '<b>Pick up</b>'],
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
  let t = text;
  for (const [from, to] of TOUCH_WORDS) t = t.replace(from, (m) => (m[0] === m[0].toUpperCase() && to[0] !== '<' && to[0] !== '(' ? to[0].toUpperCase() + to.slice(1) : to));
  return t;
}

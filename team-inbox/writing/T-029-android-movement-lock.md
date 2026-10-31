# T-029: Android movement recovery

## Delivery note

```ts
export const delivery = {
  task: "T-029: Android movement sometimes stops working, issue #24.",
  result: "Implemented joystick recovery and submitted the changes for Director review.",
  branch: "chatgpt/T-029-android-movement-lock",
  status: "Review. Nothing has been merged.",
  scope: "Touch controls, touch CSS, regression tests, the touch playtest, the task status and this requested delivery note."
};
```

## Changes

```ts
export const changes = {
  releases: "Document-level release and cancellation handlers clear the joystick, pointer ownership, movement vector and visual state.",
  capture: "Lost capture releases controls. Delayed loss events cannot cancel a pointer that has already regained capture.",
  takeover: "A fresh joystick touch replaces the previous pointer, including a reused pointer identifier.",
  lifecycle: "Background, blur, page hide/show, rotation, resizing and panel changes release movement and held actions.",
  actions: "Mine, Scan and Jump release correctly after interruptions. Another held finger cannot prematurely release the same button.",
  gestures: "Touch-action and overscroll guards apply to the touch game surface and controls.",
  desktop: "The new surface CSS applies to touch mode. No keyboard bindings or game content were changed."
};
```

## Investigation

```ts
export const investigation = {
  likely_cause: "Interrupted gestures or capture loss could leave a stored joystick identifier, causing subsequent touches to miss the joystick branch.",
  evidence: "The previous controller lacked capture-loss, background and rotation recovery, and required an empty identifier before starting another joystick touch.",
  caution: "Normal pointer capture prevents a simple thumb slide from automatically transferring ownership to a neighbouring button.",
  confidence: "This remains the leading explanation, not a confirmed diagnosis of the Commander's physical-phone freeze."
};
```

## Verification

```ts
export const verification = {
  baseline: "Before changes, all 167 unit tests and the production build passed.",
  unit_tests: "PASS: 190 tests across 13 files, including 23 touch recovery regression tests.",
  build: "PASS: strict TypeScript checking and the Vite production build.",
  playtest: "PASS: the full extended touch playtest, including a real 60-second held walk.",
  restart: "Movement restarted after outside release, cancellation, capture loss, panel changes, visibility changes, blur, page lifecycle events, resizing, rotation and pointer takeover.",
  existing_checks: "Backpack opening and closing passed. Holding Mine collected four ice. No browser page errors occurred.",
  css: "Computed browser styles confirmed touch-action and overscroll protection on the game surface and controls.",
  environment: "Chromium crashes when polling gamepads on this restricted host, reproduced separately on an empty page.",
  workaround: "The browser run used TOUCH_TEST_NO_GAMEPAD=1, an optional touch-test switch. It changes no game code and does not validate gamepads.",
  simulation: "Visibility, blur and orientation events were injected. Native touch cancellation and actual pointer capture loss were also exercised."
};
```

## Director review and phone retest

```ts
export const review = {
  review: "Review the pull request and retest on the Commander's Android phone before merging.",
  long_walk: "Walk continuously, release outside the starting area, then immediately walk again.",
  two_thumbs: "Use Mine, Jump and Use while walking. Release each thumb in different orders.",
  interruptions: "Switch apps, return, rotate the phone and open or close panels while walking.",
  recovery: "Every new joystick touch should work without opening a menu as a workaround.",
  feedback: "If movement still stops, record the phone model, Chrome version, frame rate, location and touch sequence.",
  limitation: "Emulated Chromium recovery passed. The original device-specific freeze and Android system back gestures still require physical-phone confirmation."
};
```

# Runtime API (motion.js)

One script, no dependencies. `video.html` includes it and calls `defineVideo({...})`. Everything
is evaluated by `window.__seek(t)`: the runtime shows the scenes visible at `t`, applies the
scene transition, the camera and every track, then calls `onFrame(t)`.

## defineVideo

```js
defineVideo({
  width: 1920, height: 1080, fps: 30,     // 1080x1920 for 9:16, 1080x1080 for 1:1
  duration: 28,                            // optional; default = end of the last scene
  scenes: [ /* in order */ ],
  global: { "#logo": [ /* absolute-time keyframes */ ] },
  onFrame(t, video) { /* escape hatch for anything procedural, still a function of t */ },
});
```

## Scenes

```js
{ id: "hook", start: 0, dur: 4, transition: { type: "push", dur: 0.6 }, camera: [...], tracks: {...} }
```

- `id` matches `<section data-scene="hook">`. One section per scene, absolutely positioned over the
  stage by the runtime. Sections carry no `id` attribute: style and select them with
  `[data-scene="hook"]`, not `#hook`. Put scene content inside `<div class="cam">` if the scene uses a camera.
- `start` defaults to the previous scene's end; give `dur` or `end`.
- `transition` describes how THIS scene enters and how the PREVIOUS scene leaves. Both happen in
  the `dur` seconds before this scene's `start`: the previous scene leaves during
  `[start - dur, start]` and this one enters in the same window, so on the grid line the new
  scene is fully in. Plan the outgoing scene's last hold to end `dur` before its end. An optional
  `ease` (any easing name) shapes the window; `fade` is a symmetric cross-fade by default. The
  incoming scene is transparent during the window (push and zoom fade it in), so a static
  backdrop or scrim in the incoming scene still arrives smoothly; `slide` and `wipe` are opaque by
  design. The outgoing scene is fading during the window, so a camera move timed into the cut
  must start before the window to be seen. Types: `cut` (default), `fade`, `push` (incoming rises, outgoing drifts up
  and fades), `zoom` (outgoing flies into the lens, incoming settles from behind: the Z-axis
  push-through), `slide` (whip to the next panel), `wipe` (clip reveal from the left).
- Times inside `tracks` and `camera` are scene-local seconds, so retiming a scene never breaks it.

## Tracks

A track maps a CSS selector (scoped to the scene; `"self"` is the scene itself) to motion.

Keyframe list:
```js
".card": [
  { at: 0.3, opacity: 0, y: 60, scale: 0.96 },
  { at: 1.1, opacity: 1, y: 0, scale: 1, ease: "springSoft" },
]
```
Each prop interpolates from the previous keyframe that defines it to this one, using THIS
keyframe's `ease`. Before the first keyframe a prop holds its first value, after the last it holds
the last. So the first keyframe is the initial state: an element that should start invisible needs
`opacity: 0` at its first `at`.

Stagger tween (one tween per matched element, offset by index):
```js
".h1 .w": { stagger: 0.07, at: 0.3, dur: 0.6, from: { opacity: 0, y: 30, blur: 6 }, to: { opacity: 1, y: 0, blur: 0 }, ease: "outQuint" }
".row":   { stagger: 0.15, keyframes: [ { at: 0, opacity: 0, x: -24 }, { at: 0.5, opacity: 1, x: 0 } ] }
```

### Props

| prop | meaning |
| --- | --- |
| `opacity` | 0 to 1 |
| `x`, `y` | translate in stage pixels |
| `scale`, `sx`, `sy` | scale (uniform, or per axis multiplied with `scale`) |
| `rotate`, `skewX` | degrees |
| `blur` | px, as a `filter: blur()` (use for entrances, costs render time on large elements) |
| `clip` | `[top, right, bottom, left]` percentages, as `clip-path: inset()`; mask reveals |
| `bg`, `color`, `borderColor` | hex colors, interpolated |
| `w`, `h` | width and height in px (progress bars, growing panels) |
| `count` | number written as text, formatted by `data-format` ("0", "0,0", "$0,0", "0.0%", "+0") |
| `typed` | 0 to 1 progress through the element's text (stored in `data-text`); add `data-cursor` for a caret while typing |
| `progress` | sets the CSS variable `--p` on the element, for your own CSS (`width: calc(var(--p) * 100%)`) |
| `--anything` | any CSS variable |
| `target` | on a keyframe: `{ at, target: ".btn", hot: [6, 3], align: [0.5, 0.5] }` resolves to the `x`,`y` that put the element's hotspot on the target's center (or `align` fraction). For cursors. Measured at init, in stage pixels, independent of camera. |

### Easings

`linear`, `inQuad`, `outQuad`, `inOutQuad`, `inCubic`, `outCubic`, `inOutCubic`, `outQuart`,
`outQuint`, `inOutQuint`, `inExpo`, `outExpo`, `inOutExpo`, `outBack`, `spring` (small overshoot),
`springSoft` (no overshoot, UI cards landing). Default is `outQuint`. A keyframe may pass a
function `t => ...` instead.

## Camera

```js
camera: [ { at: 0, scale: 1 }, { at: 3, scale: 1.12, x: 120, y: 40, ease: "inOutCubic" } ]
```
The first camera keyframe gets `x: 0, y: 0, scale: 1` for any prop it does not name, so a prop
that first appears later eases from neutral (not from that later value held since the start).
Element tracks do not get this: their first keyframe is the initial state, so name every prop
you will animate in the first keyframe. Applied to the scene's `.cam` element (or the scene). `x`,`y` are where the camera looks in stage
pixels relative to center; `scale` is the zoom. A keyframe may say `target: ".sel"` instead of
`x`,`y` to look at that element's center. The camera is clamped to the stage by default
(`|x| <= W/2 * (1 - 1/scale)`, same for `y`), so a crop never shows bare canvas past the edge; set
`cameraClamp: false` on the scene to allow it. A hero crop on something near an edge therefore
cannot center it; put the object nearer the middle of the stage instead (see ui-cards.md on
menu bars). The same applies vertically: with a headline above a card, a crop on the card's
lower half leaves the headline cut through at the top edge, so fade the headline out just before
the crop. A control in a side column sits off-center in a crop; that is fine, or lay the card out
with the control in the middle third. Cursors inside `.cam` move with the camera, and `target` coordinates still land
because both are measured in the same space.

## Markup helpers

- `data-words` on a text element wraps each word in `<span class="w">` at init, for staggers.
  Nested elements survive: `<span class="accent">first</span>` inside a `data-words` headline
  keeps its class and gets a `.w` inside it. `data-chars` does the same per character
  (`<span class="c">`).
- `data-swap` on a replacement state ("Copied" next to "Copy prompt", the real name next to the
  anonymous one) excludes it from the copy budget, since both are never on screen together.
- `data-chrome` on furniture (a fake menu bar, a window title, an OS clock) excludes its words
  from the copy budget in `check-copy.mjs`. Copy the viewer is meant to read is never chrome.
- `data-stage` marks the stage element (one per file). Its size is set from `defineVideo`.
- `data-card` marks a product card for the copy checker's per-card word budget.
- `data-format`, `data-text`, `data-cursor`, `data-hot` as described above.

## Export contract

- `window.__videoMeta` = `{ width, height, duration, fps }`
- `window.__seek(t)` renders the frame at `t` seconds and returns the clamped time
- `window.__ready` resolves when fonts and images have loaded
- `?__render=1` hides the player and leaves the stage at exact pixel size
- `window.Motion.EASE`, `window.Motion.video` for debugging in the console

## Player

Without `?__render=1` the runtime wraps the stage in a letterboxed player: Space plays and pauses,
Left and Right step one frame (Shift for one second), Home rewinds, digits 1 to 9 jump to scenes,
the scrubber seeks. Run `node preview.mjs` and open `http://localhost:4800/video.html`; opening the
file directly also works in Chrome.

## Track collisions

Two tracks that write the same prop on the same element do not merge: the later one wins at
every time, including before its first keyframe, so a late "dim rows 2 and 3" track with
`opacity: 1` at 3.5s makes those rows visible from 0s and cancels their entrance. The runtime
warns in the console (`two tracks write "opacity" on ...`). Fold the later change into the same
track as extra keyframes.

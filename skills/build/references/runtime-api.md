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
  stage by the runtime. Put scene content inside `<div class="cam">` if the scene uses a camera.
- `start` defaults to the previous scene's end; give `dur` or `end`.
- `transition` describes how THIS scene enters and how the PREVIOUS scene leaves, over `dur`
  seconds before `start`. Types: `cut` (default), `fade`, `push` (incoming rises, outgoing drifts up
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
Applied to the scene's `.cam` element (or the scene). `x`,`y` are where the camera looks in stage
pixels relative to center; `scale` is the zoom. Cursors inside `.cam` move with the camera, and
`target` coordinates still land because both are measured in the same space.

## Markup helpers

- `data-words` on a text element wraps each word in `<span class="w">` at init, for staggers.
  `data-chars` does the same per character (`<span class="c">`).
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

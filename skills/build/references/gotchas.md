# Gotchas

- **Every frame blank.** The scenes are `display:none` and something cleared the inline style, or
  `defineVideo` ran before the DOM existed and found no `[data-scene]` elements. Check the page
  console: the runtime warns `missing scene element` and `no elements for track`. The renderer
  prints page errors as `[page error]`.
- **Fonts fall back in the render but not in the preview.** The render captures at `__ready`,
  which waits for `document.fonts.ready`; a font that is only requested by a selector no element
  matches at load time is not loaded. Reference every face in the stylesheet `<link>` with its
  weights, and keep one `<link>` per family group. Self-hosted fonts: `@font-face` with a relative
  `url()`, which works over `file://`.
- **Images missing in the render.** Relative paths resolve against `video.html`, which is served
  from the video folder both by `preview.mjs` and by `file://`. Keep assets inside the folder.
  Absolute `/public/...` paths from the app repo do not resolve.
- **A card entrance with `blur` renders slowly.** `filter: blur()` on a 900px card costs 20 to
  40ms a frame. Use blur on text only, or on small elements.
- **Transforms fight.** The runtime composes `x`, `y`, `rotate`, `scale` into one `transform` per
  element. Do not set `transform` in CSS on an element that also has a track; put the static
  transform on a wrapper. `translate(-50%, -50%)` centering plus a track is the usual collision:
  center with flex on the parent instead.
- **Camera and transition on the same element.** Transitions transform the scene section; the
  camera transforms `.cam` inside it. Scenes with a camera need the `.cam` wrapper or the two
  transforms overwrite each other.
- **A hero crop shows bare canvas, or refuses to center the object.** The camera is clamped
  to the stage. Objects near an edge cannot be centered at any zoom; move the object toward the
  middle (a desktop slab for menu bar strips), or accept the off-center crop.
- **`target` finds the wrong element.** Targets resolve inside the cursor's own scene first, then
  the stage. Use a selector unique within the scene.
- **Stagger over a nested selector.** `".h1 .w"` matches the words of every `.h1` in the scene in
  document order; scope with an id when a scene has two headlines.
- **Renders are capped by screenshot time, not encoding.** About 25 to 35ms per 1080p frame in
  Chrome; `--workers 3` (default) runs three pages. More workers than cores slows it down.
  `--scale 2` quadruples pixels and roughly triples time.
- **Opening `video.html` from the Finder shows a dark page and nothing else.** Safari blocks the
  Google Fonts request and some file URLs; open in Chrome, or `node preview.mjs`.
- **The pane or an embedded browser shows the player but playback stalls.** Hidden tabs throttle
  `requestAnimationFrame`; the scrubber and frame stepping still work. Judge motion from a rendered
  clip, not from a throttled tab.
- **9:16 looks squashed.** You changed `width`/`height` without re-laying out. Each scene needs
  its own vertical layout; see the grammar's "Aspect ratios".
- **An element is visible before its entrance, or an entrance is ignored.** Two tracks write the
  same prop on that element; the later one wins at every time. Check the console for
  `two tracks write`, and merge them into one keyframe list.
- **The camera starts off-center.** You named `x`/`y` only in a later keyframe of an element
  track (camera tracks are defaulted for you). Put the starting values in the first keyframe.

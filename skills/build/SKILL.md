---
name: build
description: The engine behind the motion-video plugin. Turns a brief and storyboard into a Claude-Motion-style launch video - a self-contained video.html animated as a pure function of time, previewed in the browser and rendered to MP4 with the bundled headless-Chromium renderer. Use after lucky or grill has produced brief.md and storyboard.md, or whenever a user already has a brief, script or storyboard for a SaaS launch video, product demo, feature announcement or explainer and wants it built, previewed and rendered. Also the reference for the runtime API (scenes, tracks, camera, cursor, transitions) when editing any video.html made by this plugin.
---

# Build: storyboard to MP4

You are the director and the animator. The runtime handles time; you handle taste. The output is one
`video.html` that plays in any browser and renders to MP4 frame by frame, so what you see in the
preview is exactly what ships.

## Inputs

- `brief.md`: product, audience, destination, aspect, length, the one idea, brand tokens, assets,
  voice rules, what must not appear. Written by `lucky` or `grill` (templates in `assets/`).
- `storyboard.md`: the scene table (name, seconds, on-screen words, visual, motion, transition).
- Assets in `assets/`: logo, screenshots, fonts if self-hosted, optional music.

If either file is missing, do not guess the product: run `lucky` (no questions) or `grill`
(interview). If the user handed you a script or shot list, turn it into `storyboard.md` first and
show it to them in one message before building.

## The pipeline

1. **Scaffold** the video folder once: `node <this skill>/scripts/scaffold.mjs <target-dir>`
   (default `motion-video/` inside the user's repo). It copies `motion.js`, `render.mjs`,
   `check-copy.mjs`, `preview.mjs`, `package.json` and a starter `video.html`, then runs
   `npm install`. Playwright reuses an installed Google Chrome; otherwise run
   `npx playwright install chromium` once. ffmpeg comes from the system or `ffmpeg-static`.
2. **Read `references/motion-grammar.md`** before writing a scene. It is the taste. Then read
   `references/runtime-api.md` for the exact authoring API.
3. **Write `video.html`** scene by scene from the storyboard. Markup in HTML and CSS (fonts, layout,
   the product cards), motion in the `defineVideo({...})` block. Keep the starter's structure:
   brand tokens in `:root`, one `<section data-scene="id">` per storyboard row, scene-local times.
   Build product UI as HTML cards (`references/ui-cards.md`), not full-bleed screenshots.
4. **Check copy**: `node check-copy.mjs video.html`. It fails on em dashes and on too many words
   per second, and warns on filler words, oversized cards and non-deterministic code. Fix, do not
   suppress.
5. **Look at it**: `node render.mjs --sheet --out out/sheet.png` gives a 12-frame contact sheet in
   under ten seconds. Read the PNG. Then render stills at the moments that matter
   (`--still 4.2 --out out/f.png`): the end of each entrance, every click, the CTA. Use
   `references/review.md` as the checklist. Fix, re-sheet, repeat. Expect two or three rounds.
6. **Checkpoint with the user** when they are present: a sheet plus one short clip of the first
   product scene (`node render.mjs --from 4 --to 9 --out out/scene-check.mp4`). Approval of a still
   is not approval of rhythm; send the clip.
7. **Render**: `node render.mjs --out out/<name>.mp4` (1080p, CRF 16, about one second of wall time
   per second of video on a laptop). Add `--audio assets/music.mp3` to mux a soundtrack,
   `--scale 2` for a supersampled master. For 9:16 or 1:1, change `width`/`height` in
   `defineVideo` and re-lay out the scenes; see `references/motion-grammar.md` "Aspect ratios".
8. **Deliver**: the MP4 path, a poster still, and three lines on what you assumed or left out.
   Open the MP4 for the user when you can (`open out/<name>.mp4` on macOS). Commit the folder.

## Non-negotiables

- The video is a pure function of time. No `setTimeout`, `requestAnimationFrame` state, CSS
  `@keyframes`, `Date.now()` or `Math.random()` anywhere in `video.html`. Otherwise the preview
  and the render disagree and the user sees a different film than you did.
- No em dashes on screen. No price, credit or plan wording unless the brief asks for it. No
  "Introducing". No fictional company or person names from TV shows; use the product's own sample
  data or the brief's names.
- Every click targets an element by selector (`{ target: ".btn" }`), never hand-typed pixels.
- Word budget: about four words per second of runtime, 15 to 30 words on any product card.
- Never say the film is smooth or in sync unless you watched the clip or the sheet shows it.

## References

- `references/runtime-api.md`: `defineVideo`, scenes, tracks, props, easings, transitions, camera,
  cursor targets, words and chars, counters, typed text, global tracks, the export contract.
- `references/motion-grammar.md`: scene grammar, timing grid, easing discipline, the Z-axis
  camera, type scale, the cardstock look, copy rules, aspect ratios, music.
- `references/ui-cards.md`: recreating product screens as HTML, screenshots as reference,
  Mac and mobile chrome, sample universes, logos.
- `references/review.md`: the contact-sheet review checklist and the fixes for common failures.
- `references/gotchas.md`: fonts, file URLs, blank frames, transforms, performance.

## Scripts and assets

- `scripts/scaffold.mjs <dir>`: copies the project template and installs dependencies.
- `assets/project-template/`: `motion.js` (runtime), `render.mjs`, `check-copy.mjs`,
  `preview.mjs`, `video.html` (worked starter), `package.json`.
- `assets/brief-template.md`, `assets/storyboard-template.md`.

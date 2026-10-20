---
name: edit
description: Change one thing in an existing motion video (a video.html made by this plugin) and re-render only what changed - a word, a number, a color, the timing of a scene, a scene's length, the aspect ratio, the music, or the order of scenes. Use whenever the user reacts to a cut with a correction such as "change 41% to 44%", "slow down scene two", "the headline should say X", "make the close longer", "swap the logo", "cut the third proof", "make a vertical version", "add the music", or "it feels fast". This is the Claude Motion way of editing - one value changes, the rest stays exactly as it was - so do not rebuild the video from scratch for a correction.
---

# Edit: change one thing, keep the rest

The video is code, so an edit is a diff. The user asked for one change; make that change, prove it
with a still or a short clip, and leave every other frame identical. Rebuilding from the brief
for a correction throws away the choices they already accepted.

## Steps

1. Find the video folder (`motion-video/` by default, or the folder holding `video.html`). Read
   `storyboard.md` to map the user's words ("scene two", "the pricing card", "the close") to a
   scene id and the elements inside it.
2. Classify the change and make the smallest edit:
   - **Words**: edit the text in the scene markup. Re-run `node check-copy.mjs video.html`; a
     longer headline may need a longer hold (its words-per-second budget is the reason).
   - **A number or a color**: edit the keyframe value or the `:root` token. Nothing else moves.
   - **Timing inside a scene** ("slow down the count", "the cursor is too fast"): change the
     keyframe `at` values in that scene only. Scene-local times mean the other scenes are untouched.
   - **A scene's length**: change its `dur`; later scenes shift automatically. Check the total
     against the destination's limit and the storyboard, and update the storyboard row.
   - **Order or removal of scenes**: reorder or delete the entry in `scenes` and the matching
     `<section>`. Check that the transition into the scene that now follows still makes sense.
   - **Aspect ratio**: this is the one edit that is a re-layout, not a value change. Read the
     build skill's `references/motion-grammar.md` "Aspect ratios" and keep copy and timing.
   - **Music**: add or swap the file in `assets/`, then render with `--audio`. If the user gives a
     BPM, snap scene starts to the beat grid and say which starts moved.
   - **"It feels fast / jerky / busy"**: do not guess at random. Lengthen holds first (the usual
     cause), then slow entrances to 0.7 to 0.8s, then remove one effect. One lever per pass.
3. Prove it: render a still at the changed moment (`node render.mjs --still <t> --out out/edit.png`)
   or a clip of the scene (`--from --to`). Read it. For timing changes send the clip, not a still.
4. Re-render the full MP4 only when the user has accepted the change, then update
   `storyboard.md` so it still describes the film.
5. Reply with: what changed (one line), the still or clip path, and the new total duration if it
   moved. Keep the "Assumptions made" list in `brief.md` current if the change resolves one.

## Finding things fast

- Scene ids are in `defineVideo({ scenes: [...] })` and on `<section data-scene="...">`.
- Headlines use `data-words`; a word-level color change targets `.w:nth-child(n)`.
- Clicks use `{ target: ".selector" }`; moving a button needs no cursor change.
- Counters: the `count` keyframes and `data-format`. Typed text: `data-text`.
- Tokens: `:root` in the `<style>` block. Fonts: the Google Fonts `<link>` plus `--font-*`.

## When this is not an edit

If the user wants a different idea, a different audience, or says the whole thing misses, that is
a new brief: offer `grill` (interview) or `lucky` (automatic) rather than patching twenty values.

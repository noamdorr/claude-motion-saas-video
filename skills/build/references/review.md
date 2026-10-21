# Reviewing a cut before anyone else sees it

You cannot watch video, but you can read frames. Three passes, each under a minute.

## Pass 1: the contact sheet

`node render.mjs --sheet --out out/sheet.png` (12 frames, evenly spaced; `--n 24` for a longer
video). Read the PNG and ask, frame by frame:

- Is there any frame with nothing on it, or only half a headline? Entrances too slow, or a scene
  with a gap before its content starts.
- Does every frame show one idea? Two headlines visible at once means an exit is missing.
- Is the product visible in at least a third of the frames? If not, the proof scenes are too short.
- Are the headlines readable at this size (each tile is a phone screen)? Below 22px at 1080p fails.
- Do the frames look like one family: same canvas, same card style, same type? A scene with a
  different gray or radius was built from a different reference.

## Pass 2: the moments

Render stills at the exact moments that carry the film and read each:

- the last word of each headline landing (`at` + `dur` + stagger times word count)
- each click: the cursor tip must sit on the control; the control must react on the next frame
- each counter's final value and each status change
- the frame just before and just after every transition (nothing should pop in late or linger)
- the close: logo, promise, URL, all legible, nothing still moving at the final frame

`node render.mjs --still 11.4 --out out/m1.png`, one per moment. Fix, re-render that still only.

## Pass 3: the clip

Render one proof scene as a short MP4 (`--from 8 --to 14`) and the copy check. When the user is
present, this is the checkpoint: send the clip, not a still, because an approved still says nothing
about rhythm. When they are not, open the clip yourself if the environment can play video, and in
the handoff say plainly that stills and the sheet were checked and the motion was not watched.

## Common failures and the fix

| what the sheet shows | cause | fix |
| --- | --- | --- |
| an empty frame at a scene start | first keyframe `at` too late, or transition shorter than the entrance | start the headline at 0.1s; let the transition overlap |
| text visibly blurred mid-frame | `blur` entrance too long on a large element | `blur: 4`, 0.4s, or drop blur on headlines over 80px |
| the cursor is near, not on, the button | hand-typed x/y, or the card moved | use `target: ".btn"`; keep the cursor inside the `.cam` of the same scene |
| the card looks like a screenshot | full-bleed, pure white canvas, no shadow | off-white canvas, 920 to 1100px card, cardstock shadow |
| three headlines in a row feel the same | same entrance for every scene | vary the camera, not the entrance; one signature move |
| the close feels abrupt | hold under 2s or something still animating | end all tracks 2s before the end |
| the render and the preview differ | non-deterministic code | remove `setTimeout`, rAF state, CSS animations; see gotchas |

## Pass 4: the jerk check

"Smooth" is checkable. `node render.mjs --jumps out/video.mp4` lists every frame whose scene-change
score is above 0.06 (ffmpeg's measure of how much the picture changed from the previous frame).
Hard cuts appear there; overlapping transitions usually do not, and a tiny intended pop (a
badge, an icon) is too small to register. Anything else is a pop, an element landing late, or a
transition that does not overlap; find its time, render the still on both sides, and fix the
keyframe. Report the result as "no jumps" or "N jumps, all at hard cuts", or name the stray one.

## What "done" looks like

- `check-copy.mjs` clean (warnings read and either fixed or defended in the handoff)
- `--jumps` shows only the intended cuts
- sheet with no empty or doubled frames, product visible, one family of style
- every click still verified
- the final MP4 plays in QuickTime or Chrome, duration matches the storyboard, file under 10MB for a
  30s 1080p clip at CRF 16
- the folder committed with `brief.md`, `storyboard.md`, `video.html`, assets, and `out/*.mp4`
  listed in `.gitignore` or not, as the repo prefers

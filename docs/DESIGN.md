# Design notes: the motion-video plugin

Written 2026-10-21 (overnight build). Read this before changing any skill.

## What Claude Motion is, and what this plugin is

Claude Motion (beta, launched 2026-10-08, Team and Enterprise plans) turns a prompt and attached
files into a short animation built as code inside an artifact, editable one word or number at a
time, exported as MP4. It uses no video model: text, charts, shapes and images only, no footage,
no people, no audio. The community has converged on the same shape for exporting Claude Design and
artifact animations: an animation that is a pure function of time, exposing `window.__videoMeta`
and `window.__seek(t)`, captured frame by frame in headless Chromium and encoded with ffmpeg.

This plugin gives anyone running Claude Code that workflow for SaaS launch videos and quick demos,
without needing the Team plan or Remotion:

- one self-contained `video.html` (HTML, CSS and a 400-line runtime, no build step)
- a scrubbable preview in any browser
- deterministic MP4 export (bundled `render.mjs`, Node only)
- the same `__seek` contract, so the file also works with community exporters and can be pasted
  into claude.ai as an artifact

The name "Claude Motion SaaS video" is the search term people use; the plugin and skill names
avoid the word "claude" because Anthropic's skills guide reserves it for skill names.

## The two front doors

- `lucky` ("I feel lucky"): zero questions. Gathers the product, brand, screens and voice from the
  repo and the live site, writes the brief with its assumptions listed, builds, renders, delivers.
  The user corrects afterwards with `edit`.
- `grill`: an interview in short rounds. Audience, destination, length, the one idea, taste capture
  from reference videos, assets, then storyboard approval and a scene-one checkpoint before the
  full build.

Both end in the same place: `brief.md` and `storyboard.md` in the video folder, then `build`.

## The quality bar (why the output should not look like "animated slides")

Claude Motion's early reviews call its output beginner-level: animated slides, no keyframes, text
that moves too fast. The grammar in `skills/build/references/motion-grammar.md` exists to avoid
exactly that. The levers, in order of impact:

1. Few words. A 28-second reference film the author approved carries 117 words. Product cards show
   the idea of a screen in 15 to 30 words, never the real screen's wording.
2. Real product, shown as an object in space: cardstock with soft shadow over an off-white canvas,
   never a full-bleed screenshot.
3. One timing grid. Scene starts on a 0.5s grid, entrances ease out over 0.5 to 0.8s, exits are
   faster than entrances, holds long enough to read at three words per second.
4. Z-axis camera. Push in on the thing that matters, pull out to reveal. This is what separates a
   film from a slideshow.
5. One signature move per video, not five.

## Files

```
.claude-plugin/plugin.json, marketplace.json   plugin and self-hosted marketplace manifests
skills/build/      the engine: SKILL.md, references/, scripts/scaffold.mjs + selftest.mjs, assets/project-template/
skills/lucky/      autonomous mode
skills/grill/      interview mode
skills/edit/       change one thing in an existing video
examples/          the two videos built during the first night, with their briefs and storyboards
docs/              this file, the morning handoff, eval notes
```

The project template is copied into the user's repo (`motion-video/` by default) so renders keep
working after the plugin updates and the video can be committed like any other source.

## Test loop

`evals/` holds the eval prompts (`evals.json`), the programmatic grader (`grade.mjs`: MP4 present,
duration, resolution, no em dash, words per second, forbidden words, determinism, the seek contract,
brief and storyboard present) and a trigger-eval query set for description tuning. The workspace
`../claude-motion-saas-video-workspace/iteration-N/` follows the skill-creator layout; each
iteration re-runs both productions from scratch with the current skill and the agents' own
"skill feedback" sections drive the next edit. `skills/build/scripts/selftest.mjs <video-folder>`
is the runtime regression check (scenes render, camera finite, transitions overlap).

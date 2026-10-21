# Claude Motion SaaS Video Skill

Launch videos and quick product demos in the Claude Motion style, from Claude Code, for any SaaS.
Code-driven animation, no video model, no footage: text, your real screens, shapes and your brand,
animated as a pure function of time, previewed in a browser and rendered to MP4 on your machine.

Two ways in:

- `/motion-video:lucky` asks nothing. It reads your repo and your site, finds the brand, the
  screens, the sample data and the voice, writes the brief with its assumptions listed, builds and
  renders. You correct afterwards.
- `/motion-video:grill` interviews you in four short rounds, including the two or three videos you
  love and why, so the cut speaks your taste. You approve a storyboard and a scene-one clip before
  the full build.

Then `/motion-video:edit` changes one word, one number, one timing, or one scene, and the rest stays
exactly as it was. That is the Claude Motion idea: the video is code, so a correction is a diff.

> Unofficial. Claude Motion is Anthropic's beta feature on Team and Enterprise plans. This plugin
> gives Claude Code users the same workflow and an MP4 export, built on the same "seekable
> animation" contract the community exporters use, with no plan requirement and no Remotion setup.

## Example output

Two videos were built on the first night with this plugin, one through each mode:

| product | mode | video |
| --- | --- | --- |
| Reechee, the new lead-first app (web) | grill | `examples/reechee/out/reechee-launch.mp4` (25s) |
| QuotaCanary for Mac (menu bar app) | lucky | `examples/quotacanary/out/quotacanary-mac-launch.mp4` (25.5s) |

Each example folder holds its `brief.md`, `storyboard.md` and `video.html` (and, for the grill one,
the interview transcript), so you can read how a brief turns into a storyboard and scenes.

## Install

```bash
/plugin marketplace add noamdorr/claude-motion-saas-video
/plugin install motion-video@claude-motion-saas-video
```

Prerequisites: Node 18+. Google Chrome if you have it (the renderer reuses it); otherwise the
first render runs `npx playwright install chromium` once (about 150MB). ffmpeg from your system
(`brew install ffmpeg`) or the bundled `ffmpeg-static` package.

Other agents (Codex, Cursor, Aider): clone the repo and point the agent at
`skills/lucky/SKILL.md` or `skills/grill/SKILL.md`. Everything is Markdown and Node scripts.

## How a session looks

```
You:    make a 25 second launch video for the new app, for LinkedIn
Claude: Lucky mode: no questions, I will gather everything from the repo and the site.
        Say "grill me" any time for the guided version.
        ... reads README, PRODUCT.md, globals.css, public/logo.svg, the homepage hero ...
        ... screenshots three routes, writes motion-video/brief.md with 6 assumptions ...
        ... writes the storyboard (5 scenes, 96 words), builds video.html ...
        ... contact sheet, two fix rounds, renders out/launch.mp4 (25.0s, 1920x1080) ...
        Done: motion-video/out/launch.mp4. I assumed: LinkedIn with sound off, the hero line as
        the hook, Bricolage Grotesque for headlines. Say "edit" with any change.
```

A first cut takes ten to twenty minutes of Claude time in lucky mode. Grill adds the interview and
two approvals.

## What is inside

```
skills/
  lucky/    zero-question mode: SKILL.md + references/gathering.md (where to look in a repo)
  grill/    interview mode: SKILL.md + references/interview.md (question bank, taste capture)
  build/    the engine: SKILL.md, references/ (runtime API, motion grammar, UI cards, review,
            gotchas), scripts/scaffold.mjs, assets/project-template/
  edit/     change one thing, re-render only that
examples/   the two first-night videos with their briefs and storyboards
docs/       design notes and the build log
```

The project template that lands in your repo (`motion-video/` by default):

```
motion-video/
  video.html      the whole film: HTML, CSS, and a defineVideo({...}) block
  motion.js       the runtime (400 lines, no dependencies): scenes, tracks, camera, cursor targets
  render.mjs      MP4, stills, contact sheets and a jerk check via headless Chromium + ffmpeg
  check-copy.mjs  fails on em dashes and over-budget copy, warns on filler and non-determinism
  preview.mjs     local server for the scrubbable player
  brief.md, storyboard.md, assets/, out/
```

The file exposes `window.__videoMeta` and `window.__seek(t)`, the contract shared with community
Claude Design and artifact exporters, so other tools can render it too, and it can be pasted into
claude.ai as an artifact.

## The quality bar

Early Claude Motion reviews call its output animated slides. The build skill's motion grammar is
written against that: few words (a 28-second reference film carries 117), the product shown as
cardstock in space rather than a full-bleed screenshot, one timing grid, a camera that moves on the
Z axis, one signature move per film. Read `skills/build/references/motion-grammar.md`; it is the
part worth forking.

## Related

The author's earlier skill, [saas-product-demo-video](https://github.com/noamdorr/saas-product-demo-video),
does the same job in Remotion with beat-synced cuts from a soundtrack. Use that one when you want
a React codebase and music-locked edits; use this one when you want one HTML file, no build
step, and the Claude Motion editing loop.

## License

MIT. Built by [Noam Dorr](https://github.com/noamdorr), who also builds
[Reechee](https://reechee.io).

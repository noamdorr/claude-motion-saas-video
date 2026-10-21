# Morning handoff, 2026-10-21

Built overnight while you slept. Everything is in a private repo; nothing public changed except a
draft PR on the old skill that you merge or not.

## Watch these first (2 minutes)

- `examples/quotacanary/out/quotacanary-mac-launch.mp4` (25.5s): QuotaCanary for Mac, made by
  `lucky` with zero questions in 25 unattended minutes.
- `examples/reechee/out/reechee-launch.mp4` (25.0s): the new Reechee app, made by `grill`,
  with my stand-in answers for your four interview rounds (from your written feedback on earlier
  films and the D demo script). The transcript is `examples/reechee/interview-transcript.md`.

Nobody has watched either play. They were judged from contact sheets, stills at every click and
transition, and an ffmpeg jerk measure (zero abrupt frames in both). Your eye on rhythm is the
missing test.

## What exists

- **Repo** `github.com/noamdorr/claude-motion-saas-video` (private), local `~/claude-motion-saas-video`.
  Plugin `motion-video` with four skills: `lucky`, `grill`, `build` (the engine), `edit`.
- **Install** for yourself: `/plugin marketplace add noamdorr/claude-motion-saas-video` then
  `/plugin install motion-video@claude-motion-saas-video`. The marketplace manifest is in the repo.
- **What a video is**: one `video.html` (HTML + CSS + a 450-line runtime, no build step), animated
  as a pure function of time, scrubbable in a browser, rendered to MP4 by `render.mjs` through your
  installed Chrome and ffmpeg. It exposes the same `window.__seek(t)` contract the community
  Claude Design exporters use, and `bundle.mjs` makes a one-file version that pastes into claude.ai.
- **Claude Motion itself** (researched first): Anthropic's beta from 2026-10-08, Team and Enterprise
  only, code-driven animation, no video model, MP4 export, no audio. Your account has no Motion
  artifact type, so the plugin reproduces the workflow rather than calling the feature.
- **Design notes**: `docs/DESIGN.md`. **Taste rules**: `skills/build/references/motion-grammar.md`
  (your 117-words-per-28s number, no price or credit copy, even grid, cardstock UI, Z-axis camera,
  one signature move; this is the part worth reading).

## How it was tested

Two full productions per iteration, each run by a fresh Opus agent that only had the skill, plus a
no-skill baseline on QuotaCanary (it reached for Remotion and your June music; its film is in the
workspace too). Each agent wrote a "skill feedback" list of what was unclear or wrong; those lists
drove the fixes between iterations.

| iteration | runs | result |
| --- | --- | --- |
| 1 | lucky QuotaCanary, grill Reechee, baseline | both films 13/13 on the programmatic grader; 11 + 16 feedback items; two real runtime bugs (double-exposed transitions, camera props held from the first keyframe) |
| 2 | same prompts, fixed skill | both 13/13; both agents independently found a NaN bug in camera targets (fixed, covered by `selftest.mjs`); the menu bar guidance from iteration 1 visibly worked |

Workspace: `~/claude-motion-saas-video-workspace/iteration-2/` (the skill-creator layout; a static
review page is at `~/claude-motion-saas-video-workspace/review.html` if it generated, otherwise
read `benchmark.md` there). Programmatic grader: `evals/grade.mjs`. The baseline lacks only the
source artifacts the skill produces (brief, storyboard, editable html); its film is decent, which
is the honest comparison: the skill's edge is taste and consistency, not that Claude cannot make a
video without it.

## Decisions I made that you may veto

1. Names: plugin `motion-video`, skills `lucky` / `grill` / `build` / `edit`; the word "claude" is
   reserved for skill names in Anthropic's guide, so the SEO term lives in the repo name and README.
2. No Remotion, no Python, no music by default. Music is an `--audio` mux with the BPM supplied by
   the user; beat detection did not make v1.
3. `lucky` skips the human checkpoint; the delivered film is the checkpoint. `grill` keeps two gates.
4. Commits in your product repos: each run committed only its `motion-video/` folder on a branch,
   never pushed. Branches: `toppd` has `motion-video/lucky-mac-launch` and
   `video/quotacanary-mac-lucky-v2`; `Reechee` has `motion-video/ree-d-app-launch-film` and
   `motion-video-d-launch-v2`. Both repos are back on their own branches. `toppd/baseline-video/`
   (untracked, from the no-skill run) and the leftover `motion-video/node_modules` folders can go.
5. The Reechee film uses Bricolage Grotesque because my stand-in answer said so; the live app uses
   Schibsted Grotesk. The grill agent flagged it as the skill now tells it to. One-token swap.

## Not done

- Nobody watched the films. Open them.
- Description optimization (skill-creator's `run_loop.py` with `evals/trigger-eval.json`) was not
  run; it needs `claude -p` and about 20 minutes. Worth doing before going public.
- The repo is private. The draft PR on the old skill
  (`noamdorr/saas-product-demo-video#1`) links to it, so merge only after it goes public.
- No 9:16 cut of either film; `edit` knows how, nobody asked.
- Reddit launch post: not drafted. The README has the pitch; `noams-voice` can turn it into a post.

## If you like it: next 2 minutes

Say "ship it" and I will: make the repo public, merge the draft PR, run the description tuner, and
draft the Reddit post for your approval. If you want changes first, say what in plain words; the
`edit` skill exists for exactly that.

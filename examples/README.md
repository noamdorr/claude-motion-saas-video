# Examples

Two films from the plugin's second test iteration (2026-10-21), one through each mode. Each folder is a
complete video folder: `brief.md`, `storyboard.md`, `video.html`, `assets/`, its own copy of the runtime
and scripts, and the rendered MP4, poster and contact sheet under `out/`.

| folder | product | mode | film |
| --- | --- | --- | --- |
| `quotacanary/` | QuotaCanary for Mac, a menu bar app | lucky (zero questions, 25 minutes unattended), then re-cut on the June launch track at 117.5 BPM | `out/quotacanary-mac-launch.mp4`, 26.1s |
| `reechee/` | Reechee, the new lead-first web app | grill (four-round interview; `interview-transcript.md`), then re-cut on April's track at 120 BPM | `out/reechee-launch.mp4`, 25.0s |

Each `assets/beats.json` is the track's beat grid in track time; the `Music` line in each
`storyboard.md` gives the audio start offset and which hit lands where. To preview one: `cd examples/reechee && npm install && node preview.mjs`, then open
`http://localhost:4800/video.html`. To re-render: `node render.mjs --out out/reechee-launch.mp4`.

Each folder's `motion.js` is the copy it was built with, so the film renders the same way after the
plugin's runtime moves on. The screenshots used as fidelity references are not included; every
name, logo and portrait in the films comes from the products' own sample universes.

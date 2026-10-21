# Reddit launch post, staged for Noam's pick

Target: r/ClaudeAI (the "Claude Motion" keyword lives there). r/SaaS as a second post a few days later
with the product-video angle instead of the Claude angle. Nothing posted; these are drafts.

Facts checked: Claude Motion is a Team and Enterprise beta since 2026-10-08. The old Remotion skill
has about 60 stars and still sends people to reechee.io. The two example films are in the repo.

---

## Option A, the most him (short, confession in the P.P.S.)

**Title:** Claude Motion is Team/Enterprise only, so I made a Claude Code version. Two modes: "I feel lucky" and "grill me".

Hey r/ClaudeAI,

I wanted to try Claude Motion for a product launch video and hit the wall most of us hit: it is on Team and Enterprise only. So I built the same workflow as a Claude Code plugin instead.

What it does: one `video.html` (HTML, CSS and a small runtime, no Remotion, no Python), animated as a pure function of time, so it scrubs in a browser and renders to MP4 with headless Chrome plus ffmpeg. The "lucky" mode asks nothing, it reads your repo and your site for the brand, the screens and the copy, and hands you a 25-second film. The "grill" mode interviews you in four short rounds first (including the two or three videos you love, so the cut speaks your taste). Then "edit" changes one word, number or timing and the rest stays, which is the whole Claude Motion idea anyway.

Two films it made, one for a Mac menu bar app and one for my own SaaS, are in the repo with their briefs and storyboards: github.com/noamdorr/claude-motion-saas-video

Would love to hear what breaks when you run it on your product (the Mac app one needed a few rounds, menu bars are annoying to film).

P.S. Before anyone says "that is just Playwright screenshots stitched with ffmpeg", it is. The trick is the 450 lines that make the animation seekable so every frame is deterministic, and the motion grammar file that stops it from looking like animated slides (the thing people complain about with Motion itself). Also, full disclosure, I do not have Motion access myself; this is built from Anthropic's published description and the export contract the community reverse-engineered, so if you do have Motion, tell me where it diverges.

P.P.S. To be honest, my earlier Remotion skill for the same job still brings people to my product's site, so yes, I am hoping this one does too. It also ran overnight while I slept, which is a sentence I did not expect to write this year.

---

## Option B, more self-deprecating (the overnight angle up front)

**Title:** I went to bed, Claude Code built a "Claude Motion for Claude Code" plugin, tested it on two products and left me a handoff. Here it is.

Hey r/ClaudeAI,

Claude Motion is Team and Enterprise only, and I am on Max. So before bed I asked Claude Code to build the same thing as a plugin, test it on two of my products while I slept, and leave me a report. It did (two iterations, a no-skill baseline for comparison, and a list of its own bugs it found by running itself, which is the part that got me).

The plugin: one HTML file per video, animated as a pure function of time, previewed in any browser, rendered to MP4 locally. "lucky" asks zero questions and reads everything from your repo. "grill" interviews you first and captures your taste from reference videos. "edit" changes one thing, the rest stays.

Repo with the two example films, briefs and storyboards: github.com/noamdorr/claude-motion-saas-video

If you try it on your own product I would genuinely like to see the result, good or bad.

P.S. Yes, it is Playwright plus ffmpeg with a 450-line runtime in between. The runtime is the whole point.

P.P.S. My older Remotion skill for product videos sends a steady trickle of people to my SaaS, so I will not pretend this one is pure altruism.

---

## Option C, shortest (for the crowd that skims)

**Title:** Claude Motion style launch videos from Claude Code, no Team plan needed (plugin, MIT)

Hey r/ClaudeAI,

Claude Motion is Team/Enterprise only, so I built the same workflow as a Claude Code plugin: one seekable `video.html`, MP4 out via headless Chrome and ffmpeg, a zero-question mode and an interview mode, and an edit skill that changes one value while the rest stays.

Two example films, with the briefs and storyboards that produced them: github.com/noamdorr/claude-motion-saas-video

Tell me what it gets wrong on your product.

P.S. It is Playwright and ffmpeg underneath, the 450 lines in between are the part worth reading.

---

Notes for Noam: A is my pick. The "which is a sentence I did not expect to write this year" line in A's P.P.S. is the one to cut if it feels too cute. All three avoid em dashes. Nothing claims the films were watched by a human; if you post before watching, that is still true.

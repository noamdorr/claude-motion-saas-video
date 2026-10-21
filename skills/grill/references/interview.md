# Interview reference

The question bank, the prefill wording, the reference-video breakdown prompt, the taste capture
sheet, and how adjectives and pace become grammar. Read once before Round 1.

## How to word a prefilled question

Use one of these shapes. They make correcting cheaper than composing.

- "I read X and assume Y; correct me." (X is the source: the hero, the README, the CSS.)
- "Default: Y. Change it?" (when there is nothing to cite)
- "I found A and B. Which one, or neither?" (only when two readings are equally likely)

Examples:

- "I read your homepage hero ('Ship invoices in one click') and assume that is still the pitch;
  correct me."
- "I read `tailwind.config.js` and assume the accent is #4F46E5 and the display face is Inter
  Display; correct me."
- "Default: 25 seconds, 16:9, sound off. Change it?"

Never ask a bare open question ("Who is your audience?") when you have a reading to offer.

## Round 1: the job

Pick the four that matter most; fold the rest into the defaults line.

| question | default |
| --- | --- |
| Product, and the repo path or URL if not obvious | the current repo and the site URL found in it |
| Purpose: launch, quick demo, feature announcement, explainer | launch if there is no live site yet or a fresh release tag; otherwise quick demo |
| Audience: who, and what they already believe | the buyer the landing page addresses, assumed to know the problem but not the product |
| Destination | LinkedIn feed |
| Sound on or off | off (it must work silent anywhere) |
| Aspect | 16:9; add 9:16 if the destination is LinkedIn, X or Reels |
| Length | 25s for launch, 12s for quick demo, 15s for feature, 40s for explainer |
| (redo only) What did you dislike about the last cut? | none |

Destination implies defaults: LinkedIn and X mean sound off and a 9:16 cut; a homepage hero means
a seamless loop and no CTA card; Product Hunt means 16:9, sound optional; YouTube means sound on.

## Round 2: the idea and the proofs

| question | default |
| --- | --- |
| The one sentence the viewer leaves with | the site's hero line, rewritten as an outcome in under 12 words |
| The three proofs (screens or capabilities) | the three feature blocks on the site, mapped to the app screens that show them |
| CTA, six words or fewer | the site's primary button plus the bare domain |
| Must not appear | prices, credits, plan names, unbacked claims, competitor names, real customer names |

Present the drafts as a short list, then: "Correct any line, or say go." If the hero line is a
slogan rather than an outcome ("The future of finance"), offer an outcome version next to it and
let them pick.

## Round 3: taste

| question | default |
| --- | --- |
| 2 or 3 videos you love, one line each on what you love | none; fall back to the adjectives |
| One you hate, and why | none |
| Three adjectives | read from the brand: the site's tone and the CSS (a serif on cream reads "editorial, calm, warm"; a dark mono UI reads "precise, technical, fast") |
| Pace: calm, brisk, punchy | brisk |

If they give no links, say once: "Links help most here; any product, even a car ad. Or I go on
the adjectives." Then accept their answer.

## Round 4: assets

| question | default |
| --- | --- |
| Logo (SVG) and dark variant | the SVG found in the repo, path stated |
| Screens | recreate as HTML cards from the code; "run the app" only with a documented test recipe |
| Fonts | display and UI faces from the CSS, Google Fonts names |
| Soundtrack: a file (and BPM if known), silent, or "pick one for me" | silent; the film must work with sound off. If "pick one": mood from Round 3 plus the length, two or three candidates from a royalty-free library, the beat detector on each, the pick shown with its license line before the storyboard (the build skill's `references/music.md`) |
| Sample universe | the fictional names in seed data, fixtures or site mockups |
| Brand voice rules | from a voice or copy doc if one exists; else no em dashes, no hype words, the product's own nouns |

Ask only for what is missing, but always ask the soundtrack question: it is the one answer that
changes the whole timing grid, and the repo rarely holds it (a track in an earlier video folder is
the exception; offer it as the default then). If everything else is found, Round 4 is two lines:
"I found all of this; say go or correct a line. And the soundtrack: yours, silent, or shall I pick?"

## Reference-video breakdown prompt

Use when a `gemini` CLI is available or `GEMINI_API_KEY` is set. Send one link per call. Keep the
output; it goes into the taste capture sheet.

```
You are a film editor and motion director. Watch this video and write a director's breakdown
that another animator could use to reproduce its style with different content.

1. Shot list: every shot with start and end timecodes (mm:ss.s), what is on screen, and the
   camera behaviour (static, push in, pull out, pan, orbit, handheld).
2. Average shot length in seconds, the shortest and longest shot, and how shot length changes
   across the video (accelerates, steady, slows into the end).
3. Pacing rhythm: is it cut to music, to a beat grid, or to the voice? Where are the holds and
   how long are they?
4. Transitions: list each by name (hard cut, match cut, whip pan, push-through or zoom, cross
   dissolve, mask or wipe reveal, morph, J or L cut) with its timecode and duration.
5. Typography: typefaces or their closest match, weights, sizes relative to frame height,
   how text enters (per word, per line, per character, masked), how long it holds, case.
6. Color and lighting: canvas or background, palette, accent use, light versus dark,
   gradients, grain, shadows.
7. How the UI or product is framed: full screen, device mockup, floating card, cropped detail,
   angle, depth, how much of the screen is ever visible at once.
8. The three things that make it feel cinematic rather than like a product demo.
9. The one signature move: the single technique most worth borrowing, described precisely
   enough to rebuild.

Be specific and literal. Timecodes over adjectives. Say "unclear" rather than guessing.
```

If the call fails or the link cannot be read, say so and fall back to the page title,
description and the user's one-liner. Do not paraphrase a breakdown you did not get.

## Taste capture sheet

Write this into `brief.md` under "Reference videos and the one thing to borrow from each", and
copy the "Grammar choices" block into the storyboard header.

```
Reference videos (analysis: gemini breakdown | page and user notes only)
- <title> (<url>): loves "<user's line>". Borrow: <one concrete technique, with numbers if known,
  e.g. "push-through between scenes, 0.5s, every 3s">.
- <title> (<url>): loves "<user's line>". Borrow: <...>.
Not this: <title> (<url>), because "<user's reason>". Avoid: <the concrete technique behind it>.

Adjectives: <a>, <b>, <c>. Pace: <calm | brisk | punchy>.

Grammar choices
- Entrances: <duration>, <easing>
- Holds: <seconds> after the last word, close <seconds>
- Transitions: <types and where>
- Camera: <push range, hero crop scale>
- Type: <display face and treatment>
- Canvas: <color and texture>
- Signature move: <one, and the scene it lives in>
```

Every "Borrow" must be something the runtime can do: an entrance, a transition type (cut, fade,
push, zoom, slide, wipe), a camera move, a type treatment, a counter, a marquee. If a reference's
best trait is live footage or 3D, translate it ("orbiting phone" becomes "slow push with a
parallax card stack") and say so.

## From adjectives and pace to grammar

Start from the pace row, then let each adjective override one or two lines. Stay inside the
ranges in `../build/references/motion-grammar.md`; these pick a point within them.

### Pace

| pace | entrances | holds | transitions | camera | pops |
| --- | --- | --- | --- | --- | --- |
| calm | 0.8s, outQuint | 1.5s, close 2.5s | fade and push, 0.6s | push 1.0 to 1.04 per scene, hero crop 1.15 | none |
| brisk | 0.6s, outExpo | 1.2s, close 2s | push, one zoom on the Shift, 0.5s | push 1.0 to 1.06, hero crop 1.2 | one, soft (spring) |
| punchy | 0.5s, outExpo | 1.2s minimum, close 2s | zoom and cut, slide once | hero crop 1.25, faster camera (0.6s) | one hard pop on the key number |

Punchy shortens entrances and transitions, never the holds below 1.2s. Text still needs reading
time at three words per second.

### Adjectives

| adjective | grammar |
| --- | --- |
| editorial | serif display face, off-white or cream canvas, long holds (1.6s+), fade and push only, per-line text entrances |
| calm, quiet | as pace calm; no pops; ambient drift at 2% |
| precise, technical | mono or grotesk UI face, tight grid, cut and wipe transitions, counters that tick, no springs on text |
| warm, human | soft shadows, rounded cards (24px), springSoft on cards, warm-tinted canvas |
| bold, confident | display 104 to 112px, one accent word per headline, hero crop 1.25, zoom on the Shift |
| playful | spring on small elements, slide transition once, a marquee or morph as the signature move |
| premium, luxurious | dark or deep-tint canvas only if the brand is dark, slow push (1.0 to 1.04), long holds, generous negative space |
| fast, energetic | as pace punchy; staggers at 0.05s per word; scenes of 3 to 4s |
| clean, minimal | one card per scene, no ambient drift, fade transitions, fewer words (aim 3 per second) |

When adjectives conflict ("calm" and "punchy"), ask one line: "Calm holds with one punchy moment,
or punchy throughout?" Default to the first.

### Mapping feedback at the checkpoint

| they say | change |
| --- | --- |
| too slow | shorten holds toward 1.2s, entrances toward 0.5s; cut a scene before adding speed |
| too fast, can't read | lengthen holds, cut words; never just slow the entrances |
| boring, flat | stronger camera (hero crop 1.2+), one zoom transition, check the signature move is visible |
| too busy | fewer staggers, one card per scene, remove the ambient drift |
| looks like slides | add camera tracks to every proof scene, crop tighter, stop showing whole screens |
| not us | go back to the taste sheet; usually the type or the canvas is wrong, not the motion |

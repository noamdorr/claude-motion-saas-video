# Motion grammar: how a launch video earns its length

The difference between a film and an animated slide deck is not the number of effects. It is
restraint, rhythm, and showing the product as a thing in space. Read this once per video.

## 1. Scene grammar

For 20 to 30 seconds, five beats. Each beat is one scene, one idea, one line of copy.

| beat | seconds | what it does | copy |
| --- | --- | --- | --- |
| Hook | 0 to 4 | The pain or the moment the viewer recognizes. No logo, no product. | one line, 6 to 12 words |
| Shift | 4 to 8 | The product appears as the answer. Name it in the headline, show its first screen. | one line |
| Proof 1 | 8 to 14 | One capability, one card, one interaction (a click, a count, a status change). | headline + card words |
| Proof 2 (and 3) | 14 to 22 | The next capability. Change the camera, not the layout language. | headline + card words |
| Close | 22 to 28 | Logo, the promise in six words, the URL. Hold at least two seconds. | promise + URL |

Quick demos (10 to 15 seconds) drop to Hook, Proof, Close. Feature announcements open on the
feature's screen (Shift first), then one Proof, then Close.

The hook is where most launch videos die. Lead with what the viewer already feels ("Your buyers are
complaining about your competitor."), a result ("Three warm leads before standup."), or a crisp
contrast. Never "Introducing X", never the product name in the first second.

## 2. Words

Fewer than you think. A reference film the author approved by ear carries 117 words in 28 seconds:
35 in headlines, 82 across three product cards. The rejected cut had 215.

- Headlines: one sentence, under 12 words. Split on a line break where a reader would breathe.
- Product cards: 15 to 30 words. The idea of the screen (a name, a status, a phrase), not the
  real screen with every label. Real screens are built for people who already know the product.
- Reading speed: three words per second. A headline of nine words needs a three-second hold after
  its last word lands. `check-copy.mjs` enforces the total budget; you enforce the holds.
- No price, credit or plan wording unless the brief says so. A launch video sells the idea.
- No em dashes, no curly quotes, no "seamless", "effortless", "supercharge", "next level".
- Plain, specific, present tense. "Hears the complaint. Finds the buyer." beats "Empowering teams
  with AI-driven insights."

## 3. Time

Pick a grid and keep it. With no music, use 0.5 seconds; with music at B beats per minute, a beat is
60/B seconds (120 BPM gives the same 0.5s). Scene starts and the last word of each headline land
on grid lines. The viewer cannot name this, but feels it as "smooth".

- Entrances: 0.5 to 0.8s, `outQuint` or `outExpo` for text, `springSoft` for cards, `spring` for
  small things that should feel physical (a badge, a toggle).
- Exits: faster than entrances, 0.3 to 0.4s, `inCubic`. Or let the scene transition carry the
  exit and do not animate elements out at all.
- Staggers: 0.05 to 0.08s per word, 0.12 to 0.2s per row. More than eight staggered items reads
  as a loading screen; group them.
- Holds: after the last element lands, hold at least 1.2s before the scene ends, 2s on the close.
- Few hard pops. One per video, on the single most important moment (a status flipping to
  "Severe", a count hitting its number), is a punch. Three is noise.
- Cuts land on the grid. A `push` or `zoom` transition takes 0.5 to 0.6s and starts before the
  grid line so the incoming scene is fully there ON the line.

## 4. The camera

Slides pan. Films move in and out. Every proof scene gets a camera track:

- Push in slowly through the whole scene (`scale` 1 to 1.06 over the scene) so nothing is static.
- Hero crop: when the cursor clicks or the number lands, push to 1.15 to 1.25 on that element over
  0.8s with `inOutQuint`, then hold. Pull back out only if the next idea needs the whole card.
- Pull-out reveal: start at 1.3 on one row, pull to 1.0 to reveal the list. Good for "and here is
  everything it found".
- Scene transitions on the Z axis (`zoom`) make the outgoing scene fly into the lens. Use it once,
  on the Shift (the product arrives), and `push` or `cut` elsewhere.

The viewer should rarely see a whole screen. They see the part the story is about.

## 5. The look

- Canvas: off-white or a brand tint, never pure white. Pure white reads as a screenshot.
  Dark canvases work for developer tools and only if the brand is dark.
- Product UI as cardstock: a white card with a 20 to 24px radius and a soft, feathered shadow
  (`0 30px 80px -20px rgba(ink, .25)`), floating over the canvas. UI is an object in the scene,
  never a full-bleed screenshot, even in the "wide" shot.
- Type: a display face for headlines (the brand's), a UI face for cards (the product's). At
  1920x1080, headlines 88 to 112px, card text 24 to 28px, eyebrows 22 to 24px tracked out. Never
  below 22px: it will play on a phone.
- Color: one accent, used for the one word that matters in a headline and for the one control the
  cursor touches. Status colors as the product defines them.
- Ambient life: a slow, barely visible drift on the canvas (a gradient blob at 2 to 4% opacity
  moving 40px over the scene) keeps static holds alive without competing with the content.
- Cursor: oversized (32 to 40px), high contrast, moves on `inOutQuint` over 0.6 to 1s along a
  slight arc, clicks with a 0.1s scale dip and a 0.2s recovery. It targets by selector. It
  never jitters and never moves while text is still entering.

## 6. Aspect ratios

Build 16:9 first. For 9:16 (LinkedIn, Reels, Shorts): headlines stack to three lines at 88px, cards
narrow to 920px wide and the camera pushes closer; the close puts the URL above the fold. 1:1 sits
between. Do not scale the 16:9 layout; re-lay out each scene with the same copy and timing.

## 7. Music

Claude Motion exports silent video and so does the default here; the film must work with sound off.
If the brief supplies a track, note its BPM (ask, or read it from a DAW or an online detector),
set the grid to the beat, and mux with `render.mjs --audio`. Cuts on downbeats, clicks on
backbeats, the close on a bar line. Do not add stock music the user did not pick.

## 8. One signature move

Choose one for the whole video and let the rest be plain: a marquee of logos that stops on the one
that matters; a card that morphs into the next scene's headline; a number that counts into the
hero line; a mask reveal of the product behind the pain. The signature move goes in the Shift or
the first Proof. Everything else is entrances, holds and the camera.

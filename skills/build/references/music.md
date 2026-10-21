# Music

Silent first: the film has to work with sound off, because LinkedIn and most feeds autoplay muted.
Music is a layer on top that makes the rhythm audible. When a track is in play, the beat grid is
no longer a choice; it is the grid.

## Where the track comes from, in order

1. **The user's own track.** Grill asks for it in Round 4 (path and, if known, BPM). A track the
   founder picked for an earlier film is the strongest signal of taste there is.
2. **A track already in the repo.** Lucky looks for `music.*`, `soundtrack.*`, `*.mp3` under
   earlier video folders (`video/`, `remotion*/`, `motion-video*/`). If an earlier approved film
   used it, reuse it and say so in the assumptions. If it only sits there, still prefer it over a
   stranger's track, but say so.
3. **A royalty-free library, when the user said "pick one".** Search by mood words from the taste
   round plus the length, then by BPM once you know the film's pace. Download two or three
   candidates, run `beats.mjs` on each, and pick the one whose tempo gives a beat near the grid
   you want (0.5s at 120 BPM is the sweet spot for a 25s film; faster tracks for punchy briefs).
4. **Nothing.** Silent is a fine answer. Never add a track the user did not ask for.

## Libraries that work from a terminal

- **Mixkit** (`mixkit.co/free-stock-music/`): tag pages such as `/tag/corporate/`, `/tag/upbeat/`,
  `/tag/technology/`, `/tag/ambient/`. Each page lists direct MP3 links of the form
  `https://assets.mixkit.co/music/<id>/<id>.mp3`, so `curl -L -o assets/music.mp3 <url>` works.
  License: Mixkit Stock Music Free License, free for commercial use, no attribution required.
  Record the track title and URL in `brief.md` anyway.
- **Pixabay Music** (`pixabay.com/music/`): large and well tagged, but downloads need a browser
  session. Use the browser tool if you have one; otherwise ask the user to download and point you
  at the file. License: Pixabay Content License (free, no attribution, no resale as audio).
- **Free Music Archive** (`freemusicarchive.org`): Creative Commons; the license differs per track
  (CC BY needs a credit line in the post, CC BY-NC is not for a product launch). Download pages
  usually need an account; treat it as a browser-tool source.
- **Uppbeat**, **Chosic**, **Bensound**: free tiers need a credit line or an account. Fine when
  the user accepts a credit; say so before picking.

Never use a track whose license you cannot state in one line. The earlier skill shipped a sound
effect that turned out to be unlicensed; the one-line license in the brief is how that does not
happen again. YouTube Audio Library needs a Google login and is not reachable from a terminal.

## The beat workflow

1. `node beats.mjs assets/music.mp3 --out assets/beats.json`. It prints the BPM, the beat
   length, the bar starts, the strongest hits (all bands, often the claps), the strongest kicks
   (low band), the drop (the first kick after a quiet stretch, when the track has one), the
   swell or swells, and other plausible tempos. Half and double tempos are the usual confusions,
   and a 3:2 relative happens on swung or triplet-feel tracks; if the user told you the BPM, or
   the printed one feels wrong for the track, pin it with `--bpm`. Trust the outputs in this
   order: beats (reliable), kicks and hits (reliable), the drop (good when found), swells (a
   looping track has a phrase peak every four bars, so "the swell" is a choice, not a fact),
   bars (a guess; the printed confidence says how alike the four beat phases look, and a two-beat
   error is common). Scene starts on beats are always safe; bar lines are a hint.
2. Set the storyboard grid to the beat. Scene starts on bar lines (every fourth beat), the cut
   into the product reveal on the swell or the strongest hit near it, clicks and status flips on
   beats. The last headline word of each scene should land on a beat too.
3. Choose where the track starts (`--audio-start`) so a bar line falls on 0s, or on the first cut.
   Many tracks open with a quiet bar; starting the film inside the track is normal.
4. Build, then `node beats.mjs --check video.html assets/beats.json --audio-start <s>` (the same
   offset you will pass to render): it reports every scene start that is more than two frames
   off the nearest beat and which beat to move to.
5. Render with `node render.mjs --audio assets/music.mp3 --audio-start <s> --audio-fade 1.5`.
   The track is trimmed to the film and faded out over the last 1.5s (`--audio-fade 0` to keep a
   hard ending when the track itself ends on the close).
6. Report the BPM, the start offset and the license line in the handoff.

## What the music changes in the grammar

- Entrances still ease out, but their end lands on a beat, so start them one beat earlier.
- The one hard pop goes on a strong hit, never between beats.
- Holds are measured in beats: a headline holds at least two beats after its last word.
- If the track has a drop (bass arriving after a quiet intro), the product reveal lands on it. A
  swell works too, but on a looping track pick the phrase peak that sits where the storyboard needs
  it, and say which. That is the film.

# Storyboard

Grid: the music's beat, 117.5 BPM (0.511s per beat, a bar every 2.04s), times in film seconds from `assets/beats.json`. Total words on screen: 99 over 26.05s (3.8 per second; target under 4).

Music: `assets/music.mp3` (the June 2026 QuotaCanary launch film's track, 125s), 117.5 BPM pinned (the detector reads 116; `--bpm 117.5 --max 40`). Audio start 7.825s into the track: that is a bar line (and a strong onset), so film 0s is a downbeat. The track's intro runs to about 11.2s with a triplet fill (onsets every ~0.17s from 10.45s), the whistle around 10.8s and the hard hit at 11.12s, then the full section opens (the energy step up at 11.2 to 11.4s). The cut into the product (shift) lands on the beat at track 11.471s = film 3.646s: its 0.6s push window (film 3.046 to 3.646, track 10.87 to 11.47) rides the whistle and the 11.12s hit, and the slab is fully in as the full section arrives. The hits list in beats.json has nothing after 11.12s (the full section's onsets sit below its adaptive threshold), so the bird flip uses the strongest beat in the section measured by onset strength: track 13.56s = film 5.735s, the bird's scale peak lands there. The close starts on a beat (film 21.432s; the bar at 22.384s would have made proof-3 4s long). `assets/beats.json` is the grid in FILM time (track minus 7.825s) so `beats.mjs --check` compares like with like; the raw track-time grid is `assets/beats.track.json`. Render: `node render.mjs --out out/quotacanary-mac-launch.mp4 --audio assets/music.mp3 --audio-start 7.825 --audio-fade 1.5`.

| # | scene id | seconds | on-screen words | visual | motion | transition in |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | hook | 0.0 to 3.646 (bar line) | "One of your API tools is about to run dry." | Five tool tiles (Hunter, Apollo, OpenRouter, Prospeo, Tavily logos from the app) with mini meters; Hunter's meter drains to red. No product, no logo. | tiles rise in, words stagger, gold highlighter sweeps under "run dry", slow push 1 to 1.05 | cut |
| 2 | shift | 3.646 to 8.847 (beat; track 11.47s, the swell) | "QuotaCanary warns you, right in the menu bar." + notification "Hunter / Searches critical: 250 of 10,000 left" | Desktop slab with a menu bar strip (chrome); the QuotaCanary bird sits among neutral icons | bird flips ink to red with the "!" badge (the one hard pop, signature), notification slides in from the right, camera leans toward the bird | push 0.6 |
| 3 | proof-1 | 8.847 to 13.537 (beat) | "Every balance at a glance." + panel: Needs attention (Hunter Searches 250 / 10,000 critical, Apollo Lead Credits 1,000 / 10,000 low), Healthy (OpenRouter $45.00, Tavily 914 / 10,000) | The real panel (380pt at 2x) rebuilt as HTML, anchored under a notch | rows stagger in, cursor glides to the Hunter row and clicks, row highlights, hero crop on the Hunter row | zoom 0.6 (outgoing flies into the lens, the push-through from the bird into its panel) |
| 4 | proof-2 | 13.537 to 18.39 (beat) | "And roughly when it runs out." + inspector: Hunter, Searches, 250 of 10,000, Empties in ~2 days., Burning ~125/day · Last 7 days | Hunter inspector card from the stack window | meter drains first, then the number lands, sparkline draws left to right, ETA lands, hero crop on "Empties in ~2 days." | push 0.6 |
| 5 | proof-3 | 18.39 to 21.432 (bar line) | "No account needed." + connect card: Connect Hunter, Hunter API key, Stored in your Mac's Keychain. Sent only to Hunter., Connect | Connect form card | key dots type in, Keychain note lands, camera pushes toward the note | push 0.5 |
| 6 | close | 21.432 to 26.053 (beat; ends on a beat) | "QuotaCanary" / "the bird that sings before the credits die" / "quotacanary.com" | App icon tile (ink mark on gold), Fraunces name, tagline on two lines, URL pill | icon springs in, tagline words stagger, gold highlighter under "sings", URL pill rises; everything still by 23.43 (on a beat), held 2.6s | fade 0.5 |

Signature move (one): the menu bar bird flipping from ink to red with its "!" badge (the single hard pop, in the Shift at 5.735s absolute, on the strongest beat after the swell), followed by the zoom push-through into its panel.

Camera plan (per proof scene: push-in target, hero crop moment):
- shift: 1.0 to 1.03 by 2.6s local, then 1.2 toward the bird by 3.4s local (clamped, off-center crop accepted; the slab keeps the bird in the middle two thirds).
- proof-1: 1.0 to 1.03, hero crop 1.16 on `.row-hunter` at 2.5 to 3.3s local, as the click lands (click at 2.6s local = film 11.448s, a beat).
- proof-2: 1.0 to 1.03, hero crop 1.15 on `.eta` at 2.3 to 3.1s local.
- proof-3: 1.0 to 1.08 toward `.note` across the scene.

Word count by scene (headline / card): hook 10 / 0; shift 8 / 7; proof-1 5 / 21; proof-2 6 / 15; proof-3 3 / 16; close 1 + 8 / 1.

Assumptions (lucky): hook line is mine and unapproved; "Top up" buttons and the footer menu dropped from the panel card to keep it under 30 words; Prospeo dropped from the panel (kept in the hook tiles); proof-3 headline "No account needed." carries a different fact than the card's Keychain note so each fact is said once.

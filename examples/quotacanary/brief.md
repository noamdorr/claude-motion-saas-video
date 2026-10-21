# Video brief

Filled by `lucky` from the repo (no live site fetch needed: the site source is in `site/`). Every line below is read by `build`.

## Product

- Name: QuotaCanary (Mac app: "QuotaCanary for Mac", `CFBundleDisplayName` QuotaCanary, `mac/scripts/bundle.sh`)
- One line, as the site says it: "A menu bar app that warns you before your API credits run out." (`site/src/lib/copy.ts` HOME.oneLiner, the homepage h1)
- What it actually does (two sentences, plain): It checks the credit balances of your API tools (Hunter, Apollo, OpenRouter, Prospeo, Tavily...) from the Mac menu bar, one row per balance. When a balance drops below your "Warn below" number the bird in the menu bar changes color and a notification shows up, and after a few readings it estimates when each balance hits zero.
- Site URL: https://quotacanary.com
- App surface the video shows: Mac menu bar app (panel, stack window inspector, connect form, notification)

## This video

- Purpose: launch
- Audience: solo GTM engineers on a Mac, small outreach and data-ops teams. They already believe their tools run out at the worst moment and that checking ten dashboards is a chore.
- Destination: Product Hunt gallery + LinkedIn feed post
- Plays with sound off: yes (music is a layer on top)
- Aspect: 16:9 (1920x1080, 30 fps)
- Length in seconds: 26.05 (25.5 before the music re-cut)
- The one idea the viewer should leave with: Warns you before your API credits run out. (hero line, shortened from 12 to 8 words, verbs kept)
- The three proofs (site feature blocks, in site order):
  1. Low-balance alerts: the menu bar bird turns red with a "!" badge and a notification lands: "Hunter / Searches critical: 250 of 10,000 left" (`Copy.alertBody`, `Alerts.swift:124`). Screen: `assets/screens/menu-bar-bird-critical.png`, `assets/screens/menu-bar-panel-two-need-attention.png`.
  2. Run-out estimates: inspector for Hunter Searches, "250 of 10,000", meter drained, "Empties in ~2 days.", "Burning ~125/day · Last 7 days". Screen: `assets/screens/stack-window-hunter-empties-in-2-days.png`.
  3. Local by default: connect Hunter, key field, "Stored in your Mac's Keychain. Sent only to Hunter." Screen: `assets/screens/connect-hunter-key-in-keychain.png`.
- Call to action: quotacanary.com

## Brand

- Canvas color: #FFFDF5 (`--cream`, `src/app/globals.css`); secondary surface #FBF6E4 (`--cream-2`)
- Ink (text) color: #1A1A1A (`--ink`); muted #6B6B66 (`--ink-3`); hairline rgba(26,26,26,0.12)
- Accent: Canary Gold #FFC400 (fills only, never text on cream); gold text on cream #8A6600 (`--canary-ink`); deep #E0AC00
- Status colors: healthy #2F8F4B (macOS system green in the app), low #FFC400, critical/empty #C42424 web / macOS system red #FF3B30 in the app; Mac light-mode warning text low #7A5600, critical #B3261E (`StatusStyle.swift`)
- Display font (headlines): Fraunces (Google Fonts, weight 500, opsz 144, SOFT 50, letter-spacing -0.022em; `.f-display` in `src/app/globals.css`, also the wordmark face)
- UI font (cards): macOS system font in the app (`-apple-system, "SF Pro Text"`), fallback Inter; balances in monospaced digits (tabular-nums)
- Logo file: `assets/mark.svg` (currentColor), `assets/mark-ink.svg`, `assets/mark-gold.svg`, dark variant `assets/mark-white.svg`, app tile `assets/app-icon.svg` (ink mark on gold, rx 224/1024); wordmark `assets/wordmark.png` 366x81 (PNG only, do not scale above 1x; the close sets the name in Fraunces text instead)
- Radius and shadow language: Mac panel 380pt wide (shown at 2x = 760px), 6pt padding, rows 28pt, glass radius 14pt; macOS popover radius ~12pt (24px at 2x). Window radius 12pt. Site product card 12px radius, shadow `0 18px 40px -28px #332a1a40`. Film card outer shadow: cardstock `0 30px 80px -20px rgba(26,26,26,.25)`.

## Assets

- Screens (path, what each shows), all rendered by the app's own offscreen renderer `mac/dist/QuotaCanary.app/Contents/MacOS/QuotaCanary --snapshot <dir>` (in-memory demo data, no network, no Keychain), light mode, 2x:
  - `assets/screens/menu-bar-panel-two-need-attention.png` (showcase-light.png, 760x814): panel, Hunter critical, Apollo low, three healthy
  - `assets/screens/stack-window-hunter-empties-in-2-days.png` (showcase-window-light.png, 2000x1184): "Your stack" window + Hunter inspector
  - `assets/screens/connect-hunter-key-in-keychain.png` (connect-form-hunter-light.png, 760x994): connect form
  - `assets/screens/menu-bar-bird-critical.png`, `menu-bar-bird-low.png` (132x88): the menu bar mark states
  - `assets/screens/alerts-prompt.png` (760x698): reference only
- Sample universe: the app's demo stack (`mac/Sources/QuotaCanaryCore/StackScenarios.swift` showcase): Hunter Searches 250 / 10,000 (Critical, ~2 days), Apollo Lead Credits 1,000 / 10,000 (Low, ~5 days), OpenRouter Credits $45.00, Prospeo Credits 4,528 / 10,000, Tavily Plan Credits 914 / 10,000. Provider logos copied from `public/logos/` to `assets/sample/` (hunter 128, apollo 256, openrouter 128, prospeo 180, tavily).
- Music: `assets/music.mp3`, the user's own track from the June 2026 QuotaCanary launch film (license: the user's own track, reused from the earlier film). 117.5 BPM, audio starts 7.825s into the track, fades out over the last 1.5s.
- Reference videos and the one thing to borrow from each: `video/docs/HANDOFF.md` (earlier film): drain a meter before a number lands so it never reads as a minus sign; keep the quiet-to-sings payoff for the end card; never two "QuotaCanary X" sentences in a row. `baseline-video/NOTES.md`: notification copy must match `Copy.alertBody`; light mode only; CTA is quotacanary.com, not "Download".

## Voice

- Rules (verbatim): "dry, witty, no-BS" and "NEVER use em dashes in copy (use hyphens or restructure)" (`CLAUDE.md`, `AGENTS.md`). "Keep copy sharp, specific, and free of hype." (`PRODUCT.md`). "Dry and specific over enthusiastic", "One wink per section, and each fact said once" (`docs/copy-claims-checklist.md`). Notification titles use a middle dot, never an em dash (`Copy.swift`). On-screen copy never says "pool".
- Words the product uses for its key objects: connection, balance, stack ("Your stack"), "Warn below", Healthy / Low / Critical / Empty, "Needs attention", "Top up", the bird. Marketing says "credits", "runs dry", "run out".

## Must not appear

- Any tool count ("60+", "45 tools"), user counts, testimonials, customer logos, press, Reddit quotes
- "Download", "Free forever", "signed", "notarized", App Store, "every tool", "your whole stack", "nothing leaves your Mac"
- Price or plan wording; weekday predictions ("burns out Tuesday"); the ETA as a promise
- "Introducing"; em dashes

## Assumptions made (lucky only)

- One idea = hero line "A menu bar app that warns you before your API credits run out." shortened to "Warns you before your API credits run out." and split: the Shift carries "warns you, right in the menu bar", the hook carries "about to run dry".
- Length 25.5s, 16:9, sound off, CTA quotacanary.com: the user said ~25s and 16:9; no download artifact exists yet (site button is "Coming soon"), so the close shows the bare domain, not a download link.
- Screens rebuilt as HTML cards from the app's own `--snapshot` renders and `PanelView.swift` / `PoolRowView.swift` (no live capture of the running app, no notification capture exists, so the notification is drawn to macOS shape with `Copy.alertBody` text).
- Display font Fraunces: the brand's display face (web app, wordmark, earlier film) wins over the site's Inter headings.
- Close line = the approved tagline "the bird that sings before the credits die", at its own length, lowercase as written in `site/src/lib/copy.ts`.
- Hook line "One of your API tools is about to run dry." is mine (unapproved copy, staged like every other film string; PRODUCT.md says public copy is staged for Noam's pick).
- Status red in cards uses macOS system red (#FF3B30) because the Mac app uses system colors; the film's accent word uses Canary Gold as a fill (highlight), never as text on cream.
- Apollo appears in the stack: it is in the app's own showcase data, although the earlier film excluded it.

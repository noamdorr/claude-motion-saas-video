# Video brief: Reechee D app launch

Filled by `grill` (four rounds, 2026-10-21). Transcript kept beside the run outputs.

## Product

- Name: Reechee
- One line, as the product spec says it: an opportunity feed of real complaints about your competitors, the reviewer hidden until you reveal, then take it to your own agent.
- What it actually does: Reechee monitors review sites (G2, Capterra, Trustpilot, TrustRadius) for complaints about the competitors you name and turns each complaint into an opportunity. You reveal the reviewer and their company, then hand the evidence to Claude or ChatGPT as a ready prompt.
- Site URL: reechee.io (app at app.reechee.io)
- App surface the video shows: the new web app, the "D" shell with the top nav (Opportunities, Watchlist, Reports)

## This video

- Purpose: launch of the new app (not the old sidebar app)
- Audience: SaaS founders and salespeople who can name the competitors whose customers they want. They know review sites, not Reechee.
- Destination: LinkedIn feed
- Plays with sound off: yes
- Aspect: 16:9 only for now
- Length in seconds: 25
- The one idea the viewer should leave with: "Your competitors' unhappy customers are already telling you who to call."
- The three proofs:
  1. The opportunities feed: one row per complaint, the company anonymous, the reviewed product named, a Severe badge.
  2. The reveal on one opportunity: the person and company appear, with the review link.
  3. Take it to your agent: the modal with the prompt you copy into Claude or ChatGPT.
- Call to action: "Hear the complaint. Make the call." plus reechee.io

## Brand

- Canvas color: warm off-white #FCFAF8 (the D shell's page color, hsl 30 43% 98%), never pure white
- Ink (text) color: hsl(283 25% 15%) #2a1d30 for body, deep purple #390854 (plum) for titles and headlines
- Accent: Reechee pink #EE2E7F
- Status colors: Severe #fde8f1 / #a61451 / border #f6a7ca; Moderate #f0e4f6 / #6b238e; Mild #f8f3fa / #745084; Unlocked green hsl(152 42% 30%)
- Display font (headlines): Bricolage Grotesque (Noam's Round 4 pick; flagged that the site and D shell use Schibsted Grotesk since REE-1096/1097)
- UI font (cards): Inter
- Logo file: assets/logo.svg (copy of brand_assets/Logo.svg); the close is light, so the white variant is not used
- Radius and shadow language: D shell list and review cards 12px radius, 1px hairline #eee4eb, buttons 8px, badges 5px, modal 14px. The film adds the cardstock shadow on the floating window only.

## Assets

- Screens (fidelity references only, real people, never in the film): feed, locked detail, revealed detail, agent modal, watchlist, top nav, tokens.json in the session scratchpad `reechee-screens/`. Rebuilt as HTML cards from those plus `web/components/d/d-opportunities.module.css` (origin/main).
- Sample universe: the site's (`www-astro/src/lib/sample-data.ts`): Halvorsen Logistics with Priya Natarajan, Director of Revenue Operations, complaining about Docusign ("Signing workflows keep delaying customer contracts."); Serrano Freight (Salesforce), Tanaka Precision Tools (Jira). Logos from `www-astro/public/demo-logos/` in assets/logos/.
- Music: assets/music.mp3, the soundtrack of the founder's approved April 2026 Reechee film (29.5s, 120 BPM). License: the founder's own track from the April film. Rendered from 0.5s into the track with a 1.5s fade-out; the beat grid (0.5s) is the film's grid.
- Reference videos and the one thing to borrow from each (analysis: repo source and breakdowns plus Noam's notes; neither video was watched):
  - April film, https://www.youtube.com/watch?v=84dbi9LvWwM (source in `remotion-video/src/v2/`): loves "the even beat and how little text it has; every scene starts clean, entrances ease in, nothing jerks". Borrow: scene starts on a 0.5s grid (April: 0, 3, 6, 10.5, 14.5, 20.5s), card entrances that fade over 0.4s and settle over 0.7s, the name un-blurring on unlock, about 4 words per second.
  - Anthropic "Claude Design" launch (breakdown in `claude-design-upload-pack/REFERENCE_anthropic-video-analysis.md`): loves "the camera pushes into the UI like it is a physical object, cream canvas, UI as floating cardstock, the hero crop on exactly the control being used". Borrow: the Z-axis push-through into a UI element as the cut (once), hero crop 1.25 on the control the cursor uses, cardstock shadow on a cream canvas.
  - Not this: the first v3 cut of 2026-10-03 (`remotion-video-v3/`), because "too much text, it explained every screen, and the cuts were jerky against the beat". Avoid: real-screen copy density (215 words), cuts off the grid, hard pops.
  - Adjectives: smooth, confident, warm. Pace: brisk, never jerky, even grid.

## Voice

- Rules: no em dashes, dry and direct, no hype words, no "Introducing", no credit, price or plan wording.
- Words the product uses: opportunity, reveal, watchlist, take it to your agent. Button labels as the app has them: "Unlock review", "Unlocked", "View original review", "Copy prompt".

## Must not appear

- Any credit, price or plan wording: no "5 credits", "1 cr", "175 credits", "pay as you go", "free trial"
- "Introducing"
- Real reviewer or company names from the screenshots (the Kinsta reviewer and her company, the HubSpot CRM reviewer)
- Testimonials, customer counts, the pitch generator, Reechee's own competitors

## Assumptions made

- Round 1 Q4 unanswered: this is a separate launch film, sharing the site's sample universe and brand, not a re-cut of the REE-1161 film.
- The reveal button keeps the app's real label "Unlock review" (without the credit count); headline copy uses "reveal".
- The top nav appears in the product cards without the credits counter and the avatar.
- Product logos only where the repo has them (Docusign, Salesforce); Jira gets a letter tile, as the app does for products without a logo.
- The prompt in the agent modal fills in at speed (time compression, as in the Claude Design film); in the app it is already filled when the modal opens.
- Product titles inside the cards (page title, modal title) use Inter 650, as `tokens.json` from the screenshots measured; the D shell CSS on main asks for Schibsted Grotesk there. Film headlines use Bricolage per Round 4.
- Copy cuts during the build to stay under the budget: the reveal card has no review quote, the agent prompt has no source line.
- `motion.js` in this folder carries a one-line fix to the bundled runtime: camera `target` keyframes produced NaN because a loop variable shadowed the stage scale (see the run's NOTES.md).

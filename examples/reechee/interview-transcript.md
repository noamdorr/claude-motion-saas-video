# Grill transcript: Reechee D app launch video

## User (opening message)

grill me on a launch video for the new Reechee app (the D shell: top nav, the opportunities feed, reveal, take-it-to-your-agent). 25 seconds, 16:9, for LinkedIn. I have screenshots and two reference videos.

## Claude: Step 0 read, then Round 1 of 4 (the job)

I read the repo before asking: the pivot audit and lead-first decision (sales teams, pay-as-you-go, pitch generator gone), the D demo script (feed, locked detail, revealed detail, Take it to your agent), the review-unlock spec, the live site hero on www-astro main ("Every complaint your competitor gets is a buyer you're not talking to. Yet." with a pink italic "Yet."), the brand and voice docs, the site's sample universe in `src/lib/sample-data.ts` (Halvorsen Logistics, Priya Natarajan and neighbours), and your six screenshots (feed, locked, revealed, agent modal, watchlist, top nav). There is no earlier `motion-video/` brief, so this is a fresh film, not a redo.

Round 1 of 4. Four questions, each with my default; "defaults" is a full answer.

1. **Format.** 25s, 16:9, LinkedIn feed, so sound off and burned-in type carries everything. I would also cut a 9:16 version after the 16:9 is approved. Confirmed? (Default: 16:9 now, 9:16 later as a separate edit, not in this run.)
2. **Pitch.** I read the hero and assume the film carries the same promise, now through the new app: a competitor's unhappy reviewer becomes a person you can reach and a brief your agent can work with. Correct me if the D app launch should say something narrower (for example "the new app" itself as the news).
3. **Audience.** I read the pivot audit and assume salespeople and SaaS founders at small B2B teams who can name the competitors they want to win from, who know review sites exist but have never worked them as a lead source. They do not know Reechee yet. Correct me, or say if existing customers seeing the new app are the real audience.
4. **Relation to earlier films.** The repo has an approved Reechee film (REE-1161, the hyperframes reskin with the sample universe). Default: this film is a separate launch piece for the D app, shares the sample universe and the brand, and does not have to match that film's structure. Change it?

## Noam (Round 1 reply)

Yes, Reechee. The new app, not the old sidebar one. Purpose: launch of the new app. Audience: SaaS founders and salespeople who can name the competitors whose customers they want. Destination: LinkedIn feed, sound off, 16:9 only for now. 25 seconds. The hero line on reechee.io may still be pre-pivot, so use the product spec's framing instead: an opportunity feed of real complaints about competitors, the reviewer hidden until you reveal, then take it to your own agent.

## Claude: decisions so far, then Round 2 of 4 (the idea and the proofs)

Locked: launch of the new (D) app, 25s, 16:9 only, LinkedIn feed, sound off. Audience is SaaS founders and salespeople who can name their competitors. Framing comes from the product spec, not the homepage hero: feed of complaints, reviewer hidden until reveal, then your own agent. (Q4 unanswered, so default: separate film, same sample universe and brand as the site.)

Round 2 of 4. Drafts from the spec and your screenshots; correct any line or say go.

1. **The one sentence** the viewer leaves with (default): "Your competitor's unhappy customers, found, revealed and handed to your agent." Shorter alternative: "Every complaint is a buyer. Reveal them. Brief your agent."
2. **The three proofs**, one screen each:
   - Opportunities feed (Unseen tab): rows of complaints about competitor products, person and company anonymous, one row flagged Severe.
   - Reveal: the locked detail ("Sales director at a Retail company", paraphrase) flips to the identified reviewer, company and LinkedIn after one click on Unlock review.
   - Take it to your agent: the modal with the prompt that carries the evidence, cursor clicks Copy prompt.
3. **CTA**, six words or fewer (default): logo plus "reechee.io". The site button says "Start monitoring"; I would leave a button out and let the URL carry it.
4. **Must not appear** (default all off): credit counts and costs (the nav's "175 credits", "5 credits" on the unlock button, "1 cr" chips), prices, plan names, "free trial", the pitch generator, Reechee's own competitors by name, and any real person or company from the screenshots (the reviewers and companies in them are real; the film uses the site's sample universe instead: Halvorsen Logistics, Priya Natarajan and neighbours). Real reviewed products (Docusign, Zendesk, Salesforce) stay real, as on the site.

## Noam (Round 2 reply)

The one sentence: "Your competitors' unhappy customers are already telling you who to call."
Proofs, in this order: 1) the opportunities feed, one row per complaint, the company anonymous and the product named, a Severe badge; 2) the reveal on one opportunity, the person and company appear with the review link; 3) "Take it to your agent", the modal with the prompt you copy into Claude or ChatGPT.
CTA: reechee.io, six words max, something like "Hear the complaint. Make the call."
Must not appear: any credit, price or plan wording (no "5 credits", no "1 credit", no "pay as you go"), no "Introducing", no real reviewer or company names from the screenshots. Use the site's sample universe: Halvorsen Logistics with Priya Natarajan as the lead, plus Serrano Freight, Tanaka Precision Tools, Lindqvist Marine, Whitlock Insurance. Real product names being complained about can stay real (Kinsta, HubSpot CRM, Zendesk). No testimonials, no customer counts.

## Claude: decisions so far, then Round 3 of 4 (taste)

Locked: the one sentence is "Your competitors' unhappy customers are already telling you who to call." Proofs in order: feed (anonymous company, named product, Severe badge), reveal (person, company, review link), Take it to your agent (modal, copy the prompt). Close: "Hear the complaint. Make the call." plus reechee.io. Nothing about credits, prices, plans; no "Introducing"; sample universe only, Halvorsen Logistics and Priya Natarajan as the lead; real reviewed products stay real; no testimonials or counts.

Round 3 of 4, the one the repo cannot fully answer.

1. **Your two reference videos.** I found two director's breakdowns in `claude-design-upload-pack/`: Anthropic's "Claude Design" launch film (`REFERENCE_anthropic-video-analysis.md`) and OpenAI's GPT-5 vertical sizzle (`REFERENCE_02_gpt5-video-analysis.md`). I assume these are your two; I will work from those breakdowns (I cannot watch the videos themselves). One line each on what you love, or say "the notes in the files".
2. **The one you hate, and why.** Default: none named; I will treat "a screen recording with a voiceless feature tour" as the not-this.
3. **Three adjectives.** I read the brand voice (confident, direct, conversational) and the warm off-white app canvas and assume "confident, precise, warm". Correct me.
4. **Pace.** Default: brisk (0.6s entrances, 1.2s holds, push transitions, one zoom). Calm or punchy instead?

## Noam (Round 3 reply)

Links:
1. https://www.youtube.com/watch?v=84dbi9LvWwM, our April film. I love the even beat and how little text it has; every scene starts clean, entrances ease in, nothing jerks. Treat its timing as the reference.
2. The Anthropic "Claude Design" launch video. There is a director's breakdown of it in the repo at claude-design-upload-pack/REFERENCE_anthropic-video-analysis.md, use that. What I love: the camera pushes into the UI like it is a physical object, cream canvas, UI as floating cardstock, the hero crop on exactly the control being used.
The one I hate: our own first v3 cut from October 3. Too much text, it explained every screen, and the cuts were jerky against the beat. A marketing film communicates the idea, it does not explain everything.
Adjectives: smooth, confident, warm.
Pace: brisk, but never jerky. Even grid.

## Claude: decisions so far, taste sheet, then Round 4 of 4 (assets)

Locked: references are the April film (timing) and the Anthropic Claude Design film (camera and look); not this: the October 3 v3 cut. Adjectives smooth, confident, warm; pace brisk on an even grid. One correction to my Round 3 guess: your second reference is April's film, not the GPT-5 sizzle, so I drop the GPT-5 breakdown.

How I read them, so you know what this rests on: I could not watch either video. For the April film I read its own source in `remotion-video/src/v2/` (scene starts on a 15-frame grid at 0, 3, 6, 10.5, 14.5, 20.5s; cards fade in over 0.4s and settle over 0.7s; the unlock un-blurs the name over a third of a second; cuts are hard cuts) and your 10-03 notes on it (117 words in 28s). For Claude Design I used the director's breakdown in the repo. For the v3 cut I used your notes only.

Grammar choices (veto any line):
- Entrances 0.6s outQuint for text, 0.8s springSoft for cards; nothing snaps. Staggers 0.06s per word.
- Holds at least 1.4s after the last word, close 2.5s. Every scene start on the 0.5s grid, exactly like April.
- Transitions: push 0.6s between scenes; one Z-axis push-through (zoom) as the signature move: the camera pushes into the Halvorsen row in the feed and comes out on that opportunity's detail page.
- Camera: every product scene drifts 1.0 to 1.05; hero crop 1.2 to 1.3 on exactly the control being used (Unlock review, Copy prompt), on inOutQuint.
- Look: the app's own warm off-white canvas (#FCFAF8), product UI as white cardstock with a soft feathered shadow, Schibsted Grotesk headlines with one pink word, Inter inside the product.

Round 4 of 4. I found nearly everything; correct a line or say go.

1. **Logo:** `www-astro/public/logo.svg` (pink mark, deep purple wordmark; identical to `brand_assets/Logo.svg`). The close is light, so no dark variant needed.
2. **Screens:** I recreate the feed, the locked and revealed detail and the agent modal as HTML cards from your screenshots and the D shell CSS (`web/components/d/d-opportunities.module.css` on main: 12px list radius, 5px badges, Severe #fde8f1 / #a61451, plum #390854 titles). No screenshot goes into the film, because they show real reviewers. Also: the top nav is in every product card (Opportunities, Watchlist, Reports) but without the credits counter.
3. **Fonts and music:** Schibsted Grotesk for headlines and Inter for the product. One flag: `claude-design-upload-pack/brand-and-design.md` still says Bricolage; the site and the D shell switched to Schibsted (REE-1096/1097), so I go with Schibsted. Music: none, the film works silent; grid 0.5s.
4. **Sample universe and voice:** Halvorsen Logistics / Priya Natarajan, Director of Revenue Operations, complaining about Docusign ("Signing workflows keep delaying customer contracts."), with Serrano Freight (Salesforce), Tanaka Precision Tools (Jira), Lindqvist Marine (Shopify), Whitlock Insurance (ServiceNow) as the other rows, as on the site. Voice: no em dashes, no hype words, the app's own nouns (opportunity, Unlock review, Unlocked, Take it to your agent, Copy prompt).

## Noam (Round 4 reply)

Logo: Reechee/brand_assets/Logo.svg (white variant: brand_assets/reechee-logo-signature-white.png). Screens: already captured in /private/tmp/claude-501/-Users-noamdorokhov-Reechee/e7db1317-54b5-4fd9-9e14-dacd7a8195ac/scratchpad/reechee-screens/ (feed, locked detail, revealed detail, agent modal, watchlist, top nav). Rebuild them as HTML cards with the sample universe names; the screenshots carry real people, so never use them as images in the film. Fonts: Bricolage Grotesque for headlines, Inter for UI (the app), colors in claude-design-upload-pack/brand-and-design.md: pink #EE2E7F, deep purple #390854, white canvas in the product but for the film use an off-white or a very light warm tint. Music: none for now. Voice: no em dashes, dry and direct, the product's words are "opportunity", "reveal", "watchlist", "take it to your agent".

## Claude: decisions, then the storyboard

Locked: logo `brand_assets/Logo.svg` (light close, so the white variant is not needed). Screens rebuilt as HTML cards from your screenshots and the D shell CSS, sample universe names only, no screenshot pixels in the film. Inter inside the product, pink #EE2E7F, deep purple #390854, warm off-white canvas. No music. Voice: no em dashes, dry and direct; opportunity, reveal, watchlist, take it to your agent.

One flag: you said Bricolage; on 2026-09-19 you moved the site to Schibsted Grotesk because Bricolage had become the AI-landing-page default, and the D shell's own h1 and modal titles use Schibsted since REE-1097. Using Bricolage as you said; say the word to swap (one token in `:root`).

Small call I made (vetoable): the reveal button keeps the app's real label "Unlock review" (no credit count), while the headline uses your word "reveal".

## Claude: storyboard (Step 5)

Brief and storyboard are in `motion-video/brief.md` and `motion-video/storyboard.md`.

| # | scene id | seconds | on-screen words | words | visual | camera | transition in |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | hook | 0.0 to 4.5 | "Your competitors' unhappy customers / are already telling you **who to call**." | 11 | Headline alone on the canvas, two lines, "who to call" turns pink | slow push 1.0 to 1.04 | cut (film start) |
| 2 | feed | 4.5 to 10.5 | "Every complaint becomes an **opportunity**." Card: Opportunities feed, 3 rows: "Director at Logistics company / Signing workflows delay contracts / Docusign / Severe / Locked", a Salesforce row (Moderate), a Jira row (Mild) | 5 + 22 | App window card with the top nav (Reechee, Opportunities, Watchlist, Reports), rows land one by one, cursor glides to row 1 and clicks | 1.0 to 1.04 drift, then hero crop 1.25 on row 1 as the cursor clicks | push 0.6 |
| 3 | reveal | 10.5 to 16.5 | "**Reveal** who wrote it." Card: "Signing workflows delay contracts", "Logistics company" becomes "Halvorsen Logistics", "Director of Revenue Operations", name un-blurs to "Priya Natarajan", quote "Signing workflows keep delaying customer contracts.", Severe, Locked becomes Unlocked, "View original review", button "Unlock review" | 4 + 24 | Detail page card: review card left, unlock panel right. Cursor clicks Unlock review; the name and company un-blur, Unlocked badge pops (the one pop), the review link fades in | lands at 1.12 on the card, hero crop 1.28 on Unlock review at the click, then glides to the identity at 1.22 | zoom 0.6 (signature) |
| 4 | agent | 16.5 to 21.5 | "Your agent gets the **evidence**." Card: modal "Take it to your agent", prompt lines fill in (Halvorsen Logistics, Priya Natarajan, Director of Revenue Operations, the complaint, G2 review), button "Copy prompt" becomes "Copied" | 5 + 19 | Modal card floating over a dimmed, blurred detail page; prompt fills line by line; cursor clicks Copy prompt | push 1.0 to 1.08 on the prompt while it fills, hero crop 1.25 on Copy prompt at the click | push 0.6 |
| 5 | close | 21.5 to 25.0 | Logo, "Hear the complaint. Make the call.", "reechee.io" | 7 | Logo, promise, URL pill, centered | static, 1.0 to 1.02 | fade 0.5 |

Signature move: the push-through from the clicked Halvorsen row in the feed into its detail page (scene 2 into 3), the one Z-axis move in the film. Words: 97 on screen in 25s, 3.9 per second against a budget of 4 (April: 117 in 28s).

Yes, or what changes?

## Noam (storyboard approval)

Yes, go. Keep the total under 110 words.

## Claude

Approved as is; the ceiling is 110 words and the plan sits at 97. Building through the first product scene (hook and feed) for the checkpoint.

## Claude: scene-one checkpoint (Step 6)

Unattended run, so paths first instead of opening them:
- Contact sheet: `motion-video/out/checkpoint-sheet.png` (hook and feed, 0 to 10.5s)
- Clip: `motion-video/out/scene-check.mp4` (4.0 to 10.5s: the push from the hook into the feed, the rows landing, the cursor click on the Halvorsen row and the hero crop with rows 2 and 3 dimming)

What I checked: the sheet and frames sampled from the clip (no empty or doubled frames, the click lands on the row, the crop settles and holds 2s), copy check (hook 11 words, feed 35), and `--jumps` on the clip: no frame change above 0.06. I have not watched the clip play; rhythm is your call.

Is this the feel? Yes, or what is off (faster, calmer, bigger type, different move)?

## Noam (checkpoint reply)

That is the feel. Keep going. If anything, hold the headline a touch longer before the card lands.

## Claude

Feel approved. One change, mapped to timing only: in the feed scene the window now lands 0.4s later (starts at 0.5s instead of 0.1s), so the headline sits alone for about half a second first; the rows and cursor shift with it and the click stays at the same moment. Building the reveal, agent and close scenes now.

## Claude: delivery (Step 7)

The film is done: `motion-video/out/reechee-d-launch.mp4`, 25.0s, 1920x1080, silent, 5.3 MB. Poster still: `motion-video/out/poster.png` (the revealed review). Last contact sheet: `motion-video/out/sheet-final.png`.

Checks: copy check 103 words in 25s (4.12 per second, one warning above the 4.0 target, under your 110), `--jumps` shows no frame change above 0.06 anywhere, every click verified on a still. I have not watched it play; the motion was judged from sheets, stills and the jump measure.

Three things I assumed or left out:
- Bricolage for headlines as you said (the site and the D shell use Schibsted; one token to swap).
- To stay in budget the reveal card has no review quote and the prompt no source line.
- The bundled runtime had a bug that silently disabled camera targets; fixed in this folder's `motion.js`.

How edits work from here: change one word, number, timing or scene; the rest stays.

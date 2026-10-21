# Storyboard: Reechee D app launch (25s, 16:9, silent)

Grid: 0.5s (no music). Total words on screen: target under 100 (4 per second of runtime). April's film carried 117 in 28s.

Grammar choices (from the taste round)
- Entrances: 0.6s outQuint for text, 0.8s springSoft for cards; staggers 0.06s per word, 0.15s per row
- Holds: at least 1.4s after the last word, close 2.5s
- Transitions: push 0.6s between scenes; one zoom (Z-axis push-through) feed to reveal; fade into the close
- Camera: every product scene drifts 1.0 to 1.05; hero crop 1.3 to 1.6 on the control being used (the grammar's 1.2 still showed the whole card at these sizes), inOutQuint 0.8s
- Type: Bricolage Grotesque 700 headlines at 96 to 104px, one pink word each; Inter in the product at real proportions
- Canvas: warm off-white #FCFAF8 with a pink ambient blob at 3% drifting 40px per scene
- Signature move: the push-through, in the feed scene: the camera crops onto the Halvorsen row the cursor clicks, then flies through it and lands on that opportunity's detail page

| # | scene id | seconds | on-screen words | words | visual | camera | transition in |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | hook | 0.0 to 4.5 | "Your competitors' unhappy customers / are already telling you **who to call**." | 11 | Headline alone on the canvas, two lines, "who to call" turns pink | slow push 1.0 to 1.04 | cut (film start) |
| 2 | feed | 4.5 to 10.5 | "Every complaint becomes an **opportunity**." Card: Opportunities feed, 3 rows: "Director at Logistics company / Signing workflows delay contracts / Review of Docusign / Severe / Locked", "VP at Transportation company / Broken forecasts" (Salesforce, Moderate), "IT manager at Manufacturing company / Slow boards" (Jira, Mild) | 5 + 30 | App window card with the top nav (Reechee, Opportunities, Watchlist, Reports), rows land one by one, cursor glides to row 1 and clicks | 1.0 to 1.03 drift, hero crop 1.6 on row 1 at the click (rows 2 and 3 dim), then accelerates to 2.7 into the cut | push 0.6 |
| 3 | reveal | 10.5 to 16.5 | "**Reveal** who wrote it." Card: "Signing workflows delay contracts", "Logistics company" becomes "Halvorsen Logistics", "Director of Revenue Operations", name un-blurs to "Priya Natarajan", Severe, Locked becomes Unlocked, "View original review", button "Unlock review" | 4 + 22 | Detail page card: review card left, unlock panel right. Cursor clicks Unlock review; the name and company un-blur, Unlocked badge pops (the one pop), the review link fades in | lands at 1.0, hero crop 1.3 on Unlock review at the click, then glides to the review card at 1.45 | zoom 0.6 (signature) |
| 4 | agent | 16.5 to 21.5 | "Your agent gets the **evidence**." Card: modal "Take it to your agent", prompt lines fill in ("Company: Halvorsen Logistics", "Reviewer: Priya Natarajan", "Complaint: signing workflows delay contracts"), button "Copy prompt" becomes "Copied" | 5 + 19 | Modal card floating over a dimmed, blurred detail page; prompt fills line by line; cursor clicks Copy prompt | push 1.0 to 1.07 on the prompt while it fills, hero crop 1.3 on Copy prompt at the click | push 0.6 |
| 5 | close | 21.5 to 25.0 | Logo, "Hear the complaint. Make the call.", "reechee.io" | 7 | Logo, promise, URL pill, centered | static, 1.0 to 1.02 | fade 0.5 |

Signature move (one): the push-through from the clicked feed row into its detail page (scene 2 to 3).

Camera plan (as built, scene-local): feed crop on row 1 2.5 to 3.5s (click 3.2), flight into the lens 5.0 to 6.0; reveal crop on Unlock review 1.2 to 2.0 (click 2.1), glide to the review card 2.6 to 3.4; agent push on the prompt 0 to 2.1, crop on Copy prompt 2.1 to 2.9 (click 3.0).

Word count by scene (headline / card), as built: hook 11 / 0, feed 5 / 30, reveal 4 / 22, agent 5 / 19, close 7 / 0. Total 103 in 25s = 4.12 per second (check-copy warns above 4.0; Noam's ceiling is 110). Five of those words are swap states never on screen together (Locked/Unlocked, Logistics company/Halvorsen Logistics, Copy prompt/Copied), so at most 98 are ever visible.

Changes after approval: the reveal card lost its review quote and the agent prompt its source line (copy budget); after the checkpoint the feed window lands 0.4s later so the headline reads alone first.

Assumptions: see brief.md "Assumptions made".

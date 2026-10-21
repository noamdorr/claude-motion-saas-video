---
name: lucky
description: I-feel-lucky mode for SaaS launch videos. Run inside a product's repo and get a finished MP4 with zero questions. It reads the repo and the live site for the product, brand colors, fonts, logo, screens, voice and sample data, writes the brief and storyboard with its assumptions listed, then builds and renders the video. Use whenever someone asks for a launch video, a 30 second demo video of this app, a product video, a feature announcement video, a video of the new dashboard, a Claude Motion style video, or an explainer for the homepage. Also use when they never say video but describe a launch clip, reel, teaser, demo, walkthrough animation or motion piece for their SaaS or app. Asks nothing and decides everything; corrections come after, with the edit skill. If the user says grill me, interview me or wants to be asked first, use the grill skill instead.
---

# Lucky: a launch video with zero questions

You are making a 20 to 30 second launch film for the product whose repo you are standing in, and you
will not ask the user anything. Most founders cannot answer "what is your one idea" or "what is your
radius token" on demand, but their repo and their homepage already answer both. So you gather,
decide, write down what you decided, and hand over a finished MP4. The user's job starts after the
film exists: vetoing an assumption takes seconds, answering an interview takes twenty minutes.

## 0. Say one line, then go

Your first message in chat is exactly this, and you do not wait for a reply (write it even when
no one is reading, for example in a subagent run; it is the record that the mode was chosen):

> Lucky mode: no questions, I will gather everything from the repo and the site. Say 'grill me' any time for the guided version.

If the user does say "grill me" or "interview me" later, stop and hand over to the `grill` skill with
whatever you have gathered so far, so their answers start from your notes instead of a blank page.

## Where the engine lives

The `build` skill is this plugin's engine. It sits next to this skill: `../build/` from this
file's directory (in Claude Code, `${CLAUDE_PLUGIN_ROOT}/skills/build/`). Its scaffold script is
`../build/scripts/scaffold.mjs`, its templates are in `../build/assets/`, and its references are
in `../build/references/`. Invoke it as the `build` skill when you hand off, or read
`../build/SKILL.md` directly if the Skill tool is not available.

## 1. Gather (minutes, not an hour)

The full source list, with file patterns, lives in `references/gathering.md`. Read it now. The order
there is the order of trust: what the founder already wrote and shipped beats what you infer.

Run the sweep in parallel. Where the Agent tool exists, launch two or three read-only Explore
subagents in one message, for example: one for docs, voice and positioning; one for design tokens,
fonts and logos; one for screens, sample data and earlier videos. Ask each to return facts and file
paths, not file dumps, so your context stays free for the writing. Fetch the marketing site
yourself while they run. Without subagents, do the same reads inline.

Stop as soon as the brief has all of these:

- product name and the one-liner as the site says it
- three proofs (capabilities you can show)
- canvas, ink and accent colors as exact hex
- display font and UI font
- a logo file
- three or more screens, or the decision to rebuild screens from component source
- the CTA URL

That list is the finish line because it is what `build` cannot invent. Everything else has a
default. Gathering past this point rarely changes the film and costs the user minutes of waiting.

### Stay read-only against the product

You are a guest in someone's production codebase.

- Read files, run the app locally, take screenshots. Do not edit product code or config.
- Never log into a production account. The only exception is a test-login recipe the repo itself
  documents for agents, used exactly as written. A real login is a real user's data in a video.
- Never click anything that spends money, sends a message, invites someone or changes data, even
  in a local app. Screenshot the state before the click and animate the click later in HTML.
- Never commit to the user's repo, except the new video folder at the end.

## 2. Write the brief

Scaffold the video folder first (the `build` skill's `scripts/scaffold.mjs`, default target
`motion-video/` in the repo root), then fill `motion-video/brief.md` from the `build` skill's
`assets/brief-template.md`. Keep every heading in the template; `build` reads them.

### Good enough

A brief is good enough when a stranger could build the film from it without opening the repo. That
means concrete values (hex codes, font names, file paths, real feature names), not descriptions
("brand blue", "the main font"). It does not mean every field is long. One line per field.

### Assume, do not skip

When a field has no source, fill it with a default and add a line to "Assumptions made". An empty
field forces `build` to guess silently; an assumed field is a guess the user can see and veto.
Defaults when nothing is found:

- Aspect 16:9, length 25 seconds, destination LinkedIn feed, plays with sound off.
- Canvas off-white (`#F7F6F2` or a light tint of the brand), ink from the product's text color.
- UI font Inter. Display font, in order: the brand's declared display face (brand docs, the
  wordmark, an earlier approved film), then the site's heading font, then Bricolage Grotesque.
  When the live site's headings disagree with the brand face, the brand face still wins; log it.
- The close: the founder's approved tagline if one exists, at its own length; otherwise a promise
  you write in six words or fewer.
- The one idea: the homepage hero headline.
- Music: none.

Skip only what would be a claim you cannot back: customer counts, testimonials, logos of customers,
revenue, awards, price or plan wording. If the site shows them, they still stay out unless the repo
says they are approved for use. A wrong claim in a launch video is the one mistake the founder
cannot fix by editing a word.

### The one idea

Use the homepage hero line. The founder already wrote it, tested it on real visitors and approved
it, which is more than you can say for any line you invent. Shorten it if it is over 12 words, keep
its verbs. Only replace it when the hero is vague ("The future of work") and a feature block or the
README states the outcome more concretely; record that swap as an assumption.

### The three proofs

Pick three capabilities that make the idea believable, in this order of preference:

1. The ones the homepage's feature blocks lead with. Same reason as the hero: already approved.
2. Of those, ones with a visible moment you can animate: a count landing, a status flipping, a row
   arriving, a click that reveals something. A proof without a moment becomes a static slide.
3. Ones you have a screen for, or the component source to rebuild.

Drop settings, integrations lists, onboarding and pricing screens. They are true and they are dull.

### Voice and words

Copy the repo's voice rules into the brief verbatim (no em dashes, banned words, product terms).
Use the product's own nouns for its objects, because the founder will notice "lead" where the UI
says "opportunity" before they notice anything else. The `build` copy rules apply on top.

## 3. Write the storyboard

Fill `motion-video/storyboard.md` from `assets/storyboard-template.md`. Read the `build` skill's
`references/motion-grammar.md` first; it holds the scene grammar and you should not reinvent it.

For the default 25 seconds, the five beats map cleanly:

- Hook, 0 to 4s: the pain or moment the audience recognizes. No logo, no product name.
- Shift, 4 to 8s: the product arrives as the answer, its first screen, named in the headline.
- Proof 1 and Proof 2, 8 to 20s: one capability each, one card, one interaction, camera push.
- Proof 3 folds into Proof 2's scene or becomes a short third beat if the length allows.
- Close, 20 to 25s: logo, the promise in six words or fewer, the CTA URL, held two seconds.

Word budget: about four words per second of runtime overall, under 12 words per headline, 15 to 30
words per card. For 25 seconds that is roughly 100 words in total. Count them per scene in the
storyboard's word-count line; going over is the most common reason a film feels like slides.

Pick exactly one signature move and say where it lands (Shift or Proof 1). Write the camera plan
per proof scene: what the push-in targets, when the hero crop happens.

Write the hook last. It is the hardest line and it is easier once you know what the proofs are.
Lead with what the audience already feels, built from the problem the README or site describes.

The storyboard's last line lists assumptions, not open questions. Repeat only the storyboard-level
ones there (hook wording, which proof was dropped, the signature move) and keep the brief's list
as the master.

## 4. Copy the assets

Put every file the film uses inside the video folder, so the render works after the plugin updates
and the folder can be committed on its own. Logos in `motion-video/assets/`, screens in
`motion-video/assets/screens/`, named by what they show. The naming rules are in
`references/gathering.md`.

## 5. Hand off to build

Invoke the `build` skill and follow its pipeline from step 2 onward (the folder is already
scaffolded). It owns the runtime API, the copy check, the contact-sheet review and the render. Do
not shortcut its review loop: in lucky mode nobody else looks before the user does, so the two or
three sheet-and-fix rounds are your only quality gate.

Skip `build`'s user checkpoint (step 6). Lucky mode delivers the finished film; the user's
checkpoint is the delivery.

## 6. Deliver

Open the MP4 for the user (`open motion-video/out/<name>.mp4` on macOS) rather than only printing
the path. In an unattended run (a subagent, a scheduled job) skip the open and put the paths and the
sheet first in your report. Then reply with:

- the MP4 path and the poster still path
- three lines of what you assumed, the three that most change the film (usually the one idea, the
  length or aspect, and any screen you rebuilt or font you substituted)
- one line: "Change anything with the `edit` skill (say what, in plain words), or say 'grill me'
  for the guided version that starts from this brief."

Commit only the `motion-video/` folder, on a branch if the repo is on its default branch, with a
message that says it was made in lucky mode. The template's `.gitignore` keeps `out/` out of
the commit: the MP4 is reproducible from the source, and a video file in a product repo is a
choice the owner makes, not you. If the repo has uncommitted changes of its own, leave
them alone and commit only your folder's paths.

# Gathering: where the brief comes from

Work through these sources in order. The order is the order of trust: words and values the founder
already wrote, shipped or approved beat anything you infer. When two sources disagree, the earlier
one wins and the disagreement becomes a line in "Assumptions made".

Time-box the whole sweep to a few minutes. Run sources 1, 3, 4, 5a, 6 and 7 as parallel read-only
subagents where you can, and fetch the site (source 2) yourself while they run. Each subagent
returns facts and paths, not file contents. Stop when the brief's finish line in `SKILL.md` is met.

Search from the repo root, skip `node_modules/`, `.git/`, build output (`dist/`, `.next/`, `out/`,
`build/`) and lockfiles. In a monorepo, find the app and the marketing site packages first
(`apps/*`, `packages/*`, `web/`, `www/`, `site/`, `marketing/`) and search those.

## 1. Repo docs

Look for:

- `README*`, `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `PRODUCT.md`, `POSITIONING*`, `MESSAGING*`
- `docs/brand*`, `docs/**/positioning*`, `wiki/brand*`, `wiki/**/icp*`, `wiki/**/decision-*`
- `CHANGELOG*`, `RELEASES*`, `docs/releases/` (the newest entry is often the feature to announce)
- `package.json` fields `name`, `description`, `homepage`; `Cargo.toml`, `pyproject.toml`,
  `Info.plist` (`CFBundleDisplayName`) for non-JS products

Extract:

- Product name as users see it (not the package name, which is often lowercase or scoped).
- The one-liner and two plain sentences on what it does.
- Audience: who buys it, in their own job titles.
- App surface: web app, Mac app, mobile, API, CLI.
- Voice rules. Search for "em dash", "em-dash", "tone", "voice", "never say", "banned", "tagline",
  "copy rules". Copy any you find verbatim into the brief's Voice section.
- Product nouns: what the UI calls its main objects. Grep the docs for the words that recur.
- What must not be claimed. Search for "testimonial", "customers", "approval", "do not claim",
  "legal". A note that says counts or logos need approval means they stay out.

If the repo's own `CLAUDE.md` points at a newer direction doc (a pivot, a rename, a removed
feature), read that doc. A launch video for a feature that was just removed is worse than no video.

## 2. Marketing site

Find the URL, in this order:

- `package.json` `homepage`; links near the top of the README
- env files and examples: `NEXT_PUBLIC_SITE_URL`, `SITE_URL`, `PUBLIC_SITE_URL`, `APP_URL`,
  `VITE_SITE_URL` in `.env.example`, `.env.sample`, `.env.local.example` (never print real secrets
  from `.env`; read only the URL keys)
- `site:` in `astro.config.*`, `metadataBase` or `siteUrl` in Next config or `app/layout.*`,
  `url` in `docusaurus.config.*`, `baseURL` in Hugo config
- `CNAME`, `public/CNAME`, `vercel.json`, `netlify.toml`, `railway.json` domains
- `sitemap*.xml`, `robots.txt` (`Sitemap:` line)

If the site's source is in the repo, read the homepage component directly; it is faster and exact.
Otherwise fetch the homepage text with the web fetch tool. Extract:

- Hero headline: this is the default one idea, the pitch the founder already approved.
- Subhead: often the best source for "what it actually does".
- The three feature blocks, in order: these are the default three proofs.
- The primary CTA label and its URL (signup or download link). The close shows the bare domain or
  the shortest path to that URL.
- Anything that looks like a claim (counts, logos, quotes). Note it, then leave it out per the
  brief rules.

If a browser tool is available, screenshot the hero at 1920 wide. It shows the real type scale and
color balance, which is the fastest check on the tokens you read in source 3. Read-only: do not
accept cookie banners beyond the privacy-preserving choice, do not submit forms.

## 3. Design tokens

Look for:

- `tailwind.config.*` (`theme.extend.colors`, `fontFamily`, `borderRadius`, `boxShadow`)
- `globals.css`, `global.css`, `app.css`, `styles/*.css`: the `:root` and `.dark` custom
  properties, and `@theme` blocks in Tailwind v4
- theme files: `theme.ts`, `tokens.json`, `design-tokens*`, `src/styles/theme*`
- `design/`, `DESIGN.md`, `BRIEF.md`, `brand/`, `brand_assets/`, `.design-sync/`
- fonts: Google Fonts `<link>` tags in layouts, `next/font` imports (`import { Inter } from
  "next/font/google"`), `@fontsource/*` in `package.json`, `@font-face` rules, `public/fonts/`
- the main card component (`Card.tsx`, `card.tsx`, `components/ui/card*`): its radius, border and
  shadow classes

Extract exact values:

- Canvas (page background), ink (body text), accent (primary button or link), muted text.
- Status colors if the product has them (success, warning, danger, or its own severity scale).
- Display font (headings) and UI font (body), with their weights.
- Card radius and shadow. Resolve CSS variables and Tailwind names to hex and px; `bg-primary` is
  not a value `build` can use.

Prefer light-mode tokens unless the product is dark-first. If tokens use HSL or OKLCH, convert to
hex and keep the original in a comment.

## 4. Logo and marks

Look for:

- `public/logo*.svg`, `public/logo*.png`, `public/brand/`, `brand*/`, `assets/brand/`,
  `src/assets/logo*`, `static/img/logo*`
- `favicon.svg`, `icon.svg`, `app/icon.*`, `apple-touch-icon*.png`, `logo-mark*`, `wordmark*`
- for Mac apps: `*.xcassets/AppIcon.appiconset/`, the largest PNG there

Extract:

- The wordmark (for the close) and the mark (for small placements), SVG preferred.
- Native pixel size of any PNG; it must not be scaled above 1x, so note it in the brief.
- A dark-canvas variant (`logo-white*`, `logo-dark*`, `*-inverse*`). If none exists and the logo is
  single-color, note that `build` can invert it. A multi-color mark with no dark variant means the
  close stays on a light canvas.

## 5. Screens

Take the first option that yields three or more usable screens.

### a. Existing screenshots

- `screenshots/`, `docs/**/*.png`, `docs/**/*.jpg`, `assets/screens*`, `marketing/`
- `public/og*.png|jpg`, `public/images/product*`, `public/screens*`, homepage hero images
- `design-handoff/`, `design-canvases/`, `*.dc.html`, Figma exports, `mockups/`
- Product Hunt or launch folders: `product-hunt/`, `ph-*`, `launch/`, `gallery/`

Prefer recent files (check modification dates) and ones that match the current UI tokens.

### b. Run the app locally

If the repo has a launch config (`.claude/launch.json`, `.vscode/launch.json`) or a dev script
(`dev`, `start`, `preview` in `package.json`), start it on its local port and screenshot the three
key routes headless. Playwright is installed in the video folder after scaffold, so run a short
headless script from `motion-video/`. Pick routes from the router (`app/**/page.tsx`,
`pages/`, `src/routes/`), favouring the ones that show each proof.

Most local apps need a login and seed data. Use them only if the repo documents a test-login
recipe or a seed script for agents, and only against the local database. If the app needs
production credentials or real customer data to show anything, stop here and go to option d.

### c. Mac and desktop apps

- Look in the app's README, `scripts/` and build schemes for demo or fixture flags: `--demo`,
  `--design-preview`, `--fixtures`, `--capture-dir`, `DEMO_MODE`, a `ph-demo/` or `preview/`
  folder. These exist for exactly this job and give clean, fictional state.
- If the app is installed and running, capture its window with `screencapture -l <window id>` or
  `screencapture -R x,y,w,h` (macOS asks the user for screen recording permission the first time).
- Do not drive the real app through flows that send, sync or purchase.

### d. Rebuild from component source

When no screens are reachable, read the components that render each proof (the page, the list row,
the status badge, the modal) and record in the brief that `build` will recreate them as HTML cards
from source. The `build` skill's `references/ui-cards.md` explains how. This is a fine outcome and
often a better one, because the video animates HTML cards anyway and screenshots are only
reference. Add it to "Assumptions made".

## 6. Sample universe

Look for: `sample-data/`, `fixtures/`, `seed*`, `supabase/seed.sql`, `prisma/seed.*`, `demo/`,
`mocks/`, `__fixtures__/`, `public/demo-logos/`, `public/sample*`, `public/avatars/`, `portraits/`,
storybook stories with mock data.

Extract the fictional companies, people, logos and portraits the product already shows, and use
them in every card. If the marketing site has its own sample set, it wins over test fixtures,
because it is the one the public has seen. Never use names from TV shows or films. If nothing
exists, invent neutral names that could be real companies and log that as an assumption.

## 7. Existing videos and retros

Look for: `video/`, `remotion*/`, `hyperframes*/`, `motion*/`, `*.mp4` and `*.webm` in docs or
public, `*retro*.md`, `HANDOFF.md`, `feedback*.md`, `taste*.md`, `memory/` notes mentioning video.

These often hold the founder's actual taste: word counts that were approved or rejected, motion they
liked, fonts they banned, a film they called the reference. Treat them as strong signals, stronger
than the defaults. Copy the specific rule into the brief ("rejected cut had 215 words, approved
had 117") rather than a summary.

## 8. Issue trackers

Optional. Read issue docs only if they are files in the repo. Do not call Linear, Jira, GitHub
Issues or any other external tracker: it is slow, needs auth, and the brief does not depend on it.

## Writing "Assumptions made"

Every default you used and every guess you made gets one line, so the founder can veto the list in
seconds. One line each, shaped as what you chose, then why or where from:

- `Length 25s, 16:9, sound off: defaults, no destination found.`
- `One idea = hero line "..." shortened from 16 to 10 words.`
- `Proof 3 (exports) dropped: no screen and no visible moment.`
- `Display font Bricolage Grotesque: site heading font not found.`
- `Screens rebuilt from components/feed/Row.tsx: app needs a login.`

Put the three with the biggest effect on the film first; those are the three lines you report on
delivery. Do not list things you read directly from a source; those are facts, not assumptions.

## Brief acceptance checklist

Before writing the storyboard, check the brief:

- Name, one-liner, site URL and CTA URL are filled with real values.
- The one idea is one sentence under 12 words.
- Three proofs, each with a screen path or a component path, and a visible moment.
- Canvas, ink and accent are hex. Both fonts are named and loadable (Google Fonts name or file).
- Logo path exists; dark variant found or noted.
- Voice rules copied verbatim; product nouns listed.
- "Must not appear" lists any claims you saw and left out.
- Every empty-source field has a matching line in "Assumptions made".

## Copying assets into the video folder

Copy, do not link: the video must render from its own folder after the plugin or the product
changes.

- Logos to `motion-video/assets/`: `logo.svg`, `logo-dark.svg`, `mark.svg`.
- Screens to `motion-video/assets/screens/`, named by what they show, lowercase with hyphens:
  `feed-one-severe.png`, `menu-bar-popover-low-balance.png`, `prompt-copy-modal.png`. Not
  `Screenshot 2026-10-21 at 09.14.png`. The name is the idea of the screen, which is the first
  thing `build` needs when it turns the screen into a card.
- Sample logos and portraits to `motion-video/assets/sample/`.
- Self-hosted fonts to `motion-video/assets/fonts/`, only when the product ships its own files.

List every copied file with its source path in the brief's Assets section.
